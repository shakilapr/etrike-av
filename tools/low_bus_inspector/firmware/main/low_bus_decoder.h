/**
 * @file low_bus_decoder.h
 * @brief Low-Bus CAN Protocol Decoder & 15-Second Time-Series Circular Buffers
 *
 * Fully compliant with:
 * - Syntree Electronic Brake (SEB) Specification: CAN_SEB_CU_V3.0
 * - SES Steering Vendor Protocol: ses.vendor.v1
 * - Powertrain & Drive: etrike.application.v1
 */

#pragma once

#include <stdbool.h>
#include <stdint.h>
#include "driver/twai.h"

#ifdef __cplusplus
extern "C" {
#endif

#define PLOT_POINTS_15S         150  // 15 seconds @ 10 Hz (100ms sample interval)

typedef enum {
    NODE_SYS = 0,
    NODE_RT  = 1,
    NODE_MTR = 2,
    NODE_SES = 3,
    NODE_SEB = 4,
    NODE_COUNT = 5,
} low_bus_node_t;

typedef struct {
    uint32_t rx_count;
    float rate_hz;
    int64_t last_seen_us;
    bool timeout;
    uint32_t silent_ms;
} node_watchdog_t;

/**
 * @brief Syntree SEB 0x731 Full 22-Bit Error Diagnostic Flags
 */
typedef struct {
    // Byte 0
    bool ecu_undervolt;       // Bit 0: Supply < 9.0V
    bool ecu_overvolt;        // Bit 1: Supply > 16.0V
    bool can_com_err;         // Bit 2: CAN timeout
    bool ecu_temp_err;        // Bit 3: PCB/Power stage overtemp
    bool bridge_sc_err;       // Bit 4: Bridge driver short circuit
    bool driver_volt_err;     // Bit 5: Driver gate voltage fault
    bool driver_temp_err;     // Bit 6: Driver overtemp
    bool angle_p_cut_err;     // Bit 7: Primary angle sensor cut
    // Byte 1
    bool angle_p_freq_err;    // Bit 0: Primary angle sensor freq fault
    bool angle_s_cut_err;     // Bit 1: Secondary angle sensor cut
    bool angle_s_freq_err;    // Bit 2: Secondary angle sensor freq fault
    bool no_pres_sensor_err;  // Bit 3: CRITICAL: Pressure sensor disconnected/open
    bool sensor_plaus_err;    // Bit 5: Sensor plausibility discrepancy
    bool alignment_err;       // Bit 6: Zero-point alignment failed
    bool angle_over_err;      // Bit 7: Motor rotor angular displacement limit
    // Byte 2
    bool mtr_stall_err;       // Bit 1: Motor locked-rotor / stall
    bool mtr_phase_dc_err;    // Bit 2: Motor phase disconnected
    bool oil_track_err;       // Bit 3: Hydraulic pressure tracking discrepancy
    bool init_oil_err;        // Bit 4: Residual oil pressure on power-up
    bool sent_value_err;      // Bit 5: VCU target value out of range
    bool mtr_no_load_err;     // Bit 6: Motor idling / lead screw disengaged
    // Byte 3
    bool pres_sensor_over;    // Bit 0: Pressure sensor over-pressure
    bool low_volt_charge_err; // Bit 1: Low-voltage capacitor charging failed
    uint32_t raw_bitmap;      // Packed 32-bit error bitmap
} seb_detailed_errors_t;

/**
 * @brief Syntree SES 0x202 Error Diagnostic Flags
 */
typedef struct {
    // Byte 0
    bool ecu_undervolt;         // Bit 0: Supply < 9.0V (L2)
    bool ecu_overvolt;          // Bit 1: Supply > 16.0V (L2)
    bool can_com_err;           // Bit 2: CAN timeout > 100ms (L1)
    bool ecu_temp_err;          // Bit 3: Controller overtemp > 105C (L3)
    bool domain_drive_sc_err;   // Bit 4: Bridge short circuit / shoot-through (L3)
    bool domain_drive_v_err;    // Bit 5: Gate driver supply rail fault (L3)
    bool domain_drive_t_err;    // Bit 6: Inverter bridge temp > 110C (L3)
    bool temp_sensor_err;       // Bit 7: Temperature sensor open/short (L3)

    // Byte 1
    bool angle_p_oc_err;        // Bit 0: Primary angle sensor open circuit (L3)
    bool angle_p_af_err;        // Bit 1: Primary angle sensor abnormal freq (L3)
    bool angle_s_oc_err;        // Bit 2: Secondary angle sensor open circuit (L3)
    bool angle_s_af_err;        // Bit 3: Secondary angle sensor abnormal freq (L3)
    bool sensor_pow_err;        // Bit 4: Internal 5V/3.3V power regulator fault (L3)
    bool alignment_err;         // Bit 5: Zero-point alignment failed (L1)
    bool over_angle_err;        // Bit 6: Steering angle exceeded +-700 deg limit (L2)
    bool str_mtr_stall_err;     // Bit 7: Steering motor stall / locked-rotor (L3)

    // Byte 2
    bool mtr_curt_err;          // Bit 0: Motor phase current > 52A (L3)
    bool sensors_cl_err;        // Bit 1: Primary/Secondary sensor discrepancy (L3)
    bool torq_t1_oc_err;        // Bit 2: Torque sensor T1 open circuit (L3)
    bool torq_t2_oc_err;        // Bit 3: Torque sensor T2 open circuit (L3)
    bool torq_t1_af_err;        // Bit 4: Torque sensor T1 abnormal freq (L3)
    bool torq_t2_af_err;        // Bit 5: Torque sensor T2 abnormal freq (L3)
    bool sent_angle_err;        // Bit 6: Commanded target angle out of range (L1)
    bool str_mtr_idling_err;    // Bit 7: Motor idling / gearbox decoupled (L3)

    // Byte 3
    bool eeprom_err;            // Bit 0: EEPROM parameter checksum error (L2)

    uint32_t raw_bitmap;        // Packed 32-bit error bitmap
    uint8_t veh_spd_echo;       // Byte 7: Echoed vehicle speed (0-255 km/h)
} ses_detailed_errors_t;

typedef struct {
    // 1. Safety & E-Stop Interlock Root Cause
    bool estop_active;
    uint8_t estop_source_node; // 0: None, 1: SYS 0x011, 2: RT 0x210, 3: MTR 0x502
    uint8_t estop_reason_code;
    bool estop_pin_active;

    // 2. Syntree SES Steering Actuator (CAN_EPS_CU_V2.23: 0x169 CMD, 0x201 ACT, 0x202 ERR, 0x6FA TEST)
    // Commands (0x169 VCU_SES_Req, 20ms)
    bool ses_cmd_align_enable;
    bool ses_cmd_control_enable;    // 0: Assist, 0->1: Angle Mode
    float steer_cmd_deg;            // Target Angle: -700.0 to +700.0 deg
    float steer_cmd_speed_deg_s;    // Target Angular Speed: 125 to 525 deg/s
    uint8_t steer_cmd_roll_cnt;
    uint8_t steer_cmd_veh_spd;      // Vehicle Speed: 0 to 255 km/h
    bool steer_cmd_chk_valid;

    // Status Feedback (0x201 SES_Status, 10ms)
    bool ses_align_status;
    uint8_t ses_control_mode_status; // 0: Assist, 1: Angle, 2: Fault, 3: Manual Intervention (Takeover)
    uint8_t ses_err_level;           // 0: None, 1: Level 1, 2: Level 2, 3: Level 3
    float steer_act_deg;
    float steer_act_speed_deg_s;
    float steer_torque_nm;           // Driver column torque (-12.0 to +12.0 Nm)
    float steer_delta_deg;
    uint8_t steer_feedback_roll_cnt;
    bool steer_feedback_chk_valid;

    // Error Info (0x202 SES_ErrInfo, 100ms)
    ses_detailed_errors_t ses_errors;
    const char *ses_primary_fault_str;

    // Diagnostics & Test (0x6FA SES_Test, 10ms)
    float ses_motor_current_a;       // Raw * 0.0078125 A
    float ses_ecu_temp_c;            // Raw * 0.5 °C
    float ses_pow_volt_v;            // Raw * 0.00390625 V

    // 3. Syntree SEB Brake Actuator (CAN_SEB_CU_V3.0: 0x7B9 CMD, 0x721 STATUS, 0x731 ERR, 0x6FB TEST)
    // Commands (0x7B9)
    bool seb_cmd_align_enable;
    bool seb_cmd_control_enable;
    uint8_t seb_cmd_control_mode;  // 0: Stroke Mode, 1: Pressure Mode
    bool seb_cmd_autobrake_enable;
    float brake_cmd_stroke_mm;     // -5.0 to +27.0 mm (Raw: (mm + 30.0) / 0.05)
    float brake_cmd_mpa;           // 0.0 to 12.75 MPa (0.05 MPa res)
    float brake_cmd_kpa;           // Converted to kPa for display (1 MPa = 1000 kPa)
    uint8_t seb_cmd_roll_cnt;
    bool seb_cmd_chk_valid;

    // Status Feedback (0x721)
    bool seb_align_status;
    bool seb_control_enable_status;
    uint8_t seb_control_mode_status; // 0: Stroke, 1: Pressure, 2: Fault
    bool seb_autobrake_status;
    uint8_t seb_err_level;          // 0: None, 1: Level 1, 2: Level 2, 3: Level 3 Critical
    float brake_act_stroke_mm;      // Actual Stroke: (Raw * 0.05) - 30.0 mm
    float brake_act_mpa;            // Actual Pressure: Raw * 0.05 MPa
    float brake_act_kpa;            // Actual Pressure in kPa
    float brake_delta_kpa;
    float brake_delta_stroke_mm;
    float seb_motor_angle_deg;      // Testing angle: Raw * 0.5 deg
    uint8_t seb_feedback_roll_cnt;
    bool seb_feedback_chk_valid;

    // Error Info (0x731)
    seb_detailed_errors_t seb_errors;
    const char *seb_primary_fault_str;

    // Diagnostics & Test (0x6FB)
    float seb_motor_current_a;      // Raw * 0.0078125 A
    float seb_ecu_temp_c;           // Raw * 0.5 °C
    float seb_pow_volt_v;           // Raw * 0.00390625 V

    // 4. Powertrain & Drive (MTR: 0x204 CMD, 0x120/0x206 ACT, 0x502 STATUS)
    float drive_cmd_kmh;
    uint8_t drive_cmd_gear;
    float drive_act_kmh;
    uint16_t drive_motor_rpm;
    uint8_t drive_act_gear;
    float drive_delta_kmh;
    uint16_t drive_block_mask;
    uint8_t drive_node_state;

    // 5. Low-Bus Controller Health & Thermal Status (0°C..+65°C Limit)
    uint32_t total_low_bus_frames;
    float bus_rate_hz;
    uint8_t twai_tec;
    uint8_t twai_rec;
    bool bus_off;
    float rail_volts_12v;
    float esp32_internal_temp_c;

    // 6. Node Watchdogs
    node_watchdog_t nodes[NODE_COUNT];
} low_bus_telemetry_t;

typedef struct {
    int16_t cmd[PLOT_POINTS_15S];
    int16_t act[PLOT_POINTS_15S];
    int16_t aux[PLOT_POINTS_15S]; // Steering: Driver Torque (0.1 Nm), Brake: Stroke (0.1 mm), Drive: RPM/10
    uint16_t head;
    bool is_paused;
} plot_buffer_15s_t;

void low_bus_decoder_init(void);
void low_bus_decoder_process_frame(const twai_message_t *frame);
void low_bus_decoder_tick_100ms(void);
void low_bus_decoder_get_telemetry(low_bus_telemetry_t *dest);

void low_bus_decoder_get_steer_plot(plot_buffer_15s_t *dest);
void low_bus_decoder_get_brake_plot(plot_buffer_15s_t *dest);
void low_bus_decoder_get_drive_plot(plot_buffer_15s_t *dest);

void low_bus_decoder_toggle_pause_steer(void);
void low_bus_decoder_toggle_pause_brake(void);
void low_bus_decoder_toggle_pause_drive(void);

#ifdef __cplusplus
}
#endif
