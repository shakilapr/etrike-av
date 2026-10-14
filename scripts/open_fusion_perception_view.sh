#!/usr/bin/env bash
# ==============================================================================
# open_fusion_perception_view.sh — Standalone Multi-Modal Perception Visualizer
# ==============================================================================
# Completely isolated from av-dashboard. Zero browser, zero web servers.
# Displays:
#   - Hesai XT32 3D LiDAR Point Cloud
#   - Camera + LiDAR Multi-Modal Person Detection
#   - 3D Human Meshes & Bounding Boxes at Metric Locations
#   - Live Camera Stream with In-Camera Fusion HUD
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

# 2. Check Hardware Connectivity
CAM_CONNECTED=0
LIDAR_CONNECTED=0

if lsusb 2>/dev/null | grep -qi "045e:02d8"; then
    CAM_CONNECTED=1
fi

if ip link show eno1 2>/dev/null | grep -q "NO-CARRIER"; then
    LIDAR_CONNECTED=0
elif ping -c 1 -W 1 192.168.1.201 >/dev/null 2>&1; then
    LIDAR_CONNECTED=1
fi

echo "======================================================================"
echo " Standalone Perception & 3D Mesh Visualizer"
echo " Hardware: Camera=$([ $CAM_CONNECTED -eq 1 ] && echo 'ONLINE' || echo 'OFFLINE') | LiDAR=$([ $LIDAR_CONNECTED -eq 1 ] && echo 'ONLINE' || echo 'OFFLINE (Synthetic bench)')"
echo " Display:  $DISPLAY"
echo "======================================================================"

# 3. Ensure Docker Container is Running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
        echo "Starting '$CONTAINER' container..."
        docker start "$CONTAINER" >/dev/null
    else
        echo "[ERROR] Docker container '$CONTAINER' not found."
        exit 1
    fi
fi

# 4. Clean up any previous standalone perception instances
docker exec "$CONTAINER" bash -c "
    pkill -f 'fusion_mesh_node.py' 2>/dev/null || true
    pkill -f 'fusion_rviz2' 2>/dev/null || true
" >/dev/null 2>&1 || true

cleanup() {
    echo ""
    echo "Shutting down Standalone Perception View..."
    docker exec "$CONTAINER" bash -c "
        pkill -f 'fusion_mesh_node.py' 2>/dev/null || true
        pkill -f 'fusion_rviz2' 2>/dev/null || true
        pkill -f 'yolo_perception_node' 2>/dev/null || true
        pkill -f 'hesai_bench.launch.py' 2>/dev/null || true
        pkill -f 'hesai_ros_wrapper_node' 2>/dev/null || true
        pkill -f 'hesai_synthetic_publisher' 2>/dev/null || true
        pkill -f 'kinect2_node_exec' 2>/dev/null || true
    " >/dev/null 2>&1 || true
    exit 0
}
trap cleanup EXIT INT TERM

# 5. Start Kinect Camera Driver if camera connected and not already active
if [ "$CAM_CONNECTED" -eq 1 ]; then
    if ! docker exec "$CONTAINER" pgrep -f "kinect2_node_exec" >/dev/null 2>&1; then
        echo "Starting Kinect v2 Front Driver..."
        docker exec -d "$CONTAINER" bash -c "
            source /opt/ros/humble/setup.bash
            source /workspace/autoware/install/setup.bash 2>/dev/null || true
            ros2 launch etrike_kinect2 single_kinect.launch.py camera:=front > /tmp/kinect_standalone.log 2>&1
        "
        sleep 2
    fi
fi

# 6. Start Camera Perception (YOLO-Pose TRT) if not already active
if ! docker exec "$CONTAINER" pgrep -f "yolo_perception_node" >/dev/null 2>&1; then
    echo "Starting YOLO-Pose TRT Perception..."
    docker exec -d "$CONTAINER" bash -c "
        source /opt/ros/humble/setup.bash
        source /workspace/autoware/install/setup.bash 2>/dev/null || true
        ros2 launch etrike_yolo_perception yolo_perception.launch.py publish_mode:=bench auto_start:=true > /tmp/yolo_standalone.log 2>&1
    "
    sleep 2
fi

# 7. Start LiDAR Driver + Clustering if not already active
if ! docker exec "$CONTAINER" pgrep -f "hesai_ros_wrapper_node" >/dev/null 2>&1; then
    echo "Starting Hesai XT32 LiDAR & Clustering Stack..."
    docker exec -d "$CONTAINER" bash -c "
        source /opt/ros/humble/setup.bash
        source /workspace/autoware/install/setup.bash 2>/dev/null || true
        ros2 launch etrike_common_launch hesai_bench.launch.py > /tmp/hesai_standalone.log 2>&1
    "
    if [ "$LIDAR_CONNECTED" -eq 0 ]; then
        echo "  [INFO] Physical LiDAR offline; starting 32-ring synthetic LiDAR stream..."
        docker exec -d "$CONTAINER" bash -c "
            source /opt/ros/humble/setup.bash
            source /workspace/autoware/install/setup.bash 2>/dev/null || true
            python3 /workspace/autoware/src/our_packages/etrike_common_launch/scripts/hesai_synthetic_publisher.py > /tmp/hesai_synthetic.log 2>&1
        "
    fi
    sleep 2
fi

# 8. Launch Multi-Modal Fusion Node + Native OpenGL RViz Window
echo "Launching Multi-Modal Fusion Engine & 3D Visualizer on $DISPLAY..."
docker exec -e DISPLAY="$DISPLAY" -e XAUTHORITY="$XAUTHORITY" "$CONTAINER" bash -c "
    source /opt/ros/humble/setup.bash
    source /workspace/autoware/install/setup.bash 2>/dev/null || true
    ros2 launch etrike_yolo_perception fusion_perception.launch.py use_rviz:=true
"
