# Copyright 2026 E-Trike Dev. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, EmitEvent, RegisterEventHandler
from launch.event_handlers import OnProcessStart
from launch.events import matches_action
from launch.substitutions import LaunchConfiguration, PathJoinSubstitution
from launch_ros.actions import LifecycleNode
from launch_ros.event_handlers import OnStateTransition
from launch_ros.events.lifecycle import ChangeState
from launch_ros.substitutions import FindPackageShare
from lifecycle_msgs.msg import Transition


def generate_launch_description():
    camera_arg = DeclareLaunchArgument(
        "camera",
        default_value="front",
        description="Which camera to launch: front or rear",
    )

    camera = LaunchConfiguration("camera")

    config_file = PathJoinSubstitution([
        FindPackageShare("etrike_kinect2"),
        "config",
        ["kinect_", camera, ".yaml"],
    ])

    kinect_node = LifecycleNode(
        package="etrike_kinect2",
        executable="kinect2_node_exec",
        name=["kinect_", camera],
        namespace="",
        parameters=[config_file],
        output="screen",
    )

    configure = EmitEvent(
        event=ChangeState(
            lifecycle_node_matcher=matches_action(kinect_node),
            transition_id=Transition.TRANSITION_CONFIGURE,
        )
    )
    activate = EmitEvent(
        event=ChangeState(
            lifecycle_node_matcher=matches_action(kinect_node),
            transition_id=Transition.TRANSITION_ACTIVATE,
        )
    )

    # The node is a LifecycleNode: configure then activate so it starts
    # streaming (and hotplug-polling) as soon as the process is up.
    return LaunchDescription([
        camera_arg,
        kinect_node,
        RegisterEventHandler(
            OnProcessStart(target_action=kinect_node, on_start=[configure])
        ),
        RegisterEventHandler(
            OnStateTransition(
                target_lifecycle_node=kinect_node,
                goal_state="inactive",
                entities=[activate],
            )
        ),
    ])
