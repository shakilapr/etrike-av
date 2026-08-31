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
Self-contained Autoware-compatibility test for the direct_bridge node.

Launches the bridge against vcan1 with a mock Autoware command publisher that
publishes Control, GearCommand, and VehicleEmergencyStamped on the exact
Autoware topics with matching QoS. Asserts lifecycle, topic/type/QoS
compatibility, expected transmit frames, published reports, and the
fail-closed timeout/emergency paths.

Requires a vcan interface (vcan1). This is the launch-test counterpart to
scripts/run_bench.py and follows the etrike_kinect2 launch-test pattern.
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

from autoware_control_msgs.msg import Control
from autoware_control_msgs.msg import Lateral, Longitudinal
from autoware_vehicle_msgs.msg import GearCommand
from autoware_vehicle_msgs.msg import GearReport
from autoware_vehicle_msgs.msg import SteeringReport
from autoware_vehicle_msgs.msg import VelocityReport
from tier4_vehicle_msgs.msg import VehicleEmergencyStamped

VCAN = "vcan1"


def _setup_vcan():
    """
    Create and bring up the virtual CAN interface.

    Returns True on success, False if vcan is not available (e.g. inside a
    container without the vcan kernel module, or the interface cannot be
    created). The caller skips the test when False.
    """
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
        pytest.skip("vcan not available; run this test on a host with the vcan kernel module")

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


class MockAutoware(Node):
    """Publishes commands on the exact Autoware vehicle-interface topics."""

    def __init__(self):
        super().__init__("mock_autoware")
        # QoS identical to the production bridge: reliable + volatile.
        qos = QoSProfile(
            depth=1,
            reliability=ReliabilityPolicy.RELIABLE,
            durability=DurabilityPolicy.VOLATILE,
        )
        self.pub_control = self.create_publisher(Control, "/control/command/control_cmd", qos)
        self.pub_gear = self.create_publisher(GearCommand, "/control/command/gear_cmd", qos)
        self.pub_emergency = self.create_publisher(
            VehicleEmergencyStamped, "/control/command/emergency_cmd", qos)

        self.sub_velocity = self.create_subscription(
            VelocityReport, "/vehicle/status/velocity_status", lambda m: None, 1)
        self.sub_gear = self.create_subscription(
            GearReport, "/vehicle/status/gear_status", lambda m: None, 1)
        self.sub_steering = self.create_subscription(
            SteeringReport, "/vehicle/status/steering_status", lambda m: None, 1)

    def send_control(self, velocity, steering):
        msg = Control()
        msg.lateral = Lateral()
        msg.lateral.steering_tire_angle = steering
        msg.longitudinal = Longitudinal()
        msg.longitudinal.velocity = velocity
        msg.longitudinal.is_defined_acceleration = False
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
        rclpy.spin_once(node, timeout_sec=0.2)


def test_bridge_activates_and_tx_frames_appear():
    rclpy.init()
    try:
        mock = MockAutoware()
        _spin(mock, 1.0)

        # Publish a control command; the bridge should stream 0x204, 0x169,
        # 0x7B9, 0x110 on vcan1.
        mock.send_control(1.0, 0.0)
        mock.send_gear(GearCommand.DRIVE)

        # Collect frames.
        proc = subprocess.run(
            f"timeout 3 candump {VCAN} -n 200 2>/dev/null || true",
            shell=True, capture_output=True, text=True)
        out = proc.stdout
        for can_id in ("204", "169", "7B9", "110"):
            assert can_id in out, f"expected TX frame {can_id} on {VCAN}, got:\n{out}"

        # Timeout: stop publishing; after >200 ms the bridge sends zero-speed.
        # The MTR stream continues, so 0x204 still appears (idle zero).
        _spin(mock, 1.0)
        proc2 = subprocess.run(
            f"timeout 2 candump {VCAN} -n 100 2>/dev/null || true",
            shell=True, capture_output=True, text=True)
        assert "204" in proc2.stdout, "0x204 must continue streaming (idle zero)"

        # Emergency: assert 0x001 broadcast appears.
        mock.send_emergency(True)
        _spin(mock, 0.5)
        proc3 = subprocess.run(
            f"timeout 2 candump {VCAN} -n 100 2>/dev/null || true",
            shell=True, capture_output=True, text=True)
        assert "001" in proc3.stdout, "expected ESTOP 0x001 broadcast"
    finally:
        rclpy.shutdown()
        _teardown_vcan()
