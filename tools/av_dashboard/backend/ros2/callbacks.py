"""Callback handlers for Autoware Universe and sensor topics."""

from __future__ import annotations

import math
import time
from typing import Any, Dict, List, Optional, Tuple

from .constants import BASE_LINK_TO_SCENE_Z_OFFSET, SOURCE_STALE_SEC, quaternion_to_yaw
from .state import Ros2State
from .transforms import (
    classify_object,
    convert_pose,
    extract_pose,
    extract_twist,
    lookup_sensor_to_base_link,
    object_id_str,
    relative_transform,
)


def process_objects_batch(
    state: Ros2State, objects: List[Any], frame_id: str, source: str, is_predicted: bool = False
) -> None:
    now = time.time()
    is_map_frame = ("map" in frame_id) or ("odom" in frame_id)
    sensor_tf = None if is_map_frame else lookup_sensor_to_base_link(state.tf_buffer, frame_id)

    with state.lock:
        pose_ok = (not is_map_frame) or (state.has_ego_pose and (now - state.ego_time) < SOURCE_STALE_SEC)
        ego_snapshot = (state.ego_x, state.ego_y, state.ego_z, state.ego_yaw)

    converted: List[Dict[str, Any]] = []
    for obj in objects:
        pose = extract_pose(obj, is_predicted)
        if pose is None:
            continue
        pos = pose.position
        ori = pose.orientation
        yaw = quaternion_to_yaw(ori.x, ori.y, ori.z, ori.w)
        tx, ty, tz, rel_yaw = convert_pose(
            float(pos.x), float(pos.y), float(pos.z), yaw,
            is_map_frame, pose_ok, ego_pose=ego_snapshot, sensor_tf=sensor_tf,
        )
        shape = getattr(obj, "shape", None)
        dim = getattr(shape, "dimensions", None) if shape else None
        dx = float(dim.x) if dim else 1.8
        dy = float(dim.y) if dim else 4.0
        dz = float(dim.z) if dim else 1.5

        twist = extract_twist(obj, is_predicted)
        speed_kmh = 0.0
        if twist is not None:
            lin = getattr(twist, "linear", None)
            if lin is not None:
                speed_kmh = round(math.hypot(float(lin.x), float(lin.y)) * 3.6, 1)

        converted.append({
            "id": object_id_str(obj),
            "label": classify_object(obj),
            "x": tx, "y": ty, "z": tz, "dx": dx, "dy": dy, "dz": dz,
            "yaw": rel_yaw, "speed_kmh": speed_kmh,
        })

    with state.lock:
        state.sources[source] = converted
        state.source_time[source] = now
        state.source_frame[source] = frame_id
        state.source_pose_ok[source] = pose_ok
        state.topic_counts[source] += 1
        state.perception_timestamps.append(now)
        state.last_detection_canonical_time = now


def handle_trajectory(state: Ros2State, msg: Any) -> None:
    now = time.time()
    is_map_frame = ("map" in msg.header.frame_id) or ("odom" in msg.header.frame_id)
    with state.lock:
        pose_ok = (not is_map_frame) or (state.has_ego_pose and (now - state.ego_time) < SOURCE_STALE_SEC)
        ego_snapshot = (state.ego_x, state.ego_y, state.ego_z, state.ego_yaw)

    traj_points: List[Dict[str, float]] = []
    n_pts = len(msg.points)
    if pose_ok and n_pts > 0:
        indices = list(range(n_pts)) if n_pts <= 32 else [round(k * (n_pts - 1) / 31) for k in range(32)]
        for i in indices:
            pt = msg.points[i]
            pos = pt.pose.position
            ori = pt.pose.orientation
            yaw = quaternion_to_yaw(ori.x, ori.y, ori.z, ori.w)
            tx, ty, tz, _ = convert_pose(
                float(pos.x), float(pos.y), float(pos.z), yaw,
                is_map_frame, pose_ok, ego_pose=ego_snapshot
            )
            traj_points.append({"x": tx, "y": ty, "z": tz})

    with state.lock:
        state.planned_trajectory = traj_points
        state.last_trajectory_time = now
        state.trajectory_frame = msg.header.frame_id
        state.trajectory_pose_ok = pose_ok
        state.topic_counts["trajectory"] += 1


def handle_odometry(state: Ros2State, msg: Any) -> None:
    pos = msg.pose.pose.position
    ori = msg.pose.pose.orientation
    yaw = quaternion_to_yaw(ori.x, ori.y, ori.z, ori.w)
    twist = msg.twist.twist
    lin = twist.linear
    ang = twist.angular
    speed_kmh = round(math.hypot(float(lin.x), float(lin.y)) * 3.6, 1)
    yaw_rate = round(float(ang.z) * 1000.0, 1)

    with state.lock:
        state.ego_x = float(pos.x)
        state.ego_y = float(pos.y)
        state.ego_z = float(pos.z)
        state.ego_yaw = yaw
        state.ego_speed_kmh = speed_kmh
        state.ego_yaw_rate_mrad_s = yaw_rate
        state.has_ego_pose = True
        state.ego_time = time.time()
        state.topic_counts["odometry"] += 1


def handle_current_pose(state: Ros2State, msg: Any) -> None:
    now = time.time()
    with state.lock:
        if (now - state.ego_time) < 1.0:
            return
        pos = msg.pose.position
        ori = msg.pose.orientation
        state.ego_x = float(pos.x)
        state.ego_y = float(pos.y)
        state.ego_z = float(pos.z)
        state.ego_yaw = quaternion_to_yaw(ori.x, ori.y, ori.z, ori.w)
        state.has_ego_pose = True
        state.ego_time = now
        state.topic_counts["pose"] += 1
