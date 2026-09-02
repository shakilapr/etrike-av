#!/bin/bash
source /opt/autoware/setup.bash
source /workspace/autoware/install/setup.bash
echo "=== QoS of /initialpose3d subscribers ==="
ros2 topic info /initialpose3d --verbose 2>&1 | head -30
echo "=== Try publish with explicit QoS ==="
ros2 topic pub -1 /initialpose3d geometry_msgs/msg/PoseWithCovarianceStamped "{
  header: {frame_id: 'map'},
  pose: {pose: {position: {x: 3748.622, y: 73778.0, z: 19.14},
                orientation: {x: 0.0, y: 0.0, z: -0.519, w: 0.8548}},
         covariance: [0.25,0,0,0,0,0, 0,0.25,0,0,0,0, 0,0,0.25,0,0,0, 0,0,0,0.01,0,0, 0,0,0,0,0.01,0, 0,0,0,0,0,0.01]}
}" --qos-reliability RELIABLE --qos-durability VOLATILE 2>&1
echo "=== Check TF after 3s ==="
sleep 3
timeout 5 ros2 run tf2_ros tf2_echo map base_link 2>&1 | head -5
