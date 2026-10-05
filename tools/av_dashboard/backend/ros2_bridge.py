"""ROS 2 Bridge for AV Dashboard.

Subscribes to live Autoware Universe perception, planning, and localization topics:
- /perception/object_recognition/tracking/objects (autoware_perception_msgs/msg/TrackedObjects)
- /planning/scenario_planning/trajectory (autoware_planning_msgs/msg/Trajectory)
- /localization/kinematic_state (nav_msgs/msg/Odometry)

Transforms all coordinates from global map frame into vehicle-relative (base_link) frame
and provides thread-safe access for the WebSocket broadcaster.
"""

from __future__ import annotations

import math
import threading
import time
from typing import Any, Dict, List, Optional, Tuple

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

        # Ego vehicle state in map frame
        self._ego_x: float = 0.0
        self._ego_y: float = 0.0
        self._ego_z: float = 0.0
        self._ego_yaw: float = 0.0
        self._has_ego_pose: bool = False

        # Live perception objects (vehicle-relative, Three.js coordinates)
        self._tracked_objects: List[Dict[str, Any]] = []
        self._last_perception_time: float = 0.0
        self._perception_count: int = 0
        self._perception_hz: float = 0.0
        self._perception_timestamps: List[float] = []

        # Live planned trajectory points (vehicle-relative, Three.js coordinates)
        self._planned_trajectory: List[Dict[str, float]] = []
        self._last_trajectory_time: float = 0.0

    def start(self) -> None:
        """Start the ROS 2 node in a background daemon thread."""
        try:
            import rclpy
            self.is_available = True
        except ImportError:
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
                print("[ROS 2 Bridge] Subscribed to ego odometry topics")
            except Exception as e:
                print(f"[ROS 2 Bridge] Odometry subscription failed: {e}")

            try:
                from geometry_msgs.msg import PoseStamped
                node.create_subscription(
                    PoseStamped,
                    "/current_pose",
                    self._on_pose_stamped,
                    qos_sensor,
                )
                print("[ROS 2 Bridge] Subscribed to /current_pose")
            except Exception:
                pass

            # 2. Perception Objects (TrackedObjects, PredictedObjects, DetectedObjects)
            try:
                from autoware_perception_msgs.msg import TrackedObjects
                node.create_subscription(
                    TrackedObjects,
                    "/perception/object_recognition/tracking/objects",
                    self._on_tracked_objects,
                    qos_sensor,
                )
                print("[ROS 2 Bridge] Subscribed to /perception/object_recognition/tracking/objects")
            except Exception as e:
                print(f"[ROS 2 Bridge] TrackedObjects subscription failed: {e}")

            try:
                from autoware_perception_msgs.msg import PredictedObjects
                node.create_subscription(
                    PredictedObjects,
                    "/perception/object_recognition/objects",
                    self._on_predicted_objects,
                    qos_sensor,
                )
                print("[ROS 2 Bridge] Subscribed to /perception/object_recognition/objects")
            except Exception as e:
                print(f"[ROS 2 Bridge] PredictedObjects subscription failed: {e}")

            try:
                from autoware_perception_msgs.msg import DetectedObjects
                node.create_subscription(
                    DetectedObjects,
                    "/perception/object_recognition/detection/objects",
                    self._on_detected_objects,
                    qos_sensor,
                )
                print("[ROS 2 Bridge] Subscribed to /perception/object_recognition/detection/objects")
            except Exception as e:
                print(f"[ROS 2 Bridge] DetectedObjects subscription failed: {e}")

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
                print("[ROS 2 Bridge] Subscribed to planned trajectory topics")
            except Exception as e:
                print(f"[ROS 2 Bridge] Trajectory subscription failed: {e}")

            while rclpy.ok() and self.is_running:
                rclpy.spin_once(node, timeout_sec=0.1)

            node.destroy_node()
        except Exception as err:
            print(f"[ROS 2 Bridge] Error during spin: {err}")
        finally:
            self.is_running = False

    def _on_odometry(self, msg: Any) -> None:
        """Handle incoming ego odometry."""
        pos = msg.pose.pose.position
        ori = msg.pose.pose.orientation
        yaw = quaternion_to_yaw(ori.x, ori.y, ori.z, ori.w)

        with self._lock:
            self._ego_x = float(pos.x)
            self._ego_y = float(pos.y)
            self._ego_z = float(pos.z)
            self._ego_yaw = yaw
            self._has_ego_pose = True

    def _on_pose_stamped(self, msg: Any) -> None:
        """Handle incoming PoseStamped."""
        pos = msg.pose.position
        ori = msg.pose.orientation
        yaw = quaternion_to_yaw(ori.x, ori.y, ori.z, ori.w)

        with self._lock:
            self._ego_x = float(pos.x)
            self._ego_y = float(pos.y)
            self._ego_z = float(pos.z)
            self._ego_yaw = yaw
            self._has_ego_pose = True

    def _transform_map_to_base_link(
        self, x: float, y: float, z: float, yaw: float
    ) -> Tuple[float, float, float, float]:
        """Transform coordinates from map frame to ego vehicle base_link frame.

        Returns (three_x, three_y, three_z, rel_yaw) where:
        - three_x: Lateral offset in Three.js (meters, right is positive)
        - three_y: Elevation offset (meters, up is positive)
        - three_z: Longitudinal offset in Three.js (meters, forward is negative Z)
        - rel_yaw: Heading difference in radians
        """
        if not self._has_ego_pose:
            # Fallback if localization not published: assume input is already relative
            return (-y, z, -x, yaw)

        dx = x - self._ego_x
        dy = y - self._ego_y
        dz = z - self._ego_z

        cos_yaw = math.cos(self._ego_yaw)
        sin_yaw = math.sin(self._ego_yaw)

        # Base_link: forward (+X), left (+Y)
        base_x = cos_yaw * dx + sin_yaw * dy
        base_y = -sin_yaw * dx + cos_yaw * dy
        rel_yaw = yaw - self._ego_yaw

        # Three.js: right (+X), up (+Y), forward (-Z)
        three_x = -base_y
        three_y = dz
        three_z = -base_x

        return (round(three_x, 2), round(three_y, 2), round(three_z, 2), round(rel_yaw, 2))

    def _process_objects_batch(self, objects: List[Any], frame_id: str, is_predicted: bool = False) -> None:
        """Process and normalize raw Autoware perception objects."""
        now = time.time()
        converted: List[Dict[str, Any]] = []
        is_map_frame = "map" in frame_id or "odom" in frame_id

        for obj in objects:
            # Handle kinematics pose differences between Tracked/Detected vs Predicted
            if is_predicted and hasattr(obj.kinematics, "initial_pose_with_covariance"):
                pose_cov = obj.kinematics.initial_pose_with_covariance
            elif hasattr(obj.kinematics, "pose_with_covariance"):
                pose_cov = obj.kinematics.pose_with_covariance
            else:
                continue

            pos = pose_cov.pose.position
            ori = pose_cov.pose.orientation
            yaw = quaternion_to_yaw(ori.x, ori.y, ori.z, ori.w)

            if is_map_frame:
                tx, ty, tz, rel_yaw = self._transform_map_to_base_link(
                    float(pos.x), float(pos.y), float(pos.z), yaw
                )
            else:
                # Already in base_link frame
                tx = -float(pos.y)
                ty = float(pos.z)
                tz = -float(pos.x)
                rel_yaw = yaw

            # Classification
            label = "UNKNOWN"
            if hasattr(obj, "classification") and obj.classification:
                best = max(obj.classification, key=lambda c: getattr(c, "probability", 0.0))
                label = LABEL_MAP.get(int(best.label), "UNKNOWN")

            # 3D Dimensions: x=length, y=width, z=height
            dx = 2.0
            dy = 1.8
            dz = 1.5
            if hasattr(obj, "shape") and hasattr(obj.shape, "dimensions"):
                dx = float(obj.shape.dimensions.x)
                dy = float(obj.shape.dimensions.y)
                dz = float(obj.shape.dimensions.z)

            # Velocity in km/h
            speed_kmh = 0.0
            if hasattr(obj.kinematics, "twist_with_covariance"):
                vx = obj.kinematics.twist_with_covariance.twist.linear.x
                vy = obj.kinematics.twist_with_covariance.twist.linear.y
                speed_kmh = round(math.sqrt(vx * vx + vy * vy) * 3.6, 1)
            elif hasattr(obj.kinematics, "initial_twist_with_covariance"):
                vx = obj.kinematics.initial_twist_with_covariance.twist.linear.x
                vy = obj.kinematics.initial_twist_with_covariance.twist.linear.y
                speed_kmh = round(math.sqrt(vx * vx + vy * vy) * 3.6, 1)

            # Object ID (convert uuid bytes to short hex)
            obj_id = ""
            if hasattr(obj, "object_id"):
                raw_id = getattr(obj.object_id, "uuid", None)
                if raw_id:
                    try:
                        obj_id = "".join(f"{b:02x}" for b in raw_id[:4])
                    except Exception:
                        obj_id = str(obj.object_id)
                else:
                    obj_id = str(obj.object_id)

            converted.append({
                "id": obj_id,
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
            self._tracked_objects = converted
            self._last_perception_time = now
            self._perception_count = len(converted)

            self._perception_timestamps.append(now)
            while self._perception_timestamps and (now - self._perception_timestamps[0]) > 1.0:
                self._perception_timestamps.pop(0)
            self._perception_hz = round(len(self._perception_timestamps) / 1.0, 1)

    def _on_tracked_objects(self, msg: Any) -> None:
        """Handle incoming tracked objects from Autoware."""
        self._process_objects_batch(msg.objects, msg.header.frame_id, is_predicted=False)

    def _on_predicted_objects(self, msg: Any) -> None:
        """Handle incoming predicted objects from Autoware."""
        self._process_objects_batch(msg.objects, msg.header.frame_id, is_predicted=True)

    def _on_detected_objects(self, msg: Any) -> None:
        """Handle incoming detected objects from Autoware."""
        self._process_objects_batch(msg.objects, msg.header.frame_id, is_predicted=False)

    def _on_trajectory(self, msg: Any) -> None:
        """Handle incoming planned trajectory points from Autoware."""
        now = time.time()
        is_map_frame = "map" in msg.header.frame_id or "odom" in msg.header.frame_id
        traj_points: List[Dict[str, float]] = []

        # Downsample trajectory if too long (keep up to 32 points)
        step = max(1, len(msg.points) // 32)
        for i in range(0, len(msg.points), step):
            pt = msg.points[i]
            pos = pt.pose.position
            ori = pt.pose.orientation
            yaw = quaternion_to_yaw(ori.x, ori.y, ori.z, ori.w)

            if is_map_frame:
                tx, ty, tz, _ = self._transform_map_to_base_link(
                    float(pos.x), float(pos.y), float(pos.z), yaw
                )
            else:
                tx = -float(pos.y)
                ty = float(pos.z)
                tz = -float(pos.x)

            traj_points.append({"x": tx, "y": ty, "z": tz})

        with self._lock:
            self._planned_trajectory = traj_points
            self._last_trajectory_time = now

    def get_latest_data(self) -> Dict[str, Any]:
        """Fetch the latest perception objects and trajectory snapshot (thread-safe)."""
        now = time.time()
        with self._lock:
            # Active if perception was received within the last 1.5 seconds
            is_active = (now - self._last_perception_time) < 1.5 and self._last_perception_time > 0
            return {
                "active": is_active,
                "hz": self._perception_hz if is_active else 0.0,
                "tracked_count": self._perception_count if is_active else 0,
                "objects": list(self._tracked_objects) if is_active else [],
                "trajectory": list(self._planned_trajectory) if (now - self._last_trajectory_time) < 2.5 else [],
            }
