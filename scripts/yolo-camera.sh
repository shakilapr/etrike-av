#!/usr/bin/env bash
# ==============================================================================
# yolo-camera.sh — Standalone YOLO26x Live Camera Annotation Viewer
# ==============================================================================
# Displays real-time Kinect v2 RGB camera with YOLO26x bounding boxes,
# class labels, confidence scores, and RTMPose-s skeletal keypoints.
# Zero web dashboard, zero browser overhead. Direct native hardware-accelerated X11.
#
# Usage:
#   bash ~/av_project/scripts/yolo-camera.sh
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
echo " Starting YOLO26x Live Camera Annotation Viewer"
echo " Display : $DISPLAY"
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

# 3. Start Kinect v2 Front Driver if not already running
if ! docker exec "$CONTAINER" pgrep -f "kinect2_node_exec" >/dev/null 2>&1; then
    echo "--> Starting Kinect v2 Front Camera Driver..."
    docker exec -d "$CONTAINER" bash -c "
        source /opt/ros/humble/setup.bash
        source /workspace/autoware/install/setup.bash 2>/dev/null || true
        export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
        export LIBFREENECT2_LOGGER_LEVEL=warning
        ros2 launch etrike_kinect2 single_kinect.launch.py camera:=front > /tmp/kinect_front.log 2>&1
    "
    sleep 3
else
    echo "--> Kinect v2 Front Camera Driver already running."
fi

# 4. Start YOLO26x Perception Node if not already running
if ! docker exec "$CONTAINER" pgrep -f "yolo_perception_node.py" >/dev/null 2>&1; then
    echo "--> Starting YOLO26x + RTMPose-s Perception Node..."
    docker exec -d "$CONTAINER" bash -c "
        source /opt/ros/humble/setup.bash
        source /workspace/autoware/install/setup.bash 2>/dev/null || true
        export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
        ros2 launch etrike_yolo_perception yolo_perception.launch.py publish_mode:=bench auto_start:=true > /tmp/yolo_perception.log 2>&1
    "
    echo "--> Waiting for TensorRT 10.3 engines to deserialize (~4s)..."
    sleep 4
else
    echo "--> YOLO26x Perception Node already running."
fi

# 5. Clean up trap for viewer exit
cleanup() {
    echo ""
    echo "--> Closing YOLO26x Camera Viewer..."
    docker exec "$CONTAINER" pkill -f "yolo_cam_viewer.py" 2>/dev/null || true
    exit 0
}
trap cleanup EXIT INT TERM

# 6. Launch Native Hardware-Accelerated Video Viewer Window on Jetson Display
echo "--> Opening Live Annotated Camera Window on $DISPLAY..."
echo "    [Press 'Q' or 'ESC' in the window or Ctrl+C in terminal to close]"

docker exec -e DISPLAY="$DISPLAY" -e XAUTHORITY="$XAUTHORITY" "$CONTAINER" bash -c '
source /opt/ros/humble/setup.bash
source /workspace/autoware/install/setup.bash 2>/dev/null || true

python3 -u - << "EOF"
import sys
import numpy as np
import cv2
import rclpy
from rclpy.node import Node
from rclpy.qos import qos_profile_sensor_data
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
        self.sub = self.create_subscription(
            Image,
            "/bench_perception/camera/debug_image",
            self.image_cb,
            qos_profile_sensor_data
        )
        self.window_title = "YOLO26x Live Camera Annotations"
        cv2.namedWindow(self.window_title, cv2.WINDOW_NORMAL)
        cv2.resizeWindow(self.window_title, 1280, 720)
        self.get_logger().info("Viewer window ready. Streaming from /bench_perception/camera/debug_image")

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

            cv2.imshow(self.window_title, cv_img)
            key = cv2.waitKey(1) & 0xFF
            if key == ord("q") or key == ord("Q") or key == 27:
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
        cv2.destroyAllWindows()
        node.destroy_node()
        if rclpy.ok():
            rclpy.shutdown()

if __name__ == "__main__":
    main()
EOF
'
