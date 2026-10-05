#!/bin/bash
# ==============================================================================
# E-Trike full-stack loader (Autoware Universe + CAN adapter + bridge in sim mode)
#
# Brings up the bench pipeline:
#   1. Docker container (autoware_test) with DISPLAY + X socket
#   2. Autoware Universe planning simulator + RViz on the Jetson monitor
#   3. USB-CAN adapter (auto-detects CANalyst-II on can2 or CANable Pro on canable0)
#   4. autoware_vehicle_bridge in sim_mode (forwards steering/drive to CAN)
#
# Usage:
#   bash scripts/loading/load_pipeline.sh            # full stack (container + can + universe + bridge)
#   bash scripts/loading/load_pipeline.sh --bench    # alias for full stack bench simulation
#   bash scripts/loading/load_pipeline.sh --universe # only simulator + RViz
#   bash scripts/loading/load_pipeline.sh --can      # only CAN adapter + bridge
#   bash scripts/loading/load_pipeline.sh --bridge   # only the bridge (assumes CAN interface is up)
#   bash scripts/loading/load_pipeline.sh --stop     # stop simulator, bridge, and CAN
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
if [ ! -d "$WORKSPACE_ROOT/scripts" ] && [ -d "$HOME/av_project/scripts" ]; then
  WORKSPACE_ROOT="$HOME/av_project"
fi

CONTAINER="autoware_test"
IMAGE="ghcr.io/autowarefoundation/autoware:universe-cuda-humble"
CAN_BITRATE="${CAN_BITRATE:-500000}"
MAP_PATH="/autoware_map/sample-map-planning"
VEHICLE_MODEL="etrike_vehicle"
SENSOR_MODEL="etrike_sensor_kit"

MODE="${1:-all}"

say() { echo; echo "==== $* ===="; }

detect_can() {
  if [ -n "$CAN_IFACE" ]; then
    return
  fi
  # Auto-detect CAN adapter:
  # Check if CANalyst-II USB device (04d8:0053) is plugged in
  if lsusb 2>/dev/null | grep -q "04d8:0053"; then
    CAN_IFACE="can2"
    CAN_DRIVER="canalyst"
  elif ip link show canable0 >/dev/null 2>&1; then
    CAN_IFACE="canable0"
    CAN_DRIVER="socketcan"
  elif lsusb 2>/dev/null | grep -Eq "1d50:606f|0483:5740"; then
    CAN_IFACE="canable0"
    CAN_DRIVER="socketcan"
  elif ip link show can2 >/dev/null 2>&1; then
    CAN_IFACE="can2"
    CAN_DRIVER="canalyst"
  else
    CAN_IFACE="can2"
    CAN_DRIVER="canalyst"
  fi
}

start_container() {
  say "Container: $CONTAINER"
  if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    echo "  already running."
  else
    docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
    DISPLAY=:1 XAUTHORITY=/run/user/1000/gdm/Xauthority xhost +local:docker >/dev/null 2>&1 || true
    docker run -d --name "$CONTAINER" \
      --privileged --runtime=nvidia --gpus all \
      --net=host --ipc=host \
      -e DISPLAY=:1 \
      -v /tmp/.X11-unix:/tmp/.X11-unix:ro \
      -v "$HOME/av_project/autoware:/workspace/autoware" \
      -v "$HOME/autoware_map:/autoware_map" \
      "$IMAGE" bash -c 'while true; do sleep 1000; done'
    echo "  started."
  fi
}

start_universe() {
  say "Autoware Universe (planning simulator + RViz) on the monitor"
  docker exec -d "$CONTAINER" bash -c "
    export DISPLAY=:1;
    source /opt/autoware/setup.bash;
    source /workspace/autoware/install/setup.bash;
    ros2 launch autoware_launch planning_simulator.launch.xml \
      map_path:=$MAP_PATH \
      vehicle_model:=$VEHICLE_MODEL \
      sensor_model:=$SENSOR_MODEL \
      rviz:=true"
  echo "  launched. Wait ~40s for RViz; then in RViz: pose -> goal -> engage."
}

start_can() {
  detect_can
  say "CAN Interface: $CAN_IFACE ($CAN_DRIVER) @ $CAN_BITRATE"
  if [ "$CAN_IFACE" = "can2" ] || [ "$CAN_DRIVER" = "canalyst" ]; then
    if [ -f "$WORKSPACE_ROOT/scripts/setup_canalyst.sh" ]; then
      bash "$WORKSPACE_ROOT/scripts/setup_canalyst.sh" up "$CAN_IFACE" "$CAN_BITRATE"
    else
      echo "  ERROR: $WORKSPACE_ROOT/scripts/setup_canalyst.sh not found."
      exit 1
    fi
  else
    if ! ip link show "$CAN_IFACE" >/dev/null 2>&1; then
      echo "  ERROR: $CAN_IFACE not found. Re-plug / run 'scripts/setup_canable.sh install-udev'."
      exit 1
    fi
    sudo ip link set "$CAN_IFACE" type can bitrate "$CAN_BITRATE"
    sudo ip link set "$CAN_IFACE" up
    echo "  UP.  (ip -details link show $CAN_IFACE to confirm)"
  fi
}

start_bridge() {
  detect_can
  say "Vehicle bridge (sim_mode) on $CAN_IFACE"
  docker exec -d "$CONTAINER" bash -c "
    source /opt/autoware/setup.bash;
    source /workspace/autoware/install/setup.bash;
    ros2 launch autoware_vehicle_bridge vehicle_bridge.launch.py \
      can_interface:=$CAN_IFACE \
      sim_mode:=true > /tmp/bridge_can.log 2>&1"
  echo "  launched (log: /tmp/bridge_can.log). Verify with: candump -tz $CAN_IFACE"
}

start_dashboard() {
  detect_can
  say "AV Dashboard on $CAN_IFACE"
  if [ -f "$WORKSPACE_ROOT/scripts/open_av_dashboard_display.sh" ]; then
    bash "$WORKSPACE_ROOT/scripts/open_av_dashboard_display.sh" "$CAN_IFACE"
  fi
}

start_watcher() {
  detect_can
  say "CAN Watcher on $CAN_IFACE"
  if [ -f "$WORKSPACE_ROOT/scripts/open_can_watcher_display.sh" ]; then
    bash "$WORKSPACE_ROOT/scripts/open_can_watcher_display.sh" "$CAN_IFACE"
  fi
}

stop_all() {
  detect_can
  say "Stopping"
  if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    docker restart "$CONTAINER" >/dev/null 2>&1 || true
  fi
  # Also stop CAN Watcher and AV Dashboard server and browser UI if running
  pkill -9 -f "tools.can_watcher.backend.server" 2>/dev/null || true
  pkill -9 -f "tools.av_dashboard.backend.server" 2>/dev/null || true
  pkill -9 -f "chromium" 2>/dev/null || true

  if [ "$CAN_IFACE" = "can2" ] || [ "$CAN_DRIVER" = "canalyst" ]; then
    if [ -f "$WORKSPACE_ROOT/scripts/setup_canalyst.sh" ]; then
      bash "$WORKSPACE_ROOT/scripts/setup_canalyst.sh" down "$CAN_IFACE" >/dev/null 2>&1 || true
    fi
  else
    sudo ip link set "$CAN_IFACE" down >/dev/null 2>&1 || true
  fi
  echo "  bridge, simulator, CAN Watcher, AV Dashboard stopped; $CAN_IFACE down. (container left running)"
}

case "$MODE" in
  all|--bench)
    start_container
    start_can
    start_universe
    start_bridge
    ;;
  --universe)
    start_container
    start_universe
    ;;
  --can|--canable)
    start_can
    start_bridge
    ;;
  --bridge)
    start_bridge
    ;;
  --dashboard)
    start_dashboard
    ;;
  --watcher|--canwatch)
    start_watcher
    ;;
  --stop)
    stop_all
    ;;
  *)
    echo "Usage: $0 [all|--bench|--universe|--can|--bridge|--dashboard|--watcher|--stop]"
    exit 1
    ;;
esac

say "Done ($MODE). Reference: docs/operations/ETRIKE_RUN.md"
