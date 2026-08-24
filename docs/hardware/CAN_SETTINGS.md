# CAN Settings Reference (Vehicle Interface ↔ Vehicle)

This documents **all** CAN-related configuration in this repo, which is provided
by the `ros2_socketcan` package:

```
autoware/src/sensor_component/ros2_socketcan/ros2_socketcan/
```

`ros2_socketcan` is a **generic SocketCAN ↔ ROS bridge** (a thin wrapper over the
Linux `socket()`/`bind()`/`send()`/`recv()` + `select()` API). It knows nothing
about *what* a frame means — only how to move bytes between a CAN interface
(`can0`, `vcan0`, …) and ROS topics. The mapping of CAN IDs/signals to
accel/brake/steer is done by the **vehicle_interface** above it (not in this repo).

## Architecture

```
Autoware Control
   → ActuationCommand
      → vehicle_interface  (OEM-specific CAN-ID mapping, NOT in this repo)
         → publishes can_msgs/Frame on /to_can_bus[_fd]
            → socket_can_sender  ──send()──▶  can0  ──▶  Vehicle
            ◀──recv()──  can0  ◀──  Vehicle
         ← socket_can_receiver publishes /from_can_bus[_fd]  ←
      → vehicle_interface → ControlModeReport / VelocityReport / GearReport …
```

Two lifecycle nodes + a bridge that runs both:

| Node | Direction | Default topic | Message type |
|------|-----------|---------------|--------------|
| `socket_can_sender` | ROS → CAN | `/to_can_bus` | `can_msgs/msg/Frame` |
| `socket_can_receiver` | CAN → ROS | `/from_can_bus` | `can_msgs/msg/Frame` |
| (`socket_can_bridge`) | both | above (combined) | above |

When `enable_can_fd=true` the topic/message swap to `*_fd` / `ros2_socketcan_msgs/msg/FdFrame`.

## Parameters (all)

### Sender (`socket_can_sender_node`)
| Parameter | Type | Default | Meaning |
|-----------|------|---------|---------|
| `interface` | string | `can0` | CAN device to write to |
| `enable_can_fd` | bool | `false` | Use CAN FD (`FdFrame`, ≤64 B) instead of classic (`Frame`, ≤8 B) |
| `timeout_sec` | double | `0.01` | Send timeout (ns) waiting for socket availability |
| `auto_configure` | bool | `true` | Auto-run lifecycle CONFIGURE on start |
| `auto_activate` | bool | `true` | Auto-run lifecycle ACTIVATE after configure |
| `to_can_bus_topic` | string | `to_can_bus` (or `to_can_bus_fd` if FD) | Subscribed input topic |

### Receiver (`socket_can_receiver_node`)
| Parameter | Type | Default | Meaning |
|-----------|------|---------|---------|
| `interface` | string | `can0` | CAN device to read from |
| `enable_can_fd` | bool | `false` | Use CAN FD (`FdFrame`) instead of classic |
| `interval_sec` | double | `0.01` | Poll period of the receive thread |
| `enable_frame_loopback` | bool | `false` | Enable SocketCAN loopback of sent frames |
| `use_bus_time` | bool | `false` | Stamp messages with CAN bus time instead of host clock |
| `filters` | string | `0:0` | CAN ID/mask filter (see below) |
| `auto_configure` | bool | `true` | Auto lifecycle CONFIGURE |
| `auto_activate` | bool | `true` | Auto lifecycle ACTIVATE |
| `from_can_bus_topic` | string | `from_can_bus` (or `from_can_bus_fd` if FD) | Published output topic |

> The node reads each `Frame` and maps `id / is_extended / is_rtr / is_error /
> dlc / data[8]` → a raw CAN frame (sender), or the reverse (receiver).

## Message types

### `can_msgs/msg/Frame` (classic CAN)
```
std_msgs/Header header
bool is_rtr
bool is_extended
bool is_error
uint32 id
uint8 dlc            # data length code, 0–8
uint8[8] data
```

### `ros2_socketcan_msgs/msg/FdFrame` (CAN FD)
```
std_msgs/Header header
bool is_extended
bool is_error
uint32 id
uint8 len            # 0–64
uint8[] data         # dynamic, resized to len
```

## Launch files (where args are declared)

| File | Relevant args (defaults) |
|------|--------------------------|
| `launch/socket_can_sender.launch.py` | `interface=can0`, `enable_can_fd=false`, `timeout_sec=0.01`, `auto_configure/activate=true`, `to_can_bus_topic` |
| `launch/socket_can_receiver.launch.py` | `interface=can0`, `enable_can_fd=false`, `enable_frame_loopback=false`, `interval_sec=0.01`, `use_bus_time=false`, `filters=0:0`, `from_can_bus_topic` |
| `launch/socket_can_bridge.launch.xml` | `interface=can0`, `receiver_interval_sec=0.01`, `sender_timeout_sec=0.01`, `enable_can_fd=false`, `enable_frame_loopback=false`, `use_bus_time=false`, `to_can_bus_topic`, `from_can_bus_topic` |

The `to_can_bus_topic` / `from_can_bus_topic` args are auto-selected to the
`*_fd` variant by an `IfCondition(enable_can_fd)`.

## Design YAML wiring (this project's intended config point)

This project wires the nodes through `autoware_launch` design files (currently
the **sample** designs):

```
autoware/src/launcher/autoware_launch/autoware_sample_designs/
  design/ros_system/robot_state_publisher/
    Ros2SocketCanSenderNode.node.yaml
    Ros2SocketCanReceiverNode.node.yaml
    Ros2SocketCanBridge.module.yaml
```

Each `*.node.yaml` lists `param_values` (the ROS parameters for that node) and
the `subscribers`/`publishers` with their `message_type`. Example (receiver):

```yaml
param_values:
  - name: interface
    type: string
    default: can0
  - name: interval_sec
    type: double
    default: 0.01
  - name: enable_frame_loopback
    type: bool
    default: false
  - name: filters
    type: string
    default: 0:0
  - name: use_bus_time
    type: bool
    default: false
  # enable_can_fd: add here if FD is required
publishers:
  - name: from_can_bus
    message_type: can_msgs/msg/Frame
```

`Ros2SocketCanBridge.module.yaml` instantiates both nodes and connects their
`to_can_bus` / `from_can_bus` ports.

## Filter syntax (`filters` parameter)

Comma-separated per-interface filters, hex values:
- `<can_id>:<can_mask>` — accept when `(received_id & mask) == (can_id & mask)`
- `<can_id>~<can_mask>` — accept when NOT equal
- `#<error_mask>` — error-frame filter
- `[j|J]` — join filters with logical AND

`0:0` (default) accepts all data frames.

## CAN FD vs Classic CAN

Controlled solely by `enable_can_fd`:
- **`false` (default)** → classic CAN 2.0, `can_msgs/Frame`, `dlc` ≤ 8,
  topics `/to_can_bus` & `/from_can_bus`.
- **`true`** → CAN FD, `ros2_socketcan_msgs/FdFrame`, `len` ≤ 64,
  topics `/to_can_bus_fd` & `/from_can_bus_fd`.

## Test helpers (offline / virtual CAN)

```
autoware/src/sensor_component/ros2_socketcan/ros2_socketcan/test/
  vcan0_setup.sh      # modprobe vcan; ip link add vcan0 type vcan; ip link set vcan0 up
  vcan0_teardown.sh   # ip link del vcan0
```
Use with `interface:=vcan0` to test the bridge without real hardware
(`docker run` needs `--privileged --cap-add=ALL -v /lib/modules:/lib/modules`).

## Where to change settings

1. **Quick global default** — edit the `DeclareLaunchArgument(..., default_value=...)`
   lines in the three launch files above (e.g. `enable_can_fd`, `interface`,
   `filters`, `interval_sec`, `timeout_sec`, `enable_frame_loopback`, `use_bus_time`).
2. **Project/design-level** — add/modify the matching entry under `param_values:`
   in `Ros2SocketCanSenderNode.node.yaml` / `Ros2SocketCanReceiverNode.node.yaml`
   (and update `message_type`/`topic` if switching to FD). This is the intended
   place for this repo's `autoware_launch` design flow.

## Caveat

The OEM **vehicle adapter** (DBC / CAN-ID ↔ signal mapping for the actual
vehicle) is **not checked out in this repo** — the top-level `vehicle/`
directory contains only empty `.gitkeep` placeholders, and the design files
above are `autoware_sample_designs` (samples). Enabling/changing CAN settings
here only affects the **transport envelope**; the vehicle_interface above must
emit the correct IDs/signals for the real vehicle.
