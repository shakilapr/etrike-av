# Upstream Modifications

Every deviation from upstream Autoware is documented here. If you're wondering
"why are we patching Nebula?" — this is the file.

## Nebula — Hesai XT32M2X firetime correction

| Field | Value |
|-------|-------|
| **Component** | `sensor_component/external/nebula` |
| **Base** | `tier4/nebula` v1.1.0 (pinned in `repositories/autoware.repos`) |
| **Patch** | `scripts/apply_nebula_firetime_patch.sh` |
| **Files modified** | `hesai_common.hpp`, `hesai_sensor.hpp`, `pandar_xt32m.hpp`, `hesai_decoder.hpp`, `hesai_ros_wrapper.cpp` |
| **Reason** | The hard-coded firetime formula `368 + 2888 * channel_id` differs from our XT32M2X device CSV by ~5.6 µs mean, causing timestamp errors that affect distortion correction and localization |
| **Owner** | Sensor integration |
| **Tests** | `etrike_common_launch/test/test_calibration_and_configs.py` |
| **Upstream** | No upstream issue/PR yet — this is device-specific |
| **Removal condition** | Remove when upstream Nebula release includes per-device CSV firetime support for XT32M2X |

### What the patch does

1. **`hesai_common.hpp`** — Adds `HesaiFiretimeConfiguration` struct (loads per-channel firing times from CSV) + `firetime_path` to `HesaiSensorConfiguration`.
2. **`hesai_sensor.hpp`** — Adds virtual `set_firetime_configuration()` method to `HesaiSensor` base class (default no-op).
3. **`pandar_xt32m.hpp`** — Overrides `set_firetime_configuration()` in `PandarXT32M` to store per-channel offsets; uses stored offsets instead of hard-coded formula in `get_packet_relative_point_time_offset()`.
4. **`hesai_decoder.hpp`** — Loads firetime CSV in the decoder constructor when `firetime_path` is non-empty.
5. **`hesai_ros_wrapper.cpp`** — Declares `firetime_file_path` ROS parameter.

### How to verify after reload

```bash
./scripts/apply_nebula_firetime_patch.sh
# Should print "PATCH VERIFIED" — if any marker is missing, upstream changed
```
