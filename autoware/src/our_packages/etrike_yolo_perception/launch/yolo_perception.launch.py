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

"""Launch file for real-time TensorRT YOLO Perception node with bench isolation support."""

import os
from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node


def generate_launch_description():
    pkg_dir = get_package_share_directory("etrike_yolo_perception")
    default_param_file = os.path.join(pkg_dir, "config", "yolo_perception.param.yaml")

    publish_mode_arg = DeclareLaunchArgument(
        "publish_mode",
        default_value="bench",
        description="Perception mode: 'bench' (publishes to isolated /bench_perception/*) or 'vehicle'",
    )

    engine_path_arg = DeclareLaunchArgument(
        "engine_path",
        default_value="/workspace/data/ml_models/yolo26x_fp16.engine",
        description="Path to serialized TensorRT 10.3 engine",
    )

    input_image_arg = DeclareLaunchArgument(
        "input_image_topic",
        default_value="/kinect_front/color/image_raw",
        description="Camera color image topic",
    )

    input_depth_arg = DeclareLaunchArgument(
        "input_depth_topic",
        default_value="/kinect_front/depth/image_raw",
        description="Camera depth image topic",
    )

    conf_thresh_arg = DeclareLaunchArgument(
        "confidence_threshold",
        default_value="0.40",
        description="Detection confidence threshold",
    )

    auto_start_arg = DeclareLaunchArgument(
        "auto_start",
        default_value="true",
        description="Automatically configure and activate the lifecycle node",
    )

    enable_pose_arg = DeclareLaunchArgument(
        "enable_pose_estimation",
        default_value="true",
        description="Enable top-down RTMPose-s human pose estimation",
    )

    pose_engine_arg = DeclareLaunchArgument(
        "pose_engine_path",
        default_value="/workspace/data/ml_models/rtmpose_s_fp16.engine",
        description="Path to serialized RTMPose-s TensorRT engine",
    )

    param_file_arg = DeclareLaunchArgument(
        "param_file",
        default_value=default_param_file,
        description="Path to parameter yaml file",
    )

    node = Node(
        package="etrike_yolo_perception",
        executable="yolo_perception_node.py",
        name="yolo_perception_node",
        output="screen",
        parameters=[
            LaunchConfiguration("param_file"),
            {
                "publish_mode": LaunchConfiguration("publish_mode"),
                "engine_path": LaunchConfiguration("engine_path"),
                "input_image_topic": LaunchConfiguration("input_image_topic"),
                "input_depth_topic": LaunchConfiguration("input_depth_topic"),
                "confidence_threshold": LaunchConfiguration("confidence_threshold"),
                "auto_start": LaunchConfiguration("auto_start"),
                "enable_pose_estimation": LaunchConfiguration("enable_pose_estimation"),
                "pose_engine_path": LaunchConfiguration("pose_engine_path"),
            },
        ],
    )

    return LaunchDescription([
        publish_mode_arg,
        engine_path_arg,
        input_image_arg,
        input_depth_arg,
        conf_thresh_arg,
        auto_start_arg,
        enable_pose_arg,
        pose_engine_arg,
        param_file_arg,
        node,
    ])
