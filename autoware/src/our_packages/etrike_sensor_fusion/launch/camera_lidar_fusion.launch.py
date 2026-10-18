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

"""Launch file for Isolated Real-Time Camera + LiDAR Sensor Fusion."""

import os
from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.conditions import IfCondition
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import LifecycleNode, Node


def generate_launch_description():
    pkg_dir = get_package_share_directory("etrike_sensor_fusion")
    param_file = os.path.join(pkg_dir, "config", "fusion.param.yaml")

    use_viewer_arg = DeclareLaunchArgument(
        "use_viewer",
        default_value="true",
        description="Whether to launch native X11 OpenCV HUD viewer window",
    )

    fusion_node = LifecycleNode(
        package="etrike_sensor_fusion",
        executable="camera_lidar_fusion_node.py",
        name="camera_lidar_fusion_node",
        namespace="",
        parameters=[param_file],
        output="screen",
    )

    viewer_node = Node(
        package="etrike_sensor_fusion",
        executable="fusion_viewer.py",
        name="fusion_viewer_node",
        output="screen",
        condition=IfCondition(LaunchConfiguration("use_viewer")),
    )

    return LaunchDescription([
        use_viewer_arg,
        fusion_node,
        viewer_node,
    ])
