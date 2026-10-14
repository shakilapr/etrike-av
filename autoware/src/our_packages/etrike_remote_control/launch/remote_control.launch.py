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

"""Launch the E-Trike Remote Control Cockpit GUI."""

from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration, PathJoinSubstitution
from launch_ros.actions import Node
from launch_ros.substitutions import FindPackageShare


def generate_launch_description() -> LaunchDescription:
    control_topic = LaunchConfiguration("control_topic")
    engage_topic = LaunchConfiguration("engage_topic")
    publish_rate_hz = LaunchConfiguration("publish_rate_hz")

    parameter_file = PathJoinSubstitution(
        [FindPackageShare("etrike_remote_control"), "config", "remote_control.param.yaml"]
    )

    gui_node = Node(
        package="etrike_remote_control",
        executable="remote_control_gui",
        name="etrike_remote_control_gui",
        namespace="",
        output="screen",
        parameters=[
            parameter_file,
            {
                "control_topic": control_topic,
                "engage_topic": engage_topic,
                "publish_rate_hz": publish_rate_hz,
            },
        ],
    )

    return LaunchDescription(
        [
            DeclareLaunchArgument(
                "control_topic",
                default_value="/control/command/control_cmd",
                description="Topic for vehicle control message.",
            ),
            DeclareLaunchArgument(
                "engage_topic",
                default_value="/api/autoware/get/engage",
                description="Topic for vehicle engage message.",
            ),
            DeclareLaunchArgument(
                "publish_rate_hz",
                default_value="25.0",
                description="Frequency in Hz to publish vehicle control commands.",
            ),
            gui_node,
        ]
    )
