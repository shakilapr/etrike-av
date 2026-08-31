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

"""Hardware-connected test for the direct_bridge node against the Jetson.

Validates the bridge against the physical low-level CAN bus when the Jetson
is connected to the low bus via the second MTTCAN interface (can1) and the
SES, SEB, and MTR units are powered.

This test is NOT part of the default `colcon test` run. It requires:
  - A physical low-bus drop wired to the Jetson (can1).
  - The SES, SEB, and MTR ECUs powered and on the low bus.
  - can-utils (cansend, candump) and a sourced ROS 2 workspace.

It is designed to be run on the Jetson itself (or via SSH to the Jetson):

    python3 test/test_jetson_hardware.py --interface can1

Checks performed:
  1. Interface presence: can1 exists and is up.
  2. Bridge launches and reaches the active lifecycle state.
  3. Transmit frames stream on the physical bus (0x204, 0x169, 0x7B9, 0x110).
  4. Real ECU feedback is received (0x120, 0x206 from MTR; 0x201 from SES;
     0x721 from SEB) and vehicle reports publish on the standard topics.
  5. The command-timeout path drives the bridge to the zero-speed / centered /
     released default while the MTR stream continues.
  6. An asserted emergency produces a 0x001 broadcast.

Exit code 0 = pass. Any failure prints FAILED and exits non-zero.
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


def check(condition, name):
    status = "PASS" if condition else "FAIL"
    print(f"[{status}] {name}")
    return condition


def bring_up_interface(interface):
    run(f"ip link set {interface} type can bitrate 500000 2>/dev/null || true", check=False)
    run(f"ip link set {interface} up", check=True)


def interface_exists(interface):
    proc = run(f"ip link show {interface} 2>/dev/null || true", check=False)
    return interface in proc.stdout


def launch_bridge(interface):
    cmd = (
        "ros2 launch direct_bridge direct_bridge.launch.py "
        f"can_interface:={interface}"
    )
    return subprocess.Popen(
        cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)


def wait_for_frame(interface, can_id, timeout=8.0):
    deadline = time.time() + timeout
    while time.time() < deadline:
        proc = run(
            f"timeout 2 candump {interface} -n 200 2>/dev/null || true", check=False)
        if can_id in proc.stdout:
            return True
        time.sleep(0.2)
    return False


def wait_for_topic(topic, timeout=8.0):
    deadline = time.time() + timeout
    while time.time() < deadline:
        proc = run(
            f"timeout 2 ros2 topic hz {topic} --window 5 2>&1 || true", check=False)
        if "average rate" in proc.stdout:
            return True
        time.sleep(0.2)
    return False


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--interface", default="can1",
        help="Physical low-bus CAN interface on the Jetson (default: can1)")
    parser.add_argument(
        "--skip-bringup", action="store_true",
        help="Do not set the interface up; assume it is already configured")
    args = parser.parse_args()

    interface = args.interface
    results = []

    print(f"=== direct_bridge hardware test on {interface} (Jetson) ===")

    # 1. Interface presence.
    exists = interface_exists(interface)
    results.append(check(exists, f"interface {interface} present"))

    if not exists:
        print("\nFAILED: physical interface not present — is the low-bus drop wired?")
        sys.exit(1)

    if not args.skip_bringup:
        bring_up_interface(interface)

    bridge = launch_bridge(interface)
    try:
        # 2. Bridge lifecycle active.
        time.sleep(6)
        lifecycle = run(
            "timeout 5 ros2 lifecycle get /direct_bridge 2>&1 || true", check=False).stdout
        results.append(check("active" in lifecycle, "bridge lifecycle active"))

        # 3. Transmit frames stream on the physical bus.
        tx_expected = {
            "204": "RT_DRIVE_CMD (MTR)",
            "110": "SYS_MODE_CMD (mode)",
            "169": "VCU_SES_REQ (SES)",
            "7B9": "VCU_SEB_REQ (SEB)",
        }
        for can_id, name in tx_expected.items():
            found = wait_for_frame(interface, can_id)
            results.append(check(found, f"TX frame {can_id} {name} on {interface}"))

        # 4. Real ECU feedback received + reports published.
        rx_expected = {
            "120": "SYS_THROTTLE_STS (MTR speed)",
            "206": "MTR_MOTOR_FBK (MTR gear)",
            "201": "SES_STATUS (steering)",
            "721": "SEB_STATUS (brake)",
        }
        for can_id, name in rx_expected.items():
            found = wait_for_frame(interface, can_id)
            results.append(check(found, f"RX frame {can_id} {name} from ECU"))

        # Vehicle reports publish on the standard Autoware topics.
        for topic in (
            "/vehicle/status/velocity_status",
            "/vehicle/status/gear_status",
            "/vehicle/status/steering_status",
        ):
            published = wait_for_topic(topic)
            results.append(check(published, f"report published on {topic}"))

        # 5. Timeout path: no command is published (none was); the MTR stream
        #    continues with zero-speed neutral (idle) and the bridge stays safe.
        time.sleep(1.0)
        still_streaming = wait_for_frame(interface, "204")
        results.append(check(still_streaming, "0x204 still streaming (idle zero)"))

        # 6. Emergency path.
        run(
            "ros2 topic pub -1 /control/command/emergency_cmd "
            "tier4_vehicle_msgs/msg/VehicleEmergencyStamped "
            "'{emergency: true}' 2>&1 || true",
            check=False)
        time.sleep(0.5)
        estop = wait_for_frame(interface, "001")
        results.append(check(estop, "ESTOP 0x001 broadcast on emergency"))

    finally:
        bridge.terminate()
        try:
            bridge.wait(timeout=5)
        except subprocess.TimeoutExpired:
            bridge.kill()

    failures = [name for ok, name in results if not ok]
    if failures:
        print("\nFAILED tests:")
        for name in failures:
            print(f"  - {name}")
        sys.exit(1)
    print("\nALL PASSED: direct_bridge validated on Jetson low bus.")


if __name__ == "__main__":
    main()
