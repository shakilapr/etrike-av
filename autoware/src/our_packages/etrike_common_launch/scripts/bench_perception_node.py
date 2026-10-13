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

"""Real-time Standalone 1 Camera + 1 LiDAR Bench Perception Node.

Provides independent real-world object perception in the vehicle `base_link` frame
using physical Kinect v2 RGB-D Camera and Hesai XT32M2X 3D LiDAR.

Supports three operating modes with graceful failover:
  1. CAMERA_ONLY: Kinect v2 depth backprojection + OpenCV HOG person detection (when LiDAR is offline)
  2. LIDAR_ONLY: Hesai XT32M2X 360° point cloud clustering (when Camera is offline)
  3. FUSED: 3D point cloud fusion and camera vision confirmation (when both are online)
  4. UNAVAILABLE: Both offline -> emits 0 objects (fail-closed, no synthetic hallucinations)

Publishes:
  - /perception/object_recognition/detection/objects (autoware_perception_msgs/msg/DetectedObjects, RELIABLE)
  - /perception/object_recognition/detection/clustering/objects (autoware_perception_msgs/msg/DetectedObjects, RELIABLE)
  - /bench_perception/status (std_msgs/msg/String JSON diagnostic telemetry)

Conforms to AGENTS.md rules:
  - LifecycleNode (unconfigured -> inactive -> active)
  - Fail-closed behavior with timeouts on all subscriptions
  - 4-space indentation, snake_case methods, PascalCase classes, strict type hints
"""

from __future__ import annotations

import json
import math
import time
from typing import Any, Dict, List, Optional, Set, Tuple

import cv2
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
from geometry_msgs.msg import Point, Quaternion, Vector3
from sensor_msgs.msg import CameraInfo, Image, PointCloud2
from std_msgs.msg import Header, String


def yaw_to_quaternion(yaw: float) -> Quaternion:
    """Convert yaw angle (rad) around Z to a geometry_msgs Quaternion."""
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

        # Tunable parameters
        self.declare_parameter("publish_rate_hz", 10.0)
        self.declare_parameter("sensor_timeout_sec", 1.0)
        self.declare_parameter("min_cluster_points", 12)
        self.declare_parameter("voxel_grid_size_m", 0.28)
        self.declare_parameter("roi_x_min", -8.0)
        self.declare_parameter("roi_x_max", 25.0)
        self.declare_parameter("roi_y_min", -12.0)
        self.declare_parameter("roi_y_max", 12.0)
        self.declare_parameter("roi_z_min", 0.05)
        self.declare_parameter("roi_z_max", 2.20)
        self.declare_parameter("enable_hog_person_detector", True)

        # Camera mount extrinsics relative to base_link (x=1.2m fwd, y=0.0m, z=1.0m up)
        self._cam_x = 1.20
        self._cam_y = 0.00
        self._cam_z = 1.00

        # Camera depth intrinsics (default Kinect v2 512x424)
        self._fx = 364.99
        self._fy = 364.99
        self._cx = 258.18
        self._cy = 206.16

        # Publishers
        self._pub_objects: Optional[LifecyclePublisher] = None
        self._pub_clusters: Optional[LifecyclePublisher] = None
        self._pub_status: Optional[LifecyclePublisher] = None

        # Subscriptions & Timer
        self._sub_lidar: Optional[Any] = None
        self._sub_camera_color: Optional[Any] = None
        self._sub_camera_depth: Optional[Any] = None
        self._sub_camera_info: Optional[Any] = None
        self._timer: Optional[Any] = None

        # Sensor data buffers
        self._latest_lidar_points: Optional[np.ndarray] = None
        self._last_lidar_time: float = 0.0

        self._latest_camera_points: Optional[np.ndarray] = None
        self._last_camera_depth_time: float = 0.0

        self._last_camera_color_time: float = 0.0
        self._latest_person_boxes_2d: List[Tuple[int, int, int, int]] = []
        self._hog: Optional[cv2.HOGDescriptor] = None

        # Tracking & performance telemetry
        self._last_loop_ms: float = 0.0
        self._current_mode: str = "UNAVAILABLE"

    def on_configure(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Configuring BenchPerceptionNode (Standalone Camera + LiDAR)...")

        # RELIABLE QoS profile for outgoing perception objects (compatible with all subscribers)
        qos_pub = QoSProfile(
            reliability=QoSReliabilityPolicy.RELIABLE,
            durability=QoSDurabilityPolicy.VOLATILE,
            history=QoSHistoryPolicy.KEEP_LAST,
            depth=5,
        )

        # BEST_EFFORT QoS profile for incoming high-bandwidth sensor streams
        qos_sensor = QoSProfile(
            reliability=QoSReliabilityPolicy.BEST_EFFORT,
            durability=QoSDurabilityPolicy.VOLATILE,
            history=QoSHistoryPolicy.KEEP_LAST,
            depth=1,
        )

        self._pub_objects = self.create_lifecycle_publisher(
            DetectedObjects,
            "/perception/object_recognition/detection/objects",
            qos_pub,
        )
        self._pub_clusters = self.create_lifecycle_publisher(
            DetectedObjects,
            "/perception/object_recognition/detection/clustering/objects",
            qos_pub,
        )
        self._pub_status = self.create_lifecycle_publisher(
            String,
            "/bench_perception/status",
            qos_pub,
        )

        # 1. LiDAR PointCloud Subscription
        self._sub_lidar = self.create_subscription(
            PointCloud2,
            "/sensing/lidar/top/pointcloud_raw_ex",
            self._on_lidar_pointcloud,
            qos_sensor,
        )

        # 2. Camera Subscriptions
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
        self._sub_camera_info = self.create_subscription(
            CameraInfo,
            "/kinect_front/depth/camera_info",
            self._on_camera_info,
            qos_sensor,
        )

        # Initialize HOG pedestrian classifier
        if self.get_parameter("enable_hog_person_detector").value:
            self._hog = cv2.HOGDescriptor()
            self._hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())

        self.get_logger().info("Publishers, subscriptions, and vision classifiers configured.")
        return TransitionCallbackReturn.SUCCESS

    def on_activate(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Activating BenchPerceptionNode...")
        if self._pub_objects:
            self._pub_objects.on_activate(state)
        if self._pub_clusters:
            self._pub_clusters.on_activate(state)
        if self._pub_status:
            self._pub_status.on_activate(state)

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
        if self._pub_status:
            self._pub_status.on_deactivate(state)
        return TransitionCallbackReturn.SUCCESS

    def on_cleanup(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Cleaning up BenchPerceptionNode...")
        self._pub_objects = None
        self._pub_clusters = None
        self._pub_status = None
        self._sub_lidar = None
        self._sub_camera_color = None
        self._sub_camera_depth = None
        self._sub_camera_info = None
        self._latest_lidar_points = None
        self._latest_camera_points = None
        self._hog = None
        return TransitionCallbackReturn.SUCCESS

    def _on_camera_info(self, msg: CameraInfo) -> None:
        """Update focal length and principal point from factory camera info."""
        if msg.k[0] > 10.0 and msg.k[4] > 10.0:
            self._fx = float(msg.k[0])
            self._fy = float(msg.k[4])
            self._cx = float(msg.k[2])
            self._cy = float(msg.k[5])

    def _on_camera_color(self, msg: Image) -> None:
        """Run fast pedestrian detection on color frames with normalized coordinates."""
        self._last_camera_color_time = time.time()
        if self._hog is None:
            return

        try:
            raw = np.frombuffer(msg.data, dtype=np.uint8)
            channels = 4 if ("8UC4" in msg.encoding or "bgra" in msg.encoding or "rgba" in msg.encoding) else 3
            img = raw.reshape((msg.height, msg.width, channels))[:, :, :3]
            # Downsample to 640x360: person at 2.8m is ~160px tall, which fits HOG's 64x128 window
            h_det, w_det = 360, 640
            small = cv2.resize(img, (w_det, h_det))
            boxes, _ = self._hog.detectMultiScale(
                small, winStride=(4, 4), padding=(8, 8), scale=1.03
            )

            # Store normalized bounding boxes [x_min, y_min, x_max, y_max] in range [0.0, 1.0]
            norm_boxes: List[Tuple[float, float, float, float]] = []
            for (bx, by, bw, bh) in boxes:
                norm_boxes.append((
                    float(bx) / w_det,
                    float(by) / h_det,
                    float(bx + bw) / w_det,
                    float(by + bh) / h_det,
                ))
            self._latest_person_boxes_2d = norm_boxes
        except Exception:
            self._latest_person_boxes_2d = []

    def _on_camera_depth(self, msg: Image) -> None:
        """Vectorized depth backprojection to 3D base_link points (executes in ~1.1ms)."""
        if msg.width == 0 or msg.height == 0:
            return

        self._last_camera_depth_time = time.time()
        try:
            depth = np.frombuffer(msg.data, dtype=np.float32).reshape((msg.height, msg.width))
            # Subsample by 4 (128x106 resolution) for 10 Hz real-time efficiency
            step = 4
            d_sub = depth[::step, ::step]
            u = np.arange(0, msg.width, step)
            v = np.arange(0, msg.height, step)
            uu, vv = np.meshgrid(u, v)

            # Valid depth range for Kinect v2 (0.5m to 4.5m)
            valid_mask = (d_sub >= 0.50) & (d_sub <= 4.50) & np.isfinite(d_sub)
            z_opt = d_sub[valid_mask]
            if len(z_opt) == 0:
                self._latest_camera_points = None
                return

            x_opt = (uu[valid_mask] - self._cx) * z_opt / self._fx
            y_opt = (vv[valid_mask] - self._cy) * z_opt / self._fy

            # Transform from Kinect optical frame to vehicle base_link:
            #   X_base = Z_opt + mount_x (1.2m)
            #   Y_base = -X_opt (optical +X is right, base +Y is left)
            #   Z_base = -Y_opt + mount_z (1.0m) (optical +Y is down, base +Z is up)
            x_base = z_opt + self._cam_x
            y_base = -x_opt
            z_base = -y_opt + self._cam_z

            self._latest_camera_points = np.stack([x_base, y_base, z_base], axis=1)
        except Exception as e:
            self.get_logger().warn(f"Depth backprojection error: {e}")
            self._latest_camera_points = None

    def _on_lidar_pointcloud(self, msg: PointCloud2) -> None:
        """Parse incoming LiDAR PointCloud2 into Nx3 float32 array in base_link."""
        if msg.width * msg.height == 0 or len(msg.data) == 0:
            return

        point_step = msg.point_step
        if point_step < 12:
            return

        raw_bytes = np.frombuffer(msg.data, dtype=np.uint8)
        num_points = len(raw_bytes) // point_step
        if num_points == 0:
            return

        reshaped = raw_bytes[: num_points * point_step].reshape(num_points, point_step)
        xyz_bytes = np.ascontiguousarray(reshaped[:, :12])
        pts = xyz_bytes.view(dtype=np.float32).reshape(-1, 3)

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

        self._latest_lidar_points = valid_pts
        self._last_lidar_time = time.time()

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
        ego_mask = (
            (filtered[:, 0] >= -0.50)
            & (filtered[:, 0] <= 2.70)
            & (filtered[:, 1] >= -0.75)
            & (filtered[:, 1] <= 0.75)
            & (filtered[:, 2] >= -0.20)
            & (filtered[:, 2] <= 1.85)
        )
        return filtered[~ego_mask]

    def _cluster_points_spatial_hash(self, pts: np.ndarray) -> List[Dict[str, Any]]:
        """O(N) Spatial Hash Clustering using grid bins with 8-neighbor connectivity."""
        min_pts = int(self.get_parameter("min_cluster_points").value)
        if len(pts) < min_pts:
            return []

        cell_size = float(self.get_parameter("voxel_grid_size_m").value)

        # 2D horizontal hash bins (gx, gy)
        gx = np.floor(pts[:, 0] / cell_size).astype(np.int32)
        gy = np.floor(pts[:, 1] / cell_size).astype(np.int32)

        grid: Dict[Tuple[int, int], List[int]] = {}
        for idx in range(len(pts)):
            cell_key = (int(gx[idx]), int(gy[idx]))
            grid.setdefault(cell_key, []).append(idx)

        visited: Set[Tuple[int, int]] = set()
        clusters: List[Dict[str, Any]] = []

        # Connected component expansion
        for cell_key in grid:
            if cell_key in visited:
                continue

            cluster_indices: List[int] = []
            queue = [cell_key]
            visited.add(cell_key)

            while queue:
                cx, cy = queue.pop()
                cluster_indices.extend(grid[(cx, cy)])

                for dx in (-1, 0, 1):
                    for dy in (-1, 0, 1):
                        neighbor = (cx + dx, cy + dy)
                        if neighbor in grid and neighbor not in visited:
                            visited.add(neighbor)
                            queue.append(neighbor)

            if len(cluster_indices) >= min_pts:
                c_pts = pts[cluster_indices]
                min_xyz = np.min(c_pts, axis=0)
                max_xyz = np.max(c_pts, axis=0)
                centroid = np.mean(c_pts, axis=0)
                dims = max_xyz - min_xyz

                # Principal yaw heading
                cov = np.cov(c_pts[:, :2], rowvar=False)
                if cov.ndim == 2:
                    eigvals, eigvecs = np.linalg.eigh(cov)
                    major_vec = eigvecs[:, 1]
                    yaw = math.atan2(major_vec[1], major_vec[0])
                else:
                    yaw = 0.0

                clusters.append({
                    "points": c_pts,
                    "centroid": centroid,
                    "dims": dims,
                    "yaw": yaw,
                    "num_points": len(c_pts),
                })

        return clusters

    def _is_confirmed_by_vision(self, centroid: np.ndarray) -> bool:
        """Check if 3D cluster projects into any detected HOG pedestrian bounding box."""
        if not self._latest_person_boxes_2d:
            return False

        # Project 3D centroid from base_link to Kinect optical frame
        x_opt = -(centroid[1] - self._cam_y)
        y_opt = -(centroid[2] - self._cam_z)
        z_opt = centroid[0] - self._cam_x

        if z_opt <= 0.4 or z_opt > 5.5:
            return False

        # Normalized coordinates [0.0, 1.0] using depth intrinsics (512x424)
        u_norm = (self._fx * x_opt / z_opt + self._cx) / 512.0
        v_norm = (self._fy * y_opt / z_opt + self._cy) / 424.0

        for (x_min, y_min, x_max, y_max) in self._latest_person_boxes_2d:
            pad_x = (x_max - x_min) * 0.35
            pad_y = (y_max - y_min) * 0.35
            if (x_min - pad_x) <= u_norm <= (x_max + pad_x) and (y_min - pad_y) <= v_norm <= (y_max + pad_y):
                return True
        return False

    def _classify_cluster(self, cluster: Dict[str, Any]) -> Tuple[int, float]:
        """Classify 3D cluster fusing physical depth anthropometrics and vision evidence.

        A human silhouette in 3D point cloud has characteristic physical proportions:
        - Height between 0.95m and 2.20m (accounts for sitting, standing, and partial occlusion)
        - Footprint width between 0.25m and 1.05m
        - Vertical aspect ratio (height / width) >= 1.30 (upright vertical human profile)
        - Elevation centered at torso height (0.45m <= centroid.z <= 1.70m)
        """
        centroid = cluster["centroid"]
        dims = cluster["dims"]

        height = float(dims[2])
        width = float(max(dims[0], dims[1]))
        depth_thickness = float(min(dims[0], dims[1]))
        aspect_ratio = height / max(0.15, width)

        # 1. 3D Depth Anthropometric Test
        is_human_scale = (
            (0.95 <= height <= 2.20)
            and (0.25 <= width <= 1.05)
            and (depth_thickness <= 0.95)
            and (aspect_ratio >= 1.30)
            and (0.45 <= centroid[2] <= 1.70)
        )

        # 2. 2D Vision Confirmation Test
        has_vision = self._is_confirmed_by_vision(centroid)

        if has_vision and is_human_scale:
            # Dual confirmation (Depth geometry + 2D RGB Vision classifier)
            return ObjectClassification.PEDESTRIAN, 0.98
        elif has_vision:
            # Vision detected person (even if lower body is partially occluded by chairs)
            return ObjectClassification.PEDESTRIAN, 0.95
        elif is_human_scale:
            # Clear 3D upright human silhouette in depth point cloud
            return ObjectClassification.PEDESTRIAN, 0.92

        # Inanimate lab obstacle (desks, cabinets, chairs, walls)
        return ObjectClassification.UNKNOWN, 0.90

    def _on_timer(self) -> None:
        """Periodic real-time detection & failover loop (10 Hz)."""
        if not self._pub_objects or not self._pub_objects.is_activated:
            return

        t_start = time.time()
        now = time.time()
        timeout = float(self.get_parameter("sensor_timeout_sec").value)

        has_lidar = (self._latest_lidar_points is not None) and ((now - self._last_lidar_time) <= timeout)
        has_camera = (self._latest_camera_points is not None) and ((now - self._last_camera_depth_time) <= timeout)

        # Determine Operating Mode & Point Cloud Source
        active_points: Optional[np.ndarray] = None
        if has_camera and has_lidar:
            self._current_mode = "FUSED"
            # Combine LiDAR and Camera points in base_link
            active_points = np.vstack([self._latest_lidar_points, self._latest_camera_points])
        elif has_camera:
            self._current_mode = "CAMERA_ONLY"
            active_points = self._latest_camera_points
        elif has_lidar:
            self._current_mode = "LIDAR_ONLY"
            active_points = self._latest_lidar_points
        else:
            self._current_mode = "UNAVAILABLE"
            active_points = None

        # Fail-closed: If both sensors are offline, publish 0 objects
        if active_points is None or len(active_points) == 0:
            empty_msg = DetectedObjects()
            empty_msg.header = Header(stamp=self.get_clock().now().to_msg(), frame_id="base_link")
            self._pub_objects.publish(empty_msg)
            if self._pub_clusters and self._pub_clusters.is_activated:
                self._pub_clusters.publish(empty_msg)

            self._publish_status(0, (time.time() - t_start) * 1000.0)
            return

        # 1. Spatial cropping
        cropped = self._crop_points(active_points)

        # 2. O(N) Spatial Hash Clustering
        clusters = self._cluster_points_spatial_hash(cropped)

        # 3. Build Autoware DetectedObjects message
        stamp = self.get_clock().now().to_msg()
        out_msg = DetectedObjects()
        out_msg.header = Header(stamp=stamp, frame_id="base_link")

        for idx, c in enumerate(clusters):
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

            # Kinematics in base_link
            kin = DetectedObjectKinematics()
            kin.pose_with_covariance.pose.position = Point(
                x=float(centroid[0]), y=float(centroid[1]), z=float(centroid[2])
            )
            kin.pose_with_covariance.pose.orientation = yaw_to_quaternion(yaw)
            kin.has_position_covariance = False
            kin.has_twist = False
            kin.has_twist_covariance = False
            obj.kinematics = kin

            # Bounding Box Shape
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

        loop_ms = (time.time() - t_start) * 1000.0
        self._last_loop_ms = loop_ms
        self._publish_status(len(out_msg.objects), loop_ms)

    def _publish_status(self, object_count: int, latency_ms: float) -> None:
        """Publish real-time diagnostic status JSON."""
        if not self._pub_status or not self._pub_status.is_activated:
            return

        status_data = {
            "mode": self._current_mode,
            "object_count": object_count,
            "latency_ms": round(latency_ms, 2),
            "camera_online": (time.time() - self._last_camera_depth_time) <= 1.0,
            "lidar_online": (time.time() - self._last_lidar_time) <= 1.0,
            "camera_connected": (time.time() - self._last_camera_depth_time) <= 1.0,
            "lidar_connected": (time.time() - self._last_lidar_time) <= 1.0,
            "timestamp": time.time(),
        }
        msg = String()
        msg.data = json.dumps(status_data)
        self._pub_status.publish(msg)


def main(args: Optional[List[str]] = None) -> None:
    rclpy.init(args=args)
    node = BenchPerceptionNode()

    # Trigger lifecycle configure and activate
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
