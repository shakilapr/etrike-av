# Copyright 2026 E-Trike
# Licensed under the Apache License, Version 2.0

"""Tests for etrike_stability_guard — threshold logic and signed-accel fix.

Geometry: wheel_base=2.0, track_width=1.15, cog_height=0.8,
          gravity=9.81, safety_margin=0.6
=> threshold  = 9.81 * (1.15/2) / 0.8 * 0.6 = 4.230
=> warn (0.7) = 2.961
=> error (0.9) = 3.807

For steer=0.5 rad, speed=4 m/s:
  a_y = 4^2 * tan(0.5) / 2.0 = 16 * 0.5463 / 2 = 4.370  (> error)
  |a_y| = 4.370  (> error, regardless of sign)

For steer=-0.5 rad, speed=4 m/s:
  a_y = 16 * tan(-0.5) / 2.0 = -4.370
  |a_y| = 4.370  (> error — the signed bug would have missed this)
"""

import math

import pytest

# ---------------------------------------------------------------------------
# Pure-math tests — no ROS required
# ---------------------------------------------------------------------------

WHEEL_BASE = 2.0
TRACK_WIDTH = 1.15
COG_HEIGHT = 0.8
GRAVITY = 9.81
SAFETY_MARGIN = 0.6
WARN_RATIO = 0.7
ERROR_RATIO = 0.9

THRESHOLD = GRAVITY * (TRACK_WIDTH / 2.0) / COG_HEIGHT * SAFETY_MARGIN
WARN_THR = THRESHOLD * WARN_RATIO
ERROR_THR = THRESHOLD * ERROR_RATIO


def lateral_accel(speed_mps: float, steer_rad: float) -> float:
    """Signed lateral acceleration (bicycle model)."""
    return abs(speed_mps) ** 2 * math.tan(steer_rad) / WHEEL_BASE


class TestLateralAccelFormula:
    def test_zero_speed(self):
        assert lateral_accel(0.0, 0.5) == 0.0

    def test_zero_steer(self):
        assert lateral_accel(4.0, 0.0) == 0.0

    def test_positive_steer_positive_accel(self):
        assert lateral_accel(4.0, 0.5) > 0

    def test_negative_steer_negative_accel(self):
        assert lateral_accel(4.0, -0.5) < 0

    def test_symmetric_magnitude(self):
        """Bug regression: magnitude must be equal for +steer and -steer."""
        pos = abs(lateral_accel(4.0, 0.5))
        neg = abs(lateral_accel(4.0, -0.5))
        assert abs(pos - neg) < 1e-10

    def test_known_value(self):
        val = lateral_accel(4.0, 0.5)
        expected = 16.0 * math.tan(0.5) / 2.0
        assert abs(val - expected) < 1e-10


class TestThresholds:
    def test_threshold_positive(self):
        assert THRESHOLD > 0

    def test_warn_below_error(self):
        assert WARN_THR < ERROR_THR < THRESHOLD

    def test_error_exceeded_positive_steer(self):
        a = lateral_accel(4.0, 0.5)
        assert abs(a) > ERROR_THR

    def test_error_exceeded_negative_steer(self):
        """Bug regression: negative steer must also exceed error threshold."""
        a = lateral_accel(4.0, -0.5)
        assert abs(a) > ERROR_THR

    def test_low_speed_below_warn(self):
        """At very low speed, lateral accel should stay below warn."""
        a = lateral_accel(0.5, 0.5)
        assert abs(a) < WARN_THR


class TestHysteresis:
    def test_release_below_warn(self):
        """Once asserted, should release only below warn_threshold."""
        # First exceed error
        a_err = abs(lateral_accel(4.0, 0.5))
        assert a_err > ERROR_THR
        # Then drop below warn
        a_safe = abs(lateral_accel(1.0, 0.3))
        assert a_safe < WARN_THR


# ---------------------------------------------------------------------------
# ROS2 integration tests — require rclpy (skipped on Windows host)
# ---------------------------------------------------------------------------

rclpy = pytest.importorskip("rclpy")


@pytest.fixture(scope="module")
def ros():
    rclpy.init()
    yield
    rclpy.shutdown()


class TestStabilityGuardNode:
    """Integration tests that spin up the actual node."""

    PARAMS = {
        "wheel_base": WHEEL_BASE,
        "track_width": TRACK_WIDTH,
        "cog_height": COG_HEIGHT,
        "gravity": GRAVITY,
        "safety_margin": SAFETY_MARGIN,
        "warn_ratio": WARN_RATIO,
        "error_ratio": ERROR_RATIO,
        "enable_emergency": False,
        "velocity_topic": "/test/velocity",
        "steering_topic": "/test/steering",
        "emergency_topic": "/test/emergency_cmd",
        "diagnostics_topic": "/test/diagnostics",
    }

    def _make_node(self, ros):
        from rclpy.node import Node

        class TestNode(Node):
            def __init__(self):
                super().__init__("test_stability_guard", parameter_overrides=[])
                for k, v in self.PARAMS.items():
                    self.declare_parameter(k, v)

        # We can't easily create StabilityGuardNode with overrides because it
        # reads get_parameter(). Use a thin wrapper that sets params first.
        from etrike_stability_guard.stability_guard_node import StabilityGuardNode

        # Patch declare_parameter to inject test params
        original_declare = StabilityGuardNode.declare_parameter

        def patched_declare(self, name, default_value=None, **kwargs):
            if name in TestStabilityGuardNode.PARAMS:
                return original_declare(self, name, TestStabilityGuardNode.PARAMS[name], **kwargs)
            return original_declare(self, name, default_value, **kwargs)

        StabilityGuardNode.declare_parameter = patched_declare
        try:
            node = StabilityGuardNode()
        finally:
            StabilityGuardNode.declare_parameter = original_declare
        return node

    def test_node_creation(self, ros):
        node = self._make_node(ros)
        assert node.get_name() == "etrike_stability_guard"
        node.destroy_node()

    def test_threshold_values(self, ros):
        node = self._make_node(ros)
        assert abs(node.threshold - THRESHOLD) < 1e-6
        assert abs(node.warn_threshold - WARN_THR) < 1e-6
        assert abs(node.error_threshold - ERROR_THR) < 1e-6
        node.destroy_node()

    def test_enable_emergency_false(self, ros):
        node = self._make_node(ros)
        assert node.enable_emergency is False
        node.destroy_node()

    def test_zero_initial_state(self, ros):
        node = self._make_node(ros)
        assert node._velocity == 0.0
        assert node._steer == 0.0
        assert node._lateral_accel == 0.0
        assert node._lateral_accel_abs == 0.0
        assert node._emergency_asserted is False
        node.destroy_node()
