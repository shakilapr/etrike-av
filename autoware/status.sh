#!/bin/bash
source /opt/autoware/setup.bash
source /workspace/autoware/install/setup.bash
echo "=== ros2 process count ==="
pgrep -cf ros2
echo "=== node list (count) ==="
ros2 node list 2>/dev/null | wc -l
echo "=== autoware/state present? ==="
ros2 topic list 2>/dev/null | grep -c autoware/state
echo "=== launch log tail ==="
tail -20 /tmp/launch.log 2>/dev/null
