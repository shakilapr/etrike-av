# E-Trike Run Guide

How to run the full E-Trike stack on the Jetson for bench / simulator work:

1. **Autoware Universe** (planning simulator) on the Jetson monitor (RViz).
2. **CANable Pro** USB-CAN module (bench bus).
3. **`autoware_vehicle_bridge`** in **sim mode** — passes whatever the simulator
   commands out onto the CAN bus, ignoring hardware feedback / engage / estop.

> Detailed references: `docs/operations/AUTOWARE_UNIVERSE_MONITOR.md`,
> `docs/hardware/CANABLE_PRO_SETUP.md`, `docs/operations/CAN_OPERATIONS.md`.
>
> **One-command loader:** `bash autoware/scripts/loading/load_pipeline.sh` does
> steps 1-4 below automatically (or `--universe` / `--canable` / `--bridge` /
> `--stop` for subsets).

---

## 0. Prerequisites

- Jetson reachable by SSH (`med1@<jetson-ip>`; IP can change — verify first).
- Map present: `~/autoware_map/sample-map-planning`.
- Workspace built: `~/av_project/autoware/install/`.
- (Optional) CANable Pro plugged into a Jetson USB port.

## 1. Start the container (with display)

```bash
# On the Jetson host
DISPLAY=:1 xhost +local:docker

docker rm -f autoware_test 2>/dev/null || true

docker run -d --name autoware_test \
  --privileged --runtime=nvidia --gpus all \
  --net=host --ipc=host \
  -e DISPLAY=:1 \
  -v /tmp/.X11-unix:/tmp/.X11-unix:ro \
  -v ~/av_project/autoware:/workspace/autoware \
  -v ~/autoware_map:/autoware_map \
  ghcr.io/autowarefoundation/autoware:universe-cuda-humble \
  bash -c 'while true; do sleep 1000; done'
```

If a container already exists **with** `DISPLAY=:1` + X-socket mount, skip to step 2.

## 2. Open Autoware Universe (RViz on the monitor)

```bash
docker exec -d autoware_test bash -c \
  'export DISPLAY=:1; \
   source /opt/autoware/setup.bash; \
   source /workspace/autoware/install/setup.bash; \
   ros2 launch autoware_launch planning_simulator.launch.xml \
     map_path:=/autoware_map/sample-map-planning \
     vehicle_model:=etrike_vehicle \
     sensor_model:=etrike_sensor_kit \
     rviz:=true'
```

Verify RViz is up:

```bash
docker exec autoware_test ps aux | grep rviz2    # expect .../rviz2 -d .../autoware.rviz
```

In RViz: **2D Pose Estimate** → set pose, **2D Goal Pose** → set goal, then
**AutowareStatePanel → Engage** to start the simulated drive.

## 3. Bring up the USB CAN module (CANable Pro)

On the Jetson host:

```bash
sudo ip link set canable0 type can bitrate 500000 && sudo ip link set canable0 up
ip -details link show canable0      # expect UP, bitrate 500000
```

Or use the helper: `./scripts/setup_canable.sh up canable0 500000`.

> If `canable0` is missing (device shows as `canX`), re-run the udev install +
> replug: `./scripts/setup_canable.sh install-udev`. See
> `docs/hardware/CANABLE_PRO_SETUP.md`.

## 4. Run the vehicle bridge in sim mode

Inside the container, launch the bridge pointed at the CANable bus in **sim
mode** (pass-through of whatever the simulator commands — no hardware gating):

```bash
docker exec -d autoware_test bash -c \
  'source /opt/autoware/setup.bash; \
   source /workspace/autoware/install/setup.bash; \
   ros2 launch autoware_vehicle_bridge vehicle_bridge.launch.py \
     can_interface:=canable0 \
     sim_mode:=true'
```

Verify the bridge configured and is transmitting:

```bash
docker exec autoware_test bash -c "tail -5 /tmp/bridge_can.log"   # or the log you redirect to
ip -s link show canable0                                          # TX packets increasing
```

> **Sim mode is for bench/testing only** — never on the real vehicle
> (`can0`/`can1`). For the real vehicle, omit `sim_mode:=true` so the fail-closed
> gate (engaged + ECU feedback) applies.

## 5. Verify the CAN output

```bash
candump -tz canable0                       # live traffic
candump -tz canable0,300:303,7FC:7FC       # host drive/steer + heartbeat
```

Expected with the simulator engaged / driving:

| Frame | ID | Meaning |
|---|---|---|
| `HOST_DRIVE_CMD` | `0x300` | speed (mm/s), 100 Hz |
| `HOST_STEER_CMD` | `0x303` | steering angle 0.1°, valid flag, 100 Hz |
| `HOST_BRAKE_REQ` | `0x301` | brake pressure (kPa) |
| `HOST_LIGHT_CMD` | `0x302` | lights |
| `HOST_HEARTBEAT` | `0x7FC` | alive counter, 500 ms |

## 6. Stop

```bash
docker exec autoware_test bash -c 'pkill -9 -f vehicle_bridge_node'
sudo ip link set canable0 down            # CANable OFF
bash ~/av_project/scripts/kill_all.sh     # kill everything (container + nodes)
```

---

## Gotchas

- **`xhost +local:docker` must run on the Jetson host** or RViz never opens.
- Container must be started with `-e DISPLAY=:1` + `/tmp/.X11-unix` mount.
- Only **one** `--net=host` Autoware ROS system per host (they share the ROS
  graph) — don't run a second bridge-test container alongside.
- `canable0` with no other node on the bus may report `ERROR-PASSIVE` / no ACK —
  normal for a lone transmitter.
- Old RViz "white vehicle" / duplicate-node issues: `bash scripts/kill_all.sh`
  and relaunch.

## Where the code lives

| Component | Path |
|---|---|
| Vehicle bridge | `autoware/src/our_packages/autoware_vehicle_bridge/` |
| CAN codec (generated) | `autoware/src/our_packages/etrike_protocol/` |
| CANable helper | `scripts/setup_canable.sh` |
| **Full-stack loader** | `autoware/scripts/loading/load_pipeline.sh` |
| Driving pipeline scripts | `autoware/scripts/loading/` |
| Check / status scripts | `autoware/scripts/check/` |
| Control / QoS scripts | `autoware/scripts/control/` |
| Docs | `docs/hardware/`, `docs/operations/` |

> `autoware/scripts/loading/load_pipeline.sh` automates steps 1-4 above
> (`--universe`, `--canable`, `--bridge`, `--stop` subcommands).
