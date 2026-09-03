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
   The lock is **enforced at the node**, not just drawn in the browser: while
   locked or when the active input mode forbids an axis, the node publishes zero
   velocity / neutral gear regardless of intent (single authority).
4. **Authority limits, not raw axes.** The operator sets a **speed/steer ceiling**
   (max forward/reverse speed, max steering angle) in the UI. The node clamps
   commanded output to that ceiling — the ceiling is enforced server-side, and the
   browser keyboard/axis scaling is a convenience, not the safety boundary.
5. **Autoware topics drive the dashboard.** Every dashboard panel maps 1:1 to an
   Autoware Universe topic/message. No fabricated data in production mode. Sim
   reports are **labeled as synthetic** (provenance badge) and never presented as
   measured feedback.
6. **Freshness is visible.** Every status value carries a `live | late | missing |
   invalid` state and a numeric age, aged by an independent clock — a connected but
   silent topic must not look live. Absent topics degrade gracefully.
7. **One active producer.** Exactly one intent source (browser, keyboard, terminal)
   owns the control path at a time. Intent carries a monotonic `sequence`; the node
   rejects stale/duplicate sequences and, on source loss or browser disconnect,
   publishes an explicit zero/neutral safe frame (not just the deadman timeout).
8. **Backend-owned timing.** The node owns shaping, gating, and safe-release. The
   web bridge is a thin transport: it forwards intent, relays telemetry, and never
   decides whether a command is emitted.
9. **Frontend is ROS-free.** The React UI talks only to the FastAPI WebSocket
   schema; it never touches ROS topics directly. All mutations and queries go
   through one client-neutral, typed WS contract.
10. **Headless operation.** The node runs standalone via `ros2 run` + params.

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

### 4.3 Operation modes & Autoware conflict detection

The console's operation mode is a **requested** intent with **node-enforced**
behavior. The vehicle's *actual* authority comes from `/vehicle/status/control_mode`
(`autoware_vehicle_msgs/msg/ControlModeReport`, published by the E-Trike bridge
from RT ECU state) — the codebase's authoritative "who is driving" signal.

| Requested mode | Meaning | Node `/control/command` behavior | Vehicle actual check |
|---|---|---|---|
| `STOP` | Safe stopped | publishes safe-control + neutral gear | — |
| `FULL` | Autoware Universe drives; viewing only | command publishers **deactivated** (node leaves the topic graph) | expect `AUTONOMOUS`; else show "awaiting AUTO" |
| `SIM` | Autoware sim (no hardware sensors); viewing only | command publishers **deactivated** | — |
| `REMOTE` | Teleop drives **only when ENGAGED** | outputs when engaged | red conflict if `AUTONOMOUS` + engaged; amber warning if `AUTONOMOUS` + disengaged |

**Conflict rules** (computed from `ControlModeReport` feedback, not topic-graph
heuristics):
- **red conflict** — REMOTE + engaged while vehicle reports `AUTONOMOUS` (a real
  drive-authority fight over `/control/command/*`);
- **amber warning** — REMOTE + disengaged while vehicle is `AUTONOMOUS`
  (engaging would conflict);
- **auto confirmed** — FULL/SIM while vehicle is `AUTONOMOUS` (Autoware has the
  vehicle; viewing only).

Telemetry carries both the **requested** mode (`mode.operation_mode`) and the
**actual** vehicle mode (`mode.actual_vehicle_mode`). The old ADAPI
`AUTONOMOUS/LOCAL/REMOTE` operation-mode values are not used here; the manual
control mode uses real `ManualControlMode` constants (`DISABLED=1, PEDALS=2,
ACCELERATION=3, VELOCITY=4`).

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
- **Node-enforced (single authority).** `make_control()` in the node is the only
  place that decides whether a commanded axis reaches `/control/command/*`.
  While `engage=false`, or when the intent source's `input_mode` is not the one
  allowed for an axis (e.g. sliders muted in keyboard mode), the node emits
  zeros/neutral — it never trusts the browser to have disabled a control.
- Unlock requires an explicit **ENGAGE** (or `motor_enable` equivalent). On the
  ADAPI path, engage maps to `enable_autoware_control`.
- **Signal watchdog**: if telemetry stops for `signal_loss_timeout`, the lock
  engages automatically (reference's "commands lock if telemetry stops").

### 6.3.1 Authority Limits (speed/steer ceiling)

The operator can cap how hard the vehicle is allowed to move, independent of
slider/keyboard position:

- The node owns `max_speed_forward`, `max_speed_reverse`, `max_steering_angle`,
  `max_brake_accel`. The UI presents them as **limit sliders + numeric input**
  (port of the reference `Authority limits` sliders) and includes the ceiling in
  each intent tick.
- The node clamps `make_control()` to the operator-set ceiling (never above the
  firmware/parameter max). Browser-side axis scaling (`keys × max/3000`) is a UX
  convenience; the authority boundary is the node clamp.
- Keyboard axes are scaled by the ceiling before shaping, so holding W at a 1 m/s
  ceiling still yields ≤ 1 m/s.

### 6.3.2 Intent Ownership & Sequence

One active producer owns the control path (port of the Control Toolkit's
ownership/lease + stale-sequence model):

- Every `Intent` carries a monotonic `sequence` and a `source`.
- The node rejects an intent whose `sequence` regresses for the same continuous
  source (stale/duplicate/out-of-order), treating it as not-a-command.
- Switching sources (browser → terminal) releases the previous source's stream.
- When intent stops arriving (browser disconnect, tab hidden, explicit release),
  the node publishes an explicit zero/neutral/brake safe frame immediately — it
  does not wait for the `arrival_timeout_ms` deadman.

### 6.3.3 Input-Mode Gating

`input_mode` (`raw` | `keyboard`) is enforced at the node, not only in the UI:

- In `keyboard` mode the node ignores slider/raw axes and uses only the
  WASD/space-derived axes (it is the arbiter, so a stale slider value cannot drive).
- In `raw` mode keyboard axes are ignored.
- The UI shows a **KEYBOARD MODE** overlay and disables the sliders when keyboard
  mode is active; this mirrors the UI, but the node is what makes it safe.

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

**Provenance is preserved.** Synthetic reports carry a `simulated: true` flag in
the telemetry payload and render with a **SIM** badge in the dashboard. They are
never presented as measured feedback. The dashboard shows a **requested vs
vehicle** split (commanded target beside measured feedback) so the operator sees
disagreement even in sim.

### 6.7 Freshness & Ageing

Every status value carries a `freshness` state (`live | late | missing |
invalid`) and a numeric `age_ms`, computed by the node/bridge from the topic's
expected cadence and aged by an independent clock — a connected-but-silent topic
ages to `late`/`missing` and must not look live (port of the Control Toolkit
`freshness.py`):

- `late` — age beyond ~2× expected period;
- `missing` — age beyond ~5× expected period (or a bounded floor);
- `invalid` — a frame arrived but failed validation;
- `unseen` — no frame yet.

The UI renders `age_ms` numerically and greys/dims `late`/`missing` values. The
vehicle card, command-vs-feedback readouts, and dashboard gauges all honor this
state; a `late` feedback value is never presented as current.

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
│ INPUT MODE [raw|keyboard]                     │
│ AUTHORITY LIMITS (ceiling, enforced in node)  │
│   max fwd [----●----] mm/s  max rev [●----]   │
│   max steer [--●--] rad      max brake [●--]  │
│ TEST MODE [manual|auto|sim|mtr|ses|seb]       │
│   MTR[✓] SES[✓] SEB[✓] auto[✓] sim[ ] diag[ ]│
│ LIVE: cmd 1.2 m/s · fbk 1.1 m/s · age 42 ms   │
└──────────────────────────────────────────────┘
```

### 7.0 Sidebar / live readout strip

A compact, always-visible panel (kept inside the single viewport) mirrors the
reference's vehicle card + control toolbelt:

- **Command vs feedback** — `cmd <speed>` · `fbk <speed>` · `cmd yaw` · `fbk
  steer`, each with a freshness chip (`live/late/missing`) and numeric age.
- **TX status** — what `/control/command/*` is actively publishing: armed/locked/
  sim, current authority ceiling, stream-health badge (`LIVE | DELAYED | LOST`).
- **Stop all motion / release** — one danger action that calls the shared
  `controlRelease` (and on the direct path, the node's explicit safe frame).
- **ESTOP observability** — port the reference `observeEstop`: shows *why* an
  ESTOP is active (RT reason code, bus `0x001`, SYS flags), not just an armed flag.
- **Per-topic monitor list** — a compact live/stale list of the `/vehicle/status/*`
  topics the bridge subscribes (name, value, age, freshness), driven by §6.7.

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
│  1.2m/s │ -0.3rad │  DRIVE │ REMOTE│  auto [SIM]│
│  ──●──  │  ──●──  │   D    │   R  │           │
├────────────────────────────────────────────────┤
│  CMD vs FBK   speed 1.2 / 1.1 m/s (42ms)       │
│               yaw   -0.2 / -0.3 rad (20ms)     │
│  TURN [L|R]  HAZARD   DIAG: [CAN][heartbeat]    │
│  ●  ○        ●        [estop][mode][timeout]    │
├────────────────────────────────────────────────┤
│  OPERATION MODE  manual control  drive mode     │
│  velocity  target  accel  target  steer target  │
│  bridge params: MTR✓ SES✓ SEB✓ auto✓ sim□ diag□ │
│  freshness: live/late/missing + age per value   │
└────────────────────────────────────────────────┘
```

### 8.1 Panels

| Panel | Source topic | Note |
|---|---|---|
| Speedometer | `/vehicle/status/velocity_status` | needle + digital + freshness |
| Steering gauge | `/vehicle/status/steering_status` | center needle + freshness |
| Gear lamp | `/vehicle/status/gear_status` | D/R/N/P |
| Turn lamps | `/vehicle/status/turn_indicators_status` | left/right |
| Hazard lamp | `/vehicle/status/hazard_lights_status` | |
| Operation mode | requested intent (`operation_mode`) + `/vehicle/status/control_mode` | STOP/FULL/SIM/REMOTE requested → AUTO/MANUAL actual |
| Manual control | node-derived | DISABLED/PEDALS/ACCEL/VELOCITY |
| Diagnostics | `~/output/diagnostics` | strip of key diag values |
| Target/effort | node-derived / `/vehicle/status/actuation_status` | commanded vs actual |
| **Cmd vs fbk** | node-derived | paired rows — `cmd` target beside measured `fbk`, with freshness + age (§7.0) |
| Bridge params | node-derived | live test-mode/param readout |
| **Provenance** | node-derived | `simulated: true` → **SIM** badge; sim reports never shown as measured |
| **Age/freshness** | node/bridge | every value carries `live/late/missing/invalid` + `age_ms` (§6.7) |

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
| `operation_mode` | string | STOP/FULL/SIM/REMOTE — requested (§4.3) |
| `manual_control_mode` | string | DISABLED/PEDALS/ACCELERATION/VELOCITY (real constants) |
| `engage` | bool | control lock |
| `input_mode` | string | `raw` \| `keyboard` — node-enforced (§6.3.3) |
| `sequence` | int | monotonic, per source — stale/regressed rejected (§6.3.2) |
| `source` | string | producer identity (`web`, `keyboard`, `terminal`) |
| `max_speed_forward` / `max_speed_reverse` | number | authority ceiling, m/s (§6.3.1) |
| `max_steering_angle` | number | authority ceiling, rad |
| `max_brake_accel` | number | authority ceiling, m/s² |
| `test_mode` | string | manual/auto/sim/mtr_only/ses_only/seb_only |
| `bridge_params` | object | enable_mtr/ses/seb, sim_mode, diag, limits |
| `mode_cycle` / `toggle_auto` / `reset_pose` / `estop` | int | monotonic counters |

### Telemetry (node → client)

| Field | Meaning |
|---|---|
| `mode.{operation_mode,actual_vehicle_mode,manual_control_mode,drive_mode,mode_status}` | modes — requested (`operation_mode`) vs vehicle actual (`actual_vehicle_mode`) |
| `mode.{autoware_conflict,autoware_warning,autoware_auto_confirmed}` | bools — conflict/authority from `control_mode` feedback (§4.3) |
| `vehicle.{velocity,steer_angle,gear,turn_indicator,hazard}` | live state |
| `target.{target_velocity,target_acceleration,target_steer}` | commanded |
| `shift.{shift_state,pending_gear}` | gear shift progress |
| `test_mode` | active profile |
| `watchdog_tripped`, `info`, `timestamp` | safety + status |
| `vehicle.*freshness` / `age_ms` | per-value `live/late/missing/invalid` + numeric age (§6.7) |
| `simulated` | bool — synthetic report provenance (SIM badge) |
| `requested.{speed,steer,gear}` | commanded target for cmd-vs-fbk split (§7.0) |
| `stream.{sequence,heartbeat_ok}` | WS sequence + liveness (heartbeat) |

## 11. Safety

- **Control lock** — explicit engage gates all command output; a LOCKED overlay
  shows in the UI. **Enforced at the node**, not only in the browser (§6.3).
- **Authority limits** — operator-set speed/steer/brake ceiling clamped in
  `make_control()`, never above firmware max (§6.3.1).
- **Stale-sequence rejection** — one active producer; regressed/duplicate intents
  ignored (§6.3.2).
- **Explicit safe frame on loss** — browser disconnect/tab-hide triggers an
  immediate zero/neutral/brake frame, not just the deadman timeout (§6.3.2).
- **Deadman watchdog** — `arrival_timeout_ms`; brakes on timeout.
- **Emergency stop** — independent of mode; max braking + heartbeat stop on Path B.
- **Lifecycle** — commands only emitted while active.
- **Sim mode** — synthetic reports only; no real command output; SIM badge.
- **Rate limits** — clamped to vehicle limits (E-Trike: ±3.0 m/s, ±0.747 rad).

## 12. Testing Strategy

- **Node unit tests** — gtest with mock gateway; verify lock, watchdog, estop,
  mode transitions, sim reports. Extend for: **node-enforced lock/input-mode**,
  **authority-limit clamp**, **stale-sequence rejection**, **explicit safe-frame
  on release**.
- **Web tests** — pytest for schemas (Zod↔Pydantic parity) + WS intent→publish.
  Extend for: telemetry payload build (freshness/age/simulated), heartbeat +
  sequence, typed error envelope.
- **Frontend tests** — Vitest + RTL for console/dashboard (authority-limit
  sliders, cmd-vs-fbk readout, SIM badge, freshness states); Playwright e2e.
- **Integration** — node + web + UI on `vcan1` with `ecu_sim.py` (or sim mode);
  WebSocket smoke via curl/websocat. Verify: browser disconnect → node publishes
  explicit safe frame; sim reports labeled; stale slider cannot drive in keyboard
  mode.

## 13. Out of Scope (Restated)

- Vehicle-specific hardware mappings.
- Perception / planning / mapping integration.
- Production autonomous operation; this is a manual operator tool.
- Zenoh transport (future axis).
