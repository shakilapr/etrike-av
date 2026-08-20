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

Launches the etrike_kinect2 driver nodes and an RViz2 window showing the
color and depth image streams. Intended for quick bring-up / debugging
on the Jetson - independent of the full Autoware stack.

Usage (on the Jetson, inside the Autoware container):

    # Both cameras (requires serials in config/kinect_front.yaml + rear):
    ros2 launch etrike_kinect2 kinect_view.launch.py camera:=dual

    # Single camera (front or rear):
    ros2 launch etrike_kinect2 kinect_view.launch.py camera:=front
    ros2 launch etrike_kinect2 kinect_view.launch.py camera:=rear

The driver nodes start unconfigured. Bring them to active with:

    ros2 lifecycle set /kinect_front configure
    ros2 lifecycle set /kinect_front activate

Prereqs:
    - libfreenect2 installed, udev rules, USB 3.0
    - serial numbers filled into config/kinect_{front,rear}.yaml
      (find them with: ros2 run etrike_kinect2 kinect2_node_exec --discover)
"""

import os

from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.conditions import IfCondition
from launch.substitutions import LaunchConfiguration, PathJoinSubstitution, PythonExpression
from launch_ros.actions import LifecycleNode, Node
from launch_ros.substitutions import FindPackageShare


def _camera_node(camera: str, enabled: IfCondition):
    # Node is named "kinect_<camera>" (no ROS namespace) so the param file key
    # "kinect_<camera>" matches. Topics are remapped under /kinect_<camera>/.
    return LifecycleNode(
        package="etrike_kinect2",
        executable="kinect2_node_exec",
        name=f"kinect_{camera}",
        namespace="",
        condition=enabled,
        parameters=[
            PathJoinSubstitution([
                FindPackageShare("etrike_kinect2"),
                "config",
                f"kinect_{camera}.yaml",
            ]),
        ],
        remappings=[
            ("color/image_raw", f"/kinect_{camera}/color/image_raw"),
            ("color/camera_info", f"/kinect_{camera}/color/camera_info"),
            ("depth/image_raw", f"/kinect_{camera}/depth/image_raw"),
            ("depth/camera_info", f"/kinect_{camera}/depth/camera_info"),
            ("ir/image_raw", f"/kinect_{camera}/ir/image_raw"),
        ],
        output="screen",
    )


def generate_launch_description() -> LaunchDescription:
    share = get_package_share_directory("etrike_kinect2")

    camera_arg = DeclareLaunchArgument(
        "camera", default_value="dual",
        description="Which camera(s) to view: front, rear, or dual",
    )
    camera = LaunchConfiguration("camera")

    show_front = IfCondition(
        PythonExpression(
            ["'", camera, "' == 'front' or '", camera, "' == 'dual'"]
        )
    )
    show_rear = IfCondition(
        PythonExpression(
            ["'", camera, "' == 'rear' or '", camera, "' == 'dual'"]
        )
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
        _camera_node("front", show_front),
        _camera_node("rear", show_rear),
        rviz,
    ])
