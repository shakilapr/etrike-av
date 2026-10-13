#!/usr/bin/env bash
set -eo pipefail

export DISPLAY="${DISPLAY:-:1}"
BAG_PATH="${BAG_PATH:-/workspace/data/bags/etrike_loop_01_trimmed}"
INPUT_CLOUD="${INPUT_CLOUD:-/sensing/lidar/top/pointcloud_raw_ex}"
OUT_VIDEO="${OUT_VIDEO:-/workspace/data/bajaj_mapping_loop.mp4}"

echo "======================================================================"
echo "  Recording SLAM Mapping Video Clip from DISPLAY=${DISPLAY}"
echo "  Bag:    ${BAG_PATH}"
echo "  Output: ${OUT_VIDEO}"
echo "======================================================================"

echo "[1/5] Cleaning up existing processes..."
pkill -f 'rosbag2_player|scanmatcher|graph_based_slam|rviz2|ros2 launch|ffmpeg' 2>/dev/null || true
sleep 2

echo "[2/5] Launching etrike_mapping stack..."
source /opt/autoware/setup.bash
source /workspace/autoware/install/setup.bash

ros2 launch etrike_common_launch etrike_mapping.launch.xml input_cloud:="${INPUT_CLOUD}" use_sim_time:=true save_dir:=/workspace/data use_rviz:=true > /tmp/etrike_mapping_rec.log 2>&1 &
MAPPING_PID=$!

# Wait for RViz and scanmatcher to appear
sleep 7

echo "[3/5] Starting FFmpeg screen recording on DISPLAY=${DISPLAY}..."
rm -f "${OUT_VIDEO}"
ffmpeg -y -video_size 1366x768 -framerate 25 -f x11grab -i :1.0 -c:v libx264 -preset fast -crf 22 -pix_fmt yuv420p "${OUT_VIDEO}" > /tmp/ffmpeg_rec.log 2>&1 &
FFMPEG_PID=$!

sleep 2

echo "[4/5] Playing trimmed driving bag (123.9s)..."
ros2 bag play "${BAG_PATH}" --clock --rate 1.0 < /dev/null

echo "[5/5] Replay complete! Holding final map for 6s..."
sleep 6

echo "Stopping FFmpeg..."
kill -SIGINT ${FFMPEG_PID} 2>/dev/null || true
wait ${FFMPEG_PID} 2>/dev/null || true

echo "Stopping mapping stack..."
kill -SIGINT ${MAPPING_PID} 2>/dev/null || true
pkill -f 'rosbag2_player|scanmatcher|graph_based_slam|rviz2|ros2 launch' 2>/dev/null || true

echo "Recording finished successfully:"
ls -lh "${OUT_VIDEO}"
