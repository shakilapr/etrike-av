# direct_bridge Architecture

## 1. Purpose

`direct_bridge` is a standalone ROS 2 bridge for bench ECU bring-up and commissioning of the E-Trike low-level bus. It drives three actuator controllers directly — the **MTR** motor controller, the **SES** (EPS-C) steering unit, and the **SEB** brake unit — over the low-level CAN bus, completely bypassing the RT and SYS ECU layers that form the normal production control chain.

The bridge is a diagnostic and bring-up tool. It is intentionally minimal: it does not implement the heartbeat monitoring, engagement gating, mode confirmation, or per-unit feedback freshness interlocks that the production `autoware_vehicle_bridge` enforces. Instead, it provides exactly enough control to exercise each low-level unit safely on a bench, on virtual CAN (`vcan`), and during hardware commissioning.

The existing production bridge (`autoware_vehicle_bridge`) and the `etrike_protocol` ament package are **not modified** by this work.

## 2. Scope

### 2.1 In Scope

- Generate and vendor the wire codecs for the nine low-bus messages the bridge needs: five generated messages and four custom vendor messages.
- Drive the MTR motor controller with a continuous drive-command stream.
- Drive the SES steering unit with angle commands that satisfy its synchronization requirements.
- Drive the SEB brake unit with pressure or stroke commands.
- Broadcast the system mode command (`0x110`) so the motor controller accepts commands.
- Publish minimal vehicle status reports derived from low-bus feedback.
- Provide a standalone lifecycle launch with a configurable CAN interface.

### 2.2 Out of Scope

- Lights, turn indicators, and hazard commands.
- All high-bus frames (for example `0x300`, `0x301`, `0x303`, `0x7FC`) and the host heartbeat.
- The powertrain bus and the DCDC command (`0x10262B27`).
- Heartbeat liveness monitoring for RT or SYS.
- Engagement gating, mode confirmation, and command-mode service endpoints.
- Obstacle distance reporting (`0x400`).
- Any modification to SES, SEB, or MTR firmware.

## 3. System Context

The E-Trike has two isolated CAN buses:

| Bus | Bitrate | Nodes |
|-----|---------|-------|
| High | 500 kbit/s | Jetson Orin, RT (via MCP2515) |
| Low | 500 kbit/s | RT, SYS, MTR, SES (EPS-C), SEB |

The Jetson connects to the high bus through the primary MTTCAN interface (`can0`). The low bus is normally reachable from the Jetson only through the RT gateway. This bridge targets the low bus directly; the intended physical interface is the second MTTCAN controller (`can1`), but the initial bring-up runs against a virtual interface (`vcan1`) because the low-bus drop to the Jetson is not yet wired.

Because RT and SYS are bypassed, no message is forwarded, regenerated, or acknowledged by them. The bridge must source every frame the low-level controllers require, including the mode command that RT and SYS would otherwise broadcast.

```
Autoware Control (ROS 2)
   │
   ▼  [subscriptions]
direct_bridge (LifecycleNode)
   │
   ├─ 0x204 RT_DRIVE_CMD   (10 ms)   ──▶ MTR
   ├─ 0x169 VCU_SES_REQ    (20 ms)   ──▶ SES  (steer-by-wire)
   ├─ 0x7B9 VCU_SEB_REQ    (20 ms)   ──▶ SEB  (brake-by-wire)
   ├─ 0x110 SYS_MODE_CMD   (10 Hz)   ──▶ all (mode authority)
   └─ 0x001 SAFETY_ESTOP   (event)   ──▶ all (broadcast)

   ◀─ 0x120 SYS_THROTTLE_STS ── MTR  (100 Hz)
   ◀─ 0x206 MTR_MOTOR_FBK   ── MTR  (50 Hz)
   ◀─ 0x201 SES_STATUS      ── SES  (100 Hz)
   ◀─ 0x721 SEB_STATUS      ── SEB  (100 Hz)

CAN low bus (can1 / vcan1)
```

## 4. Protocol Contracts

The wire definitions are declared as YAML contracts, mirroring the canonical contracts in the `etrike` repository. The package vendors a trimmed subset that covers only the messages this bridge transmits or decodes.

The source-of-truth signal layouts for the SES and SEB units are the manufacturer CAN-signal sheets, stored in `data/`:

- `data/by-wire - steering.csv` — SES/EPS-C message and signal definitions (`0x169` command, `0x201` status, `0x202` error, `0x203` version, `0x6FA` test).
- `data/by-wire - brake.csv` — SEB message and signal definitions (`0x7B9` command, `0x721` status, `0x731` error, `0x741` version, `0x6FB` test).

These files are byte-identical to the manufacturer sheets in the `etrike` repository under `docs/communications/`. They are the authoritative reference for the custom SES and SEB codecs.

### 4.1 Contract Files

The trimmed contract set is stored under `protocol/contracts/`:

| File | Messages | Direction | Codec |
|------|----------|-----------|-------|
| `network.yaml` | Bus, node, and instance declarations plus the safety-estop message `0x001` | transmit | generated |
| `mtr.yaml` | `sys_throttle_sts` `0x120`, `mtr_motor_fbk` `0x206` | receive | generated |
| `rt.yaml` | `rt_drive_cmd` `0x204` | transmit | generated |
| `sys.yaml` | `sys_mode_cmd` `0x110` | transmit | generated |
| `ses.yaml` | `vcu_ses_req` `0x169`, `ses_status` `0x201` | transmit, receive | custom |
| `seb.yaml` | `vcu_seb_req` `0x7B9`, `seb_status` `0x721` | transmit, receive | custom |

The high-bus, host, HMI, and powertrain contract files are intentionally omitted.

### 4.2 Generated Codecs

The generated C++ header (`protocol/generated/cpp/etrike_protocol.hpp`) is produced by the vendored generator and committed to the repository. It defines the message structures, the per-message IDs, the DLC values, the cycle times, and the `encode`/`decode` entry points for the five generated messages: the safety-estop `0x001`, the mode command `0x110`, the motor command `0x204`, and the two MTR feedback messages `0x120` and `0x206`. The header is regenerated with `scripts/regenerate.sh` whenever a contract changes; the output is deterministic and is not hand-edited.

### 4.3 Custom Codecs

The SES and SEB controllers use vendor-defined payloads that the generator cannot express as typed signals. Their codecs are therefore vendored verbatim from the `etrike` repository and are validated against both the published vector set and the manufacturer signal sheets in `data/`:

- `protocol/codecs/ses.hpp` — SES command and status codecs.
- `protocol/codecs/seb.hpp` — SEB command and status codecs.
- `protocol/codecs/detail.hpp` — shared frame and checksum validation helpers.
- `protocol/profiles/xor8_ff_v1.hpp` — the XOR8-complement checksum profile.

These files are copied unchanged. They reference `protocol/core/*`, which is also vendored, so the package has no dependency on the `etrike_protocol` ament package.

The byte order of the SES and SEB payloads is little-endian, as implemented by `read_le_*` in the codecs and as documented in the CAN database (Intel byte order). The manufacturer sheets label these fields "Motorola LSB", which is a vendor-tool naming convention; the actual wire order is little-endian and the codecs and vectors agree on it.

## 5. Message Map

### 5.1 Transmitted Messages

| CAN ID | Name | DLC | Period | Payload Summary |
|--------|------|-----|--------|-----------------|
| `0x001` | SAFETY_ESTOP | 0 | event | Empty; broadcast on emergency |
| `0x110` | SYS_MODE_CMD | 1 | 10 Hz, refresh every 1 s | Mode byte: `1` = AUTO, `0` = MANUAL |
| `0x204` | RT_DRIVE_CMD | 5 | 10 ms | `i32 motor_speed_mmps`, `u8 gear` |
| `0x169` | VCU_SES_REQ | 8 | 20 ms | Alignment/control enables, angle raw, slew rate, vehicle speed, rolling counter, checksum |
| `0x7B9` | VCU_SEB_REQ | 8 | 20 ms | Alignment/control enables, control mode, pressure or stroke request, rolling counter, checksum |

The brake request frame `0x205` is intentionally not used. In the production chain that frame is consumed by SYS, which arbitrates brake authority. Because SYS is bypassed, the bridge writes the brake command directly to the SEB unit with `0x7B9` and has no need for `0x205`.

### 5.2 Received Messages

| CAN ID | Name | DLC | Source | Published As |
|--------|------|-----|--------|--------------|
| `0x120` | SYS_THROTTLE_STS | 2 | MTR | `VelocityReport` on `/vehicle/status/velocity_status` |
| `0x206` | MTR_MOTOR_FBK | 4 | MTR | `GearReport` on `/vehicle/status/gear_status` |
| `0x201` | SES_STATUS | 8 | SES | `SteeringReport` on `/vehicle/status/steering_status` |
| `0x721` | SEB_STATUS | 8 | SEB | brake diagnostic (optional) |

The status codecs are the vendored custom codecs, so the received frames are decoded with the SES and SEB status structs, not with the generated codecs.

## 6. Conformance to Immutable Controllers

The three low-level controllers are treated as immutable. Their firmware cannot be modified to accommodate the bridge, so the bridge must satisfy every field, checksum, counter, and timing requirement each controller already enforces. The conformance requirements below are derived from the controller firmware sources and the manufacturer signal sheets in `data/`.

### 6.1 MTR Motor Controller

- **Mode gate:** MTR ignores `0x204` unless the current mode is AUTO. Mode is set from `0x110`. Because RT and SYS are absent, the bridge must broadcast `0x110 = AUTO` while the bridge is active. MTR boots in MANUAL, so until the first AUTO broadcast it ignores drive commands entirely, which is the safe default.
- **Freshness streak:** MTR requires three consecutive fresh `0x204` frames before it applies a command and clears the stale-command fault (`g_cmd_fresh_streak >= 3`).
- **Staleness:** MTR zeroes speed and gear on its own if no `0x204` is received for more than `kCmdStaleTimeoutMs = RtDriveCmd::kCycleMs * 5 = 50` ms in AUTO. The bridge must therefore stream `0x204` every 10 ms, including zero frames while idle, so MTR never trips its internal staleness guard. Because 10 ms is well below the 50 ms deadline, continuous streaming always satisfies it.
- **Startup grace:** MTR suppresses staleness handling for the first 3 s after boot.
- **Command bounds:** speed must be clamped to the reverse/forward limits (`-500` to `+3000` mm/s). Gear switching is MTR's own responsibility; the bridge only requests the desired gear.

### 6.2 SES Steering Unit

- **Enable bits:** every command must set both `alignment_enable` and `control_enable`. RT always sets both, and the unit expects them.
- **Angle encoding:** `target_angle_raw` is the desired angle in 0.1 degree units plus a fixed steer-by-wire offset of `30000`. A centered command is `30000`. The manufacturer sheet defines the target angle as signed with resolution 0.1 degree and offset `-3000`; a negative value corresponds to a left turn, which matches the E-Trike right-positive convention once converted. The bridge therefore negates the Autoware angle (left positive) before applying the offset.
- **Slew rate:** `target_speed_raw` must lie in the range `125` to `525`, where the value expresses the slew rate in degrees per second. RT derives the slew rate from vehicle speed; the bridge does the same.
- **Vehicle speed byte:** byte 6 carries `vehicle_speed_raw`, the current speed in km/h clamped to the range 0 to 255. RT always fills this byte; the bridge must as well.
- **Rolling counter:** a 4-bit wrapping counter is placed in the command payload.
- **Checksum:** byte 7 is the XOR8-complement checksum over bytes 0 through 6.
- **Synchronization:** the unit performs its own 500 ms boot wait and a listen-sync phase. RT only begins commanding after it receives a valid `0x201` status with `angle_aligned` set and a plausible angle (at most 30 degrees from center at sync). The bridge replicates this gate and withholds steering commands until the unit reports alignment.

### 6.3 SEB Brake Unit

- **Enable bits:** every command must set both `alignment_enable` and `control_enable`. SYS sets both in every `0x7B9` it produces, and RT's SEB takeover path sets `control_enable` as well. Omitting either risks the unit rejecting the frame.
- **Pressure mode:** `pressure_request_raw` is `kPa x 0.02`, clamped to `100`. The manufacturer sheet defines the pressure request at byte 3, 8 bits, resolution 0.05 MPa; the full scale is 5 MPa, which corresponds to raw 100.
- **Stroke mode:** `stroke_request_raw` of `600` corresponds to zero millimeters of stroke; `1140` corresponds to the 27 mm maximum. Stroke mode is used when braking is released.
- **Braking flag:** `auto_brake` is set when automated braking is requested.
- **Rolling counter and checksum:** a 4-bit counter and the XOR8-complement checksum are applied exactly as in the SES codec.

## 7. Configuration

All scaling factors, offsets, limits, and timing values are declared in the parameter file `config/direct_bridge.param.yaml` and are loaded and validated at configuration time. No numeric constant is hard-coded in the node implementation.

| Parameter | Default | Meaning |
|-----------|---------|---------|
| `can_interface` | `vcan1` | CAN interface for the low bus; `can1` once wired |
| `loop_rate` | `100.0` | Base control tick rate in hertz |
| `enable_mtr` | `true` | Master switch for motor commands |
| `enable_ses` | `true` | Master switch for steering commands |
| `enable_seb` | `true` | Master switch for brake commands |
| `max_speed_forward` | `3.0` | Forward speed clamp, m/s |
| `max_speed_reverse` | `0.5` | Reverse speed clamp, m/s |
| `max_steering_angle` | `0.747` | Steering angle clamp, rad |
| `max_deceleration` | `5.0` | Deceleration used to derive brake pressure |
| `max_brake_pressure_kpa` | `5000.0` | Full brake pressure reference |
| `command_timeout_ms` | `200` | How long the bridge holds the last ROS command before it sends the zero-speed default; independent of the MTR stream deadline, which the bridge always satisfies by streaming continuously |
| `send_mode_auto` | `true` | Broadcast `0x110 = AUTO` while active |
| `steer_by_wire_offset` | `30000` | SES angle offset in 0.1 degree units |
| `steer_rate_min` | `125.0` | Minimum SES slew rate |
| `steer_rate_max` | `525.0` | Maximum SES slew rate |
| `require_ses_aligned` | `true` | Withhold steering until SES reports alignment |
| `brake_kpa_to_raw` | `0.02` | Pressure conversion factor; pressure raw = `round(kPa x 0.02)` |
| `stroke_zero_raw` | `600` | Stroke raw value for zero millimeters |
| `stroke_max_raw` | `1140` | Stroke raw value for the maximum stroke |
| `publish_brake_diag` | `false` | Publish the decoded SEB status (`0x721`) to `~/output/diagnostics` as a `DiagnosticArray`; disabled by default for a minimal bench tool |

## 8. Node Design

### 8.1 Lifecycle

The node is a `rclcpp_lifecycle::LifecycleNode`.

- **on_configure** loads and validates the parameters and opens the CAN socket. Failure to open the interface or to validate the configuration transitions the node to the failed state.
- **on_activate** starts the control timer and the receive thread. No frame is transmitted until activation.
- **on_deactivate** cancels the timer, closes the CAN socket, and joins the receive thread.
- **on_cleanup** and **on_shutdown** tear down resources in a deterministic order.

### 8.2 Control Loop

A single 100 Hz timer drives all periodic output through internal sub-counters, mirroring the phase relationship used by the controllers:

| Period | Frame | Units |
|--------|-------|-------|
| 10 ms | `0x204` RT_DRIVE_CMD | MTR |
| 20 ms | `0x169` VCU_SES_REQ | SES |
| 20 ms | `0x7B9` VCU_SEB_REQ | SEB |
| 100 ms | `0x110` SYS_MODE_CMD | all |

The mode broadcast runs at 10 Hz to match SYS's cadence (SYS emits on mode change or every 1 s). MTR reads the mode in its 20 Hz safety task, so a persistent 10 Hz broadcast ensures MTR always observes AUTO while the bridge is active.

- **MTR:** speed in meters per second is converted to millimeters per second (`round(v x 1000)`), clamped to `[-max_speed_reverse x 1000, max_speed_forward x 1000]`. The gear is taken from the gear command subscription, or derived from the speed sign when no gear command is present. When the command is stale or the motor is disabled, the bridge streams a zero-speed, neutral-gear frame so MTR does not trip its staleness guard.
- **SES:** the Autoware steering angle (radians, left positive) is negated to the E-Trike convention (right positive), converted to 0.1 degree units, clamped to the steering limit, and offset by `steer_by_wire_offset`. The slew rate is interpolated between `steer_rate_min` and `steer_rate_max` from vehicle speed, clamped to the valid range. Both enable bits are set, the vehicle-speed byte is filled from the current speed in km/h, the rolling counter increments, and the checksum is computed by the vendored codec. Steering output is withheld until a valid, aligned `0x201` status has been observed.
- **SEB:** brake pressure is derived from the longitudinal deceleration. When braking is requested, the command uses pressure mode with `raw = round(kPa / 50)`, clamped to `100`, and sets `auto_brake`. When released, the command uses stroke mode with `stroke_zero_raw`. Both `alignment_enable` and `control_enable` are always set. The rolling counter increments and the checksum is computed by the vendored codec.
- **Mode:** while active and `send_mode_auto` is true, the bridge broadcasts `0x110 = AUTO` at 10 Hz. On emergency the broadcast switches to `0x110 = MANUAL`.

### 8.3 Emergency

The bridge subscribes to `/control/command/emergency_cmd`. On an asserted emergency it broadcasts `0x001` (rate-limited), zeroes the motor, centers the steering, releases the brake, and switches the mode broadcast to `0x110 = MANUAL`. The periodic `0x110 = AUTO` broadcast must be suppressed for the duration of the emergency, otherwise the next AUTO frame would restore motor authority. Command output resumes only after the emergency is cleared and a fresh command arrives.

### 8.4 Command Timeout

If no fresh `control_cmd` has arrived within `command_timeout_ms`, the bridge sends the safe default output: zero-speed neutral motor, centered steering, and released brake. This is the only automatic interlock beyond the firmware-required conformance; the bridge is intentionally a bench tool.

The timeout is independent of the MTR 50 ms stream deadline. The bridge always streams `0x204` continuously, so MTR never observes a gap. The timeout instead bounds how long the bridge keeps replaying a stale command: while a command is stale but within the timeout window, the bridge continues to send it; once the window expires, it switches to the zero-speed default. The default of 200 ms keeps stale-motion replay short. Note that MTR does not independently expire the command in this configuration, because the continuous stream prevents MTR's own staleness guard from engaging.

### 8.5 Receive Thread

A dedicated thread reads frames from the CAN socket and decodes them:

- `0x120` decodes to a `VelocityReport` on `/vehicle/status/velocity_status`.
- `0x206` decodes to a `GearReport` on `/vehicle/status/gear_status`.
- `0x201` is decoded with the vendored SES status codec. The status struct exposes `steering_angle_raw` (little-endian unsigned 16-bit at bytes 2 through 3) and `angle_aligned` (bit 0 of byte 0). The bridge subtracts `steer_by_wire_offset`, converts the remaining 0.1 degree value to radians, sign-flips it to the Autoware convention, and publishes a `SteeringReport` on `/vehicle/status/steering_status`. The `angle_aligned` flag drives the SES transmit gate.
- `0x721` is decoded with the vendored SEB status codec. This is a real frame the SEB unit transmits at 100 Hz (`sender: SEB`, `cycle_ms: 10` per `seb.yaml`), carrying genuine alignment status, control mode, error status (0 = normal, 1/2/3 = L1/L2/L3 faults), stroke, pressure, angle, rolling counter, and checksum. The status struct exposes the control mode, stroke value, and pressure value; because the pressure byte is shared with the high byte of the stroke value, the pressure reading is only meaningful when the unit is in pressure mode. When `publish_brake_diag` is enabled, the decoded status is published to `~/output/diagnostics` as a `DiagnosticArray` (QoS 1). The `alignment_status` flag additionally gates the SEB transmit path, mirroring the SYS boot-sync behavior.

No heartbeat or feedback-freshness interlock is applied. Feedback is used only for reporting and for the SES alignment gate.

## 9. Interfaces

### 9.1 Subscriptions

| Topic | Type |
|-------|------|
| `/control/command/control_cmd` | `autoware_control_msgs/msg/Control` |
| `/control/command/gear_cmd` | `autoware_vehicle_msgs/msg/GearCommand` |
| `/control/command/emergency_cmd` | `tier4_vehicle_msgs/msg/VehicleEmergencyStamped` |

### 9.2 Publications

| Topic | Type |
|-------|------|
| `/vehicle/status/velocity_status` | `autoware_vehicle_msgs/msg/VelocityReport` |
| `/vehicle/status/gear_status` | `autoware_vehicle_msgs/msg/GearReport` |
| `/vehicle/status/steering_status` | `autoware_vehicle_msgs/msg/SteeringReport` |

### 9.3 Autoware Message Mapping

The bridge consumes and produces the standard Autoware vehicle interfaces. The field-level mapping is derived from the message definitions in `autoware_control_msgs` and `autoware_vehicle_msgs`.

**Consumed — `autoware_control_msgs/msg/Control`** on `/control/command/control_cmd`:

| Field | Meaning | Use in Bridge |
|-------|---------|---------------|
| `lateral.steering_tire_angle` | Desired steering tire angle in radians; positive values represent left inclination, negative values represent right inclination | Converted to the SES angle command |
| `longitudinal.velocity` | Desired vehicle velocity in meters per second; positive values represent forward motion | Converted to the MTR speed command |
| `longitudinal.acceleration` | Desired vehicle acceleration in meters per second squared | Converted to the SEB brake pressure when braking |
| `longitudinal.is_defined_acceleration` | Whether the acceleration value is defined by the controller | Gates the brake conversion; a negative defined acceleration indicates braking |
| `longitudinal.jerk` | Desired vehicle jerk; not used | — |

**Consumed — `autoware_vehicle_msgs/msg/GearCommand`** on `/control/command/gear_cmd`:

| Field | Meaning | Use in Bridge |
|-------|---------|---------------|
| `command` | Requested gear; relevant values are `NEUTRAL = 1`, `DRIVE = 2`, `REVERSE = 20`, `LOW = 23`, `NONE = 0` | Mapped to the CAN gear byte (N = 0, D = 1, S = 2, R = 3); when `NONE` or absent, the gear is derived from the speed sign |

**Consumed — `tier4_vehicle_msgs/msg/VehicleEmergencyStamped`** on `/control/command/emergency_cmd`:

| Field | Meaning | Use in Bridge |
|-------|---------|---------------|
| `emergency` | Whether an emergency stop is asserted | Triggers the `0x001` broadcast and the safe default output |
| `stamp` | Message timestamp | Not used |

**Published — `autoware_vehicle_msgs/msg/VelocityReport`** on `/vehicle/status/velocity_status`:

| Field | Source |
|-------|--------|
| `longitudinal_velocity` | MTR `0x120` `speed_mmps` divided by 1000; positive is forward |
| `lateral_velocity` | Set to zero (not measured) |
| `heading_rate` | Set to zero (not measured) |

**Published — `autoware_vehicle_msgs/msg/GearReport`** on `/vehicle/status/gear_status`:

| Field | Source |
|-------|--------|
| `report` | MTR `0x206` `gear_state` mapped to the Autoware gear constants (N = 1, D = 2, S = 23, R = 20) |

**Published — `autoware_vehicle_msgs/msg/SteeringReport`** on `/vehicle/status/steering_status`:

| Field | Source |
|-------|--------|
| `steering_tire_angle` | SES `0x201` `steering_angle_raw` (little-endian unsigned 16-bit) minus `steer_by_wire_offset`, converted from 0.1 degree units to radians, and sign-flipped to the Autoware convention (positive is left) |

The sign conventions are confirmed against the message definitions and the manufacturer sheet: the SES target angle is negative for a left turn (right positive), while the Autoware convention is left positive. The bridge negates the steering angle in both the transmit and receive directions.

## 10. Package Layout

```
direct_bridge/
├── ARCHITECTURE.md
├── WORK_PLAN.md
├── package.xml
├── CMakeLists.txt
├── config/
│   └── direct_bridge.param.yaml
├── data/
│   ├── by-wire - brake.csv
│   └── by-wire - steering.csv
├── launch/
│   └── direct_bridge.launch.py
├── include/
│   └── direct_bridge/
│       └── direct_bridge_node.hpp
├── src/
│   └── direct_bridge_node.cpp
├── scripts/
│   ├── regenerate.sh
│   └── run_bench.py
├── test/
│   ├── test_encode.cpp
│   ├── test_autoware_compat.py
│   └── test_launch_autoware.py
├── vectors/
│   ├── payload-v1.json
│   └── custom-codec-values-v1.json
├── tools/
│   └── protocol.py
└── protocol/
    ├── contracts/
    │   ├── network.yaml
    │   ├── mtr.yaml
    │   ├── rt.yaml
    │   ├── sys.yaml
    │   ├── ses.yaml
    │   └── seb.yaml
    ├── core/
    │   ├── bits.hpp
    │   ├── codec_status.hpp
    │   ├── endian.hpp
    │   ├── frame.hpp
    │   └── supervision.hpp
    ├── codecs/
    │   ├── ses.hpp
    │   ├── seb.hpp
    │   └── detail.hpp
    ├── profiles/
    │   └── xor8_ff_v1.hpp
    └── generated/
        └── cpp/
            └── etrike_protocol.hpp
```

## 11. Safety Posture

This bridge is a bench bring-up tool. Its safety posture is deliberately bare minimum:

- The firmware-mandated conformance requirements (mode gate, freshness streak, staleness streaming, SES alignment gate, SES vehicle-speed byte, SEB dual enable bits, checksums, counters) are honored because the controllers require them for operation.
- The emergency subscription asserts `0x001`, zeroes all units, and switches the mode broadcast to MANUAL.
- The command timeout forces the safe default output.
- No heartbeat monitoring, engagement gating, or feedback-freshness interlocks are implemented, because the bridge is intended for controlled bench use where an operator is in the loop.

The bridge must not be used for autonomous operation. Production safety behaviors remain the responsibility of the `autoware_vehicle_bridge` and the RT/SYS layer.

## 12. Testing Strategy

The testing strategy has four layers: unit tests, a dual-mode bench script, a self-contained Autoware-compatibility pytest, and a real-stack launch test. Together they validate the codec correctness, the controller conformance, the fail-closed behavior, and the Autoware interface compatibility.

### 12.1 Unit Tests

`test/test_encode.cpp` encodes each message from known values and asserts that the bytes match the vectors published in `vectors/payload-v1.json` and `vectors/custom-codec-values-v1.json`, including the SES and SEB XOR8-complement checksum bytes. The SES and SEB encoder outputs are additionally cross-checked against the signal layouts in `data/by-wire - steering.csv` and `data/by-wire - brake.csv`. The generated codecs are validated by the generator's own vector coverage. This test is registered under `BUILD_TESTING` and runs through `colcon test`.

### 12.2 Bench Script (virtual or physical)

`scripts/run_bench.py` is a dual-mode bring-up harness that lives inside the package. It is designed to run unchanged on a virtual interface for bench testing and on the physical low-bus interface for hardware bring-up.

- `--interface vcan1` (default): creates and brings up a virtual CAN interface (`modprobe vcan`, `ip link add vcan1 type vcan`, `ip link set vcan1 up`), matching the existing `ros2_socketcan` vcan setup pattern.
- `--interface can1` (physical): brings up the physical low-bus interface at the low-bus bitrate (`ip link set can1 type can bitrate 500000`, `ip link set can1 up`).

The script then:
- Launches the bridge through `ros2 launch direct_bridge direct_bridge.launch.py can_interface:=<interface>`.
- Injects the four feedback frames the bridge decodes (`0x120`, `0x206`, `0x201`, `0x721`) with `cansend`, using payloads generated by the vendored codecs so the checksums and counters are valid.
- Asserts that the four transmit frames (`0x204`, `0x169`, `0x7B9`, `0x110`) appear with the expected payloads via `candump`.
- Exercises the command-timeout path (stop publishing commands, expect the zero-speed, centered-steering, released-brake default).
- Exercises the emergency path (publish an asserted emergency, expect a `0x001` broadcast and a mode change to MANUAL).
- Tears down the interface and the launched node on exit.

The script works inside the Autoware container or on the host; it does not assume a specific runtime beyond SocketCAN and the `ros2`/`can-utils` tools.

### 12.3 Autoware-Compatibility Tests

Two complementary tests validate that the bridge is drop-in compatible with Autoware's vehicle-interface contract.

**Self-contained pytest (`test/test_autoware_compat.py`):** runs in `colcon test` with no external stack. It spins up `vcan1`, launches the bridge, and runs a mock Autoware command publisher — a small pytest node that publishes `Control`, `GearCommand`, and `VehicleEmergencyStamped` on the exact Autoware topics with the matching QoS. It asserts:
- The lifecycle node reaches the active state and exposes the expected subscriptions and publications.
- The topic names, message types, and QoS match the Autoware contract (`ros2 topic info -v`).
- The transmit frames appear with the expected bytes given the mock commands.
- The reports are published from the injected feedback (`/vehicle/status/*`).
- The timeout and emergency fail-closed paths behave correctly.

This test follows the `etrike_kinect2` launch-test pattern (`ament_add_pytest_test`, `@pytest.mark.launch_test`, `generate_test_description`).

**Real-stack launch test (`test/test_launch_autoware.py`):** validates integration against the actual Autoware control stack rather than a mock. It launches the bridge alongside the real Autoware vehicle-interface launch and verifies end-to-end topic compatibility, QoS negotiation, and lifecycle management. This test is heavier and container-dependent, so it is not part of the default `colcon test` run; it is executed explicitly during validation and on the target hardware.

### 12.4 Hardware Bring-Up

Once the low-bus drop to the Jetson is wired, `scripts/run_bench.py --interface can1` is used against each unit in isolation, starting with the SES steering unit and the SEB brake unit before any motor motion. Each unit is exercised with wheels lifted or the vehicle safely supported. The real-stack launch test from Section 12.3 is run on the target before any autonomous operation is attempted.

## 13. Out of Scope (Restated)

- Lights, turn indicators, and hazard commands.
- High-bus host frames and the host heartbeat.
- Powertrain and DCDC control.
- RT/SYS heartbeat monitoring.
- Engagement and mode-confirmation gating.
- Obstacle distance reporting.
- Any change to SES, SEB, or MTR firmware.
- Any change to the existing `autoware_vehicle_bridge` or `etrike_protocol` packages.
