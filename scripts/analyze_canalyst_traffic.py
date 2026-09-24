#!/usr/bin/env python3
"""CAN Traffic Analyzer for E-Trike & Autoware Universe.

Sniffs a specified SocketCAN interface for a given duration, aggregates unique
CAN arbitration IDs, calculates reception frequencies, and maps them to known
E-Trike protocol signals.
"""

from __future__ import annotations

import argparse
from collections import defaultdict
import time
from typing import Any, Dict, List, NamedTuple, Optional

try:
    import can  # type: ignore[import-untyped]
except ImportError:
    can = None


# Known CAN ID mappings based on etrike_protocol & autoware_vehicle_bridge
KNOWN_CAN_IDS: Dict[int, str] = {
    0x001: "SAFETY_ESTOP",
    0x011: "SYS_SAFETY_STS",
    0x121: "RT_MOTION_RPT (Velocity, Heading Rate, Gear)",
    0x169: "SYS_THROTTLE_STS / ADC Feedback",
    0x201: "RT_ACTUATOR_STS (Steering/Brake telemetry)",
    0x204: "MTR_TELEMETRY_RPT (Inverter/Motor Status)",
    0x206: "MTR_MOTOR_FBK (RPM, Temperature, Gear State)",
    0x210: "RT_STATE_RPT (Auto Confirmation, Mode)",
    0x300: "HOST_DRIVE_CMD (Autoware Drive)",
    0x301: "HOST_BRAKE_REQ (Autoware Brake)",
    0x302: "HOST_LIGHT_CMD (Autoware Turn/Hazard)",
    0x303: "HOST_STEER_CMD (Autoware Steer)",
    0x310: "STEER_DIAG (Tire angle feedback)",
    0x311: "RT_BRAKE_CMD (Brake pressure feedback)",
    0x600: "SYS_DIAG_RPT (System Diagnostics)",
    0x721: "DIAG_SERVICE_RSP (ECU Response)",
    0x7B9: "BMS_BATTERY_STS (Battery Telemetry)",
    0x7FC: "HOST_HEARTBEAT (Autoware Liveness)",
    0x7FD: "RT_HEARTBEAT (Real-Time Controller Liveness)",
    0x7FE: "RT_NODE_STATUS / SYS_NODE_STATUS (ECU State)",
}


class FrameStat(NamedTuple):
    """Statistics for an aggregated CAN ID."""

    arbitration_id: int
    count: int
    frequency_hz: float
    dlc: int
    last_payload_hex: str
    description: str


class CanTrafficAnalyzer:
    """Aggregates and formats CAN traffic statistics."""

    def __init__(self, interface: str = "can2", duration_sec: float = 3.0) -> None:
        self.interface: str = interface
        self.duration_sec: float = duration_sec
        self.counts: Dict[int, int] = defaultdict(int)
        self.last_dlc: Dict[int, int] = {}
        self.last_data: Dict[int, bytes] = {}

    def run_analysis(self) -> List[FrameStat]:
        """Sniff the bus for duration_sec and return sorted FrameStat list."""
        if can is None:
            raise RuntimeError("python-can is not installed. Install via pip3 install python-can.")

        bus = can.Bus(interface="socketcan", channel=self.interface)
        start_time = time.time()
        end_time = start_time + self.duration_sec

        try:
            while time.time() < end_time:
                msg = bus.recv(timeout=0.1)
                if msg is not None:
                    cid = msg.arbitration_id
                    self.counts[cid] += 1
                    self.last_dlc[cid] = msg.dlc
                    self.last_data[cid] = bytes(msg.data)
        finally:
            bus.shutdown()

        actual_duration = max(time.time() - start_time, 0.001)
        stats: List[FrameStat] = []

        for cid, count in sorted(self.counts.items()):
            freq = count / actual_duration
            dlc = self.last_dlc.get(cid, 0)
            data_bytes = self.last_data.get(cid, b"")
            hex_str = " ".join(f"{b:02X}" for b in data_bytes)
            desc = KNOWN_CAN_IDS.get(cid, "Custom / Unmapped ECU Frame")

            stats.append(
                FrameStat(
                    arbitration_id=cid,
                    count=count,
                    frequency_hz=freq,
                    dlc=dlc,
                    last_payload_hex=hex_str,
                    description=desc,
                )
            )

        return stats

    def print_report(self, stats: List[FrameStat]) -> None:
        """Print formatted markdown-compatible report of captured addresses."""
        print(f"\n=========================================================================================")
        print(f" Captured CAN Addresses on '{self.interface}' (Duration: {self.duration_sec:.1f}s)")
        print(f"=========================================================================================")
        print(f"{'CAN ID (Hex)':<14} {'ID (Dec)':<10} {'Freq (Hz)':<12} {'DLC':<6} {'Last Data (Hex)':<26} {'Signal / Purpose'}")
        print(f"{'-'*14} {'-'*10} {'-'*12} {'-'*6} {'-'*26} {'-'*30}")

        total_frames = sum(s.count for s in stats)
        for s in stats:
            hex_id = f"0x{s.arbitration_id:03X}"
            print(
                f"{hex_id:<14} {s.arbitration_id:<10} {s.frequency_hz:<12.1f} {s.dlc:<6} {s.last_payload_hex:<26} {s.description}"
            )

        print(f"{'-'*105}")
        print(f"Total Unique Addresses: {len(stats)} | Total Frames Captured: {total_frames}\n")


def parse_args() -> argparse.Namespace:
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="Analyze incoming CAN traffic on SocketCAN interface")
    parser.add_argument("--interface", "-i", type=str, default="can2", help="SocketCAN interface name (default: can2)")
    parser.add_argument("--duration", "-d", type=float, default=3.0, help="Sniffing duration in seconds (default: 3.0)")
    return parser.parse_args()


def main() -> None:
    """Entry point."""
    args = parse_args()
    analyzer = CanTrafficAnalyzer(interface=args.interface, duration_sec=args.duration)
    stats = analyzer.run_analysis()
    analyzer.print_report(stats)


if __name__ == "__main__":
    main()
