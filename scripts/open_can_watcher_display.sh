#!/usr/bin/env bash
# ==============================================================================
# Open CAN Watcher on the Jetson Physical Monitor
# ==============================================================================
# Starts the CAN Watcher backend server (if not already running) on can2
# and opens the UI in full-screen application window on the attached display.
# ==============================================================================

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

INTERFACE="${1:-can2}"
PORT="${2:-8000}"
URL="http://localhost:${PORT}"

# 1. Detect X11 Display and Authority
export DISPLAY="${DISPLAY:-:1}"
if [ -z "$XAUTHORITY" ]; then
    if [ -f "/run/user/1000/gdm/Xauthority" ]; then
        export XAUTHORITY="/run/user/1000/gdm/Xauthority"
    elif [ -f "$HOME/.Xauthority" ]; then
        export XAUTHORITY="$HOME/.Xauthority"
    fi
fi

echo "======================================================================"
echo " Opening CAN Watcher on Jetson Display ($DISPLAY)"
echo " CAN Interface: $INTERFACE | URL: $URL"
echo "======================================================================"

# 2. Ensure CAN Watcher backend server is running
export PYTHONPATH="$WORKSPACE_ROOT:$PYTHONPATH"

if curl -s "http://127.0.0.1:${PORT}/api/v1/status" >/dev/null 2>&1; then
    echo "  [INFO] CAN Watcher backend server is already running on port $PORT."
else
    echo "Starting CAN Watcher backend server on $INTERFACE..."
    nohup python3 -m tools.can_watcher.backend.server \
        --interface "$INTERFACE" \
        --host "0.0.0.0" \
        --port "$PORT" \
        > "/tmp/can_watcher.log" 2>&1 &
    
    # Wait for server to come up
    for i in {1..10}; do
        if curl -s "http://127.0.0.1:${PORT}/api/v1/status" >/dev/null 2>&1; then
            echo "  [OK] CAN Watcher backend server is UP."
            break
        fi
        sleep 0.5
    done
fi

# 3. Launch UI on the physical monitor
if command -v chromium >/dev/null 2>&1; then
    BROWSER_CMD="chromium"
elif command -v chromium-browser >/dev/null 2>&1; then
    BROWSER_CMD="chromium-browser"
elif command -v google-chrome >/dev/null 2>&1; then
    BROWSER_CMD="google-chrome"
elif command -v firefox >/dev/null 2>&1; then
    BROWSER_CMD="firefox"
else
    BROWSER_CMD="x-www-browser"
fi

echo "Opening $URL in $BROWSER_CMD on $DISPLAY..."
nohup "$BROWSER_CMD" \
    --app="$URL" \
    --start-maximized \
    --no-first-run \
    --no-default-browser-check \
    --ignore-gpu-blocklist \
    --enable-gpu-rasterization \
    --enable-zero-copy \
    --enable-webgl \
    --enable-unsafe-swiftshader \
    --disable-gpu-sandbox \
    > "/tmp/can_watcher_browser.log" 2>&1 &

echo "  [OK] CAN Watcher launched on monitor!"
echo "  URL: $URL (Accessible also from other devices on network: http://172.16.25.67:${PORT})"
