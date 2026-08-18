#!/bin/bash
# Kill everything inside the container
echo "killing launch processes..."
kill -9 $(pgrep -f "ros2 launch") 2>/dev/null
sleep 1
kill -9 $(pgrep -f "python3.*planning_simulator") 2>/dev/null
sleep 1
echo "killing rviz2..."
killall -9 rviz2 2>/dev/null
sleep 1
echo "killing robot_state_publisher..."
killall -9 robot_state_publisher 2>/dev/null
sleep 1
echo "killing remaining python3..."
killall -9 python3 2>/dev/null
sleep 2
echo "remaining ros2:"
pgrep -cf ros2 2>/dev/null || echo "0"
