/**
 * @file ui_manager.c
 * @brief High-Density Ground-Truth Telemetry UI for Waveshare 4.3B (SKU: 28141)
 *
 * Implements:
 * - 0. DASHBOARD: CAN Watch Cockpit with Gear Selector, ISO 2575 Telltales, Speedometer & Steer Dials, Brake Meters
 * - 1. STEER (SES): Dual digits + In-Box 5s Sparkline Plots + Zero Static Filler
 * - 2. BRAKE (SEB): Dual digits + In-Box 5s Sparkline Plots + Zero Static Filler
 * - 3. DRIVE (MTR): Dual digits + In-Box 5s Sparkline Plots + Zero Static Filler
 * - 4. BUS & NODES: Detailed CAN bus diagnostics, 12V rail, SD flight recorder
 * - 5-7. EXPANDED SCOPES: 15-second high-resolution full-screen plots
 */

#include "ui_manager.h"
#include <stdio.h>
#include <math.h>
#include "esp_log.h"

static const char *TAG = "UI_MANAGER";

extern const lv_font_t lv_font_montserrat_12;
extern const lv_font_t lv_font_montserrat_14;
extern const lv_font_t lv_font_montserrat_18;
extern const lv_font_t lv_font_montserrat_24;
extern const lv_font_t lv_font_montserrat_36;
extern const lv_font_t lv_font_montserrat_48;

static inspector_window_t s_current_win = WIN_DASHBOARD;
static lv_obj_t *s_screens[WIN_COUNT] = {NULL};

/* =========================================================================
 * Screen 0: CAN Watch Cockpit / Dashboard Widgets
 * ========================================================================= */
static lv_obj_t *s_lbl_dash_safety_state = NULL;
static lv_obj_t *s_card_dash_safety = NULL;
static lv_obj_t *s_lbl_dash_mode = NULL;
static lv_obj_t *s_card_dash_mode = NULL;
static lv_obj_t *s_btn_dash_gears[5] = {NULL};
static lv_obj_t *s_lbl_dash_gears[5] = {NULL};

// ISO 2575 Telltale cards & labels
static lv_obj_t *s_card_dash_telltales[5] = {NULL};
static lv_obj_t *s_lbl_dash_telltale_sym[5] = {NULL};
static lv_obj_t *s_lbl_dash_telltale_lbl[5] = {NULL};

// 3 Instruments
static lv_obj_t *s_lbl_dash_speed_val = NULL;
static lv_obj_t *s_lbl_dash_speed_cmd = NULL;
static lv_obj_t *s_lbl_dash_speed_aux = NULL;

static lv_obj_t *s_lbl_dash_steer_val = NULL;
static lv_obj_t *s_lbl_dash_steer_cmd = NULL;
static lv_obj_t *s_lbl_dash_steer_torq = NULL;

static lv_obj_t *s_lbl_dash_brake_val = NULL;
static lv_obj_t *s_bar_dash_brake_act = NULL;
static lv_obj_t *s_bar_dash_brake_cmd = NULL;
static lv_obj_t *s_lbl_dash_brake_aux = NULL;

static lv_obj_t *s_lbl_dash_bus_strip = NULL;

/* =========================================================================
 * Screen 1: Steering (SES) Widgets + In-Box 5s Mini-Plots
 * ========================================================================= */
static lv_obj_t *s_lbl_steer_cmd = NULL;
static lv_obj_t *s_chart_steer_5s_cmd = NULL;
static lv_chart_series_t *s_ser_steer_5s_cmd = NULL;
static lv_obj_t *s_lbl_steer_target_spd = NULL;
static lv_obj_t *s_lbl_steer_cmd_telemetry = NULL;

static lv_obj_t *s_lbl_steer_act = NULL;
static lv_obj_t *s_chart_steer_5s_act = NULL;
static lv_chart_series_t *s_ser_steer_5s_act = NULL;
static lv_obj_t *s_lbl_steer_actual_spd = NULL;
static lv_obj_t *s_lbl_steer_act_telemetry = NULL;

static lv_obj_t *s_card_steer_delta = NULL;
static lv_obj_t *s_lbl_steer_delta_val = NULL;
static lv_obj_t *s_card_steer_torque = NULL;
static lv_obj_t *s_lbl_steer_torq = NULL;
static lv_obj_t *s_lbl_steer_override = NULL;
static lv_obj_t *s_lbl_steer_dtc = NULL;

/* =========================================================================
 * Screen 2: Brake (SEB) Widgets + In-Box 5s Mini-Plots
 * ========================================================================= */
static lv_obj_t *s_lbl_brake_cmd = NULL;
static lv_obj_t *s_chart_brake_5s_cmd = NULL;
static lv_chart_series_t *s_ser_brake_5s_cmd = NULL;
static lv_obj_t *s_lbl_brake_target_stroke = NULL;

static lv_obj_t *s_lbl_brake_act = NULL;
static lv_obj_t *s_chart_brake_5s_act = NULL;
static lv_chart_series_t *s_ser_brake_5s_act = NULL;
static lv_obj_t *s_lbl_brake_act_stroke = NULL;
static lv_obj_t *s_lbl_brake_act_telemetry = NULL;

static lv_obj_t *s_card_brake_delta = NULL;
static lv_obj_t *s_lbl_brake_delta_val = NULL;
static lv_obj_t *s_lbl_brake_dtc = NULL;

/* =========================================================================
 * Screen 3: Drive (MTR) Widgets + In-Box 5s Mini-Plots
 * ========================================================================= */
static lv_obj_t *s_lbl_drive_cmd = NULL;
static lv_obj_t *s_chart_drive_5s_cmd = NULL;
static lv_chart_series_t *s_ser_drive_5s_cmd = NULL;
static lv_obj_t *s_lbl_drive_target_gear = NULL;

static lv_obj_t *s_lbl_drive_act = NULL;
static lv_obj_t *s_chart_drive_5s_act = NULL;
static lv_chart_series_t *s_ser_drive_5s_act = NULL;
static lv_obj_t *s_lbl_drive_act_gear = NULL;
static lv_obj_t *s_lbl_drive_motor_telemetry = NULL;

static lv_obj_t *s_card_drive_delta = NULL;
static lv_obj_t *s_lbl_drive_delta_val = NULL;
static lv_obj_t *s_lbl_drive_dtc = NULL;

/* =========================================================================
 * Screen 4: Detailed Bus & Safety Diagnostics
 * ========================================================================= */
static lv_obj_t *s_lbl_bus_estop_status = NULL;
static lv_obj_t *s_lbl_bus_estop_origin = NULL;
static lv_obj_t *s_lbl_bus_rail_volts = NULL;
static lv_obj_t *s_lbl_bus_rate = NULL;
static lv_obj_t *s_lbl_bus_tec_rec = NULL;
static lv_obj_t *s_lbl_bus_node_rates[5] = {NULL};
static lv_obj_t *s_lbl_bus_node_states[5] = {NULL};

/* =========================================================================
 * Screens 5, 6, 7: Expanded 15-Second Scope Plots
 * ========================================================================= */
static lv_chart_series_t *s_ser_steer_15s_cmd = NULL;
static lv_chart_series_t *s_ser_steer_15s_act = NULL;
static lv_obj_t *s_lbl_steer_15s_hdr = NULL;
static lv_obj_t *s_chart_steer_15s = NULL;

static lv_chart_series_t *s_ser_brake_15s_cmd = NULL;
static lv_chart_series_t *s_ser_brake_15s_act = NULL;
static lv_obj_t *s_lbl_brake_15s_hdr = NULL;
static lv_obj_t *s_chart_brake_15s = NULL;

static lv_chart_series_t *s_ser_drive_15s_cmd = NULL;
static lv_chart_series_t *s_ser_drive_15s_act = NULL;
static lv_obj_t *s_lbl_drive_15s_hdr = NULL;
static lv_obj_t *s_chart_drive_15s = NULL;

static bool s_scope_paused = false;

/* =========================================================================
 * Navigation Event Handlers
 * ========================================================================= */
static void btn_nav_event_cb(lv_event_t *e) {
    intptr_t target_win = (intptr_t)lv_event_get_user_data(e);
    ui_manager_switch_window((inspector_window_t)target_win);
}

static void btn_pause_event_cb(lv_event_t *e) {
    s_scope_paused = !s_scope_paused;
    lv_obj_t *btn = lv_event_get_target(e);
    lv_obj_t *lbl = lv_obj_get_child(btn, 0);
    if (lbl) {
        lv_label_set_text(lbl, s_scope_paused ? "> RESUME" : "|| FREEZE");
    }
}

/**
 * @brief Construct top persistent 5-tab navigation bar for Waveshare 800x480.
 */
static void create_top_nav_bar(lv_obj_t *parent, inspector_window_t active_tab) {
    lv_obj_t *bar = lv_obj_create(parent);
    lv_obj_set_size(bar, 800, 48);
    lv_obj_align(bar, LV_ALIGN_TOP_MID, 0, 0);
    lv_obj_set_style_bg_color(bar, lv_color_hex(UI_COLOR_BG), 0);
    lv_obj_set_style_border_color(bar, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_border_width(bar, 1, 0);
    lv_obj_set_style_border_side(bar, LV_BORDER_SIDE_BOTTOM, 0);
    lv_obj_set_style_radius(bar, 0, 0);
    lv_obj_set_style_pad_all(bar, 2, 0);
    lv_obj_remove_flag(bar, LV_OBJ_FLAG_SCROLLABLE);

    const char *labels[5] = {
        "0. DASHBOARD", "1. STEER (SES)", "2. BRAKE (SEB)", "3. DRIVE (MTR)", "4. BUS & NODES"
    };
    inspector_window_t targets[5] = {
        WIN_DASHBOARD, WIN_STEER, WIN_BRAKE, WIN_DRIVE, WIN_BUS_SAFETY
    };

    const int tab_w = 152;
    const int tab_h = 42;

    for (int i = 0; i < 5; i++) {
        lv_obj_t *btn = lv_button_create(bar);
        lv_obj_set_size(btn, tab_w, tab_h);
        lv_obj_align(btn, LV_ALIGN_LEFT_MID, 4 + i * (tab_w + 6), 0);

        bool is_active = (targets[i] == active_tab);

        lv_obj_set_style_bg_color(btn, lv_color_hex(is_active ? UI_COLOR_SURFACE_ALT : UI_COLOR_SURFACE), 0);
        lv_obj_set_style_border_color(btn, lv_color_hex(is_active ? UI_COLOR_BORDER_ACTIVE : UI_COLOR_BORDER), 0);
        lv_obj_set_style_border_width(btn, is_active ? 2 : 1, 0);
        lv_obj_set_style_radius(btn, 6, 0);
        lv_obj_set_style_pad_all(btn, 0, 0);

        lv_obj_t *lbl = lv_label_create(btn);
        lv_label_set_text(lbl, labels[i]);
        lv_obj_set_style_text_font(lbl, &lv_font_montserrat_12, 0);
        lv_obj_align(lbl, LV_ALIGN_CENTER, 0, 0);
        lv_obj_set_style_text_color(lbl, lv_color_hex(is_active ? UI_COLOR_BORDER_ACTIVE : UI_COLOR_TEXT_SECONDARY), 0);

        lv_obj_add_event_cb(btn, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)targets[i]);
    }
}

/**
 * @brief Helper to create in-box sparkline mini-chart
 */
static lv_obj_t *create_inbox_sparkline(lv_obj_t *parent, int w, int h, int y, int32_t y_min, int32_t y_max) {
    lv_obj_t *chart = lv_chart_create(parent);
    lv_obj_set_size(chart, w, h);
    lv_obj_align(chart, LV_ALIGN_TOP_MID, 0, y);
    lv_chart_set_type(chart, LV_CHART_TYPE_LINE);
    lv_chart_set_point_count(chart, PLOT_POINTS_5S);
    lv_chart_set_update_mode(chart, LV_CHART_UPDATE_MODE_SHIFT);
    lv_chart_set_range(chart, LV_CHART_AXIS_PRIMARY_Y, y_min, y_max);
    lv_obj_set_style_bg_color(chart, lv_color_hex(0x080808), 0);
    lv_obj_set_style_border_color(chart, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_border_width(chart, 1, 0);
    lv_obj_set_style_radius(chart, 6, 0);
    lv_obj_set_style_size(chart, 0, LV_PART_INDICATOR); // no dots for smooth line
    lv_obj_set_style_line_width(chart, 2, LV_PART_ITEMS);
    lv_obj_set_style_pad_all(chart, 2, 0);
    return chart;
}

void ui_manager_init(void) {
    // =========================================================================
    // Window 0: 0. DASHBOARD (CAN Watch Sidebar Cockpit Format)
    // =========================================================================
    s_screens[WIN_DASHBOARD] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_DASHBOARD], lv_color_hex(UI_COLOR_BG), 0);
    create_top_nav_bar(s_screens[WIN_DASHBOARD], WIN_DASHBOARD);

    // 1. State & Mode Strip (Y=52, H=42)
    lv_obj_t *c_dstate = lv_obj_create(s_screens[WIN_DASHBOARD]);
    lv_obj_set_size(c_dstate, 784, 42);
    lv_obj_align(c_dstate, LV_ALIGN_TOP_MID, 0, 52);
    lv_obj_set_style_bg_color(c_dstate, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_dstate, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_dstate, 6, 0);
    lv_obj_set_style_pad_all(c_dstate, 4, 0);

    lv_obj_t *lbl_cs_t = lv_label_create(c_dstate);
    lv_label_set_text(lbl_cs_t, "COCKPIT STATE:");
    lv_obj_set_style_text_font(lbl_cs_t, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_cs_t, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_cs_t, LV_ALIGN_LEFT_MID, 6, 0);

    s_card_dash_safety = lv_obj_create(c_dstate);
    lv_obj_set_size(s_card_dash_safety, 100, 26);
    lv_obj_align(s_card_dash_safety, LV_ALIGN_LEFT_MID, 115, 0);
    lv_obj_set_style_bg_color(s_card_dash_safety, lv_color_hex(0x062817), 0);
    lv_obj_set_style_border_color(s_card_dash_safety, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_set_style_radius(s_card_dash_safety, 13, 0);
    lv_obj_set_style_pad_all(s_card_dash_safety, 0, 0);
    s_lbl_dash_safety_state = lv_label_create(s_card_dash_safety);
    lv_label_set_text(s_lbl_dash_safety_state, "SAFETY OK");
    lv_obj_set_style_text_font(s_lbl_dash_safety_state, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_safety_state, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_dash_safety_state, LV_ALIGN_CENTER, 0, 0);

    lv_obj_t *lbl_m_t = lv_label_create(c_dstate);
    lv_label_set_text(lbl_m_t, "MODE:");
    lv_obj_set_style_text_font(lbl_m_t, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_m_t, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_m_t, LV_ALIGN_LEFT_MID, 225, 0);

    s_card_dash_mode = lv_obj_create(c_dstate);
    lv_obj_set_size(s_card_dash_mode, 120, 26);
    lv_obj_align(s_card_dash_mode, LV_ALIGN_LEFT_MID, 275, 0);
    lv_obj_set_style_bg_color(s_card_dash_mode, lv_color_hex(0x121A24), 0);
    lv_obj_set_style_border_color(s_card_dash_mode, lv_color_hex(0x1E3A50), 0);
    lv_obj_set_style_radius(s_card_dash_mode, 6, 0);
    lv_obj_set_style_pad_all(s_card_dash_mode, 0, 0);
    s_lbl_dash_mode = lv_label_create(s_card_dash_mode);
    lv_label_set_text(s_lbl_dash_mode, "AUTONOMOUS");
    lv_obj_set_style_text_font(s_lbl_dash_mode, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_mode, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(s_lbl_dash_mode, LV_ALIGN_CENTER, 0, 0);

    lv_obj_t *lbl_g_t = lv_label_create(c_dstate);
    lv_label_set_text(lbl_g_t, "GEAR:");
    lv_obj_set_style_text_font(lbl_g_t, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_g_t, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_g_t, LV_ALIGN_LEFT_MID, 410, 0);

    const char *gear_names[5] = {"P", "R", "N", "D", "S"};
    for (int g = 0; g < 5; g++) {
        s_btn_dash_gears[g] = lv_obj_create(c_dstate);
        lv_obj_set_size(s_btn_dash_gears[g], 26, 26);
        lv_obj_align(s_btn_dash_gears[g], LV_ALIGN_LEFT_MID, 460 + g * 32, 0);
        bool is_d = (g == 3);
        lv_obj_set_style_bg_color(s_btn_dash_gears[g], lv_color_hex(is_d ? UI_COLOR_ACCENT_CMD : 0x121212), 0);
        lv_obj_set_style_border_color(s_btn_dash_gears[g], lv_color_hex(UI_COLOR_BORDER), 0);
        lv_obj_set_style_radius(s_btn_dash_gears[g], 4, 0);
        lv_obj_set_style_pad_all(s_btn_dash_gears[g], 0, 0);

        s_lbl_dash_gears[g] = lv_label_create(s_btn_dash_gears[g]);
        lv_label_set_text(s_lbl_dash_gears[g], gear_names[g]);
        lv_obj_set_style_text_font(s_lbl_dash_gears[g], &lv_font_montserrat_12, 0);
        lv_obj_set_style_text_color(s_lbl_dash_gears[g], lv_color_hex(is_d ? 0x000000 : UI_COLOR_TEXT_SECONDARY), 0);
        lv_obj_align(s_lbl_dash_gears[g], LV_ALIGN_CENTER, 0, 0);
    }

    lv_obj_t *lbl_lbm = lv_label_create(c_dstate);
    lv_label_set_text(lbl_lbm, "LOW-BUS (500 kbps)");
    lv_obj_set_style_text_font(lbl_lbm, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_lbm, lv_color_hex(UI_COLOR_STATE_OFFLINE), 0);
    lv_obj_align(lbl_lbm, LV_ALIGN_RIGHT_MID, -8, 0);

    // 2. ISO 2575 Telltales Deck (Y=98, H=46)
    lv_obj_t *c_dtell = lv_obj_create(s_screens[WIN_DASHBOARD]);
    lv_obj_set_size(c_dtell, 784, 46);
    lv_obj_align(c_dtell, LV_ALIGN_TOP_MID, 0, 98);
    lv_obj_set_style_bg_color(c_dtell, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_dtell, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_dtell, 6, 0);
    lv_obj_set_style_pad_all(c_dtell, 4, 0);

    const char *t_syms[5] = {"<", ">", "!", "*", "STOP"};
    const char *t_lbls[5] = {"LEFT", "RGHT", "HAZD", "BEAM", "BRK"};
    const int tt_w = 146;
    for (int t = 0; t < 5; t++) {
        s_card_dash_telltales[t] = lv_obj_create(c_dtell);
        lv_obj_set_size(s_card_dash_telltales[t], tt_w, 34);
        lv_obj_align(s_card_dash_telltales[t], LV_ALIGN_LEFT_MID, 8 + t * (tt_w + 8), 0);
        bool act_on = (t >= 3); // beam & brake on by default in mock
        lv_obj_set_style_bg_color(s_card_dash_telltales[t], lv_color_hex(act_on ? 0x0C2218 : 0x121212), 0);
        lv_obj_set_style_border_color(s_card_dash_telltales[t], lv_color_hex(act_on ? UI_COLOR_STATE_OK : UI_COLOR_BORDER), 0);
        lv_obj_set_style_radius(s_card_dash_telltales[t], 6, 0);
        lv_obj_set_style_pad_all(s_card_dash_telltales[t], 0, 0);

        s_lbl_dash_telltale_sym[t] = lv_label_create(s_card_dash_telltales[t]);
        lv_label_set_text(s_lbl_dash_telltale_sym[t], t_syms[t]);
        lv_obj_set_style_text_font(s_lbl_dash_telltale_sym[t], &lv_font_montserrat_14, 0);
        lv_obj_set_style_text_color(s_lbl_dash_telltale_sym[t], lv_color_hex(act_on ? UI_COLOR_STATE_OK : UI_COLOR_TEXT_SECONDARY), 0);
        lv_obj_align(s_lbl_dash_telltale_sym[t], LV_ALIGN_LEFT_MID, 12, 0);

        s_lbl_dash_telltale_lbl[t] = lv_label_create(s_card_dash_telltales[t]);
        lv_label_set_text(s_lbl_dash_telltale_lbl[t], t_lbls[t]);
        lv_obj_set_style_text_font(s_lbl_dash_telltale_lbl[t], &lv_font_montserrat_12, 0);
        lv_obj_set_style_text_color(s_lbl_dash_telltale_lbl[t], lv_color_hex(act_on ? UI_COLOR_STATE_OK : UI_COLOR_TEXT_SECONDARY), 0);
        lv_obj_align(s_lbl_dash_telltale_lbl[t], LV_ALIGN_CENTER, 4, 0);

        lv_obj_t *lbl_st = lv_label_create(s_card_dash_telltales[t]);
        lv_label_set_text(lbl_st, act_on ? "ACT" : "OFF");
        lv_obj_set_style_text_font(lbl_st, &lv_font_montserrat_12, 0);
        lv_obj_set_style_text_color(lbl_st, lv_color_hex(act_on ? UI_COLOR_STATE_OK : UI_COLOR_TEXT_SECONDARY), 0);
        lv_obj_align(lbl_st, LV_ALIGN_RIGHT_MID, -8, 0);
    }

    // 3. Cockpit 3-Instrument Deck (Y=148, H=266)
    const int inst_w = 254;
    const int inst_h = 266;
    const int inst_y = 148;

    // --- Column 1: Speedometer ---
    lv_obj_t *c_dspd = lv_obj_create(s_screens[WIN_DASHBOARD]);
    lv_obj_set_size(c_dspd, inst_w, inst_h);
    lv_obj_align(c_dspd, LV_ALIGN_TOP_LEFT, 8, inst_y);
    lv_obj_set_style_bg_color(c_dspd, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_dspd, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_dspd, 8, 0);
    lv_obj_add_event_cb(c_dspd, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_DRIVE);

    lv_obj_t *lbl_spt = lv_label_create(c_dspd);
    lv_label_set_text(lbl_spt, "SPEEDOMETER (0-50)");
    lv_obj_set_style_text_font(lbl_spt, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_spt, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(lbl_spt, LV_ALIGN_TOP_LEFT, 0, 0);

    s_lbl_dash_speed_val = lv_label_create(c_dspd);
    lv_label_set_text(s_lbl_dash_speed_val, "14.8");
    lv_obj_set_style_text_font(s_lbl_dash_speed_val, &lv_font_montserrat_48, 0);
    lv_obj_set_style_text_color(s_lbl_dash_speed_val, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_dash_speed_val, LV_ALIGN_CENTER, 0, -32);

    lv_obj_t *lbl_spu = lv_label_create(c_dspd);
    lv_label_set_text(lbl_spu, "km/h");
    lv_obj_set_style_text_font(lbl_spu, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_spu, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_spu, LV_ALIGN_CENTER, 0, 6);

    lv_obj_t *box_sp_cmd = lv_obj_create(c_dspd);
    lv_obj_set_size(box_sp_cmd, 226, 32);
    lv_obj_align(box_sp_cmd, LV_ALIGN_CENTER, 0, 42);
    lv_obj_set_style_bg_color(box_sp_cmd, lv_color_hex(0x121A24), 0);
    lv_obj_set_style_border_color(box_sp_cmd, lv_color_hex(0x1E3A50), 0);
    lv_obj_set_style_radius(box_sp_cmd, 4, 0);
    lv_obj_set_style_pad_all(box_sp_cmd, 0, 0);

    s_lbl_dash_speed_cmd = lv_label_create(box_sp_cmd);
    lv_label_set_text(s_lbl_dash_speed_cmd, "CMD: 15.0 km/h [Δ: 0.2]");
    lv_obj_set_style_text_font(s_lbl_dash_speed_cmd, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_speed_cmd, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(s_lbl_dash_speed_cmd, LV_ALIGN_CENTER, 0, 0);

    s_lbl_dash_speed_aux = lv_label_create(c_dspd);
    lv_label_set_text(s_lbl_dash_speed_aux, "MOTOR: 1,620 RPM • RATIO 8.5:1");
    lv_obj_set_style_text_font(s_lbl_dash_speed_aux, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_speed_aux, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_dash_speed_aux, LV_ALIGN_BOTTOM_MID, 0, 0);

    // --- Column 2: Steering Angle ---
    lv_obj_t *c_dsteer = lv_obj_create(s_screens[WIN_DASHBOARD]);
    lv_obj_set_size(c_dsteer, inst_w, inst_h);
    lv_obj_align(c_dsteer, LV_ALIGN_TOP_LEFT, 273, inst_y);
    lv_obj_set_style_bg_color(c_dsteer, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_dsteer, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_dsteer, 8, 0);
    lv_obj_add_event_cb(c_dsteer, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_STEER);

    lv_obj_t *lbl_stt = lv_label_create(c_dsteer);
    lv_label_set_text(lbl_stt, "STEERING ANGLE (±45°)");
    lv_obj_set_style_text_font(lbl_stt, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_stt, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(lbl_stt, LV_ALIGN_TOP_LEFT, 0, 0);

    s_lbl_dash_steer_val = lv_label_create(c_dsteer);
    lv_label_set_text(s_lbl_dash_steer_val, "+14.7°");
    lv_obj_set_style_text_font(s_lbl_dash_steer_val, &lv_font_montserrat_48, 0);
    lv_obj_set_style_text_color(s_lbl_dash_steer_val, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_dash_steer_val, LV_ALIGN_CENTER, 0, -32);

    lv_obj_t *lbl_stu = lv_label_create(c_dsteer);
    lv_label_set_text(lbl_stu, "ACTUAL ANGLE");
    lv_obj_set_style_text_font(lbl_stu, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_stu, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_stu, LV_ALIGN_CENTER, 0, 6);

    lv_obj_t *box_st_cmd = lv_obj_create(c_dsteer);
    lv_obj_set_size(box_st_cmd, 226, 32);
    lv_obj_align(box_st_cmd, LV_ALIGN_CENTER, 0, 42);
    lv_obj_set_style_bg_color(box_st_cmd, lv_color_hex(0x121A24), 0);
    lv_obj_set_style_border_color(box_st_cmd, lv_color_hex(0x1E3A50), 0);
    lv_obj_set_style_radius(box_st_cmd, 4, 0);
    lv_obj_set_style_pad_all(box_st_cmd, 0, 0);

    s_lbl_dash_steer_cmd = lv_label_create(box_st_cmd);
    lv_label_set_text(s_lbl_dash_steer_cmd, "CMD: +15.0° [Δ: 0.3° OK]");
    lv_obj_set_style_text_font(s_lbl_dash_steer_cmd, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_steer_cmd, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(s_lbl_dash_steer_cmd, LV_ALIGN_CENTER, 0, 0);

    s_lbl_dash_steer_torq = lv_label_create(c_dsteer);
    lv_label_set_text(s_lbl_dash_steer_torq, "TORQUE: +0.2 Nm [NO OVERRIDE]");
    lv_obj_set_style_text_font(s_lbl_dash_steer_torq, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_steer_torq, lv_color_hex(UI_COLOR_STATE_WARN), 0);
    lv_obj_align(s_lbl_dash_steer_torq, LV_ALIGN_BOTTOM_MID, 0, 0);

    // --- Column 3: Hydraulic Brake ---
    lv_obj_t *c_dbrk = lv_obj_create(s_screens[WIN_DASHBOARD]);
    lv_obj_set_size(c_dbrk, inst_w, inst_h);
    lv_obj_align(c_dbrk, LV_ALIGN_TOP_LEFT, 538, inst_y);
    lv_obj_set_style_bg_color(c_dbrk, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_dbrk, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_dbrk, 8, 0);
    lv_obj_add_event_cb(c_dbrk, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_BRAKE);

    lv_obj_t *lbl_brt = lv_label_create(c_dbrk);
    lv_label_set_text(lbl_brt, "HYDRAULIC BRAKE (0-1500)");
    lv_obj_set_style_text_font(lbl_brt, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_brt, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(lbl_brt, LV_ALIGN_TOP_LEFT, 0, 0);

    s_lbl_dash_brake_val = lv_label_create(c_dbrk);
    lv_label_set_text(s_lbl_dash_brake_val, "442 kPa");
    lv_obj_set_style_text_font(s_lbl_dash_brake_val, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(s_lbl_dash_brake_val, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_dash_brake_val, LV_ALIGN_TOP_MID, 0, 36);

    // Dual Progress Bars
    lv_obj_t *lbl_bf = lv_label_create(c_dbrk);
    lv_label_set_text(lbl_bf, "FEEDBACK");
    lv_obj_set_style_text_font(lbl_bf, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_bf, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_bf, LV_ALIGN_TOP_LEFT, 0, 84);

    s_bar_dash_brake_act = lv_bar_create(c_dbrk);
    lv_obj_set_size(s_bar_dash_brake_act, 226, 12);
    lv_obj_align(s_bar_dash_brake_act, LV_ALIGN_TOP_MID, 0, 102);
    lv_bar_set_range(s_bar_dash_brake_act, 0, 1500);
    lv_bar_set_value(s_bar_dash_brake_act, 442, LV_ANIM_OFF);
    lv_obj_set_style_bg_color(s_bar_dash_brake_act, lv_color_hex(0x141414), 0);
    lv_obj_set_style_bg_color(s_bar_dash_brake_act, lv_color_hex(UI_COLOR_STATE_OK), LV_PART_INDICATOR);

    lv_obj_t *lbl_bc = lv_label_create(c_dbrk);
    lv_label_set_text(lbl_bc, "COMMAND");
    lv_obj_set_style_text_font(lbl_bc, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_bc, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(lbl_bc, LV_ALIGN_TOP_LEFT, 0, 122);

    s_bar_dash_brake_cmd = lv_bar_create(c_dbrk);
    lv_obj_set_size(s_bar_dash_brake_cmd, 226, 10);
    lv_obj_align(s_bar_dash_brake_cmd, LV_ALIGN_TOP_MID, 0, 138);
    lv_bar_set_range(s_bar_dash_brake_cmd, 0, 1500);
    lv_bar_set_value(s_bar_dash_brake_cmd, 450, LV_ANIM_OFF);
    lv_obj_set_style_bg_color(s_bar_dash_brake_cmd, lv_color_hex(0x141414), 0);
    lv_obj_set_style_bg_color(s_bar_dash_brake_cmd, lv_color_hex(UI_COLOR_ACCENT_CMD), LV_PART_INDICATOR);

    s_lbl_dash_brake_aux = lv_label_create(c_dbrk);
    lv_label_set_text(s_lbl_dash_brake_aux, "STROKE: 17.8 mm  •  TEMP: 38°C");
    lv_obj_set_style_text_font(s_lbl_dash_brake_aux, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_brake_aux, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_dash_brake_aux, LV_ALIGN_TOP_MID, 0, 164);

    lv_obj_t *lbl_b_stat = lv_label_create(c_dbrk);
    lv_label_set_text(lbl_b_stat, "[ OK ] SEB CLOSED-LOOP HEALTHY");
    lv_obj_set_style_text_font(lbl_b_stat, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b_stat, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_b_stat, LV_ALIGN_BOTTOM_MID, 0, 0);

    // 4. Bottom Bus Diagnostics Strip (Y=422, H=48)
    lv_obj_t *c_dbus = lv_obj_create(s_screens[WIN_DASHBOARD]);
    lv_obj_set_size(c_dbus, 784, 48);
    lv_obj_align(c_dbus, LV_ALIGN_TOP_MID, 0, 422);
    lv_obj_set_style_bg_color(c_dbus, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_dbus, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_dbus, 6, 0);
    lv_obj_set_style_pad_all(c_dbus, 0, 0);

    s_lbl_dash_bus_strip = lv_label_create(c_dbus);
    lv_label_set_text(s_lbl_dash_bus_strip, "LOW-BUS CAN: 420 msg/s  •  TEC: 0 | REC: 0 [BUS OK]  •  12V Rail: 13.8V  •  Core: 41°C");
    lv_obj_set_style_text_font(s_lbl_dash_bus_strip, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_bus_strip, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
    lv_obj_align(s_lbl_dash_bus_strip, LV_ALIGN_CENTER, 0, 0);

    // =========================================================================
    // Window 1: 1. STEER (SES) - Full Height 352px Cards + In-Box 5s Plots
    // =========================================================================
    s_screens[WIN_STEER] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_STEER], lv_color_hex(UI_COLOR_BG), 0);
    create_top_nav_bar(s_screens[WIN_STEER], WIN_STEER);

    const int act_w = 254;
    const int u_h = 352;
    const int u_y = 54;

    // Card 1: Command (VCU 0x169)
    lv_obj_t *c_scmd = lv_obj_create(s_screens[WIN_STEER]);
    lv_obj_set_size(c_scmd, act_w, u_h);
    lv_obj_align(c_scmd, LV_ALIGN_TOP_LEFT, 8, u_y);
    lv_obj_set_style_bg_color(c_scmd, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_scmd, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_scmd, 8, 0);

    lv_obj_t *lbl_sc1 = lv_label_create(c_scmd);
    lv_label_set_text(lbl_sc1, "COMMAND (VCU 0x169)");
    lv_obj_set_style_text_font(lbl_sc1, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_sc1, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_sc1, LV_ALIGN_TOP_LEFT, 0, 0);

    s_lbl_steer_cmd = lv_label_create(c_scmd);
    lv_label_set_text(s_lbl_steer_cmd, "+15.0°");
    lv_obj_set_style_text_font(s_lbl_steer_cmd, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(s_lbl_steer_cmd, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(s_lbl_steer_cmd, LV_ALIGN_TOP_MID, 0, 24);

    // In-Box 5s Mini-Plot under value
    s_chart_steer_5s_cmd = create_inbox_sparkline(c_scmd, 226, 86, 74, -45, 45);
    s_ser_steer_5s_cmd = lv_chart_add_series(s_chart_steer_5s_cmd, lv_color_hex(UI_COLOR_ACCENT_CMD), LV_CHART_AXIS_PRIMARY_Y);

    lv_obj_t *box_s_spd = lv_obj_create(c_scmd);
    lv_obj_set_size(box_s_spd, 226, 32);
    lv_obj_align(box_s_spd, LV_ALIGN_TOP_MID, 0, 168);
    lv_obj_set_style_bg_color(box_s_spd, lv_color_hex(0x121A24), 0);
    lv_obj_set_style_border_color(box_s_spd, lv_color_hex(0x1E3A50), 0);
    lv_obj_set_style_radius(box_s_spd, 6, 0);
    lv_obj_set_style_pad_all(box_s_spd, 0, 0);
    s_lbl_steer_target_spd = lv_label_create(box_s_spd);
    lv_label_set_text(s_lbl_steer_target_spd, "TARGET SPEED: 200 °/s");
    lv_obj_set_style_text_font(s_lbl_steer_target_spd, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_target_spd, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_steer_target_spd, LV_ALIGN_CENTER, 0, 0);

    s_lbl_steer_cmd_telemetry = lv_label_create(c_scmd);
    lv_label_set_text(s_lbl_steer_cmd_telemetry, "ROLLING CNT: 7  •  CHK: VALID");
    lv_obj_set_style_text_font(s_lbl_steer_cmd_telemetry, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_cmd_telemetry, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_steer_cmd_telemetry, LV_ALIGN_TOP_LEFT, 0, 212);

    lv_obj_t *lbl_s_id = lv_label_create(c_scmd);
    lv_label_set_text(lbl_s_id, "CAN ID: 0x169 (20ms / 50 Hz)");
    lv_obj_set_style_text_font(lbl_s_id, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_s_id, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_s_id, LV_ALIGN_TOP_LEFT, 0, 236);

    lv_obj_t *lbl_s_stat1 = lv_label_create(c_scmd);
    lv_label_set_text(lbl_s_stat1, "[ OK ] TARGET STREAM ACTIVE");
    lv_obj_set_style_text_font(lbl_s_stat1, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_s_stat1, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_s_stat1, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Card 2: Actuation (SES 0x201)
    lv_obj_t *c_sact = lv_obj_create(s_screens[WIN_STEER]);
    lv_obj_set_size(c_sact, act_w, u_h);
    lv_obj_align(c_sact, LV_ALIGN_TOP_LEFT, 273, u_y);
    lv_obj_set_style_bg_color(c_sact, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_sact, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_sact, 8, 0);

    lv_obj_t *lbl_sa1 = lv_label_create(c_sact);
    lv_label_set_text(lbl_sa1, "ACTUATION (SES 0x201)");
    lv_obj_set_style_text_font(lbl_sa1, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_sa1, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_sa1, LV_ALIGN_TOP_LEFT, 0, 0);

    s_lbl_steer_act = lv_label_create(c_sact);
    lv_label_set_text(s_lbl_steer_act, "+14.7°");
    lv_obj_set_style_text_font(s_lbl_steer_act, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(s_lbl_steer_act, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_steer_act, LV_ALIGN_TOP_MID, 0, 24);

    // In-Box 5s Mini-Plot under value
    s_chart_steer_5s_act = create_inbox_sparkline(c_sact, 226, 86, 74, -45, 45);
    s_ser_steer_5s_act = lv_chart_add_series(s_chart_steer_5s_act, lv_color_hex(UI_COLOR_ACCENT_ACT), LV_CHART_AXIS_PRIMARY_Y);

    lv_obj_t *box_s_actspd = lv_obj_create(c_sact);
    lv_obj_set_size(box_s_actspd, 226, 32);
    lv_obj_align(box_s_actspd, LV_ALIGN_TOP_MID, 0, 168);
    lv_obj_set_style_bg_color(box_s_actspd, lv_color_hex(0x0C2218), 0);
    lv_obj_set_style_border_color(box_s_actspd, lv_color_hex(0x155032), 0);
    lv_obj_set_style_radius(box_s_actspd, 6, 0);
    lv_obj_set_style_pad_all(box_s_actspd, 0, 0);
    s_lbl_steer_actual_spd = lv_label_create(box_s_actspd);
    lv_label_set_text(s_lbl_steer_actual_spd, "ACTUAL SPEED: 198 °/s");
    lv_obj_set_style_text_font(s_lbl_steer_actual_spd, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_actual_spd, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_steer_actual_spd, LV_ALIGN_CENTER, 0, 0);

    s_lbl_steer_act_telemetry = lv_label_create(c_sact);
    lv_label_set_text(s_lbl_steer_act_telemetry, "MOTOR: 8.4 A  •  TEMP: 34°C");
    lv_obj_set_style_text_font(s_lbl_steer_act_telemetry, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_act_telemetry, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_steer_act_telemetry, LV_ALIGN_TOP_LEFT, 0, 212);

    lv_obj_t *lbl_sa_sub = lv_label_create(c_sact);
    lv_label_set_text(lbl_sa_sub, "ALIGNMENT: ZERO-POINT OK");
    lv_obj_set_style_text_font(lbl_sa_sub, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_sa_sub, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_sa_sub, LV_ALIGN_TOP_LEFT, 0, 236);

    lv_obj_t *lbl_s_stat2 = lv_label_create(c_sact);
    lv_label_set_text(lbl_s_stat2, "[ OK ] FEEDBACK STREAM (100 Hz)");
    lv_obj_set_style_text_font(lbl_s_stat2, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_s_stat2, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_s_stat2, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Card 3: Delta, Torque & DTC Diagnostics
    lv_obj_t *c_sdt = lv_obj_create(s_screens[WIN_STEER]);
    lv_obj_set_size(c_sdt, act_w, u_h);
    lv_obj_align(c_sdt, LV_ALIGN_TOP_LEFT, 538, u_y);
    lv_obj_set_style_bg_color(c_sdt, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_sdt, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_sdt, 8, 0);

    s_card_steer_delta = lv_obj_create(c_sdt);
    lv_obj_set_size(s_card_steer_delta, 226, 44);
    lv_obj_align(s_card_steer_delta, LV_ALIGN_TOP_MID, 0, 0);
    lv_obj_set_style_bg_color(s_card_steer_delta, lv_color_hex(0x064E3B), 0);
    lv_obj_set_style_border_color(s_card_steer_delta, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_set_style_border_width(s_card_steer_delta, 2, 0);
    lv_obj_set_style_radius(s_card_steer_delta, 6, 0);
    lv_obj_set_style_pad_all(s_card_steer_delta, 0, 0);
    s_lbl_steer_delta_val = lv_label_create(s_card_steer_delta);
    lv_label_set_text(s_lbl_steer_delta_val, "Δ: 0.3°   [ TRACKING OK ]");
    lv_obj_set_style_text_font(s_lbl_steer_delta_val, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_steer_delta_val, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_steer_delta_val, LV_ALIGN_CENTER, 0, 0);

    s_card_steer_torque = lv_obj_create(c_sdt);
    lv_obj_set_size(s_card_steer_torque, 226, 110);
    lv_obj_align(s_card_steer_torque, LV_ALIGN_TOP_MID, 0, 54);
    lv_obj_set_style_bg_color(s_card_steer_torque, lv_color_hex(0x231806), 0);
    lv_obj_set_style_border_color(s_card_steer_torque, lv_color_hex(UI_COLOR_STATE_WARN), 0);
    lv_obj_set_style_border_width(s_card_steer_torque, 1, 0);
    lv_obj_set_style_radius(s_card_steer_torque, 6, 0);
    lv_obj_set_style_pad_all(s_card_steer_torque, 2, 0);

    lv_obj_t *lbl_tt = lv_label_create(s_card_steer_torque);
    lv_label_set_text(lbl_tt, "DRIVER COLUMN TORQUE");
    lv_obj_set_style_text_font(lbl_tt, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_tt, lv_color_hex(UI_COLOR_STATE_WARN), 0);
    lv_obj_align(lbl_tt, LV_ALIGN_TOP_MID, 0, 2);

    s_lbl_steer_torq = lv_label_create(s_card_steer_torque);
    lv_label_set_text(s_lbl_steer_torq, "+0.2 Nm");
    lv_obj_set_style_text_font(s_lbl_steer_torq, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_color(s_lbl_steer_torq, lv_color_hex(UI_COLOR_STATE_WARN), 0);
    lv_obj_align(s_lbl_steer_torq, LV_ALIGN_CENTER, 0, 4);

    s_lbl_steer_override = lv_label_create(s_card_steer_torque);
    lv_label_set_text(s_lbl_steer_override, "[ NO OVERRIDE ]");
    lv_obj_set_style_text_font(s_lbl_steer_override, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_override, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_steer_override, LV_ALIGN_BOTTOM_MID, 0, -2);

    lv_obj_t *lbl_sv = lv_label_create(c_sdt);
    lv_label_set_text(lbl_sv, "SUPPLY VOLT: 13.8 V  •  CURRENT: OK");
    lv_obj_set_style_text_font(lbl_sv, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_sv, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(lbl_sv, LV_ALIGN_TOP_LEFT, 0, 176);

    s_lbl_steer_dtc = lv_label_create(c_sdt);
    lv_label_set_text(s_lbl_steer_dtc, "DTC DIAGNOSIS: ALL CLEAR (0x0000)");
    lv_obj_set_style_text_font(s_lbl_steer_dtc, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_dtc, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_steer_dtc, LV_ALIGN_TOP_LEFT, 0, 202);

    lv_obj_t *lbl_sw = lv_label_create(c_sdt);
    lv_label_set_text(lbl_sw, "WATCHDOG: LAST SEEN 10ms AGO");
    lv_obj_set_style_text_font(lbl_sw, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_sw, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_sw, LV_ALIGN_TOP_LEFT, 0, 228);

    lv_obj_t *lbl_sh = lv_label_create(c_sdt);
    lv_label_set_text(lbl_sh, "[ OK ] SES HEALTHY (100 Hz)");
    lv_obj_set_style_text_font(lbl_sh, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_sh, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_sh, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Bottom Action Button
    lv_obj_t *btn_expand_s = lv_button_create(s_screens[WIN_STEER]);
    lv_obj_set_size(btn_expand_s, 784, 54);
    lv_obj_align(btn_expand_s, LV_ALIGN_BOTTOM_MID, 0, -6);
    lv_obj_set_style_bg_color(btn_expand_s, lv_color_hex(UI_COLOR_SURFACE_ALT), 0);
    lv_obj_set_style_border_color(btn_expand_s, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
    lv_obj_set_style_border_width(btn_expand_s, 2, 0);
    lv_obj_set_style_radius(btn_expand_s, 8, 0);
    lv_obj_t *lbl_bexp_s = lv_label_create(btn_expand_s);
    lv_label_set_text(lbl_bexp_s, "VIEW 15-SECOND FULL STEERING SCOPE PLOT (OR SWIPE DOWN) >");
    lv_obj_set_style_text_font(lbl_bexp_s, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_bexp_s, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(lbl_bexp_s, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_expand_s, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_STEER_PLOT_15S);

    // =========================================================================
    // Window 2: 2. BRAKE (SEB) - Full Height 352px Cards + In-Box 5s Plots
    // =========================================================================
    s_screens[WIN_BRAKE] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_BRAKE], lv_color_hex(UI_COLOR_BG), 0);
    create_top_nav_bar(s_screens[WIN_BRAKE], WIN_BRAKE);

    // Card 1: Command (VCU 0x7B9)
    lv_obj_t *c_bcmd = lv_obj_create(s_screens[WIN_BRAKE]);
    lv_obj_set_size(c_bcmd, act_w, u_h);
    lv_obj_align(c_bcmd, LV_ALIGN_TOP_LEFT, 8, u_y);
    lv_obj_set_style_bg_color(c_bcmd, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_bcmd, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_bcmd, 8, 0);

    lv_obj_t *lbl_bc1 = lv_label_create(c_bcmd);
    lv_label_set_text(lbl_bc1, "COMMAND (VCU 0x7B9)");
    lv_obj_set_style_text_font(lbl_bc1, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_bc1, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_bc1, LV_ALIGN_TOP_LEFT, 0, 0);

    s_lbl_brake_cmd = lv_label_create(c_bcmd);
    lv_label_set_text(s_lbl_brake_cmd, "450 kPa");
    lv_obj_set_style_text_font(s_lbl_brake_cmd, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(s_lbl_brake_cmd, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(s_lbl_brake_cmd, LV_ALIGN_TOP_MID, 0, 24);

    // In-Box 5s Mini-Plot under value
    s_chart_brake_5s_cmd = create_inbox_sparkline(c_bcmd, 226, 86, 74, 0, 1200);
    s_ser_brake_5s_cmd = lv_chart_add_series(s_chart_brake_5s_cmd, lv_color_hex(UI_COLOR_ACCENT_CMD), LV_CHART_AXIS_PRIMARY_Y);

    lv_obj_t *box_b_cmd = lv_obj_create(c_bcmd);
    lv_obj_set_size(box_b_cmd, 226, 32);
    lv_obj_align(box_b_cmd, LV_ALIGN_TOP_MID, 0, 168);
    lv_obj_set_style_bg_color(box_b_cmd, lv_color_hex(0x121A24), 0);
    lv_obj_set_style_border_color(box_b_cmd, lv_color_hex(0x1E3A50), 0);
    lv_obj_set_style_radius(box_b_cmd, 6, 0);
    lv_obj_set_style_pad_all(box_b_cmd, 0, 0);
    s_lbl_brake_target_stroke = lv_label_create(box_b_cmd);
    lv_label_set_text(s_lbl_brake_target_stroke, "TARGET STROKE: 18.0 mm");
    lv_obj_set_style_text_font(s_lbl_brake_target_stroke, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_target_stroke, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_brake_target_stroke, LV_ALIGN_CENTER, 0, 0);

    lv_obj_t *lbl_b_cmd_sub = lv_label_create(c_bcmd);
    lv_label_set_text(lbl_b_cmd_sub, "ROLLING CNT: 7  •  CHK: VALID");
    lv_obj_set_style_text_font(lbl_b_cmd_sub, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b_cmd_sub, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(lbl_b_cmd_sub, LV_ALIGN_TOP_LEFT, 0, 212);

    lv_obj_t *lbl_b_id = lv_label_create(c_bcmd);
    lv_label_set_text(lbl_b_id, "CAN ID: 0x7B9 (20ms / 50 Hz)");
    lv_obj_set_style_text_font(lbl_b_id, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b_id, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_b_id, LV_ALIGN_TOP_LEFT, 0, 236);

    lv_obj_t *lbl_b_stat1 = lv_label_create(c_bcmd);
    lv_label_set_text(lbl_b_stat1, "[ OK ] TARGET STREAM ACTIVE");
    lv_obj_set_style_text_font(lbl_b_stat1, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b_stat1, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_b_stat1, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Card 2: Actuation (SEB 0x721)
    lv_obj_t *c_bact = lv_obj_create(s_screens[WIN_BRAKE]);
    lv_obj_set_size(c_bact, act_w, u_h);
    lv_obj_align(c_bact, LV_ALIGN_TOP_LEFT, 273, u_y);
    lv_obj_set_style_bg_color(c_bact, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_bact, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_bact, 8, 0);

    lv_obj_t *lbl_ba1 = lv_label_create(c_bact);
    lv_label_set_text(lbl_ba1, "ACTUATION (SEB 0x721)");
    lv_obj_set_style_text_font(lbl_ba1, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_ba1, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_ba1, LV_ALIGN_TOP_LEFT, 0, 0);

    s_lbl_brake_act = lv_label_create(c_bact);
    lv_label_set_text(s_lbl_brake_act, "442 kPa");
    lv_obj_set_style_text_font(s_lbl_brake_act, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(s_lbl_brake_act, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_brake_act, LV_ALIGN_TOP_MID, 0, 24);

    // In-Box 5s Mini-Plot under value
    s_chart_brake_5s_act = create_inbox_sparkline(c_bact, 226, 86, 74, 0, 1200);
    s_ser_brake_5s_act = lv_chart_add_series(s_chart_brake_5s_act, lv_color_hex(UI_COLOR_ACCENT_ACT), LV_CHART_AXIS_PRIMARY_Y);

    lv_obj_t *box_b_act = lv_obj_create(c_bact);
    lv_obj_set_size(box_b_act, 226, 32);
    lv_obj_align(box_b_act, LV_ALIGN_TOP_MID, 0, 168);
    lv_obj_set_style_bg_color(box_b_act, lv_color_hex(0x0C2218), 0);
    lv_obj_set_style_border_color(box_b_act, lv_color_hex(0x155032), 0);
    lv_obj_set_style_radius(box_b_act, 6, 0);
    lv_obj_set_style_pad_all(box_b_act, 0, 0);
    s_lbl_brake_act_stroke = lv_label_create(box_b_act);
    lv_label_set_text(s_lbl_brake_act_stroke, "ACTUAL STROKE: 17.8 mm");
    lv_obj_set_style_text_font(s_lbl_brake_act_stroke, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_act_stroke, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_brake_act_stroke, LV_ALIGN_CENTER, 0, 0);

    s_lbl_brake_act_telemetry = lv_label_create(c_bact);
    lv_label_set_text(s_lbl_brake_act_telemetry, "MOTOR: 4.2 A  •  TEMP: 38°C");
    lv_obj_set_style_text_font(s_lbl_brake_act_telemetry, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_act_telemetry, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_brake_act_telemetry, LV_ALIGN_TOP_LEFT, 0, 212);

    lv_obj_t *lbl_ba_sub = lv_label_create(c_bact);
    lv_label_set_text(lbl_ba_sub, "MODE: PRESSURE CLOSED-LOOP");
    lv_obj_set_style_text_font(lbl_ba_sub, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_ba_sub, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_ba_sub, LV_ALIGN_TOP_LEFT, 0, 236);

    lv_obj_t *lbl_b_stat2 = lv_label_create(c_bact);
    lv_label_set_text(lbl_b_stat2, "[ OK ] FEEDBACK STREAM (100 Hz)");
    lv_obj_set_style_text_font(lbl_b_stat2, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b_stat2, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_b_stat2, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Card 3: Delta, Stroke & Diagnostics
    lv_obj_t *c_bdt = lv_obj_create(s_screens[WIN_BRAKE]);
    lv_obj_set_size(c_bdt, act_w, u_h);
    lv_obj_align(c_bdt, LV_ALIGN_TOP_LEFT, 538, u_y);
    lv_obj_set_style_bg_color(c_bdt, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_bdt, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_bdt, 8, 0);

    s_card_brake_delta = lv_obj_create(c_bdt);
    lv_obj_set_size(s_card_brake_delta, 226, 44);
    lv_obj_align(s_card_brake_delta, LV_ALIGN_TOP_MID, 0, 0);
    lv_obj_set_style_bg_color(s_card_brake_delta, lv_color_hex(0x064E3B), 0);
    lv_obj_set_style_border_color(s_card_brake_delta, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_set_style_border_width(s_card_brake_delta, 2, 0);
    lv_obj_set_style_radius(s_card_brake_delta, 6, 0);
    lv_obj_set_style_pad_all(s_card_brake_delta, 0, 0);
    s_lbl_brake_delta_val = lv_label_create(s_card_brake_delta);
    lv_label_set_text(s_lbl_brake_delta_val, "Δ: -8 kPa   [ TRACKING OK ]");
    lv_obj_set_style_text_font(s_lbl_brake_delta_val, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_brake_delta_val, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_brake_delta_val, LV_ALIGN_CENTER, 0, 0);

    lv_obj_t *box_b_sec = lv_obj_create(c_bdt);
    lv_obj_set_size(box_b_sec, 226, 110);
    lv_obj_align(box_b_sec, LV_ALIGN_TOP_MID, 0, 54);
    lv_obj_set_style_bg_color(box_b_sec, lv_color_hex(0x121A24), 0);
    lv_obj_set_style_border_color(box_b_sec, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
    lv_obj_set_style_radius(box_b_sec, 6, 0);
    lv_obj_set_style_pad_all(box_b_sec, 2, 0);

    lv_obj_t *lbl_bst = lv_label_create(box_b_sec);
    lv_label_set_text(lbl_bst, "PISTON DISPLACEMENT");
    lv_obj_set_style_text_font(lbl_bst, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_bst, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
    lv_obj_align(lbl_bst, LV_ALIGN_TOP_MID, 0, 2);

    lv_obj_t *lbl_b_stkval = lv_label_create(box_b_sec);
    lv_label_set_text(lbl_b_stkval, "17.8 mm");
    lv_obj_set_style_text_font(lbl_b_stkval, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_color(lbl_b_stkval, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(lbl_b_stkval, LV_ALIGN_CENTER, 0, 4);

    lv_obj_t *lbl_b_stkok = lv_label_create(box_b_sec);
    lv_label_set_text(lbl_b_stkok, "[ STROKE Δ: 0.2 mm OK ]");
    lv_obj_set_style_text_font(lbl_b_stkok, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b_stkok, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_b_stkok, LV_ALIGN_BOTTOM_MID, 0, -2);

    lv_obj_t *lbl_bv = lv_label_create(c_bdt);
    lv_label_set_text(lbl_bv, "SUPPLY VOLT: 13.8 V  •  CURRENT: OK");
    lv_obj_set_style_text_font(lbl_bv, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_bv, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(lbl_bv, LV_ALIGN_TOP_LEFT, 0, 176);

    s_lbl_brake_dtc = lv_label_create(c_bdt);
    lv_label_set_text(s_lbl_brake_dtc, "DTC DIAGNOSIS: ALL CLEAR (0x0000)");
    lv_obj_set_style_text_font(s_lbl_brake_dtc, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_dtc, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_brake_dtc, LV_ALIGN_TOP_LEFT, 0, 202);

    lv_obj_t *lbl_bw = lv_label_create(c_bdt);
    lv_label_set_text(lbl_bw, "WATCHDOG: LAST SEEN 10ms AGO");
    lv_obj_set_style_text_font(lbl_bw, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_bw, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_bw, LV_ALIGN_TOP_LEFT, 0, 228);

    lv_obj_t *lbl_bh = lv_label_create(c_bdt);
    lv_label_set_text(lbl_bh, "[ OK ] SEB HEALTHY (100 Hz)");
    lv_obj_set_style_text_font(lbl_bh, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_bh, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_bh, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Bottom Action Button
    lv_obj_t *btn_expand_b = lv_button_create(s_screens[WIN_BRAKE]);
    lv_obj_set_size(btn_expand_b, 784, 54);
    lv_obj_align(btn_expand_b, LV_ALIGN_BOTTOM_MID, 0, -6);
    lv_obj_set_style_bg_color(btn_expand_b, lv_color_hex(UI_COLOR_SURFACE_ALT), 0);
    lv_obj_set_style_border_color(btn_expand_b, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
    lv_obj_set_style_border_width(btn_expand_b, 2, 0);
    lv_obj_set_style_radius(btn_expand_b, 8, 0);
    lv_obj_t *lbl_bexp_b = lv_label_create(btn_expand_b);
    lv_label_set_text(lbl_bexp_b, "VIEW 15-SECOND FULL BRAKE PRESSURE SCOPE (OR SWIPE DOWN) >");
    lv_obj_set_style_text_font(lbl_bexp_b, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_bexp_b, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(lbl_bexp_b, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_expand_b, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_BRAKE_PLOT_15S);

    // =========================================================================
    // Window 3: 3. DRIVE (MTR) - Full Height 352px Cards + In-Box 5s Plots
    // =========================================================================
    s_screens[WIN_DRIVE] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_DRIVE], lv_color_hex(UI_COLOR_BG), 0);
    create_top_nav_bar(s_screens[WIN_DRIVE], WIN_DRIVE);

    // Card 1: Command (VCU 0x204)
    lv_obj_t *c_dcmd = lv_obj_create(s_screens[WIN_DRIVE]);
    lv_obj_set_size(c_dcmd, act_w, u_h);
    lv_obj_align(c_dcmd, LV_ALIGN_TOP_LEFT, 8, u_y);
    lv_obj_set_style_bg_color(c_dcmd, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_dcmd, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_dcmd, 8, 0);

    lv_obj_t *lbl_dc1 = lv_label_create(c_dcmd);
    lv_label_set_text(lbl_dc1, "COMMAND (VCU 0x204)");
    lv_obj_set_style_text_font(lbl_dc1, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_dc1, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_dc1, LV_ALIGN_TOP_LEFT, 0, 0);

    s_lbl_drive_cmd = lv_label_create(c_dcmd);
    lv_label_set_text(s_lbl_drive_cmd, "15.0 km/h");
    lv_obj_set_style_text_font(s_lbl_drive_cmd, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(s_lbl_drive_cmd, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(s_lbl_drive_cmd, LV_ALIGN_TOP_MID, 0, 24);

    // In-Box 5s Mini-Plot under value
    s_chart_drive_5s_cmd = create_inbox_sparkline(c_dcmd, 226, 86, 74, 0, 35);
    s_ser_drive_5s_cmd = lv_chart_add_series(s_chart_drive_5s_cmd, lv_color_hex(UI_COLOR_ACCENT_CMD), LV_CHART_AXIS_PRIMARY_Y);

    lv_obj_t *box_d_cmd = lv_obj_create(c_dcmd);
    lv_obj_set_size(box_d_cmd, 226, 32);
    lv_obj_align(box_d_cmd, LV_ALIGN_TOP_MID, 0, 168);
    lv_obj_set_style_bg_color(box_d_cmd, lv_color_hex(0x121A24), 0);
    lv_obj_set_style_border_color(box_d_cmd, lv_color_hex(0x1E3A50), 0);
    lv_obj_set_style_radius(box_d_cmd, 6, 0);
    lv_obj_set_style_pad_all(box_d_cmd, 0, 0);
    s_lbl_drive_target_gear = lv_label_create(box_d_cmd);
    lv_label_set_text(s_lbl_drive_target_gear, "TARGET GEAR: [ D ] (DRIVE)");
    lv_obj_set_style_text_font(s_lbl_drive_target_gear, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_drive_target_gear, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_drive_target_gear, LV_ALIGN_CENTER, 0, 0);

    lv_obj_t *lbl_d_cmd_sub = lv_label_create(c_dcmd);
    lv_label_set_text(lbl_d_cmd_sub, "ROLLING CNT: 7  •  CHK: VALID");
    lv_obj_set_style_text_font(lbl_d_cmd_sub, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_d_cmd_sub, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(lbl_d_cmd_sub, LV_ALIGN_TOP_LEFT, 0, 212);

    lv_obj_t *lbl_d_id = lv_label_create(c_dcmd);
    lv_label_set_text(lbl_d_id, "CAN ID: 0x204 (20ms / 50 Hz)");
    lv_obj_set_style_text_font(lbl_d_id, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_d_id, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_d_id, LV_ALIGN_TOP_LEFT, 0, 236);

    lv_obj_t *lbl_d_stat1 = lv_label_create(c_dcmd);
    lv_label_set_text(lbl_d_stat1, "[ OK ] TARGET STREAM ACTIVE");
    lv_obj_set_style_text_font(lbl_d_stat1, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_d_stat1, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_d_stat1, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Card 2: Actuation (MTR 0x206)
    lv_obj_t *c_dact = lv_obj_create(s_screens[WIN_DRIVE]);
    lv_obj_set_size(c_dact, act_w, u_h);
    lv_obj_align(c_dact, LV_ALIGN_TOP_LEFT, 273, u_y);
    lv_obj_set_style_bg_color(c_dact, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_dact, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_dact, 8, 0);

    lv_obj_t *lbl_da1 = lv_label_create(c_dact);
    lv_label_set_text(lbl_da1, "ACTUATION (MTR 0x206)");
    lv_obj_set_style_text_font(lbl_da1, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_da1, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_da1, LV_ALIGN_TOP_LEFT, 0, 0);

    s_lbl_drive_act = lv_label_create(c_dact);
    lv_label_set_text(s_lbl_drive_act, "14.8 km/h");
    lv_obj_set_style_text_font(s_lbl_drive_act, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(s_lbl_drive_act, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_drive_act, LV_ALIGN_TOP_MID, 0, 24);

    // In-Box 5s Mini-Plot under value
    s_chart_drive_5s_act = create_inbox_sparkline(c_dact, 226, 86, 74, 0, 35);
    s_ser_drive_5s_act = lv_chart_add_series(s_chart_drive_5s_act, lv_color_hex(UI_COLOR_ACCENT_ACT), LV_CHART_AXIS_PRIMARY_Y);

    lv_obj_t *box_d_act = lv_obj_create(c_dact);
    lv_obj_set_size(box_d_act, 226, 32);
    lv_obj_align(box_d_act, LV_ALIGN_TOP_MID, 0, 168);
    lv_obj_set_style_bg_color(box_d_act, lv_color_hex(0x0C2218), 0);
    lv_obj_set_style_border_color(box_d_act, lv_color_hex(0x155032), 0);
    lv_obj_set_style_radius(box_d_act, 6, 0);
    lv_obj_set_style_pad_all(box_d_act, 0, 0);
    s_lbl_drive_act_gear = lv_label_create(box_d_act);
    lv_label_set_text(s_lbl_drive_act_gear, "ENGAGED GEAR: [ D ] (ENGAGED)");
    lv_obj_set_style_text_font(s_lbl_drive_act_gear, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_drive_act_gear, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_drive_act_gear, LV_ALIGN_CENTER, 0, 0);

    s_lbl_drive_motor_telemetry = lv_label_create(c_dact);
    lv_label_set_text(s_lbl_drive_motor_telemetry, "MOTOR: 1,620 RPM  •  RATIO: 8.5:1");
    lv_obj_set_style_text_font(s_lbl_drive_motor_telemetry, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_drive_motor_telemetry, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_drive_motor_telemetry, LV_ALIGN_TOP_LEFT, 0, 212);

    lv_obj_t *lbl_da_sub = lv_label_create(c_dact);
    lv_label_set_text(lbl_da_sub, "STATE: RUN (0x03) • BRAKE CUTOUT: OK");
    lv_obj_set_style_text_font(lbl_da_sub, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_da_sub, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_da_sub, LV_ALIGN_TOP_LEFT, 0, 236);

    lv_obj_t *lbl_d_stat2 = lv_label_create(c_dact);
    lv_label_set_text(lbl_d_stat2, "[ OK ] FEEDBACK STREAM (100 Hz)");
    lv_obj_set_style_text_font(lbl_d_stat2, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_d_stat2, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_d_stat2, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Card 3: Delta, Interlocks & Diagnostics
    lv_obj_t *c_ddt = lv_obj_create(s_screens[WIN_DRIVE]);
    lv_obj_set_size(c_ddt, act_w, u_h);
    lv_obj_align(c_ddt, LV_ALIGN_TOP_LEFT, 538, u_y);
    lv_obj_set_style_bg_color(c_ddt, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_ddt, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_ddt, 8, 0);

    s_card_drive_delta = lv_obj_create(c_ddt);
    lv_obj_set_size(s_card_drive_delta, 226, 44);
    lv_obj_align(s_card_drive_delta, LV_ALIGN_TOP_MID, 0, 0);
    lv_obj_set_style_bg_color(s_card_drive_delta, lv_color_hex(0x064E3B), 0);
    lv_obj_set_style_border_color(s_card_drive_delta, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_set_style_border_width(s_card_drive_delta, 2, 0);
    lv_obj_set_style_radius(s_card_drive_delta, 6, 0);
    lv_obj_set_style_pad_all(s_card_drive_delta, 0, 0);
    s_lbl_drive_delta_val = lv_label_create(s_card_drive_delta);
    lv_label_set_text(s_lbl_drive_delta_val, "Δ: 0.2 km/h   [ TRACKING OK ]");
    lv_obj_set_style_text_font(s_lbl_drive_delta_val, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_drive_delta_val, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_drive_delta_val, LV_ALIGN_CENTER, 0, 0);

    lv_obj_t *box_d_sec = lv_obj_create(c_ddt);
    lv_obj_set_size(box_d_sec, 226, 110);
    lv_obj_align(box_d_sec, LV_ALIGN_TOP_MID, 0, 54);
    lv_obj_set_style_bg_color(box_d_sec, lv_color_hex(0x0C2218), 0);
    lv_obj_set_style_border_color(box_d_sec, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_set_style_radius(box_d_sec, 6, 0);
    lv_obj_set_style_pad_all(box_d_sec, 2, 0);

    lv_obj_t *lbl_dstitle = lv_label_create(box_d_sec);
    lv_label_set_text(lbl_dstitle, "SAFETY INTERLOCKS");
    lv_obj_set_style_text_font(lbl_dstitle, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_dstitle, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_dstitle, LV_ALIGN_TOP_MID, 0, 2);

    lv_obj_t *lbl_d_allclr = lv_label_create(box_d_sec);
    lv_label_set_text(lbl_d_allclr, "ALL CLEAR");
    lv_obj_set_style_text_font(lbl_d_allclr, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_color(lbl_d_allclr, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_d_allclr, LV_ALIGN_CENTER, 0, 4);

    lv_obj_t *lbl_d_pr = lv_label_create(box_d_sec);
    lv_label_set_text(lbl_d_pr, "[ BRAKE PRIORITY OK ]");
    lv_obj_set_style_text_font(lbl_d_pr, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_d_pr, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_d_pr, LV_ALIGN_BOTTOM_MID, 0, -2);

    lv_obj_t *lbl_dv = lv_label_create(c_ddt);
    lv_label_set_text(lbl_dv, "SUPPLY VOLT: 13.8 V  •  CURRENT: OK");
    lv_obj_set_style_text_font(lbl_dv, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_dv, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(lbl_dv, LV_ALIGN_TOP_LEFT, 0, 176);

    s_lbl_drive_dtc = lv_label_create(c_ddt);
    lv_label_set_text(s_lbl_drive_dtc, "DTC DIAGNOSIS: ALL CLEAR (0x0000)");
    lv_obj_set_style_text_font(s_lbl_drive_dtc, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_drive_dtc, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_drive_dtc, LV_ALIGN_TOP_LEFT, 0, 202);

    lv_obj_t *lbl_dw = lv_label_create(c_ddt);
    lv_label_set_text(lbl_dw, "WATCHDOG: LAST SEEN 10ms AGO");
    lv_obj_set_style_text_font(lbl_dw, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_dw, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_dw, LV_ALIGN_TOP_LEFT, 0, 228);

    lv_obj_t *lbl_dh = lv_label_create(c_ddt);
    lv_label_set_text(lbl_dh, "[ OK ] MTR HEALTHY (50 Hz)");
    lv_obj_set_style_text_font(lbl_dh, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_dh, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_dh, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Bottom Action Button
    lv_obj_t *btn_expand_d = lv_button_create(s_screens[WIN_DRIVE]);
    lv_obj_set_size(btn_expand_d, 784, 54);
    lv_obj_align(btn_expand_d, LV_ALIGN_BOTTOM_MID, 0, -6);
    lv_obj_set_style_bg_color(btn_expand_d, lv_color_hex(UI_COLOR_SURFACE_ALT), 0);
    lv_obj_set_style_border_color(btn_expand_d, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
    lv_obj_set_style_border_width(btn_expand_d, 2, 0);
    lv_obj_set_style_radius(btn_expand_d, 8, 0);
    lv_obj_t *lbl_bexp_d = lv_label_create(btn_expand_d);
    lv_label_set_text(lbl_bexp_d, "VIEW 15-SECOND FULL DRIVE SPEED SCOPE (OR SWIPE DOWN) >");
    lv_obj_set_style_text_font(lbl_bexp_d, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_bexp_d, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(lbl_bexp_d, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_expand_d, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_DRIVE_PLOT_15S);

    // =========================================================================
    // Window 4: 4. BUS & NODES - Diagnostics & Watchdogs
    // =========================================================================
    s_screens[WIN_BUS_SAFETY] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_BUS_SAFETY], lv_color_hex(UI_COLOR_BG), 0);
    create_top_nav_bar(s_screens[WIN_BUS_SAFETY], WIN_BUS_SAFETY);

    // Top E-Stop Diagnostics Card
    lv_obj_t *c_estop_diag = lv_obj_create(s_screens[WIN_BUS_SAFETY]);
    lv_obj_set_size(c_estop_diag, 784, 68);
    lv_obj_align(c_estop_diag, LV_ALIGN_TOP_MID, 0, 52);
    lv_obj_set_style_bg_color(c_estop_diag, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_estop_diag, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_estop_diag, 8, 0);

    s_lbl_bus_estop_status = lv_label_create(c_estop_diag);
    lv_label_set_text(s_lbl_bus_estop_status, "[ OK ] E-STOP DISENGAGED (SYSTEM CLEAR)");
    lv_obj_set_style_text_font(s_lbl_bus_estop_status, &lv_font_montserrat_18, 0);
    lv_obj_set_style_text_color(s_lbl_bus_estop_status, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_bus_estop_status, LV_ALIGN_LEFT_MID, 10, -12);

    s_lbl_bus_estop_origin = lv_label_create(c_estop_diag);
    lv_label_set_text(s_lbl_bus_estop_origin, "ROOT CAUSE: NO TRIPS DETECTED  •  INTERLOCK HARDWARE LINE: HIGH");
    lv_obj_set_style_text_font(s_lbl_bus_estop_origin, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_bus_estop_origin, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(s_lbl_bus_estop_origin, LV_ALIGN_LEFT_MID, 10, 14);

    // 3 Cards: 12V Rail, CAN Bus, SD Logger
    const int st_w = 254;
    const int st_h = 135;
    const int st_y = 126;

    lv_obj_t *c_rail = lv_obj_create(s_screens[WIN_BUS_SAFETY]);
    lv_obj_set_size(c_rail, st_w, st_h);
    lv_obj_align(c_rail, LV_ALIGN_TOP_LEFT, 8, st_y);
    lv_obj_set_style_bg_color(c_rail, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_rail, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_rail, 8, 0);

    lv_obj_t *lbl_r_title = lv_label_create(c_rail);
    lv_label_set_text(lbl_r_title, "12V SYSTEM BUS");
    lv_obj_set_style_text_font(lbl_r_title, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_r_title, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_r_title, LV_ALIGN_TOP_LEFT, 0, 0);
    s_lbl_bus_rail_volts = lv_label_create(c_rail);
    lv_label_set_text(s_lbl_bus_rail_volts, "13.8 V");
    lv_obj_set_style_text_font(s_lbl_bus_rail_volts, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(s_lbl_bus_rail_volts, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_bus_rail_volts, LV_ALIGN_CENTER, 0, 6);

    lv_obj_t *c_can = lv_obj_create(s_screens[WIN_BUS_SAFETY]);
    lv_obj_set_size(c_can, st_w, st_h);
    lv_obj_align(c_can, LV_ALIGN_TOP_LEFT, 273, st_y);
    lv_obj_set_style_bg_color(c_can, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_can, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_can, 8, 0);

    lv_obj_t *lbl_c_title = lv_label_create(c_can);
    lv_label_set_text(lbl_c_title, "CAN BUS HEALTH");
    lv_obj_set_style_text_font(lbl_c_title, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_c_title, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_c_title, LV_ALIGN_TOP_LEFT, 0, 0);
    s_lbl_bus_rate = lv_label_create(c_can);
    lv_label_set_text(s_lbl_bus_rate, "420 msg/s");
    lv_obj_set_style_text_font(s_lbl_bus_rate, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(s_lbl_bus_rate, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(s_lbl_bus_rate, LV_ALIGN_CENTER, 0, -4);
    s_lbl_bus_tec_rec = lv_label_create(c_can);
    lv_label_set_text(s_lbl_bus_tec_rec, "TEC: 0 | REC: 0 [NORMAL]");
    lv_obj_set_style_text_font(s_lbl_bus_tec_rec, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_bus_tec_rec, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_bus_tec_rec, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    lv_obj_t *c_rec = lv_obj_create(s_screens[WIN_BUS_SAFETY]);
    lv_obj_set_size(c_rec, st_w, st_h);
    lv_obj_align(c_rec, LV_ALIGN_TOP_LEFT, 538, st_y);
    lv_obj_set_style_bg_color(c_rec, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_rec, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_rec, 8, 0);

    lv_obj_t *lbl_rc_title = lv_label_create(c_rec);
    lv_label_set_text(lbl_rc_title, "CAN FLIGHT RECORDER");
    lv_obj_set_style_text_font(lbl_rc_title, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_rc_title, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_rc_title, LV_ALIGN_TOP_LEFT, 0, 0);
    lv_obj_t *lbl_rc_st = lv_label_create(c_rec);
    lv_label_set_text(lbl_rc_st, "LOGGING");
    lv_obj_set_style_text_font(lbl_rc_st, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(lbl_rc_st, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_rc_st, LV_ALIGN_CENTER, 0, -4);
    lv_obj_t *lbl_rc_sub = lv_label_create(c_rec);
    lv_label_set_text(lbl_rc_sub, "[ RAW_CAN_01.LOG ]");
    lv_obj_set_style_text_font(lbl_rc_sub, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_rc_sub, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
    lv_obj_align(lbl_rc_sub, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Watchdog Deck: 5 Node cards (Height 200px)
    const char *node_names[5] = {"SYS (0x011)", "RT (0x210)", "MTR (0x206)", "SES (0x201)", "SEB (0x721)"};
    const int w5_w = 152;
    for (int i = 0; i < 5; i++) {
        lv_obj_t *c_node = lv_obj_create(s_screens[WIN_BUS_SAFETY]);
        lv_obj_set_size(c_node, w5_w, 200);
        lv_obj_align(c_node, LV_ALIGN_TOP_LEFT, 8 + i * (w5_w + 6), 268);
        lv_obj_set_style_bg_color(c_node, lv_color_hex(UI_COLOR_SURFACE), 0);
        lv_obj_set_style_border_color(c_node, lv_color_hex(UI_COLOR_BORDER), 0);
        lv_obj_set_style_radius(c_node, 8, 0);

        lv_obj_t *lbl_n = lv_label_create(c_node);
        lv_label_set_text(lbl_n, node_names[i]);
        lv_obj_set_style_text_font(lbl_n, &lv_font_montserrat_14, 0);
        lv_obj_align(lbl_n, LV_ALIGN_TOP_MID, 0, 4);
        lv_obj_set_style_text_color(lbl_n, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);

        s_lbl_bus_node_rates[i] = lv_label_create(c_node);
        lv_label_set_text(s_lbl_bus_node_rates[i], "100 Hz");
        lv_obj_set_style_text_font(s_lbl_bus_node_rates[i], &lv_font_montserrat_24, 0);
        lv_obj_align(s_lbl_bus_node_rates[i], LV_ALIGN_CENTER, 0, -10);
        lv_obj_set_style_text_color(s_lbl_bus_node_rates[i], lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);

        s_lbl_bus_node_states[i] = lv_label_create(c_node);
        lv_label_set_text(s_lbl_bus_node_states[i], "[ OK ] ACTIVE");
        lv_obj_set_style_text_font(s_lbl_bus_node_states[i], &lv_font_montserrat_14, 0);
        lv_obj_align(s_lbl_bus_node_states[i], LV_ALIGN_BOTTOM_MID, 0, -8);
        lv_obj_set_style_text_color(s_lbl_bus_node_states[i], lv_color_hex(UI_COLOR_STATE_OK), 0);
    }

    // =========================================================================
    // Window 5: 15-Second High-Resolution Steer Scope
    // =========================================================================
    s_screens[WIN_STEER_PLOT_15S] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_STEER_PLOT_15S], lv_color_hex(UI_COLOR_BG), 0);

    lv_obj_t *hdr_s15 = lv_obj_create(s_screens[WIN_STEER_PLOT_15S]);
    lv_obj_set_size(hdr_s15, 784, 48);
    lv_obj_align(hdr_s15, LV_ALIGN_TOP_MID, 0, 6);
    lv_obj_set_style_bg_color(hdr_s15, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(hdr_s15, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(hdr_s15, 8, 0);

    lv_obj_t *btn_back_s = lv_button_create(hdr_s15);
    lv_obj_set_size(btn_back_s, 140, 36);
    lv_obj_align(btn_back_s, LV_ALIGN_LEFT_MID, 4, 0);
    lv_obj_set_style_bg_color(btn_back_s, lv_color_hex(UI_COLOR_SURFACE_ALT), 0);
    lv_obj_t *lbl_bs = lv_label_create(btn_back_s);
    lv_label_set_text(lbl_bs, "< NUMERICS");
    lv_obj_set_style_text_font(lbl_bs, &lv_font_montserrat_12, 0);
    lv_obj_align(lbl_bs, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_back_s, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_STEER);

    s_lbl_steer_15s_hdr = lv_label_create(hdr_s15);
    lv_label_set_text(s_lbl_steer_15s_hdr, "STEER 15s SCOPE  •  CMD: +15.0°  |  ACT: +14.7°  |  Δ: 0.3°  |  Torque: +0.2 Nm");
    lv_obj_set_style_text_font(s_lbl_steer_15s_hdr, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_steer_15s_hdr, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_steer_15s_hdr, LV_ALIGN_LEFT_MID, 160, 0);

    s_chart_steer_15s = lv_chart_create(s_screens[WIN_STEER_PLOT_15S]);
    lv_obj_set_size(s_chart_steer_15s, 784, 360);
    lv_obj_align(s_chart_steer_15s, LV_ALIGN_TOP_MID, 0, 60);
    lv_chart_set_type(s_chart_steer_15s, LV_CHART_TYPE_LINE);
    lv_chart_set_point_count(s_chart_steer_15s, PLOT_POINTS_15S);
    lv_chart_set_update_mode(s_chart_steer_15s, LV_CHART_UPDATE_MODE_SHIFT);
    lv_chart_set_range(s_chart_steer_15s, LV_CHART_AXIS_PRIMARY_Y, -45, 45);
    lv_obj_set_style_bg_color(s_chart_steer_15s, lv_color_hex(UI_COLOR_BG), 0);
    lv_obj_set_style_border_color(s_chart_steer_15s, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(s_chart_steer_15s, 8, 0);
    lv_obj_set_style_size(s_chart_steer_15s, 0, LV_PART_INDICATOR);
    lv_obj_set_style_line_width(s_chart_steer_15s, 2, LV_PART_ITEMS);

    s_ser_steer_15s_cmd = lv_chart_add_series(s_chart_steer_15s, lv_color_hex(UI_COLOR_ACCENT_CMD), LV_CHART_AXIS_PRIMARY_Y);
    s_ser_steer_15s_act = lv_chart_add_series(s_chart_steer_15s, lv_color_hex(UI_COLOR_ACCENT_ACT), LV_CHART_AXIS_PRIMARY_Y);

    lv_obj_t *btn_pause_s15 = lv_button_create(s_screens[WIN_STEER_PLOT_15S]);
    lv_obj_set_size(btn_pause_s15, 180, 44);
    lv_obj_align(btn_pause_s15, LV_ALIGN_BOTTOM_RIGHT, -8, -6);
    lv_obj_set_style_bg_color(btn_pause_s15, lv_color_hex(UI_COLOR_SURFACE_ALT), 0);
    lv_obj_t *lbl_ps15 = lv_label_create(btn_pause_s15);
    lv_label_set_text(lbl_ps15, "|| FREEZE");
    lv_obj_set_style_text_font(lbl_ps15, &lv_font_montserrat_12, 0);
    lv_obj_align(lbl_ps15, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_pause_s15, btn_pause_event_cb, LV_EVENT_CLICKED, NULL);

    // =========================================================================
    // Window 6: 15-Second High-Resolution Brake Scope
    // =========================================================================
    s_screens[WIN_BRAKE_PLOT_15S] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_BRAKE_PLOT_15S], lv_color_hex(UI_COLOR_BG), 0);

    lv_obj_t *hdr_b15 = lv_obj_create(s_screens[WIN_BRAKE_PLOT_15S]);
    lv_obj_set_size(hdr_b15, 784, 48);
    lv_obj_align(hdr_b15, LV_ALIGN_TOP_MID, 0, 6);
    lv_obj_set_style_bg_color(hdr_b15, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(hdr_b15, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(hdr_b15, 8, 0);

    lv_obj_t *btn_back_b = lv_button_create(hdr_b15);
    lv_obj_set_size(btn_back_b, 140, 36);
    lv_obj_align(btn_back_b, LV_ALIGN_LEFT_MID, 4, 0);
    lv_obj_set_style_bg_color(btn_back_b, lv_color_hex(UI_COLOR_SURFACE_ALT), 0);
    lv_obj_t *lbl_bb = lv_label_create(btn_back_b);
    lv_label_set_text(lbl_bb, "< NUMERICS");
    lv_obj_set_style_text_font(lbl_bb, &lv_font_montserrat_12, 0);
    lv_obj_align(lbl_bb, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_back_b, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_BRAKE);

    s_lbl_brake_15s_hdr = lv_label_create(hdr_b15);
    lv_label_set_text(s_lbl_brake_15s_hdr, "BRAKE 15s SCOPE  •  CMD: 450 kPa  |  ACT: 442 kPa  |  Δ: -8 kPa  |  Stroke: 17.8mm");
    lv_obj_set_style_text_font(s_lbl_brake_15s_hdr, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_brake_15s_hdr, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_brake_15s_hdr, LV_ALIGN_LEFT_MID, 160, 0);

    s_chart_brake_15s = lv_chart_create(s_screens[WIN_BRAKE_PLOT_15S]);
    lv_obj_set_size(s_chart_brake_15s, 784, 360);
    lv_obj_align(s_chart_brake_15s, LV_ALIGN_TOP_MID, 0, 60);
    lv_chart_set_type(s_chart_brake_15s, LV_CHART_TYPE_LINE);
    lv_chart_set_point_count(s_chart_brake_15s, PLOT_POINTS_15S);
    lv_chart_set_update_mode(s_chart_brake_15s, LV_CHART_UPDATE_MODE_SHIFT);
    lv_chart_set_range(s_chart_brake_15s, LV_CHART_AXIS_PRIMARY_Y, 0, 1200);
    lv_obj_set_style_bg_color(s_chart_brake_15s, lv_color_hex(UI_COLOR_BG), 0);
    lv_obj_set_style_border_color(s_chart_brake_15s, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(s_chart_brake_15s, 8, 0);
    lv_obj_set_style_size(s_chart_brake_15s, 0, LV_PART_INDICATOR);
    lv_obj_set_style_line_width(s_chart_brake_15s, 2, LV_PART_ITEMS);

    s_ser_brake_15s_cmd = lv_chart_add_series(s_chart_brake_15s, lv_color_hex(UI_COLOR_ACCENT_CMD), LV_CHART_AXIS_PRIMARY_Y);
    s_ser_brake_15s_act = lv_chart_add_series(s_chart_brake_15s, lv_color_hex(UI_COLOR_ACCENT_ACT), LV_CHART_AXIS_PRIMARY_Y);

    lv_obj_t *btn_pause_b15 = lv_button_create(s_screens[WIN_BRAKE_PLOT_15S]);
    lv_obj_set_size(btn_pause_b15, 180, 44);
    lv_obj_align(btn_pause_b15, LV_ALIGN_BOTTOM_RIGHT, -8, -6);
    lv_obj_set_style_bg_color(btn_pause_b15, lv_color_hex(UI_COLOR_SURFACE_ALT), 0);
    lv_obj_t *lbl_pb15 = lv_label_create(btn_pause_b15);
    lv_label_set_text(lbl_pb15, "|| FREEZE");
    lv_obj_set_style_text_font(lbl_pb15, &lv_font_montserrat_12, 0);
    lv_obj_align(lbl_pb15, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_pause_b15, btn_pause_event_cb, LV_EVENT_CLICKED, NULL);

    // =========================================================================
    // Window 7: 15-Second High-Resolution Drive Scope
    // =========================================================================
    s_screens[WIN_DRIVE_PLOT_15S] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_DRIVE_PLOT_15S], lv_color_hex(UI_COLOR_BG), 0);

    lv_obj_t *hdr_d15 = lv_obj_create(s_screens[WIN_DRIVE_PLOT_15S]);
    lv_obj_set_size(hdr_d15, 784, 48);
    lv_obj_align(hdr_d15, LV_ALIGN_TOP_MID, 0, 6);
    lv_obj_set_style_bg_color(hdr_d15, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(hdr_d15, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(hdr_d15, 8, 0);

    lv_obj_t *btn_back_d = lv_button_create(hdr_d15);
    lv_obj_set_size(btn_back_d, 140, 36);
    lv_obj_align(btn_back_d, LV_ALIGN_LEFT_MID, 4, 0);
    lv_obj_set_style_bg_color(btn_back_d, lv_color_hex(UI_COLOR_SURFACE_ALT), 0);
    lv_obj_t *lbl_bd = lv_label_create(btn_back_d);
    lv_label_set_text(lbl_bd, "< NUMERICS");
    lv_obj_set_style_text_font(lbl_bd, &lv_font_montserrat_12, 0);
    lv_obj_align(lbl_bd, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_back_d, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_DRIVE);

    s_lbl_drive_15s_hdr = lv_label_create(hdr_d15);
    lv_label_set_text(s_lbl_drive_15s_hdr, "DRIVE 15s SCOPE  •  CMD: 15.0 km/h  |  ACT: 14.8 km/h  |  Δ: 0.2 km/h  |  1620 RPM");
    lv_obj_set_style_text_font(s_lbl_drive_15s_hdr, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_drive_15s_hdr, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_drive_15s_hdr, LV_ALIGN_LEFT_MID, 160, 0);

    s_chart_drive_15s = lv_chart_create(s_screens[WIN_DRIVE_PLOT_15S]);
    lv_obj_set_size(s_chart_drive_15s, 784, 360);
    lv_obj_align(s_chart_drive_15s, LV_ALIGN_TOP_MID, 0, 60);
    lv_chart_set_type(s_chart_drive_15s, LV_CHART_TYPE_LINE);
    lv_chart_set_point_count(s_chart_drive_15s, PLOT_POINTS_15S);
    lv_chart_set_update_mode(s_chart_drive_15s, LV_CHART_UPDATE_MODE_SHIFT);
    lv_chart_set_range(s_chart_drive_15s, LV_CHART_AXIS_PRIMARY_Y, 0, 35);
    lv_obj_set_style_bg_color(s_chart_drive_15s, lv_color_hex(UI_COLOR_BG), 0);
    lv_obj_set_style_border_color(s_chart_drive_15s, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(s_chart_drive_15s, 8, 0);
    lv_obj_set_style_size(s_chart_drive_15s, 0, LV_PART_INDICATOR);
    lv_obj_set_style_line_width(s_chart_drive_15s, 2, LV_PART_ITEMS);

    s_ser_drive_15s_cmd = lv_chart_add_series(s_chart_drive_15s, lv_color_hex(UI_COLOR_ACCENT_CMD), LV_CHART_AXIS_PRIMARY_Y);
    s_ser_drive_15s_act = lv_chart_add_series(s_chart_drive_15s, lv_color_hex(UI_COLOR_ACCENT_ACT), LV_CHART_AXIS_PRIMARY_Y);

    lv_obj_t *btn_pause_d15 = lv_button_create(s_screens[WIN_DRIVE_PLOT_15S]);
    lv_obj_set_size(btn_pause_d15, 180, 44);
    lv_obj_align(btn_pause_d15, LV_ALIGN_BOTTOM_RIGHT, -8, -6);
    lv_obj_set_style_bg_color(btn_pause_d15, lv_color_hex(UI_COLOR_SURFACE_ALT), 0);
    lv_obj_t *lbl_pd15 = lv_label_create(btn_pause_d15);
    lv_label_set_text(lbl_pd15, "|| FREEZE");
    lv_obj_set_style_text_font(lbl_pd15, &lv_font_montserrat_12, 0);
    lv_obj_align(lbl_pd15, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_pause_d15, btn_pause_event_cb, LV_EVENT_CLICKED, NULL);

    // Initial load: Dashboard
    lv_screen_load(s_screens[WIN_DASHBOARD]);
    ESP_LOGI(TAG, "UI Manager initialized with 8 screens (CAN Watch Cockpit + In-Box 5s Plots)");
}

void ui_manager_switch_window(inspector_window_t win) {
    if (win >= WIN_COUNT || !s_screens[win]) return;
    s_current_win = win;
    lv_screen_load_anim(s_screens[win], LV_SCR_LOAD_ANIM_FADE_ON, 100, 0, false);
}

inspector_window_t ui_manager_get_current_window(void) {
    return s_current_win;
}

void ui_manager_update(const low_bus_telemetry_t *t) {
    if (!t) return;
    char buf[80];

    // Push data to in-box 5-second charts & 15-second charts if not paused
    if (!s_scope_paused) {
        if (s_chart_steer_5s_cmd && s_ser_steer_5s_cmd) {
            lv_chart_set_next_value(s_chart_steer_5s_cmd, s_ser_steer_5s_cmd, (int32_t)t->steer_cmd_deg);
        }
        if (s_chart_steer_5s_act && s_ser_steer_5s_act) {
            lv_chart_set_next_value(s_chart_steer_5s_act, s_ser_steer_5s_act, (int32_t)t->steer_act_deg);
        }
        if (s_chart_brake_5s_cmd && s_ser_brake_5s_cmd) {
            lv_chart_set_next_value(s_chart_brake_5s_cmd, s_ser_brake_5s_cmd, (int32_t)t->brake_cmd_kpa);
        }
        if (s_chart_brake_5s_act && s_ser_brake_5s_act) {
            lv_chart_set_next_value(s_chart_brake_5s_act, s_ser_brake_5s_act, (int32_t)t->brake_act_kpa);
        }
        if (s_chart_drive_5s_cmd && s_ser_drive_5s_cmd) {
            lv_chart_set_next_value(s_chart_drive_5s_cmd, s_ser_drive_5s_cmd, (int32_t)t->drive_cmd_kmh);
        }
        if (s_chart_drive_5s_act && s_ser_drive_5s_act) {
            lv_chart_set_next_value(s_chart_drive_5s_act, s_ser_drive_5s_act, (int32_t)t->drive_act_kmh);
        }

        if (s_chart_steer_15s && s_ser_steer_15s_cmd && s_ser_steer_15s_act) {
            lv_chart_set_next_value(s_chart_steer_15s, s_ser_steer_15s_cmd, (int32_t)t->steer_cmd_deg);
            lv_chart_set_next_value(s_chart_steer_15s, s_ser_steer_15s_act, (int32_t)t->steer_act_deg);
        }
        if (s_chart_brake_15s && s_ser_brake_15s_cmd && s_ser_brake_15s_act) {
            lv_chart_set_next_value(s_chart_brake_15s, s_ser_brake_15s_cmd, (int32_t)t->brake_cmd_kpa);
            lv_chart_set_next_value(s_chart_brake_15s, s_ser_brake_15s_act, (int32_t)t->brake_act_kpa);
        }
        if (s_chart_drive_15s && s_ser_drive_15s_cmd && s_ser_drive_15s_act) {
            lv_chart_set_next_value(s_chart_drive_15s, s_ser_drive_15s_cmd, (int32_t)t->drive_cmd_kmh);
            lv_chart_set_next_value(s_chart_drive_15s, s_ser_drive_15s_act, (int32_t)t->drive_act_kmh);
        }
    }

    const char gear_chars[] = {'P', 'R', 'N', 'D', 'S'};
    char g = (t->drive_act_gear < 5) ? gear_chars[t->drive_act_gear] : 'D';
    bool takeover = (t->ses_control_mode_status == 3);

    // -------------------------------------------------------------------------
    // Update Screen 0: Dashboard (CAN Watch Cockpit)
    // -------------------------------------------------------------------------
    if (s_current_win == WIN_DASHBOARD) {
        if (s_lbl_dash_safety_state) {
            if (t->estop_active) {
                lv_label_set_text(s_lbl_dash_safety_state, "ESTOP ACTIVE");
                lv_obj_set_style_text_color(s_lbl_dash_safety_state, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
                if (s_card_dash_safety) {
                    lv_obj_set_style_bg_color(s_card_dash_safety, lv_color_hex(0x38080F), 0);
                    lv_obj_set_style_border_color(s_card_dash_safety, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
                }
            } else {
                lv_label_set_text(s_lbl_dash_safety_state, "SAFETY OK");
                lv_obj_set_style_text_color(s_lbl_dash_safety_state, lv_color_hex(UI_COLOR_STATE_OK), 0);
                if (s_card_dash_safety) {
                    lv_obj_set_style_bg_color(s_card_dash_safety, lv_color_hex(0x062817), 0);
                    lv_obj_set_style_border_color(s_card_dash_safety, lv_color_hex(UI_COLOR_STATE_OK), 0);
                }
            }
        }

        // Active Gear Highlight
        for (int i = 0; i < 5; i++) {
            if (s_btn_dash_gears[i] && s_lbl_dash_gears[i]) {
                bool is_active = (i == t->drive_act_gear);
                lv_obj_set_style_bg_color(s_btn_dash_gears[i], lv_color_hex(is_active ? UI_COLOR_ACCENT_CMD : 0x121212), 0);
                lv_obj_set_style_text_color(s_lbl_dash_gears[i], lv_color_hex(is_active ? 0x000000 : UI_COLOR_TEXT_SECONDARY), 0);
            }
        }

        // Instrument 1: Speedometer
        if (s_lbl_dash_speed_val) {
            snprintf(buf, sizeof(buf), "%0.1f", t->drive_act_kmh);
            lv_label_set_text(s_lbl_dash_speed_val, buf);
        }
        if (s_lbl_dash_speed_cmd) {
            float delta = fabsf(t->drive_act_kmh - t->drive_cmd_kmh);
            snprintf(buf, sizeof(buf), "CMD: %0.1f km/h [Δ: %0.1f]", t->drive_cmd_kmh, delta);
            lv_label_set_text(s_lbl_dash_speed_cmd, buf);
        }
        if (s_lbl_dash_speed_aux) {
            snprintf(buf, sizeof(buf), "MOTOR: %u RPM • RATIO 8.5:1", t->drive_motor_rpm);
            lv_label_set_text(s_lbl_dash_speed_aux, buf);
        }

        // Instrument 2: Steering Angle
        if (s_lbl_dash_steer_val) {
            snprintf(buf, sizeof(buf), "%+0.1f°", t->steer_act_deg);
            lv_label_set_text(s_lbl_dash_steer_val, buf);
        }
        if (s_lbl_dash_steer_cmd) {
            float delta = fabsf(t->steer_cmd_deg - t->steer_act_deg);
            snprintf(buf, sizeof(buf), "CMD: %+0.1f° [Δ: %0.1f° %s]",
                     t->steer_cmd_deg, delta, delta > 2.0f ? "LAG" : "OK");
            lv_label_set_text(s_lbl_dash_steer_cmd, buf);
        }
        if (s_lbl_dash_steer_torq) {
            snprintf(buf, sizeof(buf), "TORQUE: %+0.1f Nm [%s]",
                     t->steer_torque_nm, takeover ? "TAKEOVER!" : "NO OVERRIDE");
            lv_label_set_text(s_lbl_dash_steer_torq, buf);
            lv_obj_set_style_text_color(s_lbl_dash_steer_torq, lv_color_hex(takeover ? UI_COLOR_STATE_FAULT : UI_COLOR_STATE_WARN), 0);
        }

        // Instrument 3: Hydraulic Brake
        if (s_lbl_dash_brake_val) {
            snprintf(buf, sizeof(buf), "%.0f kPa", t->brake_act_kpa);
            lv_label_set_text(s_lbl_dash_brake_val, buf);
        }
        if (s_bar_dash_brake_act) {
            lv_bar_set_value(s_bar_dash_brake_act, (int32_t)t->brake_act_kpa, LV_ANIM_OFF);
        }
        if (s_bar_dash_brake_cmd) {
            lv_bar_set_value(s_bar_dash_brake_cmd, (int32_t)t->brake_cmd_kpa, LV_ANIM_OFF);
        }
        if (s_lbl_dash_brake_aux) {
            snprintf(buf, sizeof(buf), "STROKE: %0.1f mm  •  TEMP: %0.0f°C",
                     t->brake_act_stroke_mm, t->seb_ecu_temp_c);
            lv_label_set_text(s_lbl_dash_brake_aux, buf);
        }

        // Bottom Strip
        if (s_lbl_dash_bus_strip) {
            snprintf(buf, sizeof(buf),
                     "LOW-BUS CAN: %.0f msg/s  •  TEC: %d | REC: %d [%s]  •  12V Rail: %0.1fV  •  Core: %0.0f°C",
                     t->bus_rate_hz, t->twai_tec, t->twai_rec,
                     t->twai_tec > 96 || t->twai_rec > 96 ? "WARN" : "BUS OK",
                     t->rail_volts_12v, t->esp32_internal_temp_c);
            lv_label_set_text(s_lbl_dash_bus_strip, buf);
        }
    }

    // -------------------------------------------------------------------------
    // Update Screen 1: Steer (SES)
    // -------------------------------------------------------------------------
    else if (s_current_win == WIN_STEER) {
        if (s_lbl_steer_cmd) {
            snprintf(buf, sizeof(buf), "%+0.1f°", t->steer_cmd_deg);
            lv_label_set_text(s_lbl_steer_cmd, buf);
        }
        if (s_lbl_steer_target_spd) {
            snprintf(buf, sizeof(buf), "TARGET SPEED: %0.0f °/s", t->steer_cmd_speed_deg_s);
            lv_label_set_text(s_lbl_steer_target_spd, buf);
        }
        if (s_lbl_steer_cmd_telemetry) {
            snprintf(buf, sizeof(buf), "ROLLING CNT: %u  •  CHK: %s",
                     t->steer_cmd_roll_cnt, t->steer_cmd_chk_valid ? "VALID" : "CRC ERR");
            lv_label_set_text(s_lbl_steer_cmd_telemetry, buf);
        }

        if (s_lbl_steer_act) {
            snprintf(buf, sizeof(buf), "%+0.1f°", t->steer_act_deg);
            lv_label_set_text(s_lbl_steer_act, buf);
        }
        if (s_lbl_steer_actual_spd) {
            snprintf(buf, sizeof(buf), "ACTUAL SPEED: %0.0f °/s", t->steer_act_speed_deg_s);
            lv_label_set_text(s_lbl_steer_actual_spd, buf);
        }
        if (s_lbl_steer_act_telemetry) {
            snprintf(buf, sizeof(buf), "MOTOR: %0.1f A  •  TEMP: %0.0f°C",
                     t->ses_motor_current_a, t->ses_ecu_temp_c);
            lv_label_set_text(s_lbl_steer_act_telemetry, buf);
        }

        if (s_lbl_steer_delta_val) {
            float delta = fabsf(t->steer_cmd_deg - t->steer_act_deg);
            snprintf(buf, sizeof(buf), "Δ: %0.1f°   [ %s ]", delta, delta > 2.0f ? "TRACKING LAG" : "TRACKING OK");
            lv_label_set_text(s_lbl_steer_delta_val, buf);
            if (s_card_steer_delta) {
                lv_obj_set_style_border_color(s_card_steer_delta, lv_color_hex(delta > 2.0f ? UI_COLOR_STATE_FAULT : UI_COLOR_STATE_OK), 0);
            }
        }
        if (s_lbl_steer_torq) {
            snprintf(buf, sizeof(buf), "%+0.1f Nm", t->steer_torque_nm);
            lv_label_set_text(s_lbl_steer_torq, buf);
        }
        if (s_lbl_steer_override) {
            lv_label_set_text(s_lbl_steer_override, takeover ? "[ TAKEOVER ACTIVE! ]" : "[ NO OVERRIDE ]");
            lv_obj_set_style_text_color(s_lbl_steer_override, lv_color_hex(takeover ? UI_COLOR_STATE_FAULT : UI_COLOR_STATE_OK), 0);
        }
        if (s_lbl_steer_dtc) {
            if (t->ses_errors.raw_bitmap != 0) {
                snprintf(buf, sizeof(buf), "DTC: %s (0x%04lX)",
                         t->ses_primary_fault_str ? t->ses_primary_fault_str : "FAULT",
                         (unsigned long)t->ses_errors.raw_bitmap);
                lv_label_set_text(s_lbl_steer_dtc, buf);
                lv_obj_set_style_text_color(s_lbl_steer_dtc, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
            } else {
                lv_label_set_text(s_lbl_steer_dtc, "DTC DIAGNOSIS: ALL CLEAR (0x0000)");
                lv_obj_set_style_text_color(s_lbl_steer_dtc, lv_color_hex(UI_COLOR_STATE_OK), 0);
            }
        }
    }

    // -------------------------------------------------------------------------
    // Update Screen 2: Brake (SEB)
    // -------------------------------------------------------------------------
    else if (s_current_win == WIN_BRAKE) {
        if (s_lbl_brake_cmd) {
            snprintf(buf, sizeof(buf), "%.0f kPa", t->brake_cmd_kpa);
            lv_label_set_text(s_lbl_brake_cmd, buf);
        }
        if (s_lbl_brake_target_stroke) {
            snprintf(buf, sizeof(buf), "TARGET STROKE: %0.1f mm", t->brake_cmd_stroke_mm);
            lv_label_set_text(s_lbl_brake_target_stroke, buf);
        }

        if (s_lbl_brake_act) {
            snprintf(buf, sizeof(buf), "%.0f kPa", t->brake_act_kpa);
            lv_label_set_text(s_lbl_brake_act, buf);
        }
        if (s_lbl_brake_act_stroke) {
            snprintf(buf, sizeof(buf), "ACTUAL STROKE: %0.1f mm", t->brake_act_stroke_mm);
            lv_label_set_text(s_lbl_brake_act_stroke, buf);
        }
        if (s_lbl_brake_act_telemetry) {
            snprintf(buf, sizeof(buf), "MOTOR: %0.1f A  •  TEMP: %0.0f°C",
                     t->seb_motor_current_a, t->seb_ecu_temp_c);
            lv_label_set_text(s_lbl_brake_act_telemetry, buf);
        }

        if (s_lbl_brake_delta_val) {
            float delta = t->brake_act_kpa - t->brake_cmd_kpa;
            snprintf(buf, sizeof(buf), "Δ: %+0.0f kPa   [ %s ]", delta, fabsf(delta) > 50.0f ? "TRACKING LAG" : "TRACKING OK");
            lv_label_set_text(s_lbl_brake_delta_val, buf);
            if (s_card_brake_delta) {
                lv_obj_set_style_border_color(s_card_brake_delta, lv_color_hex(fabsf(delta) > 50.0f ? UI_COLOR_STATE_FAULT : UI_COLOR_STATE_OK), 0);
            }
        }
        if (s_lbl_brake_dtc) {
            if (t->seb_errors.raw_bitmap != 0) {
                snprintf(buf, sizeof(buf), "DTC: %s (0x%04lX)",
                         t->seb_primary_fault_str ? t->seb_primary_fault_str : "FAULT",
                         (unsigned long)t->seb_errors.raw_bitmap);
                lv_label_set_text(s_lbl_brake_dtc, buf);
                lv_obj_set_style_text_color(s_lbl_brake_dtc, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
            } else {
                lv_label_set_text(s_lbl_brake_dtc, "DTC DIAGNOSIS: ALL CLEAR (0x0000)");
                lv_obj_set_style_text_color(s_lbl_brake_dtc, lv_color_hex(UI_COLOR_STATE_OK), 0);
            }
        }
    }

    // -------------------------------------------------------------------------
    // Update Screen 3: Drive (MTR)
    // -------------------------------------------------------------------------
    else if (s_current_win == WIN_DRIVE) {
        if (s_lbl_drive_cmd) {
            snprintf(buf, sizeof(buf), "%0.1f km/h", t->drive_cmd_kmh);
            lv_label_set_text(s_lbl_drive_cmd, buf);
        }
        if (s_lbl_drive_act) {
            snprintf(buf, sizeof(buf), "%0.1f km/h", t->drive_act_kmh);
            lv_label_set_text(s_lbl_drive_act, buf);
        }
        if (s_lbl_drive_act_gear) {
            snprintf(buf, sizeof(buf), "ENGAGED GEAR: [ %c ] (ENGAGED)", g);
            lv_label_set_text(s_lbl_drive_act_gear, buf);
        }
        if (s_lbl_drive_motor_telemetry) {
            snprintf(buf, sizeof(buf), "MOTOR: %u RPM  •  RATIO: 8.5:1", t->drive_motor_rpm);
            lv_label_set_text(s_lbl_drive_motor_telemetry, buf);
        }

        if (s_lbl_drive_delta_val) {
            float delta = fabsf(t->drive_act_kmh - t->drive_cmd_kmh);
            snprintf(buf, sizeof(buf), "Δ: %0.1f km/h   [ %s ]", delta, delta > 2.0f ? "TRACKING LAG" : "TRACKING OK");
            lv_label_set_text(s_lbl_drive_delta_val, buf);
            if (s_card_drive_delta) {
                lv_obj_set_style_border_color(s_card_drive_delta, lv_color_hex(delta > 2.0f ? UI_COLOR_STATE_FAULT : UI_COLOR_STATE_OK), 0);
            }
        }
        if (s_lbl_drive_dtc) {
            if (t->drive_block_mask != 0) {
                snprintf(buf, sizeof(buf), "INTERLOCK BLOCKED (0x%04X)", t->drive_block_mask);
                lv_label_set_text(s_lbl_drive_dtc, buf);
                lv_obj_set_style_text_color(s_lbl_drive_dtc, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
            } else {
                lv_label_set_text(s_lbl_drive_dtc, "DTC DIAGNOSIS: ALL CLEAR (0x0000)");
                lv_obj_set_style_text_color(s_lbl_drive_dtc, lv_color_hex(UI_COLOR_STATE_OK), 0);
            }
        }
    }

    // -------------------------------------------------------------------------
    // Update Screen 4: Detailed Bus & Safety Diagnostics
    // -------------------------------------------------------------------------
    else if (s_current_win == WIN_BUS_SAFETY) {
        if (s_lbl_bus_estop_status) {
            if (t->estop_active) {
                snprintf(buf, sizeof(buf), "[ ! ] E-STOP ACTIVE (TRIPPED BY NODE %d)", t->estop_source_node);
                lv_label_set_text(s_lbl_bus_estop_status, buf);
                lv_obj_set_style_text_color(s_lbl_bus_estop_status, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
            } else {
                lv_label_set_text(s_lbl_bus_estop_status, "[ OK ] E-STOP DISENGAGED (SYSTEM CLEAR)");
                lv_obj_set_style_text_color(s_lbl_bus_estop_status, lv_color_hex(UI_COLOR_STATE_OK), 0);
            }
        }
        if (s_lbl_bus_rail_volts) {
            snprintf(buf, sizeof(buf), "%0.1f V", t->rail_volts_12v);
            lv_label_set_text(s_lbl_bus_rail_volts, buf);
        }
        if (s_lbl_bus_rate) {
            snprintf(buf, sizeof(buf), "%.0f msg/s", t->bus_rate_hz);
            lv_label_set_text(s_lbl_bus_rate, buf);
        }
        if (s_lbl_bus_tec_rec) {
            snprintf(buf, sizeof(buf), "TEC: %d | REC: %d [%s]",
                     t->twai_tec, t->twai_rec, t->twai_tec > 96 || t->twai_rec > 96 ? "WARN" : "NORMAL");
            lv_label_set_text(s_lbl_bus_tec_rec, buf);
        }
        for (int i = 0; i < 5; i++) {
            if (s_lbl_bus_node_rates[i]) {
                snprintf(buf, sizeof(buf), "%.0f Hz", t->nodes[i].rate_hz);
                lv_label_set_text(s_lbl_bus_node_rates[i], buf);
            }
            if (s_lbl_bus_node_states[i]) {
                bool ok = !t->nodes[i].timeout;
                lv_label_set_text(s_lbl_bus_node_states[i], ok ? "[ OK ] ACTIVE" : "[ TIMEOUT ]");
                lv_obj_set_style_text_color(s_lbl_bus_node_states[i], lv_color_hex(ok ? UI_COLOR_STATE_OK : UI_COLOR_STATE_FAULT), 0);
            }
        }
    }

    // -------------------------------------------------------------------------
    // Update Scope Headers (Screens 5, 6, 7)
    // -------------------------------------------------------------------------
    else if (s_current_win == WIN_STEER_PLOT_15S) {
        if (s_lbl_steer_15s_hdr) {
            float delta = fabsf(t->steer_cmd_deg - t->steer_act_deg);
            snprintf(buf, sizeof(buf), "STEER 15s SCOPE • CMD: %+0.1f° | ACT: %+0.1f° | Δ: %0.1f° | Torq: %+0.1fNm",
                     t->steer_cmd_deg, t->steer_act_deg, delta, t->steer_torque_nm);
            lv_label_set_text(s_lbl_steer_15s_hdr, buf);
        }
    } else if (s_current_win == WIN_BRAKE_PLOT_15S) {
        if (s_lbl_brake_15s_hdr) {
            float delta = t->brake_act_kpa - t->brake_cmd_kpa;
            snprintf(buf, sizeof(buf), "BRAKE 15s SCOPE • CMD: %.0fkPa | ACT: %.0fkPa | Δ: %+0.0f | Strk: %0.1fmm",
                     t->brake_cmd_kpa, t->brake_act_kpa, delta, t->brake_act_stroke_mm);
            lv_label_set_text(s_lbl_brake_15s_hdr, buf);
        }
    } else if (s_current_win == WIN_DRIVE_PLOT_15S) {
        if (s_lbl_drive_15s_hdr) {
            float delta = fabsf(t->drive_act_kmh - t->drive_cmd_kmh);
            snprintf(buf, sizeof(buf), "DRIVE 15s SCOPE • CMD: %0.1fkm/h | ACT: %0.1fkm/h | Δ: %0.1f | %u RPM",
                     t->drive_cmd_kmh, t->drive_act_kmh, delta, t->drive_motor_rpm);
            lv_label_set_text(s_lbl_drive_15s_hdr, buf);
        }
    }
}
