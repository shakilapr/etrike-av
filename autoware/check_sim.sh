#!/bin/bash
source /opt/autoware/setup.bash
source /workspace/autoware/install/setup.bash
echo "=== SIMULATOR NODE EXISTS ==="
ros2 node list 2>/dev/null | grep simple_planning
echo "=== SIMULATOR SUBSCRIPTIONS ==="
ros2 node info /simulation/simple_planning_simulator 2>&1 | grep -A20 "Subscriptions:" | head -25
echo "=== PROCESS COUNT ==="
pgrep -cf ros2
