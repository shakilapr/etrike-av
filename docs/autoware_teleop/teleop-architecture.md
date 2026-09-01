# autoware_teleop — Architecture

## 1. Purpose

`autoware_teleop` is a standalone, community-oriented teleoperation extension for
**Autoware Universe**. It lets an operator drive an Autoware vehicle from a
terminal, a browser dashboard, or a gamepad, injecting manual control commands
and rendering live vehicle telemetry.

It is designed as an independent Autoware Universe extension, decoupled from any
specific vehicle hardware. It supports two integration paths into Autoware:

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
- A keyboard (terminal) intent source and a WebSocket intent source.
- A terminal console telemetry sink and a WebSocket telemetry sink.
- Two Autoware gateways: `direct` and `adapi`.
- Safety: deadman watchdog, emergency stop, operator heartbeat.
- A FastAPI web backend exposing the WebSocket schema and serving the React UI.
- A React frontend (game-console controls + feedback dashboard).

### 2.2 Out of Scope

- Vehicle-specific mappings (E-Trike, other OEMs).
- Perception, planning, or mapping integration.
- Localization seed / route planning (unless trivial hooks).
- Production-grade autonomous operation; this is a manual-operator tool.

## 3. Design Principles

1. **Transport-blind core.** The control loop depends only on an *intent
   source* and a *telemetry sink*, behind an `AutowareGateway`. Keyboard,
   WebSocket, and Zenoh are all pluggable I/O; adding a new front-end never
   touches the control logic.
2. **Gateway seam.** The `AutowareGateway` abstracts how commands reach Autoware.
   `direct` targets `/control/command/*`; `adapi` targets `/external/selected/*`
   plus operation-mode services. Selected by a ROS parameter, default `direct`.
3. **Safety first.** A deadman watchdog brakes when no fresh intent arrives
   within `arrival_timeout_ms`. Emergency stop is independent of the active
   drive mode. The `adapi` path additionally relies on Autoware's own gate and
   heartbeat enforcement.
4. **Frontend is ROS-free.** The React UI talks only to the FastAPI WebSocket
   schema (throttle/brake/steer/gear/estop intents + telemetry), never to ROS
   topics directly. This keeps the UI testable and reusable.
5. **Headless operation.** The node runs standalone via `ros2 run` with ROS
   params and CLI flags, so shell scripts and CI can exercise it without the web
   stack.

## 4. Repository Layout

```
autoware_teleop/                      # standalone extension repo
├── teleop-architecture.md
├── work-plan.md
├── README.md
├── autoware_teleop/                  # ROS 2 rclcpp lifecycle node
│   ├── package.xml
│   ├── CMakeLists.txt
│   ├── include/autoware_teleop/
│   │   ├── node.hpp                 # LifecycleNode
│   │   ├── intent/
│   │   │   ├── intent_source.hpp    # ABC
│   │   │   ├── keyboard.hpp         # curses stdin (WASD/Space/Gear/E)
│   │   │   └── websocket.hpp        # remote intent from FastAPI
│   │   ├── telemetry/
│   │   │   ├── telemetry_sink.hpp   # ABC
│   │   │   ├── console.hpp          # terminal render
│   │   │   └── websocket.hpp        # outbound telemetry
│   │   ├── gateway/
│   │   │   ├── autoware_gateway.hpp # ABC
│   │   │   ├── direct.hpp           # Path A
│   │   │   └── adapi.hpp            # Path B
│   │   └── core/
│   │       ├── control_loop.hpp     # mode plugins, rate
│   │       ├── modes.hpp            # stop / physics / cruise
│   │       └── watchdog.hpp         # deadman
│   ├── src/
│   ├── config/teleop.yaml
│   ├── launch/teleop.launch.xml
│   └── test/                        # pytest / gtest with mock gateway
├── autoware_teleop_web/             # FastAPI backend (thin WS bridge)
│   ├── pyproject.toml
│   ├── app/
│   │   ├── main.py                  # FastAPI app, static SPA, /ws
│   │   ├── schemas.py               # Pydantic intent/telemetry
│   │   ├── ws.py                    # WebSocket endpoint
│   │   └── ros_bridge.py            # rclpy (optional; or proxy to node)
│   └── test/
├── autoware_teleop_ui/              # React frontend (served by FastAPI)
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── src/
│   │   ├── components/              # console, gauges, dashboard
│   │   ├── stores/                  # zustand
│   │   └── lib/                     # ws client, zod schemas
│   └── tests/                       # Vitest, RTL, Playwright
└── docs/
```

## 5. Components

### 5.1 ROS 2 Node (`autoware_teleop`)

A `rclcpp::lifecycle::LifecycleNode` with a deterministic lifecycle:

- **on_configure** — load params, build the selected gateway and intent/telemetry
  plugins, validate configuration.
- **on_activate** — start the control loop and any socket/console threads.
- **on_deactivate** — stop the loop, release the operator (safe state).
- **on_cleanup / on_shutdown** — tear down.

The control loop runs at a configurable rate (default 10 Hz, matching Autoware's
`vehicle_cmd_gate` `update_rate`).

### 5.2 Intent Sources

- **keyboard** — curses-based terminal reader: `W`/`S` throttle, `A`/`D` steer,
  `Space` brake, `X`/`C`/`V` gear (Drive/Reverse/Park), `Z` toggle auto/remote,
  `R` seed pose, `E` emergency stop, `Q` quit.
- **websocket** — receives JSON intent objects from the FastAPI bridge.

### 5.3 Telemetry Sinks

- **console** — terminal render of live operation mode, gear, real/target speed,
  steering, CAN/estop state.
- **websocket** — publishes JSON telemetry to the FastAPI bridge for the browser.

### 5.4 Autoware Gateways

**`direct` gateway (Path A):**
- Publishes `/control/command/control_cmd`, `/control/command/gear_cmd`,
  `/control/command/emergency_cmd`.
- Subscribes `/vehicle/status/{velocity,steering,gear}_status`.
- QoS: commands `QoS(1).reliable()` VOLATILE; reports `QoS(1)`.
- This is the path our E-Trike bridges consume.

**`adapi` gateway (Path B):**
- Publishes `/external/selected/control_cmd`, `/external/selected/gear_cmd`,
  `/external/selected/heartbeat`.
- Calls `/api/operation_mode/change_to_stop`, `/change_to_remote`,
  `/change_to_local` (whichever `operator_mode` selects).
- Subscribes `/api/operation_mode/state`.
- Relies on `autoware_vehicle_cmd_gate` (remaps `input/external/*`) for STOP /
  engage / heartbeat enforcement.

### 5.5 Control Core

- **modes**: `stop` (required initial + emergency mode, max braking), `physics`
  (inertia/friction, steering auto-center), `cruise` (target-speed snap/ramp,
  steering hold). Mode plugins are config-selected.
- **watchdog**: if no fresh intent within `arrival_timeout_ms` (default 500 ms),
  deadman-brakes until input resumes. Prevents a stale/disconnected client from
  leaving the vehicle driving.

## 6. Data Flow

```
 Browser (React) ──WS──▶ FastAPI (schemas) ──▶ autoware_teleop (intent.websocket)
   │                                          │
   │                                          ▼  core control loop
   │                                          │
   │                                          ▼  gateway (direct | adapi)
   │                                          ▼
   │                               /control/command/*  or  /external/selected/*
   │                                          │
   │  telemetry ◀── WS ◀── telemetry.websocket ◀── /vehicle/status/* ◀─────────┘
   │
 Curses keyboard ───────────────▶ intent.keyboard (same core)
```

The same control loop consumes intents from any source; the gateway determines
the Autoware transport. This is the "two axes" model from the reference
`autoware_manual_control` project, adapted for a web-first operator.

## 7. Interfaces

### 7.1 WebSocket Schema (FastAPI ↔ browser)

**Intent (client → node), one object per control tick:**

| Field | Type | Meaning |
|---|---|---|
| `throttle` / `brake` / `steer` | number | drive axes (−1..1 or normalized) |
| `gear` | string | `PARK`, `DRIVE`, `REVERSE` |
| `mode_cycle` / `toggle_auto` / `reset_pose` / `estop` | integer | monotonic counters; increment to trigger |

**Telemetry (node → client), every control tick:**

| Field | Meaning |
|---|---|
| `operation_mode` / `mode` / `mode_status` | operation mode, active drive mode, status |
| `velocity` / `steer_angle` / `gear` | live vehicle state |
| `target_velocity` / `target_acceleration` / `target_steer` | commanded values |
| `shift_state` / `pending_gear` | gear-shift progress |
| `info` | human-readable status / last error |
| `watchdog_tripped` | deadman state |
| `timestamp` | publish time (ms) |

### 7.2 ROS Interfaces

See gateway sections above. The node exposes the standard Autoware vehicle
interface topics, so it integrates with any compliant vehicle interface or the
canonical external-command path.

## 8. Safety

- **Deadman watchdog** — configurable `arrival_timeout_ms`; brakes on timeout.
- **Emergency stop** — independent of drive mode; commands max braking (and, on
  Path B, heartbeat stop).
- **Lifecycle** — commands are only emitted while active; deactivation returns to
  a safe state.
- **Path B gate safety** — Autoware's `vehicle_cmd_gate` enforces STOP / engage /
  heartbeat; the teleop node supplies the heartbeat it requires.
- **Rate limits** — speed/accel/steering clamped by mode config, matching vehicle
  limits (E-Trike: ±3.0 m/s, ±0.747 rad).

## 9. Testing Strategy

- **Node unit tests** — gtest/pytest with a mock `AutowareGateway` and mock
  intent sources; verify mode transitions, watchdog, estop, gear shift.
- **Web backend tests** — pytest for the FastAPI bridge: validate schemas (Zod↔
  Pydantic parity), WS intent→publish, telemetry→WS.
- **Frontend tests** — Vitest + React Testing Library for components; Playwright
  for end-to-end browser flows.
- **Integration** — `ros2 run autoware_teleop` with `vcan1` + `ecu_sim.py`
  against both bridges; WebSocket smoke test via curl/websocat.

## 10. Out of Scope (Restated)

- Vehicle-specific calibration and hardware mappings.
- Perception / planning / mapping.
- Production autonomous driving; this is a manual operator tool.
- Zenoh transport (future axis; noted in the reference project).
