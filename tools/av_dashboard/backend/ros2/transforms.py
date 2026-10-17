"""Coordinate transformations and pose extraction for Autoware objects."""

from __future__ import annotations

import math
from typing import Any, Dict, List, Optional, Tuple

from .constants import BASE_LINK_TO_SCENE_Z_OFFSET, LABEL_MAP, quaternion_to_yaw


def transform_map_to_base_link(
    x: float, y: float, z: float, yaw: float, ego_pose: Tuple[float, float, float, float]
) -> Tuple[float, float, float, float]:
    ego_x, ego_y, ego_z, ego_yaw = ego_pose
    dx = x - ego_x
    dy = y - ego_y
    dz = z - ego_z

    cos_yaw = math.cos(ego_yaw)
    sin_yaw = math.sin(ego_yaw)

    base_x = cos_yaw * dx + sin_yaw * dy
    base_y = -sin_yaw * dx + cos_yaw * dy
    rel_yaw = yaw - ego_yaw

    three_x = -base_y
    three_y = dz
    three_z = BASE_LINK_TO_SCENE_Z_OFFSET - base_x

    return (round(three_x, 2), round(three_y, 2), round(three_z, 2), round(rel_yaw, 2))


def relative_transform(x: float, y: float, z: float, yaw: float) -> Tuple[float, float, float, float]:
    """Convert an already base_link-relative pose (base: +X fwd, +Y left) to Three.js."""
    return (
        round(-y, 2),
        round(z, 2),
        round(BASE_LINK_TO_SCENE_Z_OFFSET - x, 2),
        round(yaw, 2),
    )


def classify_object(obj: Any) -> str:
    if hasattr(obj, "classification") and obj.classification:
        best = max(obj.classification, key=lambda c: getattr(c, "probability", 0.0))
        return LABEL_MAP.get(int(best.label), "UNKNOWN")
    return "UNKNOWN"


def object_id_str(obj: Any) -> str:
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


def extract_pose(obj: Any, is_predicted: bool = False) -> Optional[Any]:
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


def extract_twist(obj: Any, is_predicted: bool = False) -> Optional[Any]:
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


def convert_pose(
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
            return relative_transform(bx, by, bz, byaw)
        return relative_transform(x, y, z, yaw)
    if pose_ok and ego_pose is not None:
        return transform_map_to_base_link(x, y, z, yaw, ego_pose=ego_pose)
    return (0.0, 0.0, 0.0, 0.0)


def lookup_sensor_to_base_link(tf_buffer: Any, frame_id: str) -> Optional[Tuple[float, float, float, float]]:
    clean_frame = frame_id.lstrip("/")
    if not clean_frame or clean_frame == "base_link" or tf_buffer is None:
        return None
    try:
        from rclpy.time import Time
        tf = tf_buffer.lookup_transform("base_link", clean_frame, Time())
        tr = tf.transform.translation
        rot = tf.transform.rotation
        syaw = quaternion_to_yaw(rot.x, rot.y, rot.z, rot.w)
        return (float(tr.x), float(tr.y), float(tr.z), syaw)
    except Exception:
        return None
