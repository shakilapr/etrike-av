#!/usr/bin/env bash
# ==============================================================================
# E-Trike Stack Shutdown (close-etrike.sh)
# ==============================================================================
# Cleanly stops all running E-Trike services on the Jetson:
#   - Autoware Universe / ROS 2 nodes / RViz / Nebula / Kinect2
#   - autoware_vehicle_bridge
#   - AV Dashboard & CAN Watcher backend servers + Chromium/Electron UI windows
#   - CAN bus interface (can2 / canable0)
#
# Usage:
#   bash scripts/close-etrike.sh
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

exec bash "$SCRIPT_DIR/../autoware/scripts/loading/load_pipeline.sh" --stop
