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
from launch.substitutions import PathJoinSubstitution
from launch_ros.actions import LifecycleNode
from launch_ros.substitutions import FindPackageShare


def _camera_node(camera: str):
    # Serial numbers are read from config YAML files.
    # Edit config/kinect_front.yaml and config/kinect_rear.yaml before launching.
    # NOTE: the node is named "kinect_<camera>" (no ROS namespace) so the
    # param file key "kinect_<camera>" matches — namespacing would hide the
    # params and the driver would never load the serial.
    # Topics are remapped under /kinect_<camera>/ so both cameras coexist.
    return LifecycleNode(
        package="etrike_kinect2",
        executable="kinect2_node_exec",
        name=f"kinect_{camera}",
        namespace="",
        parameters=[
            PathJoinSubstitution([
                FindPackageShare("etrike_kinect2"), "config", f"kinect_{camera}.yaml"
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


def generate_launch_description():
    # Nodes start unconfigured. Bring them to active with:
    #   ros2 lifecycle set /kinect_front configure
    #   ros2 lifecycle set /kinect_front activate
    #   ros2 lifecycle set /kinect_rear configure
    #   ros2 lifecycle set /kinect_rear activate
    return LaunchDescription([
        _camera_node("front"),
        _camera_node("rear"),
    ])
