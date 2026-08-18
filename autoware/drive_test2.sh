#!/bin/bash
source /opt/autoware/setup.bash
source /workspace/autoware/install/setup.bash
echo "=== STEP 1: Publish initial pose ==="
ros2 topic pub --once /initialpose geometry_msgs/msg/PoseWithCovarianceStamped "{
  header: {frame_id: 'map'},
  pose: {pose: {position: {x: 3748.622, y: 73778.0, z: 19.14},
                orientation: {x: 0.0, y: 0.0, z: -0.519, w: 0.8548}},
         covariance: [0.25,0,0,0,0,0, 0,0.25,0,0,0,0, 0,0,0.25,0,0,0, 0,0,0,0.01,0,0, 0,0,0,0,0.01,0, 0,0,0,0,0,0.01]}
}" 2>&1
echo "=== STEP 2: Wait for initialization (up to 30s) ==="
for i in $(seq 1 15); do
  out=$(timeout 3 ros2 topic echo /localization/initialization_state --once 2>/dev/null)
  if echo "$out" | grep -q "state: 3"; then echo "INITIALIZED at iteration $i"; break; fi
  echo "waiting... ($i)"
  sleep 2
done
echo "$out"
echo "=== STEP 3: Check vehicle status topics ==="
echo "--- velocity_status ---"
timeout 8 ros2 topic echo /vehicle/status/velocity_status --once 2>&1 | head -15
echo "--- kinematic_state ---"
timeout 8 ros2 topic echo /localization/kinematic_state --once 2>&1 | head -15
echo "--- gear_status ---"
timeout 8 ros2 topic echo /vehicle/status/gear_status --once 2>&1 | head -8
echo "--- control_mode ---"
timeout 8 ros2 topic echo /vehicle/status/control_mode --once 2>&1 | head -8
echo "=== STEP 4: Publish goal ==="
ros2 topic pub --once /planning/mission_planning/goal geometry_msgs/msg/PoseStamped "{
  header: {frame_id: 'map'},
  pose: {position: {x: 3761.07, y: 73755.76, z: 19.25},
         orientation: {x: 0.0, y: 0.0, z: -0.5605, w: 0.8281}}
}" 2>&1
echo "=== STEP 5: Wait for route + state (up to 20s) ==="
sleep 15
echo "--- autoware/state ---"
timeout 5 ros2 topic echo /autoware/state --once 2>&1 | head -5
echo "--- route ---"
timeout 5 ros2 topic echo /planning/mission_planning/route --once 2>&1 | grep -E "sec:|x:|y:" | head -8
echo "--- trajectory velocities ---"
timeout 10 ros2 topic echo /planning/trajectory --once 2>&1 | grep -A2 "longitudinal_velocity_mps" | head -24
echo "=== STEP 6: Engage ==="
ros2 topic pub --once /autoware/engage autoware_vehicle_msgs/msg/Engage "{engage: true}" 2>&1
echo "=== STEP 7: Watch velocity for 20s ==="
for i in $(seq 1 4); do
  sleep 5
  echo "--- velocity at t+${i}x5s ---"
  timeout 6 ros2 topic echo /localization/kinematic_state --once 2>&1 | grep -A8 "twist:" | head -10
done
echo "=== STEP 8: control_cmd after engage ==="
timeout 8 ros2 topic echo /control/command/control_cmd --once 2>&1 | grep -B2 -A8 "longitudinal:" | head -20
echo "=== DONE ==="
