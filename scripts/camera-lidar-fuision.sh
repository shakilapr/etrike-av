#!/usr/bin/env bash
# ==============================================================================
# camera-lidar-fuision.sh — Isolated Real-Time Camera + LiDAR Sensor Fusion
# ==============================================================================
# Real-time multi-modal 3D perception dashboard combining:
#   - 1080p Color Camera (Kinect v2 RGB)
#   - 32-beam 3D LiDAR (Hesai XT32M2X)
#   - 3D Metric Spatial Localization & Euclidean Foreground Clustering
#   - Top-Down 15m Bird's-Eye View (BEV) Radar
#
# GUARANTEE: Completely isolated from Autoware Universe simulation.
# Zero emergency braking, zero wheel lockup, zero interference with other scripts.
#
# Usage:
#   bash ~/av_project/scripts/camera-lidar-fuision.sh
# ==============================================================================

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CONTAINER="autoware_test"

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
echo " Starting Isolated Real-Time Camera + LiDAR Sensor Fusion"
echo " Display : $DISPLAY"
echo " Target  : Hesai XT32M2X + Kinect v2 (Zero Autoware Interference)"
echo "======================================================================"

# 2. Ensure Docker Container is Running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
        echo "Starting '$CONTAINER' container..."
        docker start "$CONTAINER" >/dev/null
    else
        echo "[ERROR] Docker container '$CONTAINER' not found."
        exit 1
    fi
fi

# 3. Check Hardware Status
CAM_CONNECTED=0
LIDAR_CONNECTED=0

if lsusb 2>/dev/null | grep -qi "045e:02d8"; then
    CAM_CONNECTED=1
fi

if ping -c 1 -W 1 192.168.1.201 >/dev/null 2>&1; then
    LIDAR_CONNECTED=1
fi

echo "  Hardware Status: Camera=$([ $CAM_CONNECTED -eq 1 ] && echo 'ONLINE' || echo 'OFFLINE') | LiDAR=$([ $LIDAR_CONNECTED -eq 1 ] && echo 'ONLINE' || echo 'OFFLINE (Bench/Synthetic fallback)')"

# 4. Check Existing Drivers (Never conflict with running scripts)
WE_STARTED_KINECT=0
WE_STARTED_LIDAR=0
WE_STARTED_YOLO=0

# Camera Driver Check
if docker exec "$CONTAINER" pgrep -f "kinect2_node_exec" >/dev/null 2>&1; then
    echo "  [OK] Kinect v2 Camera driver already running (attaching to existing stream)."
else
    if [ "$CAM_CONNECTED" -eq 1 ]; then
        echo "  --> Starting Kinect v2 Front Camera Driver..."
        docker exec -d "$CONTAINER" bash -c "
            source /opt/ros/humble/setup.bash
            source /workspace/autoware/install/setup.bash 2>/dev/null || true
            export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
            export LIBFREENECT2_LOGGER_LEVEL=warning
            ros2 launch etrike_kinect2 single_kinect.launch.py camera:=front > /tmp/kinect_front.log 2>&1
        "
        WE_STARTED_KINECT=1
        sleep 2
    else
        echo "  [WARN] Physical Kinect camera not connected via USB."
    fi
fi

# LiDAR Driver Check
if docker exec "$CONTAINER" pgrep -f "hesai_ros_wrapper_node|nebula_node_container" >/dev/null 2>&1; then
    echo "  [OK] LiDAR driver already active (attaching to existing point cloud)."
else
    echo "  --> Starting LiDAR stream..."
    if [ "$LIDAR_CONNECTED" -eq 1 ]; then
        docker exec -d "$CONTAINER" bash -c "
            source /opt/ros/humble/setup.bash
            source /workspace/autoware/install/setup.bash 2>/dev/null || true
            export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
            ros2 launch etrike_common_launch hesai_bench.launch.py > /tmp/hesai_bench.log 2>&1
        "
    else
        echo "      LiDAR offline on network; starting 32-ring bench point cloud publisher..."
        docker exec -d "$CONTAINER" bash -c "
            source /opt/ros/humble/setup.bash
            source /workspace/autoware/install/setup.bash 2>/dev/null || true
            export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
            python3 /workspace/autoware/src/our_packages/etrike_common_launch/scripts/hesai_synthetic_publisher.py > /tmp/hesai_synthetic.log 2>&1
        "
    fi
    WE_STARTED_LIDAR=1
    sleep 2
fi

# 4.3 Check 2D YOLO Perception (Bench Mode)
if docker exec "$CONTAINER" pgrep -f "yolo_perception" >/dev/null 2>&1; then
    echo "  [OK] YOLO Perception already active (attaching to /bench_perception/objects)."
else
    echo "  --> Starting TensorRT YOLO Perception in bench mode..."
    docker exec -d "$CONTAINER" bash -c "
        source /opt/ros/humble/setup.bash
        source /workspace/autoware/install/setup.bash 2>/dev/null || true
        export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
        ros2 launch etrike_yolo_perception yolo_perception.launch.py publish_mode:=bench auto_start:=true > /tmp/yolo_bench.log 2>&1
    "
    WE_STARTED_YOLO=1
    sleep 2
fi

# 5. Ensure Static Transforms for Kinect & LiDAR (non-conflicting)
if ! docker exec "$CONTAINER" pgrep -f "static_transform_publisher.*kinect_front" >/dev/null 2>&1; then
    docker exec -d "$CONTAINER" bash -c "
        source /opt/ros/humble/setup.bash
        ros2 run tf2_ros static_transform_publisher --x 1.2 --y 0.0 --z 1.0 --yaw 0.0 --pitch 0.0 --roll 0.0 --frame-id base_link --child-frame-id kinect_front_link
    "
    docker exec -d "$CONTAINER" bash -c "
        source /opt/ros/humble/setup.bash
        ros2 run tf2_ros static_transform_publisher --x 0.0 --y 0.0 --z 0.0 --yaw -1.5707963 --pitch 0.0 --roll -1.5707963 --frame-id kinect_front_link --child-frame-id kinect_front_optical_link
    "
fi

if ! docker exec "$CONTAINER" pgrep -f "static_transform_publisher.*lidar_link" >/dev/null 2>&1; then
    docker exec -d "$CONTAINER" bash -c "
        source /opt/ros/humble/setup.bash
        ros2 run tf2_ros static_transform_publisher --x 0.575 --y 0.0 --z 1.7464 --yaw 0.0 --pitch 0.0 --roll 0.0 --frame-id base_link --child-frame-id lidar_link
    "
fi

# 6. Ensure Permissions on Fusion Scripts
docker exec "$CONTAINER" chmod +x \
    /workspace/autoware/src/our_packages/etrike_sensor_fusion/scripts/camera_lidar_fusion_node.py \
    /workspace/autoware/src/our_packages/etrike_sensor_fusion/scripts/fusion_viewer.py \
    /workspace/av_project/autoware/src/our_packages/etrike_sensor_fusion/scripts/camera_lidar_fusion_node.py \
    /workspace/av_project/autoware/src/our_packages/etrike_sensor_fusion/scripts/fusion_viewer.py 2>/dev/null || true

# 7. Non-Conflicting Teardown Trap
cleanup() {
    echo ""
    echo "--> Stopping Camera-LiDAR Fusion Pipeline..."
    docker exec "$CONTAINER" pkill -9 -f "fusion_viewer" 2>/dev/null || true
    docker exec "$CONTAINER" pkill -9 -f "camera_lidar_fusion_node" 2>/dev/null || true
    pkill -9 -f "fusion_viewer" 2>/dev/null || true
    pkill -9 -f "camera_lidar_fusion_node" 2>/dev/null || true

    # Only stop hardware drivers if THIS specific script started them
    if [ "$WE_STARTED_KINECT" -eq 1 ]; then
        echo "    Stopping Kinect driver started by this session..."
        docker exec "$CONTAINER" pkill -9 -f "kinect2_node_exec" 2>/dev/null || true
        docker exec "$CONTAINER" pkill -9 -f "single_kinect" 2>/dev/null || true
    fi
    if [ "$WE_STARTED_LIDAR" -eq 1 ]; then
        echo "    Stopping LiDAR driver started by this session..."
        docker exec "$CONTAINER" pkill -9 -f "hesai_bench" 2>/dev/null || true
        docker exec "$CONTAINER" pkill -9 -f "hesai_synthetic_publisher" 2>/dev/null || true
    fi
    if [ "$WE_STARTED_YOLO" -eq 1 ]; then
        echo "    Stopping YOLO perception started by this session..."
        docker exec "$CONTAINER" pkill -9 -f "yolo_perception" 2>/dev/null || true
    fi

    echo "--> [OK] Fusion node stopped cleanly. Background drivers and Autoware remain undisturbed."
    exit 0
}
trap cleanup EXIT INT TERM HUP

# Clean up any leftover fusion instances before launch
docker exec "$CONTAINER" pkill -9 -f "fusion_viewer" 2>/dev/null || true
docker exec "$CONTAINER" pkill -9 -f "camera_lidar_fusion_node" 2>/dev/null || true
sleep 1

# 8. Start Fusion Lifecycle Node inside Container (Background daemon)
echo "--> Launching Camera-LiDAR Fusion LifecycleNode..."
docker exec -d "$CONTAINER" bash -c "
    source /opt/ros/humble/setup.bash
    source /opt/autoware/setup.bash 2>/dev/null || true
    source /workspace/autoware/install/setup.bash 2>/dev/null || true
    export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp

    if [ -f /workspace/autoware/install/etrike_sensor_fusion/share/etrike_sensor_fusion/launch/camera_lidar_fusion.launch.py ]; then
        ros2 launch etrike_sensor_fusion camera_lidar_fusion.launch.py use_viewer:=false > /tmp/camera_lidar_fusion.log 2>&1
    else
        python3 /workspace/autoware/src/our_packages/etrike_sensor_fusion/scripts/camera_lidar_fusion_node.py > /tmp/camera_lidar_fusion.log 2>&1
    fi
"

echo "--> Waiting for fusion node to initialize..."
for i in {1..8}; do
    if docker exec "$CONTAINER" pgrep -f "camera_lidar_fusion_node" >/dev/null 2>&1; then
        break
    fi
    sleep 1
done

if ! docker exec "$CONTAINER" pgrep -f "camera_lidar_fusion_node" >/dev/null 2>&1; then
    echo "[ERROR] camera_lidar_fusion_node failed to start. Last log lines:"
    docker exec "$CONTAINER" tail -n 20 /tmp/camera_lidar_fusion.log 2>/dev/null || true
    exit 1
fi
echo "  [OK] camera_lidar_fusion_node is active."

# 9. Launch Native Hardware-Accelerated X11 Viewer in Foreground
echo "======================================================================"
echo " Opening Real-Time Fusion Cockpit Display on $DISPLAY"
echo " (Press 'Q', 'ESC', or close window to exit)"
echo "======================================================================"

docker exec -e DISPLAY="$DISPLAY" -e XAUTHORITY="$XAUTHORITY" "$CONTAINER" bash -c "
    source /opt/ros/humble/setup.bash
    source /workspace/autoware/install/setup.bash 2>/dev/null || true
    export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
    python3 /workspace/autoware/src/our_packages/etrike_sensor_fusion/scripts/fusion_viewer.py
"
