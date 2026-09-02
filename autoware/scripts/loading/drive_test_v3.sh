#!/bin/bash
source /opt/autoware/setup.bash
source /workspace/autoware/install/setup.bash
echo "=== STEP 1: Check autoware/state ==="
timeout 5 ros2 topic echo /autoware/state --once 2>&1 | head -3
echo "=== STEP 2: Check kinematic_state ==="
timeout 5 ros2 topic echo /localization/kinematic_state --once 2>&1 | head -15
echo "=== STEP 3: Check velocity_status ==="
timeout 5 ros2 topic echo /vehicle/status/velocity_status --once 2>&1 | head -15
echo "=== STEP 4: Check gear_status ==="
timeout 5 ros2 topic echo /vehicle/status/gear_status --once 2>&1 | head -8
echo "=== STEP 5: Check control_mode ==="
timeout 5 ros2 topic echo /vehicle/status/control_mode --once 2>&1 | head -8
echo "=== STEP 6: Publish goal near origin ==="
ros2 topic pub --once /planning/mission_planning/goal geometry_msgs/msg/PoseStamped "{
  header: {frame_id: 'map'},
  pose: {position: {x: 50.0, y: 0.0, z: 0.0},
         orientation: {x: 0.0, y: 0.0, z: 0.0, w: 1.0}}
}" 2>&1
echo "=== STEP 7: Wait for route (15s) ==="
sleep 15
echo "--- state ---"
timeout 5 ros2 topic echo /autoware/state --once 2>&1 | head -3
echo "--- route ---"
timeout 5 ros2 topic echo /planning/mission_planning/route --once 2>&1 | grep -E "sec:|x:|y:" | head -8
echo "--- trajectory velocities ---"
timeout 10 ros2 topic echo /planning/trajectory --once 2>&1 | grep -A2 "longitudinal_velocity_mps" | head -24
echo "=== STEP 8: Engage ==="
ros2 topic pub --once /autoware/engage autoware_vehicle_msgs/msg/Engage "{engage: true}" 2>&1
echo "=== STEP 9: Watch velocity 20s ==="
for i in $(seq 1 4); do
  sleep 5
  echo "--- velocity at t+${i}x5s ---"
  timeout 6 ros2 topic echo /localization/kinematic_state --once 2>&1 | grep -A8 "twist:" | head -10
done
echo "=== STEP 10: control_cmd ==="
timeout 8 ros2 topic echo /control/command/control_cmd --once 2>&1 | grep -B2 -A8 "longitudinal:" | head -20
echo "=== DONE ==="
