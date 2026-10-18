"""Telemetry and frame state management for AV Dashboard server."""

from __future__ import annotations

import math
import struct
import time
from typing import Any, Dict, List, Optional

HW_FEEDBACK_IDS = (0x121, 0x210, 0x310, 0x311, 0x011, 0x206, 0x120)
HOST_CMD_IDS = (0x300, 0x301, 0x302, 0x303, 0x7FC)
FEEDBACK_FRESH_SEC = 1.5

# Live tracking state
total_frames: int = 0
start_time: float = time.time()
latest_frames: Dict[int, Dict[str, Any]] = {}
frame_counts: Dict[int, int] = {}
frame_timestamps: Dict[int, float] = {}
frame_rates: Dict[int, float] = {}
recent_timestamps: Dict[int, List[float]] = {}
bus_frame_timestamps: List[float] = []
last_hw_rx_time: Dict[int, float] = {}
last_host_tx_time: Dict[int, float] = {}

telemetry_summary: Dict[str, Any] = {
    "mode": "MANUAL",
    "estop": False,
    "estop_reason": 0,
    "gear": "N",
    "gear_cmd": "N",
    "gear_act": "N",
    "speed_cmd_kmh": 0.0,
    "speed_act_kmh": 0.0,
    "steer_cmd_deg": 0.0,
    "steer_act_deg": 0.0,
    "brake_cmd_kpa": 0.0,
    "brake_act_kpa": 0.0,
    "lights_cmd": {"left": False, "right": False, "hazard": False, "headlight": False, "brake": False},
    "lights_act": {"left": False, "right": False, "hazard": False, "headlight": False, "brake": False},
    "motor_rpm": None,
    "throttle_pct": None,
    "bus_rate_hz": 0.0,
    "can_connected": False,
    "is_simulated": False,
    "can_interface": "can2",
    "actuator_feedback_confirmed": False,
    "telemetry_source": "OFFLINE",
}


def decay_stale_frame_rates() -> List[Dict[str, Any]]:
    """Prune >1.0s timestamps per CAN ID and return any frame entries whose rate_hz decayed."""
    now = time.time()
    decayed: List[Dict[str, Any]] = []
    for can_id, entry in list(latest_frames.items()):
        q = recent_timestamps.get(can_id)
        if q is not None:
            while q and (now - q[0]) > 1.0:
                q.pop(0)
            new_rate = round(float(len(q)), 1) if q else 0.0
        else:
            new_rate = 0.0
        if entry.get("rate_hz") != new_rate:
            entry["rate_hz"] = new_rate
            frame_rates[can_id] = new_rate
            decayed.append(entry)
    return decayed


def refresh_telemetry_summary(transport: Any, ros_bridge: Any) -> Dict[str, Any]:
    """Recompute time-windowed bus rate, link status, and bench/ROS fallback telemetry."""
    now = time.time()
    while bus_frame_timestamps and (now - bus_frame_timestamps[0]) > 1.0:
        bus_frame_timestamps.pop(0)

    telemetry_summary["bus_rate_hz"] = round(float(len(bus_frame_timestamps)), 1)
    telemetry_summary["can_connected"] = bool(transport.is_connected) if transport else False
    telemetry_summary["is_simulated"] = bool(transport.is_simulated) if transport else False
    telemetry_summary["can_interface"] = transport.interface if transport else "can2"

    has_hw_feedback = any((now - last_hw_rx_time.get(cid, 0.0)) < FEEDBACK_FRESH_SEC for cid in (0x121, 0x210, 0x310, 0x311, 0x011))
    has_host_cmd = any((now - last_host_tx_time.get(cid, 0.0)) < FEEDBACK_FRESH_SEC for cid in (0x300, 0x301, 0x302, 0x303))

    if transport and transport.is_simulated:
        telemetry_summary["telemetry_source"] = "SIMULATED"
        telemetry_summary["actuator_feedback_confirmed"] = True
    elif has_hw_feedback:
        telemetry_summary["telemetry_source"] = "ECU_FEEDBACK"
        telemetry_summary["actuator_feedback_confirmed"] = True
    elif has_host_cmd:
        telemetry_summary["telemetry_source"] = "BENCH_CMD"
        telemetry_summary["actuator_feedback_confirmed"] = False
        telemetry_summary["speed_act_kmh"] = telemetry_summary["speed_cmd_kmh"]
        telemetry_summary["steer_act_deg"] = telemetry_summary["steer_cmd_deg"]
        telemetry_summary["brake_act_kpa"] = telemetry_summary["brake_cmd_kpa"]
        telemetry_summary["lights_act"] = dict(telemetry_summary["lights_cmd"])
        telemetry_summary["gear_act"] = telemetry_summary["gear_cmd"]
        telemetry_summary["gear"] = telemetry_summary["gear_cmd"]
        if (now - last_host_tx_time.get(0x300, 0.0)) < FEEDBACK_FRESH_SEC and (
            telemetry_summary["gear_cmd"] != "N"
            or abs(float(telemetry_summary["speed_cmd_kmh"])) > 0.05
            or abs(float(telemetry_summary["steer_cmd_deg"])) > 0.1
        ):
            telemetry_summary["mode"] = "AUTO"
        else:
            telemetry_summary["mode"] = "MANUAL"
    else:
        ros_data = ros_bridge.get_latest_data()
        veh_ros = ros_data.get("vehicle_status") or {}
        if ros_data.get("has_ego_pose") or veh_ros.get("fresh"):
            telemetry_summary["telemetry_source"] = "ROS_SIM"
            telemetry_summary["actuator_feedback_confirmed"] = True
            ego_spd = float(veh_ros.get("speed_act_kmh") if veh_ros.get("speed_act_kmh") is not None else ros_data.get("ego_speed_kmh", 0.0))
            cmd_spd = float(veh_ros.get("speed_cmd_kmh") if veh_ros.get("speed_cmd_kmh") is not None else ego_spd)
            telemetry_summary["speed_act_kmh"] = round(ego_spd, 1)
            telemetry_summary["speed_cmd_kmh"] = round(cmd_spd, 1)
            if veh_ros.get("steer_act_deg") is not None:
                telemetry_summary["steer_act_deg"] = round(float(veh_ros["steer_act_deg"]), 1)
            elif veh_ros.get("steer_cmd_deg") is not None:
                telemetry_summary["steer_act_deg"] = round(float(veh_ros["steer_cmd_deg"]), 1)
            if veh_ros.get("steer_cmd_deg") is not None:
                telemetry_summary["steer_cmd_deg"] = round(float(veh_ros["steer_cmd_deg"]), 1)
            telemetry_summary["gear"] = veh_ros.get("gear") or ("D" if abs(ego_spd) > 0.05 else "N")
            telemetry_summary["gear_act"] = telemetry_summary["gear"]
            telemetry_summary["mode"] = veh_ros.get("mode") or ("AUTO" if ros_data.get("trajectory") else "MANUAL")
            if veh_ros.get("lights"):
                telemetry_summary["lights_act"] = dict(veh_ros["lights"])
        else:
            telemetry_summary["telemetry_source"] = "OFFLINE"
            telemetry_summary["actuator_feedback_confirmed"] = False

    if (now - last_hw_rx_time.get(0x206, 0.0)) >= FEEDBACK_FRESH_SEC:
        telemetry_summary["motor_rpm"] = None
    if (now - last_hw_rx_time.get(0x120, 0.0)) >= FEEDBACK_FRESH_SEC:
        telemetry_summary["throttle_pct"] = None

    return telemetry_summary


def update_telemetry_summary(can_id: int, decoded: Dict[str, Any], raw_data: bytes, transport: Any, ros_bridge: Any) -> None:
    """Update high-level vehicle telemetry from parsed signals."""
    now = time.time()
    if can_id in HW_FEEDBACK_IDS:
        last_hw_rx_time[can_id] = now
    if can_id in HOST_CMD_IDS:
        last_host_tx_time[can_id] = now

    if can_id == 0x300:
        if "speed_mmps" in decoded:
            telemetry_summary["speed_cmd_kmh"] = round(decoded["speed_mmps"]["value"] * 0.0036, 1)
        elif len(raw_data) >= 4:
            s_raw = struct.unpack(">i", raw_data[:4])[0]
            telemetry_summary["speed_cmd_kmh"] = round(s_raw * 0.0036, 1)
        if len(raw_data) >= 8:
            g_cmd = {0: "N", 1: "D", 2: "S", 3: "R"}.get(raw_data[7], "N")
            telemetry_summary["gear_cmd"] = g_cmd
            if telemetry_summary.get("mode") == "AUTO" or telemetry_summary.get("gear_act") == "N":
                telemetry_summary["gear"] = g_cmd

    elif can_id == 0x121:
        if "speed_mmps" in decoded:
            telemetry_summary["speed_act_kmh"] = round(decoded["speed_mmps"]["value"] * 0.0036, 1)
        elif len(raw_data) >= 2:
            s_raw = struct.unpack(">h", raw_data[:2])[0]
            telemetry_summary["speed_act_kmh"] = round(s_raw * 0.0036, 1)
        if "gear" in decoded:
            g_val = int(decoded["gear"]["raw"])
            g_act = {0: "N", 1: "D", 2: "S", 3: "R"}.get(g_val, "N")
            telemetry_summary["gear_act"] = g_act
            if telemetry_summary.get("mode") != "AUTO":
                telemetry_summary["gear"] = g_act
        elif len(raw_data) >= 6:
            g_act = {0: "N", 1: "D", 2: "S", 3: "R"}.get(raw_data[5], "N")
            telemetry_summary["gear_act"] = g_act
            if telemetry_summary.get("mode") != "AUTO":
                telemetry_summary["gear"] = g_act

    elif can_id == 0x303:
        if "steer_angle_0_1deg" in decoded and isinstance(decoded["steer_angle_0_1deg"].get("raw"), (int, float)):
            telemetry_summary["steer_cmd_deg"] = round(float(decoded["steer_angle_0_1deg"]["raw"]) * 0.1, 1)
        elif len(raw_data) >= 2:
            st_raw = struct.unpack(">h", raw_data[:2])[0]
            telemetry_summary["steer_cmd_deg"] = round(st_raw * 0.1, 1)

    elif can_id == 0x310:
        if "angle_0_1deg" in decoded and isinstance(decoded["angle_0_1deg"].get("value"), (int, float)):
            telemetry_summary["steer_act_deg"] = round(float(decoded["angle_0_1deg"]["value"]), 1)
        elif len(raw_data) >= 2:
            ang_raw = (raw_data[0] << 8) | raw_data[1]
            telemetry_summary["steer_act_deg"] = round((ang_raw - 30000) * 0.1, 1)

    elif can_id == 0x301:
        if "brake_pressure_kpa" in decoded and isinstance(decoded["brake_pressure_kpa"].get("value"), (int, float)):
            telemetry_summary["brake_cmd_kpa"] = round(float(decoded["brake_pressure_kpa"]["value"]), 1)
        elif len(raw_data) >= 4:
            p_kpa = struct.unpack(">i", raw_data[:4])[0]
            telemetry_summary["brake_cmd_kpa"] = round(float(p_kpa), 1)

    elif can_id == 0x311:
        if "pressure_raw" in decoded and isinstance(decoded["pressure_raw"].get("value"), (int, float)):
            telemetry_summary["brake_act_kpa"] = round(float(decoded["pressure_raw"]["value"]), 1)
        elif len(raw_data) >= 2:
            p_raw = (raw_data[0] << 8) | raw_data[1]
            telemetry_summary["brake_act_kpa"] = round(p_raw * 0.05, 1)

    elif can_id == 0x302:
        if len(raw_data) >= 1:
            b = raw_data[0]
            telemetry_summary["lights_cmd"] = {
                "left": bool(b & 0x01), "right": bool(b & 0x02), "hazard": bool((b & 0x03) == 0x03),
                "brake": bool(b & 0x04), "headlight": bool(b & 0x08),
            }

    elif can_id == 0x011:
        if len(raw_data) >= 1:
            telemetry_summary["estop"] = bool(raw_data[0])
        if len(raw_data) >= 3:
            b = raw_data[2]
            telemetry_summary["lights_act"] = {
                "left": bool(b & 0x01), "right": bool(b & 0x02), "hazard": bool((b & 0x03) == 0x03),
                "brake": bool(b & 0x04), "headlight": bool(b & 0x08),
            }

    elif can_id == 0x210:
        if len(raw_data) >= 1:
            telemetry_summary["mode"] = {0: "MANUAL", 1: "AUTO", 2: "ESTOP"}.get(raw_data[0], "MANUAL")
        if len(raw_data) >= 2:
            telemetry_summary["estop_reason"] = (raw_data[1] >> 4) & 0x0F

    elif can_id == 0x206:
        if "motor_rpm" in decoded and isinstance(decoded["motor_rpm"].get("value"), (int, float)):
            telemetry_summary["motor_rpm"] = int(decoded["motor_rpm"]["value"])
        elif "motor_command_speed_mmps" in decoded and isinstance(decoded["motor_command_speed_mmps"].get("value"), (int, float)):
            mmps = float(decoded["motor_command_speed_mmps"]["value"])
            telemetry_summary["motor_rpm"] = int(round((abs(mmps) / 1000.0) / (2.0 * math.pi * 0.254) * 60.0))
        elif len(raw_data) >= 2:
            mmps = float(struct.unpack(">h", raw_data[:2])[0])
            telemetry_summary["motor_rpm"] = int(round((abs(mmps) / 1000.0) / (2.0 * math.pi * 0.254) * 60.0))

    elif can_id == 0x120:
        if "throttle_pct" in decoded and isinstance(decoded["throttle_pct"].get("value"), (int, float)):
            telemetry_summary["throttle_pct"] = round(float(decoded["throttle_pct"]["value"]), 1)
        elif "speed_mmps" in decoded and isinstance(decoded["speed_mmps"].get("value"), (int, float)):
            mmps = float(decoded["speed_mmps"]["value"])
            telemetry_summary["throttle_pct"] = min(100.0, round(abs(mmps) / 3000.0 * 100.0, 1))
        elif len(raw_data) >= 2:
            mmps = float(struct.unpack(">h", raw_data[:2])[0])
            telemetry_summary["throttle_pct"] = min(100.0, round(abs(mmps) / 3000.0 * 100.0, 1))

    refresh_telemetry_summary(transport, ros_bridge)
