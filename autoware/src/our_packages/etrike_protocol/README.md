# etrike_protocol

Generated, zero-dependency **CAN codec library** for the E-Trike vehicle bus. Defines the wire format (message IDs, bit layout, DLC) and provides `encode()` / `decode()` for every frame. Used by `autoware_vehicle_bridge` to talk to the RT / SYS / MTR / HMI ECUs.

> **Do not edit by hand.** This header is generated from the protocol definition (`protocol.tools`). The source of truth is the protocol schema in the `etrike` repo.

## How to Update

This package is kept in sync with the `etrike` hardware repository (`https://github.com/shakilapr/etrike.git`). The YAML protocol contracts in that repo are the source of truth.

To fetch the latest protocol definitions and regenerate the C++ headers in this workspace, run the update script from the root of the `etrike-av` workspace:

**Windows (PowerShell):**
```powershell
.\scripts\update-protocol.ps1 [branch_name]
```

**Linux (Bash):**
```bash
./scripts/update-protocol.sh [branch_name]
```
*(If no branch is specified, it defaults to `main`.)*

These scripts automate the process of:
1. Cloning the `etrike` repository into a temporary directory.
2. Running the Python code generator (`python -m tools.protocol generate`) from the `etrike` repo against the YAML contracts.
3. Copying the newly generated `etrike_protocol.hpp` and testing vectors into this `etrike_protocol` package.

Once the script finishes, commit the changes using the provided message format:
```bash
git add autoware/src/our_packages/etrike_protocol/
git commit -m "sync(etrike_protocol): regenerate from etrike@<hash>"
```
## Structure

```
etrike_protocol/
├── generated/cpp/etrike_protocol.hpp   # <-- this file (generated)
└── protocol/core/
    ├── bits.hpp          # bit extract/insert helpers
    ├── codec_status.hpp  # CodecStatus enum (Ok, WrongMessageId, ...)
    ├── frame.hpp         # Frame / FrameView (id, dlc, data, extended)
    ├── endian.hpp        # endianness helpers
    └── supervision.hpp   # liveness / supervision types
```

## API

```cpp
namespace etrike::protocol {
  struct Frame { static Frame standard(id, dlc); std::array<uint8_t,8> data; ... };
  struct FrameView { uint32_t id(); bool extended(); size_t dlc(); const uint8_t* data(); };
  enum class CodecStatus { Ok, UnexpectedLength, NullData, WrongMessageId,
                           WrongFrameFormat, ValueOutOfRange, InvalidEnum, ConstantMismatch };
}

namespace etrike::protocol::generated {
  // Per message:
  struct HostDriveCmd { int32_t speed_mmps; int32_t yaw_rate_mrad_s; uint8_t gear;
                        CodecStatus pack(uint8_t*, size_t) const;
                        static CodecStatus unpack(const uint8_t*, size_t, HostDriveCmd&); };
  CodecStatus encode(const HostDriveCmd&, Frame&);
  CodecStatus decode(FrameView, HostDriveCmd&);
  // ... one struct per message (HmiModeReq, HostBrakeReq, HostSteerCmd,
  //     SysSafetySts, RtMotionRpt, RtStateRpt, RtHeartbeat, MtrMotorFbk, ...)
}
```

## Messages (selected, full list of 44 in `kMessages`)
| Key | Bus | CAN ID | DLC | Direction |
|---|---|---|---|---|
| `host:host_drive_cmd` | high | 0x300 | 8 | Host → RT |
| `host:host_steer_cmd` | high | 0x303 | 4 | Host → RT |
| `host:host_brake_req` | high | 0x301 | 4 | Host → RT |
| `host:host_light_cmd` | high | 0x302 | 1 | Host → RT |
| `host:host_heartbeat` | high | 0x7FC | 2 | Host → SYS |
| `host:host_obstacle_dist` | high | 0x400 | 4 | Host → SYS |
| `hmi:hmi_mode_req` | high/low | 0x111 | 2 | HMI → RT/SYS |
| `safety:safety_estop` | high/low | 0x1 | 0 | ESTOP broadcast |
| `sys:sys_safety_sts` | high/low | 0x11 | 3 | SYS → Host (liveness + lights) |
| `sys:sys_diag_rpt` | high/low | 0x600 | 8 | SYS → Host diagnostics |
| `rt:rt_motion_rpt` | high | 0x121 | 8 | RT → Host (speed/gear/yaw) |
| `rt:rt_state_rpt` | high/low | 0x210 | 6 | RT → Host (mode/safety) |
| `rt:rt_heartbeat` | high/low | 0x7FD | 2 | RT → Host liveness |
| `rt:steer_diag` | high | 0x310 | 8 | RT → Host (steer angle) |
| `rt:brake_diag` | high | 0x311 | 8 | RT → Host (brake telemetry) |
| `mtr:mtr_motor_fbk` | high/low | 0x206 | 4 | MTR → Host (gear/speed) |
| `mtr:sys_throttle_sts` | high/low | 0x120 | 2 | MTR → Host (speed) |
| `pwt:pwt_dcdc_cmd` | (ext) | 0x10262B27 | 8 | Powertrain DCDC |

Semantic hash: `5bec9d1e...` (protocol identity / compatibility check).
Network hash: `81c2981c...` (wire layout version).

## Encoding example (from `autoware_vehicle_bridge`)
```
messages::HostDriveCmd msg{speed_mmps, yaw_mrad, gear};
protocol::Frame frame;
if (messages::encode(msg, frame) == protocol::CodecStatus::Ok) {
    can_.send(to_socket_frame(frame));   // CAN EFF flag from frame.extended()
}
```

## Notes
- `kRoutes` (9 entries) describe bus-bridging rules (e.g. `rt-l2h-estop`: `safety_estop` low→high).
- All standard frames are 11-bit (non-extended) except `pwt:pwt_dcdc_cmd` (29-bit extended).
- `Custom` strategy messages (`seb:*`, `ses:*`) are not auto-generated; handled separately by ECU firmware.
