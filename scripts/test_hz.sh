#!/usr/bin/env bash
source /opt/ros/humble/setup.bash

ros2 bag play /workspace/data/bags/etrike_loop_01_trimmed \
    --qos-profile-overrides-path /workspace/data/qos_override.yaml &
BPID=$!

sleep 2

ros2 topic hz /sensing/lidar/top/pointcloud_raw_ex &
HZPID=$!

sleep 4

kill -9 $HZPID 2>/dev/null || true
kill -9 $BPID 2>/dev/null || true
pkill -9 -f 'rosbag2_player' 2>/dev/null || true
