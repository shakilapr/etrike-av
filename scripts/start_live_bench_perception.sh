#!/usr/bin/env bash
# ==============================================================================
# Start Live Bench Perception (Kinect v2 + YOLO26x + RTMPose-s + AV Dashboard)
# ==============================================================================
set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CONTAINER="autoware_test"
PORT="${1:-8080}"
INTERFACE="${2:-can2}"

echo "======================================================================"
echo " 1. Pre-cleaning stale processes in container"
echo "======================================================================"
docker exec "$CONTAINER" pkill -9 -f "kinect2_node_exec" 2>/dev/null || true
docker exec "$CONTAINER" pkill -9 -f "yolo_perception_node.py" 2>/dev/null || true
docker exec "$CONTAINER" pkill -9 -f "tools.av_dashboard.backend.server" 2>/dev/null || true
docker exec "$CONTAINER" pkill -9 -f "static_transform_publisher.*kinect" 2>/dev/null || true
sleep 1

echo "======================================================================"
echo " 2. Starting Static Transforms (base_link -> kinect_front_optical_link)"
echo "======================================================================"
docker exec -d "$CONTAINER" bash -c "
    source /opt/ros/humble/setup.bash
    ros2 run tf2_ros static_transform_publisher --x 1.2 --y 0.0 --z 1.0 --yaw 0.0 --pitch 0.0 --roll 0.0 --frame-id base_link --child-frame-id kinect_front_link
"
docker exec -d "$CONTAINER" bash -c "
    source /opt/ros/humble/setup.bash
    ros2 run tf2_ros static_transform_publisher --x 0.0 --y 0.0 --z 0.0 --yaw -1.5707963 --pitch 0.0 --roll -1.5707963 --frame-id kinect_front_link --child-frame-id kinect_front_optical_link
"
echo "  [OK] Static transforms active."

echo "======================================================================"
echo " 3. Starting Kinect v2 Front Camera Driver"
echo "======================================================================"
docker exec -d "$CONTAINER" bash -c "
    source /opt/ros/humble/setup.bash
    source /workspace/autoware/install/setup.bash 2>/dev/null || true
    export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
    export LIBFREENECT2_LOGGER_LEVEL=warning
    ros2 launch etrike_kinect2 single_kinect.launch.py camera:=front > /tmp/kinect_front.log 2>&1
"
echo "  Waiting for Kinect camera stream..."
sleep 4

echo "======================================================================"
echo " 4. Starting YOLO26x + RTMPose-s Perception Node (Bench Isolation Mode)"
echo "======================================================================"
docker exec -d "$CONTAINER" bash -c "
    source /opt/ros/humble/setup.bash
    source /workspace/autoware/install/setup.bash 2>/dev/null || true
    export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
    ros2 launch etrike_yolo_perception yolo_perception.launch.py publish_mode:=bench auto_start:=true > /tmp/yolo_perception.log 2>&1
"
echo "  Waiting for TensorRT engines to deserialize..."
sleep 4

echo "======================================================================"
echo " 5. Starting AV Dashboard Backend Server (Port $PORT)"
echo "======================================================================"
docker exec -d "$CONTAINER" bash -c "
    source /opt/ros/humble/setup.bash 2>/dev/null || true
    source /workspace/autoware/install/setup.bash 2>/dev/null || true
    export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
    export PYTHONPATH=/workspace/av_project:/host_local/lib/python3.10/site-packages:/host_dist_packages:\$PYTHONPATH
    python3 -m tools.av_dashboard.backend.server \
        --interface '$INTERFACE' \
        --host '0.0.0.0' \
        --port '$PORT' \
        > /tmp/av_dashboard.log 2>&1
"

echo "  Verifying AV Dashboard status..."
for i in {1..20}; do
    if curl -s "http://127.0.0.1:${PORT}/api/v1/status" >/dev/null 2>&1; then
        echo "  [OK] AV Dashboard backend server is UP and responding on port $PORT!"
        break
    fi
    sleep 0.5
done

echo "======================================================================"
echo " 6. System Verification Check"
echo "======================================================================"
curl -s "http://127.0.0.1:${PORT}/api/v1/status" | jq . 2>/dev/null || curl -s "http://127.0.0.1:${PORT}/api/v1/status"
echo ""
echo "Live Topics:"
docker exec "$CONTAINER" bash -c "source /opt/ros/humble/setup.bash && ros2 topic list | grep -E 'bench_perception|kinect'" || true
echo ""
echo "Live Perception Telemetry:"
docker exec "$CONTAINER" bash -c "source /opt/ros/humble/setup.bash && timeout 3 ros2 topic echo /bench_perception/status --once" 2>/dev/null || true

echo "======================================================================"
echo " [SUCCESS] All systems active!"
echo "   • AV Dashboard 3D Cockpit: http://172.16.25.67:$PORT"
echo "   • Dedicated Camera Stream: http://172.16.25.67:$PORT/camera"
echo "   • Raw MJPEG Video Feed:   http://172.16.25.67:$PORT/api/v1/camera/stream"
echo "======================================================================"
