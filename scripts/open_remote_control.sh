#!/usr/bin/env bash
# ==============================================================================
# Open E-Trike Direct Remote Cockpit on Jetson (Without Autoware Universe)
# ==============================================================================
# Starts:
#   1. CAN interface (CANalyst-II on can2 @ 500k by default)
#   2. Docker container (autoware_test) with X11 display pass-through
#   3. vehicle_bridge (in sim_mode:=true for bench actuator testing)
#   4. etrike_remote_control GUI on the Jetson monitor (DISPLAY=:1)
#
# Usage:
#   bash scripts/open_remote_control.sh [can_interface] [sim_mode]
# Examples:
#   bash scripts/open_remote_control.sh can2 true
# ==============================================================================

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
if [ ! -d "$WORKSPACE_ROOT/scripts" ] && [ -d "$HOME/av_project/scripts" ]; then
    WORKSPACE_ROOT="$HOME/av_project"
fi

CAN_IFACE="${1:-can2}"
SIM_MODE="${2:-true}"
CAN_BITRATE="${CAN_BITRATE:-500000}"
CONTAINER="autoware_test"
IMAGE="ghcr.io/autowarefoundation/autoware:universe-cuda-humble"

echo "======================================================================"
echo " Starting E-Trike Remote Cockpit on Jetson (Standalone)"
echo " CAN Interface : $CAN_IFACE"
echo " Sim Mode      : $SIM_MODE (Direct bench actuation)"
echo " Workspace     : $WORKSPACE_ROOT"
echo "======================================================================"

# 1. Setup X11 display permissions (discover local physical display authority, ignoring SSH forwarding)
export DISPLAY="${DISPLAY:-:1}"
if [ ! -e "/tmp/.X11-unix/X${DISPLAY#:}" ]; then
    for d in 1 0; do
        if [ -e "/tmp/.X11-unix/X${d}" ]; then
            DISPLAY=":${d}"
            break
        fi
    done
fi

LOCAL_XAUTH=""
for auth_candidate in \
    "/run/user/$(id -u)/gdm/Xauthority" \
    "/run/user/1000/gdm/Xauthority" \
    "$HOME/.Xauthority" \
    "/home/med1/.Xauthority"; do
    if [ -f "$auth_candidate" ]; then
        LOCAL_XAUTH="$auth_candidate"
        break
    fi
done

if [ -n "$LOCAL_XAUTH" ]; then
    export XAUTHORITY="$LOCAL_XAUTH"
fi

DISPLAY="$DISPLAY" XAUTHORITY="$XAUTHORITY" xhost +local:docker >/dev/null 2>&1 || true
DISPLAY="$DISPLAY" XAUTHORITY="$XAUTHORITY" xhost +SI:localuser:root >/dev/null 2>&1 || true

# 2. Setup CAN Interface
echo "--> Verifying CAN adapter ($CAN_IFACE)..."
if [ "$CAN_IFACE" = "can2" ]; then
    # If can2 is already UP and daemon is active, reuse it immediately (avoids USB re-enumeration stalls)
    if ip link show can2 2>/dev/null | grep -q "UP" && pgrep -f "canalyst_socketcan_daemon.py.*can2" >/dev/null 2>&1; then
        echo "  [OK] can2 interface is already UP and bridge daemon is active."
    elif [ -f "$WORKSPACE_ROOT/scripts/setup_canalyst.sh" ]; then
        bash "$WORKSPACE_ROOT/scripts/setup_canalyst.sh" up "$CAN_IFACE" "$CAN_BITRATE"
    else
        echo "  [WARN] setup_canalyst.sh not found, assuming $CAN_IFACE already up."
    fi
else
    if ip link show "$CAN_IFACE" 2>/dev/null | grep -q "UP"; then
        echo "  [OK] $CAN_IFACE is already UP."
    elif ip link show "$CAN_IFACE" >/dev/null 2>&1; then
        sudo ip link set "$CAN_IFACE" down >/dev/null 2>&1 || true
        sudo ip link set "$CAN_IFACE" type can bitrate "$CAN_BITRATE" 2>/dev/null || true
        sudo ip link set "$CAN_IFACE" up
        echo "  [OK] $CAN_IFACE is UP."
    else
        echo "  [WARN] CAN interface $CAN_IFACE not found. Ensure adapter is connected."
    fi
fi

# 3. Ensure Docker container is running
echo "--> Checking Docker container ($CONTAINER)..."
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    echo "  Container $CONTAINER is already running."
else
    docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
    echo "  Starting $CONTAINER container..."
    docker run -d --name "$CONTAINER" \
        --privileged --runtime=nvidia --gpus all \
        --net=host --ipc=host \
        -e DISPLAY="$DISPLAY" \
        -e XAUTHORITY="$XAUTHORITY" \
        -v /tmp/.X11-unix:/tmp/.X11-unix:ro \
        -v "$WORKSPACE_ROOT/autoware:/workspace/autoware" \
        -v "$HOME/autoware_map:/autoware_map" \
        "$IMAGE" bash -c 'while true; do sleep 1000; done'
    echo "  Container started."
fi

# Provision host local X11 authority into container so Qt GUI connects reliably
if [ -n "$XAUTHORITY" ] && [ -f "$XAUTHORITY" ]; then
    docker cp "$XAUTHORITY" "$CONTAINER":/tmp/.docker.xauth >/dev/null 2>&1 || true
    docker exec "$CONTAINER" chmod 644 /tmp/.docker.xauth >/dev/null 2>&1 || true
fi

# 4. Pre-Flight Guard: Check for conflicting autonomy stack
echo "--> Checking existing ROS nodes inside container..."
if docker exec "$CONTAINER" pgrep -f "planning_simulator" >/dev/null 2>&1 || \
   docker exec "$CONTAINER" pgrep -f "trajectory_follower" >/dev/null 2>&1; then
    echo "======================================================================"
    echo " [GUARD] Autoware Universe autonomy stack is currently running!"
    echo " Running Remote Control in parallel causes actuator command conflicts."
    echo " Please stop Autoware first: bash scripts/close_everything.sh"
    echo "======================================================================"
    exit 1
fi

BRIDGE_ALREADY_RUNNING=false
if docker exec "$CONTAINER" pgrep -f "vehicle_bridge_node" >/dev/null 2>&1; then
    BRIDGE_ALREADY_RUNNING=true
    echo "  [INFO] Detected existing vehicle_bridge_node already running. Will attach GUI to it."
fi

# Stop previous cockpit GUI instance if already running
docker exec "$CONTAINER" bash -c "
    pkill -9 -f 'remote_control_gui' 2>/dev/null || true
" || true

sleep 0.5

# 5. Launch Remote Cockpit GUI (and vehicle bridge only if not already running)
if [ "$BRIDGE_ALREADY_RUNNING" = "true" ]; then
    echo "--> Launching GUI-only attached to active vehicle bridge..."
    LAUNCH_TARGET="remote_control.launch.py"
    EXTRA_ARGS=""
else
    echo "--> Launching bench remote control stack (vehicle_bridge + remote_control_gui)..."
    LAUNCH_TARGET="bench_remote_control.launch.py"
    EXTRA_ARGS="can_interface:=$CAN_IFACE sim_mode:=$SIM_MODE"
fi

docker exec -d "$CONTAINER" bash -c "
    export DISPLAY=$DISPLAY
    if [ -f /tmp/.docker.xauth ]; then export XAUTHORITY=/tmp/.docker.xauth; else export XAUTHORITY=$XAUTHORITY; fi
    source /opt/autoware/setup.bash 2>/dev/null || source /opt/ros/humble/setup.bash
    if [ -f /workspace/autoware/install/setup.bash ]; then
        source /workspace/autoware/install/setup.bash
    fi
    ros2 launch etrike_remote_control $LAUNCH_TARGET $EXTRA_ARGS > /tmp/etrike_remote_cockpit.log 2>&1
"

echo "Waiting for cockpit to initialize..."
sleep 2

# Check if running
if docker exec "$CONTAINER" pgrep -f "remote_control_gui" >/dev/null 2>&1; then
    echo "======================================================================"
    echo " [SUCCESS] E-Trike Remote Cockpit is RUNNING on Jetson display ($DISPLAY)!"
    echo " Logs: docker exec -it autoware_test cat /tmp/etrike_remote_cockpit.log"
    echo " To cleanly close: bash scripts/close_remote_control.sh"
    echo "======================================================================"
else
    echo " [INFO] Remote Cockpit launched in background. Check logs if window not visible:"
    echo " docker exec -it autoware_test cat /tmp/etrike_remote_cockpit.log"
fi
