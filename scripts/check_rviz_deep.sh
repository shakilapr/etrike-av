#!/bin/bash
# Deeper RViz diagnostic
echo "=== all ros logs ==="
ls -la /root/.ros/log/ 2>/dev/null | tail -10

echo ""
echo "=== latest launch log ==="
ls -la /tmp/launch*.log 2>/dev/null
cat /tmp/launch.log 2>/dev/null | tail -30
cat /tmp/launch2.log 2>/dev/null | tail -30

echo ""
echo "=== ros2 node list ==="
source /opt/autoware/setup.bash 2>/dev/null
source /workspace/autoware/install/setup.bash 2>/dev/null
timeout 8 ros2 node list 2>/dev/null | head -30

echo ""
echo "=== ros2 topic list ==="
timeout 8 ros2 topic list 2>/dev/null | grep -iE "tf|map|robot_desc|pointcloud|vehicle" | head -20

echo ""
echo "=== /robot_description size ==="
timeout 8 ros2 topic echo /robot_description --once 2>/dev/null | wc -c

echo ""
echo "=== rviz2 stderr ==="
cat /root/.ros/log/latest/rviz2*.log 2>/dev/null | tail -30

echo ""
echo "=== all running nodes ==="
pgrep -af "ros2|rviz|robot_state|planning|control" | head -20
