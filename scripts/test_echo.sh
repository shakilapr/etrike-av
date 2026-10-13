#!/usr/bin/env bash
source /opt/ros/humble/setup.bash

ros2 bag play /workspace/data/bags/etrike_loop_01_trimmed --clock &
BPID=$!

sleep 1

ros2 topic echo /sensing/lidar/top/pointcloud_raw_ex --qos-reliability best_effort --no-arr --once

kill -9 $BPID 2>/dev/null || true
pkill -9 -f 'rosbag2_player' 2>/dev/null || true
