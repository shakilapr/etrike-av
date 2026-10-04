"""FastAPI server and WebSocket broadcaster for CAN Watcher.

Conforms to canonical architecture:
- REST /api/v1
- WebSocket /ws/v1/stream
- Static React / Vite production bundle mount
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import struct
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Set

import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from tools.av_dashboard.backend.contracts import ContractRegistry
from tools.av_dashboard.backend.transport import BaseCanTransport, CanFrame, create_transport

app = FastAPI(title="AV Dashboard API", version="2.0.0")

# Enable CORS for Vite dev server during development
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

# Live tracking state
total_frames: int = 0
start_time: float = time.time()
latest_frames: Dict[int, Dict[str, Any]] = {}
frame_counts: Dict[int, int] = {}
frame_timestamps: Dict[int, float] = {}
frame_rates: Dict[int, float] = {}

# Telemetry summary for glanceable dashboard
telemetry_summary = {
    "mode": "MANUAL",
    "estop": False,
    "estop_reason": 0,
    "gear": "N",
    "speed_cmd_kmh": 0.0,
    "speed_act_kmh": 0.0,
    "steer_cmd_deg": 0.0,
    "steer_act_deg": 0.0,
    "brake_cmd_kpa": 0.0,
    "brake_act_kpa": 0.0,
    "lights_cmd": {"left": False, "right": False, "hazard": False, "headlight": False, "brake": False},
    "lights_act": {"left": False, "right": False, "hazard": False, "headlight": False, "brake": False},
}


def update_telemetry_summary(can_id: int, decoded: Dict[str, Any], raw_data: bytes) -> None:
    """Update high-level vehicle telemetry from parsed signals."""
    global telemetry_summary

    # 1. Host Drive Cmd (0x300) - Commanded speed and gear
    if can_id == 0x300:
        if "speed_mmps" in decoded:
            telemetry_summary["speed_cmd_kmh"] = round(decoded["speed_mmps"]["value"] * 0.0036, 1)
        elif len(raw_data) >= 4:
            s_raw = struct.unpack(">i", raw_data[:4])[0]
            telemetry_summary["speed_cmd_kmh"] = round(s_raw * 0.0036, 1)
        if len(raw_data) >= 8:
            gear_raw = raw_data[7]
            telemetry_summary["gear"] = {0: "N", 1: "D", 2: "S", 3: "R"}.get(gear_raw, "N")

    # 2. RT Motion Report (0x121) - Feedback speed and yaw
    elif can_id == 0x121:
        if "speed_mmps" in decoded:
            telemetry_summary["speed_act_kmh"] = round(decoded["speed_mmps"]["value"] * 0.0036, 1)
        if "gear" in decoded:
            g_val = int(decoded["gear"]["raw"])
            telemetry_summary["gear"] = {0: "N", 1: "D", 2: "S", 3: "R"}.get(g_val, "N")

    # 3. Host Steer Cmd (0x303) - Commanded steering
    elif can_id == 0x303:
        if len(raw_data) >= 2:
            st_raw = (raw_data[0] << 8) | raw_data[1]
            if st_raw >= 0x8000:
                st_raw -= 0x10000
            telemetry_summary["steer_cmd_deg"] = round(st_raw * 0.1, 1)

    # 4. Steer Diag (0x310) - Feedback steering
    elif can_id == 0x310:
        if len(raw_data) >= 2:
            ang_raw = (raw_data[0] << 8) | raw_data[1]
            deg = (ang_raw - 30000) * 0.1
            telemetry_summary["steer_act_deg"] = round(deg, 1)

    # 5. Host Brake Req (0x301) - Commanded brake
    elif can_id == 0x301:
        if len(raw_data) >= 4:
            p_kpa = (raw_data[0] << 24) | (raw_data[1] << 16) | (raw_data[2] << 8) | raw_data[3]
            telemetry_summary["brake_cmd_kpa"] = round(p_kpa, 1)

    # 6. Brake Diag (0x311) - Feedback brake
    elif can_id == 0x311:
        if len(raw_data) >= 2:
            p_raw = (raw_data[0] << 8) | raw_data[1]
            telemetry_summary["brake_act_kpa"] = round(p_raw * 50.0, 1)

    # 7. Host Light Cmd (0x302) - Commanded lights
    elif can_id == 0x302:
        if len(raw_data) >= 1:
            b = raw_data[0]
            telemetry_summary["lights_cmd"] = {
                "left": bool(b & 0x01),
                "right": bool(b & 0x02),
                "hazard": bool((b & 0x03) == 0x03),
                "brake": bool(b & 0x04),
                "headlight": bool(b & 0x08),
            }

    # 8. Sys Safety Sts (0x011) - Feedback lights and ESTOP
    elif can_id == 0x011:
        if len(raw_data) >= 1:
            telemetry_summary["estop"] = bool(raw_data[0])
        if len(raw_data) >= 3:
            b = raw_data[2]
            telemetry_summary["lights_act"] = {
                "left": bool(b & 0x01),
                "right": bool(b & 0x02),
                "hazard": bool((b & 0x03) == 0x03),
                "brake": bool(b & 0x04),
                "headlight": bool(b & 0x08),
            }

    # 9. RT State Report (0x210) - Mode & Safety state
    elif can_id == 0x210:
        if len(raw_data) >= 1:
            m_code = raw_data[0]
            telemetry_summary["mode"] = {0: "MANUAL", 1: "AUTO", 2: "ESTOP"}.get(m_code, "MANUAL")
        if len(raw_data) >= 2:
            telemetry_summary["estop_reason"] = (raw_data[1] >> 4) & 0x0F


async def ingest_can_loop() -> None:
    """Continuously ingest CAN frames, update state, and broadcast to WebSocket clients."""
    global total_frames, transport, registry
    try:
        await transport.start()
    except Exception as err:
        print(f"[CAN Server] Transport failed ({err}). Falling back to simulation.")
        from tools.av_dashboard.backend.transport import SimulatedCanTransport
        transport = SimulatedCanTransport()
        await transport.start()

    recent_timestamps: Dict[int, List[float]] = {}
    last_broadcast = time.time()
    pending_updates: Dict[int, Dict[str, Any]] = {}


    while True:
        try:
            async for frame in transport.frames():
                now = time.time()
                total_frames += 1
                can_id = frame.can_id
                frame_counts[can_id] = frame_counts.get(can_id, 0) + 1

                if can_id not in recent_timestamps:
                    recent_timestamps[can_id] = []
                q = recent_timestamps[can_id]
                q.append(now)
                while q and (now - q[0]) > 1.0:
                    q.pop(0)
                rate_hz = round(len(q) / 1.0, 1) if len(q) > 1 else 1.0
                frame_rates[can_id] = rate_hz
                frame_timestamps[can_id] = now

                decoded_signals, bit_cells = registry.decode_frame(can_id, frame.data)
                update_telemetry_summary(can_id, decoded_signals, frame.data)

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

                # Throttle broadcast to ~25 Hz (every 40ms)
                if (now - last_broadcast) >= 0.040:
                    last_broadcast = now
                    if active_websockets and pending_updates:
                        payload = {
                            "type": "batch",
                            "total_frames": total_frames,
                            "uptime_sec": round(now - start_time, 1),
                            "frames": list(pending_updates.values()),
                            "telemetry": telemetry_summary,
                        }
                        msg_text = json.dumps(payload)
                        pending_updates.clear()

                        stale_sockets: List[WebSocket] = []
                        # Iterate copy to prevent 'Set changed size during iteration'
                        for ws in list(active_websockets):
                            try:
                                await ws.send_text(msg_text)
                            except Exception:
                                stale_sockets.append(ws)
                        for ws in stale_sockets:
                            active_websockets.discard(ws)

        except asyncio.CancelledError:
            break
        except Exception as e:
            print(f"[CAN Ingest] Recovering from error: {e}")
            await asyncio.sleep(0.1)

    await transport.stop()



@app.on_event("startup")
async def startup_event() -> None:
    asyncio.create_task(ingest_can_loop())


# Canonical REST /api/v1 endpoints
@app.get("/api/v1/catalog")
async def get_catalog() -> JSONResponse:
    """Return all messages and signals loaded dynamically from YAML files."""
    return JSONResponse(
        {
            "source": registry.source_description,
            "total_messages": len(registry.messages_by_id),
            "messages": registry.export_catalog(),
        }
    )


@app.get("/api/v1/status")
async def get_status() -> JSONResponse:
    """Return backend status, interface, and live frame counter."""
    return JSONResponse(
        {
            "total_frames": total_frames,
            "uptime_sec": round(time.time() - start_time, 1),
            "active_clients": len(active_websockets),
            "contracts_source": registry.source_description,
            "telemetry": telemetry_summary,
        }
    )


# Canonical WebSocket /ws/v1/stream endpoint
@app.websocket("/ws/v1/stream")
@app.websocket("/ws")  # fallback alias
async def websocket_endpoint(websocket: WebSocket) -> None:
    await websocket.accept()
    active_websockets.add(websocket)
    try:
        snapshot = {
            "type": "snapshot",
            "total_frames": total_frames,
            "uptime_sec": round(time.time() - start_time, 1),
            "frames": list(latest_frames.values()),
            "telemetry": telemetry_summary,
        }
        await websocket.send_text(json.dumps(snapshot))
        while True:
            await websocket.receive_text()
    except (WebSocketDisconnect, asyncio.CancelledError):
        pass
    finally:
        active_websockets.discard(websocket)


# Serve built React frontend if dist exists
if FRONTEND_DIST.is_dir():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="assets")
    if (FRONTEND_DIST / "models").is_dir():
        app.mount("/models", StaticFiles(directory=str(FRONTEND_DIST / "models")), name="models")

    @app.get("/")
    async def serve_root():
        return FileResponse(FRONTEND_DIST / "index.html")

    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        file_path = FRONTEND_DIST / full_path
        if full_path and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST / "index.html")
else:
    @app.get("/")
    async def fallback_index():
        return HTMLResponse(
            "<html><body style='background:#0d1117;color:#fff;font-family:sans-serif;padding:40px;'>"
            "<h2>⚡ AV Dashboard Backend Ready</h2>"
            "<p>API is running. Build frontend with: <code>cd tools/av_dashboard/frontend && pnpm build</code></p>"
            "<p>API Docs: <a style='color:#38bdf8' href='/docs'>/docs</a></p>"
            "</body></html>"
        )


def main() -> None:
    global registry, transport
    parser = argparse.ArgumentParser(description="AV Dashboard: Vehicle Telemetry & 3D Environment Display")
    parser.add_argument("--interface", default="can2", help="CAN interface name (default: can2)")
    parser.add_argument("--port", type=int, default=8000, help="Web server port (default: 8000)")
    parser.add_argument("--host", default="0.0.0.0", help="Web server bind host (default: 0.0.0.0)")
    parser.add_argument("--yaml-dir", default=None, help="Path to protocol contracts YAML directory")
    parser.add_argument("--sim", action="store_true", help="Force simulation mode")
    args = parser.parse_args()

    registry = ContractRegistry(contracts_dir=args.yaml_dir)
    print(f"[AV Dashboard] Loaded {len(registry.messages_by_id)} messages from: {registry.source_description}")

    transport = create_transport(interface=args.interface, sim=args.sim)

    print(f"[AV Dashboard] Serving live dashboard at http://{args.host}:{args.port}")
    uvicorn.run(app, host=args.host, port=args.port, log_level="info")


if __name__ == "__main__":
    main()
