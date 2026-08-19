# etrike_stability_guard

Roll / tip-over **monitor** for the E-Trike three-wheeler. Autoware is a planar (2D) stack with no rollover model; a tall narrow trike can tip in a hard turn before any path/obstacle check reacts. This node estimates lateral acceleration from actual state and compares it to a geometric tipping threshold.

## Logic

```
on_velocity(VelocityReport) → _velocity
on_steering(SteeringReport) → _steer
         │
         ▼  update()
speed = |_velocity|
a_y = speed² · tan(_steer) / wheel_base          # kinematic bicycle, planar
a_y_abs = |a_y|                                   # direction-agnostic

threshold      = g · (track_width/2) / cog_height · safety_margin
warn_threshold = threshold · warn_ratio
error_threshold= threshold · error_ratio

if enable_emergency:
    if a_y_abs > error_threshold and !asserted:
        asserted = true
        publish_emergency(True)                    # assert Autoware ESTOP
    elif asserted and a_y_abs < warn_threshold:
        asserted = false
        publish_emergency(False)                   # hysteresis release

# Always (every 100 ms):
publish_diagnostics() → /diagnostics with live a_y, thresholds, state
```

Hysteresis: assert at `error_ratio`, release at `warn_ratio` (no chatter).

## Topics

### Subscribed
| Topic | Type | QoS | Purpose |
|---|---|---|---|
| `/vehicle/status/velocity_status` (param `velocity_topic`) | `autoware_vehicle_msgs/VelocityReport` | depth=10 | Longitudinal velocity |
| `/vehicle/status/steering_status` (param `steering_topic`) | `autoware_vehicle_msgs/SteeringReport` | depth=10 | Steering tire angle |

### Published
| Topic | Type | QoS | Purpose |
|---|---|---|---|
| `/diagnostics` (param `diagnostics_topic`) | `diagnostic_msgs/DiagnosticArray` | depth=10 | Lateral-accel estimate + threshold band (OK/WARN/ERROR) |
| `/control/command/emergency_cmd` (param `emergency_topic`) | `tier4_vehicle_msgs/VehicleEmergencyStamped` | depth=10 | ESTOP assert/release (only if `enable_emergency`) |

## Key Parameters
| Param | Default | Meaning |
|---|---|---|
| `wheel_base` | `2.0` | m |
| `track_width` | `1.15` | m (rear track) |
| `cog_height` | `0.8` | m, centre of gravity height |
| `gravity` | `9.81` | m/s² |
| `safety_margin` | `0.6` | fraction of theoretical tip threshold |
| `warn_ratio` | `0.7` | warn band = threshold·ratio |
| `error_ratio` | `0.9` | emergency assert band |
| `enable_emergency` | `False` | monitor-only by default |
| `velocity_topic` | `/vehicle/status/velocity_status` | — |
| `steering_topic` | `/vehicle/status/steering_status` | — |
| `emergency_topic` | `/control/command/emergency_cmd` | — |
| `diagnostics_topic` | `/diagnostics` | — |

## Safety Note
Default is **monitor-only**. Tune `track_width`, `cog_height`, `safety_margin` on the real vehicle before setting `enable_emergency:=true`. A future command-limiter could scale velocity instead of cutting.
