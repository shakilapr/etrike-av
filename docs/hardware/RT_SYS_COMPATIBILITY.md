# RT & SYS Compatibility Analysis

**Date:** 2026-08-17  
**Status:** Verified on Jetson (Humble)

---

## 1. Architecture Overview

The `autoware_vehicle_bridge` node bridges Autoware ROS 2 messages to the E-Trike CAN bus. It communicates with two embedded controllers:

| Controller | Role | CAN IDs |
|------------|------|---------|
| **RT** (Real-Time) | Motion control, steering, braking, state reporting | 0x204, 0x205, 0x210, 0x220, 0x303, 0x310, 0x311, 0x7FD |
| **SYS** (System) | Safety monitoring, mode control, diagnostics, heartbeat | 0x011, 0x110, 0x600, 0x7FE |

---

## 2. Build Status

**All packages build successfully on Jetson (aarch64, Humble):**

| Package | Status | Notes |
|---------|--------|-------|
| `etrike_protocol` | ✅ Build | Added `protocol/core/` headers, fixed CMakeLists include path |
| `autoware_vehicle_bridge` | ✅ Build | Fixed Humble lifecycle API, std::clamp, DiagnosticStatus |
| `etrike_vehicle_description` | ✅ Build | URDF, meshes, configs |
| `etrike_vehicle_launch` | ✅ Build | Vehicle interface launch |
| `etrike_common_launch` | ✅ Build | Hesai XT32M2X LiDAR via Nebula |

**Humble compatibility fixes applied:**
- Lifecycle `State` type: Use `rclcpp_lifecycle::State` instead of bare `State`
- `CallbackReturn`: Use full qualification in `.cpp` file
- `std::clamp`: Cast `float` to `double` for template deduction
- `DiagnosticStatus` values: Use `push_back()` instead of brace initialization
- Launch file: Add `namespace=""` to `LifecycleNode`
- Config: Change `max_brake_pressure_kpa` from int `5000` to float `5000.0`

---

## 2. RT Compatibility Status

### 2.1 Messages Implemented

| Message | CAN ID | Direction | Status |
|---------|--------|-----------|--------|
| `rt:rt_drive_cmd` | 0x204 | Host → RT | ✅ Encoded |
| `rt:rt_brake_cmd` | 0x205 | Host → RT | ✅ Encoded |
| `rt:rt_state_rpt` | 0x210 | RT → Host | ✅ Decoded |
| `rt:rt_motion_rpt` | 0x121 | RT → Host | ✅ Decoded |
| `rt:rt_pid_rpt` | 0x220 | RT → Host | ⚠️ Defined but not consumed |
| `rt:rt_heartbeat` | 0x7FD | RT → Host | ✅ Decoded |
| `rt:steer_diag` | 0x310 | RT → Host | ✅ Decoded |
| `rt:brake_diag` | 0x311 | RT → Host | ✅ Decoded |

### 2.2 RT Heartbeat Monitoring

```cpp
// vehicle_bridge_node.hpp:237
HeartbeatMonitor rt_heartbeat_;

// vehicle_bridge_node.cpp:880
if (!rt_heartbeat_.is_alive(now(), params_.rt_heartbeat_timeout_ms)) {
    RCLCPP_WARN_THROTTLE(get_logger(), *get_clock(), 2000, "RT heartbeat LOST");
}
```

**Timeout:** 1500ms (configurable via `rt_heartbeat_timeout_ms`)

### 2.3 RT Feedback Gate

The bridge requires RT heartbeat to be alive before accepting control commands:

```cpp
// vehicle_bridge_node.cpp:776-777
const bool feedback_ready =
    rt_heartbeat_.has_sample() &&
    rt_heartbeat_.is_alive(tick_now, params_.rt_heartbeat_timeout_ms) &&
    // ... other conditions
```

### 2.4 RT Compatibility Issues

| Issue | Severity | Description |
|-------|----------|-------------|
| **Steering sign convention** | ℹ️ Info | Universe: left positive. E-Trike wire/RT: right positive. Conversion in `motion_conversion.hpp:23-26` |
| **Legacy yaw at low speed** | ℹ️ Info | Yaw rate set to 0 when speed < 0.05 m/s (`low_speed_threshold`) |
| **RT PID report unused** | ⚠️ Low | `rt:rt_pid_rpt` (0x220) decoded but no consumer |

---

## 3. SYS Compatibility Status

### 3.1 Messages Implemented

| Message | CAN ID | Direction | Status |
|---------|--------|-----------|--------|
| `sys:sys_safety_sts` | 0x011 | SYS → Host | ✅ Decoded |
| `sys:sys_mode_cmd` | 0x110 | Host → SYS | ✅ Encoded |
| `sys:sys_diag_rpt` | 0x600 | SYS → Host | ✅ Decoded |
| `sys:sys_heartbeat` | 0x7FE | SYS → Host | ⚠️ Defined but not consumed |

### 3.2 SYS Safety Status (0x011) Processing

```cpp
// vehicle_bridge_node.cpp:991-996
case CAN_SAFETY_STS: {
    messages::SysSafetySts value{};
    if (messages::decode(protocol_view(frame), value) != protocol::CodecStatus::Ok) break;
    sys_estop_active_.store(value.estop_active, std::memory_order_relaxed);
    sys_heartbeat_ok_.store(value.heartbeat_ok, std::memory_order_relaxed);
    sys_status_.observe(now());
    // Light state feedback also extracted
}
```

### 3.3 SYS Liveness Monitoring

```cpp
// vehicle_bridge_node.cpp:243-244
std::atomic<uint8_t> sys_estop_active_{1};   // Default: ESTOP active (safe state)
std::atomic<uint8_t> sys_heartbeat_ok_{0};   // Default: heartbeat not OK
```

**Timeout:** 500ms (configurable via `sys_status_timeout_ms`)

### 3.4 SYS Mode Confirmation

```cpp
// vehicle_bridge_node.cpp:1025-1027
confirmed_auto_.store(
    value.mode == messages::RtStateRpt::kModeAuto && value.safety_state == 0,
    std::memory_order_relaxed);
```

### 3.5 SYS Compatibility Issues

| Issue | Severity | Description |
|-------|----------|-------------|
| **SYS heartbeat not monitored** | ⚠️ Medium | `sys:sys_heartbeat` (0x7FE) decoded but `HeartbeatMonitor` not used for it |
| **ESTOP default state** | ℹ️ Info | Default `sys_estop_active_ = 1` (safe state until SYS reports) |
| **Mode command encoding** | ℹ️ Info | Uses `sys:sys_mode_cmd` (0x110) for autonomous/manual switching |

---

## 4. Combined Safety Gate

The bridge implements a multi-condition safety gate before accepting control:

```cpp
// vehicle_bridge_node.cpp:775-789
const bool feedback_ready =
    rt_heartbeat_.has_sample() &&
    rt_heartbeat_.is_alive(tick_now, params_.rt_heartbeat_timeout_ms) &&
    sys_status_.has_sample() &&
    sys_status_.is_alive(tick_now, params_.sys_status_timeout_ms) &&
    state_report_.has_sample() &&
    state_report_.is_alive(tick_now, params_.state_report_timeout_ms) &&
    motion_report_.has_sample() &&
    motion_report_.is_alive(tick_now, params_.motion_report_timeout_ms) &&
    sys_heartbeat_ok_.load(std::memory_order_relaxed) == 1;

const bool base_gate_ready = engaged_.load(std::memory_order_relaxed) &&
    confirmed_auto_.load(std::memory_order_relaxed) &&
    !software_emergency_.load(std::memory_order_relaxed) &&
    sys_estop_active_.load(std::memory_order_relaxed) == 0 &&
    feedback_ready;
```

**All conditions must be true:**
1. ✅ RT heartbeat alive
2. ✅ SYS status fresh
3. ✅ RT state report fresh
4. ✅ RT motion report fresh
5. ✅ SYS heartbeat OK
6. ✅ Engaged
7. ✅ Confirmed AUTO mode
8. ✅ No software emergency
9. ✅ SYS ESTOP not active

---

## 5. Diagnostics Published

```cpp
// vehicle_bridge_node.cpp:906-928
add("CAN", can_->is_open(), ...);
add("Engage", engaged, ...);
add("Confirmed mode", confirmed_auto_, ...);
add("Software emergency", !software_emergency_, ...);
add("RT Heartbeat", rt_alive, ...);
add("SYS status", sys_fresh, ...);
add("RT state report", state_fresh, ...);
add("RT motion report", motion_fresh, ...);
add("SYS Heartbeat", hb == 1, ...);
add("SYS ESTOP", estop == 0, ...);
```

---

## 6. Recommendations

### 6.1 Critical (Must Fix)

None identified. Core RT/SYS compatibility is implemented.

### 6.2 Improvements

| Priority | Item | Action |
|----------|------|--------|
| Medium | SYS heartbeat monitor | Add dedicated `HeartbeatMonitor` for `sys:sys_heartbeat` (0x7FE) |
| Low | RT PID report | Add consumer for `rt:rt_pid_rpt` if PID telemetry is needed |
| Low | Brake telemetry | Expand brake diagnostic publishing from 0x311 |

### 6.3 Testing

See `TEST_PLAN.md` for comprehensive test matrix.

---

## 7. Parameter Reference

| Parameter | Default | Description |
|-----------|---------|-------------|
| `rt_heartbeat_timeout_ms` | 1500 | RT heartbeat loss threshold |
| `sys_status_timeout_ms` | 500 | SYS status freshness threshold |
| `state_report_timeout_ms` | 500 | RT state report freshness threshold |
| `motion_report_timeout_ms` | 100 | RT motion report freshness threshold |
| `command_timeout_ms` | 500 | Host command age threshold |
| `heartbeat_interval_ms` | 500 | Host heartbeat send interval |

---

*Generated from source analysis of `autoware_vehicle_bridge` v0.1.0*
