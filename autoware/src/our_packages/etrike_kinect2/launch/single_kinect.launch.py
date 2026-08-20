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
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration, PathJoinSubstitution
from launch_ros.actions import LifecycleNode
from launch_ros.substitutions import FindPackageShare


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
        remappings=[
            ("color/image_raw", ["/kinect_", camera, "/color/image_raw"]),
            ("color/camera_info", ["/kinect_", camera, "/color/camera_info"]),
            ("depth/image_raw", ["/kinect_", camera, "/depth/image_raw"]),
            ("depth/camera_info", ["/kinect_", camera, "/depth/camera_info"]),
            ("ir/image_raw", ["/kinect_", camera, "/ir/image_raw"]),
        ],
        output="screen",
    )

    # The node starts unconfigured. Drive its lifecycle explicitly for bring-up:
    #   ros2 lifecycle set /kinect_<camera> configure
    #   ros2 lifecycle set /kinect_<camera> activate
    # (Automated lifecycle activation is added back once the manual path is
    # proven, to avoid racing the node's lifecycle server at startup.)
    return LaunchDescription([
        camera_arg,
        kinect_node,
    ])
