#!/usr/bin/env python3
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

"""Hybrid Bench Sensing & Perception Launcher (1 LiDAR + 1 Camera).

Launches:
  1. Hesai XT32M2X LiDAR driver (Nebula UDP mode @ 2368)
  2. Single Kinect v2 camera driver (kinect_front on USB @ 2:4)
  3. Camera0 topic relays (/sensing/camera/camera0/*)
  4. Real-time 3D Bench Perception Node (bench_perception_node.py)
"""

import os
import sys

from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, IncludeLaunchDescription
from launch.conditions import IfCondition
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node


def generate_launch_description() -> LaunchDescription:
    pkg_common = get_package_share_directory("etrike_common_launch")
    pkg_kinect = get_package_share_directory("etrike_kinect2")

    feed_autoware = LaunchConfiguration("feed_autoware_simulation")
    feed_autoware_arg = DeclareLaunchArgument(
        "feed_autoware_simulation",
        default_value="false",
        description="If true, relays raw sensors to Autoware internal topics. Default false (bench isolation).",
    )

    # 1. Hesai XT32M2X LiDAR driver (Nebula UDP mode)
    lidar_calib = os.path.join(pkg_common, "config", "lidar", "PandarXT32M.csv")
    lidar_firetime = os.path.join(pkg_common, "config", "lidar", "XT32M2X_Firetime.csv")

    nebula_driver = Node(
        package="nebula_hesai",
        executable="hesai_ros_wrapper_node",
        name="hesai_ros_wrapper_node",
        namespace="sensing/lidar/top",
        output="screen",
        remappings=[("pandar_points", "pointcloud_raw_ex")],
        parameters=[
            {
                "sensor_model": "PandarXT32M",
                "launch_hw": True,
                "setup_sensor": True,
                "retry_hw": True,
                "frame_id": "lidar_link",
                "host_ip": "0.0.0.0",
                "sensor_ip": "192.168.1.201",
                "multicast_ip": "",
                "data_port": 2368,
                "gnss_port": 10110,
                "return_mode": "LastStrongest",
                "rotation_speed": 600,
                "scan_phase": 0.0,
                "min_range": 0.3,
                "max_range": 300.0,
                "cloud_min_angle": 0,
                "cloud_max_angle": 360,
                "cut_angle": 0.0,
                "sync_angle": 0,
                "dual_return_distance_threshold": 0.1,
                "packet_mtu_size": 1500,
                "udp_socket_receive_buffer_size_bytes": 1048576,
                "calibration_download_enabled": False,
                "udp_only": True,
                "diag_span": 1000,
                "diagnostics.packet_loss.error_threshold": 5,
                "diagnostics.pointcloud_publish_rate.frequency_ok.min_hz": 9.0,
                "diagnostics.pointcloud_publish_rate.frequency_warn.min_hz": 8.0,
                "forward_packets_to_rosbag": False,
                "ptp_profile": "1588v2",
                "ptp_domain": 0,
                "ptp_transport_type": "UDP",
                "ptp_switch_type": "TSN",
                "ptp_lock_threshold": 100,
                "calibration_file": lidar_calib,
                "firetime_file_path": lidar_firetime,
            }
        ],
    )

    # Relay raw_ex -> before_sync (disabled by default on bench to protect Autoware simulation & localization)
    lidar_relay = Node(
        package="topic_tools",
        executable="relay",
        name="lidar_bench_sync_relay",
        output="screen",
        condition=IfCondition(feed_autoware),
        parameters=[
            {
                "input_topic": "/sensing/lidar/top/pointcloud_raw_ex",
                "output_topic": "/sensing/lidar/top/pointcloud_before_sync",
                "lazy": False,
            }
        ],
    )

    # 2. Single Kinect v2 camera driver (front)
    kinect_launch_path = os.path.join(pkg_kinect, "launch", "single_kinect.launch.py")
    kinect_node = IncludeLaunchDescription(
        PythonLaunchDescriptionSource(kinect_launch_path),
        launch_arguments={"camera": "front"}.items(),
    )

    # 3. Canonical camera0 relays (disabled by default on bench to avoid injecting into Autoware vision)
    cam0_color_relay = Node(
        package="topic_tools",
        executable="relay",
        name="kinect_bench_cam0_color_relay",
        output="screen",
        condition=IfCondition(feed_autoware),
        parameters=[
            {
                "input_topic": "/kinect_front/color/image_raw",
                "output_topic": "/sensing/camera/camera0/image_rect_color",
                "lazy": True,
            }
        ],
    )
    cam0_info_relay = Node(
        package="topic_tools",
        executable="relay",
        name="kinect_bench_cam0_info_relay",
        output="screen",
        condition=IfCondition(feed_autoware),
        parameters=[
            {
                "input_topic": "/kinect_front/color/camera_info",
                "output_topic": "/sensing/camera/camera0/camera_info",
                "lazy": True,
            }
        ],
    )

    # 4. Bench Perception Node (LiDAR point cloud clustering publishing to isolated topic)
    perception_node = Node(
        package="etrike_common_launch",
        executable="bench_perception_node.py",
        name="bench_perception_node",
        output="screen",
        parameters=[
            {
                "output_objects_topic": "/bench_perception/objects",
                "publish_rate_hz": 10.0,
                "sensor_timeout_sec": 1.5,
                "min_cluster_points": 8,
                "voxel_grid_size_m": 0.28,
                "enable_hog_person_detector": False,
            }
        ],
    )

    # 5. TensorRT YOLOv8x + RTMPose-s Real-time Bench Perception Node (Camera)
    pkg_yolo = get_package_share_directory("etrike_yolo_perception")
    yolo_launch_path = os.path.join(pkg_yolo, "launch", "yolo_perception.launch.py")
    yolo_node = IncludeLaunchDescription(
        PythonLaunchDescriptionSource(yolo_launch_path),
        launch_arguments={
            "publish_mode": "bench",
            "auto_start": "true",
            "confidence_threshold": "0.35",
        }.items(),
    )

    return LaunchDescription(
        [
            feed_autoware_arg,
            nebula_driver,
            lidar_relay,
            kinect_node,
            cam0_color_relay,
            cam0_info_relay,
            perception_node,
            yolo_node,
        ]
    )

