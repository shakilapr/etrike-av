#!/usr/bin/env bash
# ==============================================================================
# Close E-Trike Remote Cockpit & Vehicle Bridge Cleanly on Jetson
# ==============================================================================
# Gracefully stops:
#   - etrike_remote_control GUI
#   - vehicle_bridge (sends zero actuation and neutral before shutdown)
#   - Any leftover teleop processes
#
# Leaves the Docker container in a clean state so you can start Autoware
# Universe without conflicts.
#
# Usage:
#   bash scripts/close_remote_control.sh
# ==============================================================================

set -eo pipefail

CONTAINER="autoware_test"

echo "======================================================================"
echo " Closing Remote Cockpit & Vehicle Bridge"
echo "======================================================================"

if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    echo "--> Stopping Remote Control GUI and Vehicle Bridge inside $CONTAINER..."
    docker exec -u root "$CONTAINER" bash -c "
        # 1. Terminate remote control GUI and launcher first
        pkill -INT -f 'etrike_remote_control' 2>/dev/null || true
        pkill -INT -f 'bench_remote_control' 2>/dev/null || true
        pkill -INT -f 'remote_control_gui' 2>/dev/null || true
        sleep 0.5
        pkill --signal SIGKILL -f 'etrike_remote_control' 2>/dev/null || true
        pkill --signal SIGKILL -f 'bench_remote_control' 2>/dev/null || true
        pkill --signal SIGKILL -f 'remote_control_gui' 2>/dev/null || true

        # 2. Terminate vehicle bridge gracefully
        pkill -INT -f 'vehicle_bridge' 2>/dev/null || true
        pkill -INT -f 'vehicle_bridge_node' 2>/dev/null || true
        pkill -INT -f 'autoware_vehicle_bridge' 2>/dev/null || true
        sleep 1
        pkill --signal SIGKILL -f 'vehicle_bridge' 2>/dev/null || true
        pkill --signal SIGKILL -f 'vehicle_bridge_node' 2>/dev/null || true
        pkill --signal SIGKILL -f 'autoware_vehicle_bridge' 2>/dev/null || true
    " || true
    echo "  [OK] Nodes terminated inside container."
fi

# Stop any host teleop/dashboard processes if they were started
echo "--> Cleaning any teleop web/host processes..."
pkill -f "autoware_teleop_web" 2>/dev/null || true
pkill -f "etrike_remote_control" 2>/dev/null || true

echo "======================================================================"
echo " [CLEAN] Remote Cockpit & Vehicle Bridge are completely closed."
echo " You can now cleanly start Autoware Universe with:"
echo "   bash ~/av_project/autoware/scripts/loading/load_pipeline.sh --bench"
echo "======================================================================"
