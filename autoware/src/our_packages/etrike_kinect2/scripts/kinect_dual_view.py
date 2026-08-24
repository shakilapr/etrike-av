#!/usr/bin/env python3
"""
Kinect v2 viewer with camera switching (OpenCV).

Subscribes to /kinect_front/color/image_raw and /kinect_rear/color/image_raw.
Lets you switch which camera(s) to view:
  - Button bar at the top (click with mouse) OR keys:
      1 = Front only, 2 = Rear only, 0 = Both (side by side)
  - q = quit
Shows "No Kinect connected" if none are streaming.

Usage:
    python3 kinect_dual_view.py
"""
import threading
import time

import cv2
import numpy as np
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy
from sensor_msgs.msg import Image

CAMS = ["front", "rear"]
WINDOW = "Kinect Viewer"
BTN_H = 40  # button bar height


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


def draw_button_bar(frame, mode):
    """Draw a clickable button bar on top. mode in {front, rear, both}."""
    h, w = frame.shape[:2]
    bar = np.full((BTN_H, w, 3), 30, np.uint8)
    labels = [("1: FRONT", 0), ("0: BOTH", w // 3), ("2: REAR", 2 * w // 3)]
    seg = w // 3
    for text, x0 in labels:
        active = (text.endswith("FRONT") and mode == "front") or \
                 (text.endswith("BOTH") and mode == "both") or \
                 (text.endswith("REAR") and mode == "rear")
        color = (0, 200, 0) if active else (90, 90, 90)
        cv2.rectangle(bar, (x0, 0), (x0 + seg, BTN_H), color, 2)
        cv2.putText(bar, text, (x0 + 10, BTN_H - 12),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1, cv2.LINE_AA)
    return np.vstack([bar, frame])


def label_frame(frame, cam, fps):
    h, w = frame.shape[:2]
    cv2.rectangle(frame, (0, 0), (w, 30), (0, 0, 0), -1)
    cv2.putText(
        frame, f"KINECT {cam.upper()}  {fps:.1f} fps",
        (6, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1, cv2.LINE_AA)
    return frame


def main():
    rclpy.init()
    feeds = {cam: CameraFeed(cam, f"/kinect_{cam}/color/image_raw") for cam in CAMS}
    executor = rclpy.executors.MultiThreadedExecutor(num_threads=2)
    for f in feeds.values():
        executor.add_node(f)
    threading.Thread(target=executor.spin, daemon=True).start()

    mode = "both"  # front | rear | both
    print("Kinect viewer: 1=FRONT 2=REAR 0=BOTH q=quit (or click the buttons)")

    def on_mouse(event, x, y, flags, param):
        nonlocal mode
        if event == cv2.EVENT_LBUTTONDOWN and y < BTN_H:
            if x < param["w"] // 3:
                mode = "front"
            elif x < 2 * param["w"] // 3:
                mode = "both"
            else:
                mode = "rear"

    cv2.namedWindow(WINDOW)
    try:
        while True:
            connected = [c for c in CAMS if feeds[c].is_connected()]
            frames = {c: label_frame(feeds[c].latest.copy(), c, feeds[c].fps)
                      for c in connected}

            if not frames:
                blank = np.full((480, 640, 3), 40, np.uint8)
                cv2.putText(blank, "No Kinect connected", (180, 240),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
                view = draw_button_bar(blank, mode)
            else:
                # decide which cameras to show based on mode
                want = [mode] if mode in ("front", "rear") else connected
                want = [c for c in want if c in frames]
                if not want:
                    want = connected[:1]
                if len(want) == 1:
                    view = draw_button_bar(frames[want[0]], mode)
                else:
                    a, b = want[0], want[1]
                    h = max(frames[a].shape[0], frames[b].shape[0])
                    w = frames[a].shape[1] + frames[b].shape[1]
                    canvas = np.zeros((h, w, 3), np.uint8)
                    canvas[:frames[a].shape[0], :frames[a].shape[1]] = frames[a]
                    canvas[:frames[b].shape[0], frames[a].shape[1]:] = frames[b]
                    view = draw_button_bar(canvas, mode)

            cv2.setMouseCallback(WINDOW, on_mouse, {"w": view.shape[1]})
            cv2.imshow(WINDOW, view)

            key = cv2.waitKey(1) & 0xFF
            if key == ord("q"):
                break
            elif key == ord("1"):
                mode = "front"
            elif key == ord("2"):
                mode = "rear"
            elif key == ord("0"):
                mode = "both"
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
