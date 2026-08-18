# Copyright 2026 E-Trike
# Licensed under the Apache License, Version 2.0

"""Roll / tip-over stability guard for the E-Trike three-wheeler.

Autoware is a fully planar (2D) stack: it has no model of lateral load
transfer or rollover. A tall, narrow three-wheeler can tip in a hard turn
long before any path or obstacle check flags a problem.

This node estimates the vehicle's lateral acceleration from the *actual*
state (velocity + steering angle) using the kinematic bicycle relation

    a_y = v^2 * tan(steer) / wheel_base

and compares it to a tipping threshold derived from the track width and the
height of the centre of gravity:

    a_tip = g * (track_width / 2) / cog_height

It publishes a diagnostic with the live lateral acceleration, and -- when
``enable_emergency`` is true -- asserts Autoware's existing emergency stop
(``/control/command/emergency_cmd``) once the error threshold is crossed,
releasing it only after the value falls back below the warn threshold
(hysteresis, to avoid chatter).

The node is purely a monitor by default (``enable_emergency`` defaults to
false); tune the geometry params on the real vehicle before enabling the
cut. A future command-limiter could scale velocity instead of cutting.
"""

import math

import rclpy
from rclpy.node import Node

from autoware_vehicle_msgs.msg import SteeringReport, VelocityReport
from diagnostic_msgs.msg import DiagnosticArray, DiagnosticStatus, KeyValue
from tier4_vehicle_msgs.msg import VehicleEmergencyStamped


class StabilityGuardNode(Node):
    def __init__(self) -> None:
        super().__init__("etrike_stability_guard")

        self.declare_parameter("wheel_base", 2.0)
        self.declare_parameter("track_width", 1.15)
        self.declare_parameter("cog_height", 0.8)
        self.declare_parameter("gravity", 9.81)
        self.declare_parameter("safety_margin", 0.6)
        self.declare_parameter("warn_ratio", 0.7)
        self.declare_parameter("error_ratio", 0.9)
        self.declare_parameter("enable_emergency", False)
        self.declare_parameter("velocity_topic", "/vehicle/status/velocity_status")
        self.declare_parameter("steering_topic", "/vehicle/status/steering_status")
        self.declare_parameter("emergency_topic", "/control/command/emergency_cmd")
        self.declare_parameter("diagnostics_topic", "/diagnostics")

        # Launch passes these as strings (LaunchConfiguration), so coerce
        # explicitly. Without this the node crashes on `str * float` and the
        # "monitor-only" default would be misread as truthy (emergency ON).
        def as_float(name: str) -> float:
            return float(self.get_parameter(name).value)

        wheel_base = as_float("wheel_base")
        track_width = as_float("track_width")
        cog_height = as_float("cog_height")
        gravity = as_float("gravity")
        safety_margin = as_float("safety_margin")
        warn_ratio = as_float("warn_ratio")
        error_ratio = as_float("error_ratio")
        self.enable_emergency = str(self.get_parameter("enable_emergency").value).lower() in (
            "true",
            "1",
            "yes",
        )

        if wheel_base <= 0.0 or track_width <= 0.0 or cog_height <= 0.0:
            raise ValueError("wheel_base, track_width and cog_height must be positive")

        # Tipping threshold for lateral acceleration, then operating bands.
        self.threshold = gravity * (track_width / 2.0) / cog_height * safety_margin
        self.warn_threshold = self.threshold * warn_ratio
        self.error_threshold = self.threshold * error_ratio

        self.velocity_topic = self.get_parameter("velocity_topic").value
        self.steering_topic = self.get_parameter("steering_topic").value
        emergency_topic = self.get_parameter("emergency_topic").value
        diagnostics_topic = self.get_parameter("diagnostics_topic").value

        self._velocity = 0.0
        self._steer = 0.0
        self._lateral_accel = 0.0  # signed (positive = right turn)
        self._lateral_accel_abs = 0.0  # magnitude — used for threshold logic
        self._emergency_asserted = False

        self.sub_velocity = self.create_subscription(
            VelocityReport, self.velocity_topic, self.on_velocity, 10
        )
        self.sub_steering = self.create_subscription(
            SteeringReport, self.steering_topic, self.on_steering, 10
        )
        self.diag_pub = self.create_publisher(DiagnosticArray, diagnostics_topic, 10)
        self.estop_pub = self.create_publisher(VehicleEmergencyStamped, emergency_topic, 10)

        # Throttled diagnostics so the topic is not flooded at sensor rate.
        self.timer = self.create_timer(0.1, self.publish_diagnostics)

        self.get_logger().info(
            f"stability guard initialised: threshold={self.threshold:.2f} m/s^2 "
            f"(warn={self.warn_threshold:.2f}, error={self.error_threshold:.2f}), "
            f"emergency={'ENABLED' if self.enable_emergency else 'disabled (monitor only)'}"
        )

    def on_velocity(self, msg: VelocityReport) -> None:
        self._velocity = float(msg.longitudinal_velocity)
        self.update()

    def on_steering(self, msg: SteeringReport) -> None:
        self._steer = float(msg.steering_tire_angle)
        self.update()

    def update(self) -> None:
        speed = abs(self._velocity)
        # a_y = v^2 * tan(steer) / L  (kinematic bicycle model, planar)
        wheel_base = self.get_wheel_base()
        self._lateral_accel = speed * speed * math.tan(self._steer) / wheel_base
        # Threshold logic uses magnitude — tip-over risk is direction-agnostic.
        self._lateral_accel_abs = abs(self._lateral_accel)

        if not self.enable_emergency:
            return

        if self._lateral_accel_abs > self.error_threshold and not self._emergency_asserted:
            self._emergency_asserted = True
            self.publish_emergency(True)
            self.get_logger().error(
                f"TIP-OVER RISK: |a_y|={self._lateral_accel_abs:.2f} > "
                f"{self.error_threshold:.2f} m/s^2 -- asserting emergency stop"
            )
        elif self._emergency_asserted and self._lateral_accel_abs < self.warn_threshold:
            self._emergency_asserted = False
            self.publish_emergency(False)
            self.get_logger().info("lateral acceleration back in band -- releasing emergency stop")

    def get_wheel_base(self) -> float:
        return float(self.get_parameter("wheel_base").value)

    def publish_emergency(self, value: bool) -> None:
        msg = VehicleEmergencyStamped()
        msg.stamp = self.get_clock().now().to_msg()
        msg.emergency = value
        self.estop_pub.publish(msg)

    def publish_diagnostics(self) -> None:
        array = DiagnosticArray()
        array.header.stamp = self.get_clock().now().to_msg()

        status = DiagnosticStatus()
        status.name = "etrike_stability/lateral_acceleration"
        status.hardware_id = "etrike"

        if self._lateral_accel_abs >= self.error_threshold:
            status.level = DiagnosticStatus.ERROR
            status.message = "above tip-over error threshold"
        elif self._lateral_accel_abs >= self.warn_threshold:
            status.level = DiagnosticStatus.WARN
            status.message = "approaching tip-over threshold"
        else:
            status.level = DiagnosticStatus.OK
            status.message = "within stable band"

        def kv(key: str, value: str) -> None:
            item = KeyValue()
            item.key = key
            item.value = value
            status.values.append(item)

        kv("lateral_accel_mps2", f"{self._lateral_accel:.3f}")
        kv("lateral_accel_magnitude_mps2", f"{self._lateral_accel_abs:.3f}")
        kv("threshold_mps2", f"{self.threshold:.3f}")
        kv("warn_mps2", f"{self.warn_threshold:.3f}")
        kv("error_mps2", f"{self.error_threshold:.3f}")
        kv("speed_mps", f"{abs(self._velocity):.3f}")
        kv("steer_rad", f"{self._steer:.4f}")
        kv("emergency_enabled", str(self.enable_emergency))
        kv("emergency_asserted", str(self._emergency_asserted))

        array.status.append(status)
        self.diag_pub.publish(array)


def main(args=None) -> None:
    rclpy.init(args=args)
    node = StabilityGuardNode()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == "__main__":
    main()
