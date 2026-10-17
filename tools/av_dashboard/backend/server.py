"""FastAPI server and WebSocket broadcaster for CAN Watcher."""

from __future__ import annotations

import argparse
import asyncio
import json
import threading
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Set

import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from tools.av_dashboard.backend.contracts import ContractRegistry
from tools.av_dashboard.backend.mhr_service import MhrService
from tools.av_dashboard.backend.ros2_bridge import Ros2Bridge
from tools.av_dashboard.backend.server_routes import create_api_router
from tools.av_dashboard.backend.server_state import (
    decay_stale_frame_rates,
    frame_counts,
    frame_rates,
    frame_timestamps,
    latest_frames,
    recent_timestamps,
    refresh_telemetry_summary,
    start_time,
    telemetry_summary,
    total_frames,
    update_telemetry_summary,
)
from tools.av_dashboard.backend.transport import BaseCanTransport, CanFrame, create_transport
from tools.av_dashboard.backend import server_state

app = FastAPI(title="AV Dashboard API", version="2.0.0")
ros_bridge = Ros2Bridge()
mhr_service = MhrService()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_DIST = Path(__file__).resolve().parents[1] / "frontend" / "dist"
registry: ContractRegistry = ContractRegistry()
transport: Optional[BaseCanTransport] = None
active_websockets: Set[WebSocket] = set()
_send_lock = asyncio.Lock()


def _ros_snapshot() -> Dict[str, Any]:
    ros_data = ros_bridge.get_latest_data()
    return {
        "ros_status": {
            "active": ros_data["active"],
            "hz": ros_data["hz"],
            "tracked_count": ros_data["tracked_count"],
            "object_count": ros_data["object_count"],
            "source": ros_data["source"],
            "pose_ok": ros_data["pose_ok"],
            "frame_id": ros_data["frame_id"],
            "has_ego_pose": ros_data["has_ego_pose"],
            "class_counts": ros_data["class_counts"],
            "bridge_available": ros_data["bridge_available"],
            "subscribed": ros_data["subscribed"],
            "last_error": ros_data["last_error"],
            "bench_perception": ros_data.get("bench_perception", {}),
            "human_poses": ros_data.get("human_poses", {}),
        },
        "perception_objects": ros_data["objects"],
        "planned_trajectory": ros_data["trajectory"],
        "human_poses": ros_data.get("human_poses", {}),
        "mhr_human": mhr_service.current_payload(),
    }


async def _send_all(payload: Dict[str, Any]) -> None:
    if not active_websockets:
        return
    msg_text = json.dumps(payload)
    async with _send_lock:
        stale_sockets: List[WebSocket] = []
        for ws in list(active_websockets):
            try:
                await ws.send_text(msg_text)
            except Exception:
                stale_sockets.append(ws)
        for ws in stale_sockets:
            active_websockets.discard(ws)


async def ingest_can_loop() -> None:
    global transport, registry
    if transport is not None:
        await transport.start()

    last_broadcast = time.time()
    pending_updates: Dict[int, Dict[str, Any]] = {}

    while True:
        try:
            if transport is None:
                await asyncio.sleep(1.0)
                continue
            async for frame in transport.frames():
                now = time.time()
                server_state.total_frames += 1
                can_id = frame.can_id
                frame_counts[can_id] = frame_counts.get(can_id, 0) + 1

                server_state.bus_frame_timestamps.append(now)
                while server_state.bus_frame_timestamps and (now - server_state.bus_frame_timestamps[0]) > 1.0:
                    server_state.bus_frame_timestamps.pop(0)

                if can_id not in recent_timestamps:
                    recent_timestamps[can_id] = []
                q = recent_timestamps[can_id]
                q.append(now)
                while q and (now - q[0]) > 1.0:
                    q.pop(0)
                rate_hz = round(float(len(q)), 1)
                frame_rates[can_id] = rate_hz
                frame_timestamps[can_id] = now

                decoded_signals, bit_cells = registry.decode_frame(can_id, frame.data)
                update_telemetry_summary(can_id, decoded_signals, frame.data, transport, ros_bridge)

                frame_entry = {
                    "id": can_id,
                    "id_hex": f"0x{can_id:03X}",
                    "data_hex": frame.to_hex_raw(),
                    "data_hex_display": frame.to_hex_string(),
                    "dlc": frame.dlc,
                    "count": frame_counts[can_id],
                    "rate_hz": rate_hz,
                    "timestamp": now,
                    "signals": decoded_signals,
                    "bit_cells": bit_cells,
                }

                latest_frames[can_id] = frame_entry
                pending_updates[can_id] = frame_entry

                if (now - last_broadcast) >= 0.040:
                    last_broadcast = now
                    if pending_updates:
                        payload = {
                            "type": "batch",
                            "total_frames": server_state.total_frames,
                            "uptime_sec": round(now - start_time, 1),
                            "frames": list(pending_updates.values()),
                            "telemetry": refresh_telemetry_summary(transport, ros_bridge),
                            **_ros_snapshot(),
                        }
                        pending_updates.clear()
                        await _send_all(payload)
        except asyncio.CancelledError:
            break
        except Exception as e:
            print(f"[CAN Ingest] Recovering from error: {e}")
            await asyncio.sleep(0.1)

    if transport is not None:
        await transport.stop()


async def broadcast_ros_loop() -> None:
    while True:
        try:
            await asyncio.sleep(0.1)
            decayed_frames = decay_stale_frame_rates()
            if not active_websockets:
                continue
            payload: Dict[str, Any] = {
                "type": "ros",
                "total_frames": server_state.total_frames,
                "uptime_sec": round(time.time() - start_time, 1),
                "telemetry": refresh_telemetry_summary(transport, ros_bridge),
                **_ros_snapshot(),
            }
            if decayed_frames:
                payload["frames"] = decayed_frames
            await _send_all(payload)
        except asyncio.CancelledError:
            break
        except Exception as e:
            print(f"[ROS Broadcast] Recovering from error: {e}")
            await asyncio.sleep(0.1)


def mhr_worker_loop() -> None:
    while True:
        try:
            data = ros_bridge.get_latest_data()
            human_poses = data.get("human_poses") or {}
            poses = human_poses.get("poses", []) if isinstance(human_poses, dict) else []
            mhr_service.update(poses)
        except Exception as exc:
            print(f"[MHR] worker recovering: {exc}")
        time.sleep(0.08)


@app.on_event("startup")
async def startup_event() -> None:
    ros_bridge.start()
    asyncio.create_task(ingest_can_loop())
    asyncio.create_task(broadcast_ros_loop())
    if mhr_service.available:
        threading.Thread(target=mhr_worker_loop, name="mhr-worker", daemon=True).start()


app.include_router(create_api_router(registry, transport, ros_bridge, mhr_service, server_state, active_websockets))


@app.websocket("/ws/v1/stream")
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await websocket.accept()
    async with _send_lock:
        active_websockets.add(websocket)
    try:
        snapshot = {
            "type": "snapshot",
            "total_frames": server_state.total_frames,
            "uptime_sec": round(time.time() - start_time, 1),
            "frames": list(latest_frames.values()),
            "telemetry": telemetry_summary,
            **_ros_snapshot(),
        }
        await websocket.send_text(json.dumps(snapshot))
        while True:
            await websocket.receive_text()
    except (WebSocketDisconnect, asyncio.CancelledError):
        pass
    finally:
        async with _send_lock:
            active_websockets.discard(websocket)


@app.websocket("/ws/v1/lidar")
@app.websocket("/ws/lidar")
async def websocket_lidar_endpoint(websocket: WebSocket) -> None:
    await websocket.accept()
    last_sent_ts: float = 0.0
    try:
        while True:
            cloud_bytes, ts = ros_bridge.get_latest_pointcloud_binary()
            if cloud_bytes and ts > last_sent_ts:
                last_sent_ts = ts
                await websocket.send_bytes(cloud_bytes)
            await asyncio.sleep(0.033)
    except (WebSocketDisconnect, asyncio.CancelledError):
        pass


if FRONTEND_DIST.is_dir():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str) -> Any:
        file_path = (FRONTEND_DIST / full_path).resolve()
        if file_path.is_file() and str(file_path).startswith(str(FRONTEND_DIST.resolve())):
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST / "index.html")


def main() -> None:
    global registry, transport
    parser = argparse.ArgumentParser(description="AV Dashboard: Vehicle Telemetry & 3D Environment Display")
    parser.add_argument("--interface", default="can2", help="CAN interface name (default: can2)")
    parser.add_argument("--port", type=int, default=8080, help="Web server port (default: 8080)")
    parser.add_argument("--host", default="0.0.0.0", help="Web server bind host (default: 0.0.0.0)")
    parser.add_argument("--yaml-dir", default=None, help="Path to protocol contracts YAML directory")
    parser.add_argument("--sim", action="store_true", help="Force simulation mode")
    args = parser.parse_args()

    registry = ContractRegistry(contracts_dir=args.yaml_dir)
    transport = create_transport(interface=args.interface, sim=args.sim)
    print(f"[AV Dashboard] Serving live dashboard at http://{args.host}:{args.port}")
    uvicorn.run(app, host=args.host, port=args.port, log_level="info")


if __name__ == "__main__":
    main()
