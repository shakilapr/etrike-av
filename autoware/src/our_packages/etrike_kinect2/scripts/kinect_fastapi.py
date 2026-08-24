#!/usr/bin/env python3
"""
Kinect v2 FastAPI web viewer.

Serves live MJPEG streams of the Kinect color topics plus an API to switch
which camera(s) to view. Access the web UI in a browser:

    http://<jetson-ip>:8000/

Endpoints:
    GET  /                HTML control page
    GET  /stream          MJPEG stream (uses the selected camera(s))
    GET  /api/cameras     list connected cameras
    GET  /api/mode        current mode (front/rear/both)
    POST /api/mode        {"mode": "front"|"rear"|"both"}  -> switch camera
    POST /api/capture     save a snapshot -> {file}

Run (in the container):
    python3 kinect_fastapi.py [--port 8000]
"""
import argparse
import time

import cv2
import numpy as np
import rclpy
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, HTMLResponse, JSONResponse
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy
from sensor_msgs.msg import Image
import uvicorn

CAMS = ["front", "rear"]


class CameraFeed(Node):
    def __init__(self, cam, topic):
        super().__init__(f"web_cam_{cam}")
        self.cam = cam
        self.latest = None
        self.latest_ts = 0.0
        self.fps = 0.0
        qos = QoSProfile(
            depth=2, reliability=ReliabilityPolicy.BEST_EFFORT,
            durability=DurabilityPolicy.VOLATILE)
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

    def is_connected(self):
        return self.latest is not None and (time.time() - self.latest_ts) < 3.0

    def frame_bgr(self):
        return self.latest.copy() if self.latest is not None else None


def label(frame, cam, fps):
    h, w = frame.shape[:2]
    cv2.rectangle(frame, (0, 0), (w, 28), (0, 0, 0), -1)
    cv2.putText(frame, f"KINECT {cam.upper()} {fps:.1f} fps",
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
    cv2.putText(panel, "Check USB / launch the driver:", (w // 2 - 180, h // 2 + 45),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (180, 180, 180), 1, cv2.LINE_AA)
    cv2.putText(panel, f"camera:={cam}", (w // 2 - 100, h // 2 + 75),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (140, 140, 255), 1, cv2.LINE_AA)
    return panel


def compose(feeds, mode):
    """Build the current view (front/rear/both) as a BGR frame.

    A camera that is requested but not publishing gets a black error panel.
    """
    connected = [c for c in CAMS if feeds[c].is_connected()]
    panels = {}
    for c in CAMS:
        if feeds[c].is_connected():
            panels[c] = label(feeds[c].frame_bgr(), c, feeds[c].fps)
        else:
            panels[c] = error_panel(c)
    if mode in ("front", "rear"):
        return panels[mode]
    # both: side by side (each shows live feed or error panel)
    a, b = "front", "rear"
    h = max(panels[a].shape[0], panels[b].shape[0])
    w = panels[a].shape[1] + panels[b].shape[1]
    canvas = np.zeros((h, w, 3), np.uint8)
    canvas[:panels[a].shape[0], :panels[a].shape[1]] = panels[a]
    canvas[:panels[b].shape[0], panels[a].shape[1]:] = panels[b]
    return canvas


def mjpeg_encode(frame, quality=70):
    ok, buf = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, quality])
    return buf.tobytes() if ok else b""


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()

    rclpy.init()
    feeds = {cam: CameraFeed(cam, f"/kinect_{cam}/color/image_raw") for cam in CAMS}
    executor = rclpy.executors.MultiThreadedExecutor(num_threads=2)
    for f in feeds.values():
        executor.add_node(f)
    import threading
    threading.Thread(target=executor.spin, daemon=True).start()

    app = FastAPI(title="Kinect Viewer")
    state = {"mode": "both"}

    @app.get("/", response_class=HTMLResponse)
    def index():
        return HTMLResponse("""<!doctype html><html><head><title>Kinect Viewer</title>
<style>
body{background:#111;color:#eee;font-family:sans-serif;text-align:center}
img{max-width:96vw;max-height:80vh;border:2px solid #444}
button{font-size:18px;padding:10px 22px;margin:6px;cursor:pointer;background:#1a5fb4;color:#fff;border:none;border-radius:6px}
button.active{background:#26a269;outline:3px solid #9b9}
#bar{margin:10px}
</style></head><body>
<h2>Kinect v2 — Camera Switch</h2>
<div id="bar">
  <button id="b_front" onclick="setMode('front')">1 · Front</button>
  <button id="b_both"  onclick="setMode('both')" class="active">0 · Both</button>
  <button id="b_rear"  onclick="setMode('rear')">2 · Rear</button>
</div>
<img id="stream" src="/stream">
<p id="status">loading...</p>
<script>
async function setMode(m){ await fetch('/api/mode',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode:m})}); }
async function refresh(){ const r=await fetch('/api/mode'); const d=await r.json();
  document.querySelectorAll('#bar button').forEach(b=>b.classList.remove('active'));
  document.getElementById('b_'+d.mode).classList.add('active');
  const rc=await fetch('/api/cameras'); const dc=await rc.json();
  document.getElementById('status').textContent = 'connected: '+(dc.connected.join(', ')||'none')+' | mode: '+d.mode; }
setInterval(refresh, 2000); refresh();
</script></body></html>""")

    @app.get("/stream")
    def stream():
        def gen():
            while True:
                frame = compose(feeds, state["mode"])
                if frame is not None:
                    jpg = mjpeg_encode(frame)
                    yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + jpg + b"\r\n")
                time.sleep(0.033)
        return StreamingResponse(gen(), media_type="multipart/x-mixed-replace; boundary=frame")

    @app.get("/api/cameras")
    def cameras():
        return JSONResponse({"connected": [c for c in CAMS if feeds[c].is_connected()]})

    @app.get("/api/mode")
    def get_mode():
        return JSONResponse({"mode": state["mode"]})

    @app.post("/api/mode")
    async def set_mode(request: Request):
        body = await request.json()
        m = body.get("mode")
        if m in ("front", "rear", "both"):
            state["mode"] = m
        return JSONResponse({"mode": state["mode"]})

    @app.post("/api/capture")
    def capture():
        frame = compose(feeds, state["mode"])
        if frame is None:
            return JSONResponse({"error": "no camera"}, status_code=404)
        path = f"/tmp/kinect_snap_{int(time.time())}.jpg"
        cv2.imwrite(path, frame)
        return JSONResponse({"file": path})

    print(f"Kinect FastAPI viewer on http://0.0.0.0:{args.port}")
    uvicorn.run(app, host="0.0.0.0", port=args.port)


if __name__ == "__main__":
    main()
