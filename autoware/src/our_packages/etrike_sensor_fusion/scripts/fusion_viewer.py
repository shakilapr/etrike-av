#!/usr/bin/env python3
# Copyright 2026 E-Trike Dev. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Native Hardware-Accelerated X11 Viewer for Isolated Real-Time Fusion."""

from __future__ import annotations

import sys
import time
from typing import Any, Optional

import cv2
import numpy as np

import rclpy
from rclpy.node import Node
from rclpy.qos import QoSDurabilityPolicy, QoSHistoryPolicy, QoSProfile, QoSReliabilityPolicy
from sensor_msgs.msg import Image

try:
    from cv_bridge import CvBridge
    _HAS_BRIDGE = True
except ImportError:
    _HAS_BRIDGE = False


class FusionViewerNode(Node):
    """Direct hardware-accelerated X11 window renderer for the fusion dashboard."""

    def __init__(self) -> None:
        super().__init__("fusion_viewer_node")
        self._bridge = CvBridge() if _HAS_BRIDGE else None
        self._last_img: Optional[np.ndarray] = None
        self._last_rx_time: float = time.time()
        self._has_new_frame: bool = False
        self._stale_drawn: bool = False
        self._window_title = "E-Trike Real-Time Camera + LiDAR Fusion"

        cv2.namedWindow(self._window_title, cv2.WINDOW_NORMAL)
        cv2.resizeWindow(self._window_title, 1440, 540)

        qos = QoSProfile(
            reliability=QoSReliabilityPolicy.BEST_EFFORT,
            durability=QoSDurabilityPolicy.VOLATILE,
            history=QoSHistoryPolicy.KEEP_LAST,
            depth=1,
        )

        self._sub = self.create_subscription(
            Image,
            "/bench_perception/fusion/dashboard",
            self._on_dashboard_image,
            qos
        )

        self.get_logger().info(f"Fusion Viewer initialized. Subscribing to /bench_perception/fusion/dashboard...")

    def _on_dashboard_image(self, msg: Image) -> None:
        try:
            if self._bridge is not None:
                self._last_img = self._bridge.imgmsg_to_cv2(msg, desired_encoding="bgr8")
            else:
                raw = np.frombuffer(msg.data, dtype=np.uint8)
                self._last_img = raw.reshape((msg.height, msg.width, 3))
            self._last_rx_time = time.time()
            self._has_new_frame = True
            self._stale_drawn = False
        except Exception as e:
            self.get_logger().warn(f"Failed to decode dashboard frame: {e}")

    def render_tick(self) -> bool:
        """Render frame to window on new frame arrival or state transition."""
        now = time.time()

        if self._has_new_frame and self._last_img is not None:
            cv2.imshow(self._window_title, self._last_img)
            self._has_new_frame = False
            key = cv2.waitKey(1) & 0xFF
            if key in (27, ord('q'), ord('Q')):
                return False
        elif self._last_img is not None and (now - self._last_rx_time > 5.0):
            if not self._stale_drawn:
                disp = self._last_img.copy()
                cv2.rectangle(disp, (40, 40), (600, 110), (0, 0, 180), -1)
                cv2.putText(disp, "STREAM PAUSED / RECONNECTING...", (60, 85),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.75, (255, 255, 255), 2)
                cv2.imshow(self._window_title, disp)
                self._stale_drawn = True
            key = cv2.waitKey(10) & 0xFF
            if key in (27, ord('q'), ord('Q')):
                return False
        elif self._last_img is None:
            if not hasattr(self, '_splash_drawn') or (now - getattr(self, '_splash_time', 0.0) > 1.0):
                splash = np.zeros((540, 1440, 3), dtype=np.uint8)
                splash[:] = (20, 24, 32)
                cv2.putText(splash, "E-TRIKE CAMERA + LIDAR REAL-TIME FUSION", (120, 220),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.1, (0, 255, 255), 2)
                cv2.putText(splash, "Waiting for /bench_perception/fusion/dashboard stream...", (120, 280),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.75, (180, 180, 180), 2)
                cv2.putText(splash, "Topics: /kinect_front/color/image_raw + /sensing/lidar/top/pointcloud_raw_ex", (120, 330),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.55, (100, 200, 100), 1)
                cv2.imshow(self._window_title, splash)
                self._splash_drawn = True
                self._splash_time = now
            key = cv2.waitKey(10) & 0xFF
            if key in (27, ord('q'), ord('Q')):
                return False
        else:
            key = cv2.waitKey(2) & 0xFF
            if key in (27, ord('q'), ord('Q')):
                return False

        return True


def main(args: Optional[list[str]] = None) -> None:
    rclpy.init(args=args)
    node = FusionViewerNode()

    try:
        while rclpy.ok():
            rclpy.spin_once(node, timeout_sec=0.01)
            if not node.render_tick():
                break
    except (KeyboardInterrupt, rclpy.executors.ExternalShutdownException):
        pass
    finally:
        cv2.destroyAllWindows()
        node.destroy_node()
        rclpy.shutdown()


if __name__ == "__main__":
    main()
