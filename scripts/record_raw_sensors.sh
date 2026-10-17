#!/usr/bin/env bash
# ==============================================================================
# Record Raw Sensors (record_raw_sensors.sh)
# ==============================================================================
# Records raw 3D LiDAR (Hesai XT32M2X) and Camera (Kinect v2 RGB-D) streams
# on-demand into an MCAP ROS 2 bag for offline experiments and dataset capture.
#
# Topics recorded by default:
#   - LiDAR:  /sensing/lidar/top/pointcloud_raw_ex
#   - Camera: /kinect_front/color/image_raw
#   - Camera: /kinect_front/depth/image_raw
#   - Camera: /kinect_front/color/camera_info
#   - Camera: /kinect_front/depth/camera_info
#   - TFs:    /tf, /tf_static
#
# Usage:
#   bash scripts/record_raw_sensors.sh                    # Record 30 seconds (default)
#   bash scripts/record_raw_sensors.sh --duration 15      # Record 15 seconds
#   bash scripts/record_raw_sensors.sh -d 60 -o test_run  # Record 60s to custom name
#   bash scripts/record_raw_sensors.sh --with-perception  # Include perception debug topics
# ==============================================================================

set -eo pipefail

DURATION=30
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BAG_NAME="raw_sensors_${TIMESTAMP}"
CONTAINER="autoware_test"
WITH_PERCEPTION=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        -d|--duration)
            DURATION="$2"
            shift 2
            ;;
        -o|--output-name)
            BAG_NAME="$2"
            shift 2
            ;;
        --with-perception)
            WITH_PERCEPTION=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [-d|--duration SECONDS] [-o|--output-name NAME] [--with-perception]"
            echo ""
            echo "Options:"
            echo "  -d, --duration SECS   Duration in seconds to record (default: 30)"
            echo "  -o, --output-name STR Custom subfolder name inside data/recordings/"
            echo "  --with-perception     Include /bench_perception/objects and debug_image"
            echo "  -h, --help            Show this help"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
if [ ! -d "$WORKSPACE_ROOT/scripts" ] && [ -d "$HOME/av_project/scripts" ]; then
    WORKSPACE_ROOT="$HOME/av_project"
fi

HOST_SAVE_DIR="$WORKSPACE_ROOT/data/recordings"
mkdir -p "$HOST_SAVE_DIR"
HOST_BAG_PATH="$HOST_SAVE_DIR/$BAG_NAME"
CONTAINER_BAG_PATH="/workspace/data/recordings/$BAG_NAME"

echo "======================================================================"
echo " [RECORD] On-Demand Raw Sensor Capture (${DURATION}s)"
echo "======================================================================"
echo "  Bag Name:       $BAG_NAME"
echo "  Target Host:    $(hostname) ($WORKSPACE_ROOT)"
echo "  Duration:       ${DURATION} seconds"
echo "  Format:         MCAP (Zstandard compressed)"
echo "======================================================================"

# Determine execution environment (Host vs inside Docker)
IN_CONTAINER=false
if [ -f "/.dockerenv" ] || [ -d "/workspace/av_project" -a ! -d "/home/med1" ]; then
    IN_CONTAINER=true
fi

TOPICS=(
    "/sensing/lidar/top/pointcloud_raw_ex"
    "/kinect_front/color/image_raw"
    "/kinect_front/depth/image_raw"
    "/kinect_front/color/camera_info"
    "/kinect_front/depth/camera_info"
    "/tf"
    "/tf_static"
)

if [ "$WITH_PERCEPTION" = "true" ]; then
    TOPICS+=(
        "/bench_perception/objects"
        "/bench_perception/camera/debug_image"
        "/bench_perception/status"
    )
fi

echo "--> Recording topics:"
for t in "${TOPICS[@]}"; do
    echo "    • $t"
done
echo ""

if [ "$IN_CONTAINER" = "true" ]; then
    source /opt/ros/humble/setup.bash
    source /opt/autoware/setup.bash 2>/dev/null || true
    source /workspace/autoware/install/setup.bash 2>/dev/null || true

    echo "--> Checking available topics in container..."
    ACTIVE_TOPICS="$(ros2 topic list 2>/dev/null || true)"
    if ! echo "$ACTIVE_TOPICS" | grep -q "/sensing/lidar/top/pointcloud_raw_ex"; then
        echo "  [WARN] /sensing/lidar/top/pointcloud_raw_ex not active."
        echo "         Start sensors first: bash scripts/open-etrike.sh --hybrid-bench"
    fi
    if ! echo "$ACTIVE_TOPICS" | grep -q "/kinect_front/color/image_raw"; then
        echo "  [WARN] /kinect_front/color/image_raw not active."
        echo "         Start camera first:  bash scripts/yolo-camera.sh"
    fi

    echo "--> Starting ros2 bag recording for ${DURATION}s..."
    mkdir -p "/workspace/data/recordings"
    
    # Run ros2 bag record with timeout --signal=SIGINT for clean bag finalization
    timeout --signal=SIGINT "${DURATION}" ros2 bag record \
        --storage mcap \
        --compression-mode file \
        --compression-format zstd \
        --output "${CONTAINER_BAG_PATH}" \
        "${TOPICS[@]}" || true

else
    # Running from Jetson host: check container
    if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
        echo "[ERROR] Docker container '$CONTAINER' is not running."
        echo "Please launch container or stack first:"
        echo "  bash scripts/open-etrike.sh --hybrid-bench"
        exit 1
    fi

    echo "--> Pre-flight topic check inside $CONTAINER..."
    ACTIVE_TOPICS="$(docker exec "$CONTAINER" bash -c "source /opt/ros/humble/setup.bash && ros2 topic list 2>/dev/null" || true)"
    
    HAS_LIDAR=false
    HAS_CAM=false
    if echo "$ACTIVE_TOPICS" | grep -q "/sensing/lidar/top/pointcloud_raw_ex"; then
        echo "  [OK] Hesai XT32M2X LiDAR stream detected."
        HAS_LIDAR=true
    else
        echo "  [WARN] LiDAR topic '/sensing/lidar/top/pointcloud_raw_ex' is NOT currently publishing."
    fi

    if echo "$ACTIVE_TOPICS" | grep -q "/kinect_front/color/image_raw"; then
        echo "  [OK] Kinect v2 Camera stream detected."
        HAS_CAM=true
    else
        echo "  [WARN] Camera topic '/kinect_front/color/image_raw' is NOT currently publishing."
    fi

    if [ "$HAS_LIDAR" = "false" ] && [ "$HAS_CAM" = "false" ]; then
        echo ""
        echo "  [NOTE] Neither raw LiDAR nor Camera is active."
        echo "  To launch both on bench: bash scripts/open-etrike.sh --hybrid-bench"
        echo "  To launch camera only:   bash scripts/yolo-camera.sh"
        echo "  Continuing recording in case topics start during the window..."
        echo ""
    fi

    echo "--> Initiating recording inside container ($DURATION seconds)..."
    TOPIC_STR="${TOPICS[*]}"

    docker exec "$CONTAINER" bash -c "
        source /opt/ros/humble/setup.bash
        source /opt/autoware/setup.bash 2>/dev/null || true
        source /workspace/autoware/install/setup.bash 2>/dev/null || true
        export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
        mkdir -p /workspace/data/recordings

        timeout --signal=SIGINT ${DURATION} ros2 bag record \
            --storage mcap \
            --compression-mode file \
            --compression-format zstd \
            --output '${CONTAINER_BAG_PATH}' \
            ${TOPIC_STR} || true
    "
fi

echo ""
echo "======================================================================"
echo " [FINISHED] 30s Sensor Capture Complete!"
echo "======================================================================"
if [ -d "$HOST_BAG_PATH" ]; then
    BAG_SIZE="$(du -sh "$HOST_BAG_PATH" | cut -f1)"
    echo "  Location (Host): $HOST_BAG_PATH"
    echo "  Total Size:      $BAG_SIZE"
    echo "  Files:"
    ls -lh "$HOST_BAG_PATH"
    echo ""
    echo "RECORDING_PATH=$HOST_BAG_PATH"
    echo "RECORDING_NAME=$BAG_NAME"
    echo "RECORDING_SIZE=$BAG_SIZE"
else
    echo "  [WARN] Bag directory $HOST_BAG_PATH was not found on host."
fi
echo "======================================================================"
