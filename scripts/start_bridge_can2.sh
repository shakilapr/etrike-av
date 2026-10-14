#!/bin/bash
# Start Autoware Vehicle Bridge persistently on can2
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SIM_MODE="${1:-true}"

echo "Ensuring CANalyst-II adapter & can2 bridge are UP..."
"$SCRIPT_DIR/setup_canalyst.sh" up can2 500000

echo "Verifying Docker container autoware_test is running..."
if ! docker ps --format '{{.Names}}' | grep -q "^autoware_test$"; then
    echo "  [ERROR] Container 'autoware_test' is not running. Start container first."
    exit 1
fi

echo "Stopping any existing vehicle_bridge..."
docker exec autoware_test pkill -9 -f vehicle_bridge 2>/dev/null || true
sleep 1

echo "Starting vehicle_bridge on can2 (sim_mode:=$SIM_MODE) in background..."
docker exec -d autoware_test bash -c "source /opt/ros/humble/setup.bash && source /workspace/autoware/install/setup.bash && nohup ros2 launch autoware_vehicle_bridge vehicle_bridge.launch.py can_interface:=can2 sim_mode:=$SIM_MODE > /tmp/vehicle_bridge.log 2>&1 &"

sleep 3
echo "Checking status..."
if docker exec autoware_test pgrep -f "vehicle_bridge_node" >/dev/null 2>&1; then
    echo "  [OK] Vehicle bridge is verified active on can2!"
    docker exec autoware_test ps aux | grep -i vehicle_bridge | grep -v grep || true
else
    echo "  [ERROR] Vehicle bridge failed to stay alive. Last log output:"
    docker exec autoware_test tail -n 25 /tmp/vehicle_bridge.log 2>/dev/null || true
    exit 1
fi
