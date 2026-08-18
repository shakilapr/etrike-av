#!/bin/bash
# Quick RViz diagnostic — run on Jetson
echo "=== launch log errors ==="
grep -iE "ERROR|WARN|global|tf_fail|map_fail|robot_model" /tmp/launch2.log 2>/dev/null | tail -30

echo ""
echo "=== robot_state_publisher count ==="
pgrep -cf robot_state_publisher

echo ""
echo "=== /tf topics ==="
source /opt/autoware/setup.bash 2>/dev/null
source /workspace/autoware/install/setup.bash 2>/dev/null
timeout 5 ros2 topic list 2>/dev/null | grep -iE "tf|map|robot_desc|pointcloud"

echo ""
echo "=== rviz2 process ==="
pgrep -af rviz2 | head -3

echo ""
echo "=== launch2 log full (last 50 lines) ==="
tail -50 /tmp/launch2.log 2>/dev/null
