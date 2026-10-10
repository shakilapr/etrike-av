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
static lv_obj_t *s_btn_dash_gears[4] = {NULL};
static lv_obj_t *s_lbl_dash_gears[4] = {NULL};

// Row 3: ISO 2575 Telltale cards & labels
static lv_obj_t *s_card_dash_telltales[5] = {NULL};
static lv_obj_t *s_lbl_dash_telltale_sym[5] = {NULL};
static lv_obj_t *s_lbl_dash_telltale_lbl[5] = {NULL};

// Row 3: Subsystem Connectivity Buttons (SYS, RT, HOST, SEB, SES, MTR)
static lv_obj_t *s_btn_dash_nodes[6] = {NULL};
static lv_obj_t *s_lbl_dash_nodes[6] = {NULL};

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
static lv_obj_t *s_lbl_steer_vcu_stat = NULL;

static lv_obj_t *s_lbl_steer_act = NULL;
static lv_obj_t *s_chart_steer_5s_act = NULL;
static lv_chart_series_t *s_ser_steer_5s_act = NULL;
static lv_obj_t *s_lbl_steer_actual_spd = NULL;
static lv_obj_t *s_lbl_steer_act_telemetry = NULL;
static lv_obj_t *s_lbl_steer_align = NULL;
static lv_obj_t *s_lbl_steer_feedback_stat = NULL;

static lv_obj_t *s_lbl_steer_delta_val = NULL;
static lv_obj_t *s_lbl_steer_torq = NULL;
static lv_obj_t *s_lbl_steer_override = NULL;
static lv_obj_t *s_lbl_steer_volt = NULL;
static lv_obj_t *s_lbl_steer_dtc = NULL;
static lv_obj_t *s_lbl_steer_watchdog = NULL;
static lv_obj_t *s_lbl_steer_health = NULL;

/* =========================================================================
 * Screen 2: Brake (SEB) Widgets + In-Box 5s Mini-Plots
 * ========================================================================= */
static lv_obj_t *s_lbl_brake_cmd = NULL;
static lv_obj_t *s_chart_brake_5s_cmd = NULL;
static lv_chart_series_t *s_ser_brake_5s_cmd = NULL;
static lv_obj_t *s_lbl_brake_target_stroke = NULL;
static lv_obj_t *s_lbl_brake_cmd_telemetry = NULL;
static lv_obj_t *s_lbl_brake_vcu_stat = NULL;

static lv_obj_t *s_lbl_brake_act = NULL;
static lv_obj_t *s_chart_brake_5s_act = NULL;
static lv_chart_series_t *s_ser_brake_5s_act = NULL;
static lv_obj_t *s_lbl_brake_act_stroke = NULL;
static lv_obj_t *s_lbl_brake_act_telemetry = NULL;
static lv_obj_t *s_lbl_brake_align = NULL;
static lv_obj_t *s_lbl_brake_feedback_stat = NULL;

static lv_obj_t *s_lbl_brake_delta_val = NULL;
static lv_obj_t *s_lbl_brake_piston_val = NULL;
static lv_obj_t *s_lbl_brake_piston_delta = NULL;
static lv_obj_t *s_lbl_brake_volt = NULL;
static lv_obj_t *s_lbl_brake_dtc = NULL;
static lv_obj_t *s_lbl_brake_watchdog = NULL;
static lv_obj_t *s_lbl_brake_health = NULL;

/* =========================================================================
 * Screen 3: Drive (MTR) Widgets + In-Box 5s Mini-Plots
 * ========================================================================= */
static lv_obj_t *s_lbl_drive_cmd = NULL;
static lv_obj_t *s_chart_drive_5s_cmd = NULL;
static lv_chart_series_t *s_ser_drive_5s_cmd = NULL;
static lv_obj_t *s_lbl_drive_target_gear = NULL;
static lv_obj_t *s_lbl_drive_cmd_telemetry = NULL;
static lv_obj_t *s_lbl_drive_rt_stat = NULL;

static lv_obj_t *s_lbl_drive_act = NULL;
static lv_obj_t *s_chart_drive_5s_act = NULL;
static lv_chart_series_t *s_ser_drive_5s_act = NULL;
static lv_obj_t *s_lbl_drive_act_gear = NULL;
static lv_obj_t *s_lbl_drive_motor_telemetry = NULL;
static lv_obj_t *s_lbl_drive_state_cutout = NULL;
static lv_obj_t *s_lbl_drive_feedback_stat = NULL;

static lv_obj_t *s_lbl_drive_delta_val = NULL;
static lv_obj_t *s_lbl_drive_interlock_val = NULL;
static lv_obj_t *s_lbl_drive_brake_priority = NULL;
static lv_obj_t *s_lbl_drive_volt = NULL;
static lv_obj_t *s_lbl_drive_dtc = NULL;
static lv_obj_t *s_lbl_drive_watchdog = NULL;
static lv_obj_t *s_lbl_drive_health = NULL;

/* =========================================================================
 * Screen 4: Detailed Bus & Safety Diagnostics
 * ========================================================================= */
static lv_obj_t *s_lbl_bus_estop_status = NULL;
static lv_obj_t *s_lbl_bus_estop_origin = NULL;
static lv_obj_t *s_lbl_bus_rail_volts = NULL;
static lv_obj_t *s_lbl_bus_rate = NULL;
static lv_obj_t *s_lbl_bus_tec_rec = NULL;
static lv_obj_t *s_card_bus_nodes[6] = {NULL};
static lv_obj_t *s_lbl_bus_node_rates[6] = {NULL};
static lv_obj_t *s_lbl_bus_node_states[6] = {NULL};
static lv_obj_t *s_lbl_bus_node_silent[6] = {NULL};

/* =========================================================================
 * Screens 5, 6, 7: Expanded 15-Second Scope Plots
 * ========================================================================= */
static lv_chart_series_t *s_ser_steer_15s_cmd = NULL;
static lv_chart_series_t *s_ser_steer_15s_act = NULL;
static lv_chart_series_t *s_ser_steer_15s_aux = NULL;
static lv_obj_t *s_lbl_steer_15s_hdr = NULL;
static lv_obj_t *s_chart_steer_15s = NULL;

static lv_chart_series_t *s_ser_brake_15s_cmd = NULL;
static lv_chart_series_t *s_ser_brake_15s_act = NULL;
static lv_chart_series_t *s_ser_brake_15s_aux = NULL;
static lv_obj_t *s_lbl_brake_15s_hdr = NULL;
static lv_obj_t *s_chart_brake_15s = NULL;

static lv_chart_series_t *s_ser_drive_15s_cmd = NULL;
static lv_chart_series_t *s_ser_drive_15s_act = NULL;
static lv_chart_series_t *s_ser_drive_15s_aux = NULL;
static lv_obj_t *s_lbl_drive_15s_hdr = NULL;
static lv_obj_t *s_chart_drive_15s = NULL;

static lv_obj_t *s_card_steer_bitview = NULL;
static lv_obj_t *s_lbl_steer_bitview = NULL;

static lv_obj_t *s_card_brake_bitview = NULL;
static lv_obj_t *s_lbl_brake_bitview = NULL;

static lv_obj_t *s_card_drive_bitview = NULL;
static lv_obj_t *s_lbl_drive_bitview = NULL;

static bool s_scope_paused = false;

/* =========================================================================
 * Navigation Event Handlers
 * ========================================================================= */
static void btn_nav_event_cb(lv_event_t *e) {
    intptr_t target_win = (intptr_t)lv_event_get_user_data(e);
    ui_manager_switch_window((inspector_window_t)target_win);
}

static void chart_click_nav_cb(lv_event_t *e) {
    intptr_t target_win = (intptr_t)lv_event_get_user_data(e);
    ui_manager_switch_window((inspector_window_t)target_win);
}

static void screen_gesture_nav_cb(lv_event_t *e) {
    lv_dir_t dir = lv_indev_get_gesture_dir(lv_indev_active());
    intptr_t target_win = (intptr_t)lv_event_get_user_data(e);
    if (dir == LV_DIR_BOTTOM) {
        ui_manager_switch_window((inspector_window_t)target_win);
    }
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
    lv_chart_set_div_line_count(chart, 0, 0);            // No division grid lines
    lv_obj_set_style_line_width(chart, 0, LV_PART_MAIN); // Disable grid line drawing
    lv_obj_set_style_bg_color(chart, lv_color_hex(0x080808), 0);
    lv_obj_set_style_border_color(chart, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_border_width(chart, 1, 0);
    lv_obj_set_style_radius(chart, 6, 0);
    lv_obj_set_style_size(chart, 0, 0, LV_PART_INDICATOR); // no dots for smooth line
    lv_obj_set_style_line_width(chart, 2, LV_PART_ITEMS);
    lv_obj_set_style_pad_all(chart, 2, 0);
    lv_obj_add_flag(chart, LV_OBJ_FLAG_CLICKABLE);
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

    const char *gear_names[4] = {"R", "N", "D", "S"};
    for (int g = 0; g < 4; g++) {
        s_btn_dash_gears[g] = lv_obj_create(c_dstate);
        lv_obj_set_size(s_btn_dash_gears[g], 28, 26);
        lv_obj_align(s_btn_dash_gears[g], LV_ALIGN_LEFT_MID, 460 + g * 34, 0);
        bool is_init_n = (g == 1);
        lv_obj_set_style_bg_color(s_btn_dash_gears[g], lv_color_hex(is_init_n ? UI_COLOR_ACCENT_CMD : 0x121212), 0);
        lv_obj_set_style_border_color(s_btn_dash_gears[g], lv_color_hex(UI_COLOR_BORDER), 0);
        lv_obj_set_style_radius(s_btn_dash_gears[g], 4, 0);
        lv_obj_set_style_pad_all(s_btn_dash_gears[g], 0, 0);

        s_lbl_dash_gears[g] = lv_label_create(s_btn_dash_gears[g]);
        lv_label_set_text(s_lbl_dash_gears[g], gear_names[g]);
        lv_obj_set_style_text_font(s_lbl_dash_gears[g], &lv_font_montserrat_12, 0);
        lv_obj_set_style_text_color(s_lbl_dash_gears[g], lv_color_hex(is_init_n ? 0x000000 : UI_COLOR_TEXT_SECONDARY), 0);
        lv_obj_align(s_lbl_dash_gears[g], LV_ALIGN_CENTER, 0, 0);
    }

    lv_obj_t *lbl_lbm = lv_label_create(c_dstate);
    lv_label_set_text(lbl_lbm, "LOW-BUS (500 kbps)");
    lv_obj_set_style_text_font(lbl_lbm, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_lbm, lv_color_hex(UI_COLOR_STATE_OFFLINE), 0);
    lv_obj_align(lbl_lbm, LV_ALIGN_RIGHT_MID, -8, 0);

    // 2. Subsystem Connectivity & Telltales Deck (Y=98, H=46)
    // Left: 5 Compact ISO 2575 Telltales | Right: 6 Node Buttons (SYS, RT, HOST, SEB, SES, MTR)
    lv_obj_t *c_dtell = lv_obj_create(s_screens[WIN_DASHBOARD]);
    lv_obj_set_size(c_dtell, 784, 46);
    lv_obj_align(c_dtell, LV_ALIGN_TOP_MID, 0, 98);
    lv_obj_set_style_bg_color(c_dtell, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_dtell, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_dtell, 6, 0);
    lv_obj_set_style_pad_all(c_dtell, 4, 0);

    // Left: 5 Compact Telltale indicators (W=66, H=32, X=4 + t*70)
    const char *tt_syms[5] = {"<", ">", "!", "*", "P"};
    const char *tt_names[5] = {"LEFT", "RGHT", "HAZD", "BEAM", "BRK"};
    for (int t = 0; t < 5; t++) {
        s_card_dash_telltales[t] = lv_obj_create(c_dtell);
        lv_obj_set_size(s_card_dash_telltales[t], 66, 32);
        lv_obj_align(s_card_dash_telltales[t], LV_ALIGN_LEFT_MID, 4 + t * 70, 0);
        lv_obj_set_style_bg_color(s_card_dash_telltales[t], lv_color_hex(0x121212), 0);
        lv_obj_set_style_border_color(s_card_dash_telltales[t], lv_color_hex(UI_COLOR_BORDER), 0);
        lv_obj_set_style_radius(s_card_dash_telltales[t], 4, 0);
        lv_obj_set_style_pad_all(s_card_dash_telltales[t], 0, 0);

        s_lbl_dash_telltale_sym[t] = lv_label_create(s_card_dash_telltales[t]);
        lv_label_set_text(s_lbl_dash_telltale_sym[t], tt_syms[t]);
        lv_obj_set_style_text_font(s_lbl_dash_telltale_sym[t], &lv_font_montserrat_12, 0);
        lv_obj_set_style_text_color(s_lbl_dash_telltale_sym[t], lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
        lv_obj_align(s_lbl_dash_telltale_sym[t], LV_ALIGN_LEFT_MID, 6, 0);

        s_lbl_dash_telltale_lbl[t] = lv_label_create(s_card_dash_telltales[t]);
        lv_label_set_text(s_lbl_dash_telltale_lbl[t], tt_names[t]);
        lv_obj_set_style_text_font(s_lbl_dash_telltale_lbl[t], &lv_font_montserrat_12, 0);
        lv_obj_set_style_text_color(s_lbl_dash_telltale_lbl[t], lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
        lv_obj_align(s_lbl_dash_telltale_lbl[t], LV_ALIGN_RIGHT_MID, -6, 0);
    }

    // Right: 6 Node Connectivity buttons (SYS, RT, HOST, SEB, SES, MTR) styled just like gears
    const char *dash_node_names[6] = {"SYS", "RT", "HOST", "SEB", "SES", "MTR"};
    const inspector_window_t dash_node_dest[6] = {
        WIN_BUS_SAFETY, WIN_BUS_SAFETY, WIN_BUS_SAFETY,
        WIN_BRAKE, WIN_STEER, WIN_DRIVE
    };
    const int node_w[6] = {58, 52, 66, 58, 58, 58};
    int node_x = 410;
    for (int i = 0; i < 6; i++) {
        s_btn_dash_nodes[i] = lv_btn_create(c_dtell);
        lv_obj_set_size(s_btn_dash_nodes[i], node_w[i], 32);
        lv_obj_align(s_btn_dash_nodes[i], LV_ALIGN_LEFT_MID, node_x, 0);
        lv_obj_set_style_bg_color(s_btn_dash_nodes[i], lv_color_hex(0x121212), 0);
        lv_obj_set_style_border_color(s_btn_dash_nodes[i], lv_color_hex(UI_COLOR_BORDER), 0);
        lv_obj_set_style_border_width(s_btn_dash_nodes[i], 1, 0);
        lv_obj_set_style_radius(s_btn_dash_nodes[i], 4, 0);
        lv_obj_set_style_pad_all(s_btn_dash_nodes[i], 0, 0);
        lv_obj_add_event_cb(s_btn_dash_nodes[i], btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)dash_node_dest[i]);

        s_lbl_dash_nodes[i] = lv_label_create(s_btn_dash_nodes[i]);
        lv_label_set_text(s_lbl_dash_nodes[i], dash_node_names[i]);
        lv_obj_set_style_text_font(s_lbl_dash_nodes[i], &lv_font_montserrat_12, 0);
        lv_obj_set_style_text_color(s_lbl_dash_nodes[i], lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
        lv_obj_align(s_lbl_dash_nodes[i], LV_ALIGN_CENTER, 0, 0);

        node_x += node_w[i] + 4;
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
    lv_label_set_text(s_lbl_dash_speed_cmd, "CMD: 15.0 km/h [DIFF: 0.2]");
    lv_obj_set_style_text_font(s_lbl_dash_speed_cmd, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_speed_cmd, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(s_lbl_dash_speed_cmd, LV_ALIGN_CENTER, 0, 0);

    s_lbl_dash_speed_aux = lv_label_create(c_dspd);
    lv_label_set_text(s_lbl_dash_speed_aux, "GEAR: [ N ]     DIFF: 0.0 km/h");
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
    lv_label_set_text(lbl_stt, "STEERING ANGLE (+/-45 deg)");
    lv_obj_set_style_text_font(lbl_stt, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_stt, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(lbl_stt, LV_ALIGN_TOP_LEFT, 0, 0);

    s_lbl_dash_steer_val = lv_label_create(c_dsteer);
    lv_label_set_text(s_lbl_dash_steer_val, "+14.7 deg");
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
    lv_label_set_text(s_lbl_dash_steer_cmd, "CMD: +15.0 [DIFF: 0.3 OK]");
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
    // Window 1: 1. STEER (SES) - Full Height 364px Cards + Live Bitview Deck
    // =========================================================================
    s_screens[WIN_STEER] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_STEER], lv_color_hex(UI_COLOR_BG), 0);
    lv_obj_add_event_cb(s_screens[WIN_STEER], screen_gesture_nav_cb, LV_EVENT_GESTURE, (void *)(intptr_t)WIN_STEER_PLOT_15S);
    create_top_nav_bar(s_screens[WIN_STEER], WIN_STEER);

    const int act_w = 254;
    const int u_h = 364;
    const int u_y = 52;

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
    lv_label_set_text(s_lbl_steer_cmd, "+15.0 deg");
    lv_obj_set_style_text_font(s_lbl_steer_cmd, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(s_lbl_steer_cmd, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(s_lbl_steer_cmd, LV_ALIGN_TOP_MID, 0, 24);

    // In-Box 5s Mini-Plot under value (Touch navigates to Full Scope)
    s_chart_steer_5s_cmd = create_inbox_sparkline(c_scmd, 226, 86, 74, -45, 45);
    s_ser_steer_5s_cmd = lv_chart_add_series(s_chart_steer_5s_cmd, lv_color_hex(UI_COLOR_ACCENT_CMD), LV_CHART_AXIS_PRIMARY_Y);
    lv_obj_add_event_cb(s_chart_steer_5s_cmd, chart_click_nav_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_STEER_PLOT_15S);

    s_lbl_steer_target_spd = lv_label_create(c_scmd);
    lv_label_set_text(s_lbl_steer_target_spd, "TARGET SPEED: 200 deg/s");
    lv_obj_set_style_text_font(s_lbl_steer_target_spd, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_steer_target_spd, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_steer_target_spd, LV_ALIGN_TOP_LEFT, 0, 168);

    s_lbl_steer_cmd_telemetry = lv_label_create(c_scmd);
    lv_label_set_text(s_lbl_steer_cmd_telemetry, "ROLLING CNT: 7  •  CHK: VALID");
    lv_obj_set_style_text_font(s_lbl_steer_cmd_telemetry, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_cmd_telemetry, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_steer_cmd_telemetry, LV_ALIGN_TOP_LEFT, 0, 196);

    lv_obj_t *lbl_s_id = lv_label_create(c_scmd);
    lv_label_set_text(lbl_s_id, "CAN ID: 0x169 (20ms / 50 Hz)");
    lv_obj_set_style_text_font(lbl_s_id, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_s_id, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_s_id, LV_ALIGN_TOP_LEFT, 0, 224);

    s_lbl_steer_vcu_stat = lv_label_create(c_scmd);
    lv_label_set_text(s_lbl_steer_vcu_stat, "[ OK ] TARGET STREAM (50 Hz)");
    lv_obj_set_style_text_font(s_lbl_steer_vcu_stat, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_vcu_stat, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_steer_vcu_stat, LV_ALIGN_BOTTOM_LEFT, 0, 0);

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
    lv_label_set_text(s_lbl_steer_act, "+14.7 deg");
    lv_obj_set_style_text_font(s_lbl_steer_act, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(s_lbl_steer_act, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_steer_act, LV_ALIGN_TOP_MID, 0, 24);

    // In-Box 5s Mini-Plot under value (Touch navigates to Full Scope)
    s_chart_steer_5s_act = create_inbox_sparkline(c_sact, 226, 86, 74, -45, 45);
    s_ser_steer_5s_act = lv_chart_add_series(s_chart_steer_5s_act, lv_color_hex(UI_COLOR_ACCENT_ACT), LV_CHART_AXIS_PRIMARY_Y);
    lv_obj_add_event_cb(s_chart_steer_5s_act, chart_click_nav_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_STEER_PLOT_15S);

    s_lbl_steer_actual_spd = lv_label_create(c_sact);
    lv_label_set_text(s_lbl_steer_actual_spd, "ACTUAL SPEED: 198 deg/s");
    lv_obj_set_style_text_font(s_lbl_steer_actual_spd, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_steer_actual_spd, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_steer_actual_spd, LV_ALIGN_TOP_LEFT, 0, 168);

    s_lbl_steer_act_telemetry = lv_label_create(c_sact);
    lv_label_set_text(s_lbl_steer_act_telemetry, "MOTOR: 8.4 A  •  TEMP: 34°C");
    lv_obj_set_style_text_font(s_lbl_steer_act_telemetry, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_act_telemetry, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_steer_act_telemetry, LV_ALIGN_TOP_LEFT, 0, 196);

    s_lbl_steer_align = lv_label_create(c_sact);
    lv_label_set_text(s_lbl_steer_align, "ALIGNMENT: ZERO-POINT OK");
    lv_obj_set_style_text_font(s_lbl_steer_align, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_align, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(s_lbl_steer_align, LV_ALIGN_TOP_LEFT, 0, 224);

    s_lbl_steer_feedback_stat = lv_label_create(c_sact);
    lv_label_set_text(s_lbl_steer_feedback_stat, "[ OK ] FEEDBACK STREAM (100 Hz)");
    lv_obj_set_style_text_font(s_lbl_steer_feedback_stat, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_feedback_stat, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_steer_feedback_stat, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Card 3: Delta, Torque & DTC Diagnostics (Flattened)
    lv_obj_t *c_sdt = lv_obj_create(s_screens[WIN_STEER]);
    lv_obj_set_size(c_sdt, act_w, u_h);
    lv_obj_align(c_sdt, LV_ALIGN_TOP_LEFT, 538, u_y);
    lv_obj_set_style_bg_color(c_sdt, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_sdt, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_sdt, 8, 0);

    lv_obj_t *lbl_sdt_title = lv_label_create(c_sdt);
    lv_label_set_text(lbl_sdt_title, "CLOSED-LOOP TRACKING");
    lv_obj_set_style_text_font(lbl_sdt_title, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_sdt_title, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_sdt_title, LV_ALIGN_TOP_LEFT, 0, 0);

    s_lbl_steer_delta_val = lv_label_create(c_sdt);
    lv_label_set_text(s_lbl_steer_delta_val, "DIFF: 0.3 deg  [ OK ]");
    lv_obj_set_style_text_font(s_lbl_steer_delta_val, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_color(s_lbl_steer_delta_val, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_steer_delta_val, LV_ALIGN_TOP_LEFT, 0, 18);

    lv_obj_t *lbl_tt = lv_label_create(c_sdt);
    lv_label_set_text(lbl_tt, "DRIVER COLUMN TORQUE");
    lv_obj_set_style_text_font(lbl_tt, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_tt, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_tt, LV_ALIGN_TOP_LEFT, 0, 64);

    s_lbl_steer_torq = lv_label_create(c_sdt);
    lv_label_set_text(s_lbl_steer_torq, "+0.2 Nm");
    lv_obj_set_style_text_font(s_lbl_steer_torq, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_color(s_lbl_steer_torq, lv_color_hex(UI_COLOR_STATE_WARN), 0);
    lv_obj_align(s_lbl_steer_torq, LV_ALIGN_TOP_LEFT, 0, 82);

    s_lbl_steer_override = lv_label_create(c_sdt);
    lv_label_set_text(s_lbl_steer_override, "[ NO OVERRIDE ]");
    lv_obj_set_style_text_font(s_lbl_steer_override, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_override, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_steer_override, LV_ALIGN_TOP_LEFT, 0, 116);

    s_lbl_steer_volt = lv_label_create(c_sdt);
    lv_label_set_text(s_lbl_steer_volt, "SUPPLY VOLT: 13.8 V  •  CURRENT: OK");
    lv_obj_set_style_text_font(s_lbl_steer_volt, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_volt, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_steer_volt, LV_ALIGN_TOP_LEFT, 0, 168);

    s_lbl_steer_dtc = lv_label_create(c_sdt);
    lv_label_set_text(s_lbl_steer_dtc, "DTC DIAGNOSIS: ALL CLEAR (0x0000)");
    lv_obj_set_style_text_font(s_lbl_steer_dtc, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_dtc, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_steer_dtc, LV_ALIGN_TOP_LEFT, 0, 196);

    s_lbl_steer_watchdog = lv_label_create(c_sdt);
    lv_label_set_text(s_lbl_steer_watchdog, "WATCHDOG: LAST SEEN 10ms AGO");
    lv_obj_set_style_text_font(s_lbl_steer_watchdog, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_watchdog, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(s_lbl_steer_watchdog, LV_ALIGN_TOP_LEFT, 0, 224);

    s_lbl_steer_health = lv_label_create(c_sdt);
    lv_label_set_text(s_lbl_steer_health, "[ OK ] SES HEALTHY (100 Hz)");
    lv_obj_set_style_text_font(s_lbl_steer_health, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_health, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_steer_health, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Bottom Command Signal Bit View Deck (48px)
    s_card_steer_bitview = lv_obj_create(s_screens[WIN_STEER]);
    lv_obj_set_size(s_card_steer_bitview, 784, 48);
    lv_obj_align(s_card_steer_bitview, LV_ALIGN_TOP_MID, 0, 424);
    lv_obj_set_style_bg_color(s_card_steer_bitview, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(s_card_steer_bitview, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
    lv_obj_set_style_border_width(s_card_steer_bitview, 1, 0);
    lv_obj_set_style_radius(s_card_steer_bitview, 6, 0);
    lv_obj_set_style_pad_all(s_card_steer_bitview, 0, 0);

    s_lbl_steer_bitview = lv_label_create(s_card_steer_bitview);
    lv_label_set_text(s_lbl_steer_bitview, "SES CMD [0x169 D0: 0x00]  EN:0  MODE:0  ALIGN:0  •  BITS: [0000 0000]  •  [TOUCH PLOT / SWIPE DOWN]");
    lv_obj_set_style_text_font(s_lbl_steer_bitview, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_bitview, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(s_lbl_steer_bitview, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(s_card_steer_bitview, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_STEER_PLOT_15S);

    // =========================================================================
    // Window 2: 2. BRAKE (SEB) - Full Height 364px Cards + Live Bitview Deck
    // =========================================================================
    s_screens[WIN_BRAKE] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_BRAKE], lv_color_hex(UI_COLOR_BG), 0);
    lv_obj_add_event_cb(s_screens[WIN_BRAKE], screen_gesture_nav_cb, LV_EVENT_GESTURE, (void *)(intptr_t)WIN_BRAKE_PLOT_15S);
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

    // In-Box 5s Mini-Plot under value (Touch navigates to Full Scope)
    s_chart_brake_5s_cmd = create_inbox_sparkline(c_bcmd, 226, 86, 74, 0, 1200);
    s_ser_brake_5s_cmd = lv_chart_add_series(s_chart_brake_5s_cmd, lv_color_hex(UI_COLOR_ACCENT_CMD), LV_CHART_AXIS_PRIMARY_Y);
    lv_obj_add_event_cb(s_chart_brake_5s_cmd, chart_click_nav_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_BRAKE_PLOT_15S);

    s_lbl_brake_target_stroke = lv_label_create(c_bcmd);
    lv_label_set_text(s_lbl_brake_target_stroke, "TARGET STROKE: 18.0 mm");
    lv_obj_set_style_text_font(s_lbl_brake_target_stroke, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_brake_target_stroke, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_brake_target_stroke, LV_ALIGN_TOP_LEFT, 0, 168);

    s_lbl_brake_cmd_telemetry = lv_label_create(c_bcmd);
    lv_label_set_text(s_lbl_brake_cmd_telemetry, "ROLLING CNT: 0  •  MODE: PRES");
    lv_obj_set_style_text_font(s_lbl_brake_cmd_telemetry, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_cmd_telemetry, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_brake_cmd_telemetry, LV_ALIGN_TOP_LEFT, 0, 196);

    lv_obj_t *lbl_b_id = lv_label_create(c_bcmd);
    lv_label_set_text(lbl_b_id, "CAN ID: 0x7B9 (20ms / 50 Hz)");
    lv_obj_set_style_text_font(lbl_b_id, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b_id, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_b_id, LV_ALIGN_TOP_LEFT, 0, 224);

    s_lbl_brake_vcu_stat = lv_label_create(c_bcmd);
    lv_label_set_text(s_lbl_brake_vcu_stat, "[ OK ] TARGET STREAM (50 Hz)");
    lv_obj_set_style_text_font(s_lbl_brake_vcu_stat, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_vcu_stat, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_brake_vcu_stat, LV_ALIGN_BOTTOM_LEFT, 0, 0);

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

    // In-Box 5s Mini-Plot under value (Touch navigates to Full Scope)
    s_chart_brake_5s_act = create_inbox_sparkline(c_bact, 226, 86, 74, 0, 1200);
    s_ser_brake_5s_act = lv_chart_add_series(s_chart_brake_5s_act, lv_color_hex(UI_COLOR_ACCENT_ACT), LV_CHART_AXIS_PRIMARY_Y);
    lv_obj_add_event_cb(s_chart_brake_5s_act, chart_click_nav_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_BRAKE_PLOT_15S);

    s_lbl_brake_act_stroke = lv_label_create(c_bact);
    lv_label_set_text(s_lbl_brake_act_stroke, "ACTUAL STROKE: 17.8 mm");
    lv_obj_set_style_text_font(s_lbl_brake_act_stroke, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_brake_act_stroke, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_brake_act_stroke, LV_ALIGN_TOP_LEFT, 0, 168);

    s_lbl_brake_act_telemetry = lv_label_create(c_bact);
    lv_label_set_text(s_lbl_brake_act_telemetry, "MOTOR: 4.2 A  •  TEMP: 38°C");
    lv_obj_set_style_text_font(s_lbl_brake_act_telemetry, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_act_telemetry, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_brake_act_telemetry, LV_ALIGN_TOP_LEFT, 0, 196);

    s_lbl_brake_align = lv_label_create(c_bact);
    lv_label_set_text(s_lbl_brake_align, "ALIGNMENT: SENSOR ZEROED");
    lv_obj_set_style_text_font(s_lbl_brake_align, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_align, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(s_lbl_brake_align, LV_ALIGN_TOP_LEFT, 0, 224);

    s_lbl_brake_feedback_stat = lv_label_create(c_bact);
    lv_label_set_text(s_lbl_brake_feedback_stat, "[ OK ] FEEDBACK STREAM (100 Hz)");
    lv_obj_set_style_text_font(s_lbl_brake_feedback_stat, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_feedback_stat, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_brake_feedback_stat, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Card 3: Delta, Stroke & Diagnostics (Flattened)
    lv_obj_t *c_bdt = lv_obj_create(s_screens[WIN_BRAKE]);
    lv_obj_set_size(c_bdt, act_w, u_h);
    lv_obj_align(c_bdt, LV_ALIGN_TOP_LEFT, 538, u_y);
    lv_obj_set_style_bg_color(c_bdt, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_bdt, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_bdt, 8, 0);

    lv_obj_t *lbl_bdt_title = lv_label_create(c_bdt);
    lv_label_set_text(lbl_bdt_title, "CLOSED-LOOP TRACKING");
    lv_obj_set_style_text_font(lbl_bdt_title, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_bdt_title, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_bdt_title, LV_ALIGN_TOP_LEFT, 0, 0);

    s_lbl_brake_delta_val = lv_label_create(c_bdt);
    lv_label_set_text(s_lbl_brake_delta_val, "DIFF: -8 kPa  [ OK ]");
    lv_obj_set_style_text_font(s_lbl_brake_delta_val, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_color(s_lbl_brake_delta_val, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_brake_delta_val, LV_ALIGN_TOP_LEFT, 0, 18);

    lv_obj_t *lbl_bst = lv_label_create(c_bdt);
    lv_label_set_text(lbl_bst, "PISTON DISPLACEMENT");
    lv_obj_set_style_text_font(lbl_bst, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_bst, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_bst, LV_ALIGN_TOP_LEFT, 0, 64);

    s_lbl_brake_piston_val = lv_label_create(c_bdt);
    lv_label_set_text(s_lbl_brake_piston_val, "17.8 mm");
    lv_obj_set_style_text_font(s_lbl_brake_piston_val, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_color(s_lbl_brake_piston_val, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_brake_piston_val, LV_ALIGN_TOP_LEFT, 0, 82);

    s_lbl_brake_piston_delta = lv_label_create(c_bdt);
    lv_label_set_text(s_lbl_brake_piston_delta, "[ STROKE DIFF: 0.2 mm OK ]");
    lv_obj_set_style_text_font(s_lbl_brake_piston_delta, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_piston_delta, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_brake_piston_delta, LV_ALIGN_TOP_LEFT, 0, 116);

    s_lbl_brake_volt = lv_label_create(c_bdt);
    lv_label_set_text(s_lbl_brake_volt, "SUPPLY VOLT: 13.8 V  •  CURRENT: OK");
    lv_obj_set_style_text_font(s_lbl_brake_volt, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_volt, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_brake_volt, LV_ALIGN_TOP_LEFT, 0, 168);

    s_lbl_brake_dtc = lv_label_create(c_bdt);
    lv_label_set_text(s_lbl_brake_dtc, "DTC DIAGNOSIS: ALL CLEAR (0x0000)");
    lv_obj_set_style_text_font(s_lbl_brake_dtc, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_dtc, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_brake_dtc, LV_ALIGN_TOP_LEFT, 0, 196);

    s_lbl_brake_watchdog = lv_label_create(c_bdt);
    lv_label_set_text(s_lbl_brake_watchdog, "WATCHDOG: LAST SEEN 10ms AGO");
    lv_obj_set_style_text_font(s_lbl_brake_watchdog, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_watchdog, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(s_lbl_brake_watchdog, LV_ALIGN_TOP_LEFT, 0, 224);

    s_lbl_brake_health = lv_label_create(c_bdt);
    lv_label_set_text(s_lbl_brake_health, "[ OK ] SEB HEALTHY (100 Hz)");
    lv_obj_set_style_text_font(s_lbl_brake_health, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_health, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_brake_health, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Bottom Command Signal Bit View Deck (48px)
    s_card_brake_bitview = lv_obj_create(s_screens[WIN_BRAKE]);
    lv_obj_set_size(s_card_brake_bitview, 784, 48);
    lv_obj_align(s_card_brake_bitview, LV_ALIGN_TOP_MID, 0, 424);
    lv_obj_set_style_bg_color(s_card_brake_bitview, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(s_card_brake_bitview, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
    lv_obj_set_style_border_width(s_card_brake_bitview, 1, 0);
    lv_obj_set_style_radius(s_card_brake_bitview, 6, 0);
    lv_obj_set_style_pad_all(s_card_brake_bitview, 0, 0);

    s_lbl_brake_bitview = lv_label_create(s_card_brake_bitview);
    lv_label_set_text(s_lbl_brake_bitview, "SEB CMD [0x7B9 D0: 0x00]  EN:0  MODE:PRES  AUTO:0  •  BITS: [0000 0000]  •  [TOUCH PLOT / SWIPE DOWN]");
    lv_obj_set_style_text_font(s_lbl_brake_bitview, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_bitview, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(s_lbl_brake_bitview, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(s_card_brake_bitview, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_BRAKE_PLOT_15S);

    // =========================================================================
    // Window 3: 3. DRIVE (MTR) - Full Height 364px Cards + Live Bitview Deck
    // =========================================================================
    s_screens[WIN_DRIVE] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_DRIVE], lv_color_hex(UI_COLOR_BG), 0);
    lv_obj_add_event_cb(s_screens[WIN_DRIVE], screen_gesture_nav_cb, LV_EVENT_GESTURE, (void *)(intptr_t)WIN_DRIVE_PLOT_15S);
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

    // In-Box 5s Mini-Plot under value (Touch navigates to Full Scope)
    s_chart_drive_5s_cmd = create_inbox_sparkline(c_dcmd, 226, 86, 74, 0, 35);
    s_ser_drive_5s_cmd = lv_chart_add_series(s_chart_drive_5s_cmd, lv_color_hex(UI_COLOR_ACCENT_CMD), LV_CHART_AXIS_PRIMARY_Y);
    lv_obj_add_event_cb(s_chart_drive_5s_cmd, chart_click_nav_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_DRIVE_PLOT_15S);

    s_lbl_drive_target_gear = lv_label_create(c_dcmd);
    lv_label_set_text(s_lbl_drive_target_gear, "TARGET GEAR: [ N ] (NEUTRAL)");
    lv_obj_set_style_text_font(s_lbl_drive_target_gear, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_drive_target_gear, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_drive_target_gear, LV_ALIGN_TOP_LEFT, 0, 168);

    s_lbl_drive_cmd_telemetry = lv_label_create(c_dcmd);
    lv_label_set_text(s_lbl_drive_cmd_telemetry, "MODE: SPEED CTRL  •  LIM: 25 km/h");
    lv_obj_set_style_text_font(s_lbl_drive_cmd_telemetry, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_drive_cmd_telemetry, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_drive_cmd_telemetry, LV_ALIGN_TOP_LEFT, 0, 196);

    lv_obj_t *lbl_d_id = lv_label_create(c_dcmd);
    lv_label_set_text(lbl_d_id, "CAN ID: 0x204 (20ms / 50 Hz)");
    lv_obj_set_style_text_font(lbl_d_id, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_d_id, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_d_id, LV_ALIGN_TOP_LEFT, 0, 224);

    s_lbl_drive_rt_stat = lv_label_create(c_dcmd);
    lv_label_set_text(s_lbl_drive_rt_stat, "[ OK ] TARGET STREAM (50 Hz)");
    lv_obj_set_style_text_font(s_lbl_drive_rt_stat, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_drive_rt_stat, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_drive_rt_stat, LV_ALIGN_BOTTOM_LEFT, 0, 0);

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

    // In-Box 5s Mini-Plot under value (Touch navigates to Full Scope)
    s_chart_drive_5s_act = create_inbox_sparkline(c_dact, 226, 86, 74, 0, 35);
    s_ser_drive_5s_act = lv_chart_add_series(s_chart_drive_5s_act, lv_color_hex(UI_COLOR_ACCENT_ACT), LV_CHART_AXIS_PRIMARY_Y);
    lv_obj_add_event_cb(s_chart_drive_5s_act, chart_click_nav_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_DRIVE_PLOT_15S);

    s_lbl_drive_act_gear = lv_label_create(c_dact);
    lv_label_set_text(s_lbl_drive_act_gear, "ENGAGED GEAR: [ N ] (NEUTRAL)");
    lv_obj_set_style_text_font(s_lbl_drive_act_gear, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_drive_act_gear, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_drive_act_gear, LV_ALIGN_TOP_LEFT, 0, 168);

    s_lbl_drive_motor_telemetry = lv_label_create(c_dact);
    lv_label_set_text(s_lbl_drive_motor_telemetry, "RATIO: 8.5:1  •  INV: CLOSED-LOOP");
    lv_obj_set_style_text_font(s_lbl_drive_motor_telemetry, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_drive_motor_telemetry, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_drive_motor_telemetry, LV_ALIGN_TOP_LEFT, 0, 196);

    s_lbl_drive_state_cutout = lv_label_create(c_dact);
    lv_label_set_text(s_lbl_drive_state_cutout, "STATE: RUN (0x03) • BRAKE CUT: OK");
    lv_obj_set_style_text_font(s_lbl_drive_state_cutout, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_drive_state_cutout, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(s_lbl_drive_state_cutout, LV_ALIGN_TOP_LEFT, 0, 224);

    s_lbl_drive_feedback_stat = lv_label_create(c_dact);
    lv_label_set_text(s_lbl_drive_feedback_stat, "[ OK ] FEEDBACK STREAM (100 Hz)");
    lv_obj_set_style_text_font(s_lbl_drive_feedback_stat, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_drive_feedback_stat, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_drive_feedback_stat, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Card 3: Delta, Interlocks & Diagnostics (Flattened)
    lv_obj_t *c_ddt = lv_obj_create(s_screens[WIN_DRIVE]);
    lv_obj_set_size(c_ddt, act_w, u_h);
    lv_obj_align(c_ddt, LV_ALIGN_TOP_LEFT, 538, u_y);
    lv_obj_set_style_bg_color(c_ddt, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_ddt, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_ddt, 8, 0);

    lv_obj_t *lbl_ddt_title = lv_label_create(c_ddt);
    lv_label_set_text(lbl_ddt_title, "CLOSED-LOOP TRACKING");
    lv_obj_set_style_text_font(lbl_ddt_title, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_ddt_title, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_ddt_title, LV_ALIGN_TOP_LEFT, 0, 0);

    s_lbl_drive_delta_val = lv_label_create(c_ddt);
    lv_label_set_text(s_lbl_drive_delta_val, "DIFF: 0.2 km/h  [ OK ]");
    lv_obj_set_style_text_font(s_lbl_drive_delta_val, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_color(s_lbl_drive_delta_val, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_drive_delta_val, LV_ALIGN_TOP_LEFT, 0, 18);

    lv_obj_t *lbl_dstitle = lv_label_create(c_ddt);
    lv_label_set_text(lbl_dstitle, "SAFETY INTERLOCKS");
    lv_obj_set_style_text_font(lbl_dstitle, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_dstitle, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_dstitle, LV_ALIGN_TOP_LEFT, 0, 64);

    s_lbl_drive_interlock_val = lv_label_create(c_ddt);
    lv_label_set_text(s_lbl_drive_interlock_val, "ALL CLEAR");
    lv_obj_set_style_text_font(s_lbl_drive_interlock_val, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_color(s_lbl_drive_interlock_val, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_drive_interlock_val, LV_ALIGN_TOP_LEFT, 0, 84);

    s_lbl_drive_brake_priority = lv_label_create(c_ddt);
    lv_label_set_text(s_lbl_drive_brake_priority, "[ BRAKE PRIORITY OK ]");
    lv_obj_set_style_text_font(s_lbl_drive_brake_priority, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_drive_brake_priority, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_drive_brake_priority, LV_ALIGN_TOP_LEFT, 0, 116);

    s_lbl_drive_volt = lv_label_create(c_ddt);
    lv_label_set_text(s_lbl_drive_volt, "SUPPLY VOLT: 13.8 V  •  CURRENT: OK");
    lv_obj_set_style_text_font(s_lbl_drive_volt, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_drive_volt, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_drive_volt, LV_ALIGN_TOP_LEFT, 0, 168);

    s_lbl_drive_dtc = lv_label_create(c_ddt);
    lv_label_set_text(s_lbl_drive_dtc, "DTC DIAGNOSIS: ALL CLEAR (0x0000)");
    lv_obj_set_style_text_font(s_lbl_drive_dtc, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_drive_dtc, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_drive_dtc, LV_ALIGN_TOP_LEFT, 0, 196);

    s_lbl_drive_watchdog = lv_label_create(c_ddt);
    lv_label_set_text(s_lbl_drive_watchdog, "WATCHDOG: LAST SEEN 10ms AGO");
    lv_obj_set_style_text_font(s_lbl_drive_watchdog, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_drive_watchdog, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(s_lbl_drive_watchdog, LV_ALIGN_TOP_LEFT, 0, 224);

    s_lbl_drive_health = lv_label_create(c_ddt);
    lv_label_set_text(s_lbl_drive_health, "[ OK ] MTR HEALTHY (50 Hz)");
    lv_obj_set_style_text_font(s_lbl_drive_health, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_drive_health, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_drive_health, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Bottom Command Signal Bit View Deck (48px)
    s_card_drive_bitview = lv_obj_create(s_screens[WIN_DRIVE]);
    lv_obj_set_size(s_card_drive_bitview, 784, 48);
    lv_obj_align(s_card_drive_bitview, LV_ALIGN_TOP_MID, 0, 424);
    lv_obj_set_style_bg_color(s_card_drive_bitview, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(s_card_drive_bitview, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
    lv_obj_set_style_border_width(s_card_drive_bitview, 1, 0);
    lv_obj_set_style_radius(s_card_drive_bitview, 6, 0);
    lv_obj_set_style_pad_all(s_card_drive_bitview, 0, 0);

    s_lbl_drive_bitview = lv_label_create(s_card_drive_bitview);
    lv_label_set_text(s_lbl_drive_bitview, "MTR CMD [0x204]  RAW: 00 00 00 00 00  •  GEAR: N  EN: 0  •  [TOUCH PLOT / SWIPE DOWN]");
    lv_obj_set_style_text_font(s_lbl_drive_bitview, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_drive_bitview, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(s_lbl_drive_bitview, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(s_card_drive_bitview, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_DRIVE_PLOT_15S);

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

    // Watchdog Deck: 6 Node cards (Height 200px)
    const char *node_names[6] = {
        "SYS (0x011)", "RT (0x210)", "HOST (0x7FC)", "SEB (0x721)", "SES (0x201)", "MTR (0x206)"
    };
    const int w6_w = 124;
    for (int i = 0; i < 6; i++) {
        s_card_bus_nodes[i] = lv_obj_create(s_screens[WIN_BUS_SAFETY]);
        lv_obj_set_size(s_card_bus_nodes[i], w6_w, 200);
        lv_obj_align(s_card_bus_nodes[i], LV_ALIGN_TOP_LEFT, 8 + i * (w6_w + 6), 268);
        lv_obj_set_style_bg_color(s_card_bus_nodes[i], lv_color_hex(UI_COLOR_SURFACE), 0);
        lv_obj_set_style_border_color(s_card_bus_nodes[i], lv_color_hex(UI_COLOR_BORDER), 0);
        lv_obj_set_style_radius(s_card_bus_nodes[i], 8, 0);

        lv_obj_t *lbl_n = lv_label_create(s_card_bus_nodes[i]);
        lv_label_set_text(lbl_n, node_names[i]);
        lv_obj_set_style_text_font(lbl_n, &lv_font_montserrat_12, 0);
        lv_obj_align(lbl_n, LV_ALIGN_TOP_MID, 0, 4);
        lv_obj_set_style_text_color(lbl_n, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);

        s_lbl_bus_node_rates[i] = lv_label_create(s_card_bus_nodes[i]);
        lv_label_set_text(s_lbl_bus_node_rates[i], "0 Hz");
        lv_obj_set_style_text_font(s_lbl_bus_node_rates[i], &lv_font_montserrat_24, 0);
        lv_obj_align(s_lbl_bus_node_rates[i], LV_ALIGN_CENTER, 0, -18);
        lv_obj_set_style_text_color(s_lbl_bus_node_rates[i], lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);

        s_lbl_bus_node_silent[i] = lv_label_create(s_card_bus_nodes[i]);
        lv_label_set_text(s_lbl_bus_node_silent[i], "0 ms ago");
        lv_obj_set_style_text_font(s_lbl_bus_node_silent[i], &lv_font_montserrat_12, 0);
        lv_obj_align(s_lbl_bus_node_silent[i], LV_ALIGN_CENTER, 0, 10);
        lv_obj_set_style_text_color(s_lbl_bus_node_silent[i], lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);

        s_lbl_bus_node_states[i] = lv_label_create(s_card_bus_nodes[i]);
        lv_label_set_text(s_lbl_bus_node_states[i], "[ TIMEOUT ]");
        lv_obj_set_style_text_font(s_lbl_bus_node_states[i], &lv_font_montserrat_14, 0);
        lv_obj_align(s_lbl_bus_node_states[i], LV_ALIGN_BOTTOM_MID, 0, -8);
        lv_obj_set_style_text_color(s_lbl_bus_node_states[i], lv_color_hex(UI_COLOR_STATE_FAULT), 0);
    }

    // =========================================================================
    // Window 5: 15-Second High-Resolution Steer Scope (Maximized 426px Height)
    // =========================================================================
    s_screens[WIN_STEER_PLOT_15S] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_STEER_PLOT_15S], lv_color_hex(UI_COLOR_BG), 0);

    lv_obj_t *hdr_s15 = lv_obj_create(s_screens[WIN_STEER_PLOT_15S]);
    lv_obj_set_size(hdr_s15, 784, 42);
    lv_obj_align(hdr_s15, LV_ALIGN_TOP_MID, 0, 4);
    lv_obj_set_style_bg_color(hdr_s15, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(hdr_s15, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(hdr_s15, 6, 0);
    lv_obj_set_style_pad_all(hdr_s15, 0, 0);

    lv_obj_t *btn_back_s = lv_button_create(hdr_s15);
    lv_obj_set_size(btn_back_s, 110, 32);
    lv_obj_align(btn_back_s, LV_ALIGN_LEFT_MID, 4, 0);
    lv_obj_set_style_bg_color(btn_back_s, lv_color_hex(UI_COLOR_SURFACE_ALT), 0);
    lv_obj_t *lbl_bs = lv_label_create(btn_back_s);
    lv_label_set_text(lbl_bs, "< NUMERICS");
    lv_obj_set_style_text_font(lbl_bs, &lv_font_montserrat_12, 0);
    lv_obj_align(lbl_bs, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_back_s, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_STEER);

    s_lbl_steer_15s_hdr = lv_label_create(hdr_s15);
    lv_label_set_text(s_lbl_steer_15s_hdr, "STEER 15s SCOPE  •  CMD: +15.0 deg  |  ACT: +14.7 deg  |  DIFF: 0.3 deg  |  Torque: +0.2 Nm");
    lv_obj_set_style_text_font(s_lbl_steer_15s_hdr, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_15s_hdr, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_steer_15s_hdr, LV_ALIGN_LEFT_MID, 122, 0);

    lv_obj_t *btn_pause_s15 = lv_button_create(hdr_s15);
    lv_obj_set_size(btn_pause_s15, 100, 32);
    lv_obj_align(btn_pause_s15, LV_ALIGN_RIGHT_MID, -4, 0);
    lv_obj_set_style_bg_color(btn_pause_s15, lv_color_hex(UI_COLOR_SURFACE_ALT), 0);
    lv_obj_t *lbl_ps15 = lv_label_create(btn_pause_s15);
    lv_label_set_text(lbl_ps15, "|| FREEZE");
    lv_obj_set_style_text_font(lbl_ps15, &lv_font_montserrat_12, 0);
    lv_obj_align(lbl_ps15, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_pause_s15, btn_pause_event_cb, LV_EVENT_CLICKED, NULL);

    s_chart_steer_15s = lv_chart_create(s_screens[WIN_STEER_PLOT_15S]);
    lv_obj_set_size(s_chart_steer_15s, 784, 426);
    lv_obj_align(s_chart_steer_15s, LV_ALIGN_TOP_MID, 0, 50);
    lv_chart_set_type(s_chart_steer_15s, LV_CHART_TYPE_LINE);
    lv_chart_set_point_count(s_chart_steer_15s, PLOT_POINTS_15S);
    lv_chart_set_update_mode(s_chart_steer_15s, LV_CHART_UPDATE_MODE_SHIFT);
    lv_chart_set_range(s_chart_steer_15s, LV_CHART_AXIS_PRIMARY_Y, -45, 45);
    lv_chart_set_range(s_chart_steer_15s, LV_CHART_AXIS_SECONDARY_Y, -10, 10);
    lv_chart_set_div_line_count(s_chart_steer_15s, 5, 7);
    lv_obj_set_style_bg_color(s_chart_steer_15s, lv_color_hex(0x080D14), 0);
    lv_obj_set_style_border_color(s_chart_steer_15s, lv_color_hex(0x1E3A50), 0);
    lv_obj_set_style_line_color(s_chart_steer_15s, lv_color_hex(0x152230), LV_PART_MAIN);
    lv_obj_set_style_radius(s_chart_steer_15s, 6, 0);
    lv_obj_set_style_size(s_chart_steer_15s, 0, 0, LV_PART_INDICATOR);
    lv_obj_set_style_line_width(s_chart_steer_15s, 2, LV_PART_ITEMS);

    s_ser_steer_15s_cmd = lv_chart_add_series(s_chart_steer_15s, lv_color_hex(UI_COLOR_ACCENT_CMD), LV_CHART_AXIS_PRIMARY_Y);
    s_ser_steer_15s_act = lv_chart_add_series(s_chart_steer_15s, lv_color_hex(UI_COLOR_ACCENT_ACT), LV_CHART_AXIS_PRIMARY_Y);
    s_ser_steer_15s_aux = lv_chart_add_series(s_chart_steer_15s, lv_color_hex(UI_COLOR_STATE_WARN), LV_CHART_AXIS_SECONDARY_Y);

    lv_obj_t *leg_s = lv_label_create(s_chart_steer_15s);
    lv_label_set_text(leg_s, "[CYAN: CMD]    [GREEN: ACT]    [AMBER: TORQUE (+/-10 Nm)]");
    lv_obj_set_style_text_font(leg_s, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(leg_s, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(leg_s, LV_ALIGN_TOP_MID, 0, 6);

    lv_obj_t *lbl_s_yt = lv_label_create(s_chart_steer_15s);
    lv_label_set_text(lbl_s_yt, "+45 deg");
    lv_obj_set_style_text_font(lbl_s_yt, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_s_yt, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(lbl_s_yt, LV_ALIGN_TOP_LEFT, 6, 6);

    lv_obj_t *lbl_s_ym = lv_label_create(s_chart_steer_15s);
    lv_label_set_text(lbl_s_ym, "0 deg");
    lv_obj_set_style_text_font(lbl_s_ym, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_s_ym, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_s_ym, LV_ALIGN_LEFT_MID, 6, 0);

    lv_obj_t *lbl_s_yb = lv_label_create(s_chart_steer_15s);
    lv_label_set_text(lbl_s_yb, "-45 deg");
    lv_obj_set_style_text_font(lbl_s_yb, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_s_yb, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(lbl_s_yb, LV_ALIGN_BOTTOM_LEFT, 6, -6);

    lv_obj_t *lbl_s_tt = lv_label_create(s_chart_steer_15s);
    lv_label_set_text(lbl_s_tt, "+10 Nm");
    lv_obj_set_style_text_font(lbl_s_tt, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_s_tt, lv_color_hex(UI_COLOR_STATE_WARN), 0);
    lv_obj_align(lbl_s_tt, LV_ALIGN_TOP_RIGHT, -6, 6);

    lv_obj_t *lbl_s_tb = lv_label_create(s_chart_steer_15s);
    lv_label_set_text(lbl_s_tb, "-10 Nm");
    lv_obj_set_style_text_font(lbl_s_tb, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_s_tb, lv_color_hex(UI_COLOR_STATE_WARN), 0);
    lv_obj_align(lbl_s_tb, LV_ALIGN_BOTTOM_RIGHT, -6, -6);

    lv_obj_t *lbl_s_time = lv_label_create(s_chart_steer_15s);
    lv_label_set_text(lbl_s_time, "-15s                  -10s                  -5s                  NOW");
    lv_obj_set_style_text_font(lbl_s_time, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_s_time, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
    lv_obj_align(lbl_s_time, LV_ALIGN_BOTTOM_MID, 0, -6);

    // =========================================================================
    // Window 6: 15-Second High-Resolution Brake Scope (Maximized 426px Height)
    // =========================================================================
    s_screens[WIN_BRAKE_PLOT_15S] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_BRAKE_PLOT_15S], lv_color_hex(UI_COLOR_BG), 0);

    lv_obj_t *hdr_b15 = lv_obj_create(s_screens[WIN_BRAKE_PLOT_15S]);
    lv_obj_set_size(hdr_b15, 784, 42);
    lv_obj_align(hdr_b15, LV_ALIGN_TOP_MID, 0, 4);
    lv_obj_set_style_bg_color(hdr_b15, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(hdr_b15, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(hdr_b15, 6, 0);
    lv_obj_set_style_pad_all(hdr_b15, 0, 0);

    lv_obj_t *btn_back_b = lv_button_create(hdr_b15);
    lv_obj_set_size(btn_back_b, 110, 32);
    lv_obj_align(btn_back_b, LV_ALIGN_LEFT_MID, 4, 0);
    lv_obj_set_style_bg_color(btn_back_b, lv_color_hex(UI_COLOR_SURFACE_ALT), 0);
    lv_obj_t *lbl_bb = lv_label_create(btn_back_b);
    lv_label_set_text(lbl_bb, "< NUMERICS");
    lv_obj_set_style_text_font(lbl_bb, &lv_font_montserrat_12, 0);
    lv_obj_align(lbl_bb, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_back_b, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_BRAKE);

    s_lbl_brake_15s_hdr = lv_label_create(hdr_b15);
    lv_label_set_text(s_lbl_brake_15s_hdr, "BRAKE 15s SCOPE  •  CMD: 450 kPa  |  ACT: 442 kPa  |  DIFF: -8 kPa  |  Stroke: 17.8mm");
    lv_obj_set_style_text_font(s_lbl_brake_15s_hdr, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_15s_hdr, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_brake_15s_hdr, LV_ALIGN_LEFT_MID, 122, 0);

    lv_obj_t *btn_pause_b15 = lv_button_create(hdr_b15);
    lv_obj_set_size(btn_pause_b15, 100, 32);
    lv_obj_align(btn_pause_b15, LV_ALIGN_RIGHT_MID, -4, 0);
    lv_obj_set_style_bg_color(btn_pause_b15, lv_color_hex(UI_COLOR_SURFACE_ALT), 0);
    lv_obj_t *lbl_pb15 = lv_label_create(btn_pause_b15);
    lv_label_set_text(lbl_pb15, "|| FREEZE");
    lv_obj_set_style_text_font(lbl_pb15, &lv_font_montserrat_12, 0);
    lv_obj_align(lbl_pb15, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_pause_b15, btn_pause_event_cb, LV_EVENT_CLICKED, NULL);

    s_chart_brake_15s = lv_chart_create(s_screens[WIN_BRAKE_PLOT_15S]);
    lv_obj_set_size(s_chart_brake_15s, 784, 426);
    lv_obj_align(s_chart_brake_15s, LV_ALIGN_TOP_MID, 0, 50);
    lv_chart_set_type(s_chart_brake_15s, LV_CHART_TYPE_LINE);
    lv_chart_set_point_count(s_chart_brake_15s, PLOT_POINTS_15S);
    lv_chart_set_update_mode(s_chart_brake_15s, LV_CHART_UPDATE_MODE_SHIFT);
    lv_chart_set_range(s_chart_brake_15s, LV_CHART_AXIS_PRIMARY_Y, 0, 1200);
    lv_chart_set_range(s_chart_brake_15s, LV_CHART_AXIS_SECONDARY_Y, 0, 25);
    lv_chart_set_div_line_count(s_chart_brake_15s, 5, 7);
    lv_obj_set_style_bg_color(s_chart_brake_15s, lv_color_hex(0x080D14), 0);
    lv_obj_set_style_border_color(s_chart_brake_15s, lv_color_hex(0x1E3A50), 0);
    lv_obj_set_style_line_color(s_chart_brake_15s, lv_color_hex(0x152230), LV_PART_MAIN);
    lv_obj_set_style_radius(s_chart_brake_15s, 6, 0);
    lv_obj_set_style_size(s_chart_brake_15s, 0, 0, LV_PART_INDICATOR);
    lv_obj_set_style_line_width(s_chart_brake_15s, 2, LV_PART_ITEMS);

    s_ser_brake_15s_cmd = lv_chart_add_series(s_chart_brake_15s, lv_color_hex(UI_COLOR_ACCENT_CMD), LV_CHART_AXIS_PRIMARY_Y);
    s_ser_brake_15s_act = lv_chart_add_series(s_chart_brake_15s, lv_color_hex(UI_COLOR_ACCENT_ACT), LV_CHART_AXIS_PRIMARY_Y);
    s_ser_brake_15s_aux = lv_chart_add_series(s_chart_brake_15s, lv_color_hex(0xA855F7), LV_CHART_AXIS_SECONDARY_Y);

    lv_obj_t *leg_b = lv_label_create(s_chart_brake_15s);
    lv_label_set_text(leg_b, "[CYAN: CMD]    [GREEN: ACT]    [PURPLE: STROKE (0-25 mm)]");
    lv_obj_set_style_text_font(leg_b, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(leg_b, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(leg_b, LV_ALIGN_TOP_MID, 0, 6);

    lv_obj_t *lbl_b_yt = lv_label_create(s_chart_brake_15s);
    lv_label_set_text(lbl_b_yt, "1200 kPa");
    lv_obj_set_style_text_font(lbl_b_yt, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b_yt, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(lbl_b_yt, LV_ALIGN_TOP_LEFT, 6, 6);

    lv_obj_t *lbl_b_ym = lv_label_create(s_chart_brake_15s);
    lv_label_set_text(lbl_b_ym, "600 kPa");
    lv_obj_set_style_text_font(lbl_b_ym, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b_ym, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_b_ym, LV_ALIGN_LEFT_MID, 6, 0);

    lv_obj_t *lbl_b_yb = lv_label_create(s_chart_brake_15s);
    lv_label_set_text(lbl_b_yb, "0 kPa");
    lv_obj_set_style_text_font(lbl_b_yb, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b_yb, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(lbl_b_yb, LV_ALIGN_BOTTOM_LEFT, 6, -6);

    lv_obj_t *lbl_b_stk_t = lv_label_create(s_chart_brake_15s);
    lv_label_set_text(lbl_b_stk_t, "25 mm");
    lv_obj_set_style_text_font(lbl_b_stk_t, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b_stk_t, lv_color_hex(0xA855F7), 0);
    lv_obj_align(lbl_b_stk_t, LV_ALIGN_TOP_RIGHT, -6, 6);

    lv_obj_t *lbl_b_stk_b = lv_label_create(s_chart_brake_15s);
    lv_label_set_text(lbl_b_stk_b, "0 mm");
    lv_obj_set_style_text_font(lbl_b_stk_b, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b_stk_b, lv_color_hex(0xA855F7), 0);
    lv_obj_align(lbl_b_stk_b, LV_ALIGN_BOTTOM_RIGHT, -6, -6);

    lv_obj_t *lbl_b_time = lv_label_create(s_chart_brake_15s);
    lv_label_set_text(lbl_b_time, "-15s                  -10s                  -5s                  NOW");
    lv_obj_set_style_text_font(lbl_b_time, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b_time, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
    lv_obj_align(lbl_b_time, LV_ALIGN_BOTTOM_MID, 0, -6);

    // =========================================================================
    // Window 7: 15-Second High-Resolution Drive Scope (Maximized 426px Height)
    // =========================================================================
    s_screens[WIN_DRIVE_PLOT_15S] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_DRIVE_PLOT_15S], lv_color_hex(UI_COLOR_BG), 0);

    lv_obj_t *hdr_d15 = lv_obj_create(s_screens[WIN_DRIVE_PLOT_15S]);
    lv_obj_set_size(hdr_d15, 784, 42);
    lv_obj_align(hdr_d15, LV_ALIGN_TOP_MID, 0, 4);
    lv_obj_set_style_bg_color(hdr_d15, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(hdr_d15, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(hdr_d15, 6, 0);
    lv_obj_set_style_pad_all(hdr_d15, 0, 0);

    lv_obj_t *btn_back_d = lv_button_create(hdr_d15);
    lv_obj_set_size(btn_back_d, 110, 32);
    lv_obj_align(btn_back_d, LV_ALIGN_LEFT_MID, 4, 0);
    lv_obj_set_style_bg_color(btn_back_d, lv_color_hex(UI_COLOR_SURFACE_ALT), 0);
    lv_obj_t *lbl_bd = lv_label_create(btn_back_d);
    lv_label_set_text(lbl_bd, "< NUMERICS");
    lv_obj_set_style_text_font(lbl_bd, &lv_font_montserrat_12, 0);
    lv_obj_align(lbl_bd, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_back_d, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_DRIVE);

    s_lbl_drive_15s_hdr = lv_label_create(hdr_d15);
    lv_label_set_text(s_lbl_drive_15s_hdr, "DRIVE 15s SCOPE  •  CMD: 0.0 km/h  |  ACT: 0.0 km/h  |  DIFF: 0.0 km/h  |  GEAR: N");
    lv_obj_set_style_text_font(s_lbl_drive_15s_hdr, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_drive_15s_hdr, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_drive_15s_hdr, LV_ALIGN_LEFT_MID, 122, 0);

    lv_obj_t *btn_pause_d15 = lv_button_create(hdr_d15);
    lv_obj_set_size(btn_pause_d15, 100, 32);
    lv_obj_align(btn_pause_d15, LV_ALIGN_RIGHT_MID, -4, 0);
    lv_obj_set_style_bg_color(btn_pause_d15, lv_color_hex(UI_COLOR_SURFACE_ALT), 0);
    lv_obj_t *lbl_pd15 = lv_label_create(btn_pause_d15);
    lv_label_set_text(lbl_pd15, "|| FREEZE");
    lv_obj_set_style_text_font(lbl_pd15, &lv_font_montserrat_12, 0);
    lv_obj_align(lbl_pd15, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_pause_d15, btn_pause_event_cb, LV_EVENT_CLICKED, NULL);

    s_chart_drive_15s = lv_chart_create(s_screens[WIN_DRIVE_PLOT_15S]);
    lv_obj_set_size(s_chart_drive_15s, 784, 426);
    lv_obj_align(s_chart_drive_15s, LV_ALIGN_TOP_MID, 0, 50);
    lv_chart_set_type(s_chart_drive_15s, LV_CHART_TYPE_LINE);
    lv_chart_set_point_count(s_chart_drive_15s, PLOT_POINTS_15S);
    lv_chart_set_update_mode(s_chart_drive_15s, LV_CHART_UPDATE_MODE_SHIFT);
    lv_chart_set_range(s_chart_drive_15s, LV_CHART_AXIS_PRIMARY_Y, 0, 35);
    lv_chart_set_range(s_chart_drive_15s, LV_CHART_AXIS_SECONDARY_Y, 0, 5);
    lv_chart_set_div_line_count(s_chart_drive_15s, 5, 7);
    lv_obj_set_style_bg_color(s_chart_drive_15s, lv_color_hex(0x080D14), 0);
    lv_obj_set_style_border_color(s_chart_drive_15s, lv_color_hex(0x1E3A50), 0);
    lv_obj_set_style_line_color(s_chart_drive_15s, lv_color_hex(0x152230), LV_PART_MAIN);
    lv_obj_set_style_radius(s_chart_drive_15s, 6, 0);
    lv_obj_set_style_size(s_chart_drive_15s, 0, 0, LV_PART_INDICATOR);
    lv_obj_set_style_line_width(s_chart_drive_15s, 2, LV_PART_ITEMS);

    s_ser_drive_15s_cmd = lv_chart_add_series(s_chart_drive_15s, lv_color_hex(UI_COLOR_ACCENT_CMD), LV_CHART_AXIS_PRIMARY_Y);
    s_ser_drive_15s_act = lv_chart_add_series(s_chart_drive_15s, lv_color_hex(UI_COLOR_ACCENT_ACT), LV_CHART_AXIS_PRIMARY_Y);
    s_ser_drive_15s_aux = lv_chart_add_series(s_chart_drive_15s, lv_color_hex(UI_COLOR_STATE_WARN), LV_CHART_AXIS_SECONDARY_Y);

    lv_obj_t *leg_d = lv_label_create(s_chart_drive_15s);
    lv_label_set_text(leg_d, "[CYAN: CMD]    [GREEN: ACT]    [AMBER: SPEED DIFF (0-5 km/h)]");
    lv_obj_set_style_text_font(leg_d, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(leg_d, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(leg_d, LV_ALIGN_TOP_MID, 0, 6);

    lv_obj_t *lbl_d_yt = lv_label_create(s_chart_drive_15s);
    lv_label_set_text(lbl_d_yt, "35 km/h");
    lv_obj_set_style_text_font(lbl_d_yt, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_d_yt, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(lbl_d_yt, LV_ALIGN_TOP_LEFT, 6, 6);

    lv_obj_t *lbl_d_ym = lv_label_create(s_chart_drive_15s);
    lv_label_set_text(lbl_d_ym, "17 km/h");
    lv_obj_set_style_text_font(lbl_d_ym, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_d_ym, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_d_ym, LV_ALIGN_LEFT_MID, 6, 0);

    lv_obj_t *lbl_d_yb = lv_label_create(s_chart_drive_15s);
    lv_label_set_text(lbl_d_yb, "0 km/h");
    lv_obj_set_style_text_font(lbl_d_yb, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_d_yb, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(lbl_d_yb, LV_ALIGN_BOTTOM_LEFT, 6, -6);

    lv_obj_t *lbl_d_diff_t = lv_label_create(s_chart_drive_15s);
    lv_label_set_text(lbl_d_diff_t, "5 km/h");
    lv_obj_set_style_text_font(lbl_d_diff_t, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_d_diff_t, lv_color_hex(UI_COLOR_STATE_WARN), 0);
    lv_obj_align(lbl_d_diff_t, LV_ALIGN_TOP_RIGHT, -6, 6);

    lv_obj_t *lbl_d_diff_b = lv_label_create(s_chart_drive_15s);
    lv_label_set_text(lbl_d_diff_b, "0 km/h");
    lv_obj_set_style_text_font(lbl_d_diff_b, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_d_diff_b, lv_color_hex(UI_COLOR_STATE_WARN), 0);
    lv_obj_align(lbl_d_diff_b, LV_ALIGN_BOTTOM_RIGHT, -6, -6);

    lv_obj_t *lbl_d_time = lv_label_create(s_chart_drive_15s);
    lv_label_set_text(lbl_d_time, "-15s                  -10s                  -5s                  NOW");
    lv_obj_set_style_text_font(lbl_d_time, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_d_time, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
    lv_obj_align(lbl_d_time, LV_ALIGN_BOTTOM_MID, 0, -6);

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
    char buf[256];

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
            if (s_ser_steer_15s_aux) {
                lv_chart_set_next_value(s_chart_steer_15s, s_ser_steer_15s_aux, (int32_t)t->steer_torque_nm);
            }
        }
        if (s_chart_brake_15s && s_ser_brake_15s_cmd && s_ser_brake_15s_act) {
            lv_chart_set_next_value(s_chart_brake_15s, s_ser_brake_15s_cmd, (int32_t)t->brake_cmd_kpa);
            lv_chart_set_next_value(s_chart_brake_15s, s_ser_brake_15s_act, (int32_t)t->brake_act_kpa);
            if (s_ser_brake_15s_aux) {
                lv_chart_set_next_value(s_chart_brake_15s, s_ser_brake_15s_aux, (int32_t)t->brake_act_stroke_mm);
            }
        }
        if (s_chart_drive_15s && s_ser_drive_15s_cmd && s_ser_drive_15s_act) {
            lv_chart_set_next_value(s_chart_drive_15s, s_ser_drive_15s_cmd, (int32_t)t->drive_cmd_kmh);
            lv_chart_set_next_value(s_chart_drive_15s, s_ser_drive_15s_act, (int32_t)t->drive_act_kmh);
            if (s_ser_drive_15s_aux) {
                lv_chart_set_next_value(s_chart_drive_15s, s_ser_drive_15s_aux, (int32_t)(fabsf(t->drive_delta_kmh)));
            }
        }
    }

    char g = vehicle_gear_to_char(t->drive_act_gear);
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

        if (s_lbl_dash_mode) {
            if (t->estop_active) {
                lv_label_set_text(s_lbl_dash_mode, "EMERGENCY STOP");
                lv_obj_set_style_text_color(s_lbl_dash_mode, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
                if (s_card_dash_mode) {
                    lv_obj_set_style_bg_color(s_card_dash_mode, lv_color_hex(0x38080F), 0);
                    lv_obj_set_style_border_color(s_card_dash_mode, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
                }
            } else if (takeover) {
                lv_label_set_text(s_lbl_dash_mode, "DRIVER TAKEOVER");
                lv_obj_set_style_text_color(s_lbl_dash_mode, lv_color_hex(UI_COLOR_STATE_WARN), 0);
                if (s_card_dash_mode) {
                    lv_obj_set_style_bg_color(s_card_dash_mode, lv_color_hex(0x382806), 0);
                    lv_obj_set_style_border_color(s_card_dash_mode, lv_color_hex(UI_COLOR_STATE_WARN), 0);
                }
            } else if (t->ses_control_mode_status == 1 && t->seb_control_enable_status) {
                lv_label_set_text(s_lbl_dash_mode, "AUTONOMOUS");
                lv_obj_set_style_text_color(s_lbl_dash_mode, lv_color_hex(UI_COLOR_STATE_OK), 0);
                if (s_card_dash_mode) {
                    lv_obj_set_style_bg_color(s_card_dash_mode, lv_color_hex(0x062817), 0);
                    lv_obj_set_style_border_color(s_card_dash_mode, lv_color_hex(UI_COLOR_STATE_OK), 0);
                }
            } else if (t->drive_act_kmh > 0.5f || fabsf(t->steer_act_deg) > 1.0f) {
                lv_label_set_text(s_lbl_dash_mode, "MANUAL DRIVE");
                lv_obj_set_style_text_color(s_lbl_dash_mode, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
                if (s_card_dash_mode) {
                    lv_obj_set_style_bg_color(s_card_dash_mode, lv_color_hex(0x121A24), 0);
                    lv_obj_set_style_border_color(s_card_dash_mode, lv_color_hex(0x1E3A50), 0);
                }
            } else {
                lv_label_set_text(s_lbl_dash_mode, "STANDBY");
                lv_obj_set_style_text_color(s_lbl_dash_mode, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
                if (s_card_dash_mode) {
                    lv_obj_set_style_bg_color(s_card_dash_mode, lv_color_hex(0x121212), 0);
                    lv_obj_set_style_border_color(s_card_dash_mode, lv_color_hex(UI_COLOR_BORDER), 0);
                }
            }
        }

        // Active Gear Highlight
        // Buttons: 0: R (gear==3), 1: N (gear==0), 2: D (gear==1), 3: S (gear==2)
        int active_btn_idx = -1;
        switch (t->drive_act_gear) {
            case VEHICLE_GEAR_REVERSE: active_btn_idx = 0; break;
            case VEHICLE_GEAR_NEUTRAL: active_btn_idx = 1; break;
            case VEHICLE_GEAR_DRIVE:   active_btn_idx = 2; break;
            case VEHICLE_GEAR_SPORT:   active_btn_idx = 3; break;
            default: break;
        }
        for (int i = 0; i < 4; i++) {
            if (s_btn_dash_gears[i] && s_lbl_dash_gears[i]) {
                bool is_active = (i == active_btn_idx);
                lv_obj_set_style_bg_color(s_btn_dash_gears[i], lv_color_hex(is_active ? UI_COLOR_ACCENT_CMD : 0x121212), 0);
                lv_obj_set_style_text_color(s_lbl_dash_gears[i], lv_color_hex(is_active ? 0x000000 : UI_COLOR_TEXT_SECONDARY), 0);
            }
        }

        // Update Compact ISO 2575 Telltales
        bool tt_active[5] = {
            t->turn_left_active,
            t->turn_right_active,
            t->hazard_active,
            t->high_beam_active,
            t->brake_light_active || t->brake_act_kpa > 100.0f || t->brake_act_stroke_mm > 1.0f
        };
        const uint32_t tt_active_bg[5] = {
            UI_COLOR_STATE_OK,    // Left Turn: Green
            UI_COLOR_STATE_OK,    // Right Turn: Green
            UI_COLOR_STATE_FAULT, // Hazard: Red
            0x2563EB,             // High Beam: Blue
            UI_COLOR_STATE_WARN   // Brake / Park: Amber
        };
        for (int i = 0; i < 5; i++) {
            if (s_card_dash_telltales[i] && s_lbl_dash_telltale_sym[i] && s_lbl_dash_telltale_lbl[i]) {
                if (tt_active[i]) {
                    lv_obj_set_style_bg_color(s_card_dash_telltales[i], lv_color_hex(tt_active_bg[i]), 0);
                    lv_obj_set_style_border_color(s_card_dash_telltales[i], lv_color_hex(tt_active_bg[i]), 0);
                    lv_obj_set_style_text_color(s_lbl_dash_telltale_sym[i], lv_color_hex(0x000000), 0);
                    lv_obj_set_style_text_color(s_lbl_dash_telltale_lbl[i], lv_color_hex(0x000000), 0);
                } else {
                    lv_obj_set_style_bg_color(s_card_dash_telltales[i], lv_color_hex(0x121212), 0);
                    lv_obj_set_style_border_color(s_card_dash_telltales[i], lv_color_hex(UI_COLOR_BORDER), 0);
                    lv_obj_set_style_text_color(s_lbl_dash_telltale_sym[i], lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
                    lv_obj_set_style_text_color(s_lbl_dash_telltale_lbl[i], lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
                }
            }
        }

        // Update Subsystem Connectivity Buttons (SYS, RT, HOST, SEB, SES, MTR)
        // Styled like gear buttons: active = UI_COLOR_STATE_OK (green fill + black text), inactive = dark + grey
        for (int i = 0; i < 6; i++) {
            if (s_btn_dash_nodes[i] && s_lbl_dash_nodes[i]) {
                bool is_conn = (!t->nodes[i].timeout && t->nodes[i].rx_count > 0);
                lv_obj_set_style_bg_color(s_btn_dash_nodes[i], lv_color_hex(is_conn ? UI_COLOR_STATE_OK : 0x121212), 0);
                lv_obj_set_style_border_color(s_btn_dash_nodes[i], lv_color_hex(is_conn ? UI_COLOR_STATE_OK : UI_COLOR_BORDER), 0);
                lv_obj_set_style_text_color(s_lbl_dash_nodes[i], lv_color_hex(is_conn ? 0x000000 : UI_COLOR_TEXT_SECONDARY), 0);
            }
        }

        // Instrument 1: Speedometer
        if (s_lbl_dash_speed_val) {
            snprintf(buf, sizeof(buf), "%0.1f", t->drive_act_kmh);
            lv_label_set_text(s_lbl_dash_speed_val, buf);
        }
        if (s_lbl_dash_speed_cmd) {
            float delta = fabsf(t->drive_act_kmh - t->drive_cmd_kmh);
            snprintf(buf, sizeof(buf), "CMD: %0.1f km/h [DIFF: %0.1f]", t->drive_cmd_kmh, delta);
            lv_label_set_text(s_lbl_dash_speed_cmd, buf);
        }
        if (s_lbl_dash_speed_aux) {
            float delta = fabsf(t->drive_act_kmh - t->drive_cmd_kmh);
            snprintf(buf, sizeof(buf), "GEAR: [ %c ]  •  DIFF: %0.1f km/h", g, delta);
            lv_label_set_text(s_lbl_dash_speed_aux, buf);
        }

        // Instrument 2: Steering Angle
        if (s_lbl_dash_steer_val) {
            snprintf(buf, sizeof(buf), "%+0.1f deg", t->steer_act_deg);
            lv_label_set_text(s_lbl_dash_steer_val, buf);
        }
        if (s_lbl_dash_steer_cmd) {
            float delta = fabsf(t->steer_cmd_deg - t->steer_act_deg);
            snprintf(buf, sizeof(buf), "CMD: %+0.1f [DIFF: %0.1f %s]",
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
            char rail_str[16];
            if (t->rail_volts_12v > 1.0f) {
                snprintf(rail_str, sizeof(rail_str), "%0.1f V", t->rail_volts_12v);
            } else {
                snprintf(rail_str, sizeof(rail_str), "--.- V");
            }
            snprintf(buf, sizeof(buf),
                     "LOW-BUS CAN: %.0f msg/s  •  TEC: %d | REC: %d [%s]  •  12V Rail: %s  •  Core: %0.0f°C",
                     t->bus_rate_hz, t->twai_tec, t->twai_rec,
                     t->twai_tec > 96 || t->twai_rec > 96 ? "WARN" : "BUS OK",
                     rail_str, t->esp32_internal_temp_c);
            lv_label_set_text(s_lbl_dash_bus_strip, buf);
        }
    }

    // -------------------------------------------------------------------------
    // Update Screen 1: Steer (SES)
    // -------------------------------------------------------------------------
    else if (s_current_win == WIN_STEER) {
        if (s_lbl_steer_cmd) {
            snprintf(buf, sizeof(buf), "%+0.1f deg", t->steer_cmd_deg);
            lv_label_set_text(s_lbl_steer_cmd, buf);
        }
        if (s_lbl_steer_target_spd) {
            snprintf(buf, sizeof(buf), "TARGET SPEED: %0.0f deg/s", t->steer_cmd_speed_deg_s);
            lv_label_set_text(s_lbl_steer_target_spd, buf);
        }
        if (s_lbl_steer_cmd_telemetry) {
            snprintf(buf, sizeof(buf), "ROLLING CNT: %u  •  CHK: %s",
                     t->steer_cmd_roll_cnt, t->steer_cmd_chk_valid ? "VALID" : "CRC ERR");
            lv_label_set_text(s_lbl_steer_cmd_telemetry, buf);
        }
        if (s_lbl_steer_vcu_stat) {
            bool en = t->ses_cmd_control_enable;
            lv_label_set_text(s_lbl_steer_vcu_stat, en ? "[ ENABLED ] VCU CONTROL" : "[ DISABLED ] MANUAL MODE");
            lv_obj_set_style_text_color(s_lbl_steer_vcu_stat, lv_color_hex(en ? UI_COLOR_STATE_OK : UI_COLOR_TEXT_SECONDARY), 0);
        }

        if (s_lbl_steer_act) {
            snprintf(buf, sizeof(buf), "%+0.1f deg", t->steer_act_deg);
            lv_label_set_text(s_lbl_steer_act, buf);
        }
        if (s_lbl_steer_actual_spd) {
            snprintf(buf, sizeof(buf), "ACTUAL SPEED: %0.0f deg/s", t->steer_act_speed_deg_s);
            lv_label_set_text(s_lbl_steer_actual_spd, buf);
        }
        if (s_lbl_steer_act_telemetry) {
            snprintf(buf, sizeof(buf), "MOTOR: %0.1f A  •  TEMP: %0.0f°C",
                     t->ses_motor_current_a, t->ses_ecu_temp_c);
            lv_label_set_text(s_lbl_steer_act_telemetry, buf);
        }
        if (s_lbl_steer_align) {
            lv_label_set_text(s_lbl_steer_align, t->ses_align_status ? "ALIGNMENT: ZERO-POINT OK" : "ALIGNMENT: CALIBRATING...");
            lv_obj_set_style_text_color(s_lbl_steer_align, lv_color_hex(t->ses_align_status ? UI_COLOR_STATE_OK : UI_COLOR_STATE_WARN), 0);
        }
        if (s_lbl_steer_feedback_stat) {
            if (t->nodes[NODE_SES].timeout) {
                lv_label_set_text(s_lbl_steer_feedback_stat, "[ TIMEOUT ] FEEDBACK LOST (>250ms)");
                lv_obj_set_style_text_color(s_lbl_steer_feedback_stat, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
            } else {
                snprintf(buf, sizeof(buf), "[ OK ] FEEDBACK (%.0f Hz)", t->nodes[NODE_SES].rate_hz);
                lv_label_set_text(s_lbl_steer_feedback_stat, buf);
                lv_obj_set_style_text_color(s_lbl_steer_feedback_stat, lv_color_hex(UI_COLOR_STATE_OK), 0);
            }
        }

        if (s_lbl_steer_delta_val) {
            float delta = fabsf(t->steer_cmd_deg - t->steer_act_deg);
            snprintf(buf, sizeof(buf), "DIFF: %0.1f deg  [ %s ]", delta, delta > 2.0f ? "LAG" : "OK");
            lv_label_set_text(s_lbl_steer_delta_val, buf);
            lv_obj_set_style_text_color(s_lbl_steer_delta_val, lv_color_hex(delta > 2.0f ? UI_COLOR_STATE_FAULT : UI_COLOR_STATE_OK), 0);
        }
        if (s_lbl_steer_torq) {
            snprintf(buf, sizeof(buf), "%+0.1f Nm", t->steer_torque_nm);
            lv_label_set_text(s_lbl_steer_torq, buf);
        }
        if (s_lbl_steer_override) {
            lv_label_set_text(s_lbl_steer_override, takeover ? "[ TAKEOVER ACTIVE! ]" : "[ NO OVERRIDE ]");
            lv_obj_set_style_text_color(s_lbl_steer_override, lv_color_hex(takeover ? UI_COLOR_STATE_FAULT : UI_COLOR_STATE_OK), 0);
        }
        if (s_lbl_steer_volt) {
            float volt = t->ses_pow_volt_v > 5.0f ? t->ses_pow_volt_v : t->rail_volts_12v;
            if (volt > 5.0f) {
                float pwr = volt * fabsf(t->ses_motor_current_a);
                snprintf(buf, sizeof(buf), "SUPPLY VOLT: %0.1f V  •  PWR: %0.0f W", volt, pwr);
            } else {
                snprintf(buf, sizeof(buf), "SUPPLY VOLT: --.- V  •  PWR: 0 W");
            }
            lv_label_set_text(s_lbl_steer_volt, buf);
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
        if (s_lbl_steer_watchdog) {
            snprintf(buf, sizeof(buf), "NODE SILENCE: %lu ms  •  RX: %lu",
                     (unsigned long)t->nodes[NODE_SES].silent_ms, (unsigned long)t->nodes[NODE_SES].rx_count);
            lv_label_set_text(s_lbl_steer_watchdog, buf);
        }
        if (s_lbl_steer_health) {
            if (t->nodes[NODE_SES].timeout) {
                lv_label_set_text(s_lbl_steer_health, "[ FAULT ] NODE OFFLINE");
                lv_obj_set_style_text_color(s_lbl_steer_health, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
            } else if (t->ses_errors.raw_bitmap != 0) {
                lv_label_set_text(s_lbl_steer_health, "[ WARN ] DTC ACTIVE");
                lv_obj_set_style_text_color(s_lbl_steer_health, lv_color_hex(UI_COLOR_STATE_WARN), 0);
            } else {
                lv_label_set_text(s_lbl_steer_health, "[ OK ] ACTUATOR HEALTHY");
                lv_obj_set_style_text_color(s_lbl_steer_health, lv_color_hex(UI_COLOR_STATE_OK), 0);
            }
        }
        if (s_lbl_steer_bitview) {
            uint8_t b = t->ses_cmd_byte0;
            snprintf(buf, sizeof(buf),
                     "SES CMD [0x169 D0: 0x%02X]  EN:%d  MODE:%d  ALIGN:%d  •  BITS: [%c%c%c%c %c%c%c%c]  •  [TOUCH PLOT / SWIPE DOWN]",
                     b,
                     (b & 0x01) ? 1 : 0,
                     (b & 0x02) ? 1 : 0,
                     (b & 0x04) ? 1 : 0,
                     (b & 0x80) ? '1' : '0', (b & 0x40) ? '1' : '0', (b & 0x20) ? '1' : '0', (b & 0x10) ? '1' : '0',
                     (b & 0x08) ? '1' : '0', (b & 0x04) ? '1' : '0', (b & 0x02) ? '1' : '0', (b & 0x01) ? '1' : '0');
            lv_label_set_text(s_lbl_steer_bitview, buf);
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
        if (s_lbl_brake_cmd_telemetry) {
            snprintf(buf, sizeof(buf), "ROLL CNT: %u  •  MODE: %s",
                     t->seb_cmd_roll_cnt, t->seb_cmd_control_mode == 1 ? "PRES" : "STROKE");
            lv_label_set_text(s_lbl_brake_cmd_telemetry, buf);
        }
        if (s_lbl_brake_vcu_stat) {
            bool en = t->seb_cmd_control_enable;
            lv_label_set_text(s_lbl_brake_vcu_stat, en ? "[ ENABLED ] VCU AUTO-BRAKE" : "[ DISABLED ] MANUAL MODE");
            lv_obj_set_style_text_color(s_lbl_brake_vcu_stat, lv_color_hex(en ? UI_COLOR_STATE_OK : UI_COLOR_TEXT_SECONDARY), 0);
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
        if (s_lbl_brake_align) {
            lv_label_set_text(s_lbl_brake_align, t->seb_align_status ? "ALIGNMENT: SENSOR ZEROED" : "ALIGNMENT: UNALIGNED");
            lv_obj_set_style_text_color(s_lbl_brake_align, lv_color_hex(t->seb_align_status ? UI_COLOR_STATE_OK : UI_COLOR_STATE_WARN), 0);
        }
        if (s_lbl_brake_feedback_stat) {
            if (t->nodes[NODE_SEB].timeout) {
                lv_label_set_text(s_lbl_brake_feedback_stat, "[ TIMEOUT ] FEEDBACK LOST (>250ms)");
                lv_obj_set_style_text_color(s_lbl_brake_feedback_stat, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
            } else {
                snprintf(buf, sizeof(buf), "[ OK ] FEEDBACK (%.0f Hz)", t->nodes[NODE_SEB].rate_hz);
                lv_label_set_text(s_lbl_brake_feedback_stat, buf);
                lv_obj_set_style_text_color(s_lbl_brake_feedback_stat, lv_color_hex(UI_COLOR_STATE_OK), 0);
            }
        }

        if (s_lbl_brake_delta_val) {
            float delta = t->brake_act_kpa - t->brake_cmd_kpa;
            snprintf(buf, sizeof(buf), "DIFF: %+0.0f kPa  [ %s ]", delta, fabsf(delta) > 50.0f ? "LAG" : "OK");
            lv_label_set_text(s_lbl_brake_delta_val, buf);
            lv_obj_set_style_text_color(s_lbl_brake_delta_val, lv_color_hex(fabsf(delta) > 50.0f ? UI_COLOR_STATE_FAULT : UI_COLOR_STATE_OK), 0);
        }
        if (s_lbl_brake_piston_val) {
            snprintf(buf, sizeof(buf), "%0.1f mm", t->brake_act_stroke_mm);
            lv_label_set_text(s_lbl_brake_piston_val, buf);
        }
        if (s_lbl_brake_piston_delta) {
            snprintf(buf, sizeof(buf), "[ STROKE DIFF: %+0.1f mm %s ]",
                     t->brake_delta_stroke_mm, fabsf(t->brake_delta_stroke_mm) > 2.0f ? "LAG" : "OK");
            lv_label_set_text(s_lbl_brake_piston_delta, buf);
            lv_obj_set_style_text_color(s_lbl_brake_piston_delta, lv_color_hex(fabsf(t->brake_delta_stroke_mm) > 2.0f ? UI_COLOR_STATE_WARN : UI_COLOR_STATE_OK), 0);
        }
        if (s_lbl_brake_volt) {
            float volt = t->seb_pow_volt_v > 5.0f ? t->seb_pow_volt_v : t->rail_volts_12v;
            if (volt > 5.0f) {
                float pwr = volt * fabsf(t->seb_motor_current_a);
                snprintf(buf, sizeof(buf), "SUPPLY VOLT: %0.1f V  •  PWR: %0.0f W", volt, pwr);
            } else {
                snprintf(buf, sizeof(buf), "SUPPLY VOLT: --.- V  •  PWR: 0 W");
            }
            lv_label_set_text(s_lbl_brake_volt, buf);
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
        if (s_lbl_brake_watchdog) {
            snprintf(buf, sizeof(buf), "NODE SILENCE: %lu ms  •  RX: %lu",
                     (unsigned long)t->nodes[NODE_SEB].silent_ms, (unsigned long)t->nodes[NODE_SEB].rx_count);
            lv_label_set_text(s_lbl_brake_watchdog, buf);
        }
        if (s_lbl_brake_health) {
            if (t->nodes[NODE_SEB].timeout) {
                lv_label_set_text(s_lbl_brake_health, "[ FAULT ] NODE OFFLINE");
                lv_obj_set_style_text_color(s_lbl_brake_health, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
            } else if (t->seb_errors.raw_bitmap != 0) {
                lv_label_set_text(s_lbl_brake_health, "[ WARN ] DTC ACTIVE");
                lv_obj_set_style_text_color(s_lbl_brake_health, lv_color_hex(UI_COLOR_STATE_WARN), 0);
            } else {
                lv_label_set_text(s_lbl_brake_health, "[ OK ] ACTUATOR HEALTHY");
                lv_obj_set_style_text_color(s_lbl_brake_health, lv_color_hex(UI_COLOR_STATE_OK), 0);
            }
        }
        if (s_lbl_brake_bitview) {
            uint8_t b = t->seb_cmd_byte0;
            snprintf(buf, sizeof(buf),
                     "SEB CMD [0x7B9 D0: 0x%02X]  EN:%d  MODE:%s  AUTO:%d  •  BITS: [%c%c%c%c %c%c%c%c]  •  [TOUCH PLOT / SWIPE DOWN]",
                     b,
                     (b & 0x01) ? 1 : 0,
                     (b & 0x02) ? "PRES" : "STRK",
                     (b & 0x04) ? 1 : 0,
                     (b & 0x80) ? '1' : '0', (b & 0x40) ? '1' : '0', (b & 0x20) ? '1' : '0', (b & 0x10) ? '1' : '0',
                     (b & 0x08) ? '1' : '0', (b & 0x04) ? '1' : '0', (b & 0x02) ? '1' : '0', (b & 0x01) ? '1' : '0');
            lv_label_set_text(s_lbl_brake_bitview, buf);
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
        if (s_lbl_drive_target_gear) {
            char cmd_g = vehicle_gear_to_char(t->drive_cmd_gear);
            snprintf(buf, sizeof(buf), "TARGET GEAR: [ %c ] (%s)", cmd_g, vehicle_gear_to_str(t->drive_cmd_gear));
            lv_label_set_text(s_lbl_drive_target_gear, buf);
        }
        if (s_lbl_drive_cmd_telemetry) {
            snprintf(buf, sizeof(buf), "MODE: SPEED CTRL  •  LIM: 25 km/h");
            lv_label_set_text(s_lbl_drive_cmd_telemetry, buf);
        }
        if (s_lbl_drive_rt_stat) {
            lv_label_set_text(s_lbl_drive_rt_stat, t->estop_active ? "[ CUTOUT ] RT-SAFETY SHUTDOWN" : "[ ENABLED ] RT-SAFETY RUN");
            lv_obj_set_style_text_color(s_lbl_drive_rt_stat, lv_color_hex(t->estop_active ? UI_COLOR_STATE_FAULT : UI_COLOR_STATE_OK), 0);
        }

        if (s_lbl_drive_act) {
            snprintf(buf, sizeof(buf), "%0.1f km/h", t->drive_act_kmh);
            lv_label_set_text(s_lbl_drive_act, buf);
        }
        if (s_lbl_drive_act_gear) {
            char act_g = vehicle_gear_to_char(t->drive_act_gear);
            snprintf(buf, sizeof(buf), "ENGAGED GEAR: [ %c ] (%s)", act_g, vehicle_gear_to_str(t->drive_act_gear));
            lv_label_set_text(s_lbl_drive_act_gear, buf);
        }
        if (s_lbl_drive_motor_telemetry) {
            snprintf(buf, sizeof(buf), "RATIO: 8.5:1  •  INV: CLOSED-LOOP");
            lv_label_set_text(s_lbl_drive_motor_telemetry, buf);
        }
        if (s_lbl_drive_state_cutout) {
            snprintf(buf, sizeof(buf), "STATE CODE: 0x%02X (%s)",
                     t->drive_node_state,
                     t->drive_node_state == 2 ? "READY" : (t->drive_node_state == 3 ? "RUN" : "STANDBY"));
            lv_label_set_text(s_lbl_drive_state_cutout, buf);
        }
        if (s_lbl_drive_feedback_stat) {
            if (t->nodes[NODE_MTR].timeout) {
                lv_label_set_text(s_lbl_drive_feedback_stat, "[ TIMEOUT ] FEEDBACK LOST (>250ms)");
                lv_obj_set_style_text_color(s_lbl_drive_feedback_stat, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
            } else {
                snprintf(buf, sizeof(buf), "[ OK ] FEEDBACK (%.0f Hz)", t->nodes[NODE_MTR].rate_hz);
                lv_label_set_text(s_lbl_drive_feedback_stat, buf);
                lv_obj_set_style_text_color(s_lbl_drive_feedback_stat, lv_color_hex(UI_COLOR_STATE_OK), 0);
            }
        }

        if (s_lbl_drive_delta_val) {
            float delta = fabsf(t->drive_act_kmh - t->drive_cmd_kmh);
            snprintf(buf, sizeof(buf), "DIFF: %0.1f km/h  [ %s ]", delta, delta > 2.0f ? "LAG" : "OK");
            lv_label_set_text(s_lbl_drive_delta_val, buf);
            lv_obj_set_style_text_color(s_lbl_drive_delta_val, lv_color_hex(delta > 2.0f ? UI_COLOR_STATE_FAULT : UI_COLOR_STATE_OK), 0);
        }
        if (s_lbl_drive_interlock_val) {
            if (t->drive_block_mask != 0) {
                snprintf(buf, sizeof(buf), "[ BLOCKED: MASK 0x%04X ]", t->drive_block_mask);
                lv_label_set_text(s_lbl_drive_interlock_val, buf);
                lv_obj_set_style_text_color(s_lbl_drive_interlock_val, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
            } else {
                lv_label_set_text(s_lbl_drive_interlock_val, "[ ALL INTERLOCKS CLEAR ]");
                lv_obj_set_style_text_color(s_lbl_drive_interlock_val, lv_color_hex(UI_COLOR_STATE_OK), 0);
            }
        }
        if (s_lbl_drive_brake_priority) {
            if (t->brake_act_kpa > 100.0f) {
                lv_label_set_text(s_lbl_drive_brake_priority, "[ BRAKE CUTOUT ENGAGED ]");
                lv_obj_set_style_text_color(s_lbl_drive_brake_priority, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
            } else {
                lv_label_set_text(s_lbl_drive_brake_priority, "[ ACCEL-BRAKE PRIORITY OK ]");
                lv_obj_set_style_text_color(s_lbl_drive_brake_priority, lv_color_hex(UI_COLOR_STATE_OK), 0);
            }
        }
        if (s_lbl_drive_volt) {
            if (t->rail_volts_12v > 1.0f) {
                snprintf(buf, sizeof(buf), "BUS VOLTAGE: %0.1f V  •  CURRENT: OK", t->rail_volts_12v);
            } else {
                snprintf(buf, sizeof(buf), "BUS VOLTAGE: --.- V  •  CURRENT: OK");
            }
            lv_label_set_text(s_lbl_drive_volt, buf);
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
        if (s_lbl_drive_watchdog) {
            snprintf(buf, sizeof(buf), "NODE SILENCE: %lu ms  •  RX: %lu",
                     (unsigned long)t->nodes[NODE_MTR].silent_ms, (unsigned long)t->nodes[NODE_MTR].rx_count);
            lv_label_set_text(s_lbl_drive_watchdog, buf);
        }
        if (s_lbl_drive_health) {
            if (t->nodes[NODE_MTR].timeout) {
                lv_label_set_text(s_lbl_drive_health, "[ FAULT ] NODE OFFLINE");
                lv_obj_set_style_text_color(s_lbl_drive_health, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
            } else if (t->drive_block_mask != 0) {
                lv_label_set_text(s_lbl_drive_health, "[ WARN ] INTERLOCK ENGAGED");
                lv_obj_set_style_text_color(s_lbl_drive_health, lv_color_hex(UI_COLOR_STATE_WARN), 0);
            } else {
                lv_label_set_text(s_lbl_drive_health, "[ OK ] INVERTER HEALTHY");
                lv_obj_set_style_text_color(s_lbl_drive_health, lv_color_hex(UI_COLOR_STATE_OK), 0);
            }
        }
        if (s_lbl_drive_bitview) {
            snprintf(buf, sizeof(buf),
                     "MTR CMD [0x204]  RAW: %02X %02X %02X %02X %02X  •  GEAR:%c  EN:%d  •  [TOUCH PLOT / SWIPE DOWN]",
                     t->drive_cmd_raw[0], t->drive_cmd_raw[1], t->drive_cmd_raw[2], t->drive_cmd_raw[3], t->drive_cmd_raw[4],
                     vehicle_gear_to_char(t->drive_cmd_gear), t->estop_active ? 0 : 1);
            lv_label_set_text(s_lbl_drive_bitview, buf);
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
        if (s_lbl_bus_estop_origin) {
            if (t->estop_active) {
                snprintf(buf, sizeof(buf), "ROOT CAUSE: TRIPPED BY NODE %d (REASON: 0x%02X)  •  LINE: LOW",
                         t->estop_source_node, t->estop_reason_code);
                lv_label_set_text(s_lbl_bus_estop_origin, buf);
                lv_obj_set_style_text_color(s_lbl_bus_estop_origin, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
            } else {
                lv_label_set_text(s_lbl_bus_estop_origin, "ROOT CAUSE: NO TRIPS DETECTED  •  INTERLOCK HARDWARE LINE: HIGH");
                lv_obj_set_style_text_color(s_lbl_bus_estop_origin, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
            }
        }
        if (s_lbl_bus_rail_volts) {
            if (t->rail_volts_12v > 1.0f) {
                snprintf(buf, sizeof(buf), "%0.1f V", t->rail_volts_12v);
            } else {
                snprintf(buf, sizeof(buf), "--.- V");
            }
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
        for (int i = 0; i < 6; i++) {
            if (s_lbl_bus_node_rates[i]) {
                snprintf(buf, sizeof(buf), "%.0f Hz", t->nodes[i].rate_hz);
                lv_label_set_text(s_lbl_bus_node_rates[i], buf);
            }
            if (s_lbl_bus_node_silent[i]) {
                snprintf(buf, sizeof(buf), "%lu ms ago", (unsigned long)t->nodes[i].silent_ms);
                lv_label_set_text(s_lbl_bus_node_silent[i], buf);
            }
            if (s_lbl_bus_node_states[i]) {
                bool ok = !t->nodes[i].timeout;
                lv_label_set_text(s_lbl_bus_node_states[i], ok ? "[ OK ] ACTIVE" : "[ TIMEOUT ]");
                lv_obj_set_style_text_color(s_lbl_bus_node_states[i], lv_color_hex(ok ? UI_COLOR_STATE_OK : UI_COLOR_STATE_FAULT), 0);
            }
            if (s_card_bus_nodes[i]) {
                bool ok = !t->nodes[i].timeout;
                lv_obj_set_style_border_color(s_card_bus_nodes[i], lv_color_hex(ok ? UI_COLOR_BORDER : UI_COLOR_STATE_FAULT), 0);
            }
        }
    }

    // -------------------------------------------------------------------------
    // Update Scope Headers (Screens 5, 6, 7)
    // -------------------------------------------------------------------------
    else if (s_current_win == WIN_STEER_PLOT_15S) {
        if (s_lbl_steer_15s_hdr) {
            float delta = fabsf(t->steer_cmd_deg - t->steer_act_deg);
            snprintf(buf, sizeof(buf), "STEER 15s SCOPE • CMD: %+0.1f deg | ACT: %+0.1f deg | DIFF: %0.1f deg | Torq: %+0.1f Nm",
                     t->steer_cmd_deg, t->steer_act_deg, delta, t->steer_torque_nm);
            lv_label_set_text(s_lbl_steer_15s_hdr, buf);
        }
    } else if (s_current_win == WIN_BRAKE_PLOT_15S) {
        if (s_lbl_brake_15s_hdr) {
            float delta = t->brake_act_kpa - t->brake_cmd_kpa;
            snprintf(buf, sizeof(buf), "BRAKE 15s SCOPE • CMD: %.0f kPa | ACT: %.0f kPa | DIFF: %+0.0f | Strk: %0.1f mm",
                     t->brake_cmd_kpa, t->brake_act_kpa, delta, t->brake_act_stroke_mm);
            lv_label_set_text(s_lbl_brake_15s_hdr, buf);
        }
    } else if (s_current_win == WIN_DRIVE_PLOT_15S) {
        if (s_lbl_drive_15s_hdr) {
            float delta = fabsf(t->drive_act_kmh - t->drive_cmd_kmh);
            snprintf(buf, sizeof(buf), "DRIVE 15s SCOPE • CMD: %0.1f km/h | ACT: %0.1f km/h | DIFF: %0.1f km/h | GEAR: %c",
                     t->drive_cmd_kmh, t->drive_act_kmh, delta, g);
            lv_label_set_text(s_lbl_drive_15s_hdr, buf);
        }
    }
}
