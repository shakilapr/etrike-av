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

"""Launch the Hesai XT32M2X driver and RViz2 for viewing its point cloud.

Usage (inside the Autoware container):

    ros2 launch etrike_lidar_viewer lidar_view.launch.py

This is intentionally independent of the Autoware stack: it starts only the
Nebula Hesai driver, wired with the E-Trike firetime and angle-calibration
CSVs, and a minimal RViz2 config that shows
``/sensing/lidar/top/pointcloud_raw_ex`` in the ``lidar_link`` frame.
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
    """Return a launch description with the Nebula driver and RViz2."""
    kit_share = get_package_share_directory("etrike_common_launch")
    viewer_share = get_package_share_directory("etrike_lidar_viewer")

    driver = Node(
        package="nebula_hesai",
        executable="hesai_ros_wrapper_node",
        name="hesai_ros_wrapper_node",
        namespace="sensing/lidar/top",
        output="screen",
        remappings=[("aw_points_ex", "pointcloud_raw_ex")],
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

    rviz = Node(
        package="rviz2",
        executable="rviz2",
        name="rviz2",
        arguments=["-d", os.path.join(viewer_share, "rviz", "lidar_only.rviz")],
        output="screen",
    )

    # Publish the lidar frame so it exists in the TF tree (fixes the RViz
    # "Fixed Frame [lidar_link] does not exist" error). The offset matches
    # the real roof mount (1.700 m roof + 0.0464 m optical offset).
    lidar_tf = Node(
        package="tf2_ros",
        executable="static_transform_publisher",
        name="lidar_link_tf",
        arguments=["0", "0", "1.7464", "0", "0", "0", "base_link", "lidar_link"],
        output="screen",
    )

    return LaunchDescription([driver, lidar_tf, rviz])
