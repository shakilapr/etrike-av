#!/usr/bin/env bash
# ==============================================================================
# camera-lidar-fuision.sh — Legacy wrapper for camera-lidar-fusion.sh
# ==============================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "$SCRIPT_DIR/camera-lidar-fusion.sh" "$@"
