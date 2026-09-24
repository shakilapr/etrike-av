# Low-Bus Actuator & Gateway Inspector (Waveshare 4.3B SKU: 28141)

A dedicated, physical diagnostic inspector and real-time 15-second time-series scope for the **Vehicle Low CAN Bus (500 kbps)**.

---

## 1. Ground-Truth Mission

* **The High-Bus PC is Filtered**: Autoware and the laptop monitor the High Bus via the RT Gateway. If the Gateway drops frames, miscalculates checksums, or fails to drive low-level actuators, the PC does not see the ground-truth cause.
* **The Low-Bus Inspector is Direct**: Directly wired to the physical Low Bus (SES steering, SEB brake, MTR motor, SYS safety) to inspect **Command vs. Actuation vs. Tracking Error ($\Delta$)** in real time.
* **Instant Triage (< 200 ms)**: Boots immediately upon vehicle 12V key-on. No Linux boot time, no Wi-Fi, no SSH.

---

## 2. 2D Window Matrix Navigation (4.3" 800×480)

To maintain **large, glanceable fonts (36–48pt)** readable from a meter away, telemetry is split into **7 dedicated full-screen windows**:

```
                             [ 0. BUS & SAFETY ]
                                      |
         +----------------------------+----------------------------+
         | (Swipe Left / Right)       | (Swipe Left / Right)       | (Swipe Left / Right)
         v                            v                            v
   [ 1A. STEER NUMERIC ]        [ 2A. BRAKE NUMERIC ]        [ 3A. DRIVE NUMERIC ]
         |                            |                            |
         | (Swipe Down / [PLOT])      | (Swipe Down / [PLOT])      | (Swipe Down / [PLOT])
         v                            v                            v
   [ 1B. STEER 15s SCOPE ]      [ 2B. BRAKE 15s SCOPE ]      [ 3B. DRIVE 15s SCOPE ]
```

### Navigation Controls
1. **Swipe Left / Right** (or tap top tabs): Switches between subsystems (`0. BUS` $\leftrightarrow$ `1. STEER` $\leftrightarrow$ `2. BRAKE` $\leftrightarrow$ `3. DRIVE`).
2. **Swipe Down** (or tap `[OPEN 15s SCOPE PLOT]`): Drops into the full-screen 15-second rolling waveform.
3. **Swipe Up** (or tap `< NUMERICS`): Returns to the large numeric cards and vendor fault codes.
4. **Tap Graph**: Pauses/Freezes the 15-second waveform for transient spike analysis.

---

## 3. Dedicated 15-Second Time-Series Scope Plots

Each scope plot features strictly **two high-contrast colors** on an 800×350 dark canvas:
* 🟦 **Cyan (`#06B6D4`)**: **Target Command** (from Gateway)
* 🟩 **Emerald (`#10B981`)**: **Actual Feedback** (from Actuator)

| Plot | Parameter | X-Axis | Y-Axis Range | Diagnostic Insight |
| :--- | :--- | :--- | :--- | :--- |
| **Steer Scope** | `0x169 CMD` vs `0x201 ACT` | 15s (10 Hz) | $-45.0^\circ \dots +45.0^\circ$ | Actuator reaction latency, rate limit, overshoot |
| **Brake Scope** | `0x7B9 CMD` vs `0x721 ACT` | 15s (10 Hz) | $0 \dots 1500\text{ kPa}$ | Hydraulic pressure buildup lag, valve leakage |
| **Drive Scope** | `0x204 CMD` vs `0x120 ACT` | 15s (10 Hz) | $0.0 \dots 30.0\text{ km/h}$ | Throttle step response, acceleration droop |

---

## 4. Low-Bus CAN Message Mapping

| ID | Name | Direction | Decoded Signals |
| :--- | :--- | :--- | :--- |
| `0x001` | `SAFETY_ESTOP` | Low Bus Broadcast | Immediate E-Stop trigger detection |
| `0x011` | `SYS_SAFETY_STS` | SYS $\rightarrow$ Low Bus | Safety controller heartbeat, physical E-Stop pin |
| `0x169` | `VCU_SES_REQ` | RT $\rightarrow$ SES | Steering target angle (0.1°), speed, XOR checksum |
| `0x201` | `SES_STATUS` | SES $\rightarrow$ RT | Actual steering angle (0.1°), speed, motor torque |
| `0x202` | `SES_ERR_INFO` | SES $\rightarrow$ Low Bus | Vendor fault bitmap (Overcurrent, Hall, Overtemp) |
| `0x7B9` | `VCU_SEB_REQ` | SYS $\rightarrow$ SEB | Commanded stroke (0.1mm), commanded pressure (50 kPa) |
| `0x721` | `SEB_STATUS` | SEB $\rightarrow$ Low Bus | Actual stroke, actual pressure (50 kPa) |
| `0x731` | `SEB_ERR_INFO` | SEB $\rightarrow$ Low Bus | Vendor fault bitmap (Pump stall, valve leak, drift) |
| `0x204` | `RT_DRIVE_CMD` | RT $\rightarrow$ MTR | Commanded speed (mm/s), commanded gear |
| `0x120` | `SYS_THROTTLE_STS` | MTR $\rightarrow$ Low Bus | Actual speed (mm/s), feedback RPM |
| `0x502` | `MTR_NODE_STATUS` | MTR $\rightarrow$ Low Bus | `block_mask` decoder (why motor is inhibited/stopped) |

---

## 5. Wiring to the Vehicle

Connect the 16-pin green terminal directly to the **Low CAN Bus** trunk:

```
+-----+-----+-----+-----+------+------+------+------+----+----+-----+-----+
| VIN | GND | 3V3 | GND | CANH | CANL | 485A | 485B | DI0| DI1| DO0 | DO1 |
+-----+-----+-----+-----+------+------+------+------+----+----+-----+-----+
   |     |                 |      |
   +-----+                 +------+
      |                        |
 12V Switched Key          LOW CAN BUS
 Vehicle Ignition         (500 kbps Trunk)
```
