#!/bin/bash
source /opt/autoware/setup.bash
source /workspace/autoware/install/setup.bash
echo "=== OPERATION MODE STATE ==="
timeout 5 ros2 topic echo /system/operation_mode/state --once 2>&1
echo "=== GEAR CMD ==="
timeout 5 ros2 topic echo /control/command/gear_cmd --once 2>&1
echo "=== AUTOWARE STATE ==="
timeout 5 ros2 topic echo /autoware/state --once 2>&1
echo "=== TRAJECTORY (first 3 points) ==="
timeout 10 ros2 topic echo /planning/trajectory --once 2>&1 | head -30
echo "=== FULL CONTROL CMD ==="
timeout 8 ros2 topic echo /control/command/control_cmd --once 2>&1 | head -30
