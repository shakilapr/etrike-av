# Pre-Vehicle Deployment Test Checklist

**Date:** 2026-08-17
**Target:** Jetson → Real Vehicle

---

## CRITICAL SAFETY TESTS (Must Pass)

### 1. Emergency Stop (ESTOP)

| Test | How | Expected |
|------|-----|----------|
| Software ESTOP | Publish `VehicleEmergencyStamped{emergency: true}` | Bridge sends ESTOP frame (0x1), disengages, stops commands |
| ESTOP rate limiting | Send multiple ESTOPs rapidly | Max 1 ESTOP frame per 500ms |
| ESTOP recovery | Publish `emergency: false` after ESTOP | Bridge stops asserting ESTOP, but does NOT re-engage (requires operator) |
| Hardware ESTOP | Inject `0x011` with `estop_active=1` | Bridge stops all commands immediately |

### 2. Heartbeat Monitoring

| Test | How | Expected |
|------|-----|----------|
| RT heartbeat loss | Stop injecting `0x7FD` | Diag: "RT Heartbeat: missing" after 1500ms |
| SYS status loss | Stop injecting `0x011` | Diag: "SYS status: missing" after 500ms |
| RT state report loss | Stop injecting `0x210` | Diag: "RT state report: missing" after 500ms |
| RT motion report loss | Stop injecting `0x121` | Diag: "RT motion report: missing" after 100ms |
| All feedback lost | Stop all CAN injection | Bridge sends neutral drive + invalid steering |

### 3. Command Timeout

| Test | How | Expected |
|------|-----|----------|
| Control command age | Publish control, then stop | After 500ms: "Command timeout" warning, neutral drive sent |
| Engage without commands | Engage but don't publish control | Bridge sends neutral drive |

### 4. Safety Gate (9 Conditions)

| Test | How | Expected |
|------|-----|----------|
| Gate blocked - no engage | Don't publish engage | `accepting_control = false`, neutral drive |
| Gate blocked - not AUTO | Inject `0x210` with `mode != AUTO` | `confirmed_auto = false`, gate blocked |
| Gate blocked - sw emergency | Publish emergency=true | Gate blocked |
| Gate blocked - SYS ESTOP | Inject `0x011` with `estop_active=1` | Gate blocked |
| Gate blocked - missing feedback | Don't inject any CAN | Gate blocked |
| Gate ready | All conditions met | `accepting_control = true`, commands sent |

---

## MOTION CONVERSION TESTS

### 5. Steering Sign Convention

| Test | Input | Expected Output |
|------|-------|-----------------|
| Left turn (Universe) | `steering_tire_angle = +0.5 rad` | Trike angle = `-0.5 rad` (right positive on wire) |
| Right turn (Universe) | `steering_tire_angle = -0.5 rad` | Trike angle = `+0.5 rad` |
| Max steer clamp | `steering_tire_angle = +1.0 rad` | Clamped to `0.747 rad` |

### 6. Speed Limits

| Test | Input | Expected Output |
|------|-------|-----------------|
| Forward limit | `velocity = 5.0 m/s` | Clamped to `3000 mm/s` (3.0 m/s) |
| Reverse limit | `velocity = -1.0 m/s` | Clamped to `-500 mm/s` (-0.5 m/s) |
| Zero speed | `velocity = 0.0 m/s` | `0 mm/s` |
| NaN handling | `velocity = NaN` | Frame NOT sent (rejected) |

### 7. Yaw Rate at Low Speed

| Test | Input | Expected |
|------|-------|----------|
| Below threshold | `speed = 0.04 m/s, steer = 0.5 rad` | `yaw = 0` (suppressed) |
| At threshold | `speed = 0.05 m/s, steer = 0.5 rad` | `yaw != 0` (computed) |
| Negative speed | `speed = -0.05 m/s, steer = 0.5 rad` | `yaw` sign flipped |

---

## CAN PROTOCOL TESTS

### 8. Frame Encoding

| Test | CAN ID | Validation |
|------|--------|------------|
| Drive command | `0x300` | Speed in mm/s, gear in byte 7 |
| Steering command | `0x303` | Angle in 0.1°, validity flag |
| Brake request | `0x301` | Pressure in kPa |
| Light command | `0x302` | Turn/hazard/brake bits |
| Host heartbeat | `0x7FC` | Counter increments |

### 9. Frame Decoding

| Test | CAN ID | Validation |
|------|--------|------------|
| Motion report | `0x121` | Speed, yaw, gear extracted correctly |
| State report | `0x210` | Mode, safety state extracted |
| Safety status | `0x011` | ESTOP, heartbeat, light state |
| Diagnostics | `0x600` | Error codes decoded |
| Steering diag | `0x310` | Angle in 0.1° → rad conversion |
| Brake diag | `0x311` | Pressure, fault, temp |

### 10. Counter Validation

| Test | How | Expected |
|------|-----|----------|
| Motion counter | Inject `0x121` with counter=1,2,3... | `motion_report_` fed with each counter |
| Counter skip | Inject counter=1, then counter=3 | Motion report still fed (no gap check in current code) |

---

## INTEGRATION TESTS (With Autoware)

### 11. Topic Mapping

| Autoware Topic | Bridge Subscription | Status |
|----------------|---------------------|--------|
| `/control/command/control_cmd` | Control commands | ✅ |
| `/control/command/gear_cmd` | Gear selection | ✅ |
| `/control/command/turn_indicators_cmd` | Turn signals | ✅ |
| `/control/command/hazard_lights_cmd` | Hazard lights | ✅ |
| `/api/autoware/get/engage` | Engage state | ✅ |
| `/control/command/emergency_cmd` | Emergency | ✅ |

### 12. Vehicle Status Publishing

| Bridge Output Topic | Source | Status |
|---------------------|--------|--------|
| `/vehicle/status/velocity_status` | 0x121 motion report | ✅ |
| `/vehicle/status/steering_status` | 0x310 steer diag | ✅ |
| `/vehicle/status/gear_status` | 0x121/0x206 | ✅ |
| `/vehicle/status/control_mode` | 0x210 state report | ✅ |
| `/vehicle/status/turn_indicators_status` | 0x011 safety status | ✅ |
| `/vehicle/status/hazard_lights_status` | 0x011 safety status | ✅ |

### 13. Control Mode Service

| Test | How | Expected |
|------|-----|----------|
| Request AUTONOMOUS | Call `ControlModeCommand{mode: AUTONOMOUS}` | Sends mode request CAN frame |
| Request MANUAL | Call `ControlModeCommand{mode: MANUAL}` | Sends mode request, disengages |
| Request during emergency | Call during software emergency | Returns `success: false` |

---

## EDGE CASE TESTS

### 14. NaN/Inf Handling

| Test | Input | Expected |
|------|-------|----------|
| NaN velocity | `velocity = NaN` | Drive frame NOT sent |
| NaN steering | `steering_tire_angle = NaN` | Drive frame NOT sent |
| Inf velocity | `velocity = Inf` | Drive frame NOT sent |

### 15. CAN Interface Failures

| Test | How | Expected |
|------|-----|----------|
| CAN down | `ip link set down can0` | Diag: "CAN: disconnected" |
| CAN reopen | `ip link set up can0` | Bridge reopens socket on next activate |
| Send failure | Kill CAN interface | `can_->send()` returns false, logged |

### 16. Thread Safety

| Test | How | Expected |
|------|-----|----------|
| Concurrent access | Publish from multiple threads | No race conditions (mutex protects) |
| RX thread stop | Deactivate node | RX thread joins cleanly |

---

## HARDWARE-IN-THE-LOOP (HIL) TESTS

### 17. With Real RT/SYS (Before Vehicle)

| Test | How | Expected |
|------|-----|----------|
| RT heartbeat received | Connect to real CAN bus | `rt_heartbeat_` alive |
| SYS status received | Connect to real CAN bus | `sys_status_` alive |
| Mode confirmation | SYS reports AUTO mode | `confirmed_auto_ = true` |
| ESTOP response | Press physical ESTOP | Bridge stops commands within 1 cycle |

### 18. With Vehicle (Jack Stands)

| Test | How | Expected |
|------|-----|----------|
| Motor response | Send low speed command | Motor responds, speed matches |
| Steering response | Send small angle | Steering motor moves correctly |
| Brake response | Send brake command | Brake actuator engages |
| Gear shift | Send D→R→N commands | Gear changes correctly |

---

## TEST EXECUTION ORDER

```
Phase 1: Unit tests (motion_conversion)          ← Already passed
Phase 2: Build verification                       ← Already passed
Phase 3: Node lifecycle (configure→activate)      ← Already passed
Phase 4: CAN frame encoding/decoding              ← Run on Jetson
Phase 5: Safety gate tests                        ← Run on Jetson
Phase 6: Emergency stop tests                     ← Run on Jetson
Phase 7: Heartbeat timeout tests                  ← Run on Jetson
Phase 8: Integration with Autoware                ← Run on Jetson
Phase 9: HIL with real RT/SYS                     ← Run with hardware
Phase 10: Vehicle on jack stands                  ← Run with vehicle
Phase 11: Low-speed track test                    ← Run on track
```

---

## AUTOMATED TEST SCRIPT

Run on Jetson:
```bash
ssh med1@172.16.25.56
cd ~/av_project
python3 scripts/pre_vehicle_tests.py
```

---

## SIGN-OFF CHECKLIST

- [ ] All safety gate conditions tested
- [ ] Emergency stop verified (software + hardware)
- [ ] All heartbeat timeouts verified
- [ ] Command timeout verified
- [ ] Steering sign convention verified
- [ ] Speed limits verified
- [ ] NaN/Inf handling verified
- [ ] CAN interface failure recovery verified
- [ ] Topic mapping verified with Autoware
- [ ] HIL test with real RT/SYS passed
- [ ] Vehicle on jack stands test passed

---

*Do NOT connect to vehicle until all Phase 1-8 tests pass.*
