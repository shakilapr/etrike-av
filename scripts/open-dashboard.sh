#!/usr/bin/env bash
# ==============================================================================
# open-dashboard.sh — Unified Launcher for AV Cockpit & Perception
# ==============================================================================
# Usage:
#   ./open-dashboard.sh            # Auto-detect whatever is connected right now
#   ./open-dashboard.sh --cam      # Explicitly launch Camera perception & HUD
#   ./open-dashboard.sh --lidar    # Explicitly launch LiDAR perception & HUD
#   ./open-dashboard.sh --fusion   # Explicitly launch Camera + LiDAR Fusion HUD
#   ./open-dashboard.sh --fuision  # Alias for --fusion
# ==============================================================================

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$SCRIPT_DIR"
if [ ! -d "$WORKSPACE_ROOT/tools/av_dashboard" ] && [ -d "$SCRIPT_DIR/.." ]; then
    WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
fi

CONTAINER="autoware_test"
PORT="${PORT:-8080}"
INTERFACE="${INTERFACE:-can2}"

# 1. Parse Command Line Arguments
REQ_MODE="auto"

ALLOW_SIM=0

while [[ $# -gt 0 ]]; do
    case "$1" in
        --cam|-c|cam)
            REQ_MODE="cam"
            shift
            ;;
        --lidar|-l|lidar)
            REQ_MODE="lidar"
            shift
            ;;
        --fusion|--fuision|-f|fusion|fuision)
            REQ_MODE="fusion"
            shift
            ;;
        --bevfusion|bevfusion)
            REQ_MODE="bevfusion"
            shift
            ;;
        --sim|--synthetic)
            ALLOW_SIM=1
            shift
            ;;
        --port|-p)
            PORT="$2"
            shift 2
            ;;
        --interface|-i)
            INTERFACE="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $0 [--cam | --lidar | --fusion | --fuision] [--sim] [--port <PORT>] [--interface <CAN>]"
            echo ""
            echo "Options:"
            echo "  (no args)       Auto-detect connected hardware (Camera, LiDAR, or Fused)"
            echo "  --cam           Force Camera-only perception & 3D HUD"
            echo "  --lidar         Force LiDAR-only perception & 3D HUD"
            echo "  --fusion        Force Camera + LiDAR Multi-Modal Fusion HUD"
            echo "  --fuision       Alias for --fusion"
            echo "  --sim           Allow synthetic sensor fallback if physical hardware is offline (fails closed by default)"
            echo "  --port <8080>   AV Dashboard web server port (default 8080)"
            echo "  --interface     CAN interface name (default can2)"
            exit 0
            ;;
        *)
            echo "Unknown argument: $1"
            echo "Run '$0 --help' for usage."
            exit 1
            ;;
    esac
done

# 2. Discover Real Physical X11 Display & Authority
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

# 3. Check Physical Hardware Connectivity
CAM_CONNECTED=0
LIDAR_CONNECTED=0

# Check Kinect v2 USB device
if lsusb 2>/dev/null | grep -qi "045e:02d8"; then
    CAM_CONNECTED=1
fi

# Check Hesai XT32 physical ethernet connection
if ip link show eno1 2>/dev/null | grep -q "NO-CARRIER"; then
    LIDAR_CONNECTED=0
elif ping -c 1 -W 1 192.168.1.201 >/dev/null 2>&1; then
    LIDAR_CONNECTED=1
elif ethtool eno1 2>/dev/null | grep -q "Link detected: yes"; then
    LIDAR_CONNECTED=1
fi

# 4. Resolve Active Mode
FINAL_MODE="$REQ_MODE"
if [ "$REQ_MODE" = "auto" ]; then
    if [ "$CAM_CONNECTED" -eq 1 ] && [ "$LIDAR_CONNECTED" -eq 1 ]; then
        FINAL_MODE="fusion"
    elif [ "$CAM_CONNECTED" -eq 1 ]; then
        FINAL_MODE="cam"
    elif [ "$LIDAR_CONNECTED" -eq 1 ]; then
        FINAL_MODE="lidar"
    else
        FINAL_MODE="standby"
    fi
fi

echo "======================================================================"
echo " AV Dashboard Launcher"
echo " Target Mode: $FINAL_MODE (Requested: $REQ_MODE)"
echo " Hardware Status: Camera=$([ $CAM_CONNECTED -eq 1 ] && echo 'CONNECTED' || echo 'OFFLINE') | LiDAR=$([ $LIDAR_CONNECTED -eq 1 ] && echo 'CONNECTED' || echo 'OFFLINE')"
echo " Display: $DISPLAY | Port: $PORT | Interface: $INTERFACE"
echo "======================================================================"

# 5. Ensure Docker Container is Running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
        echo "Starting existing '$CONTAINER' container..."
        docker start "$CONTAINER" >/dev/null
    else
        echo "[ERROR] Docker container '$CONTAINER' not found. Please start workspace container first."
        exit 1
    fi
fi

# 6. Setup Base Static Transforms
echo "Setting up static TF transforms (base_link -> optical & lidar frames)..."
docker exec "$CONTAINER" bash -c "
    source /opt/ros/humble/setup.bash
    pkill -f 'tf2_ros.*static_transform_publisher.*kinect_front' || true
    pkill -f 'tf2_ros.*static_transform_publisher.*lidar_link' || true
    ros2 run tf2_ros static_transform_publisher --x 1.20 --y 0.0 --z 1.00 --yaw 0.0 --pitch 0.0 --roll 0.0 --frame-id base_link --child-frame-id kinect_front_link &
    ros2 run tf2_ros static_transform_publisher --x 0.0 --y 0.0 --z 0.0 --yaw -1.5707963 --pitch 0.0 --roll -1.5707963 --frame-id kinect_front_link --child-frame-id kinect_front_optical_link &
    ros2 run tf2_ros static_transform_publisher --x 0.963 --y 0.0 --z 1.58 --yaw 0.0 --pitch 0.0 --roll 0.0 --frame-id base_link --child-frame-id lidar_link &
" >/dev/null 2>&1 || true

# 7. Launch Appropriate Perception Pipelines
case "$FINAL_MODE" in
    fusion)
        echo "Launching Camera Pipeline (Kinect v2 + YOLO26x-Pose TRT)..."
        docker exec -d "$CONTAINER" bash -c "
            source /opt/ros/humble/setup.bash
            source /workspace/autoware/install/setup.bash 2>/dev/null || true
            pkill -f 'yolo_perception_node' || true
            ros2 launch etrike_yolo_perception yolo_perception.launch.py publish_mode:=bench auto_start:=true > /tmp/yolo_node.log 2>&1
        "
        echo "Launching LiDAR Pipeline..."
        docker exec -d "$CONTAINER" bash -c "
            source /opt/ros/humble/setup.bash
            source /workspace/autoware/install/setup.bash 2>/dev/null || true
            pkill -f 'bench_perception_node.py' || true
            pkill -f 'hesai_ros_wrapper_node' || true
            pkill -f 'hesai_synthetic_publisher' || true
            ros2 launch etrike_common_launch hesai_bench.launch.py > /tmp/hesai_bench.log 2>&1
        "
        if [ "$LIDAR_CONNECTED" -eq 0 ]; then
            if [ "$ALLOW_SIM" -eq 1 ]; then
                echo "  [INFO] Physical LiDAR offline; starting 10 Hz 32-ring synthetic LiDAR stream for fusion bench (--sim requested)..."
                docker exec -d "$CONTAINER" bash -c "
                    source /opt/ros/humble/setup.bash
                    source /workspace/autoware/install/setup.bash 2>/dev/null || true
                    python3 /workspace/autoware/src/our_packages/etrike_common_launch/scripts/hesai_synthetic_publisher.py > /tmp/hesai_synthetic.log 2>&1
                "
            else
                echo "  [WARN] Physical LiDAR offline or not communicating on eno1:2368. Fails closed (no silent simulation fallback; pass --sim to allow)."
            fi
        fi
        ;;
    bevfusion)
        echo "Launching BEVFusion Multi-Modal Pipeline (Kinect v2 + Hesai XT32 + BEVFusion TRT)..."
        docker exec -d "$CONTAINER" bash -c "
            source /opt/ros/humble/setup.bash
            source /opt/autoware/setup.bash 2>/dev/null || true
            source /workspace/autoware/install/setup.bash 2>/dev/null || true
            pkill -f 'yolo_perception_node' || true
            pkill -f 'bench_perception_node.py' || true
            pkill -f 'autoware_bevfusion' || true
            pkill -f 'hesai_pointxyzirc_adapter' || true
            ros2 launch etrike_common_launch etrike_bevfusion.launch.xml > /tmp/etrike_bevfusion.log 2>&1
        "
        if [ "$LIDAR_CONNECTED" -eq 0 ]; then
            if [ "$ALLOW_SIM" -eq 1 ]; then
                echo "  [INFO] Physical LiDAR offline; starting 10 Hz 32-ring synthetic LiDAR stream for BEVFusion (--sim requested)..."
                docker exec -d "$CONTAINER" bash -c "
                    source /opt/ros/humble/setup.bash
                    source /workspace/autoware/install/setup.bash 2>/dev/null || true
                    python3 /workspace/autoware/src/our_packages/etrike_common_launch/scripts/hesai_synthetic_publisher.py > /tmp/hesai_synthetic.log 2>&1
                "
            else
                echo "  [WARN] Physical LiDAR offline or not communicating on eno1:2368. Fails closed (no silent simulation fallback; pass --sim to allow)."
            fi
        fi
        ;;
    cam)
        echo "Launching Camera Pipeline (Kinect v2 + YOLO26x-Pose TRT)..."
        docker exec "$CONTAINER" bash -c "
            pkill -f 'hesai_ros_wrapper_node' || true
            pkill -f 'hesai_synthetic_publisher' || true
        " >/dev/null 2>&1 || true
        docker exec -d "$CONTAINER" bash -c "
            source /opt/ros/humble/setup.bash
            source /workspace/autoware/install/setup.bash 2>/dev/null || true
            pkill -f 'yolo_perception_node' || true
            ros2 launch etrike_yolo_perception yolo_perception.launch.py publish_mode:=bench auto_start:=true > /tmp/yolo_node.log 2>&1
        "
        ;;
    lidar)
        echo "Launching LiDAR Pipeline..."
        docker exec "$CONTAINER" bash -c "
            pkill -f 'yolo_perception_node' || true
        " >/dev/null 2>&1 || true
        docker exec -d "$CONTAINER" bash -c "
            source /opt/ros/humble/setup.bash
            source /workspace/autoware/install/setup.bash 2>/dev/null || true
            pkill -f 'bench_perception_node.py' || true
            pkill -f 'hesai_ros_wrapper_node' || true
            pkill -f 'hesai_synthetic_publisher' || true
            ros2 launch etrike_common_launch hesai_bench.launch.py > /tmp/hesai_bench.log 2>&1
        "
        if [ "$LIDAR_CONNECTED" -eq 0 ]; then
            if [ "$ALLOW_SIM" -eq 1 ]; then
                echo "  [INFO] Physical LiDAR offline; starting 10 Hz 32-ring synthetic LiDAR stream (--sim requested)..."
                docker exec -d "$CONTAINER" bash -c "
                    source /opt/ros/humble/setup.bash
                    source /workspace/autoware/install/setup.bash 2>/dev/null || true
                    python3 /workspace/autoware/src/our_packages/etrike_common_launch/scripts/hesai_synthetic_publisher.py > /tmp/hesai_synthetic.log 2>&1
                "
            else
                echo "  [WARN] Physical LiDAR offline or not communicating on eno1:2368. Fails closed (no silent simulation fallback; pass --sim to allow)."
            fi
        fi
        ;;
    standby)
        echo "[NOTICE] No active sensors detected. Launching HUD in Standby mode."
        ;;
esac

# 8. Start AV Dashboard Backend if Not Active
if ! curl -s "http://127.0.0.1:${PORT}/api/v1/status" >/dev/null 2>&1; then
    echo "Starting AV Dashboard Backend Server..."
    docker exec -d "$CONTAINER" bash -c "
        source /opt/ros/humble/setup.bash 2>/dev/null || true
        source /workspace/autoware/install/setup.bash 2>/dev/null || true
        export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
        export PYTHONPATH=/workspace/av_project:/host_local/lib/python3.10/site-packages:/host_dist_packages:\$PYTHONPATH
        python3 -m tools.av_dashboard.backend.server --interface '$INTERFACE' --host 0.0.0.0 --port '$PORT' > /tmp/av_dashboard.log 2>&1
    "
    for i in {1..20}; do
        if curl -s "http://127.0.0.1:${PORT}/api/v1/status" >/dev/null 2>&1; then
            echo "  [OK] AV Dashboard backend server is UP."
            break
        fi
        sleep 0.5
    done
else
    echo "  [OK] AV Dashboard backend server already running on port $PORT."
fi

# 9. Launch / Focus Browser Windows on Jetson Display
URL_COCKPIT="http://localhost:${PORT}"
URL_CAMERA="http://localhost:${PORT}/camera"

if command -v /snap/bin/chromium >/dev/null 2>&1; then
    BROWSER="/snap/bin/chromium"
elif command -v chromium-browser >/dev/null 2>&1; then
    BROWSER="chromium-browser"
elif command -v google-chrome >/dev/null 2>&1; then
    BROWSER="google-chrome"
else
    BROWSER="x-www-browser"
fi

COMMON_FLAGS=(
    "--password-store=basic"
    "--gtk-version=3"
    "--disable-features=TFLiteLanguageDetectionEnabled"
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

# Close existing browser windows cleanly
pkill -f "chromium.*${PORT}" 2>/dev/null || true
sleep 0.5

echo "Launching 3D Cockpit Window on $DISPLAY..."
nohup "$BROWSER" \
    --app="$URL_COCKPIT" \
    --user-data-dir="/tmp/chromium_cockpit" \
    --start-maximized \
    "${COMMON_FLAGS[@]}" \
    < /dev/null > /tmp/browser_cockpit.log 2>&1 &

if [ "$FINAL_MODE" = "fusion" ] || [ "$FINAL_MODE" = "cam" ] || [ "$FINAL_MODE" = "bevfusion" ]; then
    sleep 1
    echo "Launching Annotated Camera Window on $DISPLAY..."
    nohup "$BROWSER" \
        --app="$URL_CAMERA" \
        --user-data-dir="/tmp/chromium_camera" \
        --window-size=960,540 \
        "${COMMON_FLAGS[@]}" \
        < /dev/null > /tmp/browser_camera.log 2>&1 &
fi

echo ""
echo "======================================================================"
echo " [SUCCESS] AV Dashboard is RUNNING in Mode: $FINAL_MODE"
echo " 3D Cockpit HUD:       $URL_COCKPIT"
if [ "$FINAL_MODE" = "fusion" ] || [ "$FINAL_MODE" = "cam" ]; then
    echo " Dedicated Camera:     $URL_CAMERA"
fi
echo " Network URL:          http://172.16.25.67:${PORT}"
echo "======================================================================"
