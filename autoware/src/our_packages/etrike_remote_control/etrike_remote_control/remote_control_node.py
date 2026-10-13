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

"""ROS 2 Lifecycle Node for vehicle bridge remote control teleoperation."""

from dataclasses import dataclass
import threading
from typing import Any, Callable, Dict, Optional, Tuple

# Attempt ROS 2 imports; fall back cleanly if running standalone / test without ROS 2
try:
    import rclpy
    from rclpy.node import Node
    from rclpy.qos import DurabilityPolicy, QoSProfile, ReliabilityPolicy
    from rclpy.timer import Timer

    try:
        from rclpy.lifecycle import LifecycleNode, TransitionCallbackReturn
        HAS_LIFECYCLE_LIB = True
    except ImportError:
        HAS_LIFECYCLE_LIB = False
        LifecycleNode = Node  # type: ignore[misc, assignment]
        TransitionCallbackReturn = None  # type: ignore[misc, assignment]

    from autoware_control_msgs.msg import Control, Lateral, Longitudinal
    from autoware_vehicle_msgs.msg import (
        Engage,
        GearCommand,
        HazardLightsCommand,
        TurnIndicatorsCommand,
    )
    from autoware_vehicle_msgs.srv import ControlModeCommand
    from tier4_vehicle_msgs.msg import VehicleEmergencyStamped
    HAS_ROS2 = True
except ImportError:
    HAS_ROS2 = False
    HAS_LIFECYCLE_LIB = False
    LifecycleNode = object  # type: ignore[misc, assignment]
    Node = object  # type: ignore[misc, assignment]


class GearConstants:
    """Autoware Universe GearCommand enumeration."""

    NONE: int = 0
    NEUTRAL: int = 1
    DRIVE: int = 2
    REVERSE: int = 20
    PARK: int = 22
    LOW: int = 23


class TurnIndicatorsConstants:
    """Autoware Universe TurnIndicatorsCommand enumeration."""

    NO_COMMAND: int = 0
    DISABLE: int = 1
    ENABLE_LEFT: int = 2
    ENABLE_RIGHT: int = 3


class HazardLightsConstants:
    """Autoware Universe HazardLightsCommand enumeration."""

    NO_COMMAND: int = 0
    DISABLE: int = 1
    ENABLE: int = 2


class ControlModeConstants:
    """Autoware Universe ControlModeCommand service mode enumeration."""

    NO_COMMAND: int = 0
    AUTONOMOUS: int = 1
    MANUAL: int = 2


@dataclass
class VehicleControlState:
    """Thread-safe snapshot of vehicle command outputs."""

    speed: float = 0.0
    acceleration: float = 0.0
    is_defined_accel: bool = True
    steering_angle: float = 0.0
    steering_rate: float = 0.0
    is_defined_steering_rate: bool = False
    gear: int = GearConstants.PARK
    turn_indicators: int = TurnIndicatorsConstants.DISABLE
    hazard_lights: int = HazardLightsConstants.DISABLE
    engage: bool = False
    emergency: bool = False
    is_braking: bool = False


class RemoteControlNode(LifecycleNode if (HAS_ROS2 and HAS_LIFECYCLE_LIB) else (Node if HAS_ROS2 else object)):
    """ROS 2 Lifecycle Node for publishing direct vehicle bridge control messages."""

    def __init__(self, node_name: str = "etrike_remote_control") -> None:
        self._is_mock = not HAS_ROS2
        self._node_name = node_name
        self._mutex = threading.RLock()
        self._state = VehicleControlState()

        # Telemetry / broadcast callbacks for GUI monitoring
        self._on_publish_hook: Optional[Callable[[Dict[str, Any]], None]] = None
        self._on_service_response_hook: Optional[Callable[[str, bool], None]] = None

        # Vehicle limits
        self.max_speed_forward: float = 2.78
        self.max_speed_reverse: float = 0.50
        self.max_steering_angle: float = 0.314
        self.max_acceleration: float = 2.0
        self.max_deceleration: float = 5.0
        self.publish_rate_hz: float = 25.0

        # Topic names
        self.control_topic: str = "/control/command/control_cmd"
        self.gear_topic: str = "/control/command/gear_cmd"
        self.turn_topic: str = "/control/command/turn_indicators_cmd"
        self.hazard_topic: str = "/control/command/hazard_lights_cmd"
        self.engage_topic: str = "/api/autoware/get/engage"
        self.emergency_topic: str = "/control/command/emergency_cmd"
        self.control_mode_service: str = "/control/control_mode_request"

        # Publishers & Services
        self._pub_control: Any = None
        self._pub_gear: Any = None
        self._pub_turn: Any = None
        self._pub_hazard: Any = None
        self._pub_engage: Any = None
        self._pub_emergency: Any = None
        self._cli_control_mode: Any = None
        self._timer_publish: Any = None
        self._is_active: bool = False

        if HAS_ROS2:
            super().__init__(node_name)
            self._declare_and_load_parameters()
            self._setup_ros_interfaces()
        else:
            self._is_active = True

    @property
    def is_mock(self) -> bool:
        """Return True if running in mock / simulation fallback mode."""
        return self._is_mock

    @property
    def is_active(self) -> bool:
        """Return True if active and publishing."""
        return self._is_active

    def set_publish_hook(self, hook: Optional[Callable[[Dict[str, Any]], None]]) -> None:
        """Register a callback invoked whenever a control packet is broadcast."""
        self._on_publish_hook = hook

    def set_service_response_hook(self, hook: Optional[Callable[[str, bool], None]]) -> None:
        """Register a callback for service call results."""
        self._on_service_response_hook = hook

    def _declare_and_load_parameters(self) -> None:
        """Declare and read node parameters."""
        if not HAS_ROS2:
            return

        self.declare_parameter("control_topic", self.control_topic)
        self.declare_parameter("gear_topic", self.gear_topic)
        self.declare_parameter("turn_topic", self.turn_topic)
        self.declare_parameter("hazard_topic", self.hazard_topic)
        self.declare_parameter("engage_topic", self.engage_topic)
        self.declare_parameter("emergency_topic", self.emergency_topic)
        self.declare_parameter("control_mode_service", self.control_mode_service)

        self.declare_parameter("max_speed_forward", self.max_speed_forward)
        self.declare_parameter("max_speed_reverse", self.max_speed_reverse)
        self.declare_parameter("max_steering_angle", self.max_steering_angle)
        self.declare_parameter("max_acceleration", self.max_acceleration)
        self.declare_parameter("max_deceleration", self.max_deceleration)
        self.declare_parameter("publish_rate_hz", self.publish_rate_hz)

        self.control_topic = str(self.get_parameter("control_topic").value)
        self.gear_topic = str(self.get_parameter("gear_topic").value)
        self.turn_topic = str(self.get_parameter("turn_topic").value)
        self.hazard_topic = str(self.get_parameter("hazard_topic").value)
        self.engage_topic = str(self.get_parameter("engage_topic").value)
        self.emergency_topic = str(self.get_parameter("emergency_topic").value)
        self.control_mode_service = str(self.get_parameter("control_mode_service").value)

        self.max_speed_forward = float(self.get_parameter("max_speed_forward").value)
        self.max_speed_reverse = float(self.get_parameter("max_speed_reverse").value)
        self.max_steering_angle = float(self.get_parameter("max_steering_angle").value)
        self.max_acceleration = float(self.get_parameter("max_acceleration").value)
        self.max_deceleration = float(self.get_parameter("max_deceleration").value)
        self.publish_rate_hz = float(self.get_parameter("publish_rate_hz").value)

    def _setup_ros_interfaces(self) -> None:
        """Create publishers and service clients."""
        qos = QoSProfile(
            depth=1,
            reliability=ReliabilityPolicy.RELIABLE,
            durability=DurabilityPolicy.VOLATILE,
        )

        create_pub = self.create_lifecycle_publisher if (HAS_LIFECYCLE_LIB and hasattr(self, "create_lifecycle_publisher")) else self.create_publisher

        self._pub_control = create_pub(Control, self.control_topic, qos)
        self._pub_gear = create_pub(GearCommand, self.gear_topic, qos)
        self._pub_turn = create_pub(TurnIndicatorsCommand, self.turn_topic, qos)
        self._pub_hazard = create_pub(HazardLightsCommand, self.hazard_topic, qos)
        self._pub_engage = create_pub(Engage, self.engage_topic, qos)
        self._pub_emergency = create_pub(VehicleEmergencyStamped, self.emergency_topic, qos)

        self._cli_control_mode = self.create_client(ControlModeCommand, self.control_mode_service)

    def activate_node(self) -> bool:
        """Activate command publishing timer."""
        with self._mutex:
            if self._is_active:
                return True
            self._is_active = True

            if HAS_ROS2:
                timer_period = 1.0 / max(1.0, self.publish_rate_hz)
                self._timer_publish = self.create_timer(timer_period, self._on_publish_tick)
            return True

    def deactivate_node(self) -> bool:
        """Deactivate command publishing timer and fail closed."""
        with self._mutex:
            self._is_active = False
            if HAS_ROS2 and self._timer_publish is not None:
                self.destroy_timer(self._timer_publish)
                self._timer_publish = None

            # Fail-closed command upon deactivation
            self._apply_fail_closed_state()
            self._publish_current_state()
            return True

    # ---- Lifecycle Callbacks ----
    def on_configure(self, state: Any) -> Any:
        """Lifecycle configure transition."""
        self._declare_and_load_parameters()
        self._setup_ros_interfaces()
        return TransitionCallbackReturn.SUCCESS if TransitionCallbackReturn else 0

    def on_activate(self, state: Any) -> Any:
        """Lifecycle activate transition."""
        self.activate_node()
        return TransitionCallbackReturn.SUCCESS if TransitionCallbackReturn else 0

    def on_deactivate(self, state: Any) -> Any:
        """Lifecycle deactivate transition."""
        self.deactivate_node()
        return TransitionCallbackReturn.SUCCESS if TransitionCallbackReturn else 0

    def on_cleanup(self, state: Any) -> Any:
        """Lifecycle cleanup transition."""
        self.deactivate_node()
        return TransitionCallbackReturn.SUCCESS if TransitionCallbackReturn else 0

    def on_shutdown(self, state: Any) -> Any:
        """Lifecycle shutdown transition."""
        self.deactivate_node()
        return TransitionCallbackReturn.SUCCESS if TransitionCallbackReturn else 0

    # ---- State Setters (Thread-Safe) ----
    def set_motion(
        self,
        speed: float,
        steering_angle: float,
        acceleration: float = 0.0,
        is_braking: bool = False,
    ) -> None:
        """Update commanded longitudinal speed, steering angle, and braking state."""
        with self._mutex:
            if self._state.emergency:
                # If emergency stop is active, reject motion command
                self._state.speed = 0.0
                self._state.acceleration = -self.max_deceleration
                self._state.is_braking = True
                return

            # Clamp speed to forward / reverse limits
            if speed >= 0.0:
                self._state.speed = min(speed, self.max_speed_forward)
            else:
                self._state.speed = max(speed, -self.max_speed_reverse)

            # Clamp steering angle
            self._state.steering_angle = max(
                -self.max_steering_angle,
                min(steering_angle, self.max_steering_angle),
            )

            self._state.is_braking = is_braking
            if is_braking:
                self._state.acceleration = -abs(acceleration) if acceleration != 0.0 else -self.max_deceleration
                self._state.speed = 0.0
            else:
                self._state.acceleration = acceleration

    def set_gear(self, gear: int) -> None:
        """Update commanded gear (PARK, DRIVE, REVERSE, NEUTRAL, LOW)."""
        with self._mutex:
            self._state.gear = gear

    def set_turn_indicators(self, command: int) -> None:
        """Update commanded turn indicator state (DISABLE, LEFT, RIGHT)."""
        with self._mutex:
            self._state.turn_indicators = command

    def set_hazard_lights(self, command: int) -> None:
        """Update commanded hazard lights state (DISABLE, ENABLE)."""
        with self._mutex:
            self._state.hazard_lights = command

    def set_engage(self, engage: bool) -> None:
        """Update vehicle engage state."""
        with self._mutex:
            if self._state.emergency and engage:
                # Cannot engage while emergency stop is active
                return
            self._state.engage = engage

    def set_emergency(self, emergency: bool) -> None:
        """Assert or clear emergency stop."""
        with self._mutex:
            self._state.emergency = emergency
            if emergency:
                self._apply_fail_closed_state()

    def _apply_fail_closed_state(self) -> None:
        """Force vehicle state to fail-closed safe standstill."""
        self._state.speed = 0.0
        self._state.acceleration = -self.max_deceleration
        self._state.steering_angle = 0.0
        self._state.is_braking = True
        self._state.gear = GearConstants.PARK
        self._state.engage = False

    def request_control_mode(self, mode: int) -> None:
        """Call control mode service asynchronously (AUTONOMOUS or MANUAL)."""
        if not HAS_ROS2 or self._cli_control_mode is None:
            if self._on_service_response_hook:
                mode_name = "AUTONOMOUS" if mode == ControlModeConstants.AUTONOMOUS else "MANUAL"
                self._on_service_response_hook(mode_name, True)
            return

        if not self._cli_control_mode.service_is_ready():
            if self._on_service_response_hook:
                self._on_service_response_hook("Service not available", False)
            return

        req = ControlModeCommand.Request()
        req.mode = mode
        future = self._cli_control_mode.call_async(req)

        def _done_callback(fut: Any) -> None:
            try:
                res = fut.result()
                success = bool(res.success) if hasattr(res, "success") else False
                mode_str = "AUTONOMOUS" if mode == ControlModeConstants.AUTONOMOUS else "MANUAL"
                if self._on_service_response_hook:
                    self._on_service_response_hook(mode_str, success)
            except Exception as ex:  # pylint: disable=broad-except
                if self._on_service_response_hook:
                    self._on_service_response_hook(str(ex), False)

        future.add_done_callback(_done_callback)

    def get_state_snapshot(self) -> VehicleControlState:
        """Return a copy of the current state."""
        with self._mutex:
            return VehicleControlState(
                speed=self._state.speed,
                acceleration=self._state.acceleration,
                is_defined_accel=self._state.is_defined_accel,
                steering_angle=self._state.steering_angle,
                steering_rate=self._state.steering_rate,
                is_defined_steering_rate=self._state.is_defined_steering_rate,
                gear=self._state.gear,
                turn_indicators=self._state.turn_indicators,
                hazard_lights=self._state.hazard_lights,
                engage=self._state.engage,
                emergency=self._state.emergency,
                is_braking=self._state.is_braking,
            )

    # ---- Publishing Pipeline ----
    def _on_publish_tick(self) -> None:
        """Periodic publishing timer callback."""
        if not self._is_active:
            return
        self._publish_current_state()

    def _publish_current_state(self) -> None:
        """Serialize and transmit vehicle control messages."""
        with self._mutex:
            state = VehicleControlState(
                speed=self._state.speed,
                acceleration=self._state.acceleration,
                is_defined_accel=self._state.is_defined_accel,
                steering_angle=self._state.steering_angle,
                steering_rate=self._state.steering_rate,
                is_defined_steering_rate=self._state.is_defined_steering_rate,
                gear=self._state.gear,
                turn_indicators=self._state.turn_indicators,
                hazard_lights=self._state.hazard_lights,
                engage=self._state.engage,
                emergency=self._state.emergency,
                is_braking=self._state.is_braking,
            )

        now_msg = self.get_clock().now().to_msg() if HAS_ROS2 else None

        if HAS_ROS2 and self._pub_control is not None:
            # 1. Control command
            ctrl_msg = Control()
            if now_msg:
                ctrl_msg.stamp = now_msg
            ctrl_msg.lateral = Lateral()
            ctrl_msg.lateral.steering_tire_angle = float(state.steering_angle)
            ctrl_msg.lateral.steering_tire_rotation_rate = float(state.steering_rate)
            ctrl_msg.lateral.is_defined_steering_tire_rotation_rate = state.is_defined_steering_rate

            ctrl_msg.longitudinal = Longitudinal()
            ctrl_msg.longitudinal.velocity = float(state.speed)
            ctrl_msg.longitudinal.acceleration = float(state.acceleration)
            ctrl_msg.longitudinal.is_defined_acceleration = state.is_defined_accel
            self._pub_control.publish(ctrl_msg)

            # 2. Gear command
            gear_msg = GearCommand()
            if now_msg:
                gear_msg.stamp = now_msg
            gear_msg.command = int(state.gear)
            self._pub_gear.publish(gear_msg)

            # 3. Turn indicators command
            turn_msg = TurnIndicatorsCommand()
            if now_msg:
                turn_msg.stamp = now_msg
            turn_msg.command = int(state.turn_indicators)
            self._pub_turn.publish(turn_msg)

            # 4. Hazard lights command
            hazard_msg = HazardLightsCommand()
            if now_msg:
                hazard_msg.stamp = now_msg
            hazard_msg.command = int(state.hazard_lights)
            self._pub_hazard.publish(hazard_msg)

            # 5. Engage
            engage_msg = Engage()
            if now_msg:
                engage_msg.stamp = now_msg
            engage_msg.engage = bool(state.engage)
            self._pub_engage.publish(engage_msg)

            # 6. Emergency Stop
            emerg_msg = VehicleEmergencyStamped()
            if now_msg:
                emerg_msg.stamp = now_msg
            emerg_msg.emergency = bool(state.emergency)
            self._pub_emergency.publish(emerg_msg)

        # Notify GUI telemetry hook
        if self._on_publish_hook is not None:
            self._on_publish_hook(
                {
                    "speed": state.speed,
                    "acceleration": state.acceleration,
                    "steering_angle": state.steering_angle,
                    "gear": state.gear,
                    "turn_indicators": state.turn_indicators,
                    "hazard_lights": state.hazard_lights,
                    "engage": state.engage,
                    "emergency": state.emergency,
                    "is_braking": state.is_braking,
                }
            )


def main(args: Optional[list[str]] = None) -> None:
    """Entry point for standalone node execution."""
    if not HAS_ROS2:
        print("rclpy not installed; cannot run standalone remote_control_node.")
        return

    rclpy.init(args=args)
    node = RemoteControlNode()
    node.activate_node()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.deactivate_node()
        node.destroy_node()
        rclpy.shutdown()


if __name__ == "__main__":
    main()
