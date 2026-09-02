#!/bin/bash
source /opt/autoware/setup.bash
source /workspace/autoware/install/setup.bash
echo "=== RVIZ ==="
ros2 node list 2>/dev/null | grep rviz
echo "=== STATE MONITOR ==="
ros2 node list 2>/dev/null | grep state_monitor
echo "=== LIFECYCLE STATE MONITOR ==="
ros2 lifecycle list /autoware/state_monitor 2>&1 | head -5
echo "=== LIFECYCLE CONTAINERS ==="
ros2 lifecycle list /control/control_container 2>&1 | head -3
ros2 lifecycle list /planning/planning_container 2>&1 | head -3
echo "=== TOPICS ==="
ros2 topic list 2>/dev/null | grep -E "^/autoware/state$|^/initialpose$|^/planning/mission_planning/goal$"
