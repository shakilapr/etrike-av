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

"""Isolated Real-Time Camera + LiDAR Sensor Fusion LifecycleNode for E-Trike.

Fuses:
  1. 1080p RGB Camera (/kinect_front/color/image_raw)
  2. 32-beam 3D LiDAR (/sensing/lidar/top/pointcloud_raw_ex)
  3. 2D Bounding Boxes & Poses (/bench_perception/objects & /bench_perception/human_poses)

Core Production-Grade Algorithms:
  - Floor Plane Removal (Z_lidar > -1.40m) preventing floor-obstacle point bridging.
  - High-speed 3D Metric Euclidean DBSCAN Clustering directly in base_link (via scipy.spatial.cKDTree).
  - Multi-Tier Perception (FUSED + VISION): Retains 100% of detected people.
  - 3D Constant-Velocity Kalman Multi-Object Tracking with Adaptive Covariance.
  - Confidence-Gated Pose Skeleton Rendering (>= 0.40 joint threshold, zero spiderwebs).
  - Unobstructed 1920x720 Cockpit HUD (1280x720 Camera 3D + 640x720 15m Top-Down BEV Radar).

Outputs (Strictly Isolated under /bench_perception/fusion/*):
  - /bench_perception/fusion/objects (autoware_perception_msgs/DetectedObjects)
  - /bench_perception/fusion/markers (visualization_msgs/MarkerArray)
  - /bench_perception/fusion/debug_image (sensor_msgs/Image)
  - /bench_perception/fusion/bev_image (sensor_msgs/Image)
  - /bench_perception/fusion/dashboard (sensor_msgs/Image - 1920x720 side-by-side)

Guaranteed zero interference with Autoware Universe simulation or vehicle planning.
"""

from __future__ import annotations

import json
import math
import os
import sys
import time
from typing import Any, Dict, List, Optional, Tuple

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
from cv_bridge import CvBridge
from geometry_msgs.msg import Point, Quaternion, Vector3
from sensor_msgs.msg import CameraInfo, Image, PointCloud2
from std_msgs.msg import ColorRGBA, Header, String
from visualization_msgs.msg import Marker, MarkerArray

try:
    from scipy.optimize import linear_sum_assignment
    from scipy.spatial import cKDTree
    _HAS_SCIPY = True
except ImportError:
    _HAS_SCIPY = False


# 17 COCO Keypoints & Topology
SKELETON_EDGES = [
    (0, 1), (0, 2), (1, 3), (2, 4),           # Head
    (5, 6),                                   # Shoulders
    (5, 7), (7, 9),                           # Left arm
    (6, 8), (8, 10),                          # Right arm
    (5, 11), (6, 12), (11, 12),               # Torso
    (11, 13), (13, 15),                       # Left leg
    (12, 14), (14, 16),                       # Right leg
]


class KalmanBox3DTracker:
    """3D Constant-Velocity Kalman Filter for smooth multi-object tracking."""

    _count = 0

    def __init__(self, init_pos: np.ndarray, name: str, conf: float, track_type: str = "FUSED") -> None:
        KalmanBox3DTracker._count += 1
        self.id = KalmanBox3DTracker._count
        self.name = name
        self.conf = conf
        self.track_type = track_type  # "FUSED" or "VISION"
        self.hits = 1
        self.time_since_update = 0

        # State: [x, y, z, vx, vy, vz]
        self.x = np.zeros(6, dtype=np.float32)
        self.x[:3] = init_pos[:3]

        # Covariance
        self.P = np.eye(6, dtype=np.float32) * 1.0
        self.P[3:, 3:] *= 10.0

        # Process noise
        self.Q = np.eye(6, dtype=np.float32) * 0.05
        self.Q[3:, 3:] *= 0.5

        self.last_bbox: Tuple[int, int, int, int] = (0, 0, 0, 0)
        self.last_kpts: Optional[np.ndarray] = None
        self.last_kconfs: Optional[np.ndarray] = None
        self.pts_count = 0
        self.yaw = 0.0
        self.history_dist: List[float] = [float(np.linalg.norm(init_pos[:3]))]

    def predict(self, dt: float = 0.066) -> np.ndarray:
        F = np.eye(6, dtype=np.float32)
        F[0, 3] = dt
        F[1, 4] = dt
        F[2, 5] = dt

        self.x = F @ self.x
        self.P = F @ self.P @ F.T + self.Q
        self.time_since_update += 1
        return self.x[:3]

    def update(self, pos: np.ndarray, bbox: Tuple[int, int, int, int], pts_count: int,
               track_type: str, kpts: Optional[np.ndarray] = None,
               kconfs: Optional[np.ndarray] = None, yaw: float = 0.0) -> None:
        self.time_since_update = 0
        self.hits += 1
        self.pts_count = pts_count
        self.track_type = track_type
        self.last_bbox = bbox
        self.last_kpts = kpts
        self.last_kconfs = kconfs
        self.yaw = yaw

        # Adaptive measurement noise based on source
        R = np.diag([0.04, 0.04, 0.04]).astype(np.float32) if track_type == "FUSED" else np.diag([0.15, 0.15, 0.30]).astype(np.float32)

        H = np.zeros((3, 6), dtype=np.float32)
        H[0, 0] = H[1, 1] = H[2, 2] = 1.0

        y = pos - (H @ self.x)
        S = H @ self.P @ H.T + R
        K = self.P @ H.T @ np.linalg.inv(S)

        self.x = self.x + K @ y
        self.P = (np.eye(6, dtype=np.float32) - K @ H) @ self.P
        self.history_dist.append(float(np.linalg.norm(self.x[:3])))


def compute_iou_2d(box1: Tuple[int, int, int, int], box2: Tuple[int, int, int, int]) -> float:
    """Calculate Intersection over Union (IoU) between two 2D bounding boxes."""
    x1 = max(box1[0], box2[0])
    y1 = max(box1[1], box2[1])
    x2 = min(box1[2], box2[2])
    y2 = min(box1[3], box2[3])

    inter_w = max(0, x2 - x1)
    inter_h = max(0, y2 - y1)
    inter_area = inter_w * inter_h

    area1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
    area2 = (box2[2] - box2[0]) * (box2[3] - box2[1])
    union = area1 + area2 - inter_area

    return float(inter_area) / float(union) if union > 0 else 0.0


def dbscan_fast(pts: np.ndarray, eps: float = 0.28, min_samples: int = 4) -> np.ndarray:
    """Fast KD-tree accelerated DBSCAN clustering using scipy.spatial.cKDTree."""
    if not _HAS_SCIPY or len(pts) < min_samples:
        return np.full(len(pts), -1, dtype=int)

    tree = cKDTree(pts)
    neighbors = tree.query_ball_point(pts, r=eps)
    labels = np.full(len(pts), -1, dtype=int)
    cluster_id = 0
    visited = np.zeros(len(pts), dtype=bool)

    for i in range(len(pts)):
        if visited[i]:
            continue
        visited[i] = True
        nb = neighbors[i]
        if len(nb) < min_samples:
            continue
        labels[i] = cluster_id
        queue = list(nb)
        head = 0
        while head < len(queue):
            pt_idx = queue[head]
            head += 1
            if not visited[pt_idx]:
                visited[pt_idx] = True
                pt_nb = neighbors[pt_idx]
                if len(pt_nb) >= min_samples:
                    queue.extend(pt_nb)
            if labels[pt_idx] == -1:
                labels[pt_idx] = cluster_id
        cluster_id += 1
    return labels


class CameraLidarFusionNode(LifecycleNode):
    """LifecycleNode fusing 3D LiDAR and Camera streams into isolated 3D perception."""

    def __init__(self, node_name: str = "camera_lidar_fusion_node") -> None:
        super().__init__(node_name)

        # Declare parameters
        self.declare_parameter("publish_rate_hz", 15.0)
        self.declare_parameter("sensor_timeout_sec", 1.2)
        self.declare_parameter("camera_image_topic", "/kinect_front/color/image_raw")
        self.declare_parameter("lidar_points_topic", "/sensing/lidar/top/pointcloud_raw_ex")
        self.declare_parameter("camera_info_topic", "/kinect_front/color/camera_info")
        self.declare_parameter("camera_objects_topic", "/bench_perception/objects")
        self.declare_parameter("camera_poses_topic", "/bench_perception/human_poses")

        self.declare_parameter("output_objects_topic", "/bench_perception/fusion/objects")
        self.declare_parameter("output_markers_topic", "/bench_perception/fusion/markers")
        self.declare_parameter("output_debug_image_topic", "/bench_perception/fusion/debug_image")
        self.declare_parameter("output_bev_image_topic", "/bench_perception/fusion/bev_image")
        self.declare_parameter("output_dashboard_topic", "/bench_perception/fusion/dashboard")

        # Calibrated Extrinsics (relative to base_link)
        self.declare_parameter("lidar_mount_x", 0.5750)
        self.declare_parameter("lidar_mount_y", 0.0000)
        self.declare_parameter("lidar_mount_z", 1.7464)
        self.declare_parameter("camera_mount_x", 1.2000)
        self.declare_parameter("camera_mount_y", 0.0000)
        self.declare_parameter("camera_mount_z", 1.7000)
        self.declare_parameter("camera_pitch_rad", 0.0000)

        # Intrinsics
        self.declare_parameter("fx_color", 1081.372)
        self.declare_parameter("fy_color", 1081.372)
        self.declare_parameter("cx_color", 959.5)
        self.declare_parameter("cy_color", 539.5)

        # 3D Filtering & Clustering
        self.declare_parameter("ground_filter_z_lidar_m", -1.40)
        self.declare_parameter("cluster_eps_m", 0.28)
        self.declare_parameter("cluster_min_pts", 4)
        self.declare_parameter("box_inner_margin", 0.05)
        self.declare_parameter("max_radar_range_m", 15.0)

        # Multi-Tier Association & Tracking
        self.declare_parameter("hungarian_dist_gate_m", 1.80)
        self.declare_parameter("kalman_association_gate_m", 1.80)
        self.declare_parameter("kalman_max_coast_frames", 3)

        # Standalone YOLO Fallback
        self.declare_parameter("auto_run_yolo", True)
        self.declare_parameter("yolo_model_path", "/workspace/av_project/data/ml_models/yolo26x-pose.pt")
        self.declare_parameter("confidence_threshold", 0.30)
        self.declare_parameter("skeleton_joint_threshold", 0.40)

        # Internal state
        self._bridge: CvBridge = CvBridge()
        self._last_image: Optional[np.ndarray] = None
        self._last_image_time: float = 0.0
        self._last_lidar_pts: Optional[np.ndarray] = None
        self._last_lidar_time: float = 0.0
        self._last_camera_objects: List[Dict[str, Any]] = []
        self._last_camera_objects_time: float = 0.0
        self._last_camera_poses: List[Dict[str, Any]] = []
        self._last_camera_poses_time: float = 0.0

        self._trackers: List[KalmanBox3DTracker] = []
        self._yolo_model: Optional[Any] = None

        # Publishers
        self._pub_objects: Optional[LifecyclePublisher] = None
        self._pub_markers: Optional[LifecyclePublisher] = None
        self._pub_debug_img: Optional[LifecyclePublisher] = None
        self._pub_bev_img: Optional[LifecyclePublisher] = None
        self._pub_dashboard: Optional[LifecyclePublisher] = None

        # Subscriptions & Timer
        self._sub_image: Optional[Any] = None
        self._sub_lidar: Optional[Any] = None
        self._sub_cam_info: Optional[Any] = None
        self._sub_objects: Optional[Any] = None
        self._sub_poses: Optional[Any] = None
        self._timer: Optional[Any] = None

        self.get_logger().info(f"{node_name} initialized in UNCONFIGURED state.")

    # --------------------------------------------------------------------------
    # Lifecycle Callbacks
    # --------------------------------------------------------------------------

    def on_configure(self, state: LifecycleState) -> TransitionCallbackReturn:
        """Allocate buffers, configure QoS, create publishers and subscriptions."""
        self.get_logger().info("Configuring Camera-LiDAR Fusion Node...")

        qos_pub = QoSProfile(
            reliability=QoSReliabilityPolicy.RELIABLE,
            durability=QoSDurabilityPolicy.VOLATILE,
            history=QoSHistoryPolicy.KEEP_LAST,
            depth=5,
        )
        qos_sensor = QoSProfile(
            reliability=QoSReliabilityPolicy.BEST_EFFORT,
            durability=QoSDurabilityPolicy.VOLATILE,
            history=QoSHistoryPolicy.KEEP_LAST,
            depth=1,
        )

        out_obj_topic = str(self.get_parameter("output_objects_topic").value)
        out_mark_topic = str(self.get_parameter("output_markers_topic").value)
        out_dbg_topic = str(self.get_parameter("output_debug_image_topic").value)
        out_bev_topic = str(self.get_parameter("output_bev_image_topic").value)
        out_dash_topic = str(self.get_parameter("output_dashboard_topic").value)

        self._pub_objects = self.create_lifecycle_publisher(DetectedObjects, out_obj_topic, qos_pub)
        self._pub_markers = self.create_lifecycle_publisher(MarkerArray, out_mark_topic, qos_pub)
        self._pub_debug_img = self.create_lifecycle_publisher(Image, out_dbg_topic, qos_sensor)
        self._pub_bev_img = self.create_lifecycle_publisher(Image, out_bev_topic, qos_sensor)
        self._pub_dashboard = self.create_lifecycle_publisher(Image, out_dash_topic, qos_sensor)

        # Load standalone YOLO model if enabled and available
        if bool(self.get_parameter("auto_run_yolo").value):
            model_path = str(self.get_parameter("yolo_model_path").value)
            candidates = [
                model_path,
                "/workspace/av_project/data/ml_models/yolo26x-pose.pt",
                "/workspace/av_project/yolov8n.pt",
                "yolov8n.pt"
            ]
            valid_path = next((p for p in candidates if os.path.exists(p)), None)
            if valid_path is not None:
                try:
                    from ultralytics import YOLO
                    self.get_logger().info(f"Loading YOLO model: {valid_path}")
                    self._yolo_model = YOLO(valid_path)
                except Exception as e:
                    self.get_logger().warn(f"Fallback YOLO model unavailable ({e}); will use upstream detections.")

        # Subscriptions
        img_topic = str(self.get_parameter("camera_image_topic").value)
        lidar_topic = str(self.get_parameter("lidar_points_topic").value)
        info_topic = str(self.get_parameter("camera_info_topic").value)
        objs_topic = str(self.get_parameter("camera_objects_topic").value)
        poses_topic = str(self.get_parameter("camera_poses_topic").value)

        self._sub_image = self.create_subscription(Image, img_topic, self._on_image, qos_sensor)
        self._sub_lidar = self.create_subscription(PointCloud2, lidar_topic, self._on_lidar, qos_sensor)
        self._sub_cam_info = self.create_subscription(CameraInfo, info_topic, self._on_camera_info, qos_sensor)
        self._sub_objects = self.create_subscription(DetectedObjects, objs_topic, self._on_camera_objects, qos_pub)
        self._sub_poses = self.create_subscription(String, poses_topic, self._on_camera_poses, qos_pub)

        self.get_logger().info("Configuration complete. Isolated publishers & subscriptions ready.")
        return TransitionCallbackReturn.SUCCESS

    def on_activate(self, state: LifecycleState) -> TransitionCallbackReturn:
        """Activate publishers and spin up fusion processing timer."""
        self.get_logger().info("Activating Camera-LiDAR Fusion Node...")
        rate_hz = float(self.get_parameter("publish_rate_hz").value)
        timer_period = 1.0 / max(1.0, rate_hz)
        self._timer = self.create_timer(timer_period, self._fusion_step)
        return super().on_activate(state)

    def on_deactivate(self, state: LifecycleState) -> TransitionCallbackReturn:
        """Deactivate timer and publishers (fail-closed)."""
        self.get_logger().info("Deactivating Camera-LiDAR Fusion Node...")
        if self._timer is not None:
            self._timer.cancel()
            self._timer = None
        return super().on_deactivate(state)

    def on_cleanup(self, state: LifecycleState) -> TransitionCallbackReturn:
        """Destroy resources."""
        self.get_logger().info("Cleaning up Camera-LiDAR Fusion Node...")
        self._sub_image = None
        self._sub_lidar = None
        self._sub_cam_info = None
        self._sub_objects = None
        self._sub_poses = None
        self._pub_objects = None
        self._pub_markers = None
        self._pub_debug_img = None
        self._pub_bev_img = None
        self._pub_dashboard = None
        self._last_image = None
        self._last_lidar_pts = None
        self._trackers.clear()
        return TransitionCallbackReturn.SUCCESS

    def on_shutdown(self, state: LifecycleState) -> TransitionCallbackReturn:
        """Shutdown cleanly."""
        self.get_logger().info("Shutting down Camera-LiDAR Fusion Node...")
        return TransitionCallbackReturn.SUCCESS

    # --------------------------------------------------------------------------
    # Sensor Callbacks
    # --------------------------------------------------------------------------

    def _on_camera_info(self, msg: CameraInfo) -> None:
        """Update optical intrinsics dynamically from CameraInfo."""
        if msg.k[0] > 10.0:
            self.set_parameters([
                rclpy.parameter.Parameter("fx_color", rclpy.Parameter.Type.DOUBLE, float(msg.k[0])),
                rclpy.parameter.Parameter("fy_color", rclpy.Parameter.Type.DOUBLE, float(msg.k[4])),
                rclpy.parameter.Parameter("cx_color", rclpy.Parameter.Type.DOUBLE, float(msg.k[2])),
                rclpy.parameter.Parameter("cy_color", rclpy.Parameter.Type.DOUBLE, float(msg.k[5])),
            ])

    def _on_image(self, msg: Image) -> None:
        """Ingest raw camera image."""
        try:
            raw = np.frombuffer(msg.data, dtype=np.uint8)
            channels = 4 if ("8UC4" in msg.encoding or "bgra" in msg.encoding or "rgba" in msg.encoding) else 3
            img = raw.reshape((msg.height, msg.width, channels))[:, :, :3]
            if "rgb" in msg.encoding.lower():
                self._last_image = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
            else:
                self._last_image = img
            self._last_image_time = time.time()
        except Exception as e:
            self.get_logger().warn(f"Failed to decode image frame: {e}")

    def _on_lidar(self, msg: PointCloud2) -> None:
        """Unpack Hesai XT32 PointCloud2 into (N, 4) float32 [x, y, z, intensity]."""
        try:
            step = msg.point_step
            raw = np.frombuffer(msg.data, dtype=np.uint8)
            n_pts = len(raw) // step
            if n_pts == 0:
                return

            reshaped = raw[:n_pts * step].reshape((n_pts, step))
            x = np.frombuffer(reshaped[:, 0:4].copy(), dtype=np.float32)
            y = np.frombuffer(reshaped[:, 4:8].copy(), dtype=np.float32)
            z = np.frombuffer(reshaped[:, 8:12].copy(), dtype=np.float32)
            intensity = reshaped[:, 12].astype(np.float32)

            pts = np.stack([x, y, z, intensity], axis=1)
            valid = np.isfinite(pts[:, 0]) & np.isfinite(pts[:, 1]) & np.isfinite(pts[:, 2])
            self._last_lidar_pts = pts[valid]
            self._last_lidar_time = time.time()
        except Exception as e:
            self.get_logger().warn(f"Failed to decode LiDAR pointcloud: {e}")

    def _on_camera_objects(self, msg: DetectedObjects) -> None:
        """Ingest upstream detections from /bench_perception/objects."""
        extracted = []
        for obj in msg.objects:
            conf = float(obj.existence_probability)
            cls_name = "person"
            if obj.classification:
                lbl = obj.classification[0].label
                if lbl == ObjectClassification.CAR:
                    cls_name = "car"
                elif lbl == ObjectClassification.BICYCLE:
                    cls_name = "bicycle"
                elif lbl == ObjectClassification.MOTORCYCLE:
                    cls_name = "motorcycle"

            p = obj.kinematics.pose_with_covariance.pose.position
            s = obj.shape.dimensions if obj.shape else None
            size_tuple = (float(s.x), float(s.y), float(s.z)) if s else (0.8, 0.8, 1.7)

            extracted.append({
                "class": cls_name,
                "conf": conf,
                "pos_hint": (float(p.x), float(p.y), float(p.z)),
                "size": size_tuple,
            })

        self._last_camera_objects = extracted
        self._last_camera_objects_time = time.time()

    def _on_camera_poses(self, msg: String) -> None:
        """Ingest skeletal pose estimates from /bench_perception/human_poses."""
        try:
            payload = json.loads(msg.data)
            self._last_camera_poses = payload.get("poses", [])
            self._last_camera_poses_time = time.time()
        except Exception as e:
            self.get_logger().warn(f"Failed to parse human poses: {e}")

    # --------------------------------------------------------------------------
    # Fusion Pipeline Execution
    # --------------------------------------------------------------------------

    def _fusion_step(self) -> None:
        """Main periodic fusion computation."""
        now = time.time()
        timeout_sec = float(self.get_parameter("sensor_timeout_sec").value)

        # Fail-closed sensor liveness check
        cam_active = (self._last_image is not None) and ((now - self._last_image_time) < timeout_sec)
        lidar_active = (self._last_lidar_pts is not None) and ((now - self._last_lidar_time) < timeout_sec)

        if not cam_active or not lidar_active:
            empty_objs = DetectedObjects()
            empty_objs.header.stamp = self.get_clock().now().to_msg()
            empty_objs.header.frame_id = "base_link"
            if self._pub_objects is not None and self._pub_objects.is_activated:
                self._pub_objects.publish(empty_objs)
            return

        img = self._last_image.copy()
        h_orig, w_orig = img.shape[:2]
        lidar_pts = self._last_lidar_pts

        # 1. Floor Ground Removal (Z_lidar > -1.40m eliminates bridging)
        floor_z_lidar = float(self.get_parameter("ground_filter_z_lidar_m").value)
        non_floor_mask = lidar_pts[:, 2] > floor_z_lidar
        non_floor_pts = lidar_pts[non_floor_mask]

        # 2. 3D Euclidean DBSCAN Clustering directly in base_link (Fast cKDTree DBSCAN)
        clusters_3d = self._euclidean_clustering_3d(non_floor_pts)

        # 3. Project 3D Clusters into 2D Image Frustums
        proj_clusters = self._project_clusters_to_camera(clusters_3d, w_orig, h_orig)

        # 4. Get 2D Detections & Keypoints
        detections_2d = self._detect_2d_boxes(img)

        # 5. Multi-Tier Association (FUSED + VISION)
        current_actors = self._associate_multi_tier(detections_2d, proj_clusters)

        # 6. Multi-Object Tracking with 3D Kalman Filter
        active_trackers = self._update_kalman_trackers(current_actors)

        # 7. Publish Isolated ROS 2 Messages
        stamp = self.get_clock().now().to_msg()
        self._publish_ros_messages(active_trackers, stamp)

        # 8. Render & Publish Visual Streams (Unobstructed Cockpit HUD)
        self._publish_visual_streams(img, non_floor_pts, active_trackers, stamp)

    def _euclidean_clustering_3d(self, non_floor_pts: np.ndarray) -> List[Dict[str, Any]]:
        """Cluster 3D non-ground LiDAR points in vehicle base_link frame using DBSCAN."""
        cluster_min_pts = int(self.get_parameter("cluster_min_pts").value)
        if len(non_floor_pts) < cluster_min_pts:
            return []

        # Transform to base_link
        lx = float(self.get_parameter("lidar_mount_x").value)
        ly = float(self.get_parameter("lidar_mount_y").value)
        lz = float(self.get_parameter("lidar_mount_z").value)
        max_r = float(self.get_parameter("max_radar_range_m").value)

        bx = non_floor_pts[:, 0] + lx
        by = non_floor_pts[:, 1] + ly
        bz = non_floor_pts[:, 2] + lz

        forward = (bx > 0.5) & (bx < max_r) & (np.abs(by) < max_r * 0.55)
        if np.sum(forward) < cluster_min_pts:
            return []

        f_pts = np.column_stack([bx[forward], by[forward], bz[forward]])
        cluster_eps = float(self.get_parameter("cluster_eps_m").value)

        labels = dbscan_fast(f_pts, eps=cluster_eps, min_samples=cluster_min_pts)
        clusters = []
        for k in set(labels):
            if k == -1:
                continue
            c_pts = f_pts[labels == k]
            min_b = np.min(c_pts, axis=0)
            max_b = np.max(c_pts, axis=0)
            centroid = np.mean(c_pts, axis=0)
            dims = max_b - min_b
            if dims[0] < 5.0 and dims[1] < 4.0:
                clusters.append({
                    "points": c_pts,
                    "centroid": centroid,
                    "min_bound": min_b,
                    "max_bound": max_b,
                    "dims": dims,
                    "dist": float(np.linalg.norm(centroid)),
                    "count": len(c_pts),
                })
        return clusters

    def _project_clusters_to_camera(self, clusters: List[Dict[str, Any]], img_w: int, img_h: int) -> List[Dict[str, Any]]:
        """Project 3D clusters into 2D camera pixels using calibrated extrinsics."""
        fx = float(self.get_parameter("fx_color").value)
        fy = float(self.get_parameter("fy_color").value)
        cx = float(self.get_parameter("cx_color").value)
        cy = float(self.get_parameter("cy_color").value)

        cam_x = float(self.get_parameter("camera_mount_x").value)
        cam_y = float(self.get_parameter("camera_mount_y").value)
        cam_z = float(self.get_parameter("camera_mount_z").value)

        proj_clusters = []
        for c in clusters:
            centroid = c["centroid"]
            min_b = c["min_bound"]
            max_b = c["max_bound"]

            z_opt = centroid[0] - cam_x
            if z_opt < 0.4:
                continue
            x_opt = -(centroid[1] - cam_y)
            y_opt = -(centroid[2] - cam_z)

            u_c = int(fx * (x_opt / z_opt) + cx)
            v_c = int(fy * (y_opt / z_opt) + cy)

            corners_base = np.array([
                [min_b[0], min_b[1], min_b[2]],
                [min_b[0], min_b[1], max_b[2]],
                [min_b[0], max_b[1], min_b[2]],
                [min_b[0], max_b[1], max_b[2]],
                [max_b[0], min_b[1], min_b[2]],
                [max_b[0], min_b[1], max_b[2]],
                [max_b[0], max_b[1], min_b[2]],
                [max_b[0], max_b[1], max_b[2]],
            ])

            z_corn = corners_base[:, 0] - cam_x
            if np.any(z_corn < 0.3):
                continue
            x_corn = -(corners_base[:, 1] - cam_y)
            y_corn = -(corners_base[:, 2] - cam_z)

            u_arr = fx * (x_corn / z_corn) + cx
            v_arr = fy * (y_corn / z_corn) + cy

            u1, u2 = int(np.clip(np.min(u_arr), 0, img_w - 1)), int(np.clip(np.max(u_arr), 0, img_w - 1))
            v1, v2 = int(np.clip(np.min(v_arr), 0, img_h - 1)), int(np.clip(np.max(v_arr), 0, img_h - 1))

            if (u2 - u1) < 8 or (v2 - v1) < 8:
                continue

            proj_clusters.append({
                "cluster": c,
                "box_2d": (u1, v1, u2, v2),
                "center_2d": (u_c, v_c),
                "dist": float(np.linalg.norm(centroid)),
            })
        return proj_clusters

    def _detect_2d_boxes(self, img: np.ndarray) -> List[Dict[str, Any]]:
        """Obtain 2D bounding boxes and pose skeletons from upstream topic or local YOLO."""
        now = time.time()
        # 1. Prefer upstream GPU TensorRT detections from /bench_perception/objects if active
        if self._last_camera_objects and (now - self._last_camera_objects_time < 1.5):
            h, w = img.shape[:2]
            fx = float(self.get_parameter("fx_color").value)
            fy = float(self.get_parameter("fy_color").value)
            cx = float(self.get_parameter("cx_color").value)
            cy = float(self.get_parameter("cy_color").value)
            cam_x = float(self.get_parameter("camera_mount_x").value)
            cam_z = float(self.get_parameter("camera_mount_z").value)

            # Match with recent human poses if available
            poses_dict: Dict[str, Any] = {}
            if self._last_camera_poses and (now - self._last_camera_poses_time < 1.5):
                for p_item in self._last_camera_poses:
                    poses_dict[p_item.get("id", "")] = p_item

            boxes = []
            for idx, obj in enumerate(self._last_camera_objects):
                px, py, pz = obj["pos_hint"]
                sx, sy, sz = obj["size"]

                z_opt = px - cam_x
                if z_opt < 0.4:
                    continue
                x_opt = -py
                y_opt = -(pz - cam_z)

                u_c = fx * (x_opt / z_opt) + cx
                v_c = fy * (y_opt / z_opt) + cy

                bw = max(25.0, fx * (max(sx, sy) / z_opt))
                bh = max(35.0, fy * (sz / z_opt))

                x1 = int(np.clip(u_c - bw * 0.5, 0, w - 1))
                x2 = int(np.clip(u_c + bw * 0.5, 0, w - 1))
                y1 = int(np.clip(v_c - bh * 0.5, 0, h - 1))
                y2 = int(np.clip(v_c + bh * 0.5, 0, h - 1))

                # Extract keypoints if present
                kpts_arr = None
                kconfs_arr = None
                yaw_val = 0.0
                det_key = f"det_{idx}"
                if det_key in poses_dict:
                    p_info = poses_dict[det_key]
                    yaw_val = float(p_info.get("yaw", 0.0))
                    raw_kpts = p_info.get("keypoints", {})
                    if raw_kpts:
                        kpts_arr = np.zeros((17, 2), dtype=np.float32)
                        kconfs_arr = np.zeros(17, dtype=np.float32)
                        for kp_idx, kp_name in enumerate(["nose", "left_eye", "right_eye", "left_ear", "right_ear",
                                                          "left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
                                                          "left_wrist", "right_wrist", "left_hip", "right_hip",
                                                          "left_knee", "right_knee", "left_ankle", "right_ankle"]):
                            if kp_name in raw_kpts:
                                item = raw_kpts[kp_name]
                                kpts_arr[kp_idx] = [item[0], item[1]]
                                kconfs_arr[kp_idx] = item[2] if len(item) > 2 else 0.85

                if x2 > x1 + 10 and y2 > y1 + 10:
                    boxes.append({
                        "name": obj["class"],
                        "conf": obj["conf"],
                        "bbox": (x1, y1, x2, y2),
                        "pos_hint": np.array([px, py, pz], dtype=np.float32),
                        "kpts": kpts_arr,
                        "kconfs": kconfs_arr,
                        "yaw": yaw_val,
                    })
            if boxes:
                return boxes

        # 2. Local YOLO fallback if model exists
        boxes = []
        if self._yolo_model is not None:
            conf_thresh = float(self.get_parameter("confidence_threshold").value)
            try:
                results = self._yolo_model(img, conf=conf_thresh, verbose=False)
                for r in results:
                    for b_idx in range(len(r.boxes)):
                        b = r.boxes[b_idx]
                        cls_id = int(b.cls[0])
                        name = self._yolo_model.names[cls_id]
                        conf = float(b.conf[0])
                        x1, y1, x2, y2 = [int(v) for v in b.xyxy[0].tolist()]

                        kpts_xy = None
                        kpts_confs = None
                        yaw_est = 0.0

                        if r.keypoints is not None and b_idx < len(r.keypoints):
                            k = r.keypoints[b_idx]
                            kpts_xy = k.xy[0].cpu().numpy()
                            kpts_confs = k.conf[0].cpu().numpy() if k.conf is not None else np.ones(len(kpts_xy))

                            if len(kpts_confs) >= 7 and kpts_confs[5] > 0.35 and kpts_confs[6] > 0.35:
                                dx_sh = float(kpts_xy[5, 0] - kpts_xy[6, 0])
                                yaw_est = math.atan2(0.0, dx_sh)

                        boxes.append({
                            "name": name,
                            "conf": conf,
                            "bbox": (x1, y1, x2, y2),
                            "pos_hint": None,
                            "kpts": kpts_xy,
                            "kconfs": kpts_confs,
                            "yaw": yaw_est,
                        })
            except Exception as e:
                self.get_logger().warn(f"YOLO inference error: {e}")
        return boxes

    def _associate_multi_tier(self, detections: List[Dict[str, Any]],
                              proj_clusters: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Perform Hungarian cross-modal matching with multi-tier fallback (FUSED + VISION)."""
        dist_gate = float(self.get_parameter("hungarian_dist_gate_m").value)
        fx = float(self.get_parameter("fx_color").value)
        fy = float(self.get_parameter("fy_color").value)
        cx = float(self.get_parameter("cx_color").value)
        cy = float(self.get_parameter("cy_color").value)
        cam_x = float(self.get_parameter("camera_mount_x").value)
        cam_z = float(self.get_parameter("camera_mount_z").value)

        cost_matrix = np.ones((len(detections), len(proj_clusters)), dtype=np.float32) * 1.0

        for d_i, det in enumerate(detections):
            d_box = det["bbox"]
            pos_hint = det["pos_hint"]
            hint_dist = float(np.linalg.norm(pos_hint)) if pos_hint is not None else 0.0

            for c_j, proj in enumerate(proj_clusters):
                c_box = proj["box_2d"]
                u_c, v_c = proj["center_2d"]
                c_dist = proj["dist"]

                iou = compute_iou_2d(d_box, c_box)
                inside = (d_box[0] <= u_c <= d_box[2]) and (d_box[1] <= v_c <= d_box[3])

                dist_ok = True
                if hint_dist > 1.0 and abs(c_dist - hint_dist) > dist_gate:
                    dist_ok = False

                if dist_ok:
                    if inside:
                        cost_matrix[d_i, c_j] = min(1.0 - iou, 0.35)
                    elif iou > 0.10:
                        cost_matrix[d_i, c_j] = 1.0 - iou

        matched_det_indices = set()
        matched_cluster_indices = set()
        matched_pairs = []

        if _HAS_SCIPY and len(detections) > 0 and len(proj_clusters) > 0:
            row_ind, col_ind = linear_sum_assignment(cost_matrix)
            for r, c in zip(row_ind, col_ind):
                if cost_matrix[r, c] < 0.70:
                    matched_det_indices.add(r)
                    matched_cluster_indices.add(c)
                    matched_pairs.append((r, c))

        current_actors = []

        # Add Fused Actors
        for r, c in matched_pairs:
            det = detections[r]
            cl = proj_clusters[c]["cluster"]
            current_actors.append({
                "type": "FUSED",
                "name": det["name"],
                "conf": det["conf"],
                "box": det["bbox"],
                "pos": cl["centroid"],
                "pts": cl["count"],
                "kpts": det["kpts"],
                "kconfs": det["kconfs"],
                "yaw": det["yaw"],
            })

        # Add Vision Actors (Never drop real people!)
        for r, det in enumerate(detections):
            if r not in matched_det_indices:
                x1, y1, x2, y2 = det["bbox"]
                u_cent = (x1 + x2) / 2.0
                v_cent = (y1 + y2) / 2.0

                if det["pos_hint"] is not None:
                    pos_est = det["pos_hint"]
                else:
                    # Pinhole floor raycasting: ground is Z_base = 0.0 -> Y_opt = +1.70
                    v_feet = max(cy + 10, float(y2))
                    z_opt = float(fy * 1.70 / (v_feet - cy))
                    z_opt = np.clip(z_opt, 1.0, 15.0)

                    x_opt = (u_cent - cx) * z_opt / fx
                    y_opt = (v_cent - cy) * z_opt / fy
                    pos_est = np.array([z_opt + cam_x, -x_opt, -y_opt + cam_z], dtype=np.float32)

                current_actors.append({
                    "type": "VISION",
                    "name": det["name"],
                    "conf": det["conf"],
                    "box": det["bbox"],
                    "pos": pos_est,
                    "pts": 0,
                    "kpts": det["kpts"],
                    "kconfs": det["kconfs"],
                    "yaw": det["yaw"],
                })

        return current_actors

    def _update_kalman_trackers(self, current_actors: List[Dict[str, Any]]) -> List[KalmanBox3DTracker]:
        """Update 3D Constant-Velocity Kalman Filter tracks."""
        for trk in self._trackers:
            trk.predict(dt=0.066)

        matched_actor_ids = set()
        matched_track_ids = set()
        gate = float(self.get_parameter("kalman_association_gate_m").value)

        # Associate actors to existing tracks
        for a_idx, act in enumerate(current_actors):
            pos_meas = act["pos"]
            best_trk = None
            best_dist = gate
            for trk in self._trackers:
                if trk.id not in matched_track_ids and trk.name == act["name"]:
                    d_trk = float(np.linalg.norm(trk.x[:3] - pos_meas))
                    if d_trk < best_dist:
                        best_dist = d_trk
                        best_trk = trk

            if best_trk is not None:
                best_trk.update(
                    pos=pos_meas,
                    bbox=act["box"],
                    pts_count=act["pts"],
                    track_type=act["type"],
                    kpts=act["kpts"],
                    kconfs=act["kconfs"],
                    yaw=act["yaw"]
                )
                matched_track_ids.add(best_trk.id)
                matched_actor_ids.add(a_idx)

        # Initialize new tracks for unmatched actors
        for a_idx, act in enumerate(current_actors):
            if a_idx not in matched_actor_ids:
                new_trk = KalmanBox3DTracker(act["pos"], act["name"], act["conf"], track_type=act["type"])
                new_trk.update(
                    pos=act["pos"],
                    bbox=act["box"],
                    pts_count=act["pts"],
                    track_type=act["type"],
                    kpts=act["kpts"],
                    kconfs=act["kconfs"],
                    yaw=act["yaw"]
                )
                self._trackers.append(new_trk)
                matched_track_ids.add(new_trk.id)

        # Prune dead tracks (missed > 6 frames)
        self._trackers = [t for t in self._trackers if t.time_since_update <= 6]

        max_coast = int(self.get_parameter("kalman_max_coast_frames").value)
        return [t for t in self._trackers if t.time_since_update <= max_coast]

    def _publish_ros_messages(self, active_trackers: List[KalmanBox3DTracker], stamp: Any) -> None:
        """Publish isolated DetectedObjects and MarkerArray."""
        if self._pub_objects is None or not self._pub_objects.is_activated:
            return

        out_objs = DetectedObjects()
        out_objs.header.stamp = stamp
        out_objs.header.frame_id = "base_link"

        marker_arr = MarkerArray()

        for idx, trk in enumerate(active_trackers):
            ox, oy, oz = trk.x[:3]
            sx, sy, sz = (0.7, 0.7, 1.7) if trk.name == "person" else (2.0, 4.2, 1.6)

            det = DetectedObject()
            det.existence_probability = trk.conf

            cls_msg = ObjectClassification()
            cls_msg.probability = trk.conf
            if trk.name == "person":
                cls_msg.label = ObjectClassification.PEDESTRIAN
            elif trk.name == "car":
                cls_msg.label = ObjectClassification.CAR
            elif trk.name == "bicycle":
                cls_msg.label = ObjectClassification.BICYCLE
            else:
                cls_msg.label = ObjectClassification.UNKNOWN
            det.classification = [cls_msg]

            kin = DetectedObjectKinematics()
            kin.pose_with_covariance.pose.position = Point(x=float(ox), y=float(oy), z=float(oz))
            kin.pose_with_covariance.pose.orientation = Quaternion(x=0.0, y=0.0, z=math.sin(trk.yaw * 0.5), w=math.cos(trk.yaw * 0.5))
            det.kinematics = kin

            shape = Shape()
            shape.type = Shape.BOUNDING_BOX
            shape.dimensions = Vector3(x=float(sx), y=float(sy), z=float(sz))
            det.shape = shape

            out_objs.objects.append(det)

            # RViz Marker: 3D Box
            m_box = Marker()
            m_box.header.stamp = stamp
            m_box.header.frame_id = "base_link"
            m_box.ns = "fused_boxes"
            m_box.id = idx * 2
            m_box.type = Marker.CUBE
            m_box.action = Marker.ADD
            m_box.pose.position = Point(x=float(ox), y=float(oy), z=float(oz))
            m_box.pose.orientation = Quaternion(x=0.0, y=0.0, z=math.sin(trk.yaw * 0.5), w=math.cos(trk.yaw * 0.5))
            m_box.scale = Vector3(x=float(sx), y=float(sy), z=float(sz))
            dist_m = float(np.linalg.norm(trk.x[:3]))
            m_box.color = ColorRGBA(r=0.0, g=1.0, b=0.4, a=0.55) if dist_m > 3.0 else ColorRGBA(r=1.0, g=0.2, b=0.0, a=0.65)
            marker_arr.markers.append(m_box)

            # RViz Marker: Text Tag
            m_txt = Marker()
            m_txt.header.stamp = stamp
            m_txt.header.frame_id = "base_link"
            m_txt.ns = "fused_tags"
            m_txt.id = idx * 2 + 1
            m_txt.type = Marker.TEXT_VIEW_FACING
            m_txt.action = Marker.ADD
            m_txt.pose.position = Point(x=float(ox), y=float(oy), z=float(oz + sz / 2.0 + 0.3))
            m_txt.scale.z = 0.35
            m_txt.text = f"ID:{trk.id} {trk.name.upper()} {dist_m:.1f}m"
            m_txt.color = ColorRGBA(r=1.0, g=1.0, b=1.0, a=0.95)
            marker_arr.markers.append(m_txt)

        self._pub_objects.publish(out_objs)
        if self._pub_markers is not None and self._pub_markers.is_activated:
            self._pub_markers.publish(marker_arr)

    def _publish_visual_streams(
        self,
        img: np.ndarray,
        non_floor_pts: np.ndarray,
        active_trackers: List[KalmanBox3DTracker],
        stamp: Any
    ) -> None:
        """Render annotated camera feed and BEV radar map, and publish images."""
        if (
            (self._pub_debug_img is None or not self._pub_debug_img.is_activated) and
            (self._pub_bev_img is None or not self._pub_bev_img.is_activated) and
            (self._pub_dashboard is None or not self._pub_dashboard.is_activated)
        ):
            return

        fx = float(self.get_parameter("fx_color").value)
        fy = float(self.get_parameter("fy_color").value)
        cx = float(self.get_parameter("cx_color").value)
        cy = float(self.get_parameter("cy_color").value)
        skel_thresh = float(self.get_parameter("skeleton_joint_threshold").value)

        # 1. Overlay Depth-Colored LiDAR Points onto Camera Frame
        # Calibrated: Z_opt = X_lidar - 0.6250, X_opt = -Y_lidar, Y_opt = -(Z_lidar + 0.0464)
        z_opt_all = non_floor_pts[:, 0] - 0.6250
        valid_front = z_opt_all > 0.45
        z_v = z_opt_all[valid_front]
        x_v = -non_floor_pts[valid_front, 1]
        y_v = -(non_floor_pts[valid_front, 2] + 0.0464)

        u = (fx * (x_v / z_v) + cx).astype(int)
        v = (fy * (y_v / z_v) + cy).astype(int)

        in_cam = (u >= 0) & (u < 1920) & (v >= 0) & (v < 1080)
        u_p = u[in_cam]
        v_p = v[in_cam]
        d_p = z_v[in_cam]

        cam_canvas = img.copy()
        norm_depth = np.clip((d_p - 1.0) / 10.0, 0.0, 1.0)
        colors = cv2.applyColorMap((norm_depth * 255).astype(np.uint8), cv2.COLORMAP_TURBO)[:, 0, :]
        for (px, py), c in zip(zip(u_p, v_p), colors.tolist()):
            cv2.circle(cam_canvas, (px, py), 2, c, -1)

        # Draw 2D Bounding Boxes, Pose Skeletons & Status Badges
        for trk in active_trackers:
            x1, y1, x2, y2 = trk.last_bbox
            dist_m = float(np.linalg.norm(trk.x[:3]))

            # Color palette
            if trk.time_since_update > 0:
                box_col = (0, 140, 255)  # Orange for coasting prediction
            elif trk.track_type == "FUSED":
                if dist_m < 2.5:
                    box_col = (0, 45, 255)   # Red for close obstacle
                elif dist_m < 5.0:
                    box_col = (0, 215, 255)  # Yellow for caution
                else:
                    box_col = (0, 255, 120)  # Green for safe distance
            else:
                box_col = (255, 215, 0)      # Cyan for vision-confirmed actor

            cv2.rectangle(cam_canvas, (x1, y1), (x2, y2), box_col, 2, cv2.LINE_AA)

            # Pose skeleton with dual-joint confidence gating
            if trk.last_kpts is not None and trk.last_kconfs is not None:
                kpts = trk.last_kpts
                confs = trk.last_kconfs
                for (p1, p2) in SKELETON_EDGES:
                    if p1 < len(confs) and p2 < len(confs):
                        if confs[p1] >= skel_thresh and confs[p2] >= skel_thresh:
                            pt1 = (int(kpts[p1, 0]), int(kpts[p1, 1]))
                            pt2 = (int(kpts[p2, 0]), int(kpts[p2, 1]))
                            cv2.line(cam_canvas, pt1, pt2, (0, 255, 255), 2, cv2.LINE_AA)
                for p_idx in range(len(confs)):
                    if confs[p_idx] >= skel_thresh:
                        pt = (int(kpts[p_idx, 0]), int(kpts[p_idx, 1]))
                        cv2.circle(cam_canvas, pt, 3, (0, 255, 255), -1, cv2.LINE_AA)

            # Badges
            src_str = "PRED" if trk.time_since_update > 0 else (f"FUSED {trk.pts_count}p" if trk.track_type == "FUSED" else "VISION")
            tag = f"ID:{trk.id} [{src_str}] {dist_m:.2f}m"
            (tw, th), _ = cv2.getTextSize(tag, cv2.FONT_HERSHEY_SIMPLEX, 0.48, 1)
            b_y1 = max(0, y1 - th - 8)
            cv2.rectangle(cam_canvas, (x1, b_y1), (x1 + tw + 8, y1), box_col, -1)
            cv2.putText(cam_canvas, tag, (x1 + 4, y1 - 4), cv2.FONT_HERSHEY_SIMPLEX, 0.48, (0, 0, 0), 1, cv2.LINE_AA)

            speed = math.sqrt(trk.x[3]**2 + trk.x[4]**2)
            sub_tag = f"base: [{trk.x[0]:+.2f}, {trk.x[1]:+.2f}, {trk.x[2]:+.2f}]m | V:{speed:.1f}m/s"
            (stw, sth), _ = cv2.getTextSize(sub_tag, cv2.FONT_HERSHEY_SIMPLEX, 0.38, 1)
            cv2.rectangle(cam_canvas, (x1, y2), (x1 + stw + 8, y2 + sth + 6), (15, 15, 15), -1)
            cv2.putText(cam_canvas, sub_tag, (x1 + 4, y2 + sth + 2), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (0, 255, 255), 1, cv2.LINE_AA)

        cam_view_720 = cv2.resize(cam_canvas, (1280, 720), interpolation=cv2.INTER_AREA)

        # 2. Render 640x720 Top-Down BEV Radar (Unobstructed full vertical canvas)
        bev_w, bev_h = 640, 720
        bev_panel = np.zeros((bev_h, bev_w, 3), dtype=np.uint8)
        bev_panel[:] = (18, 20, 26)

        cx_b = bev_w // 2
        cy_b = int(bev_h * 0.90)
        max_r = float(self.get_parameter("max_radar_range_m").value)
        scale = (bev_h * 0.85) / max_r

        # Range rings
        for r in [2.5, 5.0, 7.5, 10.0, 12.5, 15.0]:
            r_px = int(r * scale)
            cv2.circle(bev_panel, (cx_b, cy_b), r_px, (40, 45, 55), 1, cv2.LINE_AA)
            cv2.putText(bev_panel, f"{r:.1f}m", (cx_b + 5, cy_b - r_px + 12), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (80, 90, 110), 1)

        # Vehicle footprint
        v_w = int(1.3 * scale)
        cv2.rectangle(bev_panel, (cx_b - v_w // 2, cy_b - int(1.8 * scale)), (cx_b + v_w // 2, cy_b + int(0.8 * scale)), (0, 165, 255), 2)
        cv2.putText(bev_panel, "E-TRIKE", (cx_b - 22, cy_b + 18), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 165, 255), 1)

        # Background LiDAR scatter across full BEV canvas
        xb = non_floor_pts[:, 0] + 0.5750
        yb = non_floor_pts[:, 1]
        valid_b = (xb > -1.5) & (xb < max_r) & (np.abs(yb) < max_r * 0.55)
        px_b = (cx_b - yb[valid_b] * scale).astype(int)
        py_b = (cy_b - xb[valid_b] * scale).astype(int)
        for px, py in zip(px_b, py_b):
            if 0 <= px < bev_w and 0 <= py < bev_h:
                bev_panel[py, px] = (75, 115, 130)

        # Plot tracked targets
        for trk in active_trackers:
            ox, oy, _ = trk.x[:3]
            od = float(np.linalg.norm(trk.x[:3]))
            px = int(cx_b - oy * scale)
            py = int(cy_b - ox * scale)
            if 0 <= px < bev_w and 0 <= py < bev_h:
                if trk.track_type == "FUSED":
                    col = (0, 45, 255) if od < 2.5 else ((0, 215, 255) if od < 5.0 else (0, 255, 120))
                else:
                    col = (255, 215, 0)

                cv2.circle(bev_panel, (px, py), 11, col, 2, cv2.LINE_AA)
                cv2.circle(bev_panel, (px, py), 3, col, -1)
                cv2.line(bev_panel, (cx_b, cy_b), (px, py), col, 1, cv2.LINE_AA)

                # Velocity vector
                vx = trk.x[3]
                vy = trk.x[4]
                end_x = int(px - vy * scale * 0.5)
                end_y = int(py - vx * scale * 0.5)
                cv2.arrowedLine(bev_panel, (px, py), (end_x, end_y), (0, 255, 255), 2, cv2.LINE_AA, tipLength=0.3)

                tag = f"ID:{trk.id} {od:.1f}m"
                cv2.putText(bev_panel, tag, (px - 22, py - 14), cv2.FONT_HERSHEY_SIMPLEX, 0.38, col, 1, cv2.LINE_AA)

        # 3. Publish ROS Image Messages
        try:
            if self._pub_debug_img is not None and self._pub_debug_img.is_activated:
                msg_dbg = self._bridge.cv2_to_imgmsg(cam_view_720, encoding="bgr8")
                msg_dbg.header.stamp = stamp
                msg_dbg.header.frame_id = "kinect_front_optical_link"
                self._pub_debug_img.publish(msg_dbg)

            if self._pub_bev_img is not None and self._pub_bev_img.is_activated:
                msg_bev = self._bridge.cv2_to_imgmsg(bev_panel, encoding="bgr8")
                msg_bev.header.stamp = stamp
                msg_bev.header.frame_id = "base_link"
                self._pub_bev_img.publish(msg_bev)

            if self._pub_dashboard is not None and self._pub_dashboard.is_activated:
                dash = np.hstack([cam_view_720, bev_panel])
                msg_dash = self._bridge.cv2_to_imgmsg(dash, encoding="bgr8")
                msg_dash.header.stamp = stamp
                msg_dash.header.frame_id = "base_link"
                self._pub_dashboard.publish(msg_dash)
        except Exception as e:
            self.get_logger().warn(f"Failed to publish image streams: {e}")


def main(args: Optional[List[str]] = None) -> None:
    rclpy.init(args=args)
    node = CameraLidarFusionNode()

    # Automatically transition LifecycleNode: unconfigured -> inactive -> active
    node.trigger_configure()
    node.trigger_activate()

    try:
        rclpy.spin(node)
    except (KeyboardInterrupt, rclpy.executors.ExternalShutdownException):
        pass
    finally:
        node.trigger_deactivate()
        node.trigger_shutdown()
        node.destroy_node()
        rclpy.shutdown()


if __name__ == "__main__":
    main()
