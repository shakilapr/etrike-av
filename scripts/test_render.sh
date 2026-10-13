#!/usr/bin/env bash
source /opt/ros/humble/setup.bash
source /workspace/autoware/install/setup.bash

pkill -9 -f 'rosbag2_player|scanmatcher|graph_based_slam|rviz2|static_transform_publisher|ros2 launch|lidarslam' 2>/dev/null || true
sleep 1

ros2 launch etrike_common_launch etrike_mapping.launch.xml \
    input_cloud:=/sensing/lidar/top/pointcloud_raw_ex \
    use_sim_time:=true \
    save_dir:=/workspace/data \
    use_rviz:=true > /tmp/test_launch.log 2>&1 &
LAUNCH_PID=$!

sleep 5

ros2 bag play /workspace/data/bags/etrike_loop_01_trimmed --clock --rate 2.0 &
PLAY_PID=$!

sleep 12

ffmpeg -y -f x11grab -video_size 1366x768 -i :1.0 -vframes 1 /tmp/test_points_rendered.png 2>/dev/null

kill -9 $PLAY_PID 2>/dev/null || true
pkill -9 -f 'rosbag2_player|scanmatcher|graph_based_slam|rviz2|static_transform_publisher|ros2 launch|lidarslam' 2>/dev/null || true
