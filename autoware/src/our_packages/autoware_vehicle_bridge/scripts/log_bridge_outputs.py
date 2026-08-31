#!/usr/bin/env python3
"""Log the E-Trike vehicle bridge outputs to a single CSV, auto-mode only.

The ``autoware_vehicle_bridge`` node (Autoware Universe <-> E-Trike CAN bus)
publishes decoded status on these topics. This script subscribes to all of them
and writes **one combined CSV** ``bridge_auto_log.csv`` with a time column.

By default it records **only while the vehicle is in AUTONOMOUS mode**
(``/vehicle/status/control_mode`` reports ``AUTONOMOUS``). All other messages are
dropped so the resulting sheet contains just the autonomous-driving period.

Outputs captured
----------------
* /vehicle/status/velocity_status          (VelocityReport)
* /vehicle/status/steering_status          (SteeringReport)
* /vehicle/status/gear_status              (GearReport)
* /vehicle/status/control_mode             (ControlModeReport)
* /vehicle/status/turn_indicators_status   (TurnIndicatorsReport)
* /vehicle/status/hazard_lights_status     (HazardLightsReport)
* /vehicle_bridge/output/diagnostics       (DiagnosticArray)

Usage
-----
    # Inside the Autoware container with the workspace sourced:
    python3 log_bridge_outputs.py                 # auto-only, 1 combined CSV
    python3 log_bridge_outputs.py --duration 300  # run for 5 minutes

    # Record everything (ignore auto-mode filter):
    python3 log_bridge_outputs.py --all

Raw CAN frames (the bytes actually put on the wire) are NOT ROS topics; to
capture those run ``candump <iface>`` (e.g. ``candump can0``) alongside.
"""

import argparse
import csv
import json
import os
import threading

import rclpy
from rclpy.node import Node

from autoware_vehicle_msgs.msg import (
    VelocityReport,
    SteeringReport,
    GearReport,
    ControlModeReport,
    TurnIndicatorsReport,
    HazardLightsReport,
)
from diagnostic_msgs.msg import DiagnosticArray

# ControlModeReport.AUTONOMOUS
AUTO_MODE = 1

TOPICS = {
    "velocity_status": ("/vehicle/status/velocity_status", VelocityReport),
    "steering_status": ("/vehicle/status/steering_status", SteeringReport),
    "gear_status": ("/vehicle/status/gear_status", GearReport),
    "control_mode": ("/vehicle/status/control_mode", ControlModeReport),
    "turn_indicators_status": (
        "/vehicle/status/turn_indicators_status",
        TurnIndicatorsReport,
    ),
    "hazard_lights_status": (
        "/vehicle/status/hazard_lights_status",
        HazardLightsReport,
    ),
    "diagnostics": ("/vehicle_bridge/output/diagnostics", DiagnosticArray),
}

CSV_HEADER = ["wall_time", "ros_sec", "ros_nanosec", "topic", "data"]


def _wall() -> str:
    import datetime

    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def _stamp(msg):
    """Return (sec, nanosec, frame_id) for report-style messages.

    Autoware report messages are inconsistent: some carry ``std_msgs/Header
    header`` while others (e.g. ``ControlModeReport``) carry a top-level
    ``builtin_interfaces/Time stamp``. Handle both.
    """
    if hasattr(msg, "header"):
        h = msg.header
        return h.stamp.sec, h.stamp.nanosec, getattr(h, "frame_id", "")
    if hasattr(msg, "stamp"):
        s = msg.stamp
        return s.sec, s.nanosec, ""
    return 0, 0, ""


class BridgeLogger(Node):
    def __init__(self, out_dir: str, auto_only: bool):
        super().__init__("bridge_output_logger")
        self.auto_only = auto_only
        self.auto_mode = False
        self.row_count = 0
        self.out_dir = out_dir
        os.makedirs(self.out_dir, exist_ok=True)
        self.path = os.path.join(self.out_dir, "bridge_auto_log.csv")
        self.f = open(self.path, "w", newline="")
        self.writer = csv.writer(self.f)
        self.writer.writerow(CSV_HEADER)
        for key, (topic, msg_type) in TOPICS.items():
            self.create_subscription(
                msg_type, topic, self._make_callback(key), 10
            )
        self.get_logger().info(
            f"Bridge logger active -> {self.path} "
            f"(auto_only={self.auto_only})"
        )

    def _make_callback(self, key):
        def cb(msg):
            if key == "control_mode":
                self.auto_mode = msg.mode == AUTO_MODE
            if self.auto_only and not self.auto_mode:
                return
            for row in self._rows(key, msg):
                self.writer.writerow(row)
                self.row_count += 1
            self.f.flush()

        return cb

    def _rows(self, key, msg):
        sec, nsec, fid = _stamp(msg)
        if key == "velocity_status":
            d = {
                "longitudinal_velocity": msg.longitudinal_velocity,
                "lateral_velocity": msg.lateral_velocity,
                "heading_rate": msg.heading_rate,
                "frame_id": fid,
            }
            return [[_wall(), sec, nsec, key, json.dumps(d)]]
        if key == "steering_status":
            d = {"steering_tire_angle": msg.steering_tire_angle, "frame_id": fid}
            return [[_wall(), sec, nsec, key, json.dumps(d)]]
        if key in ("gear_status", "turn_indicators_status", "hazard_lights_status"):
            d = {"report": msg.report, "frame_id": fid}
            return [[_wall(), sec, nsec, key, json.dumps(d)]]
        if key == "control_mode":
            d = {"mode": msg.mode}
            return [[_wall(), sec, nsec, key, json.dumps(d)]]
        if key == "diagnostics":
            rows = []
            for s in msg.status:
                d = {"name": s.name, "level": s.level, "hardware_id": s.hardware_id}
                rows.append([_wall(), sec, nsec, key, json.dumps(d)])
            return rows
        return []

    def close(self) -> None:
        self.f.close()

    def summary(self) -> str:
        return f"wrote {self.row_count} rows to {self.path}"


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Log E-Trike bridge ROS outputs (auto-mode only)."
    )
    parser.add_argument(
        "--out",
        default="data/bridge_logs",
        help="Output directory for bridge_auto_log.csv.",
    )
    parser.add_argument(
        "--duration",
        type=float,
        default=0.0,
        help="Stop after this many seconds (0 = run until Ctrl-C).",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Record all messages, ignoring the auto-mode filter.",
    )
    args = parser.parse_args()

    rclpy.init()
    node = BridgeLogger(args.out, auto_only=not args.all)
    try:
        if args.duration > 0:
            rclpy.spin_until_future_complete(
                node, rclpy.task.Future(), timeout_sec=args.duration
            )
        else:
            rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.close()
        node.get_logger().info(node.summary())
        node.destroy_node()
        rclpy.shutdown()


if __name__ == "__main__":
    main()
