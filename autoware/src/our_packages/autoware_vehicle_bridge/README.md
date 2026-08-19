# autoware_vehicle_bridge

Lifecycle bridge between **Autoware Universe control/state interfaces** and the **E-Trike low-level CAN bus**. Translates Autoware `Control` / `GearCommand` / light commands into E-Trike CAN frames, and decodes CAN feedback into Autoware vehicle status messages.

## Logic

```
Autoware commands (ROS)
   │
   ▼  [subscriptions]
VehicleBridgeNode (LifecycleNode)
   │
   ├─ tick_control()        @ loop_rate (100 Hz)
   │     gate = engaged ∧ confirmed_auto ∧ !emergency ∧ estop_clear ∧ all_feedback_fresh
   │     if gate: encode drive/steer/brake/light → CAN
   │     else:   send_safe_motion() (zero speed + invalid steering)
   │
   ├─ tick_heartbeat()      @ heartbeat_interval_ms (500 ms)
   │     monitor RT heartbeat, send Host heartbeat (0x7FC)
   │
   ├─ tick_diagnostics()    @ 1 Hz
   │     publish node health to /diagnostics
   │
   └─ run_can_receive()     [thread]
         RX CAN frame → decode → publish vehicle reports

CAN bus (can0)
   ▲
   │  [raw socket CAN]
E-Trike RT / SYS / MTR ECUs
```

### Subscription callbacks (store latest, gated by mutex)
```
on_control(Control)         → latest_control_        (if accepting_control_ && !emergency)
on_gear(GearCommand)        → latest_gear_
on_turn(TurnIndicators)     → latest_turn_
on_hazard(HazardLights)     → latest_hazard_
on_engage(Engage)           → engaged_               (true/false)
on_control_mode(Service)    → encode HmiModeReq (AUTO/MANUAL)
on_emergency(VehicleEmergencyStamped) → software_emergency_; if set → send ESTOP (0x1)
```

### Control gate (tick_control)
```
feedback_ready =
    rt_heartbeat_.is_alive(rt_heartbeat_timeout_ms) AND
    sys_status_.is_alive(sys_status_timeout_ms)   AND
    state_report_.is_alive(state_report_timeout_ms) AND
    motion_report_.is_alive(motion_report_timeout_ms) AND
    sys_heartbeat_ok_ == 1

base_gate_ready =
    engaged_ AND confirmed_auto_ AND
    !software_emergency_ AND sys_estop_active_ == 0 AND feedback_ready

if !base_gate_ready:
    accepting_control_ = false
    send_safe_motion()        # 0x300 neutral drive + 0x303 invalid steering
    return

if !accepting_control_.exchange(true):
    send_safe_motion()        # first accepted frame = safe
    return

if cmd_age > command_timeout_ms:
    accepting_control_ = false
    send_safe_motion()
    return

# Encode & send
encode_drive  → 0x300 HOST_DRIVE_CMD   (speed_mmps, yaw_mrad_s, gear)
encode_steering → 0x303 HOST_STEER_CMD  (angle_0_1deg, angle_valid)
encode_brake  → 0x301 HOST_BRAKE_REQ   (pressure_kpa from deceleration)
encode_brake_hold → 0x301 (if park requested)  (full pressure)
encode_lights → 0x302 HOST_LIGHT_CMD   (left/right/brake/hazard)
```

### Motion conversion (motion_conversion.hpp)
```
speed_to_mmps(v)      = clamp(round(v*1000), -max_reverse*1000, max_forward*1000)
to_trike_steering_rad(a) = -clamp(a, -max, max)          # Universe left+ → E-Trike right+
legacy_yaw_mrad_s(a,v,L) = (|v|<thr)? 0 : clamp(round(v*tan(trike_a)/L*1000), -3000, 3000)
universe_heading_rate(y) = -y/1000                         # E-Trike right+ → Universe left+
universe_steering_rad(d) = -d * (π/1800)                  # 0.1deg wire → rad
```

### CAN receive decode (publish_vehicle_reports)
```
0x1   SAFETY_ESTOP      → log warning
0x11  SYS_SAFETY_STS    → sys_estop_active_, sys_heartbeat_ok_, light feedback
0x121 RT_MOTION_RPT     → /vehicle/status/velocity_status, /vehicle/status/gear_status
0x206 MTR_MOTOR_FBK     → gear state (forwarded, not published yet)
0x210 RT_STATE_RPT      → confirmed_auto_, /vehicle/status/control_mode
0x300 HOST_DRIVE_CMD    (echo, ignored)
0x311 RT_BRAKE_CMD      → brake telemetry to /diagnostics
0x310 STEER_DIAG        → /vehicle/status/steering_status
0x600 SYS_DIAG_RPT      → /diagnostics
0x7FD RT_HEARTBEAT      → rt_heartbeat_.feed(alive_ctr)
```

## Topics

### Subscribed
| Topic | Type | QoS | Purpose |
|---|---|---|---|
| `/control/command/control_cmd` | `autoware_control_msgs/Control` | Reliable depth=1 | Velocity + steering tire angle command |
| `/control/command/gear_cmd` | `autoware_vehicle_msgs/GearCommand` | Reliable depth=1 | Gear selection (DRIVE/REVERSE/PARK/...) |
| `/control/command/turn_indicators_cmd` | `autoware_vehicle_msgs/TurnIndicatorsCommand` | Reliable depth=1 | Left/right turn signal |
| `/control/command/hazard_lights_cmd` | `autoware_vehicle_msgs/HazardLightsCommand` | Reliable depth=1 | Hazard lights |
| `~/input/engage` | `autoware_vehicle_msgs/Engage` | Reliable depth=1 | Engage/disengage autonomy |
| `/control/command/emergency_cmd` | `tier4_vehicle_msgs/VehicleEmergencyStamped` | Reliable depth=1 | Software emergency stop |
| `/control/control_mode_request` | `autoware_vehicle_msgs/srv/ControlModeCommand` | Service | Request AUTO/MANUAL mode |

### Published
| Topic | Type | QoS | Purpose |
|---|---|---|---|
| `/vehicle/status/velocity_status` | `autoware_vehicle_msgs/VelocityReport` | depth=1 | Longitudinal velocity (m/s), frame_id=base_link |
| `/vehicle/status/steering_status` | `autoware_vehicle_msgs/SteeringReport` | depth=1 | Steering tire angle (rad) |
| `/vehicle/status/gear_status` | `autoware_vehicle_msgs/GearReport` | depth=1 | Actual gear (DRIVE/REVERSE/NEUTRAL/PARK) |
| `/vehicle/status/control_mode` | `autoware_vehicle_msgs/ControlModeReport` | depth=1 | MANUAL/AUTONOMOUS/DISENGAGED |
| `/vehicle/status/turn_indicators_status` | `autoware_vehicle_msgs/TurnIndicatorsReport` | depth=1 | Actual turn light state |
| `/vehicle/status/hazard_lights_status` | `autoware_vehicle_msgs/HazardLightsReport` | depth=1 | Actual hazard light state |
| `~/output/diagnostics` | `diagnostic_msgs/DiagnosticArray` | depth=1 | Node + ECU health (mode, estop, heartbeat, CAN errors) |

## Key Parameters
| Param | Default | Meaning |
|---|---|---|
| `can_interface` | `can0` | CAN socket interface |
| `wheel_base` | `2.0` | m, for yaw conversion |
| `max_speed_forward` | `3.0` | m/s clamp |
| `max_speed_reverse` | `0.5` | m/s clamp |
| `max_steering_angle` | `0.747` | rad clamp |
| `max_brake_pressure_kpa` | `5000.0` | full-pressure reference |
| `max_deceleration` | `5.0` | m/s² → brake pressure scaling |
| `command_timeout_ms` | `500` | drop control if no fresh cmd |
| `rt_heartbeat_timeout_ms` | `1500` | RT liveness gate |
| `sys_status_timeout_ms` | `500` | SYS liveness gate |
| `state_report_timeout_ms` | `500` | state-report gate |
| `motion_report_timeout_ms` | `100` | motion-report gate |
| `heartbeat_interval_ms` | `500` | Host heartbeat period |
| `loop_rate` | `100.0` | Hz control tick |

## Safety Properties
- **Fail-closed**: any missing feedback / lost heartbeat / emergency → safe motion (zero speed, invalid steering).
- **ESTOP**: software emergency or SYS ESTOP → rate-limited ESTOP frame to CAN, control rejected.
- **Command timeout**: stale command (> `command_timeout_ms`) → safe motion.
- **Gear latch**: when engaged with no explicit gear, latches DRIVE (avoids NEUTRAL at standstill).
