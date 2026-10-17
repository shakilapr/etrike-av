#!/usr/bin/env bash
# ==============================================================================
# yolo-camera-gpu.sh — Standalone CUDA-Accelerated YOLO Live Camera Viewer
# ==============================================================================
# - Hardware: Jetson AGX Orin 64GB
# - Kinect v2 Depth: 100% CUDA KDE packet pipeline on GPU cores (<2ms vs 100ms CPU)
# - YOLO Model: Single-stage YOLO26x-pose FP16 TensorRT (~39ms, 25 FPS)
# - Clocks: MAXN mode (nvpmodel -m 0) + jetson_clocks locked
# - Isolation: Publishes strictly to /bench_perception/* (independent of Autoware)
#
# Usage:
#   bash ~/av_project/scripts/yolo-camera-gpu.sh
# ==============================================================================

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
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
echo " Starting Full GPU-Accelerated YOLO26x Live Camera Viewer"
echo " Display : $DISPLAY"
echo "======================================================================"

# 2. Lock Clocks & Max Power Mode (MAXN)
echo "--> Optimizing Jetson hardware power & clocks..."
echo 'med1' | sudo -S nvpmodel -m 0 >/dev/null 2>&1 || true
echo 'med1' | sudo -S jetson_clocks >/dev/null 2>&1 || true

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

# 4. Clean up any stale instances before starting fresh GPU pipeline
echo "--> Cleaning up any stale camera/perception nodes..."
docker exec "$CONTAINER" pkill -9 -f "yolo_cam_viewer" 2>/dev/null || true
docker exec "$CONTAINER" pkill -9 -f "kinect2_node_exec" 2>/dev/null || true
docker exec "$CONTAINER" pkill -9 -f "single_kinect" 2>/dev/null || true
docker exec "$CONTAINER" pkill -9 -f "yolo_perception_node" 2>/dev/null || true
docker exec "$CONTAINER" pkill -9 -f "fusion_mesh_node" 2>/dev/null || true
docker exec "$CONTAINER" pkill -9 -f "static_transform_publisher.*kinect" 2>/dev/null || true
sleep 1

# 5. Ensure Static Transforms for Kinect optical frame
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

# 6. Ensure TensorRT Python and CUDA runtime libraries are available
if ! docker exec "$CONTAINER" python3 -c "import tensorrt" >/dev/null 2>&1; then
    echo "--> Provisioning TensorRT Python runtime inside container..."
    if [ -d "$HOME/packages" ]; then
        docker cp "$HOME/packages/." "$CONTAINER":/tmp/packages/ 2>/dev/null || true
        docker exec "$CONTAINER" bash -c "dpkg -i /tmp/packages/*.deb >/dev/null 2>&1 && ldconfig" || true
    fi
    if [ -f /usr/local/cuda-12.6/targets/aarch64-linux/lib/libcudla.so.1 ]; then
        docker cp -L /usr/local/cuda-12.6/targets/aarch64-linux/lib/libcudla.so.1 "$CONTAINER":/usr/lib/aarch64-linux-gnu/ 2>/dev/null || true
        docker exec "$CONTAINER" ldconfig >/dev/null 2>&1 || true
    fi
fi

# 7. Start Kinect v2 Front Driver with CUDA Acceleration
echo "--> Starting Kinect v2 Front Camera Driver (CUDA KDE Depth Pipeline)..."
docker exec -d "$CONTAINER" bash -c "
    source /opt/ros/humble/setup.bash
    source /workspace/autoware/install/setup.bash 2>/dev/null || true
    export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
    export LIBFREENECT2_LOGGER_LEVEL=warning
    ros2 launch etrike_kinect2 single_kinect.launch.py camera:=front > /tmp/kinect_front.log 2>&1
"
sleep 3

# Verify Kinect enumerated and started streaming
if ! docker exec "$CONTAINER" pgrep -f "kinect2_node_exec" >/dev/null 2>&1; then
    echo "[ERROR] Kinect v2 Driver failed to start. Last log lines:"
    docker exec "$CONTAINER" tail -n 15 /tmp/kinect_front.log 2>/dev/null || true
    exit 1
fi
echo "--> [OK] Kinect v2 running on CUDA depth pipeline."

# 8. Start YOLO26x Perception Node in single-stage pose mode (bypassing redundant RTMPose pass)
echo "--> Starting YOLO26x-Pose Perception Node (GPU TensorRT FP16)..."
docker exec -d "$CONTAINER" bash -c "
    source /opt/ros/humble/setup.bash
    source /workspace/autoware/install/setup.bash 2>/dev/null || true
    export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
    ros2 launch etrike_yolo_perception yolo_perception.launch.py publish_mode:=bench auto_start:=true enable_pose_estimation:=false > /tmp/yolo_perception.log 2>&1
"

echo "--> Waiting for TensorRT engines to load..."
for i in {1..15}; do
    if docker exec "$CONTAINER" pgrep -f "yolo_perception_node.py" >/dev/null 2>&1; then
        break
    fi
    sleep 1
done
sleep 2

if ! docker exec "$CONTAINER" pgrep -f "yolo_perception_node.py" >/dev/null 2>&1; then
    echo "[ERROR] YOLO26x Perception Node failed to start. Last log lines:"
    docker exec "$CONTAINER" tail -n 20 /tmp/yolo_perception.log 2>/dev/null || true
    exit 1
fi
echo "--> [OK] YOLO26x Perception Node active."

# 9. Clean up trap for viewer exit
cleanup() {
    echo ""
    echo "--> Stopping GPU Camera Viewer and Perception Pipeline..."
    docker exec "$CONTAINER" pkill -9 -f "yolo_cam_viewer" 2>/dev/null || true
    docker exec "$CONTAINER" pkill -9 -f "kinect2_node_exec" 2>/dev/null || true
    docker exec "$CONTAINER" pkill -9 -f "single_kinect" 2>/dev/null || true
    docker exec "$CONTAINER" pkill -9 -f "yolo_perception_node" 2>/dev/null || true
    docker exec "$CONTAINER" pkill -9 -f "fusion_mesh_node" 2>/dev/null || true
    docker exec "$CONTAINER" pkill -9 -f "static_transform_publisher.*kinect" 2>/dev/null || true
    pkill -9 -f "yolo_cam_viewer" 2>/dev/null || true
    echo "--> [OK] All perception processes cleanly shut down."
    exit 0
}
trap cleanup EXIT INT TERM HUP

# 10. Deploy Lightweight High-Speed Viewer Script
docker exec "$CONTAINER" bash -c 'cat << "EOF" > /tmp/yolo_cam_viewer.py
import sys
import numpy as np
import cv2
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, QoSReliabilityPolicy, QoSDurabilityPolicy, QoSHistoryPolicy
from sensor_msgs.msg import Image

try:
    from cv_bridge import CvBridge
    has_bridge = True
except ImportError:
    has_bridge = False

class YoloCameraViewer(Node):
    def __init__(self):
        super().__init__("yolo_cam_viewer")
        self.bridge = CvBridge() if has_bridge else None
        self.last_img = None
        self.window_title = "YOLO26x Live GPU Perception (CUDA + TensorRT)"
        cv2.namedWindow(self.window_title, cv2.WINDOW_NORMAL)
        cv2.resizeWindow(self.window_title, 1280, 720)

        qos_realtime = QoSProfile(
            reliability=QoSReliabilityPolicy.BEST_EFFORT,
            durability=QoSDurabilityPolicy.VOLATILE,
            history=QoSHistoryPolicy.KEEP_LAST,
            depth=1,
        )

        self.sub = self.create_subscription(
            Image,
            "/bench_perception/camera/debug_image",
            self.image_cb,
            qos_realtime
        )
        self.splash_timer = self.create_timer(0.5, self.show_splash)
        self.get_logger().info("Viewer window ready. Streaming from /bench_perception/camera/debug_image (zero-lag)")

    def show_splash(self):
        if self.last_img is None:
            splash = np.zeros((720, 1280, 3), dtype=np.uint8)
            cv2.putText(splash, "Connecting to CUDA + TensorRT stream...", (360, 360),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 230, 255), 2)
            cv2.imshow(self.window_title, splash)
            cv2.waitKey(1)

    def image_cb(self, msg):
        try:
            if self.bridge is not None:
                cv_img = self.bridge.imgmsg_to_cv2(msg, desired_encoding="bgr8")
            else:
                cv_img = np.frombuffer(msg.data, dtype=np.uint8).reshape(msg.height, msg.width, -1)
                if cv_img.shape[2] == 4:
                    cv_img = cv2.cvtColor(cv_img, cv2.COLOR_BGRA2BGR)
                elif msg.encoding == "rgb8":
                    cv_img = cv2.cvtColor(cv_img, cv2.COLOR_RGB2BGR)
            self.last_img = cv_img
            cv2.imshow(self.window_title, cv_img)
            key = cv2.waitKey(1) & 0xFF
            if key in (ord("q"), ord("Q"), 27):
                self.get_logger().info("Exit key pressed.")
                rclpy.shutdown()
        except Exception as e:
            self.get_logger().warn(f"Image decode error: {e}")

def main():
    rclpy.init()
    node = YoloCameraViewer()
    try:
        rclpy.spin(node)
    except (KeyboardInterrupt, rclpy.executors.ExternalShutdownException):
        pass
    finally:
        try:
            cv2.destroyAllWindows()
        except Exception:
            pass
        node.destroy_node()
        if rclpy.ok():
            rclpy.shutdown()

if __name__ == "__main__":
    main()
EOF
chmod +x /tmp/yolo_cam_viewer.py
'

# 11. Launch Viewer Window on Jetson Display
echo "--> Opening Live Annotated Camera Window on $DISPLAY..."
echo "    [Press 'Q' or 'ESC' or click [X] on window, or Ctrl+C in terminal to close]"

docker exec -e DISPLAY="$DISPLAY" -e XAUTHORITY="$XAUTHORITY" -e NO_AT_BRIDGE=1 "$CONTAINER" bash -c '
source /opt/ros/humble/setup.bash
source /workspace/autoware/install/setup.bash 2>/dev/null || true
python3 -u /tmp/yolo_cam_viewer.py
'
