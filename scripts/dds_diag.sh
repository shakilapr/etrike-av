#!/bin/bash
source /opt/autoware/setup.bash 2>/dev/null
source /workspace/autoware/install/setup.bash 2>/dev/null

echo "1. RMW_IMPLEMENTATION: $RMW_IMPLEMENTATION"
echo "2. ROS_DOMAIN_ID: $ROS_DOMAIN_ID"
echo "3. ros2 location: $(which ros2 2>&1)"

echo "4. dpkg rmw:"
dpkg -l 2>/dev/null | grep -i rmw | head -5

echo "5. ROS setup files:"
ls -la /opt/autoware/setup.bash /workspace/autoware/install/setup.bash 2>&1

echo "6. topic list:"
timeout 5 ros2 topic list 2>&1 | head -10

echo "7. node list:"
timeout 5 ros2 node list 2>&1 | head -10

echo "8. robot_description:"
timeout 5 ros2 topic echo /robot_description --once 2>&1 | wc -c

echo "9. Running rviz2:"
pgrep -af rviz2 | head -2

echo "10. Running robot_state_publisher:"
pgrep -af robot_state_publisher | head -2
