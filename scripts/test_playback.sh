#!/usr/bin/env bash
source /opt/ros/humble/setup.bash
source /workspace/autoware/install/setup.bash

pkill -9 -f 'rosbag2_player|scanmatcher|graph_based_slam|rviz2|static_transform_publisher|ros2 launch|lidarslam' 2>/dev/null || true
sleep 1

ros2 launch etrike_common_launch etrike_mapping.launch.xml \
    input_cloud:=/sensing/lidar/top/pointcloud_raw_ex \
    use_sim_time:=true \
    save_dir:=/workspace/data \
    use_rviz:=false > /tmp/scan_test.log 2>&1 &
LPID=$!

sleep 4

echo "Starting 6s bag playback with QoS overrides..."
ros2 bag play /workspace/data/bags/etrike_loop_01_trimmed \
    --qos-profile-overrides-path /workspace/data/qos_override.yaml \
    --clock --rate 2.0 &
BPID=$!

sleep 6

kill -9 $BPID 2>/dev/null || true
kill -9 $LPID 2>/dev/null || true
pkill -9 -f 'rosbag2_player|scanmatcher|graph_based_slam|rviz2|static_transform_publisher|ros2 launch|lidarslam' 2>/dev/null || true

echo "--- Scanmatcher log output ---"
cat /tmp/scan_test.log | grep -E 'scan_matcher|initial|cloud|map|publish|points|REJECT|WARN|ERROR' | tail -n 40
