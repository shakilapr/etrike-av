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

# 1. Graceful INT to host viewer and script
pkill -INT -f "fusion_viewer" 2>/dev/null || true
pkill -INT -f "camera_lidar_fusion_node" 2>/dev/null || true
pkill -INT -f "camera-lidar-fusion" 2>/dev/null || true
pkill -INT -f "camera-lidar-fuision" 2>/dev/null || true

# 2. Stop container fusion processes
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    docker exec "$CONTAINER" pkill -INT -f "fusion_viewer" 2>/dev/null || true
    docker exec "$CONTAINER" pkill -INT -f "camera_lidar_fusion_node" 2>/dev/null || true
    sleep 0.5
    docker exec "$CONTAINER" pkill -9 -f "fusion_viewer" 2>/dev/null || true
    docker exec "$CONTAINER" pkill -9 -f "camera_lidar_fusion_node" 2>/dev/null || true
fi

sleep 0.5
pkill -9 -f "fusion_viewer" 2>/dev/null || true
pkill -9 -f "camera_lidar_fusion_node" 2>/dev/null || true
pkill -9 -f "camera-lidar-fusion" 2>/dev/null || true
pkill -9 -f "camera-lidar-fuision" 2>/dev/null || true

echo "[OK] Fusion pipeline closed cleanly."
echo "Background drivers and Autoware Universe simulation remain untouched."
