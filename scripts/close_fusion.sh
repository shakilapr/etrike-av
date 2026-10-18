#!/usr/bin/env bash
# ==============================================================================
# close_fusion.sh — Cleanly Stop Camera + LiDAR Fusion Pipeline
# ==============================================================================
# Stops the fusion node and viewer without terminating underlying drivers or
# interfering with the Autoware Universe autonomous driving stack.
#
# Usage:
#   bash ~/av_project/scripts/close_fusion.sh
# ==============================================================================

set -eo pipefail

CONTAINER="autoware_test"

echo "======================================================================"
echo " Stopping Camera + LiDAR Real-Time Fusion Pipeline"
echo "======================================================================"

# 1. Kill host viewer if running
pkill -9 -f "fusion_viewer" 2>/dev/null || true
pkill -9 -f "camera_lidar_fusion_node" 2>/dev/null || true

# 2. Kill container fusion processes
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    docker exec "$CONTAINER" pkill -9 -f "fusion_viewer" 2>/dev/null || true
    docker exec "$CONTAINER" pkill -9 -f "camera_lidar_fusion_node" 2>/dev/null || true
fi

echo "[OK] Fusion pipeline closed cleanly."
echo "Background drivers and Autoware Universe simulation remain untouched."
