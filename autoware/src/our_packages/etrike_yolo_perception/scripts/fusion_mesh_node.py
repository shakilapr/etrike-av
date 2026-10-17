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

"""Camera + LiDAR Multi-Modal Fusion and 3D Human Mesh Generation LifecycleNode.

Provides unified perception by fusing:
  1. 2D/3D Camera detections & poses from YOLO/RTMPose
  2. 3D LiDAR point cloud geometric clusters from Hesai XT32

Outputs:
  - /perception/fusion/human_mesh_markers (visualization_msgs/MarkerArray)
    Metric 3D human body meshes rendered at real-world coordinates in base_link.
  - /perception/fusion/lidar_boxes_3d (visualization_msgs/MarkerArray)
    3D wireframe bounding boxes and distance text tags in base_link.
  - /perception/fusion/annotated_camera (sensor_msgs/Image)
    Annotated camera stream with fused multi-modal telemetry HUD.
"""

from __future__ import annotations

import json
import math
import time
from typing import Any, Dict, List, Optional, Tuple

import cv2
import numpy as np

import rclpy
from rclpy.lifecycle import LifecycleNode, LifecyclePublisher
from rclpy.lifecycle import LifecycleState, TransitionCallbackReturn
from rclpy.qos import QoSDurabilityPolicy, QoSHistoryPolicy, QoSProfile, QoSReliabilityPolicy

from autoware_perception_msgs.msg import DetectedObject, DetectedObjects, ObjectClassification
from cv_bridge import CvBridge
from geometry_msgs.msg import Point, Quaternion, Vector3
from sensor_msgs.msg import CameraInfo, Image
from std_msgs.msg import ColorRGBA, Header, String
from visualization_msgs.msg import Marker, MarkerArray


def yaw_to_quaternion(yaw: float) -> Quaternion:
    """Convert yaw angle (rad) around Z to geometry_msgs Quaternion."""
    q = Quaternion()
    q.x = 0.0
    q.y = 0.0
    q.z = math.sin(yaw * 0.5)
    q.w = math.cos(yaw * 0.5)
    return q


class FusionMeshNode(LifecycleNode):
    """LifecycleNode fusing Camera and LiDAR for 3D human mesh & box generation."""

    def __init__(self, node_name: str = "fusion_mesh_node") -> None:
        super().__init__(node_name)

        # Parameters
        self.declare_parameter("publish_rate_hz", 15.0)
        self.declare_parameter("sensor_timeout_sec", 1.2)
        self.declare_parameter("camera_image_topic", "/kinect_front/color/image_raw")
        self.declare_parameter("camera_info_topic", "/kinect_front/depth/camera_info")
        self.declare_parameter("camera_objects_topic", "/bench_perception/objects")
        self.declare_parameter("camera_poses_topic", "/bench_perception/human_poses")
        self.declare_parameter("lidar_clusters_topic", "/bench_perception/clusters")
        self.declare_parameter("mesh_resource_uri", "package://etrike_yolo_perception/models/human_model.obj")
        self.declare_parameter("fusion_dist_threshold_m", 2.2)

        # Extrinsics: Kinect optical frame relative to base_link
        # Optical +Z = fwd (base_link +X), Optical +X = right (base_link -Y), Optical +Y = down (base_link -Z)
        self._cam_x = 1.20
        self._cam_y = 0.00
        self._cam_z = 1.00

        # Intrinsics defaults (Kinect v2 depth/color calibrated)
        self._fx = 364.99
        self._fy = 364.99
        self._cx = 258.18
        self._cy = 206.16
        self._img_w = 960
        self._img_h = 540

        # Publishers
        self._pub_meshes: Optional[LifecyclePublisher] = None
        self._pub_boxes: Optional[LifecyclePublisher] = None
        self._pub_annotated_img: Optional[LifecyclePublisher] = None

        # Subscriptions & Timer
        self._sub_img: Optional[Any] = None
        self._sub_info: Optional[Any] = None
        self._sub_cam_objects: Optional[Any] = None
        self._sub_cam_poses: Optional[Any] = None
        self._sub_lidar_clusters: Optional[Any] = None
        self._timer: Optional[Any] = None

        # State Buffers
        self._bridge = CvBridge()
        self._latest_image: Optional[np.ndarray] = None
        self._last_image_time: float = 0.0

        self._latest_cam_objects: List[Dict[str, Any]] = []
        self._last_cam_objects_time: float = 0.0

        self._latest_cam_poses: List[Dict[str, Any]] = []
        self._last_cam_poses_time: float = 0.0

        self._latest_lidar_clusters: List[Dict[str, Any]] = []
        self._last_lidar_clusters_time: float = 0.0

        self._mesh_uri: str = ""

    def on_configure(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Configuring FusionMeshNode...")

        self._mesh_uri = str(self.get_parameter("mesh_resource_uri").value)

        qos_pub = QoSProfile(
            reliability=QoSReliabilityPolicy.RELIABLE,
            durability=QoSDurabilityPolicy.VOLATILE,
            history=QoSHistoryPolicy.KEEP_LAST,
            depth=10,
        )
        qos_sub = QoSProfile(
            reliability=QoSReliabilityPolicy.BEST_EFFORT,
            durability=QoSDurabilityPolicy.VOLATILE,
            history=QoSHistoryPolicy.KEEP_LAST,
            depth=1,
        )

        self._pub_meshes = self.create_lifecycle_publisher(
            MarkerArray, "/perception/fusion/human_mesh_markers", qos_pub
        )
        self._pub_boxes = self.create_lifecycle_publisher(
            MarkerArray, "/perception/fusion/lidar_boxes_3d", qos_pub
        )
        self._pub_annotated_img = self.create_lifecycle_publisher(
            Image, "/perception/fusion/annotated_camera", qos_pub
        )

        img_topic = str(self.get_parameter("camera_image_topic").value)
        info_topic = str(self.get_parameter("camera_info_topic").value)
        cam_objs_topic = str(self.get_parameter("camera_objects_topic").value)
        cam_poses_topic = str(self.get_parameter("camera_poses_topic").value)
        lidar_topic = str(self.get_parameter("lidar_clusters_topic").value)

        self._sub_img = self.create_subscription(Image, img_topic, self._on_image, qos_sub)
        self._sub_info = self.create_subscription(CameraInfo, info_topic, self._on_camera_info, qos_sub)
        self._sub_cam_objects = self.create_subscription(DetectedObjects, cam_objs_topic, self._on_cam_objects, qos_sub)
        self._sub_cam_poses = self.create_subscription(String, cam_poses_topic, self._on_cam_poses, qos_sub)
        self._sub_lidar_clusters = self.create_subscription(DetectedObjects, lidar_topic, self._on_lidar_clusters, qos_sub)

        self.get_logger().info("FusionMeshNode configured successfully.")
        return TransitionCallbackReturn.SUCCESS

    def on_activate(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Activating FusionMeshNode...")
        try:
            if self._pub_meshes:
                self._pub_meshes.on_activate(state)
            if self._pub_boxes:
                self._pub_boxes.on_activate(state)
            if self._pub_annotated_img:
                self._pub_annotated_img.on_activate(state)
        except TypeError:
            if self._pub_meshes:
                self._pub_meshes.on_activate()
            if self._pub_boxes:
                self._pub_boxes.on_activate()
            if self._pub_annotated_img:
                self._pub_annotated_img.on_activate()

        rate_hz = float(self.get_parameter("publish_rate_hz").value)
        timer_period = 1.0 / max(1.0, rate_hz)
        self._timer = self.create_timer(timer_period, self._on_timer)
        return TransitionCallbackReturn.SUCCESS

    def on_deactivate(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Deactivating FusionMeshNode...")
        if self._timer:
            self._timer.cancel()
            self._timer = None
        try:
            if self._pub_meshes:
                self._pub_meshes.on_deactivate(state)
            if self._pub_boxes:
                self._pub_boxes.on_deactivate(state)
            if self._pub_annotated_img:
                self._pub_annotated_img.on_deactivate(state)
        except TypeError:
            if self._pub_meshes:
                self._pub_meshes.on_deactivate()
            if self._pub_boxes:
                self._pub_boxes.on_deactivate()
            if self._pub_annotated_img:
                self._pub_annotated_img.on_deactivate()
        return TransitionCallbackReturn.SUCCESS

    def on_cleanup(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Cleaning up FusionMeshNode...")
        self._pub_meshes = None
        self._pub_boxes = None
        self._pub_annotated_img = None
        self._sub_img = None
        self._sub_info = None
        self._sub_cam_objects = None
        self._sub_cam_poses = None
        self._sub_lidar_clusters = None
        return TransitionCallbackReturn.SUCCESS

    def _on_camera_info(self, msg: CameraInfo) -> None:
        if msg.k[0] > 10.0:
            self._fx = float(msg.k[0])
            self._fy = float(msg.k[4])
            self._cx = float(msg.k[2])
            self._cy = float(msg.k[5])

    def _on_image(self, msg: Image) -> None:
        try:
            self._latest_image = self._bridge.imgmsg_to_cv2(msg, desired_encoding="bgr8")
            self._img_h, self._img_w = self._latest_image.shape[:2]
            self._last_image_time = time.time()
        except Exception as e:
            self.get_logger().warn(f"Failed to decode image: {e}")

    def _on_cam_objects(self, msg: DetectedObjects) -> None:
        cam_objs = []
        for obj in msg.objects:
            if obj.classification:
                c_lbl = obj.classification[0].label
                # Autoware ObjectClassification.PEDESTRIAN is 7, or string label
                if isinstance(c_lbl, int):
                    lbl = "person" if c_lbl == ObjectClassification.PEDESTRIAN else f"class_{c_lbl}"
                else:
                    lbl = str(c_lbl)
                prob = float(obj.classification[0].probability)
            else:
                lbl = "unknown"
                prob = 0.0
            pos = obj.kinematics.pose_with_covariance.pose.position
            dims = obj.shape.dimensions if obj.shape else Vector3(x=0.6, y=0.6, z=1.75)
            cam_objs.append({
                "label": lbl,
                "confidence": prob,
                "pos": np.array([pos.x, pos.y, pos.z], dtype=np.float32),
                "dims": np.array([dims.x, dims.y, dims.z], dtype=np.float32),
            })
        self._latest_cam_objects = cam_objs
        self._last_cam_objects_time = time.time()

    def _on_cam_poses(self, msg: String) -> None:
        try:
            data = json.loads(msg.data)
            self._latest_cam_poses = data.get("poses", [])
            self._last_cam_poses_time = time.time()
        except Exception:
            self._latest_cam_poses = []

    def _on_lidar_clusters(self, msg: DetectedObjects) -> None:
        clusters = []
        for obj in msg.objects:
            pos = obj.kinematics.pose_with_covariance.pose.position
            dims = obj.shape.dimensions if obj.shape else Vector3(x=0.5, y=0.5, z=1.7)
            # Evaluate aspect ratio and dimensions for pedestrian profile
            h = dims.z
            w = max(dims.x, dims.y)
            is_pedestrian_shape = (0.85 <= h <= 2.25) and (0.20 <= w <= 1.20)
            clusters.append({
                "pos": np.array([pos.x, pos.y, pos.z], dtype=np.float32),
                "dims": np.array([dims.x, dims.y, dims.z], dtype=np.float32),
                "is_pedestrian": is_pedestrian_shape,
            })
        self._latest_lidar_clusters = clusters
        self._last_lidar_clusters_time = time.time()

    def _project_base_link_to_pixel(self, pt: np.ndarray) -> Optional[Tuple[int, int]]:
        """Project 3D base_link point into camera pixel coordinates (u, v)."""
        # base_link to optical:
        # X_opt = -(Y_base - cam_y), Y_opt = -(Z_base - cam_z), Z_opt = X_base - cam_x
        z_opt = pt[0] - self._cam_x
        if z_opt < 0.3 or z_opt > 25.0:
            return None
        x_opt = -(pt[1] - self._cam_y)
        y_opt = -(pt[2] - self._cam_z)

        u = int(self._fx * x_opt / z_opt + self._cx)
        v = int(self._fy * y_opt / z_opt + self._cy)
        if 0 <= u < self._img_w and 0 <= v < self._img_h:
            return (u, v)
        return None

    def _on_timer(self) -> None:
        """Periodic multi-modal fusion, 3D mesh synthesis, and visualization emit."""
        now_time = time.time()
        timeout = float(self.get_parameter("sensor_timeout_sec").value)
        dist_thresh = float(self.get_parameter("fusion_dist_threshold_m").value)

        # 1. Gather valid sensor inputs with fail-closed timeout guards
        cam_active = (now_time - self._last_cam_objects_time) < timeout
        lidar_active = (now_time - self._last_lidar_clusters_time) < timeout

        cam_objs = self._latest_cam_objects if cam_active else []
        lidar_clusters = self._latest_lidar_clusters if lidar_active else []

        # 2. Perform Bipartite Multi-Modal Association
        fused_tracks: List[Dict[str, Any]] = []
        unmatched_lidar: List[Dict[str, Any]] = []
        matched_cam_indices = set()

        for l_idx, cl in enumerate(lidar_clusters):
            cl_pos = cl["pos"]
            best_cam_idx = -1
            best_dist = float("inf")

            for c_idx, co in enumerate(cam_objs):
                if c_idx in matched_cam_indices:
                    continue
                d = float(np.linalg.norm(cl_pos[:2] - co["pos"][:2]))
                if d < dist_thresh and d < best_dist:
                    best_dist = d
                    best_cam_idx = c_idx

            if best_cam_idx >= 0:
                matched_cam_indices.add(best_cam_idx)
                co = cam_objs[best_cam_idx]
                fused_tracks.append({
                    "type": "FUSED",
                    "pos": cl_pos,  # Exact metric 3D position from LiDAR
                    "dims": cl["dims"],
                    "confidence": max(0.85, float(co["confidence"])),
                    "label": "Person (Fused)",
                    "yaw": math.atan2(-cl_pos[1], -cl_pos[0]), # facing vehicle
                })
            else:
                if cl["is_pedestrian"]:
                    unmatched_lidar.append(cl)

        # Add LiDAR-only pedestrian detections
        for cl in unmatched_lidar:
            cl_pos = cl["pos"]
            fused_tracks.append({
                "type": "LIDAR_ONLY",
                "pos": cl_pos,
                "dims": cl["dims"],
                "confidence": 0.70,
                "label": "Person (LiDAR)",
                "yaw": math.atan2(-cl_pos[1], -cl_pos[0]),
            })

        # Add Camera-only pedestrian detections (suppress if already spatially covered by a fused/lidar track)
        for c_idx, co in enumerate(cam_objs):
            if c_idx not in matched_cam_indices and "person" in str(co["label"]).lower():
                co_pos = co["pos"]
                # Skip camera detection if any track is already present within dist_thresh
                already_covered = any(
                    float(np.linalg.norm(co_pos[:2] - trk["pos"][:2])) < dist_thresh
                    for trk in fused_tracks
                )
                if not already_covered:
                    fused_tracks.append({
                        "type": "CAMERA_ONLY",
                        "pos": co_pos,
                        "dims": co["dims"],
                        "confidence": float(co["confidence"]),
                        "label": "Person (Camera)",
                        "yaw": math.atan2(-co_pos[1], -co_pos[0]),
                    })

        # 2b. Spatial Deduplication: Suppress true physical duplicates (< 0.45m shoulder overlap)
        # or cross-modality leftovers (FUSED overriding leftover CAMERA_ONLY/LIDAR_ONLY within 0.8m).
        # Distinct detections (e.g. two people walking 1.0m apart) must ALWAYS be preserved.
        clean_tracks: List[Dict[str, Any]] = []
        type_priority = {"FUSED": 3, "CAMERA_ONLY": 2, "LIDAR_ONLY": 1}
        sorted_tracks = sorted(
            fused_tracks,
            key=lambda t: (type_priority.get(t["type"], 0), float(t.get("confidence", 0.0))),
            reverse=True,
        )
        for candidate in sorted_tracks:
            c_pos = candidate["pos"]
            c_type = candidate["type"]
            overlap = False
            for accepted in clean_tracks:
                dist = float(np.linalg.norm(c_pos[:2] - accepted["pos"][:2]))
                a_type = accepted["type"]
                # 1. Physical volume overlap (center-to-center distance < 0.45m)
                if dist < 0.45:
                    overlap = True
                    break
                # 2. Cross-modality leftover: FUSED already explains this location within 0.8m
                if a_type == "FUSED" and c_type != "FUSED" and dist < 0.8:
                    overlap = True
                    break
            if not overlap:
                clean_tracks.append(candidate)
        fused_tracks = clean_tracks

        # 3. Build & Publish 3D Mesh and Box MarkerArrays
        self._publish_visualizations(fused_tracks)

        # 4. Annotate & Publish In-Camera HUD
        self._publish_camera_hud(fused_tracks)

    def _publish_visualizations(self, tracks: List[Dict[str, Any]]) -> None:
        header = Header()
        header.stamp = self.get_clock().now().to_msg()
        header.frame_id = "base_link"

        mesh_markers = MarkerArray()
        box_markers = MarkerArray()

        # Delete old markers cleanly
        del_marker = Marker()
        del_marker.header = header
        del_marker.action = Marker.DELETEALL
        mesh_markers.markers.append(del_marker)
        box_markers.markers.append(del_marker)

        for idx, trk in enumerate(tracks):
            pos = trk["pos"]
            dims = trk["dims"]
            trk_type = trk["type"]
            dist_2d = math.hypot(pos[0], pos[1])

            # Resolve Semantic Colors
            if trk_type == "FUSED":
                color_mesh = ColorRGBA(r=0.0, g=0.92, b=1.0, a=0.95)   # Vivid Cyan / Teal
                color_box = ColorRGBA(r=0.0, g=0.92, b=1.0, a=0.85)
            elif trk_type == "LIDAR_ONLY":
                color_mesh = ColorRGBA(r=1.0, g=0.55, b=0.0, a=0.95)   # High-vis Orange
                color_box = ColorRGBA(r=1.0, g=0.55, b=0.0, a=0.85)
            else:
                color_mesh = ColorRGBA(r=1.0, g=0.85, b=0.1, a=0.90)   # Yellow
                color_box = ColorRGBA(r=1.0, g=0.85, b=0.1, a=0.80)

            # --- A. 3D Human Mesh Marker ---
            mesh_m = Marker()
            mesh_m.header = header
            mesh_m.ns = "human_3d_meshes"
            mesh_m.id = idx * 2 + 1
            mesh_m.type = Marker.MESH_RESOURCE
            mesh_m.action = Marker.ADD
            mesh_m.mesh_resource = self._mesh_uri
            mesh_m.mesh_use_embedded_materials = False

            # Model default is standing at (0, 0, 0) with height 1.75m
            target_height = max(1.10, min(2.10, float(dims[2])))
            scale_factor = target_height / 1.75

            # Position mesh feet on ground (Z bottom of cluster)
            mesh_m.pose.position.x = float(pos[0])
            mesh_m.pose.position.y = float(pos[1])
            mesh_m.pose.position.z = float(pos[2] - dims[2] * 0.5) # bottom alignment
            mesh_m.pose.orientation = yaw_to_quaternion(float(trk["yaw"]))

            mesh_m.scale.x = scale_factor
            mesh_m.scale.y = scale_factor
            mesh_m.scale.z = scale_factor
            mesh_m.color = color_mesh
            mesh_markers.markers.append(mesh_m)

            # --- B. 3D Bounding Box Marker (Wireframe) ---
            box_m = Marker()
            box_m.header = header
            box_m.ns = "fusion_3d_boxes"
            box_m.id = idx * 2 + 2
            box_m.type = Marker.CUBE
            box_m.action = Marker.ADD
            box_m.pose.position.x = float(pos[0])
            box_m.pose.position.y = float(pos[1])
            box_m.pose.position.z = float(pos[2])
            box_m.pose.orientation = yaw_to_quaternion(float(trk["yaw"]))
            box_m.scale.x = float(max(0.40, dims[0]))
            box_m.scale.y = float(max(0.40, dims[1]))
            box_m.scale.z = float(max(0.80, dims[2]))
            # Semitransparent volume for depth visualization
            box_m.color = ColorRGBA(r=color_box.r, g=color_box.g, b=color_box.b, a=0.22)
            box_markers.markers.append(box_m)

            # --- C. Floating Text Telemetry Label ---
            text_m = Marker()
            text_m.header = header
            text_m.ns = "fusion_labels"
            text_m.id = idx + 100
            text_m.type = Marker.TEXT_VIEW_FACING
            text_m.action = Marker.ADD
            text_m.pose.position.x = float(pos[0])
            text_m.pose.position.y = float(pos[1])
            text_m.pose.position.z = float(pos[2] + dims[2] * 0.5 + 0.35)
            text_m.scale.z = 0.32 # text size
            text_m.color = ColorRGBA(r=1.0, g=1.0, b=1.0, a=0.98)
            text_m.text = f"{trk_type}\n{dist_2d:.1f} m"
            box_markers.markers.append(text_m)

        if self._pub_meshes:
            self._pub_meshes.publish(mesh_markers)
        if self._pub_boxes:
            self._pub_boxes.publish(box_markers)

    def _publish_camera_hud(self, tracks: List[Dict[str, Any]]) -> None:
        """Render in-camera HUD overlay with 2D bounds and fused distance tags."""
        if self._latest_image is None or self._pub_annotated_img is None:
            return

        hud = self._latest_image.copy()

        # Telemetry Header Bar
        cv2.rectangle(hud, (0, 0), (self._img_w, 42), (20, 22, 28), -1)
        cv2.putText(
            hud,
            f"MULTI-MODAL FUSION HUD | DETECTED: {len(tracks)} PEOPLE | Hesai XT32 + Kinect v2",
            (16, 28),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.65,
            (0, 225, 255),
            2,
            cv2.LINE_AA,
        )

        for trk in tracks:
            pos = trk["pos"]
            dist_2d = math.hypot(pos[0], pos[1])
            trk_type = trk["type"]

            if trk_type == "FUSED":
                box_color = (255, 225, 0)   # BGR Cyan/Yellow
            elif trk_type == "LIDAR_ONLY":
                box_color = (0, 140, 255)   # BGR Orange
            else:
                box_color = (0, 215, 255)   # BGR Yellow

            # Project cluster position to camera pixel
            px = self._project_base_link_to_pixel(pos)
            if px is not None:
                u, v = px
                # Draw targeting reticle
                radius = max(24, int(180.0 / max(1.0, dist_2d)))
                cv2.circle(hud, (u, v), radius, box_color, 2, cv2.LINE_AA)
                cv2.circle(hud, (u, v), 4, box_color, -1)

                badge = f"[{trk_type}] {dist_2d:.1f}m"
                (tw, th), _ = cv2.getTextSize(badge, cv2.FONT_HERSHEY_SIMPLEX, 0.55, 2)
                cv2.rectangle(hud, (u - tw // 2 - 4, v - radius - th - 8), (u + tw // 2 + 4, v - radius), (20, 22, 28), -1)
                cv2.putText(hud, badge, (u - tw // 2, v - radius - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.55, box_color, 2, cv2.LINE_AA)

        try:
            out_msg = self._bridge.cv2_to_imgmsg(hud, encoding="bgr8")
            out_msg.header.stamp = self.get_clock().now().to_msg()
            out_msg.header.frame_id = "kinect_front_optical_link"
            self._pub_annotated_img.publish(out_msg)
        except Exception as e:
            self.get_logger().warn(f"Failed to publish HUD image: {e}")


def main(args: Optional[List[str]] = None) -> None:
    rclpy.init(args=args)
    node = FusionMeshNode()
    try:
        # Standard auto-activation sequence for LifecycleNode
        node.trigger_configure()
        node.trigger_activate()
        rclpy.spin(node)
    except (KeyboardInterrupt, rclpy.executors.ExternalShutdownException):
        pass
    finally:
        try:
            node.trigger_deactivate()
            node.trigger_cleanup()
        except Exception:
            pass
        node.destroy_node()
        if rclpy.ok():
            rclpy.shutdown()


if __name__ == "__main__":
    main()
