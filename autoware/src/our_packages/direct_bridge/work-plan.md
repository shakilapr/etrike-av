# direct_bridge Work Plan

## 1. Goal

Build a standalone ROS 2 bridge for bench bring-up and commissioning of the E-Trike low-level bus. The bridge drives the MTR, SES, and SEB controllers directly, bypassing the RT and SYS ECU layers. It is a minimal, YAML-driven diagnostic tool and must not be used for autonomous operation.

## 2. Constraints

- SES, SEB, and MTR firmware are immutable. The bridge must conform exactly to their existing wire expectations (see Architecture, Section 6).
- The existing `autoware_vehicle_bridge` and `etrike_protocol` packages must not be modified.
- All scaling factors, offsets, limits, and timing values come from YAML parameters, not from hard-coded numbers.
- The low bus is not yet wired to the Jetson. Development and testing run against a virtual interface (`vcan1`).
- The manufacturer signal sheets in `data/` (`by-wire - brake.csv`, `by-wire - steering.csv`) are the authoritative source for the SES and SEB signal layouts; they are byte-identical to the sheets in the `etrike` repository.

## 3. Deliverables

| Deliverable | Description |
|-------------|-------------|
| Package skeleton | `package.xml`, `CMakeLists.txt`, launch file, parameter file |
| Vendored protocol | Trimmed YAML contracts, vendored generator, generated C++ header, custom SES/SEB codecs, core headers, manufacturer signal sheets |
| Node implementation | Lifecycle node with the control loop, receive thread, and interfaces described in the architecture |
| Tests | Encode unit tests and an optional virtual-CAN integration test |
| Documentation | `ARCHITECTURE.md` and `WORK_PLAN.md` |

## 4. Work Items

### Phase 1 — Vendor Protocol Artifacts

1. Create the trimmed contract files under `protocol/contracts/`:
   - `network.yaml` — low bus, nodes, safety-estop message `0x001`.
   - `mtr.yaml` — `0x120`, `0x206`.
   - `rt.yaml` — `0x204`.
   - `sys.yaml` — `0x110`.
   - `ses.yaml` — `0x169`, `0x201`.
   - `seb.yaml` — `0x7B9`, `0x721`.
2. Copy the generator (`tools/protocol.py`) and the vector sets (`vectors/payload-v1.json`, `vectors/custom-codec-values-v1.json`).
3. Confirm the manufacturer signal sheets are present in `data/` and byte-identical to the copies in `docs/communications/` in the `etrike` repository. They are the authoritative reference for the custom SES and SEB codecs.
4. Patch the generator so the `generate` subcommand accepts a `--no-baseline` option (the trimmed contract set has no frozen baseline manifest).
5. Run the generator to produce `protocol/generated/cpp/etrike_protocol.hpp` with only the five generated messages (`0x001`, `0x110`, `0x204`, `0x120`, `0x206`). The `0x205` brake request frame is not generated; the bridge writes the brake command directly to the SEB with `0x7B9`.
6. Vendor the custom codecs verbatim:
   - `protocol/codecs/ses.hpp`
   - `protocol/codecs/seb.hpp`
   - `protocol/codecs/detail.hpp`
   - `protocol/profiles/xor8_ff_v1.hpp`
7. Vendor the core headers (`protocol/core/*`).
8. Add `scripts/regenerate.sh` to reproduce the generated header deterministically.

**Acceptance:** the generated header builds standalone; every transmitted message is covered by a vector assertion; the SES and SEB encoder outputs match the signal layouts in the manufacturer sheets in `data/`.

### Phase 2 — Package Skeleton

1. Write `package.xml` with dependencies:
   - `rclcpp`, `rclcpp_lifecycle`
   - `autoware_control_msgs`, `autoware_vehicle_msgs`
   - `tier4_vehicle_msgs`
   - `diagnostic_msgs` (optional, for brake diagnostics)
2. Write `CMakeLists.txt`:
   - C++17, `ament_cmake`
   - Include the vendored `protocol/` and `include/` directories
   - Build the lifecycle executable
   - Install `config/`, `launch/`, `include/`, `data/`, and `scripts/`
   - Register the encode unit test and the self-contained Autoware-compat pytest under `BUILD_TESTING`
3. Write `config/direct_bridge.param.yaml` with all parameters from Architecture, Section 7, including `publish_brake_diag: false`. `command_timeout_ms` defaults to 200 ms (independent of the MTR 50 ms stream deadline).
4. Write `launch/direct_bridge.launch.py`:
   - Standalone lifecycle node with automatic configure/activate
   - `can_interface` argument (default `vcan1`)

**Acceptance:** the package builds with `colcon` and the node launches on `vcan1`.

### Phase 3 — Node Implementation

1. Write `include/direct_bridge/direct_bridge_node.hpp`:
   - `DirectBridgeNode` deriving from `rclcpp_lifecycle::LifecycleNode`
   - CAN driver abstraction (open/close/send/receive) for testability
   - Parameter struct with load and validation helpers
   - Per-unit encoder helpers
   - Decoder helpers for received messages
   - Subscription, publication, timer, and receive-thread members
2. Write `src/direct_bridge_node.cpp`:
   - Lifecycle callbacks (configure, activate, deactivate, cleanup, shutdown)
   - Control loop with 10 ms, 20 ms, 20 ms, and 100 ms sub-counters (MTR, SES, SEB, mode)
   - MTR encoder (speed clamp, gear selection, idle streaming)
   - SES encoder (angle conversion, offset, slew rate, vehicle-speed byte, enables, counter, checksum)
   - SEB encoder (pressure/stroke selection, dual enable bits, counter, checksum)
   - Mode broadcast `0x110` at 10 Hz
   - Emergency handling with `0x001` broadcast, MANUAL mode switch, and safe default output
   - Command-timeout handling
   - Receive thread and report decoders
   - Optional SEB status decoder that publishes the real `0x721` SEB_STATUS data (alignment, control mode, error status, stroke, pressure) to `~/output/diagnostics` when `publish_brake_diag` is enabled

**Acceptance:** the node encodes every frame correctly per the vectors and manufacturer sheets; the loop rates match the controller requirements; the SES alignment gate, the SES vehicle-speed byte, the MTR freshness-streaming behavior, and the SEB dual enable bits are implemented; the mode broadcast runs at 10 Hz.

### Phase 4 — Tests

The testing strategy has four layers, matching Architecture, Section 12.

1. **Unit tests — `test/test_encode.cpp`:**
   - Encode `0x204`, `0x110`, `0x169`, and `0x7B9` from known values.
   - Assert bytes match `payload-v1.json` and `custom-codec-values-v1.json`.
   - Verify the SES checksum byte, the SES vehicle-speed byte, and the SEB dual enable bits.
   - Cross-check the SES and SEB encoder outputs against the signal layouts in `data/by-wire - steering.csv` and `data/by-wire - brake.csv`.
   - Registered under `BUILD_TESTING` via `add_test`; runs through `colcon test`.

2. **Bench script — `scripts/run_bench.py` (in-package, dual-mode):**
   - `--interface vcan1` (default): create and bring up a virtual interface (`modprobe vcan`, `ip link add vcan1 type vcan`, `ip link set vcan1 up`).
   - `--interface can1` (physical): bring up the physical low-bus interface at 500 kbit/s.
   - Launch the bridge with the chosen interface.
   - Inject the four feedback frames (`0x120`, `0x206`, `0x201`, `0x721`) with `cansend`, using codec-generated payloads with valid checksums and counters.
   - Assert the four transmit frames (`0x204`, `0x169`, `0x7B9`, `0x110`) appear with the expected payloads via `candump`.
   - Exercise the command-timeout path (expect zero-speed, centered-steering, released-brake default).
   - Exercise the emergency path (expect `0x001` broadcast and mode change to MANUAL).
   - Tear down the interface and node on exit. Designed to run in the container or on the host.

3. **Self-contained Autoware-compatibility pytest — `test/test_autoware_compat.py`:**
   - Runs in `colcon test` via `ament_add_pytest_test`, following the `etrike_kinect2` launch-test pattern (`@pytest.mark.launch_test`, `generate_test_description`).
   - Spins up `vcan1` and launches the bridge with a mock Autoware command publisher (publishes `Control`, `GearCommand`, `VehicleEmergencyStamped` on the exact Autoware topics with matching QoS).
   - Asserts lifecycle reaches active, topic names/types/QoS match the Autoware contract, transmit frames appear with expected bytes, reports publish from injected feedback, and timeout/emergency paths fail closed.

4. **Real-stack Autoware launch test — `test/test_launch_autoware.py`:**
   - Validates integration against the actual Autoware control stack (not a mock).
   - Verifies end-to-end topic compatibility, QoS negotiation, and lifecycle management.
   - Heavier and container-dependent; not part of the default `colcon test` run. Executed explicitly during validation and on the target hardware.

**Acceptance:** unit tests pass locally; the bench script runs against `vcan1` and is `can1`-ready; the self-contained Autoware-compat pytest passes in `colcon test`; the real-stack launch test is documented and run on the target.

### Phase 5 — Validation and Handoff

1. Build the package and run the unit tests with `colcon`.
2. Run `scripts/run_bench.py --interface vcan1` to validate the virtual-CAN bench path.
3. Run the self-contained Autoware-compatibility pytest through `colcon test`.
4. Verify the launch file and lifecycle transitions, and confirm QoS compatibility with `ros2 topic info -v`.
5. Document the bench bring-up procedure and the physical `can1` path in the architecture or a companion note.
6. Flag the hardware task: wire the Jetson low-bus drop and confirm the interface name (`can1`).
7. On the target hardware, run the real-stack Autoware launch test (`test_launch_autoware.py`) before any motor motion.

**Acceptance:** the package builds, all four test layers pass or are documented, the bring-up procedure is documented, and the real-stack test is validated on the target.

## 5. Risks and Open Items

| Item | Impact | Mitigation |
|------|--------|------------|
| Low bus not wired to the Jetson | Cannot validate on hardware yet | Develop and test on `vcan1`; flag wiring as a separate task |
| SES/SEB custom codecs are vendor-specific | Any misunderstanding of the payload layout breaks the units | Vendor the codecs verbatim and rely on the published vectors and the manufacturer sheets in `data/` |
| SES synchronization state machine | Commanding before alignment may be ignored by the unit | Replicate the RT alignment gate (`require_ses_aligned`) |
| MTR staleness guard | Pausing output for more than 50 ms causes MTR to zero itself | Stream `0x204` continuously at 10 ms, including idle frames; never pause the stream |
| Mode authority | MTR ignores commands unless mode is AUTO | Broadcast `0x110 = AUTO` at 10 Hz while active and MANUAL on emergency |
| Bench tool used for autonomous operation | Unsafe | Explicitly scope the bridge to bench bring-up only |

## 6. Out of Scope

- Lights, turn indicators, and hazard commands.
- High-bus frames and the host heartbeat.
- Powertrain and DCDC control.
- RT/SYS heartbeat monitoring.
- Engagement and mode-confirmation gating.
- Obstacle distance reporting.
- Changes to SES, SEB, or MTR firmware.
- Changes to the existing `autoware_vehicle_bridge` or `etrike_protocol` packages.
