#!/bin/bash
source /opt/autoware/setup.bash
source /workspace/autoware/install/setup.bash
echo "=== PROCESS COUNT ==="
pgrep -cf ros2
echo "=== TF MAP->BASELINK ==="
timeout 5 ros2 run tf2_ros tf2_echo map base_link 2>&1 | head -5
echo "=== INIT STATE TOPIC EXISTS ==="
ros2 topic list 2>/dev/null | grep initialization
echo "=== INIT STATE VALUE ==="
timeout 5 ros2 topic echo /localization/initialization_state --once 2>&1
echo "=== LOCALIZATION NODES ==="
ros2 node list 2>/dev/null | grep local
echo "=== SIMULATOR LOGS ==="
timeout 5 ros2 topic echo /rosout --once 2>&1 | grep -i "initial\|waiting\|simulator" | head -10
