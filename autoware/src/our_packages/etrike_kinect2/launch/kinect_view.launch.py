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

import os

from ament_index_python.packages import get_package_share_directory

from launch import LaunchDescription
from launch.actions import (
    DeclareLaunchArgument,
    IncludeLaunchDescription,
    OpaqueFunction,
    SetEnvironmentVariable,
)
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import LaunchConfiguration

from launch_ros.actions import Node


PACKAGE_NAME = "etrike_kinect2"


def _launch_cameras(context):
    selected = (
        LaunchConfiguration("camera")
        .perform(context)
        .strip()
        .lower()
    )

    if selected == "front":
        cameras = ["front"]
    elif selected == "rear":
        cameras = ["rear"]
    elif selected == "dual":
        cameras = ["front", "rear"]
    else:
        raise RuntimeError(
            f"Invalid camera '{selected}'. "
            "Expected front, rear, or dual."
        )

    share = get_package_share_directory(PACKAGE_NAME)

    launch_file = os.path.join(
        share,
        "launch",
        "single_kinect.launch.py",
    )

    if not os.path.isfile(launch_file):
        raise RuntimeError(
            f"Missing launch file: {launch_file}"
        )

    actions = []

    for camera in cameras:
        actions.append(
            IncludeLaunchDescription(
                PythonLaunchDescriptionSource(launch_file),
                launch_arguments={
                    "camera": camera,
                }.items(),
            )
        )

    return actions


def generate_launch_description():
    share = get_package_share_directory(PACKAGE_NAME)

    rviz_config = os.path.join(
        share,
        "rviz",
        "kinect_view.rviz",
    )

    camera = DeclareLaunchArgument(
        "camera",
        default_value="front",
        description="front, rear, or dual",
    )

    display = DeclareLaunchArgument(
        "display",
        default_value=":1",
        description="X11 display used by RViz",
    )

    # This modifies DISPLAY while preserving AMENT_PREFIX_PATH,
    # LD_LIBRARY_PATH and every other inherited environment variable.
    #
    # Do NOT use:
    #
    # Node(..., env={"DISPLAY": ":1"})
    #
    # because that can replace the process environment.
    set_display = SetEnvironmentVariable(
        name="DISPLAY",
        value=LaunchConfiguration("display"),
    )

    cameras = OpaqueFunction(
        function=_launch_cameras,
    )

    rviz = Node(
        package="rviz2",
        executable="rviz2",
        name="kinect_viewer",
        arguments=[
            "-d",
            rviz_config,
        ],
        output="screen",
    )

    return LaunchDescription(
        [
            camera,
            display,

            set_display,

            cameras,

            rviz,
        ]
    )
