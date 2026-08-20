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

"""
Standalone Kinect v2 viewer (RGB + depth) for the E-Trike.

Launches the etrike_kinect2 driver and an RViz2 window showing the
color and depth image streams. Intended for quick bring-up / debugging
on the Jetson - independent of the full Autoware stack.

Usage (on the Jetson, inside the Autoware container):

    # Both cameras (requires serials in config/kinect_front.yaml + rear):
    ros2 launch etrike_kinect2 kinect_view.launch.py camera:=dual

    # Single camera (front or rear):
    ros2 launch etrike_kinect2 kinect_view.launch.py camera:=front
    ros2 launch etrike_kinect2 kinect_view.launch.py camera:=rear

Prereqs:
    - libfreenect2 installed, udev rules, USB 3.0
    - serial numbers filled into config/kinect_{front,rear}.yaml
      (find them with: ros2 run etrike_kinect2 kinect2_node_exec --discover)
"""

import os

from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, IncludeLaunchDescription
from launch.conditions import IfCondition
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import LaunchConfiguration, PythonExpression
from launch_ros.actions import Node


def generate_launch_description() -> LaunchDescription:
    share = get_package_share_directory("etrike_kinect2")

    camera_arg = DeclareLaunchArgument(
        "camera", default_value="dual",
        description="Which camera(s) to view: front, rear, or dual",
    )
    camera = LaunchConfiguration("camera")

    single = PythonLaunchDescriptionSource(
        os.path.join(share, "launch", "single_kinect.launch.py")
    )

    front_launch = IncludeLaunchDescription(
        single,
        launch_arguments={"camera": "front"}.items(),
        condition=IfCondition(
            PythonExpression(
                ["'", camera, "' == 'front' or '", camera, "' == 'dual'"]
            )
        ),
    )
    rear_launch = IncludeLaunchDescription(
        single,
        launch_arguments={"camera": "rear"}.items(),
        condition=IfCondition(
            PythonExpression(
                ["'", camera, "' == 'rear' or '", camera, "' == 'dual'"]
            )
        ),
    )

    rviz = Node(
        package="rviz2",
        executable="rviz2",
        name="rviz2",
        # Render on the Jetson's physical monitor. RViz inherits the full launch
        # environment (AMENT_PREFIX_PATH, LD_LIBRARY_PATH, DISPLAY from the
        # container), which keeps every rcl/rviz dependency resolvable.
        arguments=["-d", os.path.join(share, "rviz", "kinect_view.rviz")],
        output="screen",
    )

    return LaunchDescription([
        camera_arg,
        front_launch,
        rear_launch,
        rviz,
    ])
