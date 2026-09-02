# autoware/scripts

Categorized helper scripts for the E-Trike Autoware stack (run on the Jetson,
usually inside the `autoware_test` container after sourcing ROS).

## Layout

| Folder | Purpose | Scripts |
|---|---|---|
| `loading/` | Bring up the full stack / driving pipeline | `load_pipeline.sh` (all-in-one), `direct_init.sh`, `drive_test.sh`, `drive_test_v3.sh`, `test_drive.sh` |
| `check/` | Inspect what's running / status | `check_sim.sh`, `check_state.sh`, `node_info.sh`, `quick_check.sh`, `status.sh` |
| `control/` | Control topics, QoS, subscriptions | `control_check.sh`, `qos_test.sh`, `sub_check.sh` |

## Load the full pipeline

```bash
bash autoware/scripts/loading/load_pipeline.sh            # container + Universe + CANable + bridge
bash autoware/scripts/loading/load_pipeline.sh --universe # simulator + RViz only
bash autoware/scripts/loading/load_pipeline.sh --canable  # CANable + bridge only
bash autoware/scripts/loading/load_pipeline.sh --bridge   # bridge only
bash autoware/scripts/loading/load_pipeline.sh --stop     # stop bridge + simulator
```

`load_pipeline.sh` brings up, in order:

1. Docker container `autoware_test` (DISPLAY=:1 + X socket).
2. Autoware Universe planning simulator + RViz on the Jetson monitor.
3. CANable Pro USB-CAN (`canable0`, 500 kbps).
4. `autoware_vehicle_bridge` in `sim_mode` on `canable0`.

Reference: `docs/operations/ETRIKE_RUN.md`.

## Driving pipeline (manual, after load_pipeline.sh)

```bash
# Inside the container
bash /workspace/autoware/scripts/loading/direct_init.sh     # publish initial pose
bash /workspace/autoware/scripts/loading/drive_test.sh      # pose -> goal -> engage -> watch velocity
bash /workspace/autoware/scripts/loading/drive_test_v3.sh   # alternate drive test
bash /workspace/autoware/scripts/loading/test_drive.sh      # one-shot drive test
```

## Checks / control

```bash
bash autoware/scripts/check/status.sh       # node count + overview
bash autoware/scripts/check/check_sim.sh    # simulator node/topics
bash autoware/scripts/check/check_state.sh  # rviz + state monitor
bash autoware/scripts/check/node_info.sh    # node info
bash autoware/scripts/check/quick_check.sh  # quick process/TF check
bash autoware/scripts/control/control_check.sh  # operation mode / gear cmd
bash autoware/scripts/control/qos_test.sh       # QoS inspection
bash autoware/scripts/control/sub_check.sh      # subscription check
```

> These scripts were moved from the `autoware/` repo root into these subfolders.
