#!/bin/bash
source /opt/autoware/setup.bash
source /workspace/autoware/install/setup.bash
echo "=== SIMULATOR PARAMS ==="
ros2 param get /simulation/simple_planning_simulator initialize_source 2>&1
echo "=== PUBLISH DIRECTLY TO /initialpose3d ==="
ros2 topic pub --once /initialpose3d geometry_msgs/msg/PoseWithCovarianceStamped "{
  header: {frame_id: 'map'},
  pose: {pose: {position: {x: 3748.622, y: 73778.0, z: 19.14},
                orientation: {x: 0.0, y: 0.0, z: -0.519, w: 0.8548}},
         covariance: [0.25,0,0,0,0,0, 0,0.25,0,0,0,0, 0,0,0.25,0,0,0, 0,0,0,0.01,0,0, 0,0,0,0,0.01,0, 0,0,0,0,0,0.01]}
}" 2>&1
echo "=== WAIT 5s THEN CHECK TF ==="
sleep 5
timeout 5 ros2 run tf2_ros tf2_echo map base_link 2>&1 | head -5
echo "=== CHECK INIT STATE ==="
timeout 5 ros2 topic echo /localization/initialization_state --once 2>&1 | head -5
echo "=== CHECK KINEMATIC STATE ==="
timeout 5 ros2 topic echo /localization/kinematic_state --once 2>&1 | head -15
