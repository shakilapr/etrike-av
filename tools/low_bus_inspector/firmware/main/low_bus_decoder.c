/**
 * @file low_bus_decoder.c
 * @brief Low-Bus CAN Protocol Decoder & 15-Second Time-Series Circular Buffers Implementation
 *
 * Implements:
 * - Syntree SEB CAN_SEB_CU_V3.0 (0x7B9, 0x721, 0x731, 0x6FB)
 * - SES Steering Vendor Protocol (0x169, 0x201, 0x202)
 * - Powertrain & Drive (0x204, 0x120, 0x206, 0x502)
 */

#include "low_bus_decoder.h"
#include <string.h>
#include <math.h>
#include "freertos/FreeRTOS.h"
#include "freertos/semphr.h"
#include "esp_timer.h"

static low_bus_telemetry_t s_telemetry;
static SemaphoreHandle_t s_mutex = NULL;

static plot_buffer_15s_t s_plot_steer;
static plot_buffer_15s_t s_plot_brake;
static plot_buffer_15s_t s_plot_drive;

static uint32_t s_frame_counter = 0;
static uint32_t s_frames_in_sec = 0;
static int64_t s_last_sec_time = 0;

/* Syntree SEB Checksum calculation: (Byte 0 + ... + Byte 6) XOR 0xFF */
static inline uint8_t calc_seb_checksum(const uint8_t *data) {
    uint8_t sum = 0;
    for (int i = 0; i < 7; i++) {
        sum += data[i];
    }
    return sum ^ 0xFF;
}

/* Syntree SES Checksum: XOR Byte 0..6, XOR with 0xFF (with additive fallback) */
static inline uint8_t calc_ses_checksum_xor(const uint8_t *data) {
    uint8_t chk = 0;
    for (int i = 0; i < 7; i++) {
        chk ^= data[i];
    }
    return chk ^ 0xFF;
}

static inline uint8_t calc_ses_checksum_add(const uint8_t *data) {
    uint8_t sum = 0;
    for (int i = 0; i < 7; i++) {
        sum += data[i];
    }
    return sum ^ 0xFF;
}

static inline bool check_ses_checksum(const uint8_t *data) {
    return (calc_ses_checksum_xor(data) == data[7]) || (calc_ses_checksum_add(data) == data[7]);
}

static inline float decode_ses_angle(uint16_t raw) {
    // If raw > 20000, 3000 offset mode (Center 0° = 30000 = 0x7530, +/-700° = 23000..37000)
    // If raw <= 20000, -700 offset mode (Center 0° = 7000 = 0x1B58, +/-700° = 0..14000)
    if (raw > 20000) {
        return ((float)raw * 0.1f) - 3000.0f;
    } else {
        return ((float)raw * 0.1f) - 700.0f;
    }
}

void low_bus_decoder_init(void) {
    if (!s_mutex) {
        s_mutex = xSemaphoreCreateMutex();
    }
    memset(&s_telemetry, 0, sizeof(s_telemetry));
    memset(&s_plot_steer, 0, sizeof(s_plot_steer));
    memset(&s_plot_brake, 0, sizeof(s_plot_brake));
    memset(&s_plot_drive, 0, sizeof(s_plot_drive));

    s_telemetry.rail_volts_12v = 12.6f;
    s_telemetry.esp32_internal_temp_c = 42.5f;
    s_telemetry.ses_primary_fault_str = "NORMAL (0x00)";
    s_telemetry.seb_primary_fault_str = "NORMAL (0x00)";
    s_last_sec_time = esp_timer_get_time();

    int64_t now = esp_timer_get_time();
    for (int i = 0; i < NODE_COUNT; i++) {
        s_telemetry.nodes[i].last_seen_us = now;
        s_telemetry.nodes[i].rate_hz = 0.0f;
        s_telemetry.nodes[i].timeout = false;
    }
}

static inline void mark_node_seen(low_bus_node_t node) {
    s_telemetry.nodes[node].rx_count++;
    s_telemetry.nodes[node].last_seen_us = esp_timer_get_time();
    s_telemetry.nodes[node].timeout = false;
    s_telemetry.nodes[node].silent_ms = 0;
}

void low_bus_decoder_process_frame(const twai_message_t *frame) {
    if (!frame) return;

    if (xSemaphoreTake(s_mutex, pdMS_TO_TICKS(5)) != pdTRUE) return;

    s_frame_counter++;
    s_frames_in_sec++;
    s_telemetry.total_low_bus_frames = s_frame_counter;

    int64_t now = esp_timer_get_time();
    if ((now - s_last_sec_time) >= 1000000) {
        s_telemetry.bus_rate_hz = (float)s_frames_in_sec / ((now - s_last_sec_time) / 1000000.0f);
        s_frames_in_sec = 0;
        s_last_sec_time = now;
    }

    const uint8_t *d = frame->data;
    uint8_t dlc = frame->data_length_code;
    uint32_t id = frame->identifier;

    switch (id) {
        // ==============================================================
        // 1. SAFETY & SUPERVISOR DOMAIN
        // ==============================================================
        case 0x001: // SAFETY_ESTOP
            s_telemetry.estop_active = true;
            s_telemetry.estop_source_node = 1;
            break;

        case 0x011: // SYS_SAFETY_STS
            mark_node_seen(NODE_SYS);
            if (dlc >= 1) {
                s_telemetry.estop_pin_active = (d[0] != 0);
                if (d[0] != 0) {
                    s_telemetry.estop_active = true;
                    s_telemetry.estop_source_node = 1;
                }
            }
            break;

        // ==============================================================
        // 2. STEERING DOMAIN (Syntree SES V2.23)
        // ==============================================================
        case 0x169: // VCU_SES_REQ (Steering Command from Gateway, 20ms)
            mark_node_seen(NODE_RT);
            if (dlc >= 8) {
                // Byte 0: Control & Alignment Enable
                s_telemetry.ses_cmd_align_enable   = (d[0] & 0x01) != 0;
                s_telemetry.ses_cmd_control_enable = (d[0] & 0x02) != 0;

                // Bytes 1 & 2: Target Steering Angle (Motorola Big-Endian)
                uint16_t raw_ang = (uint16_t)((d[1] << 8) | d[2]);
                s_telemetry.steer_cmd_deg = decode_ses_angle(raw_ang);

                // Bytes 3 & 4: Target Angular Speed (Motorola Big-Endian, 1 deg/s per bit)
                uint16_t raw_spd = (uint16_t)((d[3] << 8) | d[4]);
                s_telemetry.steer_cmd_speed_deg_s = (float)raw_spd;

                // Byte 5: Alive Rolling Counter (Bits 4-7)
                s_telemetry.steer_cmd_roll_cnt = (d[5] >> 4) & 0x0F;

                // Byte 6: Commanded Vehicle Speed (0-255 km/h)
                s_telemetry.steer_cmd_veh_spd = d[6];

                // Byte 7: Checksum Validation
                s_telemetry.steer_cmd_chk_valid = check_ses_checksum(d);
            }
            break;

        case 0x201: // SES_STATUS (Steering Feedback from Actuator, 10ms)
            mark_node_seen(NODE_SES);
            if (dlc >= 8) {
                // Byte 0: Mode & Error Severity
                s_telemetry.ses_align_status        = (d[0] & 0x01) != 0;
                s_telemetry.ses_control_mode_status = (d[0] >> 1) & 0x03; // 0=Assist, 1=Angle, 2=Fault, 3=Takeover
                s_telemetry.ses_err_level           = (d[0] >> 6) & 0x03; // 0=None, 1=L1, 2=L2, 3=L3

                // Bytes 1 & 2: Actual Steering Angle Feedback (Motorola Big-Endian)
                uint16_t raw_ang = (uint16_t)((d[1] << 8) | d[2]);
                s_telemetry.steer_act_deg = decode_ses_angle(raw_ang);

                // Bytes 3 & 4: Actual Steering Velocity (Motorola Big-Endian, 0.5 deg/s per bit)
                uint16_t raw_spd = (uint16_t)((d[3] << 8) | d[4]);
                s_telemetry.steer_act_speed_deg_s = (float)raw_spd * 0.5f;

                // Byte 5: Driver Column Assist Torque (-12.0 to +12.0 Nm, res 0.1, offset -12.1)
                s_telemetry.steer_torque_nm = ((float)d[5] * 0.1f) - 12.1f;

                // Byte 6: Status Alive Rolling Counter
                s_telemetry.steer_feedback_roll_cnt = (d[6] >> 4) & 0x0F;

                // Byte 7: Checksum Validation
                s_telemetry.steer_feedback_chk_valid = check_ses_checksum(d);

                // Delta calculation
                s_telemetry.steer_delta_deg = fabsf(s_telemetry.steer_cmd_deg - s_telemetry.steer_act_deg);
            }
            break;

        case 0x202: // SES_ERR_INFO (Steering Detailed Fault Bitmap, 100ms)
            mark_node_seen(NODE_SES);
            if (dlc >= 4) {
                // Byte 0
                s_telemetry.ses_errors.ecu_undervolt       = (d[0] & 0x01) != 0;
                s_telemetry.ses_errors.ecu_overvolt        = (d[0] & 0x02) != 0;
                s_telemetry.ses_errors.can_com_err         = (d[0] & 0x04) != 0;
                s_telemetry.ses_errors.ecu_temp_err        = (d[0] & 0x08) != 0;
                s_telemetry.ses_errors.domain_drive_sc_err = (d[0] & 0x10) != 0;
                s_telemetry.ses_errors.domain_drive_v_err  = (d[0] & 0x20) != 0;
                s_telemetry.ses_errors.domain_drive_t_err  = (d[0] & 0x40) != 0;
                s_telemetry.ses_errors.temp_sensor_err     = (d[0] & 0x80) != 0;

                // Byte 1
                s_telemetry.ses_errors.angle_p_oc_err      = (d[1] & 0x01) != 0;
                s_telemetry.ses_errors.angle_p_af_err      = (d[1] & 0x02) != 0;
                s_telemetry.ses_errors.angle_s_oc_err      = (d[1] & 0x04) != 0;
                s_telemetry.ses_errors.angle_s_af_err      = (d[1] & 0x08) != 0;
                s_telemetry.ses_errors.sensor_pow_err      = (d[1] & 0x10) != 0;
                s_telemetry.ses_errors.alignment_err       = (d[1] & 0x20) != 0;
                s_telemetry.ses_errors.over_angle_err      = (d[1] & 0x40) != 0;
                s_telemetry.ses_errors.str_mtr_stall_err   = (d[1] & 0x80) != 0;

                // Byte 2
                s_telemetry.ses_errors.mtr_curt_err        = (d[2] & 0x01) != 0;
                s_telemetry.ses_errors.sensors_cl_err      = (d[2] & 0x02) != 0;
                s_telemetry.ses_errors.torq_t1_oc_err      = (d[2] & 0x04) != 0;
                s_telemetry.ses_errors.torq_t2_oc_err      = (d[2] & 0x08) != 0;
                s_telemetry.ses_errors.torq_t1_af_err      = (d[2] & 0x10) != 0;
                s_telemetry.ses_errors.torq_t2_af_err      = (d[2] & 0x20) != 0;
                s_telemetry.ses_errors.sent_angle_err      = (d[2] & 0x40) != 0;
                s_telemetry.ses_errors.str_mtr_idling_err  = (d[2] & 0x80) != 0;

                // Byte 3
                s_telemetry.ses_errors.eeprom_err          = (d[3] & 0x01) != 0;

                s_telemetry.ses_errors.raw_bitmap = (uint32_t)d[0] | ((uint32_t)d[1] << 8) |
                                                    ((uint32_t)d[2] << 16) | ((uint32_t)d[3] << 24);

                if (dlc >= 8) {
                    s_telemetry.ses_errors.veh_spd_echo = d[7];
                }

                // Priority human-readable fault triage string
                if (s_telemetry.ses_errors.domain_drive_sc_err) {
                    s_telemetry.ses_primary_fault_str = "CRITICAL: BRIDGE SHORT-CIRCUIT";
                } else if (s_telemetry.ses_errors.str_mtr_idling_err) {
                    s_telemetry.ses_primary_fault_str = "CRITICAL: GEAR DECOUPLED";
                } else if (s_telemetry.ses_errors.str_mtr_stall_err) {
                    s_telemetry.ses_primary_fault_str = "LEVEL 3: MOTOR STALL";
                } else if (s_telemetry.ses_errors.mtr_curt_err) {
                    s_telemetry.ses_primary_fault_str = "LEVEL 3: OVERCURRENT (>52A)";
                } else if (s_telemetry.ses_errors.angle_p_oc_err || s_telemetry.ses_errors.angle_s_oc_err) {
                    s_telemetry.ses_primary_fault_str = "LEVEL 3: ANGLE SENSOR CUT";
                } else if (s_telemetry.ses_errors.torq_t1_oc_err || s_telemetry.ses_errors.torq_t2_oc_err) {
                    s_telemetry.ses_primary_fault_str = "LEVEL 3: TORQUE SENSOR CUT";
                } else if (s_telemetry.ses_errors.ecu_temp_err || s_telemetry.ses_errors.domain_drive_t_err) {
                    s_telemetry.ses_primary_fault_str = "LEVEL 3: OVERTEMP (>105C)";
                } else if (s_telemetry.ses_control_mode_status == 3) {
                    s_telemetry.ses_primary_fault_str = "OVERRIDE: DRIVER TAKEOVER";
                } else if (s_telemetry.ses_errors.ecu_undervolt) {
                    s_telemetry.ses_primary_fault_str = "LEVEL 2: SUPPLY < 9.0V";
                } else if (s_telemetry.ses_errors.can_com_err) {
                    s_telemetry.ses_primary_fault_str = "LEVEL 1: CAN TIMEOUT >100ms";
                } else if (s_telemetry.ses_errors.raw_bitmap != 0) {
                    s_telemetry.ses_primary_fault_str = "FAULT PRESENT (SEE BITMAP)";
                } else {
                    s_telemetry.ses_primary_fault_str = "NORMAL (0x00)";
                }
            }
            break;

        // ==============================================================
        // 3. SYNTREE SEB BRAKE DOMAIN (CAN_SEB_CU_V3.0)
        // ==============================================================
        case 0x7B9: // VCU_SEB_Req (VCU Command to SEB, 20ms)
            mark_node_seen(NODE_SYS);
            if (dlc >= 8) {
                // Byte 0: Control bits
                s_telemetry.seb_cmd_align_enable     = (d[0] & 0x01) != 0;
                s_telemetry.seb_cmd_control_enable   = (d[0] & 0x02) != 0;
                s_telemetry.seb_cmd_control_mode     = (d[0] & 0x04) ? 1 : 0; // 0=Stroke, 1=Pressure
                s_telemetry.seb_cmd_autobrake_enable = (d[0] & 0x08) != 0;

                // Bytes 1..2: Target Stroke: Raw = (Stroke_mm + 30.0) / 0.05
                uint16_t raw_stroke = ((uint16_t)d[1] << 8) | d[2];
                s_telemetry.brake_cmd_stroke_mm = (float)raw_stroke * 0.05f - 30.0f;

                // Byte 3: Target Pressure: Raw = Pressure_MPa / 0.05
                s_telemetry.brake_cmd_mpa = (float)d[3] * 0.05f;
                s_telemetry.brake_cmd_kpa = s_telemetry.brake_cmd_mpa * 1000.0f;

                // Byte 6: Rolling counter
                s_telemetry.seb_cmd_roll_cnt = (d[6] >> 4) & 0x0F;

                // Byte 7: Checksum validation
                s_telemetry.seb_cmd_chk_valid = (calc_seb_checksum(d) == d[7]);
            }
            break;

        case 0x721: // SEB_Status (SEB Feedback to VCU, 10ms)
            mark_node_seen(NODE_SEB);
            if (dlc >= 8) {
                // Byte 0: Status bits
                s_telemetry.seb_align_status          = (d[0] & 0x01) != 0;
                s_telemetry.seb_control_enable_status = (d[0] & 0x02) != 0;
                s_telemetry.seb_control_mode_status   = (d[0] >> 2) & 0x03; // 0=Stroke, 1=Pressure, 2=Fault
                s_telemetry.seb_autobrake_status      = (d[0] & 0x10) != 0;
                s_telemetry.seb_err_level             = (d[0] >> 6) & 0x03; // 0=None, 1=L1, 2=L2, 3=L3 Critical

                // Bytes 1..2: Actual Stroke: Stroke_mm = (Raw * 0.05) - 30.0
                uint16_t raw_stroke = ((uint16_t)d[1] << 8) | d[2];
                s_telemetry.brake_act_stroke_mm = (float)raw_stroke * 0.05f - 30.0f;

                // Byte 3: Actual Pressure: Pressure_MPa = Raw * 0.05
                s_telemetry.brake_act_mpa = (float)d[3] * 0.05f;
                s_telemetry.brake_act_kpa = s_telemetry.brake_act_mpa * 1000.0f;

                // Bytes 4..5: Diagnostic Angle (testing only): Raw * 0.5 deg
                int16_t raw_ang = (int16_t)(((uint16_t)d[4] << 8) | d[5]);
                s_telemetry.seb_motor_angle_deg = (float)raw_ang * 0.5f;

                // Byte 6: Rolling counter
                s_telemetry.seb_feedback_roll_cnt = (d[6] >> 4) & 0x0F;

                // Byte 7: Checksum validation
                s_telemetry.seb_feedback_chk_valid = (calc_seb_checksum(d) == d[7]);

                // Deltas
                s_telemetry.brake_delta_kpa = fabsf(s_telemetry.brake_cmd_kpa - s_telemetry.brake_act_kpa);
                s_telemetry.brake_delta_stroke_mm = fabsf(s_telemetry.brake_cmd_stroke_mm - s_telemetry.brake_act_stroke_mm);
            }
            break;

        case 0x731: // SEB_ErrInfo (SEB Detailed Error Flags, 100ms)
            mark_node_seen(NODE_SEB);
            if (dlc >= 4) {
                // Byte 0
                s_telemetry.seb_errors.ecu_undervolt      = (d[0] & 0x01) != 0;
                s_telemetry.seb_errors.ecu_overvolt       = (d[0] & 0x02) != 0;
                s_telemetry.seb_errors.can_com_err        = (d[0] & 0x04) != 0;
                s_telemetry.seb_errors.ecu_temp_err       = (d[0] & 0x08) != 0;
                s_telemetry.seb_errors.bridge_sc_err      = (d[0] & 0x10) != 0;
                s_telemetry.seb_errors.driver_volt_err    = (d[0] & 0x20) != 0;
                s_telemetry.seb_errors.driver_temp_err    = (d[0] & 0x40) != 0;
                s_telemetry.seb_errors.angle_p_cut_err    = (d[0] & 0x80) != 0;

                // Byte 1
                s_telemetry.seb_errors.angle_p_freq_err   = (d[1] & 0x01) != 0;
                s_telemetry.seb_errors.angle_s_cut_err    = (d[1] & 0x02) != 0;
                s_telemetry.seb_errors.angle_s_freq_err   = (d[1] & 0x04) != 0;
                s_telemetry.seb_errors.no_pres_sensor_err = (d[1] & 0x08) != 0;
                s_telemetry.seb_errors.sensor_plaus_err   = (d[1] & 0x20) != 0;
                s_telemetry.seb_errors.alignment_err      = (d[1] & 0x40) != 0;
                s_telemetry.seb_errors.angle_over_err     = (d[1] & 0x80) != 0;

                // Byte 2
                s_telemetry.seb_errors.mtr_stall_err      = (d[2] & 0x02) != 0;
                s_telemetry.seb_errors.mtr_phase_dc_err   = (d[2] & 0x04) != 0;
                s_telemetry.seb_errors.oil_track_err      = (d[2] & 0x08) != 0;
                s_telemetry.seb_errors.init_oil_err       = (d[2] & 0x10) != 0;
                s_telemetry.seb_errors.sent_value_err     = (d[2] & 0x20) != 0;
                s_telemetry.seb_errors.mtr_no_load_err    = (d[2] & 0x40) != 0;

                // Byte 3
                s_telemetry.seb_errors.pres_sensor_over    = (d[3] & 0x01) != 0;
                s_telemetry.seb_errors.low_volt_charge_err = (d[3] & 0x02) != 0;

                s_telemetry.seb_errors.raw_bitmap = (uint32_t)d[0] | ((uint32_t)d[1] << 8) |
                                                    ((uint32_t)d[2] << 16) | ((uint32_t)d[3] << 24);

                // Priority human-readable fault triage string
                if (s_telemetry.seb_errors.no_pres_sensor_err) {
                    s_telemetry.seb_primary_fault_str = "CRITICAL: NO PRES SENSOR";
                } else if (s_telemetry.seb_errors.mtr_stall_err) {
                    s_telemetry.seb_primary_fault_str = "LEVEL 3: MOTOR STALL";
                } else if (s_telemetry.seb_errors.bridge_sc_err) {
                    s_telemetry.seb_primary_fault_str = "LEVEL 3: BRIDGE SHORT-CIRCUIT";
                } else if (s_telemetry.seb_errors.oil_track_err) {
                    s_telemetry.seb_primary_fault_str = "LEVEL 2: OIL TRACKING LAG";
                } else if (s_telemetry.seb_errors.ecu_undervolt) {
                    s_telemetry.seb_primary_fault_str = "LEVEL 2: SUPPLY < 9.0V";
                } else if (s_telemetry.seb_errors.raw_bitmap != 0) {
                    s_telemetry.seb_primary_fault_str = "FAULT PRESENT (SEE BITMAP)";
                } else {
                    s_telemetry.seb_primary_fault_str = "NORMAL (0x00)";
                }
            }
            break;

        case 0x6FA: // SES_Test (Steering Diagnostic Telemetry, 10ms)
            mark_node_seen(NODE_SES);
            if (dlc >= 7) {
                int16_t cur_raw = (int16_t)(((uint16_t)d[1] << 8) | d[2]);
                s_telemetry.ses_motor_current_a = (float)cur_raw * 0.0078125f;

                uint16_t temp_raw = ((uint16_t)d[3] << 8) | d[4];
                s_telemetry.ses_ecu_temp_c = (float)temp_raw * 0.5f;

                uint16_t volt_raw = ((uint16_t)d[5] << 8) | d[6];
                s_telemetry.ses_pow_volt_v = (float)volt_raw * 0.00390625f;
            }
            break;

        case 0x6FB: // SEB_Test (Diagnostic Telemetry, 10ms)
            mark_node_seen(NODE_SEB);
            if (dlc >= 6) {
                int16_t cur_raw = (int16_t)(((uint16_t)d[0] << 8) | d[1]);
                s_telemetry.seb_motor_current_a = (float)cur_raw * 0.0078125f;

                uint16_t temp_raw = ((uint16_t)d[2] << 8) | d[3];
                s_telemetry.seb_ecu_temp_c = (float)temp_raw * 0.5f;

                uint16_t volt_raw = ((uint16_t)d[4] << 8) | d[5];
                s_telemetry.seb_pow_volt_v = (float)volt_raw * 0.00390625f;
            }
            break;

        // ==============================================================
        // 4. POWERTRAIN DOMAIN (MTR)
        // ==============================================================
        case 0x204: // RT_DRIVE_CMD
            mark_node_seen(NODE_RT);
            if (dlc >= 4) {
                int32_t spd_mmps = (int32_t)((d[0] << 24) | (d[1] << 16) | (d[2] << 8) | d[3]);
                s_telemetry.drive_cmd_kmh = (float)spd_mmps * 0.0036f;
            }
            if (dlc >= 5) {
                s_telemetry.drive_cmd_gear = d[4];
            }
            break;

        case 0x120: // SYS_THROTTLE_STS
        case 0x206: // MTR_MOTOR_FBK
            mark_node_seen(NODE_MTR);
            if (id == 0x120 && dlc >= 2) {
                int16_t spd_mmps = (int16_t)((d[0] << 8) | d[1]);
                s_telemetry.drive_act_kmh = (float)spd_mmps * 0.0036f;
                s_telemetry.drive_motor_rpm = (uint16_t)(fabsf(s_telemetry.drive_act_kmh) * 110.0f);
                s_telemetry.drive_delta_kmh = fabsf(s_telemetry.drive_cmd_kmh - s_telemetry.drive_act_kmh);
            }
            if (id == 0x206 && dlc >= 3) {
                s_telemetry.drive_act_gear = d[2];
            }
            break;

        case 0x502: // MTR_NODE_STATUS
            mark_node_seen(NODE_MTR);
            if (dlc >= 3) {
                s_telemetry.drive_node_state = d[0] & 0x0F;
                s_telemetry.drive_block_mask = (uint16_t)((d[1] << 8) | d[2]);
            }
            break;

        case 0x210: // RT_STATE_RPT
            mark_node_seen(NODE_RT);
            if (dlc >= 2) {
                s_telemetry.estop_reason_code = (d[1] >> 4) & 0x0F;
            }
            break;

        default:
            break;
    }

    xSemaphoreGive(s_mutex);
}

void low_bus_decoder_tick_100ms(void) {
    if (xSemaphoreTake(s_mutex, pdMS_TO_TICKS(5)) != pdTRUE) return;

    int64_t now = esp_timer_get_time();

    // 1. Check node liveness watchdogs
    for (int i = 0; i < NODE_COUNT; i++) {
        int64_t elapsed_us = now - s_telemetry.nodes[i].last_seen_us;
        s_telemetry.nodes[i].silent_ms = (uint32_t)(elapsed_us / 1000);
        if (s_telemetry.nodes[i].silent_ms > 250) {
            s_telemetry.nodes[i].timeout = true;
        }
    }

    // 2. Feed 15s Steering Rolling Scope Buffer (0.1 deg res, aux = driver torque in 0.1 Nm)
    if (!s_plot_steer.is_paused) {
        uint16_t idx = s_plot_steer.head;
        s_plot_steer.cmd[idx] = (int16_t)(s_telemetry.steer_cmd_deg * 10.0f);
        s_plot_steer.act[idx] = (int16_t)(s_telemetry.steer_act_deg * 10.0f);
        s_plot_steer.aux[idx] = (int16_t)(s_telemetry.steer_torque_nm * 10.0f);
        s_plot_steer.head = (idx + 1) % PLOT_POINTS_15S;
    }

    // 3. Feed 15s Brake Rolling Scope Buffer (0.01 MPa / 10 kPa res, aux = stroke in 0.1 mm)
    if (!s_plot_brake.is_paused) {
        uint16_t idx = s_plot_brake.head;
        s_plot_brake.cmd[idx] = (int16_t)(s_telemetry.brake_cmd_mpa * 100.0f);
        s_plot_brake.act[idx] = (int16_t)(s_telemetry.brake_act_mpa * 100.0f);
        s_plot_brake.aux[idx] = (int16_t)(s_telemetry.brake_act_stroke_mm * 10.0f);
        s_plot_brake.head = (idx + 1) % PLOT_POINTS_15S;
    }

    // 4. Feed 15s Drive Rolling Scope Buffer (0.1 km/h res, aux = RPM / 10)
    if (!s_plot_drive.is_paused) {
        uint16_t idx = s_plot_drive.head;
        s_plot_drive.cmd[idx] = (int16_t)(s_telemetry.drive_cmd_kmh * 10.0f);
        s_plot_drive.act[idx] = (int16_t)(s_telemetry.drive_act_kmh * 10.0f);
        s_plot_drive.aux[idx] = (int16_t)(s_telemetry.drive_motor_rpm / 10);
        s_plot_drive.head = (idx + 1) % PLOT_POINTS_15S;
    }

    xSemaphoreGive(s_mutex);
}

void low_bus_decoder_get_telemetry(low_bus_telemetry_t *dest) {
    if (!dest) return;
    if (xSemaphoreTake(s_mutex, pdMS_TO_TICKS(10)) == pdTRUE) {
        memcpy(dest, &s_telemetry, sizeof(low_bus_telemetry_t));
        xSemaphoreGive(s_mutex);
    }
}

void low_bus_decoder_get_steer_plot(plot_buffer_15s_t *dest) {
    if (!dest) return;
    if (xSemaphoreTake(s_mutex, pdMS_TO_TICKS(10)) == pdTRUE) {
        memcpy(dest, &s_plot_steer, sizeof(plot_buffer_15s_t));
        xSemaphoreGive(s_mutex);
    }
}

void low_bus_decoder_get_brake_plot(plot_buffer_15s_t *dest) {
    if (!dest) return;
    if (xSemaphoreTake(s_mutex, pdMS_TO_TICKS(10)) == pdTRUE) {
        memcpy(dest, &s_plot_brake, sizeof(plot_buffer_15s_t));
        xSemaphoreGive(s_mutex);
    }
}

void low_bus_decoder_get_drive_plot(plot_buffer_15s_t *dest) {
    if (!dest) return;
    if (xSemaphoreTake(s_mutex, pdMS_TO_TICKS(10)) == pdTRUE) {
        memcpy(dest, &s_plot_drive, sizeof(plot_buffer_15s_t));
        xSemaphoreGive(s_mutex);
    }
}

void low_bus_decoder_toggle_pause_steer(void) {
    s_plot_steer.is_paused = !s_plot_steer.is_paused;
}

void low_bus_decoder_toggle_pause_brake(void) {
    s_plot_brake.is_paused = !s_plot_brake.is_paused;
}

void low_bus_decoder_toggle_pause_drive(void) {
    s_plot_drive.is_paused = !s_plot_drive.is_paused;
}
