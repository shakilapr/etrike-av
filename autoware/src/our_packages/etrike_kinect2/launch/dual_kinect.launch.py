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
from launch.actions import EmitEvent, GroupAction, RegisterEventHandler
from launch.event_handlers import OnProcessStart
from launch.events import matches_action
from launch.substitutions import PathJoinSubstitution
from launch_ros.actions import LifecycleNode, PushRosNamespace
from launch_ros.event_handlers import OnStateTransition
from launch_ros.events.lifecycle import ChangeState
from launch_ros.substitutions import FindPackageShare
from lifecycle_msgs.msg import Transition


def _camera_group(camera: str) -> GroupAction:
    # Serial numbers are read from config YAML files.
    # Edit config/kinect_front.yaml and config/kinect_rear.yaml before launching.
    node = LifecycleNode(
        package="etrike_kinect2",
        executable="kinect2_node_exec",
        name=f"kinect_{camera}",
        namespace=f"kinect_{camera}",
        parameters=[
            PathJoinSubstitution([
                FindPackageShare("etrike_kinect2"), "config", f"kinect_{camera}.yaml"
            ]),
        ],
        output="screen",
    )

    configure = EmitEvent(
        event=ChangeState(
            lifecycle_node_matcher=matches_action(node),
            transition_id=Transition.TRANSITION_CONFIGURE,
        )
    )
    activate = EmitEvent(
        event=ChangeState(
            lifecycle_node_matcher=matches_action(node),
            transition_id=Transition.TRANSITION_ACTIVATE,
        )
    )

    # Each node is a LifecycleNode: configure then activate so it starts
    # streaming (and hotplug-polling) as soon as the process is up.
    return GroupAction([
        PushRosNamespace(f"kinect_{camera}"),
        node,
        RegisterEventHandler(
            OnProcessStart(target_action=node, on_start=[configure])
        ),
        RegisterEventHandler(
            OnStateTransition(
                target_lifecycle_node=node,
                goal_state="inactive",
                entities=[activate],
            )
        ),
    ])


def generate_launch_description():
    return LaunchDescription([
        _camera_group("front"),
        _camera_group("rear"),
    ])
