#!/bin/bash
# One-command Hesai XT32M2X point cloud viewer (Nebula driver + RViz2).
#
# Usage (run on the HOST — the script starts its own container):
#   ./scripts/lidar_standalone.sh
#
# It also works when run INSIDE the Autoware container (./docker/shell.sh),
# in which case it launches directly without starting another container.
#
# Requirements:
#   - Sensor connected to the Jetson's Ethernet port (eno1) and the network
#     configured once:
#       sudo ./scripts/setup_lidar_network.sh eno1 192.168.1.10 192.168.1.201
#   - The etrike_lidar_viewer package built (docker/build.sh builds it).
#
# What it does:
#   - Verifies the sensor is reachable
#   - Runs
#       ros2 launch etrike_lidar_viewer lidar_view.launch.py
#     in a (new, detached) container: the Nebula Hesai driver (udp_only — no
#     PTC needed, using the E-Trike firetime + angle-calibration CSVs) plus
#     RViz2 on the desktop showing /sensing/lidar/top/pointcloud_raw_ex.
#
#   Logs:    docker logs -f lidar_rviz
#   Stop:    docker rm -f lidar_rviz

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
SENSOR_IP="192.168.1.201"
CONTAINER="lidar_rviz"
DISPLAY_TARGET="${DISPLAY:-:1}"
IMAGE="ghcr.io/autowarefoundation/autoware:universe-cuda-humble"

if [ ! -d "$REPO_DIR/autoware/install/etrike_lidar_viewer" ] && [ ! -d /workspace/autoware/install/etrike_lidar_viewer ]; then
    echo "❌ etrike_lidar_viewer not built — run docker/build.sh first."
    exit 1
fi

# Inside the Autoware container: launch directly, no nested docker.
if [ -d /workspace/av_project ] && ! command -v docker &>/dev/null; then
    echo "── Running inside the Autoware container ──"
    source /opt/autoware/setup.bash
    source /workspace/autoware/install/setup.bash
    exec ros2 launch etrike_lidar_viewer lidar_view.launch.py
fi

echo "── Sensor reachability ──"
if ping -c 2 -W 2 "$SENSOR_IP" &>/dev/null; then
    echo "  ✅ $SENSOR_IP reachable"
else
    echo "  ❌ Sensor not reachable — configure the network first:"
    echo "     sudo $SCRIPT_DIR/setup_lidar_network.sh eno1 192.168.1.10 $SENSOR_IP"
    exit 1
fi

echo "── Starting viewer container ──"
docker rm -f "$CONTAINER" 2>/dev/null || true
xhost +local:docker >/dev/null 2>&1 || true

docker run -d --name "$CONTAINER" --rm \
  --privileged --runtime=nvidia --gpus all --net=host --ipc=host \
  -e DISPLAY="$DISPLAY_TARGET" -e XDG_RUNTIME_DIR=/tmp \
  -v /tmp/.X11-unix:/tmp/.X11-unix:ro \
  -v "$REPO_DIR":/workspace/av_project \
  -v "$REPO_DIR/autoware":/workspace/autoware \
  "$IMAGE" \
  /bin/bash -c '
    source /opt/autoware/setup.bash
    source /workspace/autoware/install/setup.bash
    exec ros2 launch etrike_lidar_viewer lidar_view.launch.py
  '

echo "  ✅ Container started: $CONTAINER"
echo "     RViz2 opens on display $DISPLAY_TARGET — the point cloud appears"
echo "     within ~15 seconds (sensor warm-up + driver init)."
echo "  Logs: docker logs -f $CONTAINER"
echo "  Stop: docker rm -f $CONTAINER"
