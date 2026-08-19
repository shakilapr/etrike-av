# etrike_vehicle_launch

Top-level **vehicle interface** launch: wires the `autoware_vehicle_bridge` (CAN bridge) and the `etrike_stability_guard` (tip-over monitor) into the Autoware vehicle stack.

## Logic (vehicle_interface.launch.xml)

```
vehicle_interface.launch.xml
  ├─ autoware_vehicle_bridge/launch/vehicle_bridge.launch.py
  │     arg: can_interface (default can0)
  │     → starts VehicleBridgeNode (Lifecycle)
  │
  └─ etrike_stability_guard/launch/stability_guard.launch.py
        → starts StabilityGuardNode (monitor-only by default)
```

## Args
| Arg | Default | Meaning |
|---|---|---|
| `vehicle_id` | `$VEHICLE_ID` | env |
| `raw_vehicle_cmd_converter_param_path` | `""` | (reserved) |
| `initial_engage_state` | `false` | (reserved) |
| `can_interface` | `can0` | passed to vehicle_bridge |

## Topics (see child packages for full tables)
| Direction | Topic | Type |
|---|---|---|
| in → bridge | `/control/command/control_cmd` | `Control` |
| in → bridge | `/control/command/emergency_cmd` | `VehicleEmergencyStamped` |
| out ← bridge | `/vehicle/status/velocity_status` | `VelocityReport` |
| out ← bridge | `/vehicle/status/control_mode` | `ControlModeReport` |
| in → guard | `/vehicle/status/velocity_status` | `VelocityReport` |
| in → guard | `/vehicle/status/steering_status` | `SteeringReport` |
| out ← guard | `/diagnostics` | `DiagnosticArray` |
| out ← guard | `/control/command/emergency_cmd` | `VehicleEmergencyStamped` (if enabled) |

## Notes
- Stability guard is **monitor-only** by default. Enable emergency cut via `stability_guard.launch.py` `enable_emergency:=true` after tuning geometry.
- Bridge fails closed: no control output unless engaged + confirmed AUTO + all feedback fresh.
