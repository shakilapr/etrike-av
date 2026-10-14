#!/usr/bin/env bash
# ==============================================================================
# Open 3D Cockpit HUD & Dedicated Annotated Camera View on Jetson Monitor
# ==============================================================================
set -e

# 1. Discover Real Physical X11 Display & Authority
export DISPLAY="${DISPLAY:-:1}"
if [ ! -e "/tmp/.X11-unix/X${DISPLAY#:}" ]; then
    for d in 1 0 2; do
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
    fi
fi

xhost +local: >/dev/null 2>&1 || true

echo "======================================================================"
echo " Opening AV Cockpit & Camera on Jetson Monitor ($DISPLAY)"
echo " Xauthority: $XAUTHORITY"
echo "======================================================================"

PORT="${1:-8080}"
URL_COCKPIT="http://localhost:${PORT}"
URL_CAMERA="http://localhost:${PORT}/camera"

# Find browser
if command -v /usr/bin/chromium-browser >/dev/null 2>&1; then
    BROWSER="/usr/bin/chromium-browser"
elif command -v /snap/bin/chromium >/dev/null 2>&1; then
    BROWSER="/snap/bin/chromium"
elif command -v chromium-browser >/dev/null 2>&1; then
    BROWSER="chromium-browser"
elif command -v google-chrome >/dev/null 2>&1; then
    BROWSER="google-chrome"
else
    BROWSER="x-www-browser"
fi

COMMON_FLAGS=(
    "--no-first-run"
    "--no-default-browser-check"
    "--ignore-gpu-blocklist"
    "--enable-gpu-rasterization"
    "--enable-zero-copy"
    "--enable-webgl"
    "--enable-unsafe-swiftshader"
    "--disable-gpu-sandbox"
    "--test-type"
)

# 1. Launch Full 3D Cockpit & Radar HUD Window
echo "Launching 3D Cockpit HUD ($URL_COCKPIT)..."
nohup "$BROWSER" \
    --app="$URL_COCKPIT" \
    --user-data-dir="/tmp/chromium_cockpit" \
    --start-maximized \
    "${COMMON_FLAGS[@]}" \
    < /dev/null > /tmp/browser_cockpit.log 2>&1 &

sleep 1

# 2. Launch Dedicated Full-Window Camera Stream with annotation
echo "Launching Dedicated Annotated Camera Stream ($URL_CAMERA)..."
nohup "$BROWSER" \
    --app="$URL_CAMERA" \
    --user-data-dir="/tmp/chromium_camera" \
    --window-size=960,540 \
    "${COMMON_FLAGS[@]}" \
    < /dev/null > /tmp/browser_camera.log 2>&1 &

echo "======================================================================"
echo " [SUCCESS] Both windows opened on Jetson Physical Display!"
echo "   1. 3D Cockpit & Radar HUD:               $URL_COCKPIT"
echo "   2. Dedicated Annotated Camera Window:    $URL_CAMERA"
echo "======================================================================"
