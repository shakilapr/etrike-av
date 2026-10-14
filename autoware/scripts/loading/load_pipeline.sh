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
if docker image inspect etrike-kinect-build:latest >/dev/null 2>&1; then
  IMAGE="${IMAGE:-etrike-kinect-build:latest}"
else
  IMAGE="${IMAGE:-ghcr.io/autowarefoundation/autoware:universe-cuda-humble}"
fi
CAN_BITRATE="${CAN_BITRATE:-500000}"
MAP_PATH="${MAP_PATH:-/autoware_map/sample-map-planning}"
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

detect_x11() {
  X_DISPLAY="${DISPLAY:-:1}"
  if [ ! -e "/tmp/.X11-unix/X${X_DISPLAY#:}" ]; then
    for d in 1 0; do
      if [ -e "/tmp/.X11-unix/X${d}" ]; then
        X_DISPLAY=":${d}"
        break
      fi
    done
  fi
  XAUTH="${XAUTHORITY:-}"
  if [ -z "$XAUTH" ] || [ ! -f "$XAUTH" ]; then
    if [ -f "/run/user/$(id -u)/gdm/Xauthority" ]; then
      XAUTH="/run/user/$(id -u)/gdm/Xauthority"
    elif [ -f "/run/user/1000/gdm/Xauthority" ]; then
      XAUTH="/run/user/1000/gdm/Xauthority"
    elif [ -f "$HOME/.Xauthority" ]; then
      XAUTH="$HOME/.Xauthority"
    elif [ -f "/home/med1/.Xauthority" ]; then
      XAUTH="/home/med1/.Xauthority"
    fi
  fi
}

ensure_x11_access() {
  detect_x11
  DISPLAY="$X_DISPLAY" XAUTHORITY="$XAUTH" xhost +local:docker >/dev/null 2>&1 || true
  DISPLAY="$X_DISPLAY" XAUTHORITY="$XAUTH" xhost +SI:localuser:root >/dev/null 2>&1 || true
  if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    if [ -n "$XAUTH" ] && [ -f "$XAUTH" ]; then
      docker cp "$XAUTH" "$CONTAINER":/tmp/.docker.xauth >/dev/null 2>&1 || true
      docker exec "$CONTAINER" chmod 644 /tmp/.docker.xauth >/dev/null 2>&1 || true
    fi
  fi
}

ensure_kinect_libs() {
  if ! docker exec "$CONTAINER" test -f /usr/local/lib/libfreenect2.so.0.2 >/dev/null 2>&1 || \
     ! docker exec "$CONTAINER" test -f /usr/local/include/libfreenect2/libfreenect2.hpp >/dev/null 2>&1; then
    echo "  Provisioning Kinect v2 and display libraries into container..."
    if [ -d /usr/local/include/libfreenect2 ]; then
      docker cp /usr/local/include/libfreenect2 "$CONTAINER":/usr/local/include/ 2>/dev/null || true
    fi
    if [ -d /usr/local/lib/cmake/freenect2 ]; then
      docker exec "$CONTAINER" mkdir -p /usr/local/lib/cmake 2>/dev/null || true
      docker cp /usr/local/lib/cmake/freenect2 "$CONTAINER":/usr/local/lib/cmake/ 2>/dev/null || true
    fi
    if [ -f /usr/local/lib/libfreenect2.so.0.2.0 ]; then
      docker cp /usr/local/lib/libfreenect2.so.0.2.0 "$CONTAINER":/usr/local/lib/ 2>/dev/null || true
      docker exec "$CONTAINER" ln -sf /usr/local/lib/libfreenect2.so.0.2.0 /usr/local/lib/libfreenect2.so.0.2 2>/dev/null || true
      docker exec "$CONTAINER" ln -sf /usr/local/lib/libfreenect2.so.0.2 /usr/local/lib/libfreenect2.so 2>/dev/null || true
    fi
    if [ -f /usr/include/turbojpeg.h ]; then
      docker cp /usr/include/turbojpeg.h "$CONTAINER":/usr/include/ 2>/dev/null || true
    fi
    if [ -f /usr/lib/aarch64-linux-gnu/libturbojpeg.so.0.2.0 ]; then
      docker cp /usr/lib/aarch64-linux-gnu/libturbojpeg.so.0.2.0 "$CONTAINER":/usr/lib/aarch64-linux-gnu/ 2>/dev/null || true
      docker exec "$CONTAINER" ln -sf /usr/lib/aarch64-linux-gnu/libturbojpeg.so.0.2.0 /usr/lib/aarch64-linux-gnu/libturbojpeg.so.0 2>/dev/null || true
      docker exec "$CONTAINER" ln -sf /usr/lib/aarch64-linux-gnu/libturbojpeg.so.0 /usr/lib/aarch64-linux-gnu/libturbojpeg.so 2>/dev/null || true
    fi
    if [ -d /usr/include/GLFW ]; then
      docker cp /usr/include/GLFW "$CONTAINER":/usr/include/ 2>/dev/null || true
    fi
    if [ -f /usr/lib/aarch64-linux-gnu/libglfw.so.3.3 ]; then
      docker cp /usr/lib/aarch64-linux-gnu/libglfw.so.3.3 "$CONTAINER":/usr/lib/aarch64-linux-gnu/ 2>/dev/null || true
      docker exec "$CONTAINER" ln -sf /usr/lib/aarch64-linux-gnu/libglfw.so.3.3 /usr/lib/aarch64-linux-gnu/libglfw.so.3 2>/dev/null || true
      docker exec "$CONTAINER" ln -sf /usr/lib/aarch64-linux-gnu/libglfw.so.3 /usr/lib/aarch64-linux-gnu/libglfw.so 2>/dev/null || true
    fi
    docker exec "$CONTAINER" ldconfig >/dev/null 2>&1 || true
  fi
}

start_container() {
  say "Container: $CONTAINER ($IMAGE)"
  ensure_x11_access
  if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    if docker exec "$CONTAINER" test -d /workspace/av_project/tools >/dev/null 2>&1; then
      echo "  already running."
      ensure_kinect_libs
      return
    fi
    echo "  recreating container to mount /workspace/av_project..."
  fi

  mkdir -p "$WORKSPACE_ROOT/data" 2>/dev/null || true
  docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
  docker run -d --name "$CONTAINER" \
    --privileged --runtime=nvidia --gpus all \
    --net=host --ipc=host \
    -e DISPLAY="$X_DISPLAY" \
    -e XAUTHORITY="$XAUTH" \
    -e RMW_IMPLEMENTATION=rmw_cyclonedds_cpp \
    -v /tmp/.X11-unix:/tmp/.X11-unix:rw \
    -v /run/user/1000:/run/user/1000:ro \
    -v /dev/bus/usb:/dev/bus/usb \
    -v "$WORKSPACE_ROOT:/workspace/av_project" \
    -v "$WORKSPACE_ROOT/autoware:/workspace/autoware" \
    -v "$WORKSPACE_ROOT/data:/workspace/data" \
    -v "$HOME/autoware_map:/autoware_map" \
    -v "$HOME/.local:/host_local:ro" \
    -v /usr/local/lib/python3.10/dist-packages:/host_dist_packages:ro \
    "$IMAGE" bash -c 'while true; do sleep 1000; done'
  ensure_x11_access
  ensure_kinect_libs
  echo "  started."
}

start_universe() {
  say "Autoware Universe (planning simulator + RViz) on the monitor"
  ensure_x11_access
  docker exec -d "$CONTAINER" bash -c "
    export DISPLAY=$X_DISPLAY;
    if [ -f /tmp/.docker.xauth ]; then export XAUTHORITY=/tmp/.docker.xauth; else export XAUTHORITY=$XAUTH; fi;
    export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp;
    if [ -f /home/aw/cyclonedds.xml ]; then export CYCLONEDDS_URI=file:///home/aw/cyclonedds.xml; fi;
    export LD_LIBRARY_PATH=/usr/local/lib:/host_local/lib:\$LD_LIBRARY_PATH;
    source /opt/ros/humble/setup.bash;
    source /opt/autoware/setup.bash;
    source /workspace/autoware/install/setup.bash;
    ros2 launch autoware_launch planning_simulator.launch.xml \
      map_path:=$MAP_PATH \
      vehicle_model:=$VEHICLE_MODEL \
      sensor_model:=$SENSOR_MODEL \
      rviz:=true > /tmp/universe.log 2>&1"
  sleep 3
  if docker exec "$CONTAINER" pgrep -f "rviz2" >/dev/null 2>&1 || docker exec "$CONTAINER" pgrep -f "planning_simulator" >/dev/null 2>&1; then
    echo "  [OK] Autoware Universe is initializing (log: /tmp/universe.log). Wait ~30s for RViz."
  else
    echo "  [WARN] Autoware Universe processes did not stay alive. Last log output:"
    docker exec "$CONTAINER" tail -n 25 /tmp/universe.log 2>/dev/null || true
  fi
}

start_live_autoware() {
  say "Autoware Universe LIVE (Hesai LiDAR + Kinect v2 + CenterPoint Perception + NDT Localization + RViz)"
  ensure_x11_access
  detect_can
  docker exec -d "$CONTAINER" bash -c "
    export DISPLAY=$X_DISPLAY;
    if [ -f /tmp/.docker.xauth ]; then export XAUTHORITY=/tmp/.docker.xauth; else export XAUTHORITY=$XAUTH; fi;
    export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp;
    if [ -f /home/aw/cyclonedds.xml ]; then export CYCLONEDDS_URI=file:///home/aw/cyclonedds.xml; fi;
    export LD_LIBRARY_PATH=/usr/local/lib:/host_local/lib:\$LD_LIBRARY_PATH;
    source /opt/ros/humble/setup.bash;
    source /opt/autoware/setup.bash;
    source /workspace/autoware/install/setup.bash;
    ros2 launch autoware_launch autoware.launch.xml \
      map_path:=$MAP_PATH \
      vehicle_model:=$VEHICLE_MODEL \
      sensor_model:=$SENSOR_MODEL \
      launch_sensing:=true \
      launch_sensing_driver:=true \
      launch_localization:=true \
      launch_perception:=true \
      launch_planning:=true \
      launch_control:=true \
      launch_vehicle:=true \
      launch_vehicle_interface:=false \
      perception_mode:=lidar \
      tracker_publish_merged_objects:=true \
      rviz:=true > /tmp/universe_live.log 2>&1"
  echo "  launched (log inside container: /tmp/universe_live.log)."
}

ensure_lidar_network() {
  say "LiDAR network on eno1 (Hesai XT32M2X @ 192.168.1.201)"
  if ip addr show eno1 2>/dev/null | grep -q "192.168.1."; then
    echo "  eno1 already has 192.168.1.x IP configured."
  else
    if [ -f "$WORKSPACE_ROOT/scripts/setup_lidar_network.sh" ]; then
      sudo bash "$WORKSPACE_ROOT/scripts/setup_lidar_network.sh" eno1 192.168.1.10 192.168.1.201 || true
    else
      sudo ip addr add 192.168.1.10/24 dev eno1 2>/dev/null || true
      sudo ip link set eno1 up 2>/dev/null || true
    fi
  fi
}

start_hybrid_sensing() {
  say "Hybrid Bench Sensing (Hesai XT32M2X LiDAR + Kinect v2 Camera + Bench 3D Perception)"
  ensure_lidar_network
  ensure_kinect_libs
  ensure_x11_access
  docker exec -d "$CONTAINER" bash -c "
    export DISPLAY=$X_DISPLAY;
    if [ -f /tmp/.docker.xauth ]; then export XAUTHORITY=/tmp/.docker.xauth; else export XAUTHORITY=$XAUTH; fi;
    export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp;
    if [ -f /home/aw/cyclonedds.xml ]; then export CYCLONEDDS_URI=file:///home/aw/cyclonedds.xml; fi;
    export LD_LIBRARY_PATH=/usr/local/lib:/host_local/lib:\$LD_LIBRARY_PATH;
    source /opt/ros/humble/setup.bash;
    source /opt/autoware/setup.bash;
    source /workspace/autoware/install/setup.bash;
    ros2 launch etrike_common_launch hybrid_bench_sensing.launch.py > /tmp/hybrid_sensing.log 2>&1"
  echo "  launched (log inside container: /tmp/hybrid_sensing.log). View with: docker exec $CONTAINER ros2 topic hz /sensing/lidar/top/pointcloud_raw_ex"
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
  local sim_flag="${1:-true}"
  detect_can
  say "Vehicle bridge (sim_mode=$sim_flag) on $CAN_IFACE"
  docker exec -d "$CONTAINER" bash -c "
    export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp;
    if [ -f /home/aw/cyclonedds.xml ]; then export CYCLONEDDS_URI=file:///home/aw/cyclonedds.xml; fi;
    source /opt/ros/humble/setup.bash;
    source /opt/autoware/setup.bash;
    source /workspace/autoware/install/setup.bash;
    ros2 launch autoware_vehicle_bridge vehicle_bridge.launch.py \
      can_interface:=$CAN_IFACE \
      sim_mode:=$sim_flag > /tmp/bridge_can.log 2>&1"
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
  say "Stopping all Autoware, Bridge, Dashboard, and CAN services"
  if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    docker exec "$CONTAINER" bash -c "
      pkill -9 -f 'ros2' 2>/dev/null || true
      pkill -9 -f 'rviz2' 2>/dev/null || true
      pkill -9 -f 'component_container' 2>/dev/null || true
      pkill -9 -f 'vehicle_bridge' 2>/dev/null || true
      pkill -9 -f 'kinect2_node' 2>/dev/null || true
      pkill -9 -f 'bench_perception_node' 2>/dev/null || true
      pkill -9 -f 'hesai_ros_wrapper_node' 2>/dev/null || true
      pkill -9 -f 'hybrid_bench_sensing' 2>/dev/null || true
      pkill -9 -f 'single_kinect' 2>/dev/null || true
      pkill -9 -f 'topic_tools' 2>/dev/null || true
      pkill -9 -f 'tools.av_dashboard.backend.server' 2>/dev/null || true
      pkill -9 -f 'tools.can_watcher.backend.server' 2>/dev/null || true
    " >/dev/null 2>&1 || true
    docker restart "$CONTAINER" >/dev/null 2>&1 || true
  fi

  # Also stop host-side servers and browser/Electron windows if running
  pkill -9 -f "tools.can_watcher.backend.server" 2>/dev/null || true
  pkill -9 -f "tools.av_dashboard.backend.server" 2>/dev/null || true
  pkill -9 -f "chromium.*8080" 2>/dev/null || true
  pkill -9 -f "chromium.*8000" 2>/dev/null || true
  pkill -9 -f "chromium" 2>/dev/null || true
  pkill -9 -f "electron" 2>/dev/null || true
  pkill -9 -f "rviz2" 2>/dev/null || true

  if [ "$CAN_IFACE" = "can2" ] || [ "$CAN_DRIVER" = "canalyst" ]; then
    if [ -f "$WORKSPACE_ROOT/scripts/setup_canalyst.sh" ]; then
      bash "$WORKSPACE_ROOT/scripts/setup_canalyst.sh" down "$CAN_IFACE" >/dev/null 2>&1 || true
    fi
  else
    sudo ip link set "$CAN_IFACE" down >/dev/null 2>&1 || true
  fi
  echo "  [OK] Autoware, RViz, Vehicle Bridge, CAN Watcher, AV Dashboard stopped; $CAN_IFACE down."
}

status_all() {
  detect_can
  say "System Status"
  if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    echo "  [Container]   $CONTAINER: RUNNING"
    docker exec "$CONTAINER" bash -c "ps -ef | grep -E 'ros2 launch|vehicle_bridge|av_dashboard|rviz2|hybrid_bench|bench_perception' | grep -v grep" || echo "                (no active ROS/Dashboard processes inside container)"
  else
    echo "  [Container]   $CONTAINER: STOPPED"
  fi
  if ip link show "$CAN_IFACE" 2>/dev/null | grep -q "UP"; then
    echo "  [CAN Bus]     $CAN_IFACE: UP"
  else
    echo "  [CAN Bus]     $CAN_IFACE: DOWN"
  fi
  if curl -s "http://127.0.0.1:8080/api/v1/status" >/dev/null 2>&1; then
    echo "  [Dashboard]   http://localhost:8080: ONLINE"
    curl -s "http://127.0.0.1:8080/api/v1/ros" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'                ROS Bridge: available={d.get(\"bridge_available\")} active={d.get(\"active\")} objects={d.get(\"object_count\")} hz={d.get(\"hz\")}')" 2>/dev/null || true
  else
    echo "  [Dashboard]   http://localhost:8080: OFFLINE"
  fi
}

case "$MODE" in
  all|open|--open|--hybrid-bench|hybrid-bench)
    start_container
    start_can
    start_universe
    start_hybrid_sensing
    start_bridge true
    start_dashboard
    ;;
  bench|--bench)
    start_container
    start_can
    start_universe
    start_bridge true
    start_dashboard
    ;;
  sensing|--sensing)
    start_container
    start_hybrid_sensing
    ;;
  live|--live)
    start_container
    start_can
    start_live_autoware
    start_bridge false
    start_dashboard
    ;;
  --universe)
    start_container
    start_universe
    start_dashboard
    ;;
  --can|--canable)
    start_can
    start_bridge true
    ;;
  --bridge)
    start_bridge true
    ;;
  --dashboard)
    start_dashboard
    ;;
  --watcher|--canwatch)
    start_watcher
    ;;
  stop|close|--stop|--close)
    stop_all
    ;;
  status|--status)
    status_all
    ;;
  *)
    echo "Usage: $0 [open|--hybrid-bench|--bench|live|--live|--universe|--sensing|--can|--bridge|--dashboard|--watcher|close|--stop|status|--status]"
    exit 1
    ;;
esac

say "Done ($MODE). Reference: docs/operations/ETRIKE_RUN.md"
