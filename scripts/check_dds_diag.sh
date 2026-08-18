#!/bin/bash
# DDS / RMW diagnostic
echo "=== RMW_IMPLEMENTATION ==="
echo "RMW=$RMW_IMPLEMENTATION"
echo "ROS_DOMAIN_ID=$ROS_DOMAIN_ID"
echo "CYCLONEDDS_URI=${CYCLONEDDS_URI:-'(not set)'}"

echo ""
echo "=== /root/.ros/ ==="
ls -la /root/.ros/ 2>/dev/null || echo "(no /root/.ros)"

echo ""
echo "=== DDS config files ==="
find / -name "cyclonedds*.xml" -o -name "rmw_implementation*" 2>/dev/null | head -10

echo ""
echo "=== Can we reach ROS master? ==="
source /opt/autoware/setup.bash 2>/dev/null
source /workspace/autoware/install/setup.bash 2>/dev/null
echo "ROS_DOMAIN_ID=$ROS_DOMAIN_ID"
echo "RMW=$RMW_IMPLEMENTATION"

echo ""
echo "=== ros2 daemon status ==="
pgrep -af "ros2.*daemon"

echo ""
echo "=== Try ros2 topic list ==="
timeout 5 ros2 topic list 2>&1 | head -10

echo ""
echo "=== Try ros2 node list ==="
timeout 5 ros2 node list 2>&1 | head -10
