#!/usr/bin/env bash
# ==============================================================================
# E-Trike Stack Launcher (open-etrike.sh)
# ==============================================================================
# Starts or stops the full E-Trike stack on the Jetson:
#   - Docker container (autoware_test) with X11 + USB + GPU + CycloneDDS
#   - CAN bus interface (can2 / canable0)
#   - Autoware Universe (default: planning simulator + RViz; pass --live for Hesai LiDAR + Kinect v2)
#   - autoware_vehicle_bridge (CAN <-> Autoware bridge)
#   - AV Dashboard backend + Chromium app window on the display
#
# Usage:
#   bash scripts/open-etrike.sh                 # Hybrid bench stack (Simulator + RViz + 1 LiDAR + 1 Camera Perception + CAN + AV Dashboard)
#   bash scripts/open-etrike.sh --hybrid-bench  # Explicit hybrid bench mode
#   bash scripts/open-etrike.sh --bench         # Pure bench simulation without physical sensors
#   bash scripts/open-etrike.sh --live          # Full live hardware stack (Hesai + Kinect + CenterPoint + NDT + CAN + AV Dashboard)
#   bash scripts/open-etrike.sh --universe      # Simulator + RViz + AV Dashboard (without hardware CAN)
#   bash scripts/open-etrike.sh --status        # Show status of all services
#   bash scripts/open-etrike.sh --stop          # Stop all E-Trike services and bring down CAN
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODE="${1:---hybrid-bench}"

exec bash "$SCRIPT_DIR/../autoware/scripts/loading/load_pipeline.sh" "$MODE"
