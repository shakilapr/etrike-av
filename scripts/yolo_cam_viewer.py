#!/usr/bin/env python3
"""
Standalone OpenCV X11 Hardware-Accelerated Video Viewer for YOLO26x + RTMPose-s.
Subscribes to /bench_perception/camera/debug_image and displays it in a responsive window.
"""
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
        self.last_img = None
        self.window_title = "YOLO26x Live Camera Annotations"
        cv2.namedWindow(self.window_title, cv2.WINDOW_NORMAL)
        cv2.resizeWindow(self.window_title, 1280, 720)
        self.sub = self.create_subscription(
            Image,
            "/bench_perception/camera/debug_image",
            self.image_cb,
            qos_profile_sensor_data
        )
        self.timer = self.create_timer(0.033, self.render_tick)
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
            self.last_img = cv_img
        except Exception as e:
            self.get_logger().warn(f"Image decode error: {e}")

    def render_tick(self):
        if self.last_img is not None:
            cv2.imshow(self.window_title, self.last_img)
        else:
            splash = np.zeros((720, 1280, 3), dtype=np.uint8)
            cv2.putText(splash, "Connecting to YOLO26x + RTMPose-s stream...", (360, 360),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 230, 255), 2)
            cv2.imshow(self.window_title, splash)

        key = cv2.waitKey(1) & 0xFF
        if key in (ord("q"), ord("Q"), 27):
            self.get_logger().info("Exit key pressed.")
            rclpy.shutdown()

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
