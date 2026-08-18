#!/bin/bash
# Kill all Autoware/ROS processes on the Jetson.
# Run from the host: bash scripts/kill_all.sh

set -euo pipefail

echo "=== Stopping all Autoware containers ==="
docker rm -f autoware_test 2>/dev/null || true

echo "=== Killing leftover processes on host ==="
pkill -9 -f "ros2" 2>/dev/null || true
pkill -9 -f "rviz2" 2>/dev/null || true
pkill -9 -f "robot_state_publisher" 2>/dev/null || true
pkill -9 -f "planning_simulator" 2>/dev/null || true

echo "=== Done ==="
echo "Containers:"
docker ps -a --format "{{.Names}} {{.Status}}" 2>/dev/null || true
echo "Remaining ros2 processes:"
pgrep -cf ros2 2>/dev/null || echo "0"
