# Copyright 2026 E-Trike Dev.
# Licensed under the Apache License, Version 2.0

import os

from ament_index_python.packages import get_package_share_directory

from launch import LaunchDescription
from launch.actions import (
    DeclareLaunchArgument,
    EmitEvent,
    OpaqueFunction,
    RegisterEventHandler,
)
from launch.events import matches_action
from launch.substitutions import LaunchConfiguration

from launch_ros.actions import LifecycleNode
from launch_ros.event_handlers import OnStateTransition
from launch_ros.events.lifecycle import ChangeState

from lifecycle_msgs.msg import Transition


PACKAGE_NAME = "etrike_kinect2"


def _create_camera(context):
    camera = LaunchConfiguration("camera").perform(context).strip().lower()

    if camera not in ("front", "rear"):
        raise RuntimeError(
            f"Invalid camera '{camera}'. Expected 'front' or 'rear'."
        )

    share = get_package_share_directory(PACKAGE_NAME)

    node_name = f"kinect_{camera}"
    topic_prefix = f"/{node_name}"

    config_file = os.path.join(
        share,
        "config",
        f"{node_name}.yaml",
    )

    if not os.path.isfile(config_file):
        raise RuntimeError(
            f"Kinect config does not exist: {config_file}"
        )

    kinect_node = LifecycleNode(
        package=PACKAGE_NAME,
        executable="kinect2_node_exec",
        name=node_name,

        # Keep the node at root so YAML keys such as
        #
        # kinect_front:
        #   ros__parameters:
        #
        # continue to match.
        namespace="",

        parameters=[config_file],

        # The node publishes relative names such as color/image_raw.
        # Explicit remapping gives front/rear cameras separate topics
        # without changing the node's parameter FQN.
        remappings=[
            (
                "color/image_raw",
                f"{topic_prefix}/color/image_raw",
            ),
            (
                "color/camera_info",
                f"{topic_prefix}/color/camera_info",
            ),
            (
                "depth/image_raw",
                f"{topic_prefix}/depth/image_raw",
            ),
            (
                "depth/camera_info",
                f"{topic_prefix}/depth/camera_info",
            ),
            (
                "depth_registered/image_raw",
                f"{topic_prefix}/depth_registered/image_raw",
            ),
            (
                "ir/image_raw",
                f"{topic_prefix}/ir/image_raw",
            ),
        ],

        output="screen",
    )

    # Register this BEFORE configuring the node.
    #
    # When configure succeeds:
    #
    # unconfigured -> configuring -> inactive
    #
    # this handler observes "inactive" and immediately requests ACTIVATE.
    activate_when_inactive = RegisterEventHandler(
        OnStateTransition(
            target_lifecycle_node=kinect_node,
            goal_state="inactive",
            entities=[
                EmitEvent(
                    event=ChangeState(
                        lifecycle_node_matcher=matches_action(kinect_node),
                        transition_id=Transition.TRANSITION_ACTIVATE,
                    )
                )
            ],
        )
    )

    # Do NOT depend on OnProcessStart.
    #
    # Explicitly ask the LifecycleNode to configure after the action
    # has been inserted into the LaunchDescription.
    configure = EmitEvent(
        event=ChangeState(
            lifecycle_node_matcher=matches_action(kinect_node),
            transition_id=Transition.TRANSITION_CONFIGURE,
        )
    )

    # Ordering matters.
    #
    # 1. handler exists
    # 2. node starts
    # 3. configure event is emitted
    #
    # No ProcessStarted race.
    return [
        activate_when_inactive,
        kinect_node,
        configure,
    ]


def generate_launch_description():
    return LaunchDescription(
        [
            DeclareLaunchArgument(
                "camera",
                default_value="front",
                description="Kinect position: front or rear",
            ),

            OpaqueFunction(function=_create_camera),
        ]
    )
