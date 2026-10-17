"""Constants and classification mappings for Autoware ROS 2 messages."""

from __future__ import annotations

import math
from typing import Dict, Tuple

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

SOURCE_PRIORITY: Tuple[str, ...] = ("tracking", "prediction", "detection")
SOURCE_STALE_SEC: float = 1.5
ODOM_FRESH_SEC: float = 1.0
BASE_LINK_TO_SCENE_Z_OFFSET: float = 1.0


def quaternion_to_yaw(qx: float, qy: float, qz: float, qw: float) -> float:
    """Extract yaw angle (radians) around Z axis from a quaternion."""
    siny_cosp = 2.0 * (qw * qz + qx * qy)
    cosy_cosp = 1.0 - 2.0 * (qy * qy + qz * qz)
    return math.atan2(siny_cosp, cosy_cosp)
