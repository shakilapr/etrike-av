"""Core Ros2Bridge class providing lifecycle and snapshot getters."""

from __future__ import annotations

import threading
import time
from typing import Any, Dict, List, Optional, Tuple

from ..lidar_streamer import LidarStreamer
from .constants import ODOM_FRESH_SEC, SOURCE_PRIORITY, SOURCE_STALE_SEC
from .state import Ros2State
from .subscriptions import setup_all_subscriptions


class Ros2Bridge:
    """Thread-safe background ROS 2 subscriber bridge."""

    def __init__(self) -> None:
        self.is_available: bool = False
        self.is_running: bool = False
        self._thread: Optional[threading.Thread] = None
        self._last_error: Optional[str] = None
        self.state: Ros2State = Ros2State()
        self.lidar_streamer: LidarStreamer = LidarStreamer()

    def start(self) -> None:
        try:
            import rclpy  # noqa: F401
            self.is_available = True
        except ImportError:
            self._last_error = "rclpy not importable in this Python environment"
            self.is_available = False
            return

        self.is_running = True
        self._thread = threading.Thread(target=self._run_ros2_node, daemon=True)
        self._thread.start()

    def stop(self) -> None:
        self.is_running = False

    def _run_ros2_node(self) -> None:
        import rclpy
        from rclpy.node import Node
        try:
            if not rclpy.ok():
                rclpy.init(args=None)
            node = Node("av_dashboard_ros2_bridge")
            setup_all_subscriptions(node, self.state, self.lidar_streamer)

            while self.is_running and rclpy.ok():
                rclpy.spin_once(node, timeout_sec=0.05)
            node.destroy_node()
            rclpy.shutdown()
        except Exception as e:
            self._last_error = str(e)
            self.is_running = False

    def get_latest_data(self) -> Dict[str, Any]:
        now = time.time()
        with self.state.lock:
            active_src = None
            active_objects: List[Dict[str, Any]] = []
            if self.state.fusion_tracks and (now - self.state.last_fusion_tracks_time) < SOURCE_STALE_SEC:
                active_src = "bench_fused"
                active_objects = list(self.state.fusion_tracks)
            else:
                for src in SOURCE_PRIORITY:
                    if (now - self.state.source_time[src]) < SOURCE_STALE_SEC:
                        active_src = src
                        active_objects = list(self.state.sources[src])
                        break

            ego_fresh = self.state.has_ego_pose and (now - self.state.ego_time) < ODOM_FRESH_SEC
            traj_fresh = self.state.last_trajectory_time > 0.0 and (now - self.state.last_trajectory_time) < 2.5
            trajectory = list(self.state.planned_trajectory) if traj_fresh else []

            class_counts: Dict[str, int] = {}
            for obj in active_objects:
                lbl = obj["label"]
                class_counts[lbl] = class_counts.get(lbl, 0) + 1

            self.state.perception_timestamps = [t for t in self.state.perception_timestamps if (now - t) <= 1.0]
            hz = round(float(len(self.state.perception_timestamps)), 1)
            is_active = active_src is not None or (now - self.state.last_detection_canonical_time) < SOURCE_STALE_SEC

            return {
                "active": is_active,
                "hz": hz,
                "tracked_count": len(active_objects),
                "object_count": len(active_objects),
                "source": active_src,
                "pose_ok": self.state.has_ego_pose,
                "frame_id": self.state.source_frame.get(active_src or "", ""),
                "has_ego_pose": ego_fresh,
                "ego_x": self.state.ego_x if ego_fresh else 0.0,
                "ego_y": self.state.ego_y if ego_fresh else 0.0,
                "ego_z": self.state.ego_z if ego_fresh else 0.0,
                "ego_yaw": self.state.ego_yaw if ego_fresh else 0.0,
                "ego_speed_kmh": self.state.ego_speed_kmh if ego_fresh else 0.0,
                "ego_yaw_rate_mrad_s": self.state.ego_yaw_rate_mrad_s if ego_fresh else 0.0,
                "class_counts": class_counts,
                "bridge_available": self.is_available,
                "subscribed": dict(self.state.subscribed),
                "last_error": self._last_error,
                "objects": active_objects,
                "trajectory": trajectory,
                "human_poses": dict(self.state.human_poses),
                "vehicle_status": {
                    "fresh": (now - self.state.veh_status_time) < 1.0,
                    "speed_act_kmh": self.state.veh_speed_act_kmh,
                    "speed_cmd_kmh": self.state.veh_speed_cmd_kmh,
                    "steer_act_deg": self.state.veh_steer_act_deg,
                    "steer_cmd_deg": self.state.veh_steer_cmd_deg,
                    "gear": self.state.veh_gear,
                    "mode": self.state.veh_mode,
                },
            }

    def get_latest_jpeg(self) -> Optional[bytes]:
        with self.state.lock:
            return self.state.latest_jpeg

    def get_latest_pointcloud_binary(self) -> Tuple[Optional[bytes], float]:
        return self.lidar_streamer.get_latest_binary()
