# autoware_teleop — Architecture

## 1. Purpose

`autoware_teleop` is a standalone, community-oriented teleoperation extension for
**Autoware Universe**. It lets an operator drive an Autoware vehicle from a
terminal, a browser dashboard, or a gamepad, injecting manual control commands
and rendering live vehicle telemetry from the topics Autoware actually exposes.

The design is modeled on a proven reference: the LeadMate `robot_control`
dashboard (PySide6 + ROS2) which drives a standard `cmd_vel` robot with a rich
dashboard. Here the command surface is **Autoware's** vehicle interface, so the
console and dashboard are built around the topics Autoware Universe provides.

It is an independent Autoware Universe extension, decoupled from specific vehicle
hardware. It supports two integration paths:

- **Direct vehicle interface** — publishes `/control/command/*` and reads
  `/vehicle/status/*` (used by our E-Trike `autoware_vehicle_bridge` and
  `direct_bridge`).
- **External command / ADAPI** — publishes `/external/selected/*`, calls the
  operation-mode services, and maintains an operator heartbeat (the canonical,
  gate-enforced Autoware remote-operator path).

## 2. Scope

### 2.1 In Scope

- A transport-blind manual-control core with pluggable intent sources and
  telemetry sinks.
- A keyboard intent source (browser and terminal) with WASD-style control and
  **hold-to-move** semantics.
- A **motor/control lock** (deadman + explicit engage) that visually locks the
  console when disabled — the same pattern as the reference's `LOCKED` overlay.
- A web console and a feedback dashboard that visualize the Autoware topics.
- Two Autoware gateways: `direct` and `adapi`.
- Safety: deadman watchdog, emergency stop, operator heartbeat, control lock.
- A FastAPI web backend (WS bridge) and a React frontend.
- A **self-contained sim/bench mode** so the UI works with no hardware or bridge.

### 2.2 Out of Scope

- Vehicle-specific hardware mappings (E-Trike-specific, other OEMs).
- Perception, planning, or mapping integration.
- Localization seed / route planning (unless trivial hooks).
- Production autonomous operation; this is a manual operator tool.

## 3. Design Principles

1. **Transport-blind core.** The control loop depends only on an *intent source*
   and a *telemetry sink*, behind an `AutowareGateway`. Keyboard, WebSocket, and
   Zenoh are pluggable I/O.
2. **Gateway seam.** The `AutowareGateway` abstracts how commands reach Autoware.
   `direct` targets `/control/command/*`; `adapi` targets `/external/selected/*`
   plus operation-mode services. Selected by a ROS parameter.
3. **Safety first.** A deadman watchdog brakes when no fresh intent arrives within
   `arrival_timeout_ms`. A **control lock** (engage/motor-enable) visually and
   functionally gates all command output — the operator must unlock before the
   vehicle moves, mirroring the reference's `LOCKED` overlay + `motor_enable`.
4. **Autoware topics drive the dashboard.** Every dashboard panel maps 1:1 to an
   Autoware Universe topic/message. No fabricated data in production mode.
5. **Sim mode for development.** When `test_mode=sim`, the node synthesizes
   `/vehicle/status/*` reports from its own commanded values (like the reference's
   SIM source), so the UI is fully demonstrable without a bridge or hardware.
6. **Frontend is ROS-free.** The React UI talks only to the FastAPI WebSocket
   schema; it never touches ROS topics directly.
7. **Headless operation.** The node runs standalone via `ros2 run` + params.

## 4. Autoware Topic Surface (what the console/dashboard use)

The console and dashboard are built directly from the Autoware Universe message
packages present in this workspace (`autoware_vehicle_msgs`,
`tier4_vehicle_msgs`, `autoware_control_msgs`, `autoware_adapi_v1_msgs`).

### 4.1 Command topics (console output)

| Topic | Type | Control |
|---|---|---|
| `/control/command/control_cmd` | `autoware_control_msgs/msg/Control` | throttle (velocity), brake (acceleration), steering |
| `/control/command/gear_cmd` | `autoware_vehicle_msgs/msg/GearCommand` | PARK / DRIVE / REVERSE / NEUTRAL |
| `/control/command/turn_indicators_cmd` | `autoware_vehicle_msgs/msg/TurnIndicatorsCommand` | left / right |
| `/control/command/hazard_lights_cmd` | `autoware_vehicle_msgs/msg/HazardLightsCommand` | hazard on/off |
| `/control/command/emergency_cmd` | `tier4_vehicle_msgs/msg/VehicleEmergencyStamped` | emergency stop |
| (ADAPI) `/external/selected/*` | various | external-command path |
| (ADAPI) `/api/operation_mode/change_to_*` | service | STOP / AUTO / REMOTE / LOCAL |
| (ADAPI) `/api/operation_mode/enable_autoware_control` | service | engage |

### 4.2 Status topics (dashboard input)

| Topic | Type | Dashboard panel |
|---|---|---|
| `/vehicle/status/velocity_status` | `VelocityReport` | speedometer |
| `/vehicle/status/steering_status` | `SteeringReport` | steering gauge |
| `/vehicle/status/gear_status` | `GearReport` | gear lamp |
| `/vehicle/status/turn_indicators_status` | `TurnIndicatorsReport` | turn lamps |
| `/vehicle/status/hazard_lights_status` | `HazardLightsReport` | hazard lamp |
| `/vehicle/status/control_mode` | `ControlModeReport` | mode indicator |
| `/vehicle/status/actuation_status` | `ActuationStatusStamped` | accel/brake/steer effort |
| `/vehicle/status/battery_charge` | `tier4_vehicle_msgs/BatteryStatus` | battery |
| `/api/operation_mode/state` | `OperationModeState` | operation-mode lamp |
| `~/output/diagnostics` | `DiagnosticArray` | diagnostic strip |

The **E-Trike bridges** currently publish a subset (velocity/steering/gear/turn/
hazard/control_mode/diagnostics). The dashboard degrades gracefully: panels whose
topic is absent show a greyed "no data" state.

## 5. Repository Layout

```
autoware_teleop/                      # standalone extension repo
├── teleop-architecture.md
├── work-plan.md
├── README.md
├── autoware_teleop_msgs/             # Intent message package
├── autoware_teleop/                  # ROS 2 rclcpp lifecycle node
│   ├── package.xml  CMakeLists.txt
│   ├── include/autoware_teleop/
│   │   ├── node.hpp                 # LifecycleNode (single control authority)
│   │   ├── intent/                  # intent sources
│   │   │   ├── keyboard.hpp         # browser keyboard (WS) + terminal
│   │   │   └── websocket.hpp        # remote intent from FastAPI
│   │   ├── telemetry/               # telemetry sinks
│   │   │   ├── console.hpp          # terminal render
│   │   │   └── websocket.hpp        # outbound telemetry
│   │   ├── gateway/
│   │   │   ├── direct.hpp           # /control/command/* + /vehicle/status/*
│   │   │   └── adapi.hpp            # /external/selected/* + op-mode
│   │   └── core/
│   │       ├── control_loop.hpp     # 10 Hz loop, mode plugins
│   │       ├── modes.hpp            # stop / physics / cruise
│   │       ├── watchdog.hpp         # deadman
│   │       └── lock.hpp             # control lock (engage/motor-enable)
│   ├── src/
│   ├── config/teleop.yaml
│   ├── launch/teleop.launch.xml
│   └── test/
├── autoware_teleop_web/             # FastAPI backend (thin WS bridge)
│   ├── pyproject.toml
│   ├── app/main.py  schemas.py  ros_bridge.py
│   └── test/
├── autoware_teleop_ui/              # React frontend
│   ├── package.json  vite.config.ts
│   ├── src/
│   │   ├── components/  (Console, Dashboard, ...)
│   │   ├── stores/  lib/
│   └── tests/
└── docs/
```

## 6. Components

### 6.1 ROS 2 Node (`autoware_teleop`)

`rclcpp::lifecycle::LifecycleNode`. The **single authority** publishing
`/control/command/*`. Lifecycle:

- **on_configure** — load params, build gateway + intent/telemetry plugins.
- **on_activate** — start control loop, telemetry, lock armed/required.
- **on_deactivate** — stop loop, release to safe state.
- **on_cleanup / on_shutdown** — teardown.

Control loop at 10 Hz (matches `vehicle_cmd_gate` `update_rate`).

### 6.2 Intent Sources

- **keyboard (browser)** — WASD + Space + gear keys over WS. Hold-to-move:
  keys are tracked as held/not-held, command ramps up while held and decays on
  release (reference `send_commands` behavior).
- **keyboard (terminal)** — curses reader, same keymap.
- **websocket** — JSON intent from FastAPI (includes keyboard events + sliders).

### 6.3 Control Lock

Mirrors the reference's `motor_enable` + `LOCKED` overlay:

- A `locked` boolean gates all command output. When locked, the node publishes
  zero velocity / neutral gear and the UI shows a **LOCKED** overlay over the
  console (greyed sliders, disabled buttons).
- Unlock requires an explicit **ENGAGE** (or `motor_enable` equivalent). On the
  ADAPI path, engage maps to `enable_autoware_control`.
- **Signal watchdog**: if telemetry stops for `signal_loss_timeout`, the lock
  engages automatically (reference's "commands lock if telemetry stops").

### 6.4 Telemetry Sinks

- **console** — terminal render of operation mode, gear, speed, steer, estop,
  lock state, diagnostics.
- **websocket** — JSON telemetry to the browser.

### 6.5 Autoware Gateways

**`direct` gateway (Path A):**
- Publishes `/control/command/{control_cmd,gear_cmd,emergency_cmd}` (+ turn/
  hazard on the production bridge).
- Subscribes `/vehicle/status/{velocity,steering,gear,turn_indicators,hazard,
  control_mode}_status` + `~/output/diagnostics`.
- QoS: commands `QoS(1).reliable()` VOLATILE; reports `QoS(1)`.

**`adapi` gateway (Path B):**
- Publishes `/external/selected/*`; calls `/api/operation_mode/change_to_*`.
- Subscribes `/api/operation_mode/state`.
- Relies on `vehicle_cmd_gate` for STOP/engage/heartbeat enforcement.

### 6.6 Sim Mode

When `test_mode=sim`, the node publishes synthetic `/vehicle/status/*` reports
derived from its own commanded velocity/steer/gear (like the reference SIM
source). This makes the dashboard show live movement from UI sliders with **no
bridge and no hardware** — the primary development/demo path.

## 7. Console (React UI)

The console is the control surface, modeled on the reference's keypad + lock.

```
┌──────────────────────────────────────────────┐
│ OPERATION [STOP|AUTO|LOCAL|REMOTE]  MANUAL    │
│            [PEDALS|ACCEL|VELOCITY]            │
│ [ENGAGE/LOCK]          [ESTOP]                │
│ ┌──────────────────────────────────────────┐  │
│ │        LOCKED  (overlay when locked)     │  │
│ │  THROTTLE ────────────●─────             │  │
│ │  BRAKE    ─────────────●────             │  │
│ │  STEER    ──────●─────────────           │  │
│ │  [D] [R] [N]  TURN[L|R]  HAZARD          │  │
│ └──────────────────────────────────────────┘  │
│ TEST MODE [manual|auto|sim|mtr|ses|seb]       │
│   MTR[✓] SES[✓] SEB[✓] auto[✓] sim[ ] diag[ ]│
└──────────────────────────────────────────────┘
```

### 7.1 Keyboard map (browser focus on console)

| Key | Action |
|---|---|
| `W`/`S` | throttle up/down (hold to ramp) |
| `A`/`D` | steer left/right (hold) |
| `Space` | brake (hold) / ESTOP toggle |
| `X`/`C`/`V` | gear DRIVE / REVERSE / PARK |
| `E` | engage/lock toggle |
| `M` | cycle drive mode |
| `F` | hazard toggle |

Keys are tracked as held (`keys[w]=true`) and command ramps/decays like the
reference `send_commands`.

## 8. Dashboard (React UI)

The dashboard visualizes the Autoware status topics. Panels map 1:1 to topics;
absent topics show a greyed "no data".

```
┌────────────────────────────────────────────────┐
│  SPEED  │  STEER  │  GEAR  │  MODE │  TEST     │
│  1.2m/s │ -0.3rad │  DRIVE │ REMOTE│  auto     │
│  ──●──  │  ──●──  │   D    │   R  │           │
├────────────────────────────────────────────────┤
│  TURN [L|R]  HAZARD   DIAG: [CAN][heartbeat]    │
│  ●  ○        ●        [estop][mode][timeout]    │
├────────────────────────────────────────────────┤
│  OPERATION MODE  manual control  drive mode     │
│  velocity  target  accel  target  steer target  │
│  bridge params: MTR✓ SES✓ SEB✓ auto✓ sim□ diag□ │
└────────────────────────────────────────────────┘
```

### 8.1 Panels

| Panel | Source topic | Note |
|---|---|---|
| Speedometer | `/vehicle/status/velocity_status` | needle + digital |
| Steering gauge | `/vehicle/status/steering_status` | center needle |
| Gear lamp | `/vehicle/status/gear_status` | D/R/N/P |
| Turn lamps | `/vehicle/status/turn_indicators_status` | left/right |
| Hazard lamp | `/vehicle/status/hazard_lights_status` | |
| Operation mode | `/api/operation_mode/state` | STOP/AUTO/REMOTE/LOCAL |
| Manual control | node-derived | PEDALS/ACCEL/VELOCITY |
| Diagnostics | `~/output/diagnostics` | strip of key diag values |
| Target/effort | node-derived / `/vehicle/status/actuation_status` | commanded vs actual |
| Bridge params | node-derived | live test-mode/param readout |

### 8.2 Screen-fit

- **Single-page, fixed grid** (max ~1280×800), no vertical scroll for the core
  console + dashboard.
- **Responsive**: on narrow screens the dashboard stacks under the console; on
  wide screens it sits side-by-side.
- All widgets are compact (small text, tight spacing) so the full surface fits
  one viewport — the same intent as the reference's single-window dashboard.

## 9. Data Flow

```
 Browser (React) ──WS──▶ FastAPI (schemas) ──▶ autoware_teleop (node)
   │                       │                    │
   │  console intents ─────┘                    ▼  core loop + lock + deadman
   │                                            ▼  gateway (direct | adapi)
   │                                   /control/command/*  or  /external/*
   │                                            │
   │  dashboard ◀── WS telemetry ◀── /vehicle/status/*  ◀─┘
   │  (speed/steer/gear/turn/mode/diag)          │
   │                          ◀── sim reports (test_mode=sim)
```

## 10. WebSocket Schema (FastAPI ↔ browser)

### Intent (client → node)

| Field | Type | Meaning |
|---|---|---|
| `throttle` / `brake` / `steer` | number | drive axes (−1..1) |
| `gear` | string | PARK/DRIVE/REVERSE/NEUTRAL |
| `turn_indicator` | string | NONE/LEFT/RIGHT |
| `hazard` | bool | hazard on/off |
| `operation_mode` | string | STOP/AUTO/LOCAL/REMOTE |
| `manual_control_mode` | string | PEDALS/ACCELERATION/VELOCITY |
| `engage` | bool | control lock |
| `test_mode` | string | manual/auto/sim/mtr_only/ses_only/seb_only |
| `bridge_params` | object | enable_mtr/ses/seb, sim_mode, diag, limits |
| `mode_cycle` / `toggle_auto` / `reset_pose` / `estop` | int | monotonic counters |

### Telemetry (node → client)

| Field | Meaning |
|---|---|
| `mode.{operation_mode,manual_control_mode,drive_mode,mode_status}` | modes |
| `vehicle.{velocity,steer_angle,gear,turn_indicator,hazard}` | live state |
| `target.{target_velocity,target_acceleration,target_steer}` | commanded |
| `shift.{shift_state,pending_gear}` | gear shift progress |
| `test_mode` | active profile |
| `watchdog_tripped`, `info`, `timestamp` | safety + status |

## 11. Safety

- **Control lock** — explicit engage gates all command output; a LOCKED overlay
  shows in the UI. On signal loss, the lock engages automatically.
- **Deadman watchdog** — `arrival_timeout_ms`; brakes on timeout.
- **Emergency stop** — independent of mode; max braking + heartbeat stop on Path B.
- **Lifecycle** — commands only emitted while active.
- **Sim mode** — synthetic reports only; no real command output.
- **Rate limits** — clamped to vehicle limits (E-Trike: ±3.0 m/s, ±0.747 rad).

## 12. Testing Strategy

- **Node unit tests** — gtest with mock gateway; verify lock, watchdog, estop,
  mode transitions, sim reports.
- **Web tests** — pytest for schemas (Zod↔Pydantic parity) + WS intent→publish.
- **Frontend tests** — Vitest + RTL for console/dashboard; Playwright e2e.
- **Integration** — node + web + UI on `vcan1` with `ecu_sim.py` (or sim mode);
  WebSocket smoke via curl/websocat.

## 13. Out of Scope (Restated)

- Vehicle-specific hardware mappings.
- Perception / planning / mapping integration.
- Production autonomous operation; this is a manual operator tool.
- Zenoh transport (future axis).
