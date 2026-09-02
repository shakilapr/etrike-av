#!/bin/bash
source /opt/autoware/setup.bash
source /workspace/autoware/install/setup.bash
echo "=== FULL /initialpose3d VERBOSE (subscribers section) ==="
ros2 topic info /initialpose3d --verbose 2>&1 | grep -A30 "Subscription count"
echo "=== DIRECT SUBSCRIBER CHECK ==="
ros2 node info /simulation/simple_planning_simulator 2>&1 | grep -B1 -A3 "initialpose"
echo "=== CHECK if simulator is REALLY subscribed ==="
timeout 3 ros2 topic echo /initialpose3d --once 2>&1 | head -3
echo "=== SIMULATOR WAITING LOG ==="
timeout 5 ros2 topic echo /rosout --once 2>&1 | grep -i "waiting\|initial" | head -5
