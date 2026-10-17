"""Registers ROS 2 subscribers on the bridge node."""

from __future__ import annotations

import math
import time
from typing import Any, Callable

from .bench_callbacks import handle_fused_markers, handle_human_poses, handle_image
from .callbacks import handle_current_pose, handle_odometry, handle_trajectory, process_objects_batch
from .state import Ros2State


def setup_all_subscriptions(node: Any, state: Ros2State, lidar_streamer: Any) -> None:
    from rclpy.qos import QoSDurabilityPolicy, QoSHistoryPolicy, QoSProfile, QoSReliabilityPolicy

    sensor_qos = QoSProfile(
        history=QoSHistoryPolicy.KEEP_LAST,
        depth=1,
        reliability=QoSReliabilityPolicy.BEST_EFFORT,
        durability=QoSDurabilityPolicy.VOLATILE,
    )
    status_qos = QoSProfile(
        history=QoSHistoryPolicy.KEEP_LAST,
        depth=5,
        reliability=QoSReliabilityPolicy.RELIABLE,
        durability=QoSDurabilityPolicy.VOLATILE,
    )

    def mark(name: str, ok: bool):
        state.subscribed[name] = ok

    # 1. Perception Objects
    try:
        from autoware_perception_msgs.msg import TrackedObjects
        node.create_subscription(
            TrackedObjects, "/perception/object_recognition/tracking/objects",
            lambda msg: process_objects_batch(state, msg.objects, msg.header.frame_id, "tracking"),
            sensor_qos,
        )
        mark("tracking", True)
    except Exception:
        mark("tracking", False)

    # 2. Planning Trajectory
    try:
        from autoware_planning_msgs.msg import Trajectory
        for top in ("/planning/scenario_planning/trajectory", "/planning/trajectory"):
            try:
                node.create_subscription(Trajectory, top, lambda m: handle_trajectory(state, m), status_qos)
            except Exception:
                pass
        mark("trajectory", True)
    except Exception:
        mark("trajectory", False)

    # 3. Odometry
    try:
        from nav_msgs.msg import Odometry
        node.create_subscription(Odometry, "/localization/kinematic_state", lambda m: handle_odometry(state, m), sensor_qos)
        mark("odometry", True)
    except Exception:
        mark("odometry", False)

    # 4. Fused 3D Markers from fusion_mesh_node
    try:
        from visualization_msgs.msg import MarkerArray
        node.create_subscription(MarkerArray, "/perception/fusion/lidar_boxes_3d", lambda m: handle_fused_markers(state, m), sensor_qos)
        mark("fusion_boxes", True)
    except Exception:
        mark("fusion_boxes", False)

    # 5. RTMPose-s 2D Human Poses
    try:
        from std_msgs.msg import String as StringMsg
        node.create_subscription(StringMsg, "/perception/camera/human_poses", lambda m: handle_human_poses(state, m), sensor_qos)
        mark("human_poses", True)
    except Exception:
        mark("human_poses", False)

    # 6. JPEG Image stream
    try:
        from sensor_msgs.msg import CompressedImage
        for top in ("/perception/camera/debug_image/compressed", "/camera/image_raw/compressed"):
            try:
                node.create_subscription(CompressedImage, top, lambda m: handle_image(state, m), sensor_qos)
            except Exception:
                pass
        mark("camera_image", True)
    except Exception:
        mark("camera_image", False)

    # 7. LiDAR Point Cloud
    try:
        from sensor_msgs.msg import PointCloud2
        node.create_subscription(
            PointCloud2, "/lidar/points_raw",
            lambda m: lidar_streamer.process_pointcloud(bytes(m.data), m.point_step, m.width * m.height),
            sensor_qos,
        )
        mark("lidar_cloud", True)
    except Exception:
        mark("lidar_cloud", False)
