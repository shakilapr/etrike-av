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
Bidirectional Autoware <-> CAN signal-loop test for the direct_bridge node.

Publishes Autoware command signals on the exact vehicle-interface topics and
asserts the bridge produces byte-exact CAN frames; then injects ECU feedback
CAN frames and asserts the bridge publishes the correct Autoware report
values. This locks in the verified encoder/decoder math as a regression guard.

Requires a vcan interface (vcan1). Skips when vcan is unavailable. Launches the
bridge itself via ros2 launch, so it can run standalone with a sourced workspace
or through colcon test on a host with vcan.
"""

import os
import subprocess
import time

import pytest

VCAN = os.environ.get("DIRECT_BRIDGE_TEST_VCAN", "vcan1")

# Byte-exact expected TX payloads (verified against the vendored codecs).
# RtDriveCmd 0x204 = big-endian i32 speed_mmps + u8 gear.
GEAR_DRIVE = 2
GEAR_NONE = 0
EXPECT_DRIVE = {
    (1.0, GEAR_DRIVE): "000003e801",
    (-0.3, None): "fffffed403",      # no gear -> reverse by speed sign
    (3.0, GEAR_DRIVE): "00000bb801",
    (0.0, None): "0000000000",       # idle neutral
}


def _run(cmd, check=True, timeout=30):
    proc = subprocess.run(cmd, shell=True, timeout=timeout,
                          capture_output=True, text=True)
    if check and proc.returncode != 0:
        raise RuntimeError(f"command failed ({proc.returncode}): {cmd}\n{proc.stderr}")
    return proc


def _xor8_ff(data):
    v = 0
    for b in data:
        v ^= b
    return v ^ 0xFF


def _setup_vcan():
    """Create and bring up the virtual CAN interface; True on success."""
    _run("modprobe vcan 2>/dev/null || true", check=False)
    _run(f"ip link add dev {VCAN} type vcan 2>/dev/null || true", check=False)
    return _run(f"ip link set {VCAN} up 2>/dev/null || true", check=False).returncode == 0


def _teardown_vcan():
    _run(f"ip link set {VCAN} down 2>/dev/null || true", check=False)
    _run(f"ip link del {VCAN} 2>/dev/null || true", check=False)


def _sniff(timeout=1.5):
    proc = _run(f"timeout {timeout} candump {VCAN} -n 400 2>/dev/null || true", check=False)
    return proc.stdout


def _frame_bytes(line, can_id):
    """Return the data bytes hex for a candump line matching can_id, or None."""
    parts = line.split()
    if len(parts) < 4:
        return None
    if parts[1] != can_id:
        return None
    return "".join(parts[3:]).upper()


def _find_frame(sniff, can_id):
    for line in sniff.splitlines():
        data = _frame_bytes(line, can_id)
        if data is not None:
            return data
    return None


def _inject(frame):
    _run(f"cansend {VCAN} {frame}", check=False)


def _launch_bridge():
    cmd = ("ros2 launch direct_bridge direct_bridge.launch.py "
           f"can_interface:={VCAN}")
    return subprocess.Popen(cmd, shell=True, stdout=subprocess.DEVNULL,
                            stderr=subprocess.DEVNULL)


def _publish(topic, msg_type, args, timeout=10):
    """Publish one message with ros2 topic pub and wait for it to send."""
    _run(f"timeout {timeout} ros2 topic pub -1 {topic} {msg_type} '{args}' "
         "> /dev/null 2>&1 || true", check=False)


def _wait_active(timeout=10.0):
    deadline = time.time() + timeout
    while time.time() < deadline:
        out = _run("timeout 3 ros2 lifecycle get /direct_bridge 2>&1 || true",
                   check=False).stdout
        if "active" in out:
            return True
        time.sleep(0.3)
    return False


def test_signal_loop():
    """Run the full bidirectional signal loop."""
    if not _setup_vcan():
        pytest.skip(f"vcan not available; run on a host with vcan ({VCAN})")

    bridge = _launch_bridge()
    try:
        assert _wait_active(), "direct_bridge did not reach active state"

        # --- Input -> Output: Autoware command -> CAN TX bytes ---
        print("\n[1] Control/Gear -> 0x204 drive bytes")
        for (velocity, gear), expected in EXPECT_DRIVE.items():
            if gear is not None:
                _publish("/control/command/gear_cmd",
                         "autoware_vehicle_msgs/msg/GearCommand",
                         f"{{command: {gear}}}")
            _publish("/control/command/control_cmd",
                     "autoware_control_msgs/msg/Control",
                     "{lateral: {steering_tire_angle: 0.0}, "
                     f"longitudinal: {{velocity: {velocity}, "
                     "is_defined_acceleration: false}}")
            time.sleep(0.2)
            data = _find_frame(_sniff(), "204")
            assert data == expected, (
                f"vel={velocity} gear={gear}: expected 0x204 {expected}, got {data}")
            print(f"  vel={velocity}m/s gear={gear}: 0x204 {data} OK")

        print("\n[2] Steering -> 0x169 angle bytes")
        _publish("/control/command/control_cmd",
                 "autoware_control_msgs/msg/Control",
                 "{lateral: {steering_tire_angle: 0.17453292519943295}, "
                 "longitudinal: {velocity: 1.0, is_defined_acceleration: false}}")
        time.sleep(0.2)
        data = _find_frame(_sniff(), "169")
        assert data is not None, "no 0x169 frame seen"
        assert data[4:8] == "CC74", f"0x169 angle bytes {data}"
        print(f"  +10deg left -> 0x169 raw 29900: {data} OK")

        print("\n[3] Deceleration -> 0x7B9 brake pressure bytes")
        _publish("/control/command/control_cmd",
                 "autoware_control_msgs/msg/Control",
                 "{lateral: {steering_tire_angle: 0.0}, "
                 "longitudinal: {velocity: 1.0, acceleration: -2.0, "
                 "is_defined_acceleration: true}}")
        time.sleep(0.2)
        data = _find_frame(_sniff(), "7B9")
        assert data is not None, "no 0x7B9 frame seen"
        assert (int(data[0:2], 16) & 0x0C) == 0x0C, f"0x7B9 mode bits {data}"
        assert int(data[6:8], 16) == 40, f"0x7B9 pressure {data}"
        print(f"  accel=-2.0 -> 0x7B9 pressure 40: {data} OK")

        print("\n[4] Emergency -> 0x001 broadcast + 0x110 MANUAL")
        _publish("/control/command/emergency_cmd",
                 "tier4_vehicle_msgs/msg/VehicleEmergencyStamped",
                 "{emergency: true}")
        time.sleep(0.4)
        sniff = _sniff()
        assert any(line.split() and line.split()[1] == "001"
                   for line in sniff.splitlines()), "0x001 not seen on emergency"
        data = _find_frame(sniff, "110")
        assert data == "00", f"0x110 expected MANUAL 00, got {data}"
        print("  emergency -> 0x001 + 0x110=00 OK")

        # --- Output -> Input: ECU feedback CAN -> Autoware report values ---
        print("\n[5] CAN feedback -> Autoware reports")
        # velocity: 0x120 speed_mmps 1000 -> 1.0 m/s
        _inject("120#03E8")
        # gear: 0x206 gear_state D(1) -> GearReport DRIVE(2)
        _inject("206#00000100")
        # steering: 0x201 raw 30000 (centered) -> 0.0 rad
        ses_center = "0100307500000000"
        _inject(f"201#{ses_center}{_xor8_ff(bytes.fromhex(ses_center)):02X}")
        time.sleep(0.4)

        vel = _run("timeout 2 ros2 topic echo -1 /vehicle/status/velocity_status "
                   "2>/dev/null || true", check=False).stdout
        gear = _run("timeout 2 ros2 topic echo -1 /vehicle/status/gear_status "
                    "2>/dev/null || true", check=False).stdout
        steer = _run("timeout 2 ros2 topic echo -1 /vehicle/status/steering_status "
                     "2>/dev/null || true", check=False).stdout

        assert "longitudinal_velocity: 1.0" in vel, f"velocity report: {vel}"
        assert "report: 2" in gear, f"gear report: {gear}"
        assert "steering_tire_angle: 0.0" in steer, f"steering report: {steer}"
        print("  0x120->1.0m/s, 0x206->DRIVE(2), 0x201->0.0rad OK")

        print("\n[6] Steering feedback nonzero")
        # raw 30428 = +42.8 deg in wire (right-positive) -> -0.747 rad (left, Autoware)
        ses_off = "0100DC7600000000"
        _inject(f"201#{ses_off}{_xor8_ff(bytes.fromhex(ses_off)):02X}")
        time.sleep(0.4)
        steer = _run("timeout 2 ros2 topic echo -1 /vehicle/status/steering_status "
                     "2>/dev/null || true", check=False).stdout
        assert "steering_tire_angle: -0.747" in steer, f"steering report: {steer}"
        print("  0x201 raw 30428 -> -0.747 rad OK")

        print("\nPASS: full Autoware<->CAN signal loop validated")
    finally:
        bridge.terminate()
        try:
            bridge.wait(timeout=5)
        except subprocess.TimeoutExpired:
            bridge.kill()
        _teardown_vcan()
