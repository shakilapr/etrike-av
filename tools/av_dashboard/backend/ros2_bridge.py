"""ROS 2 Bridge for AV Dashboard.

Backwards-compatible interface re-exporting Ros2Bridge from the modular ros2 package.
"""

from __future__ import annotations

from .ros2.bridge import Ros2Bridge
from .ros2.constants import (
    BASE_LINK_TO_SCENE_Z_OFFSET,
    LABEL_MAP,
    ODOM_FRESH_SEC,
    SOURCE_PRIORITY,
    SOURCE_STALE_SEC,
    quaternion_to_yaw,
)

__all__ = [
    "Ros2Bridge",
    "LABEL_MAP",
    "SOURCE_PRIORITY",
    "SOURCE_STALE_SEC",
    "ODOM_FRESH_SEC",
    "BASE_LINK_TO_SCENE_Z_OFFSET",
    "quaternion_to_yaw",
]
