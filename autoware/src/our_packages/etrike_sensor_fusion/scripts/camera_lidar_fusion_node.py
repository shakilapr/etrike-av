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
  3. 2D Bounding Boxes (/bench_perception/objects or internal YOLOv8)

Outputs (Strictly Isolated under /bench_perception/fusion/*):
  - /bench_perception/fusion/objects (autoware_perception_msgs/DetectedObjects)
  - /bench_perception/fusion/markers (visualization_msgs/MarkerArray)
  - /bench_perception/fusion/debug_image (sensor_msgs/Image)
  - /bench_perception/fusion/bev_image (sensor_msgs/Image)
  - /bench_perception/fusion/dashboard (sensor_msgs/Image - 1920x720 side-by-side)

Guaranteed zero interference with Autoware Universe simulation or vehicle planning.
"""

from __future__ import annotations

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
from std_msgs.msg import ColorRGBA, Header
from visualization_msgs.msg import Marker, MarkerArray


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

        self.declare_parameter("output_objects_topic", "/bench_perception/fusion/objects")
        self.declare_parameter("output_markers_topic", "/bench_perception/fusion/markers")
        self.declare_parameter("output_debug_image_topic", "/bench_perception/fusion/debug_image")
        self.declare_parameter("output_bev_image_topic", "/bench_perception/fusion/bev_image")
        self.declare_parameter("output_dashboard_topic", "/bench_perception/fusion/dashboard")

        self.declare_parameter("lidar_mount_x", 0.5750)
        self.declare_parameter("lidar_mount_y", 0.0000)
        self.declare_parameter("lidar_mount_z", 1.7464)
        self.declare_parameter("camera_mount_x", 1.2000)
        self.declare_parameter("camera_mount_y", 0.0000)
        self.declare_parameter("camera_mount_z", 1.0000)
        self.declare_parameter("camera_pitch_rad", 0.0000)

        self.declare_parameter("fx_color", 1081.372)
        self.declare_parameter("fy_color", 1081.372)
        self.declare_parameter("cx_color", 959.5)
        self.declare_parameter("cy_color", 539.5)

        self.declare_parameter("ground_filter_z_m", 0.15)
        self.declare_parameter("cluster_eps_m", 0.45)
        self.declare_parameter("cluster_min_pts", 3)
        self.declare_parameter("box_inner_margin", 0.08)
        self.declare_parameter("max_radar_range_m", 15.0)

        self.declare_parameter("auto_run_yolo", True)
        self.declare_parameter("yolo_model_path", "/workspace/av_project/yolov8n.pt")
        self.declare_parameter("confidence_threshold", 0.40)

        # Internal state
        self._bridge: CvBridge = CvBridge()
        self._last_image: Optional[np.ndarray] = None
        self._last_image_time: float = 0.0
        self._last_lidar_pts: Optional[np.ndarray] = None
        self._last_lidar_time: float = 0.0
        self._last_camera_objects: List[Dict[str, Any]] = []
        self._last_camera_objects_time: float = 0.0

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

        # Load standalone YOLO model if enabled
        if bool(self.get_parameter("auto_run_yolo").value):
            model_path = str(self.get_parameter("yolo_model_path").value)
            if not os.path.exists(model_path) and os.path.exists("yolov8n.pt"):
                model_path = "yolov8n.pt"
            if os.path.exists(model_path):
                try:
                    from ultralytics import YOLO
                    self.get_logger().info(f"Loading fallback YOLO model: {model_path}")
                    self._yolo_model = YOLO(model_path)
                except Exception as e:
                    self.get_logger().warn(f"Could not load fallback YOLO model: {e}")

        # Subscriptions
        img_topic = str(self.get_parameter("camera_image_topic").value)
        lidar_topic = str(self.get_parameter("lidar_points_topic").value)
        info_topic = str(self.get_parameter("camera_info_topic").value)
        objs_topic = str(self.get_parameter("camera_objects_topic").value)

        self._sub_image = self.create_subscription(Image, img_topic, self._on_image, qos_sensor)
        self._sub_lidar = self.create_subscription(PointCloud2, lidar_topic, self._on_lidar, qos_sensor)
        self._sub_cam_info = self.create_subscription(CameraInfo, info_topic, self._on_camera_info, qos_sensor)
        self._sub_objects = self.create_subscription(DetectedObjects, objs_topic, self._on_camera_objects, qos_pub)

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
        self._pub_objects = None
        self._pub_markers = None
        self._pub_debug_img = None
        self._pub_bev_img = None
        self._pub_dashboard = None
        self._last_image = None
        self._last_lidar_pts = None
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
        """Ingest upstream YOLO detections from /bench_perception/objects."""
        extracted = []
        for obj in msg.objects:
            conf = float(obj.existence_probability)
            cls_name = "object"
            if obj.classification:
                lbl = obj.classification[0].label
                if lbl == ObjectClassification.PEDESTRIAN:
                    cls_name = "person"
                elif lbl == ObjectClassification.CAR:
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
            # Emit empty heartbeat / keep alive
            empty_objs = DetectedObjects()
            empty_objs.header.stamp = self.get_clock().now().to_msg()
            empty_objs.header.frame_id = "base_link"
            if self._pub_objects is not None and self._pub_objects.is_activated:
                self._pub_objects.publish(empty_objs)
            return

        img = self._last_image.copy()
        h_orig, w_orig = img.shape[:2]
        lidar_pts = self._last_lidar_pts

        # 1. Project LiDAR points into Optical Frame and Image Plane
        proj = self._project_points(lidar_pts, w_orig, h_orig)

        # 2. Get 2D Detections (Received from /bench_perception/objects or local YOLO)
        detections_2d = self._detect_2d_boxes(img)

        # 3. 3D Spatial Association & Euclidean Clustering
        fused_objects = self._fuse_detections(detections_2d, proj)

        # 4. Publish Isolated ROS 2 Messages
        stamp = self.get_clock().now().to_msg()
        self._publish_ros_messages(fused_objects, stamp)

        # 5. Render & Publish Visual Debug Streams
        self._publish_visual_streams(img, proj, fused_objects, stamp)

    def _project_points(self, lidar_pts: np.ndarray, img_w: int, img_h: int) -> Dict[str, np.ndarray]:
        """Project 3D LiDAR points into camera coordinates and image pixels."""
        fx = float(self.get_parameter("fx_color").value)
        fy = float(self.get_parameter("fy_color").value)
        cx = float(self.get_parameter("cx_color").value)
        cy = float(self.get_parameter("cy_color").value)

        # Extrinsics
        # base_link: lidar=(0.575, 0, 1.7464), kinect=(1.20, 0, 1.00)
        # Optical: X_opt = -Y_lidar, Y_opt = -(Z_lidar + 0.7464), Z_opt = X_lidar - 0.6250
        x_l = lidar_pts[:, 0]
        y_l = lidar_pts[:, 1]
        z_l = lidar_pts[:, 2]

        z_opt = x_l - 0.6250
        x_opt = -y_l
        y_opt = -(z_l + 0.7464)

        front_mask = z_opt > 0.45
        pts_valid = lidar_pts[front_mask]
        z_opt = z_opt[front_mask]
        x_opt = x_opt[front_mask]
        y_opt = y_opt[front_mask]

        u = fx * (x_opt / z_opt) + cx
        v = fy * (y_opt / z_opt) + cy

        in_bounds = (u >= 0) & (u < img_w) & (v >= 0) & (v < img_h)

        return {
            "u": u[in_bounds].astype(int),
            "v": v[in_bounds].astype(int),
            "depth": z_opt[in_bounds],
            "base_x": pts_valid[in_bounds, 0] + 0.5750,
            "base_y": pts_valid[in_bounds, 1],
            "base_z": pts_valid[in_bounds, 2] + 1.7464,
        }

    def _detect_2d_boxes(self, img: np.ndarray) -> List[Dict[str, Any]]:
        """Obtain 2D bounding boxes from /bench_perception/objects or fallback local YOLO."""
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

            boxes = []
            for obj in self._last_camera_objects:
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

                if x2 > x1 + 15 and y2 > y1 + 20:
                    boxes.append({
                        "name": obj["class"],
                        "conf": obj["conf"],
                        "bbox": (x1, y1, x2, y2),
                    })
            if boxes:
                return boxes

        # 2. Fallback to local YOLO model if available
        boxes = []
        if self._yolo_model is not None:
            conf_thresh = float(self.get_parameter("confidence_threshold").value)
            try:
                results = self._yolo_model(img, conf=conf_thresh, verbose=False)
                for r in results:
                    for b in r.boxes:
                        cls_id = int(b.cls[0])
                        name = self._yolo_model.names[cls_id]
                        conf = float(b.conf[0])
                        x1, y1, x2, y2 = b.xyxy[0].tolist()
                        boxes.append({
                            "name": name,
                            "conf": conf,
                            "bbox": (int(x1), int(y1), int(x2), int(y2)),
                        })
            except Exception as e:
                self.get_logger().warn(f"Inference error: {e}")
        return boxes

    def _fuse_detections(self, detections: List[Dict[str, Any]], proj: Dict[str, np.ndarray]) -> List[Dict[str, Any]]:
        """Perform 3D Euclidean clustering inside bounding box frustums."""
        fused = []
        u_p = proj["u"]
        v_p = proj["v"]
        d_p = proj["depth"]
        bx_p = proj["base_x"]
        by_p = proj["base_y"]
        bz_p = proj["base_z"]

        margin = float(self.get_parameter("box_inner_margin").value)
        cluster_eps = float(self.get_parameter("cluster_eps_m").value)
        min_pts = int(self.get_parameter("cluster_min_pts").value)
        ground_z = float(self.get_parameter("ground_filter_z_m").value)

        for det in detections:
            x1, y1, x2, y2 = det["bbox"]
            bw = x2 - x1
            bh = y2 - y1

            # Filter points in 2D box frustum
            in_box = (
                (u_p >= x1 + margin * bw) & (u_p <= x2 - margin * bw) &
                (v_p >= y1 + margin * bh) & (v_p <= y2 - margin * bh)
            )

            box_d = d_p[in_box]
            box_x = bx_p[in_box]
            box_y = by_p[in_box]
            box_z = bz_p[in_box]

            if len(box_d) < min_pts:
                continue

            # Remove ground points (Z_base < ground_z)
            non_ground = box_z > ground_z
            if np.sum(non_ground) >= min_pts:
                b_d, b_x, b_y, b_z = box_d[non_ground], box_x[non_ground], box_y[non_ground], box_z[non_ground]
            else:
                b_d, b_x, b_y, b_z = box_d, box_x, box_y, box_z

            # 1D Depth Discontinuity Clustering
            sort_idx = np.argsort(b_d)
            d_sorted = b_d[sort_idx]
            x_sorted = b_x[sort_idx]
            y_sorted = b_y[sort_idx]
            z_sorted = b_z[sort_idx]

            splits = np.where(np.diff(d_sorted) > cluster_eps)[0] + 1
            clusters = np.split(np.arange(len(d_sorted)), splits)

            valid_clusters = [c for c in clusters if len(c) >= min_pts]
            if not valid_clusters:
                continue

            fg_idx = valid_clusters[0]  # Nearest obstacle = foreground human/object
            fg_d = d_sorted[fg_idx]
            fg_x = x_sorted[fg_idx]
            fg_y = y_sorted[fg_idx]
            fg_z = z_sorted[fg_idx]

            fused.append({
                "name": det["name"],
                "conf": det["conf"],
                "bbox": det["bbox"],
                "dist": float(np.median(fg_d)),
                "pts_count": len(fg_d),
                "total_frustum_pts": len(box_d),
                "pos_base": (float(np.median(fg_x)), float(np.median(fg_y)), float(np.median(fg_z))),
                "size_3d": (
                    max(0.5, float(np.ptp(fg_x))),
                    max(0.5, float(np.ptp(fg_y))),
                    max(1.0, float(np.ptp(fg_z))) if det["name"] == "person" else max(0.5, float(np.ptp(fg_z)))
                )
            })

        return fused

    def _publish_ros_messages(self, fused_objects: List[Dict[str, Any]], stamp: Any) -> None:
        """Publish isolated DetectedObjects and MarkerArray."""
        if self._pub_objects is None or not self._pub_objects.is_activated:
            return

        out_objs = DetectedObjects()
        out_objs.header.stamp = stamp
        out_objs.header.frame_id = "base_link"

        marker_arr = MarkerArray()

        for idx, obj in enumerate(fused_objects):
            ox, oy, oz = obj["pos_base"]
            sx, sy, sz = obj["size_3d"]

            det = DetectedObject()
            det.existence_probability = obj["conf"]

            cls_msg = ObjectClassification()
            cls_msg.probability = obj["conf"]
            if obj["name"] == "person":
                cls_msg.label = ObjectClassification.PEDESTRIAN
            elif obj["name"] == "car":
                cls_msg.label = ObjectClassification.CAR
            elif obj["name"] == "bicycle":
                cls_msg.label = ObjectClassification.BICYCLE
            else:
                cls_msg.label = ObjectClassification.UNKNOWN
            det.classification = [cls_msg]

            kin = DetectedObjectKinematics()
            kin.pose_with_covariance.pose.position = Point(x=ox, y=oy, z=oz)
            kin.pose_with_covariance.pose.orientation = Quaternion(x=0.0, y=0.0, z=0.0, w=1.0)
            det.kinematics = kin

            shape = Shape()
            shape.type = Shape.BOUNDING_BOX
            shape.dimensions = Vector3(x=sx, y=sy, z=sz)
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
            m_box.pose.position = Point(x=ox, y=oy, z=oz)
            m_box.pose.orientation = Quaternion(x=0.0, y=0.0, z=0.0, w=1.0)
            m_box.scale = Vector3(x=sx, y=sy, z=sz)
            m_box.color = ColorRGBA(r=0.0, g=1.0, b=0.4, a=0.55) if obj["dist"] > 3.0 else ColorRGBA(r=1.0, g=0.2, b=0.0, a=0.65)
            marker_arr.markers.append(m_box)

            # RViz Marker: Text Tag
            m_txt = Marker()
            m_txt.header.stamp = stamp
            m_txt.header.frame_id = "base_link"
            m_txt.ns = "fused_tags"
            m_txt.id = idx * 2 + 1
            m_txt.type = Marker.TEXT_VIEW_FACING
            m_txt.action = Marker.ADD
            m_txt.pose.position = Point(x=ox, y=oy, z=oz + sz / 2.0 + 0.3)
            m_txt.scale.z = 0.35
            m_txt.text = f"{obj['name'].upper()} {obj['dist']:.1f}m"
            m_txt.color = ColorRGBA(r=1.0, g=1.0, b=1.0, a=0.95)
            marker_arr.markers.append(m_txt)

        self._pub_objects.publish(out_objs)
        if self._pub_markers is not None and self._pub_markers.is_activated:
            self._pub_markers.publish(marker_arr)

    def _publish_visual_streams(
        self,
        img: np.ndarray,
        proj: Dict[str, np.ndarray],
        fused_objects: List[Dict[str, Any]],
        stamp: Any
    ) -> None:
        """Render annotated camera feed and BEV radar map, and publish images."""
        if (
            (self._pub_debug_img is None or not self._pub_debug_img.is_activated) and
            (self._pub_bev_img is None or not self._pub_bev_img.is_activated) and
            (self._pub_dashboard is None or not self._pub_dashboard.is_activated)
        ):
            return

        # 1. Overlay Depth-Colored LiDAR Points onto Camera Frame
        u_p, v_p, d_p = proj["u"], proj["v"], proj["depth"]
        overlay = img.copy()
        norm_depth = np.clip((d_p - 1.0) / 11.0, 0.0, 1.0)
        colors = cv2.applyColorMap((norm_depth * 255).astype(np.uint8), cv2.COLORMAP_TURBO)[:, 0, :]
        for (px, py), c in zip(zip(u_p, v_p), colors.tolist()):
            cv2.circle(overlay, (px, py), 2, c, -1)

        cam_blend = cv2.addWeighted(overlay, 0.50, img, 0.50, 0)

        # Draw 2D + 3D Fused Bounding Boxes
        for obj in fused_objects:
            x1, y1, x2, y2 = obj["bbox"]
            dist_m = obj["dist"]
            label = obj["name"].upper()
            ox, oy, oz = obj["pos_base"]

            box_col = (0, 45, 255) if dist_m < 2.5 else ((0, 215, 255) if dist_m < 5.0 else (0, 255, 120))
            cv2.rectangle(cam_blend, (x1, y1), (x2, y2), box_col, 3, cv2.LINE_AA)

            tag = f"{label} {dist_m:.2f}m [{obj['pts_count']} pts]"
            (tw, th), _ = cv2.getTextSize(tag, cv2.FONT_HERSHEY_SIMPLEX, 0.55, 2)
            cv2.rectangle(cam_blend, (x1, y1 - th - 10), (x1 + tw + 10, y1), box_col, -1)
            cv2.putText(cam_blend, tag, (x1 + 5, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 0, 0), 2, cv2.LINE_AA)

            badge = f"base_link: [{ox:.2f}, {oy:.2f}, {oz:.2f}]m"
            cv2.rectangle(cam_blend, (x1, y2), (x1 + 270, y2 + 20), (15, 15, 15), -1)
            cv2.putText(cam_blend, badge, (x1 + 4, y2 + 15), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (0, 255, 255), 1, cv2.LINE_AA)

        cam_view = cv2.resize(cam_blend, (1280, 720), interpolation=cv2.INTER_AREA)

        # 2. Render 640x720 Top-Down BEV Radar
        bev_panel = np.zeros((720, 640, 3), dtype=np.uint8)
        bev_panel[:] = (18, 20, 26)

        cx, cy = 320, 650
        max_r = float(self.get_parameter("max_radar_range_m").value)
        scale = 600.0 / max_r

        for r in [2.5, 5.0, 7.5, 10.0, 12.5, 15.0]:
            r_px = int(r * scale)
            cv2.circle(bev_panel, (cx, cy), r_px, (40, 45, 55), 1, cv2.LINE_AA)
            cv2.putText(bev_panel, f"{r:.1f}m", (cx + 5, cy - r_px + 12), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (80, 90, 110), 1)

        # Vehicle footprint
        v_w = int(1.3 * scale)
        cv2.rectangle(bev_panel, (cx - v_w//2, cy - int(1.8*scale)), (cx + v_w//2, cy + int(0.8*scale)), (0, 165, 255), 2)
        cv2.putText(bev_panel, "E-TRIKE", (cx - 22, cy + 18), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 165, 255), 1)

        # Plot background LiDAR points across full BEV canvas
        if self._last_lidar_pts is not None:
            xb = self._last_lidar_pts[:, 0] + 0.5750
            yb = self._last_lidar_pts[:, 1]
            valid_b = (xb > -1.5) & (xb < max_r) & (np.abs(yb) < max_r * 0.55)
            px_b = (cx - yb[valid_b] * scale).astype(int)
            py_b = (cy - xb[valid_b] * scale).astype(int)
            for px, py in zip(px_b, py_b):
                if 0 <= px < 640 and 0 <= py < 720:
                    bev_panel[py, px] = (75, 115, 130)

        # Plot fused targets
        for obj in fused_objects:
            ox, oy, _ = obj["pos_base"]
            od = obj["dist"]
            px = int(cx - oy * scale)
            py = int(cy - ox * scale)
            if 0 <= px < 640 and 0 <= py < 720:
                col = (0, 45, 255) if od < 2.5 else ((0, 215, 255) if od < 5.0 else (0, 255, 120))
                cv2.circle(bev_panel, (px, py), 12, col, 2, cv2.LINE_AA)
                cv2.line(bev_panel, (cx, cy), (px, py), col, 1, cv2.LINE_AA)
                cv2.putText(bev_panel, f"{obj['name'][:4].upper()} {od:.1f}m", (px - 22, py - 14),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.38, col, 1, cv2.LINE_AA)

        # 3. Publish ROS Image Messages
        try:
            if self._pub_debug_img is not None and self._pub_debug_img.is_activated:
                msg_dbg = self._bridge.cv2_to_imgmsg(cam_view, encoding="bgr8")
                msg_dbg.header.stamp = stamp
                msg_dbg.header.frame_id = "kinect_front_optical_link"
                self._pub_debug_img.publish(msg_dbg)

            if self._pub_bev_img is not None and self._pub_bev_img.is_activated:
                msg_bev = self._bridge.cv2_to_imgmsg(bev_panel, encoding="bgr8")
                msg_bev.header.stamp = stamp
                msg_bev.header.frame_id = "base_link"
                self._pub_bev_img.publish(msg_bev)

            if self._pub_dashboard is not None and self._pub_dashboard.is_activated:
                dash = np.hstack([cam_view, bev_panel])
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
