#!/usr/bin/env bash
# ==============================================================================
# Open AV Dashboard on the Jetson Physical Monitor
# ==============================================================================
# Starts the AV Dashboard backend server (if not already running) on can2
# and opens the UI in full-screen application window on the attached display.
# ==============================================================================

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

INTERFACE="${1:-can2}"
PORT="${2:-8080}"
URL="http://localhost:${PORT}"

# 1. Detect X11 Display and Authority
export DISPLAY="${DISPLAY:-:1}"
if [ ! -e "/tmp/.X11-unix/X${DISPLAY#:}" ]; then
    for d in 1 0; do
        if [ -e "/tmp/.X11-unix/X${d}" ]; then
            DISPLAY=":${d}"
            break
        fi
    done
fi
if [ -z "$XAUTHORITY" ]; then
    if [ -f "/run/user/$(id -u)/gdm/Xauthority" ]; then
        export XAUTHORITY="/run/user/$(id -u)/gdm/Xauthority"
    elif [ -f "/run/user/1000/gdm/Xauthority" ]; then
        export XAUTHORITY="/run/user/1000/gdm/Xauthority"
    elif [ -f "$HOME/.Xauthority" ]; then
        export XAUTHORITY="$HOME/.Xauthority"
    elif [ -f "/home/med1/.Xauthority" ]; then
        export XAUTHORITY="/home/med1/.Xauthority"
    fi
fi

echo "======================================================================"
echo " Opening AV Dashboard on Jetson Display ($DISPLAY)"
echo " CAN Interface: $INTERFACE | URL: $URL"
echo "======================================================================"

CONTAINER="autoware_test"
if docker image inspect etrike-kinect-build:latest >/dev/null 2>&1; then
    IMAGE="etrike-kinect-build:latest"
else
    IMAGE="ghcr.io/autowarefoundation/autoware:universe-cuda-humble"
fi

xhost +local:docker >/dev/null 2>&1 || true
xhost +SI:localuser:root >/dev/null 2>&1 || true

# 2. Ensure AV Dashboard backend server is running (prefer inside autoware_test container for rclpy + Autoware msgs)
NEED_START=1
if curl -s "http://127.0.0.1:${PORT}/api/v1/ros" >/dev/null 2>&1; then
    if curl -s "http://127.0.0.1:${PORT}/api/v1/ros" | grep -q '"bridge_available":true'; then
        echo "  [INFO] AV Dashboard backend server is already running on port $PORT with ROS 2 bridge active."
        NEED_START=0
    else
        echo "  [INFO] Restarting existing AV Dashboard server to enable ROS 2 container bridge..."
        pkill -9 -f "tools.av_dashboard.backend.server" 2>/dev/null || true
        docker exec -u root "$CONTAINER" pkill --signal SIGKILL -f "tools.av_dashboard.backend.server" 2>/dev/null || true
        sleep 0.5
    fi
fi

start_in_container() {
    if ! command -v docker >/dev/null 2>&1; then
        return 1
    fi

    # Start or create autoware_test container if not running
    if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
        if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
            docker start "$CONTAINER" >/dev/null 2>&1 || true
        else
            mkdir -p "$WORKSPACE_ROOT/data" 2>/dev/null || true
            docker run -d --name "$CONTAINER" \
                --privileged --runtime=nvidia --gpus all \
                --net=host --ipc=host \
                -e DISPLAY="$DISPLAY" \
                -e XAUTHORITY="$XAUTHORITY" \
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
                "$IMAGE" bash -c 'while true; do sleep 1000; done' >/dev/null 2>&1 || return 1
        fi
    fi

    # Ensure /workspace/av_project/tools is present inside the container even if container was created with older mounts
    if ! docker exec "$CONTAINER" test -d /workspace/av_project/tools >/dev/null 2>&1; then
        docker exec "$CONTAINER" mkdir -p /workspace/av_project >/dev/null 2>&1 || true
        docker cp "$WORKSPACE_ROOT/tools" "$CONTAINER:/workspace/av_project/tools" >/dev/null 2>&1 || true
    fi
    if ! docker exec "$CONTAINER" python3 -c "import sys; sys.path.extend(['/host_local/lib/python3.10/site-packages', '/host_dist_packages']); import fastapi, uvicorn" >/dev/null 2>&1; then
        if [ -d "$HOME/.local/lib/python3.10/site-packages" ]; then
            docker exec "$CONTAINER" mkdir -p /host_local/lib/python3.10 >/dev/null 2>&1 || true
            docker cp "$HOME/.local/lib/python3.10/site-packages" "$CONTAINER:/host_local/lib/python3.10/site-packages" >/dev/null 2>&1 || true
        fi
    fi

    echo "Starting AV Dashboard backend inside '$CONTAINER' (ROS 2 Humble + SocketCAN $INTERFACE)..."
    docker exec -d "$CONTAINER" bash -c "
        source /opt/ros/humble/setup.bash 2>/dev/null || true
        source /opt/autoware/setup.bash 2>/dev/null || true
        source /workspace/autoware/install/setup.bash 2>/dev/null || true
        export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp;
        if [ -f /home/aw/cyclonedds.xml ]; then
            export CYCLONEDDS_URI=file:///home/aw/cyclonedds.xml;
        fi;
        export PYTHONPATH=/workspace/av_project:/host_local/lib/python3.10/site-packages:/host_dist_packages:\$PYTHONPATH;
        python3 -m tools.av_dashboard.backend.server \
            --interface '$INTERFACE' \
            --host '0.0.0.0' \
            --port '$PORT' \
            > /tmp/av_dashboard.log 2>&1
    "

    for i in {1..30}; do
        if curl -s "http://127.0.0.1:${PORT}/api/v1/status" >/dev/null 2>&1; then
            echo "  [OK] AV Dashboard backend server is UP (container ROS 2 bridge active)."
            return 0
        fi
        sleep 0.5
    done
    return 1
}

if [ "$NEED_START" -eq 1 ]; then
    if ! start_in_container; then
        echo "  [WARN] Container launch unavailable; falling back to host Python environment..."
        for setup_file in \
            /opt/ros/humble/setup.bash \
            /opt/autoware/setup.bash \
            "$WORKSPACE_ROOT/autoware/install/setup.bash"; do
            if [ -f "$setup_file" ]; then
                set +e
                source "$setup_file" 2>/dev/null || true
                set -e
            fi
        done
        export PYTHONPATH="$WORKSPACE_ROOT:$PYTHONPATH"
        nohup python3 -m tools.av_dashboard.backend.server \
            --interface "$INTERFACE" \
            --host "0.0.0.0" \
            --port "$PORT" \
            > "/tmp/av_dashboard.log" 2>&1 &
        for i in {1..10}; do
            if curl -s "http://127.0.0.1:${PORT}/api/v1/status" >/dev/null 2>&1; then
                echo "  [OK] AV Dashboard backend server is UP (host mode)."
                break
            fi
            sleep 0.5
        done
    fi
fi

if command -v chromium >/dev/null 2>&1; then
    BROWSER_CMD="chromium"
elif command -v chromium-browser >/dev/null 2>&1; then
    BROWSER_CMD="chromium-browser"
elif command -v google-chrome >/dev/null 2>&1; then
    BROWSER_CMD="google-chrome"
elif command -v firefox >/dev/null 2>&1; then
    BROWSER_CMD="firefox"
elif command -v epiphany-browser >/dev/null 2>&1; then
    BROWSER_CMD="epiphany-browser"
elif command -v epiphany >/dev/null 2>&1; then
    BROWSER_CMD="epiphany"
else
    BROWSER_CMD="x-www-browser"
fi

echo "Opening $URL in $BROWSER_CMD on $DISPLAY..."
if [ "$BROWSER_CMD" = "epiphany-browser" ] || [ "$BROWSER_CMD" = "epiphany" ]; then
    nohup "$BROWSER_CMD" -a "$URL" < /dev/null > "/tmp/av_dashboard_browser.log" 2>&1 &
elif [ "$BROWSER_CMD" = "firefox" ]; then
    nohup "$BROWSER_CMD" --kiosk "$URL" < /dev/null > "/tmp/av_dashboard_browser.log" 2>&1 &
else
    nohup "$BROWSER_CMD" \
        --app="$URL" \
        --start-maximized \
        --no-first-run \
        --no-default-browser-check \
        --test-type \
        < /dev/null > "/tmp/av_dashboard_browser.log" 2>&1 &
fi

echo "  [OK] AV Dashboard launched on Jetson monitor!"
echo "  URL: $URL (Accessible also across network: http://172.16.25.67:${PORT})"

