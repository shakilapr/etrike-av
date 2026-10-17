"""ROS 2 Bridge for AV Dashboard.

Subscribes to live Autoware Universe perception, planning, and localization topics:
- /perception/object_recognition/tracking/objects (autoware_perception_msgs/msg/TrackedObjects)
- /perception/object_recognition/objects (autoware_perception_msgs/msg/PredictedObjects)
- /perception/object_recognition/detection/objects (autoware_perception_msgs/msg/DetectedObjects)
- /planning/scenario_planning/trajectory (autoware_planning_msgs/msg/Trajectory)
- /localization/kinematic_state (nav_msgs/msg/Odometry)

Transforms all coordinates from global map frame into vehicle-relative (base_link) frame
and provides thread-safe access for the WebSocket broadcaster.

Ego pose resolution order:
1. Odometry (/localization/kinematic_state or /current_pose) when fresh.
2. tf2 lookup map -> base_link (covers stacks that only publish TF).
3. Fall back to a relative assumption (only valid when objects are already base_link).

Perception sources are kept separate (tracking / prediction / detection) so the UI can
prefer stable tracks and never mix fickle detection poses with tracked identities.
"""

from __future__ import annotations

import math
import threading
import time
from typing import Any, Dict, List, Optional, Tuple

from .lidar_streamer import LidarStreamer

# Classification enum mapping from Autoware ObjectClassification.msg
LABEL_MAP: Dict[int, str] = {
    0: "UNKNOWN",
    1: "CAR",
    2: "TRUCK",
    3: "BUS",
    4: "TRUCK",       # TRAILER
    5: "MOTORCYCLE",
    6: "BICYCLE",
    7: "PEDESTRIAN",
    8: "PEDESTRIAN",  # ANIMAL
    9: "BOX",         # HAZARD
    10: "UNKNOWN",    # OVER_DRIVABLE
    11: "UNKNOWN",    # UNDER_DRIVABLE
}

# Preference order when several perception sources are live simultaneously.
SOURCE_PRIORITY: Tuple[str, ...] = ("tracking", "prediction", "detection")

# A perception source is considered "fresh" for this long after its last message.
SOURCE_STALE_SEC: float = 1.5
# Odometry is preferred over TF for this long after its last message.
ODOM_FRESH_SEC: float = 1.0

# Single canonical base_link -> Three.js longitudinal offset (metres). base_link is
# the ground projection of the rear axle; the cockpit scene origin is the wheelbase
# center, 1.0 m ahead of it. Shared by the perception transforms here and by
# LidarStreamer (three_z = 1.0 - base_x) so every producer lands in one frame.
BASE_LINK_TO_SCENE_Z_OFFSET: float = 1.0


def quaternion_to_yaw(qx: float, qy: float, qz: float, qw: float) -> float:
    """Extract yaw angle (radians) around Z axis from a quaternion."""
    siny_cosp = 2.0 * (qw * qz + qx * qy)
    cosy_cosp = 1.0 - 2.0 * (qy * qy + qz * qz)
    return math.atan2(siny_cosp, cosy_cosp)


class Ros2Bridge:
    """Thread-safe background ROS 2 subscriber bridge."""

    def __init__(self) -> None:
        self.is_available: bool = False
        self.is_running: bool = False
        self._thread: Optional[threading.Thread] = None
        self._lock: threading.Lock = threading.Lock()
        self._last_error: Optional[str] = None

        # Subscription status keyed by logical topic name (True = created OK)
        self._subscribed: Dict[str, bool] = {}

        # Ego vehicle state in map frame
        self._ego_x: float = 0.0
        self._ego_y: float = 0.0
        self._ego_z: float = 0.0
        self._ego_yaw: float = 0.0
        self._ego_speed_kmh: float = 0.0
        self._ego_yaw_rate_mrad_s: float = 0.0
        self._has_ego_pose: bool = False
        self._ego_time: float = 0.0
        self._tf_buffer: Any = None

        # Per-source converted objects (vehicle-relative, Three.js coordinates)
        self._sources: Dict[str, List[Dict[str, Any]]] = {
            "tracking": [],
            "prediction": [],
            "detection": [],
        }
        self._source_time: Dict[str, float] = {"tracking": 0.0, "prediction": 0.0, "detection": 0.0}
        self._source_frame: Dict[str, str] = {"tracking": "", "prediction": "", "detection": ""}
        self._source_pose_ok: Dict[str, bool] = {"tracking": False, "prediction": False, "detection": False}
        self._topic_counts: Dict[str, int] = {
            "tracking": 0,
            "prediction": 0,
            "detection": 0,
            "trajectory": 0,
            "odometry": 0,
            "pose": 0,
            "tf": 0,
        }
        self._perception_timestamps: List[float] = []
        self._last_detection_canonical_time: float = 0.0

        # Live planned trajectory points (vehicle-relative, Three.js coordinates)
        self._planned_trajectory: List[Dict[str, float]] = []
        self._last_trajectory_time: float = 0.0
        self._trajectory_frame: str = ""
        self._trajectory_pose_ok: bool = False

        # Live ROS 2 vehicle status / command fallback (for --universe mode without CAN)
        self._veh_speed_act_kmh: Optional[float] = None
        self._veh_speed_cmd_kmh: Optional[float] = None
        self._veh_steer_act_deg: Optional[float] = None
        self._veh_steer_cmd_deg: Optional[float] = None
        self._veh_gear: Optional[str] = None
        self._veh_mode: Optional[str] = None
        self._veh_turn_left: bool = False
        self._veh_turn_right: bool = False
        self._veh_hazard: bool = False
        self._veh_status_time: float = 0.0

        # Standalone Camera + LiDAR bench perception telemetry
        self._bench_perception_status: Dict[str, Any] = {
            "mode": "UNAVAILABLE",
            "object_count": 0,
            "latency_ms": 0.0,
            "camera_online": False,
            "lidar_online": False,
            "camera_connected": False,
            "lidar_connected": False,
            "timestamp": 0.0,
        }
        self._bench_perception_time: float = 0.0
        # Dedicated perception stores for Camera and LiDAR
        self._camera_objects: List[Dict[str, Any]] = []
        self._lidar_objects: List[Dict[str, Any]] = []
        self._last_camera_image_time: float = 0.0
        self._last_camera_det_time: float = 0.0
        self._last_lidar_raw_time: float = 0.0
        self._last_lidar_cluster_time: float = 0.0
        self._camera_timestamps: List[float] = []
        self._lidar_timestamps: List[float] = []
        # Human skeletal poses (RTMPose-s)
        self._human_poses: Dict[str, Any] = {}
        self._human_poses_time: float = 0.0
        # Camera debug stream
        self._latest_jpeg: Optional[bytes] = None
        self._latest_jpeg_time: float = 0.0
        self._latest_debug_jpeg_time: float = 0.0
        # Dedicated 3D Multi-modal Fusion tracks (from fusion_mesh_node /perception/fusion/lidar_boxes_3d)
        self._fusion_tracks: List[Dict[str, Any]] = []
        self._last_fusion_tracks_time: float = 0.0
        # Dedicated real LiDAR pointcloud streamer
        self.lidar_streamer: LidarStreamer = LidarStreamer()

    def start(self) -> None:
        """Start the ROS 2 node in a background daemon thread."""
        try:
            import rclpy  # noqa: F401
            self.is_available = True
        except ImportError:
            self._last_error = "rclpy not importable in this Python environment"
            print("[ROS 2 Bridge] rclpy not installed or unavailable in this Python environment.")
            self.is_available = False
            return

        self.is_running = True
        self._thread = threading.Thread(target=self._run_ros2_node, daemon=True)
        self._thread.start()
        print("[ROS 2 Bridge] Started background ROS 2 bridge thread.")

    def stop(self) -> None:
        """Stop the ROS 2 bridge."""
        self.is_running = False

    def _mark_subscribed(self, name: str, ok: bool) -> None:
        self._subscribed[name] = ok

    def _run_ros2_node(self) -> None:
        """Background thread target that initializes rclpy and spins the node."""
        import rclpy
        from rclpy.node import Node
        from rclpy.qos import QoSDurabilityPolicy, QoSHistoryPolicy, QoSProfile, QoSReliabilityPolicy

        try:
            if not rclpy.ok():
                rclpy.init(args=None)

            node = Node("av_dashboard_ros2_bridge")

            # Universal sensor QoS profile: BEST_EFFORT + VOLATILE connects to BOTH reliable and best-effort publishers
            qos_sensor = QoSProfile(
                reliability=QoSReliabilityPolicy.BEST_EFFORT,
                durability=QoSDurabilityPolicy.VOLATILE,
                history=QoSHistoryPolicy.KEEP_LAST,
                depth=1,
            )

            # 0. tf2 buffer/listener for map -> base_link fallback
            try:
                from tf2_ros import Buffer, TransformListener
                self._tf_buffer = Buffer()
                TransformListener(self._tf_buffer, node, spin_thread=False)
                node.create_timer(0.05, self._update_ego_from_tf)
                self._mark_subscribed("tf", True)
                print("[ROS 2 Bridge] tf2 map->base_link fallback enabled")
            except Exception as e:
                self._mark_subscribed("tf", False)
                print(f"[ROS 2 Bridge] tf2 unavailable (odometry only): {e}")

            # 1. Ego Pose from Localization (Multiple candidate topics)
            try:
                from nav_msgs.msg import Odometry
                node.create_subscription(
                    Odometry,
                    "/localization/kinematic_state",
                    self._on_odometry,
                    qos_sensor,
                )
                node.create_subscription(
                    Odometry,
                    "/localization/pose_twist_fusion_filter/kinematic_state",
                    self._on_odometry,
                    qos_sensor,
                )
                self._mark_subscribed("odometry", True)
                print("[ROS 2 Bridge] Subscribed to ego odometry topics")
            except Exception as e:
                self._mark_subscribed("odometry", False)
                print(f"[ROS 2 Bridge] Odometry subscription failed: {e}")

            try:
                from geometry_msgs.msg import PoseStamped
                node.create_subscription(
                    PoseStamped,
                    "/current_pose",
                    self._on_pose_stamped,
                    qos_sensor,
                )
                self._mark_subscribed("pose", True)
                print("[ROS 2 Bridge] Subscribed to /current_pose")
            except Exception:
                self._mark_subscribed("pose", False)

            # 2. Perception Objects (TrackedObjects, PredictedObjects, DetectedObjects)
            try:
                from autoware_perception_msgs.msg import TrackedObjects
                node.create_subscription(
                    TrackedObjects,
                    "/perception/object_recognition/tracking/objects",
                    self._on_tracked_objects,
                    qos_sensor,
                )
                self._mark_subscribed("tracking", True)
                print("[ROS 2 Bridge] Subscribed to /perception/object_recognition/tracking/objects")
            except Exception as e:
                self._mark_subscribed("tracking", False)
                print(f"[ROS 2 Bridge] TrackedObjects subscription failed: {e}")

            try:
                from autoware_perception_msgs.msg import PredictedObjects
                node.create_subscription(
                    PredictedObjects,
                    "/perception/object_recognition/objects",
                    self._on_predicted_objects,
                    qos_sensor,
                )
                self._mark_subscribed("prediction", True)
                print("[ROS 2 Bridge] Subscribed to /perception/object_recognition/objects")
            except Exception as e:
                self._mark_subscribed("prediction", False)
                print(f"[ROS 2 Bridge] PredictedObjects subscription failed: {e}")

            try:
                from autoware_perception_msgs.msg import DetectedObjects
                # Dedicated camera detection topics (YOLO26x / Bench Perception)
                for cam_topic in (
                    "/bench_perception/objects",
                    "/perception/camera/objects",
                ):
                    node.create_subscription(
                        DetectedObjects,
                        cam_topic,
                        self._on_camera_detected_objects,
                        qos_sensor,
                    )
                for det_topic in (
                    "/perception/object_recognition/detection/objects",
                    "/perception/object_recognition/detection/centerpoint/objects",
                    "/perception/object_recognition/detection/centerpoint/validation/objects",
                ):
                    node.create_subscription(
                        DetectedObjects,
                        det_topic,
                        self._on_detected_objects,
                        qos_sensor,
                    )
                for cluster_topic in (
                    "/bench_perception/clusters",
                    "/perception/object_recognition/detection/clustering/objects",
                ):
                    node.create_subscription(
                        DetectedObjects,
                        cluster_topic,
                        self._on_clustering_objects,
                        qos_sensor,
                    )
                self._mark_subscribed("detection", True)
                print("[ROS 2 Bridge] Subscribed to perception detection topics (camera YOLO + 3D LiDAR detectors)")
            except Exception as e:
                self._mark_subscribed("detection", False)
                print(f"[ROS 2 Bridge] DetectedObjects subscription failed: {e}")

            # 2b. Standalone Bench Perception Status (CAMERA_ONLY / LIDAR_ONLY / FUSED)
            try:
                from std_msgs.msg import String
                node.create_subscription(
                    String,
                    "/bench_perception/status",
                    self._on_bench_perception_status,
                    qos_sensor,
                )
                self._mark_subscribed("bench_perception_status", True)
                print("[ROS 2 Bridge] Subscribed to /bench_perception/status")
            except Exception as e:
                self._mark_subscribed("bench_perception_status", False)
                print(f"[ROS 2 Bridge] Bench perception status subscription failed: {e}")

            # 2c. Human Skeletal Poses (YOLO26x-Pose / RTMPose-s)
            for pose_topic in ("/bench_perception/human_poses", "/perception/human_poses"):
                try:
                    from std_msgs.msg import String
                    node.create_subscription(
                        String,
                        pose_topic,
                        self._on_human_poses,
                        qos_sensor,
                    )
                    self._mark_subscribed("human_poses", True)
                    print(f"[ROS 2 Bridge] Subscribed to {pose_topic}")
                except Exception as e:
                    print(f"[ROS 2 Bridge] Human poses subscription to {pose_topic} failed: {e}")

            # 2d. Camera Image Streams (Annotated Debug image prioritized over raw fallback)
            try:
                from sensor_msgs.msg import Image
                for cam_img_topic in (
                    "/perception/fusion/annotated_camera",
                    "/bench_perception/camera/debug_image",
                ):
                    node.create_subscription(
                        Image,
                        cam_img_topic,
                        self._on_camera_debug_image,
                        qos_sensor,
                    )
                node.create_subscription(
                    Image,
                    "/kinect_front/color/image_raw",
                    self._on_camera_raw_image,
                    qos_sensor,
                )
                self._mark_subscribed("camera_debug_image", True)
                print("[ROS 2 Bridge] Subscribed to camera image topics (/perception/fusion/annotated_camera + /bench_perception/camera/debug_image + /kinect_front/color/image_raw)")
            except Exception as e:
                self._mark_subscribed("camera_debug_image", False)
                print(f"[ROS 2 Bridge] Camera image subscription failed: {e}")

            # 2e. LiDAR PointCloud Heartbeat / Telemetry
            try:
                from sensor_msgs.msg import PointCloud2
                for lidar_topic in (
                    "/sensing/lidar/top/pointcloud_raw_ex",
                    "/sensing/lidar/top/pointcloud_raw",
                    "/sensing/lidar/concatenated/pointcloud",
                    "/sensing/lidar/pointcloud",
                ):
                    node.create_subscription(
                        PointCloud2,
                        lidar_topic,
                        self._on_lidar_pointcloud,
                        qos_sensor,
                    )
                self._mark_subscribed("lidar_pointcloud", True)
                print("[ROS 2 Bridge] Subscribed to LiDAR pointcloud topics")
            except Exception as e:
                self._mark_subscribed("lidar_pointcloud", False)
                print(f"[ROS 2 Bridge] LiDAR pointcloud subscription failed: {e}")

            # 2f. 3D Multi-Modal Fusion Markers & Tracks from fusion_mesh_node
            try:
                from visualization_msgs.msg import MarkerArray
                node.create_subscription(
                    MarkerArray,
                    "/perception/fusion/lidar_boxes_3d",
                    self._on_fusion_boxes_marker_array,
                    qos_sensor,
                )
                self._mark_subscribed("fusion_boxes", True)
                print("[ROS 2 Bridge] Subscribed to /perception/fusion/lidar_boxes_3d")
            except Exception as e:
                self._mark_subscribed("fusion_boxes", False)
                print(f"[ROS 2 Bridge] Fusion boxes subscription failed: {e}")

            # 3. Planned Trajectory from Planning (Multiple candidate topics)
            try:
                from autoware_planning_msgs.msg import Trajectory
                node.create_subscription(
                    Trajectory,
                    "/planning/scenario_planning/trajectory",
                    self._on_trajectory,
                    qos_sensor,
                )
                node.create_subscription(
                    Trajectory,
                    "/planning/trajectory",
                    self._on_trajectory,
                    qos_sensor,
                )
                self._mark_subscribed("trajectory", True)
                print("[ROS 2 Bridge] Subscribed to planned trajectory topics")
            except Exception as e:
                self._mark_subscribed("trajectory", False)
                print(f"[ROS 2 Bridge] Trajectory subscription failed: {e}")

            # 4. Vehicle Status & Control Command (fallback for --universe mode without CAN)
            try:
                from autoware_vehicle_msgs.msg import (
                    ControlModeReport,
                    GearReport,
                    HazardLightsReport,
                    SteeringReport,
                    TurnIndicatorsReport,
                    VelocityReport,
                )
                node.create_subscription(
                    VelocityReport,
                    "/vehicle/status/velocity_status",
                    self._on_velocity_report,
                    qos_sensor,
                )
                node.create_subscription(
                    SteeringReport,
                    "/vehicle/status/steering_status",
                    self._on_steering_report,
                    qos_sensor,
                )
                node.create_subscription(
                    GearReport,
                    "/vehicle/status/gear_status",
                    self._on_gear_report,
                    qos_sensor,
                )
                node.create_subscription(
                    ControlModeReport,
                    "/vehicle/status/control_mode",
                    self._on_control_mode_report,
                    qos_sensor,
                )
                node.create_subscription(
                    TurnIndicatorsReport,
                    "/vehicle/status/turn_indicators_status",
                    self._on_turn_indicators_report,
                    qos_sensor,
                )
                node.create_subscription(
                    HazardLightsReport,
                    "/vehicle/status/hazard_lights_status",
                    self._on_hazard_lights_report,
                    qos_sensor,
                )
                self._mark_subscribed("vehicle_status", True)
            except Exception as e:
                self._mark_subscribed("vehicle_status", False)
                print(f"[ROS 2 Bridge] Vehicle status subscription failed: {e}")

            try:
                from autoware_control_msgs.msg import Control
                node.create_subscription(
                    Control,
                    "/control/command/control_cmd",
                    self._on_control_cmd,
                    qos_sensor,
                )
                self._mark_subscribed("control_cmd", True)
            except Exception as e:
                self._mark_subscribed("control_cmd", False)
                print(f"[ROS 2 Bridge] Control cmd subscription failed: {e}")

            while rclpy.ok() and self.is_running:
                rclpy.spin_once(node, timeout_sec=0.1)

            node.destroy_node()
        except Exception as err:
            self._last_error = str(err)
            print(f"[ROS 2 Bridge] Error during spin: {err}")
        finally:
            self.is_running = False

    def _on_odometry(self, msg: Any) -> None:
        """Handle incoming ego odometry."""
        pos = msg.pose.pose.position
        ori = msg.pose.pose.orientation
        yaw = quaternion_to_yaw(ori.x, ori.y, ori.z, ori.w)

        vx = 0.0
        wz = 0.0
        if hasattr(msg, "twist") and hasattr(msg.twist, "twist"):
            vx = float(msg.twist.twist.linear.x)
            wz = float(msg.twist.twist.angular.z)

        with self._lock:
            self._ego_x = float(pos.x)
            self._ego_y = float(pos.y)
            self._ego_z = float(pos.z)
            self._ego_yaw = yaw
            self._ego_speed_kmh = round(abs(vx) * 3.6, 1)
            self._ego_yaw_rate_mrad_s = round(wz * 1000.0, 1)
            self._has_ego_pose = True
            self._ego_time = time.time()
            self._topic_counts["odometry"] += 1

    def _on_pose_stamped(self, msg: Any) -> None:
        """Handle incoming PoseStamped."""
        pos = msg.pose.position
        ori = msg.pose.orientation
        yaw = quaternion_to_yaw(ori.x, ori.y, ori.z, ori.w)

        with self._lock:
            # Never let a lower-rate /current_pose override fresher odometry.
            if self._has_ego_pose and (time.time() - self._ego_time) < ODOM_FRESH_SEC:
                return
            self._ego_x = float(pos.x)
            self._ego_y = float(pos.y)
            self._ego_z = float(pos.z)
            self._ego_yaw = yaw
            self._has_ego_pose = True
            self._ego_time = time.time()
            self._topic_counts["pose"] += 1

    def _update_ego_from_tf(self) -> None:
        """Populate ego pose from TF when odometry is absent/stale (runs on ROS thread)."""
        if self._tf_buffer is None:
            return
        with self._lock:
            if self._has_ego_pose and (time.time() - self._ego_time) < ODOM_FRESH_SEC:
                return
        try:
            from rclpy.time import Time
            tf = self._tf_buffer.lookup_transform("map", "base_link", Time())
        except Exception:
            return

        tr = tf.transform.translation
        rot = tf.transform.rotation
        yaw = quaternion_to_yaw(rot.x, rot.y, rot.z, rot.w)
        with self._lock:
            self._ego_x = float(tr.x)
            self._ego_y = float(tr.y)
            self._ego_z = float(tr.z)
            self._ego_yaw = yaw
            self._has_ego_pose = True
            self._ego_time = time.time()
            self._topic_counts["tf"] += 1

    def _transform_map_to_base_link(
        self,
        x: float,
        y: float,
        z: float,
        yaw: float,
        ego_pose: Optional[Tuple[float, float, float, float]] = None,
    ) -> Tuple[float, float, float, float]:
        """Transform coordinates from map frame to ego vehicle base_link frame.

        Returns (three_x, three_y, three_z, rel_yaw) where:
        - three_x: Lateral offset in Three.js (meters, right is positive)
        - three_y: Elevation offset (meters, up is positive)
        - three_z: Longitudinal offset in Three.js (meters, forward is negative Z)
        - rel_yaw: Heading difference in radians
        """
        if ego_pose is not None:
            ego_x, ego_y, ego_z, ego_yaw = ego_pose
        else:
            with self._lock:
                ego_x, ego_y, ego_z, ego_yaw = self._ego_x, self._ego_y, self._ego_z, self._ego_yaw

        dx = x - ego_x
        dy = y - ego_y
        dz = z - ego_z

        cos_yaw = math.cos(ego_yaw)
        sin_yaw = math.sin(ego_yaw)

        # Base_link: forward (+X), left (+Y)
        base_x = cos_yaw * dx + sin_yaw * dy
        base_y = -sin_yaw * dx + cos_yaw * dy
        # Standard ROS REP-103 to Three.js orientation:
        # Standard right-handed transform: Yaw angle theta around ROS +Z (Up) maps
        # identically to rotation around Three.js +Y (Up) when Three.js X = -base_y and Z = -base_x.
        rel_yaw = yaw - ego_yaw

        # Three.js: right (+X), up (+Y), forward (-Z). The scene origin is the
        # wheelbase center, so base_link (REP-103, ground projection of the rear
        # axle) sits at Z = +1.0 m. This MUST match LidarStreamer.process_pointcloud
        # and the rendered Tuktuk model, where left is -X and right is +X.
        three_x = -base_y
        three_y = dz
        three_z = BASE_LINK_TO_SCENE_Z_OFFSET - base_x

        return (round(three_x, 2), round(three_y, 2), round(three_z, 2), round(rel_yaw, 2))

    @staticmethod
    def _relative_transform(x: float, y: float, z: float, yaw: float) -> Tuple[float, float, float, float]:
        """Convert an already base_link-relative pose (base: +X fwd, +Y left) to Three.js."""
        return (
            round(-y, 2),
            round(z, 2),
            round(BASE_LINK_TO_SCENE_Z_OFFSET - x, 2),
            round(yaw, 2),
        )

    def _classify(self, obj: Any) -> str:
        if hasattr(obj, "classification") and obj.classification:
            best = max(obj.classification, key=lambda c: getattr(c, "probability", 0.0))
            return LABEL_MAP.get(int(best.label), "UNKNOWN")
        return "UNKNOWN"

    def _object_id(self, obj: Any) -> str:
        object_id = getattr(obj, "object_id", None)
        if object_id is None:
            return ""
        raw_id = getattr(object_id, "uuid", None)
        if raw_id:
            try:
                return "".join(f"{b:02x}" for b in raw_id[:4])
            except Exception:
                return str(object_id)
        return str(object_id)

    def _extract_pose(self, obj: Any, is_predicted: bool) -> Optional[Any]:
        kin = getattr(obj, "kinematics", None)
        if kin is None:
            return None
        if is_predicted:
            pose_cov = getattr(kin, "initial_pose_with_covariance", None)
            if pose_cov is not None:
                return getattr(pose_cov, "pose", None)
        pose_cov = getattr(kin, "pose_with_covariance", None)
        if pose_cov is not None:
            return getattr(pose_cov, "pose", None)
        return getattr(kin, "pose", None)

    def _extract_twist(self, obj: Any, is_predicted: bool) -> Optional[Any]:
        kin = getattr(obj, "kinematics", None)
        if kin is None:
            return None
        if is_predicted:
            twist_cov = getattr(kin, "initial_twist_with_covariance", None)
            if twist_cov is not None:
                return getattr(twist_cov, "twist", None)
        twist_cov = getattr(kin, "twist_with_covariance", None)
        if twist_cov is not None:
            return getattr(twist_cov, "twist", None)
        return getattr(kin, "twist", None)

    def _convert_pose(
        self,
        x: float,
        y: float,
        z: float,
        yaw: float,
        is_map_frame: bool,
        pose_ok: bool,
        ego_pose: Optional[Tuple[float, float, float, float]] = None,
        sensor_tf: Optional[Tuple[float, float, float, float]] = None,
    ) -> Tuple[float, float, float, float]:
        if not is_map_frame:
            if sensor_tf is not None:
                sx, sy, sz, syaw = sensor_tf
                cos_s = math.cos(syaw)
                sin_s = math.sin(syaw)
                bx = sx + cos_s * x - sin_s * y
                by = sy + sin_s * x + cos_s * y
                bz = sz + z
                byaw = yaw + syaw
                return self._relative_transform(bx, by, bz, byaw)
            return self._relative_transform(x, y, z, yaw)
        if pose_ok:
            return self._transform_map_to_base_link(x, y, z, yaw, ego_pose=ego_pose)
        # No valid ego pose: coordinates are not trustworthy. Emit placeholders so the
        # HUD can honestly report "WAITING FOR LOCALIZATION" instead of drawing ghosts.
        return (0.0, 0.0, 0.0, 0.0)

    def _lookup_sensor_to_base_link(self, frame_id: str) -> Optional[Tuple[float, float, float, float]]:
        """Look up static/dynamic transform from sensor frame_id to base_link when available."""
        clean_frame = frame_id.lstrip("/")
        if not clean_frame or clean_frame == "base_link" or self._tf_buffer is None:
            return None
        try:
            from rclpy.time import Time
            tf = self._tf_buffer.lookup_transform("base_link", clean_frame, Time())
            tr = tf.transform.translation
            rot = tf.transform.rotation
            syaw = quaternion_to_yaw(rot.x, rot.y, rot.z, rot.w)
            return (float(tr.x), float(tr.y), float(tr.z), syaw)
        except Exception:
            return None

    def _process_objects_batch(
        self, objects: List[Any], frame_id: str, source: str, is_predicted: bool = False
    ) -> None:
        """Process and normalize raw Autoware perception objects for one source."""
        now = time.time()
        is_map_frame = ("map" in frame_id) or ("odom" in frame_id)
        sensor_tf = None if is_map_frame else self._lookup_sensor_to_base_link(frame_id)

        with self._lock:
            pose_ok = (not is_map_frame) or (self._has_ego_pose and (now - self._ego_time) < SOURCE_STALE_SEC)
            ego_snapshot = (self._ego_x, self._ego_y, self._ego_z, self._ego_yaw)

        converted: List[Dict[str, Any]] = []
        for obj in objects:
            pose = self._extract_pose(obj, is_predicted)
            if pose is None:
                continue

            pos = pose.position
            ori = pose.orientation
            yaw = quaternion_to_yaw(ori.x, ori.y, ori.z, ori.w)
            tx, ty, tz, rel_yaw = self._convert_pose(
                float(pos.x),
                float(pos.y),
                float(pos.z),
                yaw,
                is_map_frame,
                pose_ok,
                ego_pose=ego_snapshot,
                sensor_tf=sensor_tf,
            )

            label = self._classify(obj)

            dx, dy, dz = 2.0, 1.8, 1.5
            if hasattr(obj, "shape") and hasattr(obj.shape, "dimensions"):
                dx = float(obj.shape.dimensions.x)
                dy = float(obj.shape.dimensions.y)
                dz = float(obj.shape.dimensions.z)

            speed_kmh = 0.0
            twist = self._extract_twist(obj, is_predicted)
            if twist is not None:
                vx = twist.linear.x
                vy = twist.linear.y
                speed_kmh = round(math.sqrt(vx * vx + vy * vy) * 3.6, 1)

            converted.append({
                "id": self._object_id(obj) or f"det_{len(converted)}",
                "label": label,
                "x": tx,
                "y": ty,
                "z": tz,
                "dx": round(dx, 2),
                "dy": round(dy, 2),
                "dz": round(dz, 2),
                "yaw": rel_yaw,
                "speed_kmh": speed_kmh,
            })

        with self._lock:
            self._sources[source] = converted
            # CONFLICT GUARD: _camera_objects must only be set by _process_camera_objects_batch
            # (which handles /bench_perception/objects from YOLO). Do NOT let the generic
            # _on_detected_objects path (BEVFusion / Autoware detectors) overwrite it, as that
            # would cause ID collisions and break MHR's det_N actor-ID matching.
            self._source_time[source] = now
            self._source_frame[source] = frame_id
            self._source_pose_ok[source] = pose_ok
            self._topic_counts[source] = self._topic_counts.get(source, 0) + 1

            self._perception_timestamps.append(now)
            while self._perception_timestamps and (now - self._perception_timestamps[0]) > 1.0:
                self._perception_timestamps.pop(0)

    def _process_clustering_batch(self, objects: List[Any], frame_id: str) -> None:
        """Process LiDAR cluster bounding boxes into vehicle-relative Three.js coordinates."""
        now = time.time()
        is_map_frame = ("map" in frame_id) or ("odom" in frame_id)
        sensor_tf = None if is_map_frame else self._lookup_sensor_to_base_link(frame_id)

        with self._lock:
            pose_ok = (not is_map_frame) or (self._has_ego_pose and (now - self._ego_time) < SOURCE_STALE_SEC)
            ego_snapshot = (self._ego_x, self._ego_y, self._ego_z, self._ego_yaw)

        converted: List[Dict[str, Any]] = []
        for obj in objects:
            pose = self._extract_pose(obj, is_predicted=False)
            if pose is None:
                continue

            pos = pose.position
            ori = pose.orientation
            yaw = quaternion_to_yaw(ori.x, ori.y, ori.z, ori.w)
            tx, ty, tz, rel_yaw = self._convert_pose(
                float(pos.x),
                float(pos.y),
                float(pos.z),
                yaw,
                is_map_frame,
                pose_ok,
                ego_pose=ego_snapshot,
                sensor_tf=sensor_tf,
            )

            raw_label = self._classify(obj)
            label = "CLUSTER" if raw_label in ("UNKNOWN", "BOX", "") else raw_label

            dx, dy, dz = 1.0, 1.0, 1.0
            if hasattr(obj, "shape") and hasattr(obj.shape, "dimensions"):
                dx = float(obj.shape.dimensions.x)
                dy = float(obj.shape.dimensions.y)
                dz = float(obj.shape.dimensions.z)

            converted.append({
                "id": self._object_id(obj) or f"lidar_{len(converted)}",
                "label": label,
                "x": tx,
                "y": ty,
                "z": tz,
                "dx": round(dx, 2),
                "dy": round(dy, 2),
                "dz": round(dz, 2),
                "yaw": rel_yaw,
                "speed_kmh": 0.0,
                "sensor": "lidar",
            })

        with self._lock:
            self._lidar_objects = list(converted)
            self._sources["clustering"] = converted
            self._source_time["clustering"] = now
            self._source_frame["clustering"] = frame_id
            self._source_pose_ok["clustering"] = pose_ok
            self._topic_counts["clustering"] = self._topic_counts.get("clustering", 0) + 1

    def _on_tracked_objects(self, msg: Any) -> None:
        """Handle incoming tracked objects from Autoware."""
        self._process_objects_batch(msg.objects, msg.header.frame_id, "tracking", is_predicted=False)

    def _on_predicted_objects(self, msg: Any) -> None:
        """Handle incoming predicted objects from Autoware."""
        self._process_objects_batch(msg.objects, msg.header.frame_id, "prediction", is_predicted=True)

    def _on_camera_detected_objects(self, msg: Any) -> None:
        """Handle incoming dedicated camera YOLO detected objects."""
        now = time.time()
        self._last_detection_canonical_time = now
        self._last_camera_det_time = now
        with self._lock:
            self._camera_timestamps.append(now)
            while self._camera_timestamps and (now - self._camera_timestamps[0]) > 1.0:
                self._camera_timestamps.pop(0)
        self._process_camera_objects_batch(msg.objects, msg.header.frame_id)

    def _process_camera_objects_batch(self, objects: List[Any], frame_id: str) -> None:
        """Process camera YOLO detected objects into Three.js coordinates."""
        now = time.time()
        is_map_frame = ("map" in frame_id) or ("odom" in frame_id)
        sensor_tf = None if is_map_frame else self._lookup_sensor_to_base_link(frame_id)

        with self._lock:
            pose_ok = (not is_map_frame) or (self._has_ego_pose and (now - self._ego_time) < SOURCE_STALE_SEC)
            ego_snapshot = (self._ego_x, self._ego_y, self._ego_z, self._ego_yaw)

        converted: List[Dict[str, Any]] = []
        for obj in objects:
            pose = self._extract_pose(obj, is_predicted=False)
            if pose is None:
                continue

            pos = pose.position
            ori = pose.orientation
            yaw = quaternion_to_yaw(ori.x, ori.y, ori.z, ori.w)
            tx, ty, tz, rel_yaw = self._convert_pose(
                float(pos.x),
                float(pos.y),
                float(pos.z),
                yaw,
                is_map_frame,
                pose_ok,
                ego_pose=ego_snapshot,
                sensor_tf=sensor_tf,
            )

            label = self._classify(obj)

            dx, dy, dz = (0.8, 0.8, 1.7) if label == "PEDESTRIAN" else (2.0, 1.8, 1.5)
            if hasattr(obj, "shape") and hasattr(obj.shape, "dimensions"):
                dx = float(obj.shape.dimensions.x)
                dy = float(obj.shape.dimensions.y)
                dz = float(obj.shape.dimensions.z)

            speed_kmh = 0.0
            twist = self._extract_twist(obj, is_predicted=False)
            if twist is not None:
                vx = twist.linear.x
                vy = twist.linear.y
                speed_kmh = round(math.sqrt(vx * vx + vy * vy) * 3.6, 1)

            converted.append({
                "id": self._object_id(obj) or f"det_{len(converted)}",
                "label": label,
                "x": tx,
                "y": ty,
                "z": tz,
                "dx": round(dx, 2),
                "dy": round(dy, 2),
                "dz": round(dz, 2),
                "yaw": rel_yaw,
                "speed_kmh": speed_kmh,
                "sensor": "camera",
            })

        with self._lock:
            self._camera_objects = list(converted)
            self._sources["detection"] = converted
            self._source_time["detection"] = now
            self._source_frame["detection"] = frame_id
            self._source_pose_ok["detection"] = pose_ok
            self._topic_counts["camera_detection"] = self._topic_counts.get("camera_detection", 0) + 1
            self._perception_timestamps.append(now)
            while self._perception_timestamps and (now - self._perception_timestamps[0]) > 1.0:
                self._perception_timestamps.pop(0)

    def _on_detected_objects(self, msg: Any) -> None:
        """Handle incoming detected objects from Autoware / generic detectors."""
        now = time.time()
        self._last_detection_canonical_time = now
        with self._lock:
            self._topic_counts["detection"] = self._topic_counts.get("detection", 0) + 1
        self._process_objects_batch(msg.objects, msg.header.frame_id, "detection", is_predicted=False)

    def _on_clustering_objects(self, msg: Any) -> None:
        """Handle incoming LiDAR cluster objects."""
        now = time.time()
        with self._lock:
            self._last_lidar_cluster_time = now
            self._lidar_timestamps.append(now)
            while self._lidar_timestamps and (now - self._lidar_timestamps[0]) > 1.0:
                self._lidar_timestamps.pop(0)
        self._process_clustering_batch(msg.objects, msg.header.frame_id)

    def _on_lidar_pointcloud(self, msg: Any) -> None:
        """Heartbeat monitor and real point cloud processor for incoming LiDAR pointclouds."""
        now = time.time()
        with self._lock:
            self._last_lidar_raw_time = now
            self._lidar_timestamps.append(now)
            while self._lidar_timestamps and (now - self._lidar_timestamps[0]) > 1.0:
                self._lidar_timestamps.pop(0)
            self._topic_counts["lidar_pointcloud"] = self._topic_counts.get("lidar_pointcloud", 0) + 1
        self.lidar_streamer.process_pointcloud(msg)

    def _on_bench_perception_status(self, msg: Any) -> None:
        """Handle incoming diagnostic telemetry from bench_perception_node."""
        try:
            import json
            data = json.loads(msg.data)
            with self._lock:
                self._bench_perception_status = data
                self._bench_perception_time = time.time()
                self._topic_counts["bench_perception"] = self._topic_counts.get("bench_perception", 0) + 1
        except Exception:
            pass

    def _on_human_poses(self, msg: Any) -> None:
        """Handle incoming human skeletal pose keypoints from RTMPose-s."""
        try:
            import json
            data = json.loads(msg.data)
            with self._lock:
                self._human_poses = data
                self._human_poses_time = time.time()
                self._topic_counts["human_poses"] = self._topic_counts.get("human_poses", 0) + 1
        except Exception:
            pass

    def _on_fusion_boxes_marker_array(self, msg: Any) -> None:
        """Handle incoming 3D multi-modal fusion bounding boxes from fusion_mesh_node."""
        now = time.time()
        tracks: List[Dict[str, Any]] = []
        try:
            for m in getattr(msg, "markers", []):
                m_type = getattr(m, "type", -1)
                m_act = getattr(m, "action", -1)
                if m_type == 1 and m_act == 0:  # Marker.CUBE = 1, Marker.ADD = 0
                    pos = m.pose.position
                    ori = m.pose.orientation
                    scale = m.scale
                    color = m.color
                    yaw = quaternion_to_yaw(ori.x, ori.y, ori.z, ori.w)

                    # Determine provenance from semantic color (Cyan vs Orange vs Yellow)
                    if color.b > 0.7 and color.r < 0.4:
                        sensor_type = "fused"
                        is_fused = True
                    elif color.r > 0.7 and color.g < 0.7:
                        sensor_type = "lidar"
                        is_fused = False
                    else:
                        sensor_type = "camera"
                        is_fused = False

                    tx, ty, tz, rel_yaw = self._relative_transform(float(pos.x), float(pos.y), float(pos.z), yaw)
                    dist = round(math.hypot(float(pos.x), float(pos.y)), 1)

                    # Correlate track with camera pose ID (det_N) if within 2.5m so MHR & actors use identical keys
                    track_id = f"fuse_{m.id}"
                    if self._human_poses and isinstance(self._human_poses, dict):
                        for p in self._human_poses.get("poses", []):
                            p_x = -float(p.get("y_base", 0.0))
                            p_z = round(BASE_LINK_TO_SCENE_Z_OFFSET - float(p.get("x_base", 0.0)), 2)
                            if math.hypot(tx - p_x, tz - p_z) < 2.5:
                                track_id = str(p.get("id")) or track_id
                                break

                    tracks.append({
                        "id": track_id,
                        "label": "PEDESTRIAN",
                        "x": tx,
                        "y": ty,
                        "z": tz,
                        "dx": round(float(scale.x), 2),
                        "dy": round(float(scale.y), 2),
                        "dz": round(float(scale.z), 2),
                        "yaw": rel_yaw,
                        "speed_kmh": 0.0,
                        "sensor": sensor_type,
                        "fused": is_fused,
                        "distance": dist,
                    })

            with self._lock:
                self._fusion_tracks = tracks
                self._last_fusion_tracks_time = now
                self._topic_counts["fusion_boxes"] = self._topic_counts.get("fusion_boxes", 0) + 1
        except Exception:
            pass

    @staticmethod
    def _ros_image_to_bgr(msg: Any) -> Optional[Any]:
        """Decode a sensor_msgs/Image into a BGR uint8 ndarray, honouring row ``step``.

        Handles bgr8/rgb8/bgra8/rgba8/mono8/8UC1..4 and 16UC1. Returns ``None`` when
        the buffer is inconsistent (e.g. padded/4-channel frames) so the caller can
        skip that frame instead of raising. Naive ``reshape((h, w, 3))`` corrupts or
        rejects BGRA frames (the Kinect v2 colour stream) and ignores row padding.
        """
        try:
            import cv2
            import numpy as np
        except Exception:
            return None

        h = int(getattr(msg, "height", 0))
        w = int(getattr(msg, "width", 0))
        if h <= 0 or w <= 0:
            return None

        enc = str(getattr(msg, "encoding", "bgr8")).lower()
        raw = np.frombuffer(msg.data, dtype=np.uint8)

        # 16-bit encodings (e.g. 16UC1 depth): scale to 8-bit grayscale.
        if "16u" in enc:
            if raw.size < h * w * 2:
                return None
            img16 = raw[: h * w * 2].view(np.uint16).reshape(h, w)
            peak = int(img16.max())
            img8 = cv2.convertScaleAbs(img16, alpha=255.0 / peak) if peak > 0 else img16.astype(np.uint8)
            return cv2.cvtColor(img8, cv2.COLOR_GRAY2BGR)

        is_4ch = "bgra" in enc or "rgba" in enc or "8uc4" in enc
        is_3ch = "bgr" in enc or "rgb" in enc or "8uc3" in enc
        channels = 4 if is_4ch else 3 if is_3ch else 1

        step = int(getattr(msg, "step", 0)) or w * channels
        if step < w * channels or step * h > raw.size:
            return None
        rows = raw[: step * h].reshape(h, step)

        if is_4ch:
            ch4 = rows[:, : w * 4].reshape(h, w, 4)
            return cv2.cvtColor(ch4, cv2.COLOR_RGBA2BGR if "rgba" in enc else cv2.COLOR_BGRA2BGR)
        if "rgb" in enc:
            return cv2.cvtColor(rows[:, : w * 3].reshape(h, w, 3), cv2.COLOR_RGB2BGR)
        if is_3ch:
            return rows[:, : w * 3].reshape(h, w, 3).copy()
        # mono8 / 8UC1 / unknown single-channel.
        return cv2.cvtColor(rows[:, :w].reshape(h, w), cv2.COLOR_GRAY2BGR)

    def _store_camera_frame(self, jpeg: bytes, now_t: float, topic: str) -> None:
        with self._lock:
            self._latest_jpeg = jpeg
            self._latest_jpeg_time = now_t
            self._last_camera_image_time = now_t
            self._camera_timestamps.append(now_t)
            while self._camera_timestamps and (now_t - self._camera_timestamps[0]) > 1.0:
                self._camera_timestamps.pop(0)
            self._topic_counts[topic] = self._topic_counts.get(topic, 0) + 1

    def _on_camera_debug_image(self, msg: Any) -> None:
        """Handle incoming annotated camera debug frame (YOLO bounding boxes) and encode as JPEG."""
        try:
            import cv2

            frame = self._ros_image_to_bgr(msg)
            if frame is None:
                return

            success, jpeg_buf = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
            if success:
                now_t = time.time()
                with self._lock:
                    self._latest_debug_jpeg_time = now_t
                self._store_camera_frame(jpeg_buf.tobytes(), now_t, "camera_debug_image")
        except Exception:
            pass

    def _on_camera_raw_image(self, msg: Any) -> None:
        """Handle incoming raw camera frame as fallback only if annotated stream is absent."""
        # If fresh annotated debug frames are being received, do not overwrite with raw
        if (time.time() - getattr(self, "_latest_debug_jpeg_time", 0.0)) < 1.0:
            return

        try:
            import cv2

            frame = self._ros_image_to_bgr(msg)
            if frame is None:
                return

            success, jpeg_buf = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
            if success:
                now_t = time.time()
                self._store_camera_frame(jpeg_buf.tobytes(), now_t, "camera_raw_image")
        except Exception:
            pass

    def get_latest_jpeg(self) -> Optional[bytes]:
        """Return the latest encoded JPEG camera frame, if fresh (<2.0s)."""
        with self._lock:
            if (time.time() - getattr(self, "_latest_jpeg_time", 0.0)) < 2.0:
                return getattr(self, "_latest_jpeg", None)
            return None

    def _on_trajectory(self, msg: Any) -> None:
        """Handle incoming planned trajectory points from Autoware."""
        now = time.time()
        is_map_frame = ("map" in msg.header.frame_id) or ("odom" in msg.header.frame_id)

        with self._lock:
            pose_ok = (not is_map_frame) or (self._has_ego_pose and (now - self._ego_time) < SOURCE_STALE_SEC)
            ego_snapshot = (self._ego_x, self._ego_y, self._ego_z, self._ego_yaw)

        traj_points: List[Dict[str, float]] = []
        n_pts = len(msg.points)
        if pose_ok and n_pts > 0:
            # Cap sampled trajectory to at most 32 points while always preserving the endpoint
            if n_pts <= 32:
                indices = list(range(n_pts))
            else:
                indices = [round(k * (n_pts - 1) / 31) for k in range(32)]
            for i in indices:
                pt = msg.points[i]
                pos = pt.pose.position
                ori = pt.pose.orientation
                yaw = quaternion_to_yaw(ori.x, ori.y, ori.z, ori.w)
                tx, ty, tz, _ = self._convert_pose(
                    float(pos.x), float(pos.y), float(pos.z), yaw, is_map_frame, pose_ok, ego_pose=ego_snapshot
                )
                traj_points.append({"x": tx, "y": ty, "z": tz})

        with self._lock:
            self._planned_trajectory = traj_points
            self._last_trajectory_time = now
            self._trajectory_frame = msg.header.frame_id
            self._trajectory_pose_ok = pose_ok
            self._topic_counts["trajectory"] += 1

    def _on_velocity_report(self, msg: Any) -> None:
        with self._lock:
            self._veh_speed_act_kmh = round(abs(float(msg.longitudinal_velocity)) * 3.6, 1)
            self._veh_status_time = time.time()

    def _on_steering_report(self, msg: Any) -> None:
        with self._lock:
            self._veh_steer_act_deg = round(math.degrees(float(msg.steering_tire_angle)), 1)
            self._veh_status_time = time.time()

    def _on_gear_report(self, msg: Any) -> None:
        gear_map = {1: "N", 2: "D", 20: "R", 22: "P"}
        with self._lock:
            self._veh_gear = gear_map.get(int(msg.report), "D")
            self._veh_status_time = time.time()

    def _on_control_mode_report(self, msg: Any) -> None:
        mode_map = {1: "AUTO", 4: "MANUAL"}
        with self._lock:
            self._veh_mode = mode_map.get(int(msg.mode), "MANUAL")
            self._veh_status_time = time.time()

    def _on_turn_indicators_report(self, msg: Any) -> None:
        with self._lock:
            self._veh_turn_left = int(msg.report) == 2
            self._veh_turn_right = int(msg.report) == 3
            self._veh_status_time = time.time()

    def _on_hazard_lights_report(self, msg: Any) -> None:
        with self._lock:
            self._veh_hazard = int(msg.report) == 2
            self._veh_status_time = time.time()

    def _on_control_cmd(self, msg: Any) -> None:
        with self._lock:
            if hasattr(msg, "longitudinal") and hasattr(msg.longitudinal, "velocity"):
                self._veh_speed_cmd_kmh = round(abs(float(msg.longitudinal.velocity)) * 3.6, 1)
            if hasattr(msg, "lateral") and hasattr(msg.lateral, "steering_tire_angle"):
                self._veh_steer_cmd_deg = round(math.degrees(float(msg.lateral.steering_tire_angle)), 1)
            self._veh_status_time = time.time()

    @staticmethod
    def _class_counts(objects: List[Dict[str, Any]]) -> Dict[str, int]:
        counts: Dict[str, int] = {}
        for obj in objects:
            label = str(obj.get("label", "UNKNOWN"))
            counts[label] = counts.get(label, 0) + 1
        return counts

    def get_latest_data(self) -> Dict[str, Any]:
        """Fetch the latest perception objects and trajectory snapshot (thread-safe)."""
        now = time.time()
        with self._lock:
            while self._perception_timestamps and (now - self._perception_timestamps[0]) > 1.0:
                self._perception_timestamps.pop(0)
            while self._camera_timestamps and (now - self._camera_timestamps[0]) > 1.0:
                self._camera_timestamps.pop(0)
            while self._lidar_timestamps and (now - self._lidar_timestamps[0]) > 1.0:
                self._lidar_timestamps.pop(0)

            fresh_sources = [
                name for name in SOURCE_PRIORITY
                if self._source_time[name] > 0.0 and (now - self._source_time[name]) < SOURCE_STALE_SEC
            ]

            ego_fresh = self._has_ego_pose and (now - self._ego_time) < SOURCE_STALE_SEC
            traj_fresh = self._last_trajectory_time > 0.0 and (now - self._last_trajectory_time) < 2.5
            veh_fresh = self._veh_status_time > 0.0 and (now - self._veh_status_time) < SOURCE_STALE_SEC

            # Camera & LiDAR physical stream freshness
            cam_online = (
                (now - self._last_camera_image_time) < SOURCE_STALE_SEC
                or (now - self._last_camera_det_time) < SOURCE_STALE_SEC
            )
            lidar_online = (
                (now - self._last_lidar_raw_time) < SOURCE_STALE_SEC
                or (now - self._last_lidar_cluster_time) < SOURCE_STALE_SEC
            )

            cam_hz = round(float(len(self._camera_timestamps)), 1)
            lidar_hz = round(float(len(self._lidar_timestamps)), 1)

            cam_objs = list(self._camera_objects) if cam_online else []

            # Ensure all detected human poses are represented in cam_objs with 3D metric coordinates
            if self._human_poses and (now - self._human_poses_time) < SOURCE_STALE_SEC:
                h_poses = self._human_poses.get("poses", []) if isinstance(self._human_poses, dict) else []
                for p in h_poses:
                    p_id = str(p.get("id", ""))
                    p_x = float(p.get("y_base", 0.0))
                    p_z = round(BASE_LINK_TO_SCENE_Z_OFFSET - float(p.get("x_base", 0.0)), 2)
                    already = any(
                        (str(o.get("id")) == p_id or math.hypot(float(o.get("x", 0.0)) - p_x, float(o.get("z", 0.0)) - p_z) < 2.0)
                        for o in cam_objs if o.get("label") == "PEDESTRIAN"
                    )
                    if not already:
                        cam_objs.append({
                            "id": p_id or f"ped_{len(cam_objs)}",
                            "label": "PEDESTRIAN",
                            "x": p_x,
                            "y": 0.0,
                            "z": p_z,
                            "dx": 0.8,
                            "dy": 0.8,
                            "dz": 1.75,
                            "yaw": float(p.get("yaw", 0.0)),
                            "speed_kmh": 0.0,
                            "sensor": "camera",
                        })

            lidar_objs = list(self._lidar_objects) if lidar_online else []

            # Check if Standalone Bench Perception is actively publishing
            bench_active = (now - self._bench_perception_time) < SOURCE_STALE_SEC
            bench_mode = self._bench_perception_status.get("mode", "UNAVAILABLE") if bench_active else None

            # Determine operating mode: CAMERA_ONLY, LIDAR_ONLY, COMBINED, or OFFLINE
            if cam_online and lidar_online:
                active_mode = "COMBINED"
            elif cam_online:
                active_mode = "CAMERA_ONLY"
            elif lidar_online:
                active_mode = "LIDAR_ONLY"
            elif bench_active and bench_mode in ("CAMERA_ONLY", "LIDAR_ONLY", "FUSED", "COMBINED"):
                active_mode = "COMBINED" if bench_mode in ("FUSED", "COMBINED") else bench_mode
            else:
                active_mode = "OFFLINE"

            # If fusion_mesh_node is actively publishing 3D fused tracks, prioritize them.
            # CONFLICT RESOLUTION: Both YOLO camera (det_N IDs) and BEVFusion (fuse_N IDs) may
            # run simultaneously. The MHR system needs camera pedestrian objects with det_N IDs
            # to bind its posed meshes. So when fusion is active, we start with fusion tracks
            # for spatial accuracy but also inject any fresh YOLO camera pedestrian objects that
            # do NOT spatially overlap with an existing fusion track, preserving their det_N IDs.
            fusion_mesh_active = (now - getattr(self, "_last_fusion_tracks_time", 0.0)) < SOURCE_STALE_SEC and bool(getattr(self, "_fusion_tracks", None))
            if fusion_mesh_active:
                objects = list(self._fusion_tracks)
                source = "fusion_mesh_node"
                frame_id = "base_link"
                pose_ok = True
                active_mode = "COMBINED"

                # Inject camera-detected pedestrians that aren't already covered by a fusion
                # track, so MHR det_N IDs remain resolvable in the frontend actor map.
                if cam_online and cam_objs:
                    for c_obj in cam_objs:
                        if c_obj.get("label") != "PEDESTRIAN":
                            continue
                        cx = float(c_obj.get("x", 0.0))
                        cz = float(c_obj.get("z", 0.0))
                        # Check 2.5 m overlap against any existing fusion track
                        already_covered = any(
                            math.hypot(cx - float(f.get("x", 0.0)), cz - float(f.get("z", 0.0))) < 2.5
                            for f in self._fusion_tracks
                        )
                        if not already_covered:
                            cam_copy = dict(c_obj)
                            cam_copy["sensor"] = "camera"
                            cam_copy["fused"] = False
                            objects.append(cam_copy)

            # Merge real-time sensor detection
            elif active_mode == "COMBINED":
                fused_objects: List[Dict[str, Any]] = []
                matched_lidar_indices = set()

                for c_obj in cam_objs:
                    cx = c_obj.get("x", 0.0)
                    cz = c_obj.get("z", 0.0)
                    best_l_idx = None
                    best_dist = 2.2
                    for l_idx, l_obj in enumerate(lidar_objs):
                        if l_idx in matched_lidar_indices:
                            continue
                        lx = l_obj.get("x", 0.0)
                        lz = l_obj.get("z", 0.0)
                        d = math.hypot(cx - lx, cz - lz)
                        if d < best_dist:
                            best_dist = d
                            best_l_idx = l_idx

                    if best_l_idx is not None:
                        matched_lidar_indices.add(best_l_idx)
                        l_obj = lidar_objs[best_l_idx]
                        merged = dict(c_obj)
                        # Refine spatial positioning and bounding box dimensions with LiDAR accuracy
                        merged["x"] = round(c_obj["x"] * 0.4 + l_obj["x"] * 0.6, 2)
                        merged["z"] = round(c_obj["z"] * 0.4 + l_obj["z"] * 0.6, 2)
                        merged["dx"] = l_obj.get("dx") or c_obj.get("dx")
                        merged["dy"] = l_obj.get("dy") or c_obj.get("dy")
                        merged["dz"] = l_obj.get("dz") or c_obj.get("dz")
                        merged["fused"] = True
                        merged["sensor"] = "fused"
                        fused_objects.append(merged)
                    else:
                        c_copy = dict(c_obj)
                        c_copy["sensor"] = "camera"
                        c_copy["fused"] = False
                        fused_objects.append(c_copy)

                # Append non-overlapping LiDAR clusters (skip if close to any camera pedestrian)
                for l_idx, l_obj in enumerate(lidar_objs):
                    if l_idx not in matched_lidar_indices:
                        lx = float(l_obj.get("x", 0.0))
                        lz = float(l_obj.get("z", 0.0))
                        is_near_cam = any(
                            math.hypot(lx - float(c.get("x", 0.0)), lz - float(c.get("z", 0.0))) < 2.2
                            for c in cam_objs if c.get("label") == "PEDESTRIAN"
                        )
                        if not is_near_cam:
                            l_copy = dict(l_obj)
                            l_copy["sensor"] = "lidar"
                            l_copy["fused"] = False
                            fused_objects.append(l_copy)

                objects = fused_objects
                source = "bench_fused"
                frame_id = "base_link"
                pose_ok = True

            elif active_mode == "CAMERA_ONLY":
                objects = cam_objs
                source = "bench_camera_only"
                frame_id = "base_link"
                pose_ok = True

            elif active_mode == "LIDAR_ONLY":
                objects = lidar_objs
                source = "bench_lidar_only"
                frame_id = "base_link"
                pose_ok = True

            else:
                # Primary upstream tracking fallback
                primary_source = None
                for s_name in ("tracking", "prediction"):
                    if s_name in fresh_sources and len(self._sources[s_name]) > 0:
                        primary_source = s_name
                        break

                if primary_source:
                    objects = list(self._sources[primary_source])
                    source = primary_source
                    frame_id = self._source_frame[primary_source]
                    pose_ok = self._source_pose_ok[primary_source]
                else:
                    objects = []
                    source = fresh_sources[0] if fresh_sources else "offline"
                    pose_ok = ego_fresh
                    frame_id = "base_link"

            # Final Pedestrian Deduplication: Guarantee exactly 1 representation per physical person
            dedup_objects: List[Dict[str, Any]] = []
            ped_priority = {"fused": 3, "camera": 2, "lidar": 1}
            for obj in objects:
                if obj.get("label") != "PEDESTRIAN":
                    dedup_objects.append(obj)
                    continue
                ox = float(obj.get("x", 0.0))
                oz = float(obj.get("z", 0.0))
                matching_idx = None
                for idx, acc in enumerate(dedup_objects):
                    if acc.get("label") == "PEDESTRIAN":
                        if math.hypot(ox - float(acc.get("x", 0.0)), oz - float(acc.get("z", 0.0))) < 2.0:
                            matching_idx = idx
                            break
                if matching_idx is not None:
                    existing = dedup_objects[matching_idx]
                    ex_prio = ped_priority.get(str(existing.get("sensor")).lower(), 0)
                    cur_prio = ped_priority.get(str(obj.get("sensor")).lower(), 0)
                    if cur_prio > ex_prio:
                        if str(existing.get("id", "")).startswith("det_") and not str(obj.get("id", "")).startswith("det_"):
                            obj["id"] = existing["id"]
                        dedup_objects[matching_idx] = obj
                    elif str(obj.get("id", "")).startswith("det_") and not str(existing.get("id", "")).startswith("det_"):
                        existing["id"] = obj["id"]
                else:
                    dedup_objects.append(obj)
            objects = dedup_objects

            hz = float(len(self._perception_timestamps)) if (fresh_sources or cam_online or lidar_online) else 0.0
            if hz == 0.0:
                hz = max(cam_hz, lidar_hz)

            trajectory = (
                list(self._planned_trajectory)
                if traj_fresh and self._trajectory_pose_ok and (ego_fresh or not (("map" in self._trajectory_frame) or ("odom" in self._trajectory_frame)))
                else []
            )

            return {
                "active": bool(fresh_sources) or ego_fresh or traj_fresh or veh_fresh or cam_online or lidar_online,
                "hz": round(hz, 1),
                "tracked_count": len(objects),
                "object_count": len(objects),
                "objects": objects,
                "trajectory": trajectory,
                "source": source,
                "pose_ok": bool(pose_ok),
                "frame_id": frame_id,
                "has_ego_pose": ego_fresh,
                "ego_speed_kmh": self._ego_speed_kmh if ego_fresh else 0.0,
                "ego_yaw_rate_mrad_s": self._ego_yaw_rate_mrad_s if ego_fresh else 0.0,
                "vehicle_status": {
                    "fresh": veh_fresh,
                    "speed_act_kmh": self._veh_speed_act_kmh,
                    "speed_cmd_kmh": self._veh_speed_cmd_kmh,
                    "steer_act_deg": self._veh_steer_act_deg,
                    "steer_cmd_deg": self._veh_steer_cmd_deg,
                    "gear": self._veh_gear,
                    "mode": self._veh_mode,
                    "lights": {
                        "left": self._veh_turn_left,
                        "right": self._veh_turn_right,
                        "hazard": self._veh_hazard,
                    },
                },
                "class_counts": self._class_counts(objects),
                "bench_perception": {
                    "mode": active_mode,
                    "object_count": len(objects),
                    "camera_online": cam_online,
                    "camera_connected": cam_online,
                    "camera_hz": cam_hz,
                    "lidar_online": lidar_online,
                    "lidar_connected": lidar_online,
                    "lidar_hz": lidar_hz,
                    "combined": (cam_online and lidar_online),
                    "fusion_active": (cam_online and lidar_online),
                    "timestamp": now,
                },
                "bridge_available": self.is_available,
                "subscribed": dict(self._subscribed),
                "topic_counts": dict(self._topic_counts),
                "human_poses": dict(self._human_poses) if (now - self._human_poses_time) < SOURCE_STALE_SEC else {},
                "last_error": self._last_error,
            }

