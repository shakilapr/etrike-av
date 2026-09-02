#!/bin/bash
# ==============================================================================
# E-Trike full-stack loader (Autoware Universe + CANable + bridge in sim mode)
#
# Brings up the whole bench pipeline:
#   1. Docker container (autoware_test) with DISPLAY + X socket
#   2. Autoware Universe planning simulator + RViz on the Jetson monitor
#   3. CANable Pro USB-CAN (canable0) at 500 kbps
#   4. autoware_vehicle_bridge in sim_mode on canable0
#
# Usage:
#   bash scripts/loading/load_pipeline.sh            # full stack
#   bash scripts/loading/load_pipeline.sh --universe  # only simulator + RViz
#   bash scripts/loading/load_pipeline.sh --canable   # only CANable + bridge
#   bash scripts/loading/load_pipeline.sh --bridge    # only the bridge
#   bash scripts/loading/load_pipeline.sh --stop      # stop everything
# ==============================================================================

set -e

CONTAINER="autoware_test"
IMAGE="ghcr.io/autowarefoundation/autoware:universe-cuda-humble"
CAN_IFACE="${CAN_IFACE:-canable0}"
CAN_BITRATE="${CAN_BITRATE:-500000}"
MAP_PATH="/autoware_map/sample-map-planning"
VEHICLE_MODEL="etrike_vehicle"
SENSOR_MODEL="etrike_sensor_kit"

MODE="${1:-all}"

say() { echo; echo "==== $* ===="; }

start_container() {
  say "Container: $CONTAINER"
  if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    echo "  already running."
  else
    docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
    DISPLAY=:1 xhost +local:docker >/dev/null 2>&1 || true
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

start_canable() {
  say "CANable Pro: $CAN_IFACE @ $CAN_BITRATE"
  if ! ip link show "$CAN_IFACE" >/dev/null 2>&1; then
    echo "  ERROR: $CAN_IFACE not found. Re-plug / run 'scripts/setup_canable.sh install-udev'."
    exit 1
  fi
  sudo ip link set "$CAN_IFACE" type can bitrate "$CAN_BITRATE"
  sudo ip link set "$CAN_IFACE" up
  echo "  UP.  (ip -details link show $CAN_IFACE to confirm)"
}

start_bridge() {
  say "Vehicle bridge (sim_mode) on $CAN_IFACE"
  docker exec -d "$CONTAINER" bash -c "
    source /opt/autoware/setup.bash;
    source /workspace/autoware/install/setup.bash;
    ros2 launch autoware_vehicle_bridge vehicle_bridge.launch.py \
      can_interface:=$CAN_IFACE \
      sim_mode:=true > /tmp/bridge_can.log 2>&1"
  echo "  launched (log: /tmp/bridge_can.log). Verify with: candump -tz $CAN_IFACE"
}

stop_all() {
  say "Stopping"
  docker exec "$CONTAINER" bash -c 'pkill -9 -f vehicle_bridge_node; pkill -9 -f planning_simulator; pkill -9 -f rviz2' >/dev/null 2>&1 || true
  sudo ip link set "$CAN_IFACE" down >/dev/null 2>&1 || true
  echo "  bridge + simulator stopped; $CAN_IFACE down. (container left running)"
}

case "$MODE" in
  all)
    start_container
    start_universe
    start_canable
    start_bridge
    ;;
  --universe)
    start_container
    start_universe
    ;;
  --canable)
    start_canable
    start_bridge
    ;;
  --bridge)
    start_bridge
    ;;
  --stop)
    stop_all
    ;;
  *)
    echo "Usage: $0 [all|--universe|--canable|--bridge|--stop]"
    exit 1
    ;;
esac

say "Done ($MODE). Reference: docs/operations/ETRIKE_RUN.md"
