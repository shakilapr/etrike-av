# autoware_teleop — Work Plan

## 1. Goal

Build a standalone Autoware Universe teleoperation extension: a terminal / web /
gamepad manual-control console that injects commands and renders vehicle
telemetry, supporting both the direct vehicle-interface path and the canonical
ADAPI external-command path.

## 2. Constraints

- **Language**: C++ (`rclcpp`) for the ROS 2 node, matching Autoware Universe
  convention. Python (`FastAPI`/`rclpy`) only for the web bridge layer where it
  fits the existing kinect/web tooling.
- **Architecture**: transport-blind core (pluggable intent/telemetry) behind an
  `AutowareGateway` seam (see `teleop-architecture.md`).
- **Safety**: deadman watchdog, emergency stop, lifecycle-managed command
  emission, operator heartbeat on the ADAPI path.
- **LLM/test-script friendly**: typed schemas, headless node operation via
  `ros2 run` + ROS params, one-command launch, easy `ros2 topic pub` / curl
  smoke tests.
- **Docs live in** `docs/autoware_teleop/` (this repo tracks docs).

## 3. Deliverables

| Deliverable | Description |
|---|---|
| `autoware_teleop` (ROS node) | rclcpp lifecycle node, control core, gateways, intent/telemetry plugins |
| `autoware_teleop_web` (FastAPI) | WebSocket bridge + Pydantic schema + static SPA serving |
| `autoware_teleop_ui` (React) | Game-console + dashboard frontend |
| `ecu_sim.py` | vcan ECU simulator for closed-loop bench without hardware |
| Docs + CI | Architecture, work plan, lint/format/CI |

## 4. Work Items

### P0 — Scaffold & Docs

1. Create `autoware_teleop/` skeleton under `extensions/` (node/web/ui dirs).
2. Write `package.xml`, `CMakeLists.txt` (ament_cmake_auto), `setup.py` for web.
3. Write `teleop-architecture.md` and `work-plan.md` (this repo's `docs/`).
4. Define the WS schema (intent + telemetry) as the contract between web and node.

**Acceptance:** repo skeleton builds; schema documented; docs committed.

### P1 — ROS Node Core (direct path)

1. Implement `LifecycleNode` lifecycle transitions.
2. Implement `core/` control loop at 10 Hz with `stop` / `physics` / `cruise` modes.
3. Implement `gateway/direct.hpp` publishing `/control/command/{control_cmd,
   gear_cmd, emergency_cmd}` and subscribing `/vehicle/status/*`.
4. Implement `intent/keyboard.hpp` (curses) + `telemetry/console.hpp`.
5. Implement `core/watchdog.hpp` (deadman) + estop.
6. Unit tests with a mock gateway; verify mode transitions, watchdog, estop.
7. Integration on `vcan1` with `ecu_sim.py` and the E-Trike bridges.

**Acceptance:** `ros2 run autoware_teleop` drives both E-Trike bridges on `vcan1`
from the keyboard; watchdog and estop tested; unit tests pass.

### P2 — Web Backend (FastAPI)

1. `autoware_teleop_web`: FastAPI app with `/ws` WebSocket endpoint.
2. Pydantic schemas for intent/telemetry (mirror the contract from P0).
3. Two modes: (a) **embedded** rclpy bridge in the FastAPI process, or (b) **proxy**
   that forwards WS <-> the standalone node. Decide per testing ease; recommend
   embedded first, proxy optional.
4. Static serving of the React SPA build.
5. pytest: schema validation, WS intent→publish, telemetry→WS.

**Acceptance:** a browser/websocat client can drive the node via the web backend;
pytest passes.

### P3 — React Frontend

1. Vite + React + TypeScript + Tailwind v4 + shadcn/ui scaffold.
2. Game-console controls: throttle/brake/steering sliders + keyboard, gear D/N/R,
   emergency toggle.
3. Dashboard: speedometer, steering gauge, gear lamp from telemetry.
4. Zustand store + Zod validation of WS payloads.
5. Vitest + React Testing Library unit tests; Playwright end-to-end.

**Acceptance:** browser UI drives the node and renders live telemetry; tests pass.

### P4 — ADAPI Path B (upstream-ready)

1. `gateway/adapi.hpp`: `/external/selected/*`, operation-mode services, heartbeat.
2. Wire `operator_mode` (local/remote) config and mode service calls.
3. Deadman + heartbeat interplay with Autoware's gate.
4. Integration against a full Autoware stack (planning sim or vehicle launch).

**Acceptance:** node drives a stock Autoware stack through the external-command
path with gate enforcement.

### P5 — Polish, CI, Contribution

1. Lint/format (ament_lint, clang-format; ruff for web; eslint/prettier for ui).
2. CI: build + unit tests (node/web/ui), Playwright e2e on a synthetic stack.
3. Contribution doc: how to run on any Autoware vehicle, add a gateway/intent.
4. (Stretch) Zenoh transport axis; uPlot telemetry graphs.

**Acceptance:** CI green; contribution-ready.

## 5. Risks and Open Items

| Item | Impact | Mitigation |
|---|---|---|
| rclcpp + FastAPI split complexity | Two languages/lifecycles | Keep web as thin WS proxy; core logic in node |
| Path B depends on full Autoware stack | Hard to test without it | Test with planning sim + `ecu_sim`; gate mock for CI |
| Watchdog tuning on real hardware | False brakes or missed stops | Configurable `arrival_timeout_ms`; test on `vcan1` + `can1` |
| Frontend scope creep (uPlot, etc.) | Delays MVP | Defer graphs to P5 stretch; ship controls+dashboard first |

## 6. Out of Scope

- Vehicle-specific hardware mappings.
- Perception/planning/mapping.
- Production autonomous operation.
- Zenoh transport (stretch).
