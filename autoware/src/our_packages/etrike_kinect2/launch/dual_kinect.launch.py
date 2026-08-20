# Copyright 2026 E-Trike Dev.
# Licensed under the Apache License, Version 2.0

"""Dual Kinect v2 driver launcher.

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
