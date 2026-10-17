"""REST API route handlers and camera viewer for AV Dashboard."""

from __future__ import annotations

import asyncio
from typing import Any, Dict, Set

from fastapi import APIRouter, Response
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse

router = APIRouter()


def create_api_router(registry: Any, transport: Any, ros_bridge: Any, mhr_service: Any, state: Any, active_websockets: Set[Any]) -> APIRouter:
    r = APIRouter()

    @r.get("/api/v1/catalog")
    async def get_catalog() -> JSONResponse:
        return JSONResponse({
            "source": registry.source_description,
            "total_messages": len(registry.messages_by_id),
            "messages": registry.export_catalog(),
        })

    @r.get("/api/v1/status")
    async def get_status() -> JSONResponse:
        import time
        return JSONResponse({
            "total_frames": state.total_frames,
            "uptime_sec": round(time.time() - state.start_time, 1),
            "active_clients": len(active_websockets),
            "contracts_source": registry.source_description,
            "can": {
                "interface": transport.interface if transport else "can2",
                "connected": bool(transport.is_connected) if transport else False,
                "simulated": bool(transport.is_simulated) if transport else False,
                "bus_rate_hz": state.refresh_telemetry_summary(transport, ros_bridge)["bus_rate_hz"],
                "last_error": transport.last_error if transport else None,
            },
            "telemetry": state.refresh_telemetry_summary(transport, ros_bridge),
            "ros": ros_bridge.get_latest_data(),
        })

    @r.get("/api/v1/ros")
    async def get_ros_data() -> JSONResponse:
        return JSONResponse(ros_bridge.get_latest_data())

    @r.get("/api/v1/mhr/meta")
    async def get_mhr_meta() -> JSONResponse:
        meta = mhr_service.topology_meta()
        meta.update(mhr_service.describe())
        return JSONResponse(meta)

    @r.get("/api/v1/mhr/topology")
    async def get_mhr_topology() -> Response:
        if not mhr_service.available:
            return JSONResponse({"error": mhr_service.reason}, status_code=503)
        return Response(content=mhr_service.topology_payload(), media_type="application/octet-stream", headers={"Cache-Control": "no-store"})

    @r.get("/api/v1/camera/stream")
    async def camera_stream():
        async def frame_generator():
            while True:
                jpeg = ros_bridge.get_latest_jpeg()
                if jpeg:
                    yield b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + jpeg + b"\r\n"
                await asyncio.sleep(0.04)
        return StreamingResponse(frame_generator(), media_type="multipart/x-mixed-replace; boundary=frame")

    @r.get("/camera")
    async def standalone_camera_page():
        html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>E-Trike Perception • Live Camera Stream</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #080808; color: #f1f5f9; font-family: monospace; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    header { background: #0f172a; border-bottom: 1px solid #1e293b; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; height: 48px; }
    .brand { display: flex; align-items: center; gap: 10px; color: #38bdf8; font-weight: bold; }
    main { flex: 1; display: flex; align-items: center; justify-content: center; background: #000; position: relative; }
    img.stream { max-width: 100%; max-height: 100%; object-fit: contain; }
  </style>
</head>
<body>
  <header>
    <div class="brand">● E-TRIKE KINECT v2 PERCEPTION STREAM (1080p @ 25 Hz)</div>
    <button onclick="document.documentElement.requestFullscreen()" style="background:#1e293b;color:#cbd5e1;border:1px solid #334155;padding:4px 12px;border-radius:6px;cursor:pointer;">Fullscreen</button>
  </header>
  <main>
    <img class="stream" src="/api/v1/camera/stream" alt="Live Stream" />
  </main>
</body>
</html>"""
        return HTMLResponse(content=html)

    @r.get("/api/v1/camera/snapshot")
    async def camera_snapshot():
        jpeg = ros_bridge.get_latest_jpeg()
        if jpeg:
            return Response(content=jpeg, media_type="image/jpeg")
        return JSONResponse({"status": "no_frame"}, status_code=404)

    return r
