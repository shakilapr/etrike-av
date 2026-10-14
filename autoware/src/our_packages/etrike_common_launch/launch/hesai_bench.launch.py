#!/usr/bin/env python3
# Copyright 2026 E-Trike Dev. All rights reserved.
"""Hesai XT32M2X LiDAR Bench Launcher.

Launches:
  1. Static transform base_link -> lidar_link
  2. Nebula Hesai driver (PandarXT32M UDP mode on port 2368)
  3. Bench perception LiDAR clustering node (spatial hash clustering -> /bench_perception/clusters)
"""

import os
from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch_ros.actions import Node

DRIVER_PARAMS = {
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
}


def generate_launch_description() -> LaunchDescription:
    kit_share = get_package_share_directory("etrike_common_launch")

    # 1. Static TF: base_link -> lidar_link (x=0.963m, y=0.0m, z=1.58m)
    lidar_tf = Node(
        package="tf2_ros",
        executable="static_transform_publisher",
        name="lidar_link_tf",
        arguments=["0.963", "0", "1.58", "0", "0", "0", "base_link", "lidar_link"],
        output="screen",
    )

    # 2. Hesai XT32M2X Driver
    driver = Node(
        package="nebula_hesai",
        executable="hesai_ros_wrapper_node",
        name="hesai_ros_wrapper_node",
        namespace="sensing/lidar/top",
        output="screen",
        remappings=[("pandar_points", "pointcloud_raw_ex")],
        parameters=[
            {
                **DRIVER_PARAMS,
                "calibration_file": os.path.join(
                    kit_share, "config", "lidar", "PandarXT32M.csv"
                ),
                "firetime_file_path": os.path.join(
                    kit_share, "config", "lidar", "XT32M2X_Firetime.csv"
                ),
            }
        ],
    )

    # 3. Spatial Hash Clustering for LiDAR Point Cloud
    clusterer = Node(
        package="etrike_common_launch",
        executable="bench_perception_node.py",
        name="bench_lidar_clusterer",
        output="screen",
        parameters=[
            {
                "output_objects_topic": "/bench_perception/clusters",
                "output_clusters_topic": "/bench_perception/clusters",
                "publish_rate_hz": 10.0,
                "sensor_timeout_sec": 1.2,
                "voxel_grid_size_m": 0.28,
                "min_cluster_points": 8,
                "enable_hog_person_detector": False,
            }
        ],
    )

    return LaunchDescription([lidar_tf, driver, clusterer])
