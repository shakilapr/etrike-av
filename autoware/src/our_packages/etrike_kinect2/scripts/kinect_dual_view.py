#!/usr/bin/env python3
"""
Kinect v2 dual-camera viewer (OpenCV).

Subscribes to /kinect_front/color/image_raw and /kinect_rear/color/image_raw.
Shows one window when only one camera is connected, two side-by-side when both.
Overlays FPS per camera. Handles connect/disconnect without crashing.

Usage:
    python3 kinect_dual_view.py [--rgb-only] [--full]
    (--rgb-only / --full select which driver config; the UI is the same)
"""
import argparse
import threading
import time

import cv2
import numpy as np
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy
from sensor_msgs.msg import Image

CAMS = ["front", "rear"]


class CameraFeed(Node):
    def __init__(self, cam, topic):
        super().__init__(f"cam_{cam}")
        self.cam = cam
        self.latest = None
        self.latest_ts = 0.0
        self.fps = 0.0
        self.received = 0
        qos = QoSProfile(
            depth=2,
            reliability=ReliabilityPolicy.BEST_EFFORT,
            durability=DurabilityPolicy.VOLATILE,
        )
        self.sub = self.create_subscription(Image, topic, self.cb, qos)

    def cb(self, msg):
        arr = np.frombuffer(msg.data, dtype=np.uint8).reshape(msg.height, msg.width, -1)
        if msg.encoding == "bgr8":
            self.latest = arr
        elif msg.encoding == "rgb8":
            self.latest = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
        else:
            return
        now = time.time()
        if self.latest_ts:
            dt = now - self.latest_ts
            if dt > 0:
                self.fps = 0.9 * self.fps + 0.1 * (1.0 / dt)
        self.latest_ts = now
        self.received += 1

    def is_connected(self):
        return self.latest is not None and (time.time() - self.latest_ts) < 3.0


def make_label(frame, cam, fps, status="OK"):
    h, w = frame.shape[:2]
    cv2.rectangle(frame, (0, 0), (w, 30), (0, 0, 0), -1)
    cv2.putText(
        frame, f"KINECT {cam.upper()}  {fps:.1f} fps  {status}",
        (6, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1, cv2.LINE_AA)
    return frame


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--rgb-only", action="store_true", help="RGB-only mode note")
    parser.add_argument("--full", action="store_true", help="full (color+depth) mode note")
    args = parser.parse_args()

    rclpy.init()
    feeds = {
        cam: CameraFeed(cam, f"/kinect_{cam}/color/image_raw") for cam in CAMS
    }
    executor = rclpy.executors.MultiThreadedExecutor(num_threads=2)
    for f in feeds.values():
        executor.add_node(f)
    spin = threading.Thread(target=executor.spin, daemon=True)
    spin.start()

    mode = "RGB-only" if args.rgb_only else "FULL"
    print(f"Kinect dual viewer started (mode: {mode})")
    print("Press q to quit")

    try:
        while True:
            connected = [c for c in CAMS if feeds[c].is_connected()]
            frames = {}
            for c in connected:
                f = feeds[c]
                img = f.latest.copy()
                frames[c] = make_label(img, c, f.fps)

            if not frames:
                blank = np.full((480, 640, 3), 40, np.uint8)
                cv2.putText(blank, "No Kinect connected", (180, 240),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
                cv2.imshow("Kinect Viewer", blank)
            elif len(frames) == 1:
                cv2.imshow("Kinect Viewer", next(iter(frames.values())))
            else:
                # both: side by side
                h = max(frames["front"].shape[0], frames["rear"].shape[0])
                w = frames["front"].shape[1] + frames["rear"].shape[1]
                canvas = np.zeros((h, w, 3), np.uint8)
                canvas[:frames["front"].shape[0], :frames["front"].shape[1]] = frames["front"]
                canvas[:frames["rear"].shape[0], frames["front"].shape[1]:] = frames["rear"]
                cv2.imshow("Kinect Viewer", canvas)

            key = cv2.waitKey(1) & 0xFF
            if key == ord("q"):
                break
    except KeyboardInterrupt:
        pass
    finally:
        cv2.destroyAllWindows()
        executor.shutdown()
        for f in feeds.values():
            f.destroy_node()
        rclpy.shutdown()


if __name__ == "__main__":
    main()
