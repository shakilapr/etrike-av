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

"""Launch direct vehicle control bench: vehicle bridge + remote control GUI."""

from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, EmitEvent, RegisterEventHandler
from launch.event_handlers import OnProcessStart
from launch.events import matches_action
from launch.substitutions import LaunchConfiguration, PathJoinSubstitution
from launch_ros.actions import LifecycleNode, Node
from launch_ros.event_handlers import OnStateTransition
from launch_ros.events.lifecycle import ChangeState
from launch_ros.substitutions import FindPackageShare
from lifecycle_msgs.msg import Transition


def generate_launch_description() -> LaunchDescription:
    can_interface = LaunchConfiguration("can_interface")
    sim_mode = LaunchConfiguration("sim_mode")
    publish_rate_hz = LaunchConfiguration("publish_rate_hz")

    bridge_param_file = PathJoinSubstitution(
        [FindPackageShare("autoware_vehicle_bridge"), "config", "etrike.param.yaml"]
    )
    remote_param_file = PathJoinSubstitution(
        [FindPackageShare("etrike_remote_control"), "config", "remote_control.param.yaml"]
    )

    # 1. autoware_vehicle_bridge lifecycle node
    bridge = LifecycleNode(
        package="autoware_vehicle_bridge",
        executable="vehicle_bridge_node",
        name="vehicle_bridge",
        namespace="",
        output="screen",
        parameters=[
            bridge_param_file,
            {
                "can_interface": can_interface,
                "sim_mode": sim_mode,
            },
        ],
        remappings=[("~/input/engage", "/api/autoware/get/engage")],
    )

    configure_bridge = EmitEvent(
        event=ChangeState(
            lifecycle_node_matcher=matches_action(bridge),
            transition_id=Transition.TRANSITION_CONFIGURE,
        )
    )
    activate_bridge = EmitEvent(
        event=ChangeState(
            lifecycle_node_matcher=matches_action(bridge),
            transition_id=Transition.TRANSITION_ACTIVATE,
        )
    )

    # 2. etrike_remote_control GUI node
    gui_node = Node(
        package="etrike_remote_control",
        executable="remote_control_gui",
        name="etrike_remote_control_gui",
        namespace="",
        output="screen",
        parameters=[
            remote_param_file,
            {
                "engage_topic": "/api/autoware/get/engage",
                "publish_rate_hz": publish_rate_hz,
            },
        ],
    )

    return LaunchDescription(
        [
            DeclareLaunchArgument(
                "can_interface",
                default_value="can2",
                description="CAN interface for vehicle bridge (can2 for CANalyst-II).",
            ),
            DeclareLaunchArgument(
                "sim_mode",
                default_value="true",
                description="sim_mode:=true allows direct bench actuator testing without RT/SYS heartbeat blocker.",
            ),
            DeclareLaunchArgument(
                "publish_rate_hz",
                default_value="25.0",
                description="Frequency in Hz to publish vehicle control commands.",
            ),
            bridge,
            RegisterEventHandler(
                OnProcessStart(target_action=bridge, on_start=[configure_bridge])
            ),
            RegisterEventHandler(
                OnStateTransition(
                    target_lifecycle_node=bridge,
                    goal_state="inactive",
                    entities=[activate_bridge],
                )
            ),
            gui_node,
        ]
    )
