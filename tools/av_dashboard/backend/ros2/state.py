"""Thread-safe state container for ROS 2 perception and planning."""

from __future__ import annotations

import threading
from typing import Any, Dict, List, Optional


class Ros2State:
    """Encapsulates all mutable state populated by ROS 2 topic subscribers."""

    def __init__(self) -> None:
        self.lock: threading.Lock = threading.Lock()
        self.subscribed: Dict[str, bool] = {}

        # Ego vehicle state in map frame
        self.ego_x: float = 0.0
        self.ego_y: float = 0.0
        self.ego_z: float = 0.0
        self.ego_yaw: float = 0.0
        self.ego_speed_kmh: float = 0.0
        self.ego_yaw_rate_mrad_s: float = 0.0
        self.has_ego_pose: bool = False
        self.ego_time: float = 0.0
        self.tf_buffer: Any = None

        # Per-source converted objects
        self.sources: Dict[str, List[Dict[str, Any]]] = {"tracking": [], "prediction": [], "detection": []}
        self.source_time: Dict[str, float] = {"tracking": 0.0, "prediction": 0.0, "detection": 0.0}
        self.source_frame: Dict[str, str] = {"tracking": "", "prediction": "", "detection": ""}
        self.source_pose_ok: Dict[str, bool] = {"tracking": False, "prediction": False, "detection": False}
        self.topic_counts: Dict[str, int] = {
            "tracking": 0, "prediction": 0, "detection": 0, "trajectory": 0, "odometry": 0, "pose": 0, "tf": 0
        }
        self.perception_timestamps: List[float] = []
        self.last_detection_canonical_time: float = 0.0

        # Trajectory
        self.planned_trajectory: List[Dict[str, float]] = []
        self.last_trajectory_time: float = 0.0
        self.trajectory_frame: str = ""
        self.trajectory_pose_ok: bool = False

        # Vehicle status fallback
        self.veh_speed_act_kmh: Optional[float] = None
        self.veh_speed_cmd_kmh: Optional[float] = None
        self.veh_steer_act_deg: Optional[float] = None
        self.veh_steer_cmd_deg: Optional[float] = None
        self.veh_gear: Optional[str] = None
        self.veh_mode: Optional[str] = None
        self.veh_turn_left: bool = False
        self.veh_turn_right: bool = False
        self.veh_hazard: bool = False
        self.veh_status_time: float = 0.0

        # Bench perception
        self.bench_perception_status: Dict[str, Any] = {
            "mode": "UNAVAILABLE", "object_count": 0, "latency_ms": 0.0,
            "camera_online": False, "lidar_online": False, "camera_connected": False,
            "lidar_connected": False, "timestamp": 0.0,
        }
        self.bench_perception_time: float = 0.0
        self.camera_objects: List[Dict[str, Any]] = []
        self.lidar_objects: List[Dict[str, Any]] = []
        self.last_camera_image_time: float = 0.0
        self.last_camera_det_time: float = 0.0
        self.last_lidar_raw_time: float = 0.0
        self.last_lidar_cluster_time: float = 0.0
        self.camera_timestamps: List[float] = []
        self.lidar_timestamps: List[float] = []
        self.human_poses: Dict[str, Any] = {}
        self.human_poses_time: float = 0.0
        self.latest_jpeg: Optional[bytes] = None
        self.latest_jpeg_time: float = 0.0
        self.latest_debug_jpeg_time: float = 0.0
        self.fusion_tracks: List[Dict[str, Any]] = []
        self.last_fusion_tracks_time: float = 0.0
