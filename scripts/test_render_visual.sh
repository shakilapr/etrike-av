#!/usr/bin/env bash
source /opt/ros/humble/setup.bash
source /workspace/autoware/install/setup.bash

pkill -9 -f 'rosbag2_player|scanmatcher|graph_based_slam|rviz2|static_transform_publisher|ros2 launch|lidarslam' 2>/dev/null || true
sleep 1

echo "Launching mapping stack with RViz..."
ros2 launch etrike_common_launch etrike_mapping.launch.xml \
    input_cloud:=/sensing/lidar/top/pointcloud_raw_ex \
    use_sim_time:=true \
    save_dir:=/workspace/data \
    use_rviz:=true > /tmp/test_render_visual.log 2>&1 &
LPID=$!

sleep 5

echo "Starting bag playback at rate 2.0..."
ros2 bag play /workspace/data/bags/etrike_loop_01_trimmed \
    --qos-profile-overrides-path /workspace/data/qos_override.yaml \
    --clock --rate 2.0 &
BPID=$!

echo "Waiting 18 seconds for vehicle to move and map to accumulate..."
sleep 18

echo "Capturing screen snapshot..."
ffmpeg -y -f x11grab -video_size 1366x768 -i :1.0 -vframes 1 /tmp/test_render_visual.png 2>/dev/null

echo "Stopping test processes..."
kill -9 $BPID 2>/dev/null || true
kill -9 $LPID 2>/dev/null || true
pkill -9 -f 'rosbag2_player|scanmatcher|graph_based_slam|rviz2|static_transform_publisher|ros2 launch|lidarslam' 2>/dev/null || true

echo "Done! Snapshot saved to /tmp/test_render_visual.png"
