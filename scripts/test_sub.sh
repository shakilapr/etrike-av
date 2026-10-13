#!/usr/bin/env bash
source /opt/ros/humble/setup.bash
source /workspace/autoware/install/setup.bash

pkill -9 -f 'rosbag2_player|scanmatcher|graph_based_slam|rviz2|static_transform_publisher|ros2 launch|lidarslam' 2>/dev/null || true
sleep 1

ros2 launch etrike_common_launch etrike_mapping.launch.xml \
    input_cloud:=/sensing/lidar/top/pointcloud_raw_ex \
    use_sim_time:=true \
    save_dir:=/workspace/data \
    use_rviz:=false > /tmp/test_sub.log 2>&1 &
LPID=$!

sleep 4

ros2 node info /scan_matcher

kill -9 $LPID 2>/dev/null || true
pkill -9 -f 'rosbag2_player|scanmatcher|graph_based_slam|rviz2|static_transform_publisher|ros2 launch|lidarslam' 2>/dev/null || true
