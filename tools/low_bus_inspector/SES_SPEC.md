<USER_REQUEST>
# Syntree Electronic Steering (SES / EPS) Specification

*Protocol Standard: CAN_EPS_CU_V2.22 / V2.23 (Syntree Power Steering / EPS)*  
*Designated Customer: Syntree | Contact: Sean Wang (18158767659)*  
*DBC Compatibility: V1.3.2 and above*

---

## 1. System Overview & Architecture

* **Application:** Steer-by-wire / Electric Power Steering (EPS) for intelligent mobile chassis and autonomous platforms.
* **Controller:** Electronic Control Unit (ECU).
* **Communication Interface:** CAN Bus 2.0B (Standard Frames).
* **Baud Rate:** Default **500 kbps** (Configurable: 250 kbps).
* **Calibration & Matching:** Host PC software supports steering power curve matching and motor parameter matching.

---

## 2. Technical Parameters (Official Datasheet Specification)

*Source: Official Syntree SES Technical Parameters Datasheet (Section 6)*

| No. | Substance / Parameter Name | Unit | Value / Specification | Notes & Engineering Context |
| :---: | :--- | :---: | :---: | :--- |
| **1** | Mechanical assembly weight | kg | **3.5 – 4** | Complete mechanical steering gearbox assembly |
| **2** | ECU Weight | kg | **0.4** | Electronic Control Unit module weight |
| **3** | Rated Power of the Motor | W | **360** | Brushless drive motor rated mechanical output |
| **4** | Rated Rotational Speed of the Motor | rpm | **1480** | Motor nominal speed at rated load |
| **5** | Rated Torque of the Motor | Nm | **2.36** | Motor continuous output shaft torque |
| **6** | Rated Current of the Motor | A | **52** | Motor full-load continuous rated phase current |
| **7** | Rated Working Voltage | V | **12** | Nominal system DC operating voltage |
| **8** | Max working current | A | **30** | Maximum continuous current draw under load |
| **9** | ECU Operating Voltage | V | **9 – 15** | Allowable DC bus voltage window |
| **10** | Debugging Voltage | V | **13.5** | Recommended bench testing & calibration supply voltage |
| **11** | The number of Spline teeth | Z | **30 / 36** | Spline teeth variants ($Z = 30$ or $Z = 36$) |
| **12** | The number of Spline module | m | **0.467 / 0.47** | Gear spline module variants ($m$) |
| **13** | Spline pressure angle | ° | **30.5 / 45** | Gear pressure angle variants |
| **14** | The Max steering angle at the steering wheel end | ° | **$\pm 700$** | Maximum mechanical/functional steering wheel travel |
| **15** | Transmission Ratio of Reduction Mechanism | / | **27 / 20.5 / 13.5** | Internal worm/worm-gear reduction ratios |
| **16** | Max Steering Torque | Nm | **55 / 41 / 27** | Peak steering output torque corresponding to gear ratios |
| **17** | Steering accuracy | ° | **$\pm 1$** | Closed-loop angle positioning accuracy |
| **18** | Max steering speed | °/s | **400** | Maximum steering column slew rate |
| **19** | Steering response time | ms | **$\le 100$** | Step command latency to initial actuator response |
| **20** | Max Assist Torque | Nm | **8** | Maximum torque assist provided in Assist Mode |

### Environmental & Lifecycle Parameters
* **Operating Temperature Range:** -40°C to +80°C
* **Operating Humidity:** $\le 95\%$ RH (non-condensing)
* **Ingress Protection (IP Rating):**
  * Mechanical Assembly: **IP55** (dust protected, water jets)
  * Controller (ECU): **IP54** (dust protected, splashing water)
* **Service Life Expectancy:**
  * 300,000 full steering cycles
  * 80,000 km expected vehicle operational mileage
  * 3-year manufacturer warranty
* **Angle Sensor Detection Limit:** Physical detection limit is **$\pm 720^\circ$** (with functional travel bounded at $\pm 700^\circ$). Resolution: **0.1°**, Error margin: **$\pm 0.5^\circ$**.

---

## 3. Hardware Variants & Permitted Angular Velocities

The permitted target angular velocity (`VCU_SES_Tpt_StrAngleSpd`) is hardware-dependent:

| Hardware Variant | Allowed Target Angular Velocity Range |
| :--- | :--- |
| **C02 Base** | 126°/s – 525°/s |
| **C02_C13** | 126°/s – 700°/s |
| **C02_C27** | 126°/s – 520°/s |
| **C24 Base** | 126°/s – 350°/s |
| **C24_C27** | 126°/s – 350°/s |

---

## 4. Operational Modes & State Machine Logic

```
               [ Power-On / Boot ]
                        │
                        ▼
            ┌───────────────────────┐
            │      Assist Mode      │◄─────────────────────────┐
            │ (Default on Power-Up) │                          │
            └───────────┬───────────┘                          │
                        │                                      │
           Rising Edge Enable (0 -> 1)             External Force Intervention
          VCU_SES_Control_Mode == 0x1               (Driver manual override /
                        │                            Torque sensor detection)
                        ▼                                      │
            ┌───────────────────────┐                          │
            │   Angle Control Mode  │                          │
            │  (Autonomous Driving) │──────────────────────────┘
            └───────────┬───────────┘
                        │
                  Fault Detected
                        │
                        ▼
            ┌───────────────────────┐
            │      Fault Mode       │
            │    (Emergency Stop)   │
            └───────────────────────┘
```

1. **Assist Mode (Default State):**
   * Automatically entered upon system boot.
   * Provides baseline power steering assist based on torque sensor inputs.
2. **Angle Control Mode (Autonomous Driving):**
   * Motor drives the steering angle strictly according to VCU CAN commands.
   * **Activation Requirement:** Strictly requires a **rising edge** transition on `VCU_SES_Control_Mode` (`0x0` $\rightarrow$ `0x1`).
   * **Driver Override / External Force Intervention:** If an external steering torque/force intervenes while in Angle Control Mode, the system automatically disengages autonomous angle control and reverts immediately to **Assist Mode**.
3. **Fault Mode:**
   * Engages immediately when critical system faults (L1/L2/L3) or communication timeouts are detected.
4. **Angle Alignment (Zero-Point Calibration):**
   * Commanded via `VCU_SES_Alignment_Enable = 0x1`.
   * Resets the current mechanical steering position as software $0^\circ$ center point.
5. **Vehicle Speed Signal Logic (`VCU_Veh_Spd_Value`):**
   * **Active Return-to-Center:** Used by internal control algorithms to calculate self-centering torque curves.
   * **Zero-Speed Motor Cutoff:** If the software detects that the vehicle has returned to $0^\circ$ center **AND** `VCU_Veh_Spd_Value == 0`, the motor terminates active operation/stops working to prevent unnecessary heat and holding load.

---

## 5. CAN Communication Architecture & Identifiers

* **Baud Rate:** Default **500 kbps** (250 kbps selectable).
* **Frame Format:** Standard CAN 2.0B.
* **Termination & Grounding:**
  * ECU defaults to **no** terminal resistance.
  * ECU housing must be effectively grounded to the vehicle low-voltage ground.

### CAN Message Overview

| Message Name | Default CAN ID | Cycle Time | Send Type | Description & Notes |
| :--- | :--- | :--- | :--- | :--- |
| **VCU_SES_Req** | `0x169` | 20 ms | Normal / Cyclic | VCU steering control request command. |
| **SES_Status** | `0x201` | 10 ms | Normal / Cyclic | Steering operational status, feedback angle, speed, torque. |
| **SES_ErrInfo** | `0x202` | 100 ms | Normal / Cyclic | Categorized fault flags and severity levels (L1, L2, L3). |
| **SES_Version** | `0x203` | 1000 ms | Normal / Cyclic | EEPROM status, vehicle speed echo, software version. |
| **SES_Test** | `0x6FA` | 10 ms | Diagnostic | Hardware version, motor current, ECU temp, supply voltage.<br>*Closed by default; requires host PC activation.* |

---

### Official Specification: `VCU_SES_Req` Message Definition
*Source: Official Protocol Datasheet (Page 2 & Page 3)*

| Msg Name | Msg Type | Msg ID | Msg Send Type | Msg Cycle Time (ms) | Msg Length (Byte) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **`VCU_SES_Req`** | Normal | `0x169` (Customizable Default) | Cycle | 20 | 8 |

| Signal Name | Signal Description | Engineering Meaning |
| :--- | :--- | :--- |
| `VCU_SES_Alignment_Enable` | SES Angle Control Centering Enable | Calibration / Zero-point reset enable (0: Normal, 1: Align) |
| `VCU_SES_Control_Enable` | SES Mode Control Enable | Operating mode command (0: Assist mode, 0→1: Rising edge to Angle mode) |
| `VCU_SES_Tgt_StrAngle` | VCU Requested Steering Angle | Target steering angle command (-700° to +700°, Res 0.1°) |
| `VCU_SES_Tgt_StrAngleSpd` | Target Steering Angular Velocity | Target angular velocity command (125 to 525 °/s, Res 1 °/s, Initial 0x0148) |
| `VCU_SES_RollCnt_Enable` | Life Signal Validity | Alive counter validation enable flag (0: Invalid, 1: Valid) |
| `VCU_SES_CheckSum_Enable` | Checksum Validity | Checksum validation enable flag (0: Invalid, 1: Valid) |
| `VCU_SES_RollCnt` | Life Signal | 4-bit message rolling counter (0 to 15) |
| `VCU_Veh_Spd_Value` | Vehicle Speed Signal | Vehicle speed value (0–255 km/h) |
| `VCU_SES_CheckSum` | Checksum | Data integrity checksum: `(Byte0 + Byte1 + ... + Byte6) XOR 0xFF` |

---

### Official Specification: `SES_Status` Message Definition
*Source: Official Protocol Datasheet (Page 2 & Page 4)*

| Msg Name | Msg Type | Msg ID | Msg Send Type | Msg Cycle Time (ms) | Msg Length (Byte) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **`SES_Status`** | Normal | `0x201` (Customizable Default) | Cycle | 10 | 8 |

| Signal Name | Signal Description | Value Definitions |
| :--- | :--- | :--- |
| `SES_INF_Angle_Status` | Alignment Information Feedback | `0x0`: Unaligned, `0x1`: Aligned (Centered) |
| `SES_Control_Mode_Status` | Control Mode Feedback | `0x0`: Assist Mode<br>`0x1`: Angle Control Mode<br>`0x2`: Fault Mode<br>`0x3`: Manual Intervention Mode (Driver Takeover) |
| `SES_Error_Status` | System Fault Severity | `0x0`: No Fault<br>`0x1`: Level 1 Minor Fault (Alarm)<br>`0x2`: Level 2 Common Fault (Alarm)<br>`0x3`: Level 3 Severe Fault (Emergency Stop Requested) |
| `SES_StrAngle` | Steering Angle Feedback | Actual physical steering angle (-700° to +700°, Res 0.1°) |
| `SES_Tgt_StrAngleSpd` | Steering Angular Velocity Feedback | Actual steering angular speed (0 to 1480 °/s, Res 0.5 °/s, Signed) |
| `EPS_SteeringWheel_Torq` | Steering Wheel Assist Torque Feedback | Measured driver column torque (-12 to +12 Nm, Res 0.1 Nm, Offset -12.1, Initial 0x79) |
| `SES_RollCnt_Enable_Status` | Life Signal Status Feedback | Validity status of rolling counter (0: Invalid, 1: Valid) |
| `SES_CheckSum_Enable_Status` | Checksum Status Feedback | Validity status of checksum (0: Invalid, 1: Valid) |
| `SES_RollCnt_Status` | Life Signal Feedback | 4-bit status message rolling counter (0 to 15) |
| `SES_CheckSum_Status` | Checksum Feedback | Status message checksum: `(Byte0 + Byte1 + ... + Byte6) XOR 0xFF` |


---

> [!WARNING]
> **Burn / Flash Identification ID Reservation:**
> * `0x721` is permanently reserved as the ECU burn identification ID.
> * **Prohibition:** `0x721` must **never** be assigned or mapped as a Control ID!
>
> **Host PC ID Customization Protocol:**
> * Sending an ID change only writes to volatile memory.
> * Permanent saving requires a strict two-step handshake: **Send confirmation command first**, then **execute save command**.
> * Re-flashing/reprogramming the ECU will automatically reset custom IDs back to the factory default (`0x169`).

---

## 6. Exhaustive Bit-by-Bit Engineering Table: `VCU_SES_Req` (`0x169`)

* **CAN Identifier:** `0x169` (Customizable Default)
* **Message Type:** Standard Frame (11-bit ID) | **Cycle Time:** 20 ms (50 Hz) | **DLC:** 8 Bytes (64 Bits)
* **Byte Order:** **Motorola LSB** (Vector CANdb++ convention: the "Start Bit" in documentation indicates the signal's Least Significant Bit, while the physical wire format is **Big-Endian** where the lower-numbered byte holds the Most Significant Byte: Byte 1 = MSB, Byte 2 = LSB).

### Complete 64-Bit Signal & Bit Allocation Table

| Byte | Bit in Byte | Global Bit | Signal Name | Length | Data Type | Scale / Offset | Raw Range | Physical Range | Binary / Enum Values | Bitmask & C Extraction / Packing | Exact Action & What to Do |
| :---: | :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :--- | :--- | :--- |
| **0** | **Bit 0** | Bit 0 | `VCU_SES_Alignment_Enable` | 1 bit | Boolean | 1 / 0 | 0 – 1 | 0 or 1 | • `0b0`: Normal Operation<br>• `0b1`: Trigger Calibration | `data[0] & 0x01`<br>`data[0] \|= 0x01` | **Set `0` for all driving.** Set `1` ONLY during stationary bench zero-point calibration.<br>⚠️ *Hazard:* NEVER set Bit 0=1 while Bit 1=1 (causes uncontrolled spin). |
| **0** | **Bit 1** | Bit 1 | `VCU_SES_Control_Enable` | 1 bit | Boolean | 1 / 0 | 0 – 1 | 0 or 1 | • `0b0`: Assist Mode (Default)<br>• `0b1`: Angle Mode (via $0\rightarrow1$) | `(data[0] >> 1) & 0x01`<br>`data[0] \|= ((enable & 0x01) << 1)` | **`0` = Manual human assist.**<br>**`0→1` Rising Edge = Engage Angle Control Mode.**<br>⚠️ *Rule:* Transition $0 \rightarrow 1$ required to enter autonomous steering. If driver intervenes, reset to `0`. |
| **0** | **Bits 2–7** | Bits 2–7 | *Reserved / Unassigned* | 6 bits | Pad | — | 0 | 0 | • `0b000000` | `data[0] &= 0x03` | **Always write `0b000000`.** Unused padding bits (grey in official DBC layout). |
| **1** | **Bits 0–7** | Bits 8–15 | `VCU_SES_Tpt_StrAngle` (MSB) | 8 bits | uint8 | \multirow{2}{*}{0.1° /<br>-3000°<br>*(or -700°)* } | \multirow{2}{*}{0 – 60000<br>*(or 0–14000)*} | \multirow{2}{*}{-700.0° to<br>+700.0°} | Upper 8 bits of 16-bit angle target | `data[1] = (uint8_t)((raw >> 8) & 0xFF)` | **Target Steering Angle (High Byte / MSB):**<br>Motorola Big-Endian puts MSB in Byte 1.<br>Write upper byte `(raw >> 8) & 0xFF`. |
| **2** | **Bits 0–7** | Bits 16–23 | `VCU_SES_Tpt_StrAngle` (LSB) | 8 bits | uint8 | | | | Lower 8 bits of 16-bit angle target | `data[2] = (uint8_t)(raw & 0xFF)` | **Target Steering Angle (Low Byte / LSB):**<br>Write lower byte `raw & 0xFF`.<br>• Center ($0.0^\circ$): `0x7530` (B1=`0x75`, B2=`0x30`)<br>• Section 18 bench example: `Byte 1 = 75, Byte 2 = 30`. |
| **3** | **Bits 0–7** | Bits 24–31 | `VCU_SES_Tpt_StrAngleSpd` (MSB)| 8 bits | uint8 | \multirow{2}{*}{1 °/s /<br>0} | \multirow{2}{*}{125 – 525<br>(Initial 328)} | \multirow{2}{*}{125 to<br>525 °/s} | Upper 8 bits of 16-bit speed target | `data[3] = (uint8_t)((spd >> 8) & 0xFF)` | **Target Speed (High Byte / MSB):**<br>Motorola Big-Endian puts MSB in Byte 3.<br>Write upper byte `(spd >> 8) & 0xFF`. |
| **4** | **Bits 0–7** | Bits 32–39 | `VCU_SES_Tpt_StrAngleSpd` (LSB)| 8 bits | uint8 | | | | Lower 8 bits of 16-bit speed target | `data[4] = (uint8_t)(spd & 0xFF)` | **Target Speed (Low Byte / LSB):**<br>Write lower byte `spd & 0xFF`.<br>• Typical smooth turn: $200^\circ/\text{s}$ (`0x00C8`: B3=`0x00`, B4=`0xC8`).<br>• Initial default: `0x0148` (B3=`0x01`, B4=`0x48`). |
| **5** | **Bit 0** | Bit 40 | `VCU_SES_RollCnt_Enable` | 1 bit | Boolean | 1 / 0 | 0 – 1 | 0 or 1 | • `0b0`: Counter ignored<br>• `0b1`: Counter verified | `data[5] & 0x01`<br>`data[5] \|= 0x01` | **Always set to `1` (`0b1`).** Instructs ECU to enforce rolling counter continuity. |
| **5** | **Bit 1** | Bit 41 | `VCU_SES_CheckSum_Enable` | 1 bit | Boolean | 1 / 0 | 0 – 1 | 0 or 1 | • `0b0`: Checksum ignored<br>• `0b1`: Checksum verified | `data[5] & 0x02`<br>`data[5] \|= 0x02` | **Always set to `1` (`0b1`).** Instructs ECU to validate Byte 7 checksum. |
| **5** | **Bits 2–3** | Bits 42–43 | *Reserved / Unassigned* | 2 bits | Pad | — | 0 | 0 | • `0b00` | `data[5] & 0x0C` | **Always set to `0b00`.** Unassigned reserved bits. |
| **5** | **Bits 4–7** | Bits 44–47 | `VCU_SES_RollCnt` | 4 bits | uint8 | 1 / 0 | 0 – 15<br>(`0x0` – `0xF`)| 0 to 15 | • `0b0000` to `0b1111` | `(data[5] >> 4) & 0x0F`<br>`data[5] \|= (cnt & 0x0F) << 4`| **Alive Rolling Counter:** Increment by +1 each 20 ms frame ($0 \rightarrow 15 \rightarrow 0$).<br>⚠️ *Timeout:* Freezing $>100\text{ ms}$ triggers fault. |
| **6** | **Bits 0–7** | Bits 48–55 | `VCU_Veh_Spd_Value` | 8 bits | uint8 | 1 km/h /<br>0 | 0 – 255<br>(`0x00` – `0xFF`)| 0 to<br>255 km/h | • `0b00000000` to `0b11111111` | `data[6]` | **Vehicle Speed Signal:** Pass measured chassis speed.<br>• Drives active self-centering torque.<br>• When speed=0 at $0^\circ$, motor shuts off current. |
| **7** | **Bits 0–7** | Bits 56–63 | `VCU_SES_CheckSum` | 8 bits | uint8 | 1 / 0 | 0 – 255<br>(`0x00` – `0xFF`)| 0 to 255 | • `0b00000000` to `0b11111111` | `data[7]` | **Security Checksum:**<br>$\text{Byte 7} = (\sum_{i=0}^6 \text{Byte}_i) \oplus \text{0xFF}$ or XOR algorithm. |

> [!NOTE]
> **Steering Angle Formula Reference & Firmware Scaling Detection:**
> Two scaling formulas appear across Syntree documentation variants:
> 1. **Official DBC Standard (Factor: 0.1, Offset: -700.0°):**
>    $$\text{Raw} = (\text{Angle} + 700.0) \times 10$$
>    - Center $0.0^\circ \rightarrow 7000$ (`0x1B58`)
>    - $+15.5^\circ \rightarrow 7155$ (`0x1BF3`)
>    - Range: $-700.0^\circ \rightarrow 0$ (`0x0000`) to $+700.0^\circ \rightarrow 14000$ (`0x36B0`)
> 2. **Legacy Internal / Test-Bench Reference (3000-Based):**
>    - Positive: $\text{Raw} = (\text{Angle} + 3000) / 0.1$
>    - Negative: $\text{Raw} = (3000 - \text{Angle}) / 0.1$
>    - Center $0.0^\circ \rightarrow 30000$ (`0x7530`)
>
> 💡 **How to verify on your bench:** Read `SES_Status` (`0x201`) Bytes 1 & 2 when the steering mechanism is centered at $0^\circ$:
> - If feedback reads $\approx 7000$ (`0x1B58`), the ECU uses the standard **-700 offset**.
> - If feedback reads $\approx 30000$ (`0x7530`), the ECU firmware is configured with the **3000 offset**.

---

## 7. Status & Feedback Messages

### A. Exhaustive Bit-by-Bit Engineering Table: `SES_Status` (`0x201`)

* **CAN Identifier:** `0x201` (Customizable Default)
* **Message Type:** Standard Frame | **Cycle Time:** 10 ms (100 Hz) | **DLC:** 8 Bytes (64 Bits)
* **Byte Order:** **Motorola LSB** (Vector CANdb++ convention: Start Bit refers to the LSB bit index, while on-bus physical wire format is **Big-Endian**: Byte 1 = MSB, Byte 2 = LSB).

| Byte | Bit in Byte | Global Bit | Signal Name | Length | Data Type | Scale / Offset | Raw Range | Physical Range | Binary / Enum Values | Bitmask & C Extraction | Exact Action & Meaning for VCU |
| :---: | :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **0** | **Bit 0** | Bit 0 | `SES_INF_Angle_Status` | 1 bit | Boolean | 1 / 0 | 0 – 1 | 0 or 1 | • `0b0`: Unaligned<br>• `0b1`: Aligned (Centered) | `data[0] & 0x01` | **Check Alignment Status:**<br>If `0`, ECU zero point is uncalibrated $\rightarrow$ **Block autonomous steering.**<br>If `1`, system is ready. |
| **0** | **Bits 1–2** | Bits 1–2 | `SES_Control_Mode_Status` | 2 bits | Enum | 1 / 0 | 0 – 3 | `0x0` – `0x3` | • `0b00` (`0x0`): Assist Mode<br>• `0b01` (`0x1`): Angle Mode<br>• `0b10` (`0x2`): Fault Mode<br>• `0b11` (`0x3`): Manual Intervention | `(data[0] >> 1) & 0x03` | **Current Active Mode Feedback:**<br>• `0x0`: Assist mode active.<br>• `0x1`: Autonomous angle control active.<br>• `0x2`: Fault state.<br>• `0x3`: Human manual intervention (Driver Takeover).<br>🚨 *Driver Takeover Check:* If feedback indicates `0x0` or `0x3` while autonomous mode is commanded $\rightarrow$ **VCU must immediately yield and command Assist Mode (`0x0`).** |
| **0** | **Bits 3–5** | Bits 3–5 | *Reserved / Padding* | 3 bits | Pad | — | 0 | 0 | • `0b000` | `(data[0] >> 3) & 0x07` | Reserved padding bits (grey in official DBC layout). |
| **0** | **Bits 6–7** | Bits 6–7 | `SES_Error_Status` | 2 bits | Enum | 1 / 0 | 0 – 3 | `0x0` – `0x3` | • `0b00` (`0x0`): No Fault<br>• `0b01` (`0x1`): Level 1 Minor Fault<br>• `0b10` (`0x2`): Level 2 Common Fault<br>• `0b11` (`0x3`): Level 3 Severe Fault | `(data[0] >> 6) & 0x03` | **System Fault Severity (Official Start Bit 6, Length 2):**<br>• `0x0`: Healthy. Normal operation.<br>• `0x1`: Level 1 Minor alarm. Check DTCs.<br>• `0x2`: Level 2 Common alarm. Degraded assist.<br>• `0x3`: Level 3 Severe fault. Request immediate shutdown. |
| **1** | **Bits 0–7** | Bits 8–15 | `SES_StrAngle` (MSB) | 8 bits | uint8 | \multirow{2}{*}{0.1° /<br>-3000°<br>*(or -700°)* } | \multirow{2}{*}{0 – 60000<br>*(or 0–14000)*} | \multirow{2}{*}{-700.0° to<br>+700.0°} | Upper 8 bits of actual angle | `data[1]` | **Actual Steering Angle Feedback (High Byte / MSB):**<br>Motorola Big-Endian puts MSB in Byte 1.<br>Read real-time wheel angle: `raw = ((uint16_t)data[1] << 8) \| data[2]`. |
| **2** | **Bits 0–7** | Bits 16–23 | `SES_StrAngle` (LSB) | 8 bits | uint8 | | | | Lower 8 bits of actual angle | `data[2]` | **Actual Steering Angle Feedback (Low Byte / LSB):**<br>$\text{Angle}_{\text{deg}} = (\text{Raw} \times 0.1) - 3000.0$. |
| **3** | **Bits 0–7** | Bits 24–31 | `SES_Tgt_StrAngleSpd` (MSB)| 8 bits | uint8 | \multirow{2}{*}{0.5 °/s /<br>0} | \multirow{2}{*}{0 – 2960} | \multirow{2}{*}{0 to<br>1480 °/s} | Upper 8 bits of actual speed | `data[3]` | **Actual Steering Velocity Feedback (High Byte / MSB):**<br>Motorola Big-Endian puts MSB in Byte 3. |
| **4** | **Bits 0–7** | Bits 32–39 | `SES_Tgt_StrAngleSpd` (LSB)| 8 bits | uint8 | | | | Lower 8 bits of actual speed | `data[4]` | $\text{Speed} = ((\text{uint16_t})\text{data}[3] \ll 8 \mid \text{data}[4]) \times 0.5^\circ/\text{s}$. |
| **5** | **Bits 0–7** | Bits 40–47 | `EPS_SteeringWheel_Torq` | 8 bits | uint8 | 0.1 Nm /<br>-12.1 Nm | 0 – 255 | -12.0 to<br>+12.0 Nm | Initial `0x79` (121 $\rightarrow 0.0\text{ Nm}$) | `data[5]` | **Driver Override Torque Feedback (Byte 5):**<br>$\text{Torque}_{\text{Nm}} = (\text{Byte 5} \times 0.1) - 12.1$.<br>Monitors physical driver effort on column. If absolute torque $> 1.5\text{ Nm}$ during autonomous driving, prepare for driver override. |
| **6** | **Bit 0** | Bit 48 | `SES_RollCnt_Enable_Status`| 1 bit | Boolean | 1 / 0 | 0 – 1 | 0 or 1 | • `0b0`: Invalid, `0b1`: Valid | `data[6] & 0x01` | Echoes validity of rolling counter. |
| **6** | **Bit 1** | Bit 49 | `SES_CheckSum_Enable_Status`| 1 bit | Boolean | 1 / 0 | 0 – 1 | 0 or 1 | • `0b0`: Invalid, `0b1`: Valid | `(data[6] >> 1) & 0x01` | Echoes validity of checksum. |
| **6** | **Bits 2–3** | Bits 50–51 | *Reserved / Padding* | 2 bits | Pad | — | 0 | 0 | • `0b00` | `(data[6] >> 2) & 0x03` | Unassigned padding bits. |
| **6** | **Bits 4–7** | Bits 52–55 | `SES_RollCnt_Status` | 4 bits | uint8 | 1 / 0 | 0 – 15 | 0 to 15 | • `0b0000` to `0b1111` | `(data[6] >> 4) & 0x0F` | **ECU Alive Counter (Byte 6, Bits 4–7):** Increments $0 \rightarrow 15$. Verify on every frame. If frozen for $>50\text{ ms}$, ECU communication is stalled. |
| **7** | **Bits 0–7** | Bits 56–63 | `SES_CheckSum_Status` | 8 bits | uint8 | 1 / 0 | 0 – 255 | 0 to 255 | Status Checksum | `data[7]` | **Status Frame Checksum (Byte 7):**<br>Verify that $\text{Byte 7} == (\sum_{i=0}^6 \text{Byte}_i) \oplus \text{0xFF}$ or XOR algorithm. Discard corrupted frames. |

---

### B. Exhaustive Bit-by-Bit Diagnostic Table: `SES_ErrInfo` (`0x202`)

* **CAN Identifier:** `0x202` (Customizable Default)
* **Message Type:** Standard Frame | **Cycle Time:** 100 ms (10 Hz) | **DLC:** 8 Bytes (64 Bits)
* **Signal Format:** Discrete 1-bit boolean error flags (`0b0` = False/No Error, `0b1` = True/Fault Active).
* *Source: Official Protocol Datasheet (Page 2 & Page 5)*

| Byte | Bit in Byte | Global Bit | Fault Signal Name | Subsystem / Failure Category | Severity | Bitmask | Root Cause & Failure Trigger Condition | VCU Safety Response & Action |
| :---: | :---: | :---: | :--- | :--- | :---: | :--- | :--- | :--- |
| **0** | **Bit 0** | Bit 0 | `SES_ECUUnderVolt_Err` | Controller Supply Under-Voltage | **L2** | `data[0] & 0x01` | Supply rail dropped below operational limit ($< 9.0\text{ V}$). | Disengage autonomous mode; motor cannot produce rated torque. |
| **0** | **Bit 1** | Bit 1 | `SES_ECUOverVolt_Err` | Controller Supply Over-Voltage | **L2** | `data[0] & 0x02` | Supply rail exceeded maximum limit ($> 16.0\text{ V}$). | Alert driver; monitor vehicle DC-DC converter regulator. |
| **0** | **Bit 2** | Bit 2 | `SES_CanCom_Err` | CAN Communication Timeout | **L1** | `data[0] & 0x04` | Missing `0x169` control frames from VCU for $>100\text{ ms}$. | System reverts to Assist Mode. Check CAN bus wiring & termination. |
| **0** | **Bit 3** | Bit 3 | `SES_ECUTemp_Err` | Controller Over-Temperature | **L3** | `data[0] & 0x08` | ECU internal board temperature exceeded safety limit ($> 105^\circ\text{C}$). | Immediate shutdown of motor drive bridge. |
| **0** | **Bit 4** | Bit 4 | `SES_Domain drive_SC_Err`| Domain Drive Short Circuit | **L3** | `data[0] & 0x10` | Motor bridge power MOSFET short circuit / shoot-through. | **Catastrophic.** Hardware shutdown; vehicle defaults to manual steering. |
| **0** | **Bit 5** | Bit 5 | `SES_Domain drive_V_Err` | Domain Drive Voltage Fault | **L3** | `data[0] & 0x20` | Gate driver intermediate supply rail out of specification. | Inhibit motor switching. |
| **0** | **Bit 6** | Bit 6 | `SES_Domain drive_T_Err` | Domain Drive Temperature Fault | **L3** | `data[0] & 0x40` | Power bridge inverter stage over-temperature ($> 110^\circ\text{C}$). | Inhibit motor switching to protect power MOSFETs. |
| **0** | **Bit 7** | Bit 7 | `SES_TempSensor_Err` | Temperature Sensor Fault | **L3** | `data[0] & 0x80` | Internal temperature sensor open/short circuit. | Failsafe trip; maintenance required. |
| **1** | **Bit 0** | Bit 8 | `SES_AngleSensor_P O/C_Err`| Primary Angle Sensor Open Circuit | **L3** | `data[1] & 0x01` | Primary angle sensor channel disconnected or open circuit. | Abort autonomous mode; sensor feedback invalid. |
| **1** | **Bit 1** | Bit 9 | `SES_AngleSensor_P AF_Err` | Primary Angle Sensor Abnormal Frequency | **L3** | `data[1] & 0x02` | Primary angle sensor PWM/frequency output out of bounds. | Abort autonomous mode. |
| **1** | **Bit 2** | Bit 10 | `SES_AngleSensor_S O/C_Err`| Secondary Angle Sensor Open Circuit | **L3** | `data[1] & 0x04` | Secondary angle sensor channel disconnected or open circuit. | Abort autonomous mode. |
| **1** | **Bit 3** | Bit 11 | `SES_AngleSensor_S AF_Err` | Secondary Angle Sensor Abnormal Frequency | **L3** | `data[1] & 0x08` | Secondary angle sensor frequency signal out of bounds. | Abort autonomous mode. |
| **1** | **Bit 4** | Bit 12 | `SES_SensorPow_Err` | Sensor Power Supply Fault | **L3** | `data[1] & 0x10` | Internal sensor 5V/3.3V power regulator failed. | Immediate disengagement of motor drive. |
| **1** | **Bit 5** | Bit 13 | `SES_Alignment_Err` | Zero-Point Alignment Fault | **L1** | `data[1] & 0x20` | Alignment command failed or mechanical center invalid. | Re-execute stationary alignment calibration. |
| **1** | **Bit 6** | Bit 14 | `SES_OverAngle_Err` | Steering Angle Over-Limit Fault | **L2** | `data[1] & 0x40` | Steering column physically exceeded software $\pm 700^\circ$ limit. | Manually rotate column back inside $\pm 700^\circ$ envelope. |
| **1** | **Bit 7** | Bit 15 | `SES_StrMtr_Stall_Err` | Steering Motor Stall Fault | **L3** | `data[1] & 0x80` | Motor commanded to turn but rotor locked/stalled. | Cut motor drive current to prevent winding burnout. |
| **2** | **Bit 0** | Bit 16 | `SES_MtrCurt_Err` | Motor Phase Current Fault | **L3** | `data[2] & 0x01` | Motor phase peak over-current detected ($> 52\text{ A}$). | Immediate hardware over-current trip. |
| **2** | **Bit 1** | Bit 17 | `SES_Sensors'CL_Err` | Sensor Plausibility / Credibility Fault | **L3** | `data[2] & 0x02` | Discrepancy between redundant sensor channels. | Redundancy compromised; trip to failsafe assist. |
| **2** | **Bit 2** | Bit 18 | `SES_TorqSensor_T1 O/C_Err`| Torque Sensor T1 Open Circuit | **L3** | `data[2] & 0x04` | Torque sensor channel 1 wiring broken/disconnected. | Manual assist reverts to limp-home estimation. |
| **2** | **Bit 3** | Bit 19 | `SES_TorqSensor_T2 O/C_Err`| Torque Sensor T2 Open Circuit | **L3** | `data[2] & 0x08` | Torque sensor channel 2 wiring broken/disconnected. | Fallback to single-channel assist curve. |
| **2** | **Bit 4** | Bit 20 | `SES_TorqSensor_T1 AF_Err` | Torque Sensor T1 Abnormal Frequency | **L3** | `data[2] & 0x10` | Channel 1 frequency/voltage out of calibrated range. | Disable active torque assist augmentation. |
| **2** | **Bit 5** | Bit 21 | `SES_TorqSensor_T2 AF_Err` | Torque Sensor T2 Abnormal Frequency | **L3** | `data[2] & 0x20` | Channel 2 frequency/voltage out of calibrated range. | Cross-check discrepancy between T1 and T2. |
| **2** | **Bit 6** | Bit 22 | `SentAngle_Err` | Transmit Angle Error | **L1** | `data[2] & 0x40` | VCU target angle command out of range or malformed. | Verify scaling and range limits ($\pm 700^\circ$). |
| **2** | **Bit 7** | Bit 23 | `SES_StrMtr_idling_Err` | Motor Idling / Decoupling Fault | **L3** | `data[2] & 0x80` | Motor rotating with zero column movement (gear decoupled). | **Catastrophic.** Mechanical linkage failure. Emergency stop. |
| **3** | **Bit 0** | Bit 24 | `SES_EPPROM_Err` | Non-Volatile EEPROM Fault | **L2** | `data[3] & 0x01` | Parameter checksum error in EEPROM memory. | Re-flash ECU parameters via Host PC tool. |
| **3** | **Bits 1–7** | Bits 25–31 | *Reserved* | Reserved | — | `data[3] & 0xFE` | Reserved bits (padded as 0). | — |
| **4..6**| **Bits 0–7** | Bits 32–55 | *Reserved* | Reserved | — | `data[4..6]` | Reserved bytes (padded as 0x00). | — |
| **7** | **Bits 0–7** | Bits 56–63 | `SES_Veh_Spd_Value` | Vehicle Speed Echo Feedback | — | `data[7]` | Echo of vehicle speed signal received by ECU (0–255 km/h). | Compare with VCU Byte 6 to verify speed reception integrity. |

---

### C. `SES_Version` (`0x203`) & `SES_Test` (`0x6FA`)

* **`SES_Version` (`0x203`, Cycle Time: 1000 ms, DLC: 8 Bytes):**
  * `Byte 0`: `SES_SW_Version` — 8 bits, Resolution: 0.01 (e.g., `0x64` = $100 \times 0.01 = 1.00$, indicating v1.0).
  * `Byte 1`: `SES_HW_Version` — 8 bits, Resolution: 0.1 (e.g., `0x0D` = $13 \times 0.1 = 1.3$, indicating Hardware v1.3).
  * `Bytes 2..7`: Reserved padding (`0x00`).

* **`SES_Test` (`0x6FA`, Cycle Time: 10 ms, DLC: 8 Bytes):**
  * *(Closed/disabled by default; must be opened via host PC software)*
  * `Bytes 1 & 2`: `SES_MtrCurt` — 16 bits, Signed, Resolution: 0.0078125 A/bit, Range: 0 to 60.0 A.
  * `Bytes 3 & 4`: `SES_ECUTemp` — 16 bits, Unsigned, Resolution: 0.5 °C/bit, Range: 0 to 255.0 °C.
  * `Bytes 5 & 6`: `SES_PowVolt` — 16 bits, Unsigned, Resolution: 0.00390625 V/bit, Range: 0 to 18.0 V.
  * `Byte 0 & Byte 7`: Reserved / framing.

---

## 8. C / C++ (ESP32) Programming Implementation Guide

### A. Data Encoding & Decoding Helpers

```c
#include <stdint.h>
#include <stdbool.h>

// Convert physical steering angle (-700.0 to +700.0 deg) to 16-bit raw integer
static inline uint16_t ses_encode_angle(float angle_deg) {
    if (angle_deg < -700.0f) angle_deg = -700.0f;
    if (angle_deg > +700.0f) angle_deg = +700.0f;
    return (uint16_t)((angle_deg + 700.0f) * 10.0f + 0.5f);
}

// Convert 16-bit raw integer to physical steering angle (-700.0 to +700.0 deg)
static inline float ses_decode_angle(uint16_t raw_angle) {
    return ((float)raw_angle * 0.1f) - 700.0f;
}

// Calculate the checksum over Bytes 0 to 6
// Note: Official datasheet specifies: CheckSum = (Byte0 + Byte1 + ... + Byte6) XOR 0xFF
// In common automotive firmware, verify whether your ECU firmware expects additive sum or bitwise XOR:
static inline uint8_t ses_calc_checksum(const uint8_t *data) {
    // Standard Bitwise XOR implementation (most prevalent in Syntree CAN firmware):
    uint8_t chk = 0x00;
    for (int i = 0; i < 7; i++) {
        chk ^= data[i];
    }
    return chk ^ 0xFF;
}

static inline uint8_t ses_calc_checksum_additive(const uint8_t *data) {
    // Literal 8-bit sum XOR 0xFF:
    uint8_t sum = 0x00;
    for (int i = 0; i < 7; i++) {
        sum += data[i];
    }
    return sum ^ 0xFF;
}
```

### Important DBC Start-Bit Indexing Note
> [!NOTE]
> In raw DBC specifications, signal start bits are referenced by Vector CANdb++ internal numbering (e.g. `Start Bit 16` for Angle, `Start Bit 32` for Speed).
> The **authoritative wire format** confirmed by the DBC matrix and ECU hardware places:
> - **Byte 0:** Alignment Enable (bit 0), Control Enable (bit 1)
> - **Byte 1 & 2:** Target Angle (16-bit Little-Endian)
> - **Byte 3 & 4:** Target Speed (16-bit Little-Endian)
> - **Byte 5:** Alive Rolling Counter (bits 4–7) & Enable bits (bits 0 & 1)
> - **Byte 6:** Vehicle Speed (8-bit unsigned km/h)
> - **Byte 7:** Checksum (`(data[0..6]) ^ 0xFF`)

### B. Command Frame Builder (`VCU_SES_Req` - `0x169`)

```c
typedef enum {
    SES_MODE_ASSIST = 0x00,
    SES_MODE_ANGLE  = 0x01
} ses_control_mode_t;

typedef struct {
    bool align_enable;
    bool control_enable;        // false = Assist Mode, true = Angle Mode (via rising edge)
    float target_angle_deg;     // -700.0 to +700.0 deg
    uint16_t target_speed_dps;  // e.g., 200 deg/s (respecting hardware variant limits, min 126)
    uint8_t vehicle_speed_kmh;  // 0 to 255 km/h
    uint8_t roll_cnt;           // 0 to 15
} vcu_ses_req_t;

void ses_pack_vcu_req(const vcu_ses_req_t *req, uint8_t out_data[8]) {
    // Byte 0: Alignment Enable (bit 0), Control Enable (bit 1), Bits 2-7 reserved (0)
    out_data[0] = (req->align_enable ? 0x01 : 0x00) |
                  (req->control_enable ? 0x02 : 0x00);

    // Byte 1 & 2: Target Steering Angle (Motorola Big-Endian: Byte 1 = MSB, Byte 2 = LSB)
    uint16_t raw_angle = ses_encode_angle(req->target_angle_deg);
    out_data[1] = (uint8_t)((raw_angle >> 8) & 0xFF); // MSB
    out_data[2] = (uint8_t)(raw_angle & 0xFF);        // LSB

    // Byte 3 & 4: Target Speed (Motorola Big-Endian: Byte 3 = MSB, Byte 4 = LSB)
    out_data[3] = (uint8_t)((req->target_speed_dps >> 8) & 0xFF); // MSB
    out_data[4] = (uint8_t)(req->target_speed_dps & 0xFF);        // LSB

    // Byte 5: RollCnt_Enable=1 (bit 0), CheckSum_Enable=1 (bit 1), RollCnt (bits 4-7)
    // 0x03 sets both Enable bits to 1
    out_data[5] = 0x03 | ((req->roll_cnt & 0x0F) << 4);

    // Byte 6: Vehicle Speed (km/h)
    out_data[6] = req->vehicle_speed_kmh;

    // Byte 7: Checksum
    out_data[7] = ses_calc_checksum(out_data);
}
```

### C. Feedback Frame Parser (`SES_Status` - `0x201`)

```c
typedef struct {
    bool is_aligned;             // Byte 0, Bit 0
    uint8_t control_mode_status; // Byte 0, Bits 1-2: 0=Assist, 1=Angle, 2=Fault, 3=Manual Intervention
    uint8_t error_status;        // Byte 0, Bits 6-7: 0=None, 1=Level 1, 2=Level 2, 3=Level 3
    float actual_angle_deg;      // Byte 1 & 2: -700.0 to +700.0 deg
    float actual_speed_dps;      // Byte 3 & 4: 0 to 1480 deg/s (res 0.5)
    float driver_torque_nm;      // Byte 5: -12.0 to +12.0 Nm (res 0.1, offset -12.1)
    bool roll_cnt_enable_status; // Byte 6, Bit 0
    bool checksum_enable_status; // Byte 6, Bit 1
    uint8_t roll_cnt;            // Byte 6, Bits 4-7
    bool checksum_valid;         // Byte 7
} ses_status_t;

bool ses_unpack_status(const uint8_t in_data[8], ses_status_t *status) {
    // Validate Checksum (Byte 7)
    uint8_t expected_chk = ses_calc_checksum(in_data);
    status->checksum_valid = (expected_chk == in_data[7]);

    // Byte 0: Alignment, Mode, and Error Severity
    status->is_aligned = (in_data[0] & 0x01) != 0;
    status->control_mode_status = (in_data[0] >> 1) & 0x03;
    status->error_status = (in_data[0] >> 6) & 0x03; // Bits 6-7 per official DBC layout

    // Byte 1 & 2: Angle Feedback (Motorola Big-Endian: Byte 1 = MSB, Byte 2 = LSB)
    uint16_t raw_angle = ((uint16_t)in_data[1] << 8) | (uint16_t)in_data[2];
    status->actual_angle_deg = ses_decode_angle(raw_angle);

    // Byte 3 & 4: Angular Speed Feedback (Motorola Big-Endian: Byte 3 = MSB, Byte 4 = LSB)
    uint16_t raw_spd = ((uint16_t)in_data[3] << 8) | (uint16_t)in_data[4];
    status->actual_speed_dps = (float)raw_spd * 0.5f;

    // Byte 5: Driver Column Assist Torque Feedback (Resolution: 0.1 Nm, Offset: -12.1 Nm)
    status->driver_torque_nm = ((float)in_data[5] * 0.1f) - 12.1f;

    // Byte 6: Validity Flags and Alive Rolling Counter
    status->roll_cnt_enable_status = (in_data[6] & 0x01) != 0;
    status->checksum_enable_status = ((in_data[6] >> 1) & 0x01) != 0;
    status->roll_cnt = (in_data[6] >> 4) & 0x0F;

    return status->checksum_valid;
}
```

### D. State Machine & Mode Transition Logic
* **Rising Edge Detection:** Store `prev_mode`. Transition to `SES_MODE_ANGLE` only when commanding a transition from `0x0` to `0x1`.
* **Driver Override Interlock:** If `status.control_mode_status` drops back to `0x0` while `req.control_mode == SES_MODE_ANGLE`, external driver torque intervened. Reset VCU state to `SES_MODE_ASSIST` to prevent control fighting.
* **Zero-Speed Motor Protection:** When `req.vehicle_speed_kmh == 0` and `fabsf(status.actual_angle_deg) < 0.5f`, command $0^\circ$ and prepare for automatic motor stop.

---

## 9. Actionable Bit-by-Bit Developer Playbook (What to Do in Every Bit & Byte)

This section details exactly what numeric values to pack into each bit and byte across common operational scenarios.

### A. Outgoing Command: `VCU_SES_Req` (`0x169`, 20 ms Cycle)

#### Byte 0: Alignment & Mode Control
* **Bit 0 (`VCU_SES_Alignment_Enable`)**:
  * **Put `0`**: During all normal driving, manual assist, and autonomous angle steering.
  * **Put `1`**: ONLY when performing bench zero-calibration with wheels mechanically fixed at true $0.0^\circ$.
  * ⚠️ *Critical Rule:* Never set Bit 0 to `1` when Bit 1 is `1`.
* **Bits 1–2 (`VCU_SES_Control_Mode`)**:
  * **Put `0x0` (Assist Mode)**: On system startup, during human driving, or immediately when driver takeover occurs.
  * **Put `0x1` (Angle Mode)**: When autonomous steering is active.
  * ⚠️ *Rising Edge Trigger:* To engage Angle Mode, you **must transition** this field from `0x0` to `0x1` (e.g. send at least one frame of `0x0` before commanding `0x1`).
* **Bits 3–7 (Reserved)**:
  * Always set to `0`.
  * *Byte 0 Mask:* Assist Mode = `0x00`, Angle Mode = `0x02` (`(0x01 << 1)`), Alignment = `0x01`.

#### Bytes 1 & 2: Target Steering Angle (`VCU_SES_Tpt_StrAngle`)
* **Byte 1**: Lower 8 bits (LSB).
* **Byte 2**: Upper 8 bits (MSB).
* **Calculation:** $\text{Raw} = (\text{Angle}_{\text{deg}} + 700.0) \times 10$.
  * **Straight Ahead ($0.0^\circ$)**: $\text{Raw} = 7000$ (`0x1B58`) $\rightarrow$ Byte 1 = `0x58`, Byte 2 = `0x1B`.
  * **Turn Right (e.g., $+30.0^\circ$)**: $\text{Raw} = (30.0 + 700.0) \times 10 = 7300$ (`0x1C84`) $\rightarrow$ Byte 1 = `0x84`, Byte 2 = `0x1C`.
  * **Turn Left (e.g., $-30.0^\circ$)**: $\text{Raw} = (-30.0 + 700.0) \times 10 = 6700$ (`0x1A2C`) $\rightarrow$ Byte 1 = `0x2C`, Byte 2 = `0x1A`.
  * **Extreme Limit Warning:** Never exceed $\pm 700.0^\circ$ ($\text{Raw } 0 \text{ to } 14000$). Commands beyond $\pm 720.0^\circ$ trigger mechanical hard-stop collision and motor stall faults.

#### Bytes 3 & 4: Target Angular Speed (`VCU_SES_Tpt_StrAngleSpd`)
* **Byte 3**: Lower 8 bits (LSB).
* **Byte 4**: Upper 8 bits (MSB).
* **Units:** $1^\circ/\text{s}$ per LSB.
* **What to Put:**
  * For standard smooth turning: Use **$150^\circ/\text{s}$ to $250^\circ/\text{s}$**.
  * Example: $200^\circ/\text{s}$ (`0x00C8`) $\rightarrow$ Byte 3 = `0xC8`, Byte 4 = `0x00`.
  * *Hardware Limits:*
    * C02 Hardware: Minimum $126^\circ/\text{s}$, Maximum $525^\circ/\text{s}$.
    * C24 Hardware: Minimum $126^\circ/\text{s}$, Maximum $350^\circ/\text{s}$.
    * Values below $126^\circ/\text{s}$ may be ignored or clipped by the ECU.

#### Byte 5: Rolling Counter & Validity Flags
* **Bit 0 (`VCU_SES_RollCnt_Enable`)**: Set to `1` (validates life signal).
* **Bit 1 (`VCU_SES_CheckSum_Enable`)**: Set to `1` (validates checksum).
* **Bits 2–3 (Reserved)**: Set to `0`.
* **Bits 4–7 (`VCU_SES_RollCnt`)**: 4-bit rolling counter ($0 \rightarrow 15$).
* **How to code Byte 5:**
  ```c
  uint8_t roll_cnt = current_counter & 0x0F;
  can_data[5] = 0x03 | (roll_cnt << 4); // 0x03 enables both flags
  current_counter = (current_counter + 1) % 16;
  ```

#### Byte 6: Vehicle Speed (`VCU_Veh_Spd_Value`)
* **Units:** $1\text{ km/h}$ per LSB ($0$ to $255\text{ km/h}$).
* **What to Put:** Pass your actual measured chassis speed from wheel speed sensors or GPS.
  * At $45\text{ km/h}$: Byte 6 = `0x2D`.
  * At standstill ($0\text{ km/h}$): Byte 6 = `0x00`.
  * ⚠️ *Motor Sleep Behavior:* When Byte 6 is `0x00` AND steering angle reaches $0.0^\circ$, the ECU automatically turns off motor drive current to conserve power.

#### Byte 7: Security Checksum (`VCU_SES_CheckSum`)
* **Algorithm:** XOR Bytes 0 through 6, then XOR with `0xFF`.
  ```c
  can_data[7] = (can_data[0] ^ can_data[1] ^ can_data[2] ^ can_data[3] ^
                 can_data[4] ^ can_data[5] ^ can_data[6]) ^ 0xFF;
  ```

---

### B. Incoming Feedback: `SES_Status` (`0x201`, 10 ms Cycle)

On every received frame, check the following signals:
1. **Check Byte 0, Bit 0 (`SES_INF_Angle_Status`)**:
   * If `0`: Mechanism is unaligned! **Do not activate autonomous driving.**
   * If `1`: System is calibrated and ready.
2. **Check Byte 0, Bits 1–2 (`SES_Control_Mode_Status`)**:
   * `0x0`: System is in Assist Mode.
   * `0x1`: System is in Angle Control Mode (following VCU angle commands).
   * `0x2`: System has tripped into Fault Mode!
   * `0x3`: Manual Intervention Mode (Driver Takeover).
   * ⚠️ *Driver Takeover Check:* If VCU is commanding Angle Mode, but feedback indicates `0x0` or `0x3`, a human driver intervened by turning the steering wheel. The VCU must immediately switch its own state machine to Assist Mode (`0x0`).
3. **Check Byte 0, Bits 6–7 (`SES_Error_Status`)**:
   * `0x0`: Healthy. Normal operation.
   * `0x1`: Level 1 Minor fault (alarm; maintain monitoring).
   * `0x2`: Level 2 Common fault (alarm; prepare fallback).
   * `0x3`: Level 3 Severe fault (emergency stop requested).
4. **Read Bytes 1 & 2 (`SES_StrAngle`)**:
   * $\text{Actual Angle} = ((\text{Byte 1} \mid (\text{Byte 2} \ll 8)) \times 0.1) - 3000.0$ *(or $-700.0$ depending on firmware offset)*.
5. **Read Bytes 3 & 4 (`SES_Tgt_StrAngleSpd`)**:
   * Actual angular rate: $\text{Rate}_{\text{dps}} = (\text{Byte 3} \mid (\text{Byte 4} \ll 8)) \times 0.5^\circ/\text{s}$.
6. **Read Byte 5 (`EPS_SteeringWheel_Torq`)**:
   * Actual driver torque applied to column: $\text{Torque}_{\text{Nm}} = (\text{Byte 5} \times 0.1) - 12.1$.
7. **Read Byte 6 (`SES_RollCnt_Status`)**:
   * Verify rolling counter in Bits 4–7 increments on every frame to detect stalled transmission.


---

### C. Complete Real-World CAN Frame Examples

#### Scenario 1: Autonomous Center Cruise ($0.0^\circ$, $200^\circ/\text{s}$, $40\text{ km/h}$, RollCnt=0)
* Target Angle ($0.0^\circ$ with official -3000 offset): $30000 = \text{0x7530}$
  * Byte 1 (MSB) = `0x75`
  * Byte 2 (LSB) = `0x30`
* Target Speed ($200^\circ/\text{s}$): $200 = \text{0x00C8}$
  * Byte 3 (MSB) = `0x00`
  * Byte 4 (LSB) = `0xC8`
* Byte 0: `0x02` (Angle Mode, Align=0)
* Byte 5: `0x03` (Flags=1, RollCnt=0)
* Byte 6: `40 km/h` = `0x28`
* Byte 7: Checksum = `(0x02 ^ 0x75 ^ 0x30 ^ 0x00 ^ 0xC8 ^ 0x03 ^ 0x28) ^ 0xFF` = `0xA4 ^ 0xFF` = `0x5B`
* **Raw Frame:** `[0x02, 0x75, 0x30, 0x00, 0xC8, 0x03, 0x28, 0x5B]`
*(Note: If using alternate -700 offset firmware, $0.0^\circ \rightarrow 7000 = \text{0x1B58}$: Byte 1 = `0x1B`, Byte 2 = `0x58`).*

#### Scenario 2: Autonomous Right Turn ($+25.0^\circ$, $200^\circ/\text{s}$, $25\text{ km/h}$, RollCnt=1)
* Target Angle ($+25.0^\circ$): $(25.0 + 3000) / 0.1 = 30250 = \text{0x762A}$
  * Byte 1 (MSB) = `0x76`
  * Byte 2 (LSB) = `0x2A`
* Target Speed ($200^\circ/\text{s}$): $\text{0x00C8}$ (Byte 3 = `0x00`, Byte 4 = `0xC8`)
* Byte 0: `0x02` (Angle Mode)
* Byte 5: `0x13` (`0x03 | (1 << 4)`)
* Byte 6: `25 km/h` = `0x19`
* Byte 7: Checksum = `(0x02 ^ 0x76 ^ 0x2A ^ 0x00 ^ 0xC8 ^ 0x13 ^ 0x19) ^ 0xFF` = `0x9C ^ 0xFF` = `0x63`
* **Raw Frame:** `[0x02, 0x76, 0x2A, 0x00, 0xC8, 0x13, 0x19, 0x63]`

#### Scenario 3: Autonomous Left Turn ($-25.0^\circ$, $200^\circ/\text{s}$, $25\text{ km/h}$, RollCnt=2)
* Target Angle ($-25.0^\circ$): $(-25.0 + 3000) / 0.1 = 29750 = \text{0x7436}$
  * Byte 1 (MSB) = `0x74`
  * Byte 2 (LSB) = `0x36`
* Target Speed ($200^\circ/\text{s}$): $\text{0x00C8}$ (Byte 3 = `0x00`, Byte 4 = `0xC8`)
* Byte 0: `0x02` (Angle Mode)
* Byte 5: `0x23` (`0x03 | (2 << 4)`)
* Byte 6: `25 km/h` = `0x19`
* Byte 7: Checksum = `(0x02 ^ 0x74 ^ 0x36 ^ 0x00 ^ 0xC8 ^ 0x23 ^ 0x19) ^ 0xFF` = `0xBC ^ 0xFF` = `0x43`
* **Raw Frame:** `[0x02, 0x74, 0x36, 0x00, 0xC8, 0x23, 0x19, 0x43]`

#### Scenario 4: Manual Human Driving / Standby (Assist Mode, RollCnt=0)
* Byte 0: `0x00` (Assist Mode, Align=0)
* Byte 1 & 2: `0x75, 0x30` (Neutral $0.0^\circ$)
* Byte 3 & 4: `0x00, 0x00` (No speed demand)
* Byte 5: `0x03` (Flags=1, RollCnt=0)
* Byte 6: Current vehicle speed
* Byte 7: Checksum computed across Bytes 0–6


---

### D. Official Datasheet "Section 18: Debugging and Testing" Example Frame

*Source: Official Syntree SES Technical Datasheet (Section 18: Debugging and Testing)*

#### Default Protocol Example Frame

| CAN ID | Length (Bytes) | Byte 0 | Byte 1 | Byte 2 | Byte 3 | Byte 4 | Byte 5 | Byte 6 | Byte 7 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `0x169` | `8` | `2` | `75` | `30` | `00` | `00` | `00` | `00` | `00` |

#### Payload Breakdown & Signal Definitions
* **`Byte 0, Bit 0`**: Calibration enable control —— `0`: disable; `1`: enable
* **`Byte 0, Bit 1`**: Angle control enable —— `0`: disable; `1`: enable
  * *Notice:* `Byte 0 = 2` (`0b00000010`) commands **Angle Control Enabled** (`Bit 1 = 1`) and **Calibration Disabled** (`Bit 0 = 0`).
* **`Byte 1 & Byte 2`**: 
  * Positive angle data: $\text{Target Angle} = \text{0x}[(\text{physical angle} + 3000) / 0.1]$
  * Negative angle data: $\text{Target Angle} = \text{0x}[(3000 - \text{physical angle}) / 0.1]$
  * *Analysis of `Byte 1 = 75` (`0x75`) and `Byte 2 = 30` (`0x30`):*
    $$\text{0x7530} = 30000_{10} = \frac{0.0^\circ + 3000}{0.1}$$
    This commands a target steering angle of **$0.0^\circ$ (Straight Ahead Center)**.
* **`Byte 3` to `Byte 7`**: Set to `0x00` in basic diagnostic test mode (alive counter and checksum verification can be bypassed during bench testing if enable flags in Byte 5 are 0).

---

## 10. Safety & Operational Rules

1. **Mutual Exclusivity:** `VCU_SES_Alignment_Enable` and `VCU_SES_Control_Enable` must never be set simultaneously.
2. **Rising Edge Trigger:** To enter Angle Control Mode, the VCU must generate a distinct rising edge transition ($0 \rightarrow 1$) on `VCU_SES_Control_Enable`.
3. **Driver Intervention Safety:** Any manual force applied to the steering wheel while autonomous Angle Control Mode is active immediately trips the system back to **Assist Mode**, prioritizing human driver safety.
4. **Boot Sequence:** VCU CAN signal transmission must be paused during ECU power-on. Wait for angle feedback from `SES_Status` before sending angle commands.
5. **Physical Limits:** Operating angle is bounded at software $\pm 700^\circ$ and sensor physical detection $\pm 720^\circ$. Commanded targets beyond $\pm 720^\circ$ trigger mechanical end-stop impact and `Motor Stalling Fault L1` (`SES_ErrInfo` Byte 5 Bit 0).
6. **ECU Binding:** An ECU paired to a mechanical gear assembly must be centered at physical midpoint, zero-calibrated, and power-cycled. It is thereafter married to that assembly.

---

## 11. Engineering Terminology Glossary

| Protocol / System Concept | Signal / Keyword Equivalent | Engineering & Implementation Context |
| :--- | :--- | :--- |
| Protocol Name | CAN EPS CU V2.23 | Official CAN communication specification identifier |
| Power Steering (EPS) | SES (Smart Electric Steering) | Steer-by-wire electromechanical steering assist system |
| Host PC Software | Upper Computer / Configuration Tool | Syntree Windows-based diagnostic, curve matching & motor calibration suite |
| Baud Rate | 500 kbps (Default) / 250 kbps | Nominal CAN bus bit timing (customizable via host PC) |
| Angle Alignment / Centering | `VCU_SES_Alignment_Enable` | Resetting and teaching the mechanical zero-reference center point |
| Assist Mode | `VCU_SES_Control_Mode = 0x0` | Default manual power-assist steering mode; active upon boot |
| Angle Control Mode | `VCU_SES_Control_Mode = 0x1` | Autonomous closed-loop angular tracking mode commanded by VCU |
| Fault Mode | `SES_Control_Mode_Status = 0x2`| ECU failsafe shutdown state triggered by system anomalies |
| Active Return-to-Center | Dynamic self-centering | ECU software algorithm driving steering back to center based on vehicle speed |
| Enable Signal | `Enable` | Binary control flag (1 = Active, 0 = Inactive) |
| Checksum | `VCU_SES_CheckSum` | Byte 7 data integrity verification: XOR Bytes 0–6, XOR 0xFF |
| Life Signal / Alive Counter | `VCU_SES_RollCnt` | 4-bit cyclic rolling counter (0–15) ensuring fresh periodic frames |
| External Force Intervention | Driver Override | Manual column torque overcoming motor assist, triggering fallback to Assist Mode |
| Rising Edge Trigger | Transition ($0 \rightarrow 1$) | Mandatory edge transition on Control Mode bit to engage Angle Control |
| Flash / Calibration ID | CAN ID `0x721` | Reserved ECU bootloader & firmware programming ID (must not be used for control) |
| Test Frame ID | CAN ID `0x6FA` | Factory test message (disabled by default; opened via host PC tool) |
| Vehicle Speed Signal | `VCU_SES_VehSpd` | VCU broadcast speed driving dynamic assist curves and zero-speed motor sleep |


</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-09-24T20:50:50+05:30.
</ADDITIONAL_METADATA>