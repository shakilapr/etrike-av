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

"""Launch and activate the E-Trike direct (low-bus) bridge."""

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


def generate_launch_description() -> LaunchDescription:
    can_interface = LaunchConfiguration("can_interface")
    parameter_file = PathJoinSubstitution(
        [FindPackageShare("direct_bridge"), "config", "direct_bridge.param.yaml"]
    )

    bridge = LifecycleNode(
        package="direct_bridge",
        executable="direct_bridge_node",
        name="direct_bridge",
        namespace="",
        output="screen",
        parameters=[parameter_file, {"can_interface": can_interface}],
    )

    configure = EmitEvent(
        event=ChangeState(
            lifecycle_node_matcher=matches_action(bridge),
            transition_id=Transition.TRANSITION_CONFIGURE,
        )
    )
    activate = EmitEvent(
        event=ChangeState(
            lifecycle_node_matcher=matches_action(bridge),
            transition_id=Transition.TRANSITION_ACTIVATE,
        )
    )

    return LaunchDescription(
        [
            DeclareLaunchArgument(
                "can_interface",
                default_value="vcan1",
                description="CAN interface for the low bus. Use vcan1 for bench "
                "testing or can1 once the low-bus drop is wired.",
            ),
            bridge,
            RegisterEventHandler(
                OnProcessStart(target_action=bridge, on_start=[configure])
            ),
            RegisterEventHandler(
                OnStateTransition(
                    target_lifecycle_node=bridge,
                    goal_state="inactive",
                    entities=[activate],
                )
            ),
        ]
    )
