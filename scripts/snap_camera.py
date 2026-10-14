#!/usr/bin/env python3
import sys
import os
import numpy as np
import cv2
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, QoSReliabilityPolicy, QoSDurabilityPolicy, QoSHistoryPolicy
from sensor_msgs.msg import Image

class CameraSnapper(Node):
    def __init__(self, out_path="/workspace/av_project/camera_snap.jpg"):
        super().__init__('camera_snapper')
        self.out_path = out_path
        self.saved = False
        qos = QoSProfile(
            reliability=QoSReliabilityPolicy.BEST_EFFORT,
            durability=QoSDurabilityPolicy.VOLATILE,
            history=QoSHistoryPolicy.KEEP_LAST,
            depth=1
        )
        self.sub = self.create_subscription(
            Image,
            '/kinect_front/color/image_raw',
            self.image_callback,
            qos
        )
        self.get_logger().info(f"Listening for /kinect_front/color/image_raw to save to {self.out_path}...")

    def image_callback(self, msg: Image):
        if self.saved:
            return
        try:
            raw = np.frombuffer(msg.data, dtype=np.uint8)
            channels = 4 if ("8UC4" in msg.encoding or "bgra" in msg.encoding or "rgba" in msg.encoding) else 3
            img = raw.reshape((msg.height, msg.width, channels))
            
            # Convert to standard BGR for OpenCV
            if channels == 4:
                if "rgba" in msg.encoding.lower():
                    bgr = cv2.cvtColor(img, cv2.COLOR_RGBA2BGR)
                else:
                    bgr = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
            elif "rgb" in msg.encoding.lower():
                bgr = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
            else:
                bgr = img

            os.makedirs(os.path.dirname(os.path.abspath(self.out_path)), exist_ok=True)
            cv2.imwrite(self.out_path, bgr)
            self.get_logger().info(f"Successfully saved camera snap ({msg.width}x{msg.height}, {msg.encoding}) -> {self.out_path}")
            self.saved = True
        except Exception as e:
            self.get_logger().error(f"Failed to process and save image: {e}")

def main():
    rclpy.init()
    out_file = sys.argv[1] if len(sys.argv) > 1 else "/workspace/av_project/camera_snap.jpg"
    snapper = CameraSnapper(out_file)
    for _ in range(60):
        rclpy.spin_once(snapper, timeout_sec=0.1)
        if snapper.saved:
            break
    snapper.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
