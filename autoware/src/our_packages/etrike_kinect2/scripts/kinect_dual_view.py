#!/usr/bin/env python3
"""
Kinect v2 viewer with camera switching (OpenCV).

Subscribes to /kinect_front/color/image_raw and /kinect_rear/color/image_raw.
Switch which camera(s) to view:
  - Button bar at the top (click with mouse) OR keyboard keys:
      1 = Front only, 2 = Rear only, 0 = Both (side by side)
      f = toggle fullscreen, q = quit
Each camera that is not connected shows a black panel with a reason
(no USB / driver not running / etc.). The window fits the monitor (DISPLAY=:1).

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
BTN_H = 44


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


def draw_button_bar(frame, mode, enabled_cams):
    """Draw a clickable button bar. mode in {front, rear, both}."""
    h, w = frame.shape[:2]
    bar = np.full((BTN_H, w, 3), 24, np.uint8)
    seg = w // 3
    labels = [("1: FRONT", "front"), ("0: BOTH", "both"), ("2: REAR", "rear")]
    for i, (text, m) in enumerate(labels):
        x0 = i * seg
        active = (mode == m)
        border = (0, 200, 0) if active else (70, 70, 70)
        cv2.rectangle(bar, (x0, 2), (x0 + seg - 2, BTN_H - 2), border, 2)
        cv2.putText(bar, text, (x0 + 12, BTN_H - 13),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1, cv2.LINE_AA)
    cv2.putText(bar, "connected: " + (",".join(enabled_cams) or "none"),
                (w - 210, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (150, 150, 150), 1,
                cv2.LINE_AA)
    return np.vstack([bar, frame])


def label_frame(frame, cam, fps):
    h, w = frame.shape[:2]
    cv2.rectangle(frame, (0, 0), (w, 28), (0, 0, 0), -1)
    cv2.putText(frame, f"KINECT {cam.upper()}  {fps:.1f} fps",
                (6, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1, cv2.LINE_AA)
    return frame


def error_panel(cam, w=1280, h=720):
    """Black panel explaining why a camera is not showing."""
    panel = np.zeros((h, w, 3), np.uint8)
    cv2.putText(panel, f"KINECT {cam.upper()} - NOT CONNECTED",
                (w // 2 - 260, h // 2 - 40), cv2.FONT_HERSHEY_SIMPLEX, 0.9,
                (0, 0, 255), 2, cv2.LINE_AA)
    cv2.putText(panel, "Camera is not publishing", (w // 2 - 180, h // 2 + 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1, cv2.LINE_AA)
    cv2.putText(panel, "Check USB connection / launch the driver:", (w // 2 - 220, h // 2 + 45),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (180, 180, 180), 1, cv2.LINE_AA)
    cv2.putText(panel, f"  ros2 launch etrike_kinect2 single_kinect.launch.py camera:={cam}",
                (w // 2 - 260, h // 2 + 75), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                (140, 140, 255), 1, cv2.LINE_AA)
    return panel


def main():
    rclpy.init()
    feeds = {cam: CameraFeed(cam, f"/kinect_{cam}/color/image_raw") for cam in CAMS}
    executor = rclpy.executors.MultiThreadedExecutor(num_threads=2)
    for f in feeds.values():
        executor.add_node(f)
    threading.Thread(target=executor.spin, daemon=True).start()

    state = {"mode": "both", "fullscreen": False}
    btn_h_actual = BTN_H
    STATUS_FILE = "/tmp/kinect_view_status.txt"

    def log_mode():
        with open(STATUS_FILE, "w") as f:
            f.write(f"mode={state['mode']} t={time.time():.1f}\n")
        print(f"[view] mode -> {state['mode']}", flush=True)

    # Determine the display size so the window fits the monitor.
    screen_w, screen_h = 1366, 768
    try:
        import subprocess
        out = subprocess.check_output(["xdpyinfo", "-display", ":1"]).decode()
        for line in out.splitlines():
            if line.strip().startswith("dimensions:"):
                parts = line.split()[1].split("x")
                screen_w, screen_h = int(parts[0]), int(parts[1])
                break
    except Exception:
        pass
    print(f"Display: {screen_w}x{screen_h}")

    def fit_to_screen(frame):
        nonlocal btn_h_actual
        h, w = frame.shape[:2]
        scale = min(screen_w / w, (screen_h) / h)
        if scale < 1.0:
            new_w, new_h = int(w * scale), int(h * scale)
            frame = cv2.resize(frame, (new_w, new_h), interpolation=cv2.INTER_AREA)
            btn_h_actual = max(1, int(BTN_H * scale))
        else:
            btn_h_actual = BTN_H
        return frame

    def on_mouse(event, x, y, flags, param):
        if event == cv2.EVENT_LBUTTONDOWN and y < btn_h_actual:
            w = param["holder"]["w"]
            if x < w // 3:
                state["mode"] = "front"
            elif x < 2 * w // 3:
                state["mode"] = "both"
            else:
                state["mode"] = "rear"
            log_mode()

    cv2.namedWindow(WINDOW, cv2.WINDOW_NORMAL)
    cv2.resizeWindow(WINDOW, screen_w, screen_h)
    holder = {"w": screen_w}
    cv2.setMouseCallback(WINDOW, on_mouse, {"holder": holder})

    try:
        while True:
            connected = [c for c in CAMS if feeds[c].is_connected()]
            mode = state["mode"]

            # build per-camera panels (real frame or black error panel)
            panels = {}
            for c in CAMS:
                if c in connected:
                    panels[c] = label_frame(feeds[c].latest.copy(), c, feeds[c].fps)
                else:
                    panels[c] = error_panel(c)

            # compose based on mode
            if mode in ("front", "rear"):
                view = panels[mode]
            else:  # both side by side
                a, b = "front", "rear"
                h = max(panels[a].shape[0], panels[b].shape[0])
                w = panels[a].shape[1] + panels[b].shape[1]
                canvas = np.zeros((h, w, 3), np.uint8)
                canvas[:panels[a].shape[0], :panels[a].shape[1]] = panels[a]
                canvas[:panels[b].shape[0], panels[a].shape[1]:] = panels[b]
                view = canvas

            view = draw_button_bar(view, mode, connected)
            view = fit_to_screen(view)
            holder["w"] = view.shape[1]
            cv2.imshow(WINDOW, view)

            key = cv2.waitKey(5) & 0xFF
            if key == ord("q"):
                break
            elif key == ord("1"):
                state["mode"] = "front"
                log_mode()
            elif key == ord("2"):
                state["mode"] = "rear"
                log_mode()
            elif key == ord("0"):
                state["mode"] = "both"
                log_mode()
            elif key == ord("f"):
                state["fullscreen"] = not state["fullscreen"]
                if state["fullscreen"]:
                    cv2.setWindowProperty(WINDOW, cv2.WND_PROP_FULLSCREEN,
                                          cv2.WINDOW_FULLSCREEN)
                else:
                    cv2.setWindowProperty(WINDOW, cv2.WND_PROP_FULLSCREEN,
                                          cv2.WINDOW_NORMAL)
                    cv2.resizeWindow(WINDOW, screen_w, screen_h)
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
