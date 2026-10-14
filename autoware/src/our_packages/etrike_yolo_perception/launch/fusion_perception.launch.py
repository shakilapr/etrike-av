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

"""Launch file for Camera + LiDAR Multi-Modal Fusion and 3D Human Mesh Visualizer."""

import os
from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.conditions import IfCondition
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node


def generate_launch_description():
    pkg_dir = get_package_share_directory("etrike_yolo_perception")
    rviz_config = os.path.join(pkg_dir, "rviz", "fusion_perception.rviz")
    mesh_path = os.path.join(pkg_dir, "models", "human_model.obj")

    use_rviz_arg = DeclareLaunchArgument(
        "use_rviz",
        default_value="true",
        description="Whether to launch native RViz2 visualizer",
    )

    # 1. Base Static TFs if not already published
    tf_kinect = Node(
        package="tf2_ros",
        executable="static_transform_publisher",
        name="kinect_front_tf",
        arguments=["1.20", "0.0", "1.00", "0.0", "0.0", "0.0", "base_link", "kinect_front_link"],
        output="screen",
    )

    tf_kinect_optical = Node(
        package="tf2_ros",
        executable="static_transform_publisher",
        name="kinect_front_optical_tf",
        arguments=["0.0", "0.0", "0.0", "-1.5707963", "0.0", "-1.5707963", "kinect_front_link", "kinect_front_optical_link"],
        output="screen",
    )

    tf_lidar = Node(
        package="tf2_ros",
        executable="static_transform_publisher",
        name="lidar_link_tf",
        arguments=["0.963", "0.0", "1.58", "0.0", "0.0", "0.0", "base_link", "lidar_link"],
        output="screen",
    )

    # 2. Multi-Modal Fusion & 3D Mesh Generator Node
    fusion_mesh_node = Node(
        package="etrike_yolo_perception",
        executable="fusion_mesh_node.py",
        name="fusion_mesh_node",
        output="screen",
        parameters=[
            {
                "publish_rate_hz": 15.0,
                "sensor_timeout_sec": 1.5,
                "camera_image_topic": "/kinect_front/color/image_raw",
                "camera_info_topic": "/kinect_front/depth/camera_info",
                "camera_objects_topic": "/bench_perception/objects",
                "camera_poses_topic": "/bench_perception/human_poses",
                "lidar_clusters_topic": "/bench_perception/clusters",
                "mesh_resource_uri": f"file://{mesh_path}",
                "fusion_dist_threshold_m": 1.2,
            }
        ],
    )

    # 3. RViz2 Native Visualization Window
    rviz_node = Node(
        package="rviz2",
        executable="rviz2",
        name="fusion_rviz2",
        arguments=["-d", rviz_config],
        condition=IfCondition(LaunchConfiguration("use_rviz")),
        output="screen",
    )

    return LaunchDescription([
        use_rviz_arg,
        tf_kinect,
        tf_kinect_optical,
        tf_lidar,
        fusion_mesh_node,
        rviz_node,
    ])
