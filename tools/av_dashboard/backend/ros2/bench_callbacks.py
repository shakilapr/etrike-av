"""Callback handlers for bench camera, LiDAR, and multi-modal fusion."""

from __future__ import annotations

import math
import time
from typing import Any, Dict, List

from .constants import BASE_LINK_TO_SCENE_Z_OFFSET, quaternion_to_yaw
from .state import Ros2State
from .transforms import relative_transform


def handle_image(state: Ros2State, msg: Any) -> None:
    now = time.time()
    data = bytes(msg.data)
    with state.lock:
        state.latest_jpeg = data
        state.latest_jpeg_time = now
        state.last_camera_image_time = now
        state.camera_timestamps.append(now)


def handle_fused_markers(state: Ros2State, msg: Any) -> None:
    now = time.time()
    tracks: List[Dict[str, Any]] = []
    for m in msg.markers:
        if m.action != 0:
            continue
        pos = m.pose.position
        ori = m.pose.orientation
        scale = m.scale
        color = m.color
        yaw = quaternion_to_yaw(ori.x, ori.y, ori.z, ori.w)

        is_fused = (color.b > 0.7 and color.r < 0.4)
        is_lidar = (color.r > 0.7 and color.g < 0.7)
        sensor_type = "fused" if is_fused else "lidar" if is_lidar else "camera"

        tx, ty, tz, rel_yaw = relative_transform(float(pos.x), float(pos.y), float(pos.z), yaw)
        dist = round(math.hypot(float(pos.x), float(pos.y)), 1)

        track_id = f"fuse_{m.id}"
        if state.human_poses and isinstance(state.human_poses, dict):
            for p in state.human_poses.get("poses", []):
                p_x = -float(p.get("y_base", 0.0))
                p_z = round(BASE_LINK_TO_SCENE_Z_OFFSET - float(p.get("x_base", 0.0)), 2)
                if math.hypot(tx - p_x, tz - p_z) < 2.5:
                    track_id = str(p.get("id")) or track_id
                    break

        tracks.append({
            "id": track_id,
            "label": "PEDESTRIAN",
            "x": tx, "y": ty, "z": tz,
            "dx": round(float(scale.x), 2), "dy": round(float(scale.y), 2), "dz": round(float(scale.z), 2),
            "yaw": rel_yaw, "speed_kmh": 0.0, "fused": is_fused, "sensor": sensor_type,
            "dist": dist, "confidence": 0.95 if is_fused else 0.75,
        })

    with state.lock:
        state.fusion_tracks = tracks
        state.last_fusion_tracks_time = now
        state.last_lidar_cluster_time = now
        state.lidar_timestamps.append(now)


def handle_human_poses(state: Ros2State, msg: Any) -> None:
    now = time.time()
    try:
        import json
        payload = json.loads(msg.data)
        with state.lock:
            state.human_poses = payload
            state.human_poses_time = now
            state.last_camera_det_time = now
    except Exception:
        pass
