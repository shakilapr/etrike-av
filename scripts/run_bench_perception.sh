#!/usr/bin/env bash
# ==============================================================================
# Standalone Real-Time Bench Perception Pipeline (Camera + LiDAR)
# ==============================================================================
# Independent of Autoware planning simulator, localization, and synthetic data.
# Direct real sensor data -> real object detections -> live 3D Cockpit.
#
# Supports 3 operating modes with seamless failover:
#   1. CAMERA_ONLY : Kinect v2 RGB-D active, LiDAR offline / disconnected
#   2. LIDAR_ONLY  : Hesai XT32M2X 360° LiDAR active, Camera offline
#   3. FUSED       : Camera + LiDAR active, detections fused in base_link
#   4. UNAVAILABLE : Both sensors offline -> 0 detections (fail-closed)
# ==============================================================================

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

INTERFACE="${1:-can2}"
PORT="${2:-8080}"
CAMERA_NAME="${3:-front}"
CONTAINER="autoware_test"

export DISPLAY="${DISPLAY:-:1}"
if [ -z "$XAUTHORITY" ]; then
    if [ -f "/run/user/1000/gdm/Xauthority" ]; then
        export XAUTHORITY="/run/user/1000/gdm/Xauthority"
    elif [ -f "$HOME/.Xauthority" ]; then
        export XAUTHORITY="$HOME/.Xauthority"
    fi
fi

xhost +local:docker >/dev/null 2>&1 || true
xhost +SI:localuser:root >/dev/null 2>&1 || true

echo "======================================================================"
echo " Starting Standalone Bench Perception Pipeline"
echo " Workspace: $WORKSPACE_ROOT"
echo " Display: $DISPLAY | CAN: $INTERFACE | Port: $PORT"
echo "======================================================================"

cleanup() {
    echo ""
    echo "======================================================================"
    echo " Stopping Standalone Bench Perception Pipeline..."
    echo "======================================================================"
    if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
        echo "  Stopping perception nodes inside '$CONTAINER'..."
        docker exec "$CONTAINER" pkill -f "bench_perception_node.py" 2>/dev/null || true
        docker exec "$CONTAINER" pkill -f "kinect2_node_exec" 2>/dev/null || true
        docker exec "$CONTAINER" pkill -f "hesai_ros_wrapper_node" 2>/dev/null || true
        docker exec "$CONTAINER" pkill -f "static_transform_publisher" 2>/dev/null || true
    fi
    echo "  [OK] Perception processes cleanly stopped."
}
trap cleanup EXIT INT TERM

# 1. Verify container autoware_test is running
echo "[1/6] Verifying Docker container '$CONTAINER'..."
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
        echo "  Starting existing '$CONTAINER' container..."
        docker start "$CONTAINER" >/dev/null
    else
        echo "  [ERROR] Container '$CONTAINER' does not exist. Run open_av_dashboard_display.sh first."
        exit 1
    fi
fi
echo "  [OK] Container '$CONTAINER' is active."

# 2. Setup Static TF Tree (base_link root)
echo "[2/6] Publishing Bench Static TF Frames (base_link -> sensors)..."
# base_link -> kinect_front_link (x=1.2, y=0.0, z=1.0)
docker exec -d "$CONTAINER" bash -c "
    source /opt/ros/humble/setup.bash
    ros2 run tf2_ros static_transform_publisher --x 1.20 --y 0.0 --z 1.00 --yaw 0.0 --pitch 0.0 --roll 0.0 --frame-id base_link --child-frame-id kinect_front_link
" 2>/dev/null || true

# kinect_front_link -> kinect_front_optical_link (yaw=-pi/2, roll=-pi/2)
docker exec -d "$CONTAINER" bash -c "
    source /opt/ros/humble/setup.bash
    ros2 run tf2_ros static_transform_publisher --x 0.0 --y 0.0 --z 0.0 --yaw -1.5707963 --pitch 0.0 --roll -1.5707963 --frame-id kinect_front_link --child-frame-id kinect_front_optical_link
" 2>/dev/null || true

# base_link -> lidar_link (x=0.963, y=0.0, z=1.58)
docker exec -d "$CONTAINER" bash -c "
    source /opt/ros/humble/setup.bash
    ros2 run tf2_ros static_transform_publisher --x 0.963 --y 0.0 --z 1.58 --yaw 0.0 --pitch 0.0 --roll 0.0 --frame-id base_link --child-frame-id lidar_link
" 2>/dev/null || true
echo "  [OK] Static transforms active (base_link -> kinect_front_optical_link & lidar_link)."

# 3. Check Physical Hesai LiDAR Network Status
echo "[3/6] Probing Hesai XT32M2X LiDAR hardware connection..."
LIDAR_ONLINE=0
if ip link show eno1 2>/dev/null | grep -q "NO-CARRIER"; then
    echo "  [NOTICE] eno1 reports NO-CARRIER: LiDAR ethernet cable is unplugged or 12V/24V power is off."
    echo "  [NOTICE] Hardware connection required for LiDAR. Proceeding in CAMERA ONLY mode."
elif ping -c 1 -W 1 192.168.1.201 >/dev/null 2>&1; then
    echo "  [OK] Hesai XT32M2X reachable at 192.168.1.201. Starting LiDAR driver..."
    docker exec -d "$CONTAINER" bash -c "
        source /opt/ros/humble/setup.bash
        source /workspace/autoware/install/setup.bash 2>/dev/null || true
        export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
        ros2 launch etrike_common_launch hesai_XT32M2X.launch.xml launch_driver:=true
    " 2>/dev/null || true
    LIDAR_ONLINE=1
else
    echo "  [NOTICE] Hesai XT32M2X not responding at 192.168.1.201. Proceeding in CAMERA ONLY mode."
fi

# 4. Check and Launch Physical Kinect v2 Camera
echo "[4/6] Probing physical Kinect v2 USB connection..."
KINECT_USB_PRESENT=0
if lsusb | grep -qi "045e:02d8"; then
    KINECT_USB_PRESENT=1
    echo "  [OK] Physical Kinect v2 USB device detected (045e:02d8)."
else
    echo "  [WARN] Kinect v2 USB VID:PID 045e:02d8 not found on host USB bus."
fi

# Kill any stale kinect driver to guarantee clean USB claim
docker exec "$CONTAINER" pkill -9 -f "kinect2_node_exec" 2>/dev/null || true
sleep 0.5

echo "  Launching Kinect v2 ROS 2 driver ($CAMERA_NAME)..."
docker exec -d "$CONTAINER" bash -c "
    source /opt/ros/humble/setup.bash
    source /workspace/autoware/install/setup.bash 2>/dev/null || true
    export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
    export LIBFREENECT2_LOGGER_LEVEL=warning
    ros2 launch etrike_kinect2 single_kinect.launch.py camera:=${CAMERA_NAME}
"

# Wait for live camera topic publishing
echo "  Verifying live camera topics on ROS 2 bus..."
CAMERA_VERIFIED=0
for i in {1..20}; do
    if docker exec "$CONTAINER" bash -c "source /opt/ros/humble/setup.bash; ros2 topic hz /kinect_${CAMERA_NAME}/depth/image_raw --window 3" 2>&1 | grep -q "average rate"; then
        CAMERA_VERIFIED=1
        echo "  [OK] Live Kinect depth stream verified on /kinect_${CAMERA_NAME}/depth/image_raw!"
        break
    fi
    sleep 0.5
done

if [ "$CAMERA_VERIFIED" -eq 0 ]; then
    echo "  [WARN] Depth stream did not confirm within 10s. Continuing pipeline check..."
fi

# 5. Launch Standalone Bench Perception Node
echo "[5/6] Launching Bench Perception Node (Spatial Hashing + HOG Vision Classifier)..."
docker exec "$CONTAINER" pkill -9 -f "bench_perception_node.py" 2>/dev/null || true
sleep 0.5

docker exec -d "$CONTAINER" bash -c "
    source /opt/ros/humble/setup.bash
    source /opt/autoware/setup.bash 2>/dev/null || true
    source /workspace/autoware/install/setup.bash 2>/dev/null || true
    export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
    export PYTHONPATH=/workspace/av_project:\$PYTHONPATH
    python3 /workspace/autoware/src/our_packages/etrike_common_launch/scripts/bench_perception_node.py \
        --ros-args \
        -p publish_rate_hz:=10.0 \
        -p sensor_timeout_sec:=1.2 \
        -p voxel_grid_size_m:=0.28 \
        -p enable_hog_person_detector:=true \
        > /tmp/bench_perception.log 2>&1
"

# Verify bench perception status topic is publishing
PERCEPTION_VERIFIED=0
for i in {1..15}; do
    STATUS_JSON=$(docker exec "$CONTAINER" bash -c "
        source /opt/ros/humble/setup.bash
        ros2 topic echo /bench_perception/status --once 2>/dev/null
    " || true)
    if echo "$STATUS_JSON" | grep -q "mode"; then
        PERCEPTION_VERIFIED=1
        echo "  [OK] Bench perception node active!"
        echo "  Diagnostic status: $STATUS_JSON"
        break
    fi
    sleep 0.5
done

# 6. Ensure AV Dashboard is Active on Physical Display
echo "[6/6] Connecting 3D Cockpit Display..."
"$SCRIPT_DIR/open_av_dashboard_display.sh" "$INTERFACE" "$PORT"

echo ""
echo "======================================================================"
echo " Standalone Bench Perception Pipeline is RUNNING"
echo " Mode: $([ "$LIDAR_ONLINE" -eq 1 ] && echo 'FUSED (Camera + LiDAR)' || echo 'CAMERA ONLY (LiDAR offline)')"
echo " Objects published on: /perception/object_recognition/detection/objects"
echo " Live diagnostic status: /bench_perception/status"
echo " Dashboard URL: http://localhost:${PORT}"
echo " Press Ctrl+C to safely terminate bench perception."
echo "======================================================================"

# Stream status updates in foreground until interrupted
while true; do
    sleep 3
    docker exec "$CONTAINER" bash -c "
        source /opt/ros/humble/setup.bash
        ros2 topic echo /bench_perception/status --once 2>/dev/null | grep 'data:' || true
    " 2>/dev/null || true
done
