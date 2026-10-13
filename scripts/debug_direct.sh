#!/usr/bin/env bash
source /opt/ros/humble/setup.bash
source /workspace/autoware/install/setup.bash

pkill -9 -f 'rosbag2_player|scanmatcher|graph_based_slam|rviz2|static_transform_publisher|ros2 launch|lidarslam' 2>/dev/null || true
sleep 1

# Start static transform publisher
/opt/ros/humble/lib/tf2_ros/static_transform_publisher \
    --x 0.575 --y 0 --z 1.7464 --qx 0 --qy 0 --qz 0 --qw 1 \
    --frame-id base_link --child-frame-id lidar_link \
    --ros-args -p use_sim_time:=true &
TFPID=$!

sleep 1

# Run scanmatcher_node in background and capture all stdout/stderr
/workspace/autoware/install/scanmatcher/lib/scanmatcher/scanmatcher_node \
    --ros-args \
    --params-file /workspace/autoware/install/lidarslam/share/lidarslam/param/lidarslam.yaml \
    -p use_sim_time:=true \
    -p global_frame_id:=map \
    -p robot_frame_id:=base_link \
    -r /input_cloud:=/sensing/lidar/top/pointcloud_raw_ex \
    -r /imu:=/imu > /tmp/scanmatcher_direct.log 2>&1 &
SMPID=$!

sleep 3

# Play 5 seconds of bag with QoS overrides
ros2 bag play /workspace/data/bags/etrike_loop_01_trimmed \
    --qos-profile-overrides-path /workspace/data/qos_override.yaml \
    --clock --rate 1.0 &
BPID=$!

sleep 6

kill -9 $BPID 2>/dev/null || true
kill -9 $SMPID 2>/dev/null || true
kill -9 $TFPID 2>/dev/null || true

echo "=== scanmatcher_direct.log ==="
cat /tmp/scanmatcher_direct.log
