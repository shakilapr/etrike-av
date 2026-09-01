# Wiring the CAN Adapter to the Jetson (Plain Guide)

How to physically connect the **SN65HVD230 CAN adapter board** to the Jetson and
check that messages are flowing on the vehicle bus.

## What you are connecting

- The **Jetson** has a small built-in CAN port. It uses two thin wires: one to
  **send**, one to **receive**.
- The **SN65HVD230 board** is a tiny "translator" between those two Jetson wires
  and the vehicle's CAN bus, which uses two thicker wires labelled **CAN_H** and
  **CAN_L**.
- The bridge software (`autoware_vehicle_bridge`) sends and receives messages on
  the Jetson's CAN port, which Linux calls **`can0`**.

So the chain is:

```
Jetson (can0)  ──thin wires──▶  SN65HVD230 board  ──CAN_H / CAN_L──▶  Vehicle bus
```

## What you need

| Item | Notes |
|---|---|
| Jetson (AGX Orin) 40-pin header | The rows of pins on the board |
| SN65HVD230 board | 3.3 V version |
| 4 wires for the Jetson side | send, receive, power, ground |
| 2 wires for the bus | CAN_H, CAN_L |
| 120 Ω resistor | One at each end of the bus (often already on the vehicle side) |

## Pin connection

Connect the four Jetson-side pins to the board like this:

| Jetson pin | Jetson signal | Connect to board pin |
|---|---|---|
| 29 | CAN send (TX) | `TXD` |
| 31 | CAN receive (RX) | `RXD` |
| 1 | 3.3 V power | `VCC` |
| 5, 9, or 39 | Ground | `GND` |

Then connect the bus:

| Board pin | Connect to |
|---|---|
| `CAN_H` | Vehicle bus **CAN_H** |
| `CAN_L` | Vehicle bus **CAN_L** |

### Plain rules

- Use **3.3 V only**. Do not use 5 V — it can damage the Jetson.
- Wire it straight: Jetson **send → TXD**, Jetson **receive → RXD**.
- Put a **120 Ω resistor** between CAN_H and CAN_L at each end of the bus. If the
  vehicle already has one at its end, do not add a second one in the middle.
- The exact pin numbers above are for the AGX Orin carrier board. Other Jetson
  boards (Xavier, Nano) use different pins — check your board's drawing first.

## Turn the port on

The bridge software now **does this itself**. When the bridge node starts, it
reads the speed from the `can_bitrate` parameter (default **500000** bits per
second) in `autoware_vehicle_bridge/config/etrike.param.yaml`, sets that speed,
and brings the port up — so you do not need to type any commands first.

It only configures a port that is **not already on**. If `can0` is already up
(it is already working), the bridge leaves it alone so it does not disturb a
live bus.

Manual fallback (only if you want to check or pre-configure by hand — the same
thing the bridge does):

```bash
sudo ip link set can0 type can bitrate 500000
sudo ip link set can0 up
```

(You can run these on the Jetson itself, or inside the Docker container — the
container uses the Jetson's `can0` port directly.)

## Check the messages

Watch the raw messages on the bus:

```bash
candump can0
```

To see only the messages the Jetson sends to the vehicle:

```bash
candump can0 | grep -E '300|301|303|302|7FC'
```

## What you should see

**Messages from the vehicle to the Jetson** show up as soon as the bus is live
and the vehicle is on. Their IDs look like: `0x011`, `0x121`, `0x210`, `0x7FD`,
`0x600`.

**Messages from the Jetson to the vehicle** only appear after two things happen:

1. You **engage** the system, and
2. The vehicle reports it is in **self-driving mode**.

Their IDs look like: `0x300`, `0x303`, `0x301`, `0x302`, `0x7FC`.

Until then, the Jetson stays **quiet on purpose**. This is the safe default: it
will not send drive commands unless everything is confirmed working.

## Common problems

| Symptom | Likely cause |
|---|---|
| No messages at all | Wrong wiring, no power, no ground, or `can0` is not turned on |
| Vehicle messages show, but none from Jetson | Not engaged, or not in self-driving mode, or the vehicle has not confirmed auto |
| Wrong or no IDs | Wrong pinout for your Jetson board — re-check the carrier drawing |

## Before you power on

- [ ] 3.3 V used, not 5 V
- [ ] Send → TXD, receive → RXD
- [ ] Ground connected
- [ ] CAN_H / CAN_L go to the right bus wires
- [ ] Bus terminated (120 Ω at each end, not doubled)
- [ ] `can_bitrate` in `etrike.param.yaml` matches the vehicle bus speed (500000)
- [ ] Pin numbers checked against your specific Jetson board
