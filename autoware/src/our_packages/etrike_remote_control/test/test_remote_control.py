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

"""Unit tests for E-Trike remote control teleoperation node and fail-closed logic."""

from pathlib import Path
import sys
from typing import Any, Dict

# Ensure package root is on sys.path when running via pytest directly
package_root = Path(__file__).resolve().parent.parent
if str(package_root) not in sys.path:
    sys.path.insert(0, str(package_root))

import pytest

from etrike_remote_control.remote_control_node import (
    ControlModeConstants,
    GearConstants,
    HazardLightsConstants,
    RemoteControlNode,
    TurnIndicatorsConstants,
)


def test_node_initialization() -> None:
    """Test node initializes in safe, fail-closed state."""
    node = RemoteControlNode()
    snapshot = node.get_state_snapshot()

    assert snapshot.speed == 0.0
    assert snapshot.acceleration == 0.0
    assert snapshot.steering_angle == 0.0
    assert snapshot.gear == GearConstants.PARK
    assert snapshot.engage is False
    assert snapshot.emergency is False


def test_motion_clamping() -> None:
    """Test speed and steering angle limits are strictly enforced."""
    node = RemoteControlNode()

    # Forward limit clamp
    node.set_motion(speed=10.0, steering_angle=0.0, acceleration=1.0)
    snap = node.get_state_snapshot()
    assert snap.speed <= node.max_speed_forward

    # Reverse limit clamp
    node.set_motion(speed=-10.0, steering_angle=0.0, acceleration=-1.0)
    snap = node.get_state_snapshot()
    assert snap.speed >= -node.max_speed_reverse

    # Steering angle limit clamp (positive and negative)
    node.set_motion(speed=1.0, steering_angle=2.0)
    snap = node.get_state_snapshot()
    assert snap.steering_angle <= node.max_steering_angle

    node.set_motion(speed=1.0, steering_angle=-2.0)
    snap = node.get_state_snapshot()
    assert snap.steering_angle >= -node.max_steering_angle


def test_emergency_stop_fail_closed() -> None:
    """Test emergency stop asserts fail-closed safe state and blocks drive."""
    node = RemoteControlNode()

    # Drive vehicle
    node.set_engage(True)
    node.set_gear(GearConstants.DRIVE)
    node.set_motion(speed=2.0, steering_angle=0.1, acceleration=1.0)
    assert node.get_state_snapshot().speed > 0.0

    # Trigger emergency stop
    node.set_emergency(True)
    snap = node.get_state_snapshot()
    assert snap.emergency is True
    assert snap.speed == 0.0
    assert snap.is_braking is True
    assert snap.gear == GearConstants.PARK
    assert snap.engage is False

    # Attempt drive while emergency is active -> must remain fail-closed
    node.set_motion(speed=2.0, steering_angle=0.1, acceleration=1.0)
    snap_after = node.get_state_snapshot()
    assert snap_after.speed == 0.0
    assert snap_after.is_braking is True

    # Clear emergency
    node.set_emergency(False)
    assert node.get_state_snapshot().emergency is False


def test_engage_locking() -> None:
    """Test engage cannot be asserted while emergency stop is active."""
    node = RemoteControlNode()

    # Normal engage
    node.set_engage(True)
    assert node.get_state_snapshot().engage is True
    node.set_engage(False)
    assert node.get_state_snapshot().engage is False

    # Under emergency
    node.set_emergency(True)
    node.set_engage(True)
    assert node.get_state_snapshot().engage is False


def test_gear_transitions() -> None:
    """Test transmission gear selections."""
    node = RemoteControlNode()

    for gear in (
        GearConstants.PARK,
        GearConstants.REVERSE,
        GearConstants.NEUTRAL,
        GearConstants.DRIVE,
        GearConstants.LOW,
    ):
        node.set_gear(gear)
        assert node.get_state_snapshot().gear == gear


def test_turn_and_hazard_signals() -> None:
    """Test signal lighting commands."""
    node = RemoteControlNode()

    # Turn signals
    node.set_turn_indicators(TurnIndicatorsConstants.ENABLE_LEFT)
    assert node.get_state_snapshot().turn_indicators == TurnIndicatorsConstants.ENABLE_LEFT

    node.set_turn_indicators(TurnIndicatorsConstants.ENABLE_RIGHT)
    assert node.get_state_snapshot().turn_indicators == TurnIndicatorsConstants.ENABLE_RIGHT

    node.set_turn_indicators(TurnIndicatorsConstants.DISABLE)
    assert node.get_state_snapshot().turn_indicators == TurnIndicatorsConstants.DISABLE

    # Hazard lights
    node.set_hazard_lights(HazardLightsConstants.ENABLE)
    assert node.get_state_snapshot().hazard_lights == HazardLightsConstants.ENABLE

    node.set_hazard_lights(HazardLightsConstants.DISABLE)
    assert node.get_state_snapshot().hazard_lights == HazardLightsConstants.DISABLE


def test_fail_closed_on_deactivation() -> None:
    """Test deactivation immediately forces fail-closed state."""
    node = RemoteControlNode()
    node.set_engage(True)
    node.set_gear(GearConstants.DRIVE)
    node.set_motion(speed=1.5, steering_angle=0.15)

    node.deactivate_node()
    snap = node.get_state_snapshot()

    assert snap.speed == 0.0
    assert snap.gear == GearConstants.PARK
    assert snap.engage is False
    assert snap.is_braking is True


def test_telemetry_broadcast_hook() -> None:
    """Test telemetry hook receives published state dictionary."""
    node = RemoteControlNode()
    captured_data: Dict[str, Any] = {}

    def _hook(data: Dict[str, Any]) -> None:
        nonlocal captured_data
        captured_data = data

    node.set_publish_hook(_hook)
    node.set_motion(speed=1.2, steering_angle=-0.1, acceleration=0.8)
    node.set_gear(GearConstants.DRIVE)
    node._publish_current_state()

    assert "speed" in captured_data
    assert captured_data["speed"] == pytest.approx(1.2)
    assert captured_data["steering_angle"] == pytest.approx(-0.1)
    assert captured_data["gear"] == GearConstants.DRIVE


def test_instant_brake_behavior() -> None:
    """Test instant braking cuts speed and sets negative deceleration."""
    node = RemoteControlNode()
    node.set_engage(True)
    node.set_gear(GearConstants.DRIVE)
    node.set_motion(speed=2.5, steering_angle=0.0, acceleration=1.0)
    assert node.get_state_snapshot().speed > 0.0

    # Apply brake
    node.set_motion(speed=0.0, steering_angle=0.0, acceleration=-3.5, is_braking=True)
    snap = node.get_state_snapshot()
    assert snap.speed == 0.0
    assert snap.is_braking is True
    assert snap.acceleration == -3.5


def test_control_mode_service_request() -> None:
    """Test requesting autonomous and manual modes notifies response hook."""
    node = RemoteControlNode()
    last_response: list[tuple[str, bool]] = []

    def _srv_hook(mode_str: str, success: bool) -> None:
        last_response.append((mode_str, success))

    node.set_service_response_hook(_srv_hook)
    node.request_control_mode(ControlModeConstants.AUTONOMOUS)
    assert len(last_response) == 1
    assert last_response[0][0] == "AUTONOMOUS"
    assert last_response[0][1] is True

    node.request_control_mode(ControlModeConstants.MANUAL)
    assert len(last_response) == 2
    assert last_response[1][0] == "MANUAL"
    assert last_response[1][1] is True

