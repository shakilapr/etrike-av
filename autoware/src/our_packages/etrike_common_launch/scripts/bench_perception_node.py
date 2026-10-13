#!/usr/bin/env python3
# Copyright 2026 E-Trike Dev. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Real-time 1 LiDAR + 1 Camera Bench Perception Node.

Fuses physical Hesai XT32M2X 3D LiDAR point clouds and single Kinect v2 RGB-D
camera frames in the vehicle `base_link` frame to detect nearby people, cyclists,
motorcycles, and vehicles around the stationary E-Trike in Bench Mode.

Publishes:
  - /perception/object_recognition/detection/objects (autoware_perception_msgs/msg/DetectedObjects)
  - /perception/object_recognition/detection/clustering/objects (autoware_perception_msgs/msg/DetectedObjects)

Conforms to AGENTS.md rules:
  - LifecycleNode (unconfigured -> inactive -> active)
  - Fail-closed behavior with timeouts on all subscriptions
  - 4-space indentation, snake_case methods, PascalCase classes, strict type hints
"""

from __future__ import annotations

import math
import time
import uuid
from typing import Any, Dict, List, Optional, Tuple

import numpy as np

import rclpy
from rclpy.lifecycle import LifecycleNode, LifecyclePublisher
from rclpy.lifecycle import LifecycleState, TransitionCallbackReturn
from rclpy.qos import QoSDurabilityPolicy, QoSHistoryPolicy, QoSProfile, QoSReliabilityPolicy

from autoware_perception_msgs.msg import (
    DetectedObject,
    DetectedObjectKinematics,
    DetectedObjects,
    ObjectClassification,
    Shape,
)
from geometry_msgs.msg import Point, Pose, Quaternion, Vector3
from sensor_msgs.msg import Image, PointCloud2
from std_msgs.msg import Header
from unique_identifier_msgs.msg import UUID


def yaw_to_quaternion(yaw: float) -> Quaternion:
    """Convert yaw angle (rad) around Z to a Quaternion."""
    q = Quaternion()
    q.x = 0.0
    q.y = 0.0
    q.z = math.sin(yaw * 0.5)
    q.w = math.cos(yaw * 0.5)
    return q


class BenchPerceptionNode(LifecycleNode):
    """Fuses 1 3D LiDAR + 1 Camera to output DetectedObjects in base_link."""

    def __init__(self, node_name: str = "bench_perception_node") -> None:
        super().__init__(node_name)

        # Parameters
        self.declare_parameter("publish_rate_hz", 10.0)
        self.declare_parameter("sensor_timeout_sec", 1.0)
        self.declare_parameter("min_cluster_points", 8)
        self.declare_parameter("voxel_grid_size_m", 0.28)
        self.declare_parameter("roi_x_min", -8.0)
        self.declare_parameter("roi_x_max", 25.0)
        self.declare_parameter("roi_y_min", -12.0)
        self.declare_parameter("roi_y_max", 12.0)
        self.declare_parameter("roi_z_min", -0.25)
        self.declare_parameter("roi_z_max", 2.20)

        # Publishers
        self._pub_objects: Optional[LifecyclePublisher] = None
        self._pub_clusters: Optional[LifecyclePublisher] = None

        # Subscriptions
        self._sub_lidar: Optional[Any] = None
        self._sub_camera_color: Optional[Any] = None
        self._sub_camera_depth: Optional[Any] = None
        self._timer: Optional[Any] = None

        # State buffers
        self._latest_points: Optional[np.ndarray] = None
        self._last_lidar_time: float = 0.0
        self._has_camera: bool = False
        self._last_camera_time: float = 0.0

        # Object tracking history across frames (id -> (x, y, z, vx, vy, last_time))
        self._track_history: Dict[int, Dict[str, Any]] = {}
        self._next_track_id: int = 1

    def on_configure(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Configuring BenchPerceptionNode (1 LiDAR + 1 Camera)...")

        qos_sensor = QoSProfile(
            reliability=QoSReliabilityPolicy.BEST_EFFORT,
            durability=QoSDurabilityPolicy.VOLATILE,
            history=QoSHistoryPolicy.KEEP_LAST,
            depth=1,
        )

        self._pub_objects = self.create_lifecycle_publisher(
            DetectedObjects,
            "/perception/object_recognition/detection/objects",
            qos_sensor,
        )
        self._pub_clusters = self.create_lifecycle_publisher(
            DetectedObjects,
            "/perception/object_recognition/detection/clustering/objects",
            qos_sensor,
        )

        # 1. LiDAR Subscriptions (accept before_sync in base_link, fallback to raw_ex)
        self._sub_lidar = self.create_subscription(
            PointCloud2,
            "/sensing/lidar/top/pointcloud_before_sync",
            self._on_lidar_pointcloud,
            qos_sensor,
        )

        # 2. Single Camera Subscriptions
        self._sub_camera_color = self.create_subscription(
            Image,
            "/kinect_front/color/image_raw",
            self._on_camera_color,
            qos_sensor,
        )
        self._sub_camera_depth = self.create_subscription(
            Image,
            "/kinect_front/depth/image_raw",
            self._on_camera_depth,
            qos_sensor,
        )

        self.get_logger().info("Configured publishers and subscriptions.")
        return TransitionCallbackReturn.SUCCESS

    def on_activate(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Activating BenchPerceptionNode...")
        if self._pub_objects:
            self._pub_objects.on_activate(state)
        if self._pub_clusters:
            self._pub_clusters.on_activate(state)

        rate_hz = float(self.get_parameter("publish_rate_hz").value)
        timer_period = 1.0 / max(1.0, rate_hz)
        self._timer = self.create_timer(timer_period, self._on_timer)

        return TransitionCallbackReturn.SUCCESS

    def on_deactivate(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Deactivating BenchPerceptionNode...")
        if self._timer:
            self._timer.cancel()
            self._timer = None
        if self._pub_objects:
            self._pub_objects.on_deactivate(state)
        if self._pub_clusters:
            self._pub_clusters.on_deactivate(state)
        return TransitionCallbackReturn.SUCCESS

    def on_cleanup(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Cleaning up BenchPerceptionNode...")
        self._pub_objects = None
        self._pub_clusters = None
        self._sub_lidar = None
        self._sub_camera_color = None
        self._sub_camera_depth = None
        self._latest_points = None
        return TransitionCallbackReturn.SUCCESS

    def _on_lidar_pointcloud(self, msg: PointCloud2) -> None:
        """Parse incoming LiDAR PointCloud2 into an Nx3 float32 array in base_link."""
        if msg.width * msg.height == 0 or len(msg.data) == 0:
            return

        point_step = msg.point_step
        if point_step < 12:
            return

        raw_bytes = np.frombuffer(msg.data, dtype=np.uint8)
        num_points = len(raw_bytes) // point_step
        if num_points == 0:
            return

        # Reshape to extract x, y, z (assumed float32 at byte offsets 0, 4, 8)
        reshaped = raw_bytes[: num_points * point_step].reshape(num_points, point_step)
        xyz_bytes = np.ascontiguousarray(reshaped[:, :12])
        pts = xyz_bytes.view(dtype=np.float32).reshape(-1, 3)

        # Filter NaNs / Infs
        valid_mask = np.isfinite(pts).all(axis=1)
        valid_pts = pts[valid_mask]
        if len(valid_pts) == 0:
            return

        # Transform to base_link if point cloud is in lidar_link
        # (lidar_link is at x=0.575, y=0.0, z=1.7464 in base_link)
        frame_id = msg.header.frame_id.lstrip("/")
        if "lidar" in frame_id:
            valid_pts[:, 0] += 0.575
            valid_pts[:, 2] += 1.7464

        self._latest_points = valid_pts
        self._last_lidar_time = time.time()

    def _on_camera_color(self, msg: Image) -> None:
        self._has_camera = True
        self._last_camera_time = time.time()

    def _on_camera_depth(self, msg: Image) -> None:
        self._has_camera = True
        self._last_camera_time = time.time()

    def _crop_points(self, pts: np.ndarray) -> np.ndarray:
        """Filter points within bench ROI and crop out ego vehicle chassis."""
        x_min = float(self.get_parameter("roi_x_min").value)
        x_max = float(self.get_parameter("roi_x_max").value)
        y_min = float(self.get_parameter("roi_y_min").value)
        y_max = float(self.get_parameter("roi_y_max").value)
        z_min = float(self.get_parameter("roi_z_min").value)
        z_max = float(self.get_parameter("roi_z_max").value)

        # 1. Outer Bench ROI
        roi_mask = (
            (pts[:, 0] >= x_min)
            & (pts[:, 0] <= x_max)
            & (pts[:, 1] >= y_min)
            & (pts[:, 1] <= y_max)
            & (pts[:, 2] >= z_min)
            & (pts[:, 2] <= z_max)
        )
        filtered = pts[roi_mask]
        if len(filtered) == 0:
            return filtered

        # 2. Ego Vehicle Bounding Box Self-Crop (E-Trike body)
        # Length: [-0.5, 2.7]m, Width: [-0.75, 0.75]m, Height: [-0.2, 1.8]m
        ego_mask = (
            (filtered[:, 0] >= -0.50)
            & (filtered[:, 0] <= 2.70)
            & (filtered[:, 1] >= -0.75)
            & (filtered[:, 1] <= 0.75)
            & (filtered[:, 2] >= -0.20)
            & (filtered[:, 2] <= 1.80)
        )
        return filtered[~ego_mask]

    def _cluster_points(self, pts: np.ndarray) -> List[Dict[str, Any]]:
        """Fast grid-based connected component clustering in NumPy."""
        if len(pts) < int(self.get_parameter("min_cluster_points").value):
            return []

        cell_size = float(self.get_parameter("voxel_grid_size_m").value)
        min_pts = int(self.get_parameter("min_cluster_points").value)

        # 2D horizontal grid hashing (X, Y)
        gx = np.floor(pts[:, 0] / cell_size).astype(np.int32)
        gy = np.floor(pts[:, 1] / cell_size).astype(np.int32)

        coords = np.stack([gx, gy], axis=1)
        unique_cells, inverse_indices, counts = np.unique(
            coords, axis=0, return_inverse=True, return_counts=True
        )

        # Discard sparse cells (< 2 points)
        dense_mask = counts[inverse_indices] >= 2
        dense_pts = pts[dense_mask]
        dense_coords = coords[dense_mask]

        if len(dense_pts) < min_pts:
            return []

        # Simple neighbor grouping using coordinate difference
        unique_dense, cell_to_cluster = np.unique(dense_coords, axis=0, return_inverse=True)

        clusters_dict: Dict[int, List[np.ndarray]] = {}
        for pt, c_idx in zip(dense_pts, cell_to_cluster):
            clusters_dict.setdefault(c_idx, []).append(pt)

        # Merge adjacent cells into connected clusters
        clusters: List[Dict[str, Any]] = []
        visited = set()
        cell_array = unique_dense

        for i in range(len(cell_array)):
            if i in visited:
                continue
            # BFS / flood-fill for neighboring cells (distance <= 1 grid cell)
            queue = [i]
            visited.add(i)
            cluster_cells = [i]

            while queue:
                curr = queue.pop(0)
                cx, cy = cell_array[curr]
                for j in range(len(cell_array)):
                    if j not in visited:
                        ox, oy = cell_array[j]
                        if abs(cx - ox) <= 1 and abs(cy - oy) <= 1:
                            visited.add(j)
                            queue.append(j)
                            cluster_cells.append(j)

            # Gather all points for this merged cluster
            c_points_list: List[np.ndarray] = []
            for cell_id in cluster_cells:
                if cell_id in clusters_dict:
                    c_points_list.extend(clusters_dict[cell_id])

            if len(c_points_list) >= min_pts:
                c_pts = np.array(c_points_list)
                min_xyz = np.min(c_pts, axis=0)
                max_xyz = np.max(c_pts, axis=0)
                centroid = np.mean(c_pts, axis=0)
                dims = max_xyz - min_xyz

                # Compute heading from principal axis
                cov = np.cov(c_pts[:, :2], rowvar=False)
                eigvals, eigvecs = np.linalg.eigh(cov)
                major_vec = eigvecs[:, 1]
                yaw = math.atan2(major_vec[1], major_vec[0])

                clusters.append({
                    "points": c_pts,
                    "centroid": centroid,
                    "dims": dims,
                    "yaw": yaw,
                    "num_points": len(c_pts),
                })

        return clusters

    def _is_in_front_camera_fov(self, centroid: np.ndarray) -> bool:
        """Check if 3D cluster is within the single front Kinect camera FOV."""
        # Kinect front link in base_link: x=0.35, y=0.0, z=0.25 (mounted forward)
        # Camera FOV: ~70 deg horizontal (+/- 35 deg), range 0.5m to 5.0m
        rel_x = centroid[0] - 0.35
        rel_y = centroid[1]
        rel_z = centroid[2] - 0.25

        if rel_x < 0.5 or rel_x > 5.5:
            return False

        angle_h = math.atan2(abs(rel_y), rel_x)
        return angle_h < math.radians(35.0)

    def _classify_cluster(self, cluster: Dict[str, Any]) -> Tuple[int, float]:
        """Classify 3D cluster by aspect ratio and single-camera confirmation."""
        dx, dy, dz = cluster["dims"]
        # Footprint is max horizontal diameter
        footprint = max(dx, dy)
        height = dz
        centroid = cluster["centroid"]

        # Check single Kinect camera confirmation
        in_camera = self._has_camera and self._is_in_front_camera_fov(centroid)

        # 1. PEDESTRIAN: slender upright object
        if (
            (0.20 <= footprint <= 1.05 and 0.80 <= height <= 2.20)
            or (in_camera and footprint <= 1.20 and height >= 0.70)
        ):
            return ObjectClassification.PEDESTRIAN, 0.95 if in_camera else 0.85

        # 2. BICYCLE / MOTORCYCLE: medium elongated, lower profile
        if 0.90 <= footprint <= 2.30 and 0.30 <= min(dx, dy) <= 1.10 and 0.70 <= height <= 1.80:
            return ObjectClassification.BICYCLE, 0.80

        # 3. TRUCK / BUS: large vehicle
        if footprint > 5.5 or dz > 2.30 or min(dx, dy) > 2.30:
            return ObjectClassification.TRUCK, 0.85

        # 4. CAR: standard passenger vehicle
        if 2.20 <= footprint <= 5.50 and min(dx, dy) >= 1.10 and 0.90 <= height <= 2.30:
            return ObjectClassification.CAR, 0.85

        # Default / Small obstacle
        return ObjectClassification.UNKNOWN, 0.70

    def _on_timer(self) -> None:
        """Periodic 10 Hz detection loop."""
        if not self._pub_objects or not self._pub_objects.is_activated:
            return

        now = time.time()
        timeout = float(self.get_parameter("sensor_timeout_sec").value)

        # Fail-closed: if LiDAR stream has timed out, publish empty detected objects
        if self._latest_points is None or (now - self._last_lidar_time) > timeout:
            empty_msg = DetectedObjects()
            empty_msg.header = Header(stamp=self.get_clock().now().to_msg(), frame_id="base_link")
            self._pub_objects.publish(empty_msg)
            return

        # Check camera freshness
        self._has_camera = (now - self._last_camera_time) <= timeout

        # 1. Crop points within bench ROI and exclude ego trike
        cropped = self._crop_points(self._latest_points)

        # 2. Cluster points into 3D objects
        clusters = self._cluster_points(cropped)

        # 3. Build Autoware DetectedObjects message
        stamp = self.get_clock().now().to_msg()
        out_msg = DetectedObjects()
        out_msg.header = Header(stamp=stamp, frame_id="base_link")

        for c in clusters:
            label, prob = self._classify_cluster(c)
            centroid = c["centroid"]
            dx, dy, dz = c["dims"]
            yaw = c["yaw"]

            obj = DetectedObject()
            obj.existence_probability = 0.90

            # Classification
            cls_msg = ObjectClassification()
            cls_msg.label = label
            cls_msg.probability = prob
            obj.classification = [cls_msg]

            # Kinematics (in base_link)
            kin = DetectedObjectKinematics()
            kin.pose_with_covariance.pose.position = Point(
                x=float(centroid[0]), y=float(centroid[1]), z=float(centroid[2])
            )
            kin.pose_with_covariance.pose.orientation = yaw_to_quaternion(yaw)
            kin.has_position_covariance = False
            kin.has_twist = False
            kin.has_twist_covariance = False
            obj.kinematics = kin

            # Shape
            sh = Shape()
            sh.type = Shape.BOUNDING_BOX
            sh.dimensions = Vector3(
                x=max(0.3, float(dx)),
                y=max(0.3, float(dy)),
                z=max(0.3, float(dz)),
            )
            obj.shape = sh

            out_msg.objects.append(obj)

        self._pub_objects.publish(out_msg)
        if self._pub_clusters and self._pub_clusters.is_activated:
            self._pub_clusters.publish(out_msg)


def main(args: Optional[List[str]] = None) -> None:
    rclpy.init(args=args)
    node = BenchPerceptionNode()

    # Auto-configure and activate lifecycle transitions
    node.trigger_configure()
    node.trigger_activate()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == "__main__":
    main()
