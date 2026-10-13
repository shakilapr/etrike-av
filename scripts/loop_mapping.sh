#!/usr/bin/env bash
# ==============================================================================
# loop_mapping.sh
# 
# Automatically replays the trimmed mapping bag, displays the real-time SLAM 
# process on the Jetson monitor (DISPLAY=:1), holds the completed map for 20 
# seconds at the end of each run, then cleanly resets and repeats from the start.
#
# Usage:
#   Inside Docker (autoware_test):
#     /usr/local/bin/loop_mapping.sh
#
#   From Jetson host:
#     docker exec -it autoware_test /usr/local/bin/loop_mapping.sh
#
#   From Windows:
#     pwsh scripts/run_mapping_loop.ps1 [-HoldTime 20] [-Once]
# ==============================================================================

set -eo pipefail

export DISPLAY="${DISPLAY:-:1}"
BAG_PATH="${BAG_PATH:-/workspace/data/bags/etrike_loop_01_trimmed}"
INPUT_CLOUD="${INPUT_CLOUD:-/sensing/lidar/top/pointcloud_raw_ex}"
SAVE_DIR="${SAVE_DIR:-/workspace/data}"
HOLD_TIME="${HOLD_TIME:-20}"
ONCE="${ONCE:-0}"

cleanup() {
    echo ""
    echo "[!] Stopping all mapping and player processes cleanly..."
    pkill -9 -f 'rosbag2_player|scanmatcher|graph_based_slam|rviz2|static_transform_publisher|ros2 launch|lidarslam' 2>/dev/null || true
    echo "[!] Clean exit complete."
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

source /opt/ros/humble/setup.bash
source /opt/autoware/setup.bash 2>/dev/null || true
source /workspace/autoware/install/setup.bash 2>/dev/null || true

echo "======================================================================"
echo "  Bajaj RE E-Trike — Automated SLAM Mapping Playback Loop"
echo "======================================================================"
echo "  Bag:        ${BAG_PATH}"
echo "  Cloud:      ${INPUT_CLOUD}"
echo "  Display:    ${DISPLAY}"
echo "  Hold Time:  ${HOLD_TIME}s after each run"
echo "  Mode:       $([ "$ONCE" = "1" ] && echo "Single Run" || echo "Continuous Loop")"
echo "======================================================================"

iteration=1

while true; do
    echo ""
    echo "======================================================================"
    echo "  [Cycle #${iteration}] Starting SLAM mapping at $(date +'%T')"
    echo "======================================================================"

    # 1. Clean up any leftover processes from previous runs
    echo "  [1/4] Cleaning previous instances..."
    pkill -9 -f 'rosbag2_player|scanmatcher|graph_based_slam|rviz2|static_transform_publisher|ros2 launch|lidarslam' 2>/dev/null || true
    sleep 2

    # 2. Launch mapping stack and RViz on target DISPLAY
    echo "  [2/4] Launching SLAM nodes and RViz on DISPLAY=${DISPLAY}..."
    ros2 launch etrike_common_launch etrike_mapping.launch.xml \
        input_cloud:="${INPUT_CLOUD}" \
        use_sim_time:=true \
        save_dir:="${SAVE_DIR}" \
        use_rviz:=true > /tmp/etrike_mapping_loop.log 2>&1 &
    MAPPING_PID=$!

    # Wait for scanmatcher and RViz to initialize
    echo "        Waiting 5s for RViz and SLAM graph to ready..."
    sleep 5

    # 3. Play the trimmed bag from start to finish
    echo "  [3/4] Playing bag playback (~124s duration)..."
    echo "        (Watch the live vehicle path and map accumulation in RViz)"
    ros2 bag play "${BAG_PATH}" --clock --rate 1.0 < /dev/null || true

    echo ""
    echo "  [4/4] Bag playback complete! Vehicle has completed the full loop."
    echo "        Holding map on screen for ${HOLD_TIME}s for inspection..."
    
    # Countdown hold time
    for (( i=${HOLD_TIME}; i>0; i-=5 )); do
        echo "        Map visible — resetting in ${i}s..."
        sleep 5
    done

    # If single-run mode requested, exit now
    if [ "$ONCE" = "1" ]; then
        echo ""
        echo "[OK] Single run mode complete."
        # Reset EXIT trap so cleanup doesn't re-run redundantly
        trap - EXIT
        pkill -9 -f 'rosbag2_player|scanmatcher|graph_based_slam|rviz2|static_transform_publisher|ros2 launch|lidarslam' 2>/dev/null || true
        exit 0
    fi

    # Clean shutdown of this iteration before restarting
    echo "  Resetting mapping stack for next cycle..."
    pkill -9 -f 'rosbag2_player|scanmatcher|graph_based_slam|rviz2|static_transform_publisher|ros2 launch|lidarslam' 2>/dev/null || true
    sleep 2

    iteration=$((iteration + 1))
done
