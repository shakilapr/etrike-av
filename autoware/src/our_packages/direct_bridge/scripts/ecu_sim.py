#!/usr/bin/env python3
# Copyright 2026 E-Trike Dev. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""
vcan ECU simulator for the E-Trike low-level bus.

Publishes the four ECU feedback frames that direct_bridge (and the teleop
console) decode, so the closed-loop bench runs with live feedback and zero
hardware:

  - 0x120 SYS_THROTTLE_STS  speed_mmps (i16)   @ 100 Hz
  - 0x206 MTR_MOTOR_FBK     speed/gear/fault   @ 50 Hz
  - 0x201 SES_STATUS        steering angle     @ 100 Hz
  - 0x721 SEB_STATUS        brake status       @ 100 Hz

It also listens for the bridge's command frames (0x204 drive, 0x169 steering,
0x7B9 brake, 0x110 mode) and animates the simulated feedback to follow the
commanded speed/steering, so a dashboard shows live movement.

Usage:
  python3 ecu_sim.py --interface vcan1        # default
  python3 ecu_sim.py --interface can1         # physical low bus (ECUs off = no-op)
"""

import argparse
import struct
import subprocess
import sys
import threading
import time

# ---------------------------------------------------------------------------
# XOR8-complement checksum (matches protocol/profiles/xor8_ff_v1.hpp)
# ---------------------------------------------------------------------------
def xor8_ff(data):
    v = 0
    for b in data:
        v ^= b
    return v ^ 0xFF


def ses_status_bytes(angle_raw, aligned=True):
    """0x201 SES_STATUS: aligned bit0, angle_raw LE u16 at bytes 2-3, xor8 cs."""
    b = bytearray(8)
    b[0] = 0x01 if aligned else 0x00
    struct.pack_into("<H", b, 2, angle_raw & 0xFFFF)
    b[7] = xor8_ff(b[:7])
    return bytes(b)


def seb_status_bytes(error=0, stroke=600, pressure=0, mode=0, aligned=True):
    """0x721 SEB_STATUS: alignment bit0, mode bits2-3, stroke u16 LE, xor8 cs.

    Byte 3 is mode-dependent: stroke high byte in stroke mode, pressure in
    pressure mode (matches the vendor overlap).
    """
    b = bytearray(8)
    b[0] = (0x01 if aligned else 0x00) | ((mode & 0x03) << 2) | ((error & 0x03) << 6)
    struct.pack_into("<H", b, 2, stroke & 0xFFFF)
    if mode == 1:
        b[3] = pressure & 0xFF
    b[7] = xor8_ff(b[:7])
    return bytes(b)


class EcuSim:
    """Simulates the low-bus ECUs on a CAN interface."""

    def __init__(self, interface):
        self.iface = interface
        self.running = False
        self.speed_mmps = 0
        self.gear = 0            # CAN gear N=0 D=1 S=2 R=3
        self.steer_raw = 30000   # centered
        self.steer_valid = True
        self.brake_stroke = 600
        self.brake_pressure = 0
        self.seb_mode = 0
        self.mode = 0            # 0=MANUAL 1=AUTO

    def _run(self, cmd, check=False):
        subprocess.run(cmd, shell=True, check=check,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    def _send(self, can_id, payload):
        self._run(f"cansend {self.iface} {can_id}#{payload}")

    def _listen_commands(self):
        """Parse bridge TX frames to animate feedback (0x204/0x169/0x7B9/0x110)."""
        proc = subprocess.Popen(
            ["candump", self.iface],
            stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True)
        try:
            for line in proc.stdout:
                if not self.running:
                    break
                parts = line.split()
                if len(parts) < 4:
                    continue
                try:
                    can_id = int(parts[1], 16)
                    data = bytes.fromhex("".join(parts[3:]))
                except ValueError:
                    continue
                if can_id == 0x204 and len(data) >= 5:       # RT_DRIVE_CMD
                    self.speed_mmps = struct.unpack(">i", data[0:4])[0]
                    self.gear = data[4]
                elif can_id == 0x169 and len(data) >= 4:     # VCU_SES_REQ
                    self.steer_raw = struct.unpack("<h", data[2:4])[0]
                elif can_id == 0x7B9 and len(data) >= 8:     # VCU_SEB_REQ
                    mode = (data[0] >> 2) & 1
                    self.seb_mode = mode
                    if mode == 1:
                        self.brake_pressure = data[3]
                    else:
                        self.brake_stroke = struct.unpack("<H", data[2:4])[0]
                elif can_id == 0x110 and len(data) >= 1:     # SYS_MODE_CMD
                    self.mode = data[0]
        finally:
            proc.terminate()

    def _tick_feedback(self):
        """Publish simulated feedback frames."""
        # 0x120 speed_mmps (i16)
        spd = max(-32768, min(32767, self.speed_mmps))
        self._send("120", struct.pack(">h", spd).hex())
        # 0x206 motor feedback (speed i16, gear, fault)
        self._send("206", struct.pack(">hBB", spd, self.gear, 0).hex())
        # 0x201 steering status
        self._send("201", ses_status_bytes(self.steer_raw & 0xFFFF, self.steer_valid).hex())
        # 0x721 brake status (pressure when mode==1)
        if self.seb_mode == 1:
            self._send("721", seb_status_bytes(
                stroke=self.brake_stroke, pressure=self.brake_pressure,
                mode=1).hex())
        else:
            self._send("721", seb_status_bytes(
                stroke=self.brake_stroke, mode=0).hex())

    def run(self):
        self.running = True
        listener = threading.Thread(target=self._listen_commands, daemon=True)
        listener.start()
        try:
            while self.running:
                self._tick_feedback()
                time.sleep(0.01)   # 100 Hz
        except KeyboardInterrupt:
            pass
        finally:
            self.running = False


def setup_interface(interface):
    if interface.startswith("vcan"):
        subprocess.run("modprobe vcan 2>/dev/null || true", shell=True)
        subprocess.run(f"ip link add dev {interface} type vcan 2>/dev/null || true",
                       shell=True)
        subprocess.run(f"ip link set {interface} up", shell=True, check=True)
    else:
        subprocess.run(f"ip link set {interface} type can bitrate 500000 "
                       "2>/dev/null || true", shell=True)
        subprocess.run(f"ip link set {interface} up", shell=True, check=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--interface", default="vcan1")
    parser.add_argument("--no-setup", action="store_true",
                        help="assume the interface is already up")
    args = parser.parse_args()

    if not args.no_setup:
        setup_interface(args.interface)

    print(f"=== ECU simulator on {args.interface} ===")
    sim = EcuSim(args.interface)
    try:
        sim.run()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
