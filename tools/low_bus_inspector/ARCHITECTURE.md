# Low-Bus Actuator & Gateway Inspector: Architecture Specification

**Target Hardware**: Waveshare ESP32-S3-Touch-LCD-4.3B-BOX (SKU: 28141)  
**Display**: 4.3-inch IPS (800 × 480 @ 60 FPS), Capacitive Multitouch (GT911)  
**Interface**: Onboard TJA1051 CAN Transceiver directly tapped to the **Vehicle Low CAN Bus (500 kbps)**  
**Power**: Direct 7–36V DC Vehicle Key-Switched Ignition Rail  

---

## 1. System Mission & Ground-Truth Verification

### 1.1 The High-Bus vs. Low-Bus Blindspot
In the autonomous vehicle network topology, the **Host PC (Autoware)** resides on the **High CAN Bus** and communicates solely through the **RT Gateway**:

```
+-------------------------------------------------------------------------------------------------+
|                                       HIGH CAN BUS (500k)                                       |
|    Autoware / Host PC (Direct Bridge) <=========================> RT Gateway / Bridge           |
+-------------------------------------------------------------------------------------------------+
                                                                            || (Internal translation,
                                                                            ||  checksums, scheduling)
+-------------------------------------------------------------------------------------------------+
|                                       LOW CAN BUS (500k)                                        |
|    RT Gateway <=======> SYS (Safety) <=======> SES (Steer) <=======> SEB (Brake) <=======> MTR  |
+-------------------------------------------------------------------------------------------------+
                                            ^
                                            | (Direct Physical Tap)
                               +--------------------------+
                               |    Low-Bus Inspector     |
                               | (Waveshare 4.3" SKU 28141)|
                               +--------------------------+
```

When an actuator fails in the field (e.g. steering stalls, hydraulic brake pressure does not build, or the motor refuses to turn), the High-Bus PC is frequently **blind** to the root cause because:
1. The Gateway filters or drops unroutable frames.
2. Proprietary vendor command-feedback loops (`0x169`/`0x201` for SES, `0x7B9`/`0x721` for SEB) exist **only on the Low Bus**.
3. Gateway schedule overruns or CRC errors cannot be detected by the PC.

The **Low-Bus Inspector** taps the physical Low Bus directly to provide **unfiltered ground-truth telemetry** with zero software mediation.

---

## 2. Low-Bus CAN Protocol & Signal Mapping

The Inspector listens passively to the Low Bus (500 kbps Classic CAN 2.0). It decodes 4 core domains:

```
+----------------------------------------------------------------------------------------------------+
| DOMAIN          | COMMAND FRAME (From Gateway) | FEEDBACK FRAME (From Actuator) | ERROR / STATUS   |
+-----------------+------------------------------+--------------------------------+------------------+
| 1. Steering     | 0x169 VCU_SES_REQ            | 0x201 SES_STATUS               | 0x202 SES_ERR    |
| 2. Brake        | 0x7B9 VCU_SEB_REQ (or 0x205) | 0x721 SEB_STATUS               | 0x731 SEB_ERR    |
| 3. Powertrain   | 0x204 RT_DRIVE_CMD           | 0x120 THROTTLE / 0x206 MOTOR   | 0x502 MTR_NODE   |
| 4. Bus & Safety | 0x001 SAFETY_ESTOP           | 0x011 SYS_SAFETY_STS           | 0x500 SYS_NODE   |
+----------------------------------------------------------------------------------------------------+
```

### 2.1 Steering Subsystem: Syntree SES (CAN_EPS_CU_V2.22 / V2.23)
* **Protocol Standard**: CAN_EPS_CU_V2.22 / V2.23 (Syntree Power Steering / EPS)
* **Baud Rate**: 500 kbps (Default on Low Bus)
* **Wire Format**: Motorola Big-Endian (Byte 1 = MSB, Byte 2 = LSB)
* **Angle Limits**: Physical detection $\pm 720^\circ$, Software operating boundary $\pm 700.0^\circ$ (Resolution: 0.1°)
* **Command (`0x169 VCU_SES_Req`, 20ms)**:
  * `VCU_SES_Alignment_Enable`: Byte 0, Bit 0 (`1`: Trigger zero-point calibration on stationary bench)
  * `VCU_SES_Control_Enable`: Byte 0, Bit 1 (`0`: Assist Mode, `0→1`: **Rising Edge Transition** engages Angle Control Mode)
  * `VCU_SES_Tpt_StrAngle`: Bytes 1..2 (Target Steering Angle):
    * Standard DBC (-700 Offset): $\text{Raw} = (\text{Angle}_{\text{deg}} + 700.0) \times 10$ ($0.0^\circ = 7000 = \text{0x1B58}$)
    * Test-Bench (-3000 Offset): $\text{Raw} = (\text{Angle}_{\text{deg}} + 3000.0) \times 10$ ($0.0^\circ = 30000 = \text{0x7530}$)
    * *Auto-detected by firmware based on raw magnitude threshold ($20000$)*.
  * `VCU_SES_Tpt_StrAngleSpd`: Bytes 3..4 (Target Angular Speed, $1^\circ/\text{s}$ res, Range: 126–525°/s for C02 variant)
  * `VCU_SES_RollCnt_Enable`: Byte 5, Bit 0 (Must be set to `1`)
  * `VCU_SES_CheckSum_Enable`: Byte 5, Bit 1 (Must be set to `1`)
  * `VCU_SES_RollCnt`: Byte 5, Bits 4..7 (Cyclic 0–15)
  * `VCU_Veh_Spd_Value`: Byte 6 (Vehicle speed 0–255 km/h. When speed=0 at $0^\circ$, motor shuts off current to prevent holding heat)
  * `VCU_SES_CheckSum`: Byte 7: $(\bigoplus_{i=0}^6 \text{Byte}_i) \oplus \text{0xFF}$ (XOR algorithm) or additive sum
* **Feedback (`0x201 SES_Status`, 10ms)**:
  * `SES_INF_Angle_Status`: Byte 0, Bit 0 (`0`: Unaligned, `1`: Aligned / Centered)
  * `SES_Control_Mode_Status`: Byte 0, Bits 1..2:
    * `0x0`: Assist Mode (Manual driver steering)
    * `0x1`: Angle Control Mode (Autonomous steering)
    * `0x2`: Fault Mode (Emergency stop / failsafe)
    * `0x3`: **Manual Intervention Mode (Driver Takeover)** — When human driver applies steering force, ECU trips to 0x3 / Assist Mode to yield control to human.
  * `SES_Error_Status`: Byte 0, Bits 6..7 (`0`: Healthy, `1`: Level 1 Alarm, `2`: Level 2 Warning, `3`: Level 3 Emergency Stop)
  * `SES_StrAngle`: Bytes 1..2 (Actual Steering Angle Feedback):
    $$\text{Angle}_{\text{deg}} = (\text{Raw} \times 0.1) - \text{Offset}$$
  * `SES_Tgt_StrAngleSpd`: Bytes 3..4 (Actual Steering Velocity, Scale: 0.5°/s, 0 to 1480°/s)
  * `EPS_SteeringWheel_Torq`: Byte 5 (Driver Column Torque Feedback):
    $$\text{Torque}_{\text{Nm}} = (\text{Byte 5} \times 0.1) - 12.1\text{ Nm} \quad (-12.0\text{ to } +12.0\text{ Nm})$$
  * `SES_RollCnt_Status`: Byte 6, Bits 4..7 (Cyclic 0–15 watchdog)
  * `SES_CheckSum_Status`: Byte 7 (Validated on every frame)
* **Diagnostic Flags (`0x202 SES_ErrInfo`, 100ms)**:
  * Decodes all **25 discrete hardware, electrical, sensor, and mechanical failure flags**:
    * Voltage: `ECUUnderVolt (<9.0V, L2)`, `ECUOverVolt (>16.0V, L2)`
    * Communication: `CanCom_Err (Timeout >100ms, L1)`
    * Thermal: `ECUTemp_Err (>105°C, L3)`, `Domain drive_T_Err (>110°C, L3)`, `TempSensor_Err (L3)`
    * Gate Driver & Bridge: `Domain drive_SC_Err (Bridge short circuit, L3)`, `Domain drive_V_Err (L3)`
    * Sensors: Primary/Secondary Angle Sensor `O/C` & `AF` (L3), `SensorPow_Err (L3)`, `Sensors'CL_Err (L3)`
    * Torque Sensors: `TorqSensor_T1/T2 O/C & AF` (L3)
    * Motor & Linkage: `StrMtr_Stall_Err (L3)`, `MtrCurt_Err (>52A, L3)`, `StrMtr_idling_Err (Gear Decoupled, L3)`
    * Parameter & Limits: `EPPROM_Err (L2)`, `OverAngle_Err (>±700°, L2)`, `SentAngle_Err (L1)`
  * `SES_Veh_Spd_Value`: Byte 7 (Echoed vehicle speed)
* **Test Telemetry (`0x6FA SES_Test`, 10ms)**:
  * `Motor Current`: Bytes 1..2 (Scale: 0.0078125 A, 0 to 60.0 A)
  * `ECU Temp`: Bytes 3..4 (Scale: 0.5 °C, 0 to 255.0 °C)
  * `Supply Voltage`: Bytes 5..6 (Scale: 0.00390625 V, 0 to 18.0 V)

### 2.2 Hydraulic Brake Subsystem: Syntree SEB (CAN_SEB_CU_V3.0)
* **Protocol Standard**: CAN_SEB_CU_V3.0 (Syntree Brake-by-Wire)
* **Baud Rate**: 500 kbps (Default on Low Bus)
* **Wire Format**: Motorola (Big-Endian on wire)
* **Command (`0x7B9 VCU_SEB_Req`, 20ms)**:
  * `VCU_SEB_Control_Enable`: Byte 0, Bit 1 (`0`: Standby, `1`: Enabled)
  * `VCU_SEB_Control_Mode`: Byte 0, Bit 2 (`0`: Stroke Closed-Loop, `1`: Pressure Closed-Loop)
  * `VCU_SEB_AutoBrake`: Byte 0, Bit 3 (`1`: Arms 4.0 MPa failsafe clamping if CAN drops $\ge 5\text{ s}$)
  * `VCU_SEB_Stroke_Value_Req`: Bytes 1..2 (Big-Endian, Scale: 0.05 mm, Offset: -30.0 mm, Valid: -5.0 mm to +27.0 mm)
    $$\text{Raw} = (\text{Stroke}_{\text{mm}} + 30.0) / 0.05$$
  * `VCU_SEB_Pre_Value_Req`: Byte 3 (Scale: 0.05 MPa / 50 kPa, Offset: 0.0 MPa)
    $$\text{Raw} = \text{Pressure}_{\text{MPa}} / 0.05$$
  * `VCU_SEB_RollCnt`: Byte 6, Bits 4..7 (Cyclic 0–15)
  * `VCU_SEB_CheckSum`: Byte 7: $(\sum_{i=0}^6 \text{Byte}_i) \oplus \text{0xFF}$
* **Feedback (`0x721 SEB_Status`, 10ms)**:
  * `SEB_Alignment_Status`: Byte 0, Bit 0 (`1`: Aligned, `0`: Not Aligned)
  * `SEB_Control_Mode_Status`: Byte 0, Bits 2..3 (`00`: Stroke Mode, `01`: Pressure Mode, `10`: Fault)
  * `SEB_Error_Status`: Byte 0, Bits 6..7 (`0`: Healthy, `1`: Level 1, `2`: Level 2, `3`: Level 3 Critical)
  * `SEB_Stroke_Value`: Bytes 1..2 (Actual Piston Displacement):
    $$\text{Stroke}_{\text{mm}} = ((((\text{Byte 1} \ll 8) \mid \text{Byte 2})) \times 0.05) - 30.0$$
  * `SEB_Pressure_Value`: Byte 3 (Actual Hydraulic Line Pressure):
    $$\text{Pressure}_{\text{MPa}} = \text{Byte 3} \times 0.05\text{ MPa} \quad (\text{or } \text{Byte 3} \times 50.0\text{ kPa})$$
  * `SEB_Angle_Value`: Bytes 4..5 (Diagnostic motor response angle, signed 16-bit, Scale: 0.5°)
  * `SEB_CheckSum_Status`: Byte 7: Checked against $(\sum_{i=0}^6 \text{Byte}_i) \oplus \text{0xFF}$
* **Diagnostic Flags (`0x731 SEB_ErrInfo`, 100ms)**:
  * Decodes all **22 individual hardware, sensor, motor, and hydraulic fault flags**:
    * Voltage: `ECUUnderVolt (<9V)`, `ECUOverVolt (>16V)`
    * Sensors: `AngleSensor_P/S`, `NOPreSensor_Err` (CRITICAL: Pressure sensor open), `Sensors'CL_Err`
    * Motor & Mechanics: `Mtr_Stall_Err`, `MtrD/C_Err`, `Mtr_No-load_Err`
    * Hydraulics: `Oil_Err` (Tracking lag), `InitOil_Err` (Residual pressure), `PreSensorOver_Err`
* **Test Telemetry (`0x6FB SEB_Test`, 10ms)**:
  * `Motor Current`: Bytes 0..1 (Scale: 0.0078125 A)
  * `ECU Temp`: Bytes 2..3 (Scale: 0.5 °C)
  * `Supply Voltage`: Bytes 4..5 (Scale: 0.00390625 V)

### 2.3 Powertrain & Drive Subsystem (MTR)
* **Command (`0x204 RT_DRIVE_CMD`)**:
  * `motor_speed_mmps`: Bytes 0..3 (signed int32) $\rightarrow$ converted to km/h
  * `target_gear`: Byte 4 (`0: N`, `1: D`, `2: S`, `3: R`)
* **Feedback (`0x120 SYS_THROTTLE_STS` & `0x206 MTR_MOTOR_FBK`)**:
  * `measured_speed_mmps`: Bytes 0..1 (signed int16)
  * `motor_feedback_rpm`: Measured feedback
  * `actual_gear`: Byte 2
* **Node Interlock Status (`0x502 MTR_NODE_STATUS`)**:
  * `block_mask`: Bytes 1..2 (Decodes why the motor won't turn: `ESTOP_LATCHED`, `SPEED_ZERO_CLAMP`, `DEGRADED`, `VOLTAGE_LOW`).

### 2.4 Safety & Bus Supervisor (SYS & Liveness)
* **Hardware E-Stop (`0x001 SAFETY_ESTOP` & `0x011 SYS_SAFETY_STS`)**:
  * Pinpoints immediate E-Stop trip source: Physical Button, Remote, Gateway Timeout, or Actuator Fault.
* **5-Node Watchdog Timer**:
  * Continuous tracking of cycle intervals for `SYS (100ms)`, `RT (10ms)`, `MTR (20ms)`, `SES (10ms)`, `SEB (10ms)`.
  * If any node remains silent for $>200\text{ ms}$, its watchdog triggers a timeout alert.

---

## 3. UI Navigation Model: 2D Multi-Window Matrix

Given the **4.3" (95 × 54 mm)** physical screen, trying to fit all telemetry onto a single screen makes fonts illegible.  
The UI is organized as a **2D Matrix of 7 dedicated screens** navigated via capacitive swipe gestures or top touch buttons:

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

### 3.1 Gesture Rules
1. **Swipe Horizontal (Left / Right)**: Cycles between the 4 domains:
   `[GENERAL / BUS]` $\longleftrightarrow$ `[STEERING]` $\longleftrightarrow$ `[BRAKING]` $\longleftrightarrow$ `[POWERTRAIN]`
2. **Swipe Vertical (Up / Down)** or tap **`[PLOT] / [DIGITS]`**:
   * **Down**: Drops from large numeric cards into the **Full-Screen 15s Scope Plot**.
   * **Up**: Returns to the numeric telemetry and error codes.
3. **Persistent Top Status Strip (44px)**:
   * 4 large touch tabs: `[GEN]`, `[STR]`, `[BRK]`, `[DRV]`.
   * **Active Fault Indicator**: If an actuator faults or experiences a tracking error $\Delta$, its tab **flashes bright red**, allowing one-tap jump to the fault.

---

## 4. 15-Second Rolling Scope Plot Engine

### 4.1 Specification
* **Sample Rate**: $10\text{ Hz}$ ($100\text{ ms}$ interval) $\rightarrow$ $150$ data points per series over 15 seconds.
* **Buffer Memory**: Ring buffer in SRAM ($150 \times 2\text{ bytes} \times 3\text{ channels} = 900\text{ bytes}$ per plot: Command, Actual, and Auxiliary/Torque).
* **Color Discipline**:
  * 🟦 **Cyan (`#06B6D4`)**: **Target Command** (from Gateway)
  * 🟩 **Emerald (`#10B981`)**: **Actual Feedback** (from Actuator)
  * 🟧 **Amber (`#F59E0B`)**: **Driver Column Torque / Auxiliary Metric** (from Actuator)
  * 🟥 **Rose / Red (`#F43F5E`)**: Dynamic error alert whenever $|\text{CMD} - \text{ACT}| > \text{Threshold}$ or Driver Takeover is active.
* **Time Scale**: 15 distinct 1-second vertical grid intervals with an origin marker at $T=0$ (Right edge / Now) scrolling smoothly from right to left.
* **Freeze / Pause Control**: Tapping the plot pauses waveform updates immediately, allowing the engineer to inspect transient spikes or step responses without the data scrolling away.

### 4.2 Actuator Plot Profiles
1. **Steering Scope (Dual-Axis Synchronized)**:
   * **Primary Y-Axis (Left)**: Steering Angle $-45.0^\circ$ to $+45.0^\circ$, center zero line at $0.0^\circ$ (Cyan: Target, Emerald: Actual).
   * **Secondary Y-Axis (Right)**: Driver Column Torque $-4.5\text{ Nm}$ to $+4.5\text{ Nm}$ (Amber trace, $0.1\text{ Nm}$ resolution, decoded from `0x201` Byte 5).
   * **Root-Cause Diagnostic Value**: Instantly disambiguates tracking error causes:
     * **Motor/Linkage Failure**: Angle error is high, but Torque remains zero or low.
     * **Driver Takeover / Wrestling**: Torque spikes ($> 1.5\text{ to } 4.5\text{ Nm}$) counter to the motor command, correlating with `SES_Control_Mode_Status == 3`.
     * **Curb / Road Obstacle Drag**: Torque spikes while angle is held stationary.
2. **Brake Scope**:
   * Range: $0$ to $1500\text{ kPa}$ (Line Pressure). Aux trace records Piston Stroke ($0$ to $25.0\text{ mm}$).
   * Resolves: Hydraulic pressure rise time, pump latency, pressure decay, air bubble lag.
3. **Drive Scope**:
   * Range: $0$ to $30.0\text{ km/h}$. Aux trace records Motor RPM / 100.
   * Resolves: Throttle step response, acceleration curve, torque cutoff, interlock masking.

---

## 5. Firmware Architecture (ESP-IDF v5.x)

```
                       +-----------------------------------+
                       |         Low-Bus CAN (TWAI)        |
                       |        Pinned to CPU Core 0       |
                       |       Priority: 10 (Real-Time)    |
                       +-----------------+-----------------+
                                         |
                                         | Zero-Copy Ring Buffer
                                         v
+----------------------+       +---------------------------+
|  Touch Input Handler |       |     LVGL Engine Task      |
|  (GT911 on I2C)      | ----> |   Pinned to CPU Core 1    |
+----------------------+       |   Priority: 5 (60 FPS)    |
                               | - 15s Ring Buffer Feeder  |
                               | - 2D Screen Matrix Render |
                               +---------------------------+
                                         |
                                         v
                               +---------------------------+
                               |   MicroSD Flight Logger   |
                               |   Raw CAN Frame Dumper    |
                               +---------------------------+
```

### 5.1 Real-Time Separation
* **CPU Core 0 (CAN TWAI Engine)**: Dedicated entirely to ingesting, filtering, and timestamping incoming CAN frames on GPIO15/16 at 500 kbps with zero packet drops. Maintains a high-speed lock-free ring buffer.
* **CPU Core 1 (LVGL & UI Manager)**: Handles the 800×480 RGB LCD DMA display refresh, touch gestures, 15-second rolling buffer math, and screen transitions.
* **MicroSD Dumper**: When active, writes raw binary `.can` logs to the TF card using hardware SPI for post-test analysis.

---

## 6. Hardware Constraints & Embedded Design Rules (Waveshare 4.3B SKU 28141)

Developing for the physical **Waveshare ESP32-S3-Touch-LCD-4.3B-BOX (SKU: 28141)** requires strict adherence to embedded automotive design rules:

| # | Hardware Constraint | Technical Reality | Architecture & UI Mitigation |
| :---: | :--- | :--- | :--- |
| **1** | **Only 65K Colors** | 16-bit RGB565 ($32 \times 64 \times 32$ levels). Subtle color gradients create visible banding on 16-bit panels. | **Strictly Flat Design**: Zero color gradients or smooth drop-shadows. Solid high-contrast cards (`#000000`, `#0d0d0d`, `#1e293b`). All colors pre-quantized to 5-bit/6-bit boundaries. |
| **2** | **800×480 (Non-High-DPI)** | Total 384,000 pixels across 4.3 inches. Modest pixel density compared to modern smartphones. | **No Desktop Controls**: Zero micro-checkboxes, tiny 10px text, or dense 15-column tables. Clear visual hierarchy: **46–48pt hero digits**, 20–24pt status badges, minimum 13–14pt text labels. Glanceable from 1 meter away. |
| **3** | **4.3" Physical Size** | Active area is only $95.04 \times 53.86\text{ mm}$ (credit-card width). Full desktop CAN bus sniffers are unreadable. | **Dedicated Subsystem Pages**: 2D navigation matrix splits telemetry into distinct full-screen pages (Bus, Steer, Brake, Drive) rather than cramming multiple panels onto one display. |
| **4** | **No Hardware 3D/2D GPU** | ESP32-S3 dual-core Xtensa LX7 @ 240 MHz. | **Zero Transparency / Alpha Blending**: Cards use 100% solid opacity (`bg_opa = 255`). Chart refresh rate capped at 10–20 Hz (100ms interval) to leave Core 1 plenty of CPU headroom. |
| **5** | **Touch Precision on 4.3"** | Capacitive GT911 5-point touch, but subject to vehicle vibration and gloved operation. | **50–70 px Touch Targets**: Navigation buttons are $\ge 52\text{ px}$ tall; primary action buttons are $60\text{ px}$ tall. Generous padding prevents accidental mis-touches. |
| **6** | **550 cd/m² Brightness** | Bright for an embedded module, but not certified automotive sunlight-readable. | **Pure-Black High Contrast**: Deep black background (`#000000`) with high-luma text (Cyan `#06b6d4`, Emerald `#10b981`, White `#ffffff`). Maximizes contrast ratio for daylight testing. |
| **7** | **Temperature Limitation** | Operating range is **0°C to +65°C** (prototype/industrial grade, not -40°C..+105°C automotive grade). | **Thermal Watchdog on Screen 0**: Active monitoring of ESP32-S3 internal die temperature via TSENS. Alerts driver if enclosure exceeds $60^\circ\text{C}$ under the dashboard. |
| **8** | **Functional Fit & Scope** | Not an infotainment cluster or video player. | **Specialized Low-Bus Actuator Inspector**: Laser-focused on command vs. feedback deltas, actuator fault codes, and 15s transient oscilloscope waveforms. |

---

## 7. Multi-Iteration Ergonomic Analysis & Design Revisions

To guarantee glanceability and error-free thumb touch interaction while driving or bench-testing, an ergonomic audit was conducted against the physical display constraints of the **Waveshare 4.3B (95.04 × 53.86 mm, 8.4 px/mm)**.

### 7.1 Identified Ergonomic Problems & Anti-Patterns
1. **Thumb Occlusion & Target Size**:
   * *Problem*: Adult human thumbs average $15–20\text{ mm}$ in width, which corresponds to $126–168\text{ px}$ on an $800\text{ px}$ display ($16–21\%$ of total screen width). Small desktop buttons ($<40\text{ px}$ height) or narrow corner buttons caused frequent missed touches and required high visual attention.
   * *Fix*: Upgraded bottom navigation across all numeric screens into full-width $784 \times 58\text{ px}$ ($93.3 \times 6.9\text{ mm}$) banner buttons. Both left and right thumbs can easily hit the button without looking.
2. **Horizontal Text Collisions & Clutter**:
   * *Problem*: Displaying static data (ranges like `-700..+700°`, `100 Hz`, `0x5B VALID`) cluttered the interface with zero operational value. Badges like `Δ: -8 kPa [TRACKING OK]` exceeded the width of $250\text{ px}$ cards at comfortable font sizes ($>18\text{ pt}$), causing truncation.
   * *Fix*: Implemented **2-Tier Metric Badging** (stacked numerical delta above tracking state). Completely purged static protocol constants to highlight only live operational deviations.
3. **Number / Unit Horizontal Overflow**:
   * *Problem*: Placing large hero digits and unit labels horizontally on the same line (e.g. `450 kPa` or `15.0 km/h` at $52\text{ pt}$) caused the unit to push against or overflow the card boundary.
   * *Fix*: Implemented vertical stacking of large $52\text{ pt}$ hero values directly above bold $20\text{ pt}$ uppercase units (`kPa`, `km/h`), leaving $30\text{ px}$ padding on all sides.
4. **Font Glyphs & Embedded Rendering**:
   * *Problem*: Emoji characters (`📈`, `⏸`) caused font fallback missing glyph boxes (`▯`) on standard embedded fonts (Arial / Roboto).
   * *Fix*: Replaced all emoji icons with clean universal ASCII symbols (`|| PAUSE / FREEZE`, `>`, `< NUMERICS`).

### 7.2 Final Ergonomic Metrics Matrix
| Element | Iteration 0 (Initial) | Iteration 1 (Revision 1) | Iteration 2 (Final) | Ergonomic Justification |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Digits** | $40\text{ pt}$ | $48\text{ pt}$ | **$52–56\text{ pt}$** | Legible from $>1\text{ meter}$ under vehicle vibration |
| **Delta Badging** | Single-line $16\text{ pt}$ | Single-line $20\text{ pt}$ (clipped) | **2-Tier Stacked ($22\text{ pt} + 14\text{ pt}$)** | Eliminates clipping; separates value from qualitative assessment |
| **Numeric Action Target** | Narrow $180 \times 44\text{ px}$ button | Bottom row split buttons | **Full-width $784 \times 58\text{ px}$** | $93\text{ mm}$ reach; ambidextrous thumb target |
| **Plot Header Layout** | Crammed $26\text{ pt}$ title | Title + 2 metrics | **Distributed $18\text{ pt}$ Bold + Aux Metric** | Prevents overlap between back button and auxiliary metric |
| **Watchdog Deck** | 4-column compact cards | 4-column compact cards | **5-column $146 \times 170\text{ px}$ cards** | Full visibility of all low-bus ECUs with active status tags |
