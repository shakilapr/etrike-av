#!/usr/bin/env bash
source /opt/ros/humble/setup.bash
source /workspace/autoware/install/setup.bash

pkill -9 -f 'rosbag2_player|scanmatcher|graph_based_slam|rviz2|static_transform_publisher|ros2 launch|lidarslam' 2>/dev/null || true
sleep 1

ros2 launch etrike_common_launch etrike_mapping.launch.xml \
    input_cloud:=/sensing/lidar/top/pointcloud_raw_ex \
    use_sim_time:=true \
    save_dir:=/workspace/data \
    use_rviz:=false > /tmp/diag_launch.log 2>&1 &
LPID=$!

sleep 4

echo "--- Topic info before bag play ---"
ros2 topic info -v /sensing/lidar/top/pointcloud_raw_ex

echo "--- Starting bag play ---"
ros2 bag play /workspace/data/bags/etrike_loop_01_trimmed \
    --qos-profile-overrides-path /workspace/data/qos_override.yaml \
    --clock &
BPID=$!

sleep 3

echo "--- Topic info during bag play ---"
ros2 topic info -v /sensing/lidar/top/pointcloud_raw_ex

echo "--- Topic hz during bag play ---"
timeout 4 ros2 topic hz /sensing/lidar/top/pointcloud_raw_ex || true

kill -9 $BPID 2>/dev/null || true
kill -9 $LPID 2>/dev/null || true
pkill -9 -f 'rosbag2_player|scanmatcher|graph_based_slam|rviz2|static_transform_publisher|ros2 launch|lidarslam' 2>/dev/null || true
