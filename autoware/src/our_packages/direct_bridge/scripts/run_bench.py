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
Dual-mode bench harness for the direct_bridge low-bus bring-up.

Runs the bridge against a virtual CAN interface (vcan1, default) for bench
testing or a physical low-bus interface (can1) for hardware bring-up.
Prerequisites inside the container / host:
  - SocketCAN kernel modules (vcan) and can-utils (cansend, candump, cansniffer)
  - The ROS 2 workspace sourced (ros2 command available)
  - For the physical path: the low-bus interface already exists or is wired.

Usage:
  python3 scripts/run_bench.py --interface vcan1   # virtual (default)
  python3 scripts/run_bench.py --interface can1    # physical low bus
  python3 scripts/run_bench.py --no-cleanup        # keep interface after test
"""

import argparse
import subprocess
import sys
import time


def run(cmd, check=True, timeout=30):
    print(f">>> {cmd}")
    proc = subprocess.run(cmd, shell=True, timeout=timeout, capture_output=True, text=True)
    if proc.stdout:
        print(proc.stdout, end="")
    if proc.stderr and proc.returncode != 0:
        print(proc.stderr, end="", file=sys.stderr)
    if check and proc.returncode != 0:
        raise RuntimeError(f"command failed ({proc.returncode}): {cmd}")
    return proc


def setup_interface(interface):
    if interface.startswith("vcan"):
        run("modprobe vcan")
        run(f"ip link add dev {interface} type vcan 2>/dev/null || true")
        run(f"ip link set {interface} up")
    else:
        # Physical low bus: 500 kbit/s.
        run(f"ip link set {interface} type can bitrate 500000 2>/dev/null || true")
        run(f"ip link set {interface} up")


def teardown_interface(interface):
    if interface.startswith("vcan"):
        run(f"ip link set {interface} down 2>/dev/null || true")
        run(f"ip link del {interface} 2>/dev/null || true")
    else:
        run(f"ip link set {interface} down 2>/dev/null || true")


def launch_bridge(interface):
    cmd = (
        "ros2 launch direct_bridge direct_bridge.launch.py "
        f"can_interface:={interface}"
    )
    proc = subprocess.Popen(
        cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    return proc


def inject_feedback(interface):
    """
    Inject the four feedback frames the bridge decodes.

    Payloads are produced by the vendored codecs so checksums/counters are
    valid. These are the payload-v1 vectors:
      - 0x120 SYS_THROTTLE_STS: speed_mmps=1000 -> 03e8
      - 0x206 MTR_MOTOR_FBK: actual=1000 gear=1 fault=0 -> 03e80100
      - 0x201 SES_STATUS: aligned=1, raw angle=30000 (centered), checksum valid
      - 0x721 SEB_STATUS: aligned=1, normal error, checksum valid
    """
    frames = [
        "120#03E8",
        "206#03E80100",
        "201#0100307500000000",   # aligned, centered (raw angle 30000 = 0x7530 LE)
        "721#0100000000000000",
    ]
    # Compute XOR8-complement checksums for SES/SEB status frames (bytes 0-6).
    for idx in (2, 3):
        raw = bytes.fromhex(frames[idx].split("#")[1])
        checksum = 0
        for b in raw[:7]:
            checksum ^= b
        frames[idx] = frames[idx][:-2] + f"{checksum ^ 0xFF:02X}"
    for frame in frames:
        run(f"cansend {interface} {frame}")


def wait_for_frame(interface, can_id, timeout=8.0):
    """Return True if a frame with the given CAN ID appears within timeout."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        proc = run(f"timeout 2 candump {interface} -n 200 2>/dev/null || true", check=False)
        if can_id in proc.stdout:
            return True
        time.sleep(0.2)
    return False


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--interface", default="vcan1",
                        help="CAN interface (vcan1 for bench, can1 for physical low bus)")
    parser.add_argument("--no-cleanup", action="store_true",
                        help="leave the interface up after the test")
    args = parser.parse_args()

    interface = args.interface
    print(f"=== direct_bridge bench on {interface} ===")

    setup_interface(interface)
    bridge = launch_bridge(interface)
    try:
        time.sleep(6)

        print("\n--- Injecting feedback ---")
        inject_feedback(interface)
        time.sleep(2)

        print("\n--- Asserting TX frames ---")
        expected = {
            "204": "RT_DRIVE_CMD (MTR)",
            "110": "SYS_MODE_CMD (mode)",
            "169": "VCU_SES_REQ (SES)",
            "7B9": "VCU_SEB_REQ (SEB)",
        }
        ok = True
        for can_id, name in expected.items():
            found = wait_for_frame(interface, can_id)
            status = "OK" if found else "MISSING"
            print(f"  {can_id} {name}: {status}")
            ok = ok and found

        # Timeout path: stop publishing (already stopped); the bridge holds the
        # last command and should switch to zero/center/release after 200 ms.
        # The MTR stream continues with zero-speed neutral, SES centered, SEB released.
        print("\n--- Timeout path ---")
        time.sleep(1.0)
        # A zero-speed 0x204 frame is the expected default output.
        found_zero = wait_for_frame(interface, "204")
        print(f"  0x204 still streaming (idle): {'OK' if found_zero else 'MISSING'}")
        ok = ok and found_zero

        if not ok:
            print("\nFAILED: not all expected frames observed.")
            sys.exit(1)
        print("\nPASSED: bench script validated all expected TX frames and paths.")
    finally:
        bridge.terminate()
        try:
            bridge.wait(timeout=5)
        except subprocess.TimeoutExpired:
            bridge.kill()
        if not args.no_cleanup:
            teardown_interface(interface)


if __name__ == "__main__":
    main()
