#!/bin/bash
source /opt/autoware/setup.bash
source /workspace/autoware/install/setup.bash
echo "=== RAW NODE INFO ==="
ros2 node info /simulation/simple_planning_simulator 2>&1 | head -60
