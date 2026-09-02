# CAN System Operations (Jetson)

How the CAN system works on the E-Trike Jetson, how to turn it ON/OFF, and where
the code lives.

> For a step-by-step run of the whole stack (container + Autoware Universe +
> CANable + bridge in sim mode), see
> [`docs/operations/ETRIKE_RUN.md`](ETRIKE_RUN.md).

---

## 1. How the CAN system works

```
Autoware Universe (Docker container, --net=host)
        │  ROS topics
        ▼
autoware_vehicle_bridge  (LifecycleNode, C++)        ← sends/receives CAN
        │  encode()/decode() via etrike_protocol (generated C++ header)
        ▼
Linux SocketCAN  (can0 / can1 / canable0 / vcan0)    ← kernel CAN layer
        │
   ┌────┴────────────────────────────────────┐
   ▼                                         ▼
can0 / can1                       canable0 (USB CANable Pro)
onboard mttcan                    gs_usb driver
(real vehicle bus)                (bench / HIL testing)
```

The bridge talks to the bus purely through **SocketCAN**
(`socket(PF_CAN, SOCK_RAW, CAN_RAW)`), so the physical hardware is abstracted:
the `can_interface` parameter selects which bus to use. All frames use the
**`etrike_protocol`** codec (IDs: `0x300` drive, `0x303` steer, `0x301` brake,
`0x302` lights, `0x7FC` host heartbeat, plus RX from ECUs `0x121`, `0x210`,
`0x7FD`, `0x011`, `0x600`, `0x120`, `0x206`, `0x001`).

### Interface map

| Interface | Hardware / Source | Purpose |
|---|---|---|
| `can0` | Onboard MTTCAN controller 0 | Real vehicle high-bus (Jetson ↔ RT/SYS) |
| `can1` | Onboard MTTCAN controller 1 | Real vehicle low-bus (Jetson ↔ actuators) |
| `canable0` | **CANable Pro** USB adapter (`1d50:606f`, gs_usb) | Bench / HIL testing & sniffing (fixed name via udev) |
| `vcan0` / `vcan1` | Virtual CAN | Offline simulation / software-in-the-loop |

---

## 2. Turning the CAN system ON / OFF

### Manage the interface (helper script `scripts/setup_canable.sh`)

```bash
# ON (CANable at 500 kbps)
./scripts/setup_canable.sh up canable0 500000

# OFF
./scripts/setup_canable.sh down canable0

# Status (all CAN links)
./scripts/setup_canable.sh status
```

Manual equivalent (onboard `can0`/`can1` or `canable0`):

```bash
sudo ip link set canable0 type can bitrate 500000 && sudo ip link set canable0 up   # ON
sudo ip link set canable0 down                                                      # OFF
ip -details link show canable0                                                      # check
```

### Run / stop the bridge (inside the container)

Sim / bench passthrough — outputs whatever Autoware commands, ignoring hardware
feedback / engage / estop (test only):

```bash
docker exec autoware_test bash -c 'source /opt/autoware/setup.bash; \
  source /workspace/autoware/install/setup.bash; \
  ros2 launch autoware_vehicle_bridge vehicle_bridge.launch.py \
    can_interface:=canable0 sim_mode:=true'
```

Real vehicle (fail-closed gate: engaged + ECU feedback required):

```bash
docker exec autoware_test bash -c 'source /opt/autoware/setup.bash; \
  source /workspace/autoware/install/setup.bash; \
  ros2 launch autoware_vehicle_bridge vehicle_bridge.launch.py can_interface:=can0'
```

Stop the bridge:

```bash
docker exec autoware_test bash -c 'pkill -9 -f vehicle_bridge_node'
```

Kill everything (containers + processes):

```bash
bash scripts/kill_all.sh
```

### Monitor CAN traffic

```bash
candump -tz canable0                        # all traffic
candump -tz canable0,300:303,7FC:7FC        # host drive/steer + heartbeat
candump -tz canable0,204:7FF,169:7FF        # direct actuator frames
```

---

## 3. Where the code lives

| Component | Location |
|---|---|
| Vehicle bridge node | `autoware/src/our_packages/autoware_vehicle_bridge/src/vehicle_bridge_node.cpp` |
| Bridge header | `autoware/src/our_packages/autoware_vehicle_bridge/include/autoware_vehicle_bridge/vehicle_bridge_node.hpp` |
| Bridge params | `autoware/src/our_packages/autoware_vehicle_bridge/config/etrike.param.yaml` (`can_interface`, `can_bitrate`, `sim_mode`, …) |
| Bridge launch | `autoware/src/our_packages/autoware_vehicle_bridge/launch/vehicle_bridge.launch.py` |
| CAN codec (generated, do not edit) | `autoware/src/our_packages/etrike_protocol/generated/cpp/etrike_protocol.hpp` |
| CANable helper script | `scripts/setup_canable.sh` (`up`/`down`/`status`/`dump`/`install-udev`/`install-sudo`) |
| Low-bus actuator bridge (bench) | `autoware/src/our_packages/direct_bridge/` |
| Hardware docs | `docs/hardware/CAN_WIRING.md`, `docs/hardware/CANABLE_PRO_SETUP.md`, `docs/hardware/CAN_SETTINGS.md` |

---

## 4. Typical current state (reference snapshot)

| Interface | State | Purpose |
|---|---|---|
| `can0`, `can1` | DOWN | real vehicle bus (up only when vehicle connected) |
| `canable0` | UP @ 500000 | CANable Pro bench bus |
| `vcan0`, `vcan1` | UP | virtual CAN |
| `vehicle_bridge` | running | bridge node |

> Note: a lone CAN node (no other transceiver on the bus) can report
> `ERROR-PASSIVE` / no ACK — normal until a second node / the vehicle is attached.
