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

Requires a vcan interface (vcan1). Skips when vcan is unavailable. Follows the
launch-test pattern of test_autoware_compat.py.
"""

import subprocess
import time

import launch
import launch_ros.actions
import launch_ros.events.lifecycle
import launch_testing
import pytest
import rclpy
import lifecycle_msgs.msg
from launch.actions import EmitEvent, RegisterEventHandler
from launch.events import matches_action
from launch_ros.actions import LifecycleNode
from launch_ros.event_handlers import OnStateTransition
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy

from autoware_control_msgs.msg import Control, Lateral, Longitudinal
from autoware_vehicle_msgs.msg import GearCommand
from autoware_vehicle_msgs.msg import GearReport
from autoware_vehicle_msgs.msg import SteeringReport
from autoware_vehicle_msgs.msg import VelocityReport
from tier4_vehicle_msgs.msg import VehicleEmergencyStamped

VCAN = "vcan1"

# Byte-exact expected TX payloads (verified against the vendored codecs).
# RtDriveCmd 0x204 = big-endian i32 speed_mmps + u8 gear.
EXPECT_DRIVE = {
    (1.0, GearCommand.DRIVE): "000003e801",
    (-0.3, None): "fffffed403",      # no gear -> reverse by speed sign
    (3.0, GearCommand.DRIVE): "00000bb801",
    (0.0, None): "0000000000",       # idle neutral
}


def _xor8_ff(data):
    v = 0
    for b in data:
        v ^= b
    return v ^ 0xFF


def _setup_vcan():
    """Create and bring up the virtual CAN interface; True on success."""
    subprocess.run("modprobe vcan 2>/dev/null || true", shell=True)
    subprocess.run(f"ip link add dev {VCAN} type vcan 2>/dev/null || true", shell=True)
    proc = subprocess.run(f"ip link set {VCAN} up 2>/dev/null || true", shell=True)
    return proc.returncode == 0


def _teardown_vcan():
    subprocess.run(f"ip link set {VCAN} down 2>/dev/null || true", shell=True)
    subprocess.run(f"ip link del {VCAN} 2>/dev/null || true", shell=True)


@pytest.mark.launch_test
def generate_test_description():
    if not _setup_vcan():
        pytest.skip("vcan not available; run on a host with the vcan kernel module")

    bridge = LifecycleNode(
        package="direct_bridge",
        executable="direct_bridge_node",
        name="direct_bridge",
        namespace="",
        output="screen",
        parameters=[{"can_interface": VCAN}],
    )

    configure = EmitEvent(
        event=launch_ros.events.lifecycle.ChangeState(
            lifecycle_node_matcher=matches_action(bridge),
            transition_id=lifecycle_msgs.msg.Transition.TRANSITION_CONFIGURE,
        )
    )
    activate = EmitEvent(
        event=launch_ros.events.lifecycle.ChangeState(
            lifecycle_node_matcher=matches_action(bridge),
            transition_id=lifecycle_msgs.msg.Transition.TRANSITION_ACTIVATE,
        )
    )
    activate_when_inactive = RegisterEventHandler(
        OnStateTransition(
            target_lifecycle_node=bridge,
            goal_state="inactive",
            entities=[activate],
        )
    )

    return launch.LaunchDescription([
        activate_when_inactive,
        bridge,
        configure,
        launch_testing.actions.ReadyToTest(),
    ])


class SignalSource(Node):
    """Publishes Autoware commands and subscribes to Autoware reports."""

    def __init__(self):
        super().__init__("direct_bridge_signal_source")
        qos = QoSProfile(
            depth=1,
            reliability=ReliabilityPolicy.RELIABLE,
            durability=DurabilityPolicy.VOLATILE,
        )
        self.pub_control = self.create_publisher(Control, "/control/command/control_cmd", qos)
        self.pub_gear = self.create_publisher(GearCommand, "/control/command/gear_cmd", qos)
        self.pub_emergency = self.create_publisher(
            VehicleEmergencyStamped, "/control/command/emergency_cmd", qos)

        self.velocities = []
        self.gears = []
        self.steerings = []
        self.create_subscription(
            VelocityReport, "/vehicle/status/velocity_status",
            lambda m: self.velocities.append(m.longitudinal_velocity), 1)
        self.create_subscription(
            GearReport, "/vehicle/status/gear_status",
            lambda m: self.gears.append(m.report), 1)
        self.create_subscription(
            SteeringReport, "/vehicle/status/steering_status",
            lambda m: self.steerings.append(m.steering_tire_angle), 1)

    def send_control(self, velocity, steering=0.0, accel=None):
        msg = Control()
        msg.lateral = Lateral()
        msg.lateral.steering_tire_angle = steering
        msg.longitudinal = Longitudinal()
        msg.longitudinal.velocity = velocity
        msg.longitudinal.acceleration = 0.0 if accel is None else accel
        msg.longitudinal.is_defined_acceleration = accel is not None
        self.pub_control.publish(msg)

    def send_gear(self, command):
        msg = GearCommand()
        msg.command = command
        self.pub_gear.publish(msg)

    def send_emergency(self, emergency):
        msg = VehicleEmergencyStamped()
        msg.emergency = emergency
        self.pub_emergency.publish(msg)


def _spin(node, duration):
    deadline = time.time() + duration
    while time.time() < deadline:
        rclpy.spin_once(node, timeout_sec=0.1)


def _sniff(interface, timeout=2.0):
    proc = subprocess.run(
        f"timeout {timeout} candump {interface} -n 400 2>/dev/null || true",
        shell=True, capture_output=True, text=True)
    return proc.stdout


def _frame_bytes(line, can_id):
    """Return the data bytes hex for a candump line matching can_id, or None.

    candump default format:
        <iface>  <id>  [dlc]  bb bb bb bb ... bb
    So the data bytes begin at token index 3.
    """
    parts = line.split()
    if len(parts) < 4:
        return None
    if parts[1] != can_id:
        return None
    return "".join(parts[3:]).upper()


def _inject(interface, frame):
    subprocess.run(f"cansend {interface} {frame}", shell=True, check=False)


def test_signal_loop():
    """Run the full bidirectional signal loop."""
    rclpy.init()
    try:
        source = SignalSource()
        _spin(source, 1.0)

        # --- Input -> Output: Autoware command -> CAN TX bytes ---
        print("\n[1] Control/Gear -> 0x204 drive bytes")
        for (velocity, gear), expected in EXPECT_DRIVE.items():
            source.velocities.clear()
            source.send_gear(gear) if gear is not None else None
            source.send_control(velocity)
            _spin(source, 0.3)
            sniff = _sniff(VCAN, timeout=1.0)
            found = None
            for line in sniff.splitlines():
                data = _frame_bytes(line, "204")
                if data:
                    found = data
                    break
            assert found == expected, (
                f"vel={velocity} gear={gear}: expected 0x204 {expected}, got {found}")
            print(f"  vel={velocity}m/s gear={gear}: 0x204 {found} OK")

        print("\n[2] Steering -> 0x169 angle bytes")
        # +10 deg left (Autoware) -> wire right-positive -10 deg -> raw 29900 (0x74CC LE)
        source.send_control(1.0, steering=10.0 * 3.141592653589793 / 180.0)
        _spin(source, 0.3)
        sniff = _sniff(VCAN, timeout=1.0)
        angle_found = None
        for line in sniff.splitlines():
            data = _frame_bytes(line, "169")
            if data:
                angle_found = data
                break
        assert angle_found is not None, "no 0x169 frame seen"
        # bytes 2-3 are LE i16 target_angle_raw; expect 0x74CC -> "CC 74" at offset 4..6
        assert angle_found[4:8] == "CC74", f"0x169 angle bytes {angle_found}"
        print(f"  +10deg left -> 0x169 raw 29900: {angle_found} OK")

        print("\n[3] Deceleration -> 0x7B9 brake pressure bytes")
        source.send_control(1.0, accel=-2.0)
        _spin(source, 0.3)
        sniff = _sniff(VCAN, timeout=1.0)
        brake_found = None
        for line in sniff.splitlines():
            data = _frame_bytes(line, "7B9")
            if data:
                brake_found = data
                break
        assert brake_found is not None, "no 0x7B9 frame seen"
        # pressure mode: byte0 bit2 set (0x04) + auto_brake (0x08); byte3 = 40 (0x28)
        assert (int(brake_found[0:2], 16) & 0x0C) == 0x0C, f"0x7B9 mode bits {brake_found}"
        assert int(brake_found[6:8], 16) == 40, f"0x7B9 pressure {brake_found}"
        print(f"  accel=-2.0 -> 0x7B9 pressure 40: {brake_found} OK")

        print("\n[4] Emergency -> 0x001 broadcast + 0x110 MANUAL")
        source.send_emergency(True)
        _spin(source, 0.5)
        sniff = _sniff(VCAN, timeout=1.0)
        assert any(line.split() and line.split()[1] == "001"
                   for line in sniff.splitlines()), "0x001 not seen on emergency"
        mode_manual = None
        for line in sniff.splitlines():
            data = _frame_bytes(line, "110")
            if data:
                mode_manual = data
                break
        assert mode_manual == "00", f"0x110 expected MANUAL 00, got {mode_manual}"
        print("  emergency -> 0x001 + 0x110=00 OK")

        # --- Output -> Input: ECU feedback CAN -> Autoware report values ---
        print("\n[5] CAN feedback -> Autoware reports")
        # velocity: 0x120 speed_mmps 1000 -> 1.0 m/s
        _inject(VCAN, "120#03E8")
        # gear: 0x206 gear_state D(1) -> GearReport DRIVE(2)
        _inject(VCAN, "206#00000100")
        # steering: 0x201 raw 30000 (centered) -> 0.0 rad
        ses_center = "0100307500000000" + f"{_xor8_ff(bytes.fromhex('0100307500000000')):02X}"
        _inject(VCAN, f"201#{ses_center}")
        _spin(source, 0.5)

        assert any(abs(v - 1.0) < 1e-6 for v in source.velocities), \
            f"velocity report expected 1.0, got {source.velocities}"
        assert any(g == 2 for g in source.gears), \
            f"gear report expected DRIVE(2), got {source.gears}"
        assert any(abs(s) < 1e-6 for s in source.steerings), \
            f"steering report expected 0.0, got {source.steerings}"
        print(f"  0x120->1.0m/s, 0x206->DRIVE(2), 0x201->0.0rad OK")

        print("\n[6] Steering feedback nonzero")
        source.steerings.clear()
        ses_off = "0100DC7600000000" + f"{_xor8_ff(bytes.fromhex('0100DC7600000000')):02X}"
        _inject(VCAN, f"201#{ses_off}")  # raw 30428 -> ~+0.747 rad
        _spin(source, 0.5)
        assert any(abs(s - 0.747) < 0.01 for s in source.steerings), \
            f"steering report expected ~0.747, got {source.steerings}"
        print(f"  0x201 raw 30428 -> ~0.747 rad OK")

        print("\nPASS: full Autoware<->CAN signal loop validated")
    finally:
        rclpy.shutdown()
        _teardown_vcan()
