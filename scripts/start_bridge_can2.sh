#!/bin/bash
# Start Autoware Vehicle Bridge persistently on can2
set -e

echo "Ensuring can2 is UP..."
sudo ip link set can2 type can bitrate 500000 2>/dev/null || true
sudo ip link set can2 up 2>/dev/null || true

echo "Stopping any existing vehicle_bridge..."
docker exec autoware_test pkill -f vehicle_bridge 2>/dev/null || true
sleep 1

echo "Starting vehicle_bridge on can2 in background..."
docker exec -d autoware_test bash -c "nohup ros2 launch autoware_vehicle_bridge vehicle_bridge.launch.py can_interface:=can2 > /tmp/vehicle_bridge.log 2>&1 &"

sleep 2
echo "Checking status..."
docker exec autoware_test ps aux | grep -i vehicle_bridge | grep -v grep
echo "Vehicle bridge is now running continuously on can2!"
