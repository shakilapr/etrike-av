#!/bin/bash
# One-shot drive test: pose -> goal -> engage -> measure motion
source /opt/autoware/setup.bash
source /workspace/autoware/install/setup.bash
export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp

echo "=== [1] wait for /autoware/state ==="
for i in $(seq 1 30); do
  out=$(timeout 3 ros2 topic echo /autoware/state --once 2>/dev/null)
  if [ -n "$out" ]; then echo "$out"; break; fi
  sleep 3
done

echo "=== [2] publish initial pose (user's pose) ==="
ros2 topic pub --once /initialpose geometry_msgs/msg/PoseWithCovarianceStamped "{
  header: {frame_id: 'map'},
  pose: {pose: {position: {x: 3748.622, y: 73778.0, z: 19.14},
                orientation: {x: 0.0, y: 0.0, z: -0.519, w: 0.8548}},
         covariance: [0.25,0,0,0,0,0, 0,0.25,0,0,0,0, 0,0,0.25,0,0,0, 0,0,0,0.01,0,0, 0,0,0,0,0.01,0, 0,0,0,0,0,0.01]}
}"
echo "published"

echo "=== [3] wait for localization INITIALIZED ==="
for i in $(seq 1 20); do
  out=$(timeout 3 ros2 topic echo /localization/initialization_state --once 2>/dev/null)
  if echo "$out" | grep -q "state: 3"; then echo "INITIALIZED"; break; fi
  sleep 2
done
echo "$out"

echo "=== [4] vehicle status topics (10s each) ==="
for t in /vehicle/status/velocity_status /vehicle/status/gear_status /vehicle/status/control_mode /localization/kinematic_state; do
  echo "--- $t ---"
  timeout 10 ros2 topic echo "$t" --once 2>&1 | head -25
done

echo "=== [5] publish goal pose ==="
ros2 topic pub --once /planning/mission_planning/goal geometry_msgs/msg/PoseStamped "{
  header: {frame_id: 'map'},
  pose: {position: {x: 3761.07, y: 73755.76, z: 19.25},
         orientation: {x: 0.0, y: 0.0, z: -0.5605, w: 0.8281}}
}"
sleep 12

echo "=== [6] state after goal ==="
timeout 3 ros2 topic echo /autoware/state --once 2>&1
echo "=== route? ==="
timeout 3 ros2 topic echo /planning/mission_planning/route --once 2>&1 | grep -E "sec:|x:|y:" | head -8
echo "=== trajectory velocity points ==="
timeout 10 ros2 topic echo /planning/trajectory --once 2>&1 | grep -A2 "longitudinal_velocity_mps" | head -24

echo "=== [7] engage ==="
svc=$(ros2 service list 2>/dev/null | grep -iE "operation_mode.*change_to_autonomous")
if [ -n "$svc" ]; then
  echo "calling $svc"
  ros2 service call /api/operation_mode/change_to_autonomous std_srvs/srv/Trigger
else
  echo "no change_to_autonomous service; publishing /autoware/engage"
  ros2 topic pub --once /autoware/engage autoware_vehicle_msgs/msg/Engage "{engage: true}"
fi

echo "=== [8] state after engage ==="
sleep 3
timeout 3 ros2 topic echo /autoware/state --once 2>&1
timeout 3 ros2 topic echo /system/operation_mode/state --once 2>&1

echo "=== [9] watch velocity 25s ==="
for i in $(seq 1 5); do
  out=$(timeout 6 ros2 topic echo /localization/kinematic_state --once 2>/dev/null)
  echo "$out" | grep -A6 "twist:" | head -8
  sleep 1
done

echo "=== [10] control_cmd after engage ==="
timeout 10 ros2 topic echo /control/command/control_cmd --once 2>&1 | grep -B2 -A8 "longitudinal:" | head -20

echo "=== DONE ==="
