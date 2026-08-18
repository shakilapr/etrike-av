#!/bin/bash
# LiDAR bench bring-up script for the E-Trike Hesai XT32M2X.
#
# This script automates the Phase 2 verification steps:
#   1. Verify network connectivity to the sensor
#   2. Verify UDP packet stream
#   3. Launch the sensing pipeline (with or without the driver)
#   4. Check for point cloud topic output
#   5. Verify TF tree
#
# Prerequisites:
#   - Nebula firetime patch applied (scripts/apply_nebula_firetime_patch.sh)
#   - etrike_*_launch/description packages built
#   - Sensor connected and powered
#
# Usage:
#   ./scripts/lidar_bringup.sh [--check-only] [--no-driver] [--rviz3d]
#   MAP_PATH=/autoware_map/my-map ./scripts/lidar_bringup.sh --rviz3d
#
# Flags:
#   --check-only   Run network/UDP checks only, don't launch ROS
#   --no-driver    Launch sensing pipeline with launch_driver:=false
#                  (for testing preprocessor pipeline without the sensor)
#   --rviz3d       Use etrike_common_launch/rviz/etrike.rviz (3D view with the
#                  lidar point cloud displays). The stock autoware.rviz is
#                  top-down (TopDownOrtho) and does NOT show the lidar cloud.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SENSOR_IP="192.168.1.201"
HOST_IP="192.168.1.10"
IFACE="${IFACE:-eno1}"

CHECK_ONLY=false
LAUNCH_DRIVER=true
RVIZ3D=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --check-only) CHECK_ONLY=true; shift ;;
        --no-driver)  LAUNCH_DRIVER=false; shift ;;
        --rviz3d)     RVIZ3D=true; shift ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

echo "╔══════════════════════════════════════════════════╗"
echo "║   E-Trike XT32M2X LiDAR Bench Bring-up           ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# --- Step 1: Network connectivity ---
echo "── Step 1: Network connectivity ──"
if ! command -v ping &>/dev/null; then
    echo "  ⚠ ping not available in this environment"
    echo "  Run the network checks on the host: $SCRIPT_DIR/lidar_bringup.sh --check-only"
elif ping -c 3 -W 2 "$SENSOR_IP" &>/dev/null; then
    echo "  ✅ Sensor reachable at $SENSOR_IP"
else
    echo "  ❌ Sensor not reachable at $SENSOR_IP"
    echo "  Run: sudo $SCRIPT_DIR/setup_lidar_network.sh"
    if [ "$CHECK_ONLY" = false ]; then exit 1; fi
fi
echo ""

# --- Step 2: UDP packet stream ---
echo "── Step 2: UDP packet stream (port 2368) ──"
if ! command -v tcpdump &>/dev/null; then
    echo "  ⚠ tcpdump not available — skipping UDP check"
    echo "  On the host: sudo apt install tcpdump, then re-run with --check-only"
else
    PACKET_COUNT=$(timeout 5 tcpdump -i "$IFACE" udp port 2368 -c 10 2>/dev/null | wc -l || echo 0)
    if [ "$PACKET_COUNT" -gt 0 ]; then
        echo "  ✅ UDP packets detected ($PACKET_COUNT packets in 5s)"
    else
        echo "  ⚠ No UDP packets detected — sensor may not be spinning"
    fi
fi
echo ""

if [ "$CHECK_ONLY" = true ]; then
    echo "── Check complete ( --check-only ) ──"
    exit 0
fi

# --- Step 3: Launch sensing pipeline ---
echo "── Step 3: Launching sensing pipeline ──"

# Source ROS 2 and workspace
source /opt/autoware/setup.bash 2>/dev/null || true
WORKSPACE="${WORKSPACE:-$HOME/av_project/autoware}"
if [ ! -f "$WORKSPACE/install/setup.bash" ]; then
    # Inside the Autoware container the repo root is bind-mounted at
    # /workspace/av_project (see docker/shell.sh).
    WORKSPACE="/workspace/av_project/autoware"
fi
if [ -f "$WORKSPACE/install/setup.bash" ]; then
    source "$WORKSPACE/install/setup.bash"
    echo "  Workspace sourced: $WORKSPACE"
else
    echo "  ⚠ Workspace not found at $WORKSPACE"
fi

MAP_PATH="${MAP_PATH:-/autoware_map/sample-map-planning}"
LAUNCH_ARGS=(
    "map_path:=$MAP_PATH"
    "sensor_model:=etrike_sensor_kit"
    "vehicle_model:=etrike_vehicle"
)

if [ "$LAUNCH_DRIVER" = true ]; then
    echo "  Launching with real driver (launch_driver:=true)..."
    LAUNCH_ARGS+=("launch_sensing_driver:=true")
else
    echo "  Launching without driver (launch_driver:=false)..."
    LAUNCH_ARGS+=("launch_sensing_driver:=false")
fi

if [ "$RVIZ3D" = true ]; then
    RVIZ_CONFIG="$(ros2 pkg prefix etrike_common_launch)/share/etrike_common_launch/rviz/etrike.rviz"
    if [ -f "$RVIZ_CONFIG" ]; then
        echo "  Using 3D RViz config: $RVIZ_CONFIG"
        LAUNCH_ARGS+=("rviz_config:=$RVIZ_CONFIG")
    else
        echo "  ⚠ etrike.rviz not found at $RVIZ_CONFIG — using default RViz config"
    fi
fi

echo "  ros2 launch autoware_launch autoware.launch.xml ${LAUNCH_ARGS[*]}"
echo ""

# Launch in background, capture output
LAUNCH_LOG="/tmp/lidar_bringup_$(date +%s).log"
ros2 launch autoware_launch autoware.launch.xml "${LAUNCH_ARGS[@]}" 2>&1 | tee "$LAUNCH_LOG" &
LAUNCH_PID=$!

echo "  Launch PID: $LAUNCH_PID"
echo "  Log file: $LAUNCH_LOG"
echo ""
echo "  Waiting 15 seconds for nodes to start..."
sleep 15

# --- Step 4: Check point cloud topics ---
echo "── Step 4: Point cloud topics ──"
TOPICS=$(ros2 topic list 2>/dev/null || echo "")
if echo "$TOPICS" | grep -q "pointcloud_raw_ex"; then
    echo "  ✅ /sensing/lidar/top/pointcloud_raw_ex is advertised"
else
    echo "  ❌ pointcloud_raw_ex topic not found"
fi

if echo "$TOPICS" | grep -q "pointcloud_before_sync"; then
    echo "  ✅ /sensing/lidar/top/pointcloud_before_sync is advertised"
else
    echo "  ⚠ pointcloud_before_sync topic not found (preprocessor may not be ready)"
fi

# Check topic rate
echo ""
echo "  Topic rate (5s sample):"
timeout 5 ros2 topic hz /sensing/lidar/top/pointcloud_raw_ex 2>/dev/null || echo "  (could not measure rate)"
echo ""

# --- Step 5: TF tree ---
echo "── Step 5: TF tree ──"
TF_OUTPUT=$(ros2 run tf2_ros tf2_echo base_link lidar_link 2>&1 || echo "")
if echo "$TF_OUTPUT" | grep -q "Translation"; then
    echo "  ✅ TF base_link -> lidar_link is available"
    echo "$TF_OUTPUT" | head -5
else
    echo "  ❌ TF base_link -> lidar_link not found"
fi
echo ""

# --- Summary ---
echo "╔══════════════════════════════════════════════════╗"
echo "║   Bring-up check complete.                        ║"
echo "║   Launch is still running (PID $LAUNCH_PID).         ║"
echo "║   Stop with: kill $LAUNCH_PID                          ║"
echo "╚══════════════════════════════════════════════════╝"

# Keep the script running until the launch is killed
wait $LAUNCH_PID 2>/dev/null || true
