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
Launch both Kinect v2 driver nodes (front + rear).

Equivalent to: ros2 launch etrike_kinect2 kinect_view.launch.py camera:=dual
but WITHOUT the RViz viewer — just both camera driver nodes.
"""

import os

from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource


PACKAGE_NAME = "etrike_kinect2"


def generate_launch_description():
    share = get_package_share_directory(PACKAGE_NAME)

    single_kinect = os.path.join(share, "launch", "single_kinect.launch.py")

    front = IncludeLaunchDescription(
        PythonLaunchDescriptionSource(single_kinect),
        launch_arguments={"camera": "front"}.items(),
    )
    rear = IncludeLaunchDescription(
        PythonLaunchDescriptionSource(single_kinect),
        launch_arguments={"camera": "rear"}.items(),
    )

    return LaunchDescription([
        DeclareLaunchArgument(
            "camera", default_value="front",
            description="Kept for CLI compatibility (front/rear/dual); ",
        ),
        front,
        rear,
    ])
