# etrike_remote_control

Remote Control Cockpit GUI for direct teleoperation and manual override of the E-Trike vehicle via `autoware_vehicle_bridge` or `direct_bridge`.

Built with **Python**, **PySide6**, and **rclpy**.

## Features

- **Buttons for Every Vehicle Bridge Output:**
  - **Operational State & Modes:**
    - `EMERGENCY STOP` (Esc): Immediate fail-closed stop, halts motion, applies maximum deceleration.
    - `Reset / Clear E-Stop`: Restores ready state.
    - `Engage (G / Enter)` & `Disengage`: Direct vehicle engage toggle.
    - `Request Autonomous` & `Request Manual`: Service calls to `/control/control_mode_request`.
  - **Transmission Gear Outputs:**
    - `PARK (P)`, `REVERSE (R)`, `NEUTRAL (N)`, `DRIVE (D)`, `LOW (L)`.
  - **Signalling & Lighting Outputs:**
    - Turn Indicators: `Left (Q)`, `Right (E)`, `Off`.
    - Hazard Lights: `Hazards (H)` toggle.
  - **Directional Drive Pad:**
    - `Forward (Up)`, `Reverse (Down)`, `Steer Left (Left)`, `Steer Right (Right)`, `Center Steering (C)`, `Stop (0 m/s)`, `Instant Brake (Space)`.

- **Adjustment Bars & Gauges:**
  - Forward Speed adjustment slider & spinbox (0.1 to 3.0 m/s with km/h display).
  - Reverse Speed adjustment slider & spinbox (0.1 to 1.0 m/s).
  - Acceleration rate adjustment slider & spinbox (0.1 to 3.0 m/s²).
  - Deceleration / Braking force slider & spinbox (0.5 to 5.0 m/s²).
  - Steering angle limit slider & spinbox (0.05 to 0.35 rad / ~20°).
  - Live progress meter for commanded speed.
  - Bipolar graphical meter for commanded steering angle with center indicator.

- **Keyboard Teleop Driving:**
  - `Arrow Up` / `W`: Smooth acceleration forward up to max forward speed.
  - `Arrow Down` / `S`: Deceleration / reverse up to max reverse speed.
  - `Arrow Left` / `A`: Smooth steering left up to steering limit.
  - `Arrow Right` / `D`: Smooth steering right up to steering limit.
  - `Spacebar`: Instant brake — immediately cuts speed to 0.0 m/s and asserts brake deceleration.
  - `P` / `R` / `N` / `D` / `L`: Hotkeys for gear shifting.
  - `Q` / `E`: Left / right turn signal toggles.
  - `H`: Hazard lights toggle.
  - `G` or `Enter`: Vehicle engage toggle.
  - `Escape`: Instant emergency stop.
  - `C`: Recenter steering to 0.0 rad.
  - `Auto-Center Steering`: Automatically returns steering wheel to 0° upon releasing Left/Right.
  - `Auto-Decelerate / Coast`: Smoothly decelerates to 0 m/s upon releasing Up/Down.

- **Safety & Fail-Closed Behavior:**
  - Fail-closed design: Inactive, emergency, or window close immediately forces `speed=0.0`, `gear=PARK`, `engage=False`, `is_braking=True`.
  - High-rate cyclic publisher (default 25 Hz) ensures bridge command timeouts are never tripped during active teleoperation.

## Topics & Interfaces

### Publishers
- `/control/command/control_cmd` (`autoware_control_msgs/msg/Control`)
- `/control/command/gear_cmd` (`autoware_vehicle_msgs/msg/GearCommand`)
- `/control/command/turn_indicators_cmd` (`autoware_vehicle_msgs/msg/TurnIndicatorsCommand`)
- `/control/command/hazard_lights_cmd` (`autoware_vehicle_msgs/msg/HazardLightsCommand`)
- `/api/autoware/get/engage` (`autoware_vehicle_msgs/msg/Engage`)
- `/control/command/emergency_cmd` (`tier4_vehicle_msgs/msg/VehicleEmergencyStamped`)

### Service Clients
- `/control/control_mode_request` (`autoware_vehicle_msgs/srv/ControlModeCommand`)

## Running

### Via ROS 2 Launch:
```bash
ros2 launch etrike_remote_control remote_control.launch.py
```

### Via ROS 2 Run:
```bash
ros2 run etrike_remote_control remote_control_gui
```

### Direct Python execution (with ROS 2 environment sourced):
```bash
python -m etrike_remote_control.remote_control_gui
```
