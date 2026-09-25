/**
 * @file ui_manager.c
 * @brief High-Density Ground-Truth Telemetry UI for Waveshare 4.3B (SKU: 28141)
 *
 * Implements:
 * - 0. DASHBOARD: CAN Watch Cockpit with 3-actuator status & 5-node watchdog array
 * - 1. STEER (SES): Dual digits + Target speed + Delta/Torque + Embedded 5s Live Plot
 * - 2. BRAKE (SEB): Dual digits + Stroke + Delta + Embedded 5s Live Plot
 * - 3. DRIVE (MTR): Dual digits + RPM/Gear + Delta + Embedded 5s Live Plot
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
static lv_obj_t *s_lbl_dash_estop = NULL;
static lv_obj_t *s_lbl_dash_estop_sub = NULL;
static lv_obj_t *s_card_dash_estop = NULL;

static lv_obj_t *s_lbl_dash_steer_act = NULL;
static lv_obj_t *s_lbl_dash_steer_target = NULL;
static lv_obj_t *s_lbl_dash_steer_torq = NULL;
static lv_obj_t *s_lbl_dash_steer_stat = NULL;

static lv_obj_t *s_lbl_dash_brake_act = NULL;
static lv_obj_t *s_lbl_dash_brake_target = NULL;
static lv_obj_t *s_lbl_dash_brake_aux = NULL;
static lv_obj_t *s_lbl_dash_brake_stat = NULL;

static lv_obj_t *s_lbl_dash_drive_act = NULL;
static lv_obj_t *s_lbl_dash_drive_target = NULL;
static lv_obj_t *s_lbl_dash_drive_aux = NULL;
static lv_obj_t *s_lbl_dash_drive_stat = NULL;

static lv_obj_t *s_lbl_dash_can_rate = NULL;
static lv_obj_t *s_lbl_dash_can_err = NULL;
static lv_obj_t *s_lbl_dash_rail_volts = NULL;
static lv_obj_t *s_lbl_dash_node_rates[5] = {NULL};
static lv_obj_t *s_lbl_dash_node_states[5] = {NULL};

/* =========================================================================
 * Screen 1: Steering (SES) Widgets + 5s Mini-Plot
 * ========================================================================= */
static lv_obj_t *s_lbl_steer_cmd = NULL;
static lv_obj_t *s_lbl_steer_act = NULL;
static lv_obj_t *s_lbl_steer_target_spd = NULL;
static lv_obj_t *s_lbl_steer_actual_spd = NULL;
static lv_obj_t *s_lbl_steer_takeover = NULL;
static lv_obj_t *s_lbl_steer_delta_val = NULL;
static lv_obj_t *s_lbl_steer_torq = NULL;
static lv_obj_t *s_lbl_steer_override = NULL;
static lv_obj_t *s_card_steer_delta = NULL;
static lv_obj_t *s_card_steer_torque = NULL;

static lv_obj_t *s_chart_steer_5s = NULL;
static lv_chart_series_t *s_ser_steer_5s_cmd = NULL;
static lv_chart_series_t *s_ser_steer_5s_act = NULL;

/* =========================================================================
 * Screen 2: Brake (SEB) Widgets + 5s Mini-Plot
 * ========================================================================= */
static lv_obj_t *s_lbl_brake_cmd = NULL;
static lv_obj_t *s_lbl_brake_act = NULL;
static lv_obj_t *s_lbl_brake_delta_val = NULL;
static lv_obj_t *s_lbl_brake_stroke = NULL;
static lv_obj_t *s_card_brake_delta = NULL;

static lv_obj_t *s_chart_brake_5s = NULL;
static lv_chart_series_t *s_ser_brake_5s_cmd = NULL;
static lv_chart_series_t *s_ser_brake_5s_act = NULL;

/* =========================================================================
 * Screen 3: Drive (MTR) Widgets + 5s Mini-Plot
 * ========================================================================= */
static lv_obj_t *s_lbl_drive_cmd = NULL;
static lv_obj_t *s_lbl_drive_act = NULL;
static lv_obj_t *s_lbl_drive_delta_val = NULL;
static lv_obj_t *s_lbl_drive_rpm = NULL;
static lv_obj_t *s_lbl_drive_gear = NULL;
static lv_obj_t *s_card_drive_delta = NULL;

static lv_obj_t *s_chart_drive_5s = NULL;
static lv_chart_series_t *s_ser_drive_5s_cmd = NULL;
static lv_chart_series_t *s_ser_drive_5s_act = NULL;

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
static lv_obj_t *s_chart_steer_15s = NULL;
static lv_chart_series_t *s_ser_steer_15s_cmd = NULL;
static lv_chart_series_t *s_ser_steer_15s_act = NULL;
static lv_obj_t *s_lbl_steer_15s_hdr = NULL;

static lv_obj_t *s_chart_brake_15s = NULL;
static lv_chart_series_t *s_ser_brake_15s_cmd = NULL;
static lv_chart_series_t *s_ser_brake_15s_act = NULL;
static lv_obj_t *s_lbl_brake_15s_hdr = NULL;

static lv_obj_t *s_chart_drive_15s = NULL;
static lv_chart_series_t *s_ser_drive_15s_cmd = NULL;
static lv_chart_series_t *s_ser_drive_15s_act = NULL;
static lv_obj_t *s_lbl_drive_15s_hdr = NULL;

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
 * Tabs: 0. DASHBOARD | 1. STEER (SES) | 2. BRAKE (SEB) | 3. DRIVE (MTR) | 4. BUS & NODES
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

void ui_manager_init(void) {
    // =========================================================================
    // Window 0: 0. DASHBOARD (CAN Watch Cockpit Front Page)
    // =========================================================================
    s_screens[WIN_DASHBOARD] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_DASHBOARD], lv_color_hex(UI_COLOR_BG), 0);
    create_top_nav_bar(s_screens[WIN_DASHBOARD], WIN_DASHBOARD);

    // 1. E-Stop & Master Interlock Banner
    s_card_dash_estop = lv_obj_create(s_screens[WIN_DASHBOARD]);
    lv_obj_set_size(s_card_dash_estop, 784, 58);
    lv_obj_align(s_card_dash_estop, LV_ALIGN_TOP_MID, 0, 52);
    lv_obj_set_style_bg_color(s_card_dash_estop, lv_color_hex(0x062817), 0);
    lv_obj_set_style_border_color(s_card_dash_estop, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_set_style_border_width(s_card_dash_estop, 2, 0);
    lv_obj_set_style_radius(s_card_dash_estop, 8, 0);
    lv_obj_set_style_pad_all(s_card_dash_estop, 4, 0);

    s_lbl_dash_estop = lv_label_create(s_card_dash_estop);
    lv_label_set_text(s_lbl_dash_estop, "[ OK ] E-STOP DISENGAGED • SYSTEM CLEAR");
    lv_obj_set_style_text_font(s_lbl_dash_estop, &lv_font_montserrat_18, 0);
    lv_obj_set_style_text_color(s_lbl_dash_estop, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_dash_estop, LV_ALIGN_CENTER, 0, -8);

    s_lbl_dash_estop_sub = lv_label_create(s_card_dash_estop);
    lv_label_set_text(s_lbl_dash_estop_sub, "LOW-BUS MASTER (500 kbps)  •  INTERLOCK PIN: HIGH  •  FAIL-CLOSED READY");
    lv_obj_set_style_text_font(s_lbl_dash_estop_sub, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_estop_sub, lv_color_hex(0xA7F3D0), 0);
    lv_obj_align(s_lbl_dash_estop_sub, LV_ALIGN_CENTER, 0, 14);

    // 2. Quick Cockpit Deck: 3 Actuator Overview Cards (Steer, Brake, Drive)
    const int act_w = 254;
    const int act_h = 175;
    const int act_y = 114;

    // Card 1: Steer Overview
    lv_obj_t *c_dsteer = lv_obj_create(s_screens[WIN_DASHBOARD]);
    lv_obj_set_size(c_dsteer, act_w, act_h);
    lv_obj_align(c_dsteer, LV_ALIGN_TOP_LEFT, 8, act_y);
    lv_obj_set_style_bg_color(c_dsteer, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_dsteer, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_dsteer, 8, 0);
    lv_obj_add_event_cb(c_dsteer, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_STEER);

    lv_obj_t *lbl_dst = lv_label_create(c_dsteer);
    lv_label_set_text(lbl_dst, "1. STEER (SES 0x201) >");
    lv_obj_set_style_text_font(lbl_dst, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_dst, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(lbl_dst, LV_ALIGN_TOP_LEFT, 0, 0);

    s_lbl_dash_steer_act = lv_label_create(c_dsteer);
    lv_label_set_text(s_lbl_dash_steer_act, "+14.7°");
    lv_obj_set_style_text_font(s_lbl_dash_steer_act, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(s_lbl_dash_steer_act, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_dash_steer_act, LV_ALIGN_CENTER, 0, -18);

    s_lbl_dash_steer_target = lv_label_create(c_dsteer);
    lv_label_set_text(s_lbl_dash_steer_target, "CMD: +15.0°  |  Δ: 0.3° [OK]");
    lv_obj_set_style_text_font(s_lbl_dash_steer_target, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_steer_target, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_dash_steer_target, LV_ALIGN_CENTER, 0, 18);

    s_lbl_dash_steer_torq = lv_label_create(c_dsteer);
    lv_label_set_text(s_lbl_dash_steer_torq, "Torque: +0.2 Nm [NO OVERRIDE]");
    lv_obj_set_style_text_font(s_lbl_dash_steer_torq, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_steer_torq, lv_color_hex(UI_COLOR_STATE_WARN), 0);
    lv_obj_align(s_lbl_dash_steer_torq, LV_ALIGN_CENTER, 0, 38);

    s_lbl_dash_steer_stat = lv_label_create(c_dsteer);
    lv_label_set_text(s_lbl_dash_steer_stat, "[ OK ] SES HEALTHY (100 Hz)");
    lv_obj_set_style_text_font(s_lbl_dash_steer_stat, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_steer_stat, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_dash_steer_stat, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Card 2: Brake Overview
    lv_obj_t *c_dbrake = lv_obj_create(s_screens[WIN_DASHBOARD]);
    lv_obj_set_size(c_dbrake, act_w, act_h);
    lv_obj_align(c_dbrake, LV_ALIGN_TOP_LEFT, 273, act_y);
    lv_obj_set_style_bg_color(c_dbrake, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_dbrake, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_dbrake, 8, 0);
    lv_obj_add_event_cb(c_dbrake, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_BRAKE);

    lv_obj_t *lbl_dbt = lv_label_create(c_dbrake);
    lv_label_set_text(lbl_dbt, "2. BRAKE (SEB 0x721) >");
    lv_obj_set_style_text_font(lbl_dbt, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_dbt, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(lbl_dbt, LV_ALIGN_TOP_LEFT, 0, 0);

    s_lbl_dash_brake_act = lv_label_create(c_dbrake);
    lv_label_set_text(s_lbl_dash_brake_act, "442 kPa");
    lv_obj_set_style_text_font(s_lbl_dash_brake_act, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(s_lbl_dash_brake_act, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_dash_brake_act, LV_ALIGN_CENTER, 0, -18);

    s_lbl_dash_brake_target = lv_label_create(c_dbrake);
    lv_label_set_text(s_lbl_dash_brake_target, "CMD: 450 kPa  |  Δ: -8 kPa [OK]");
    lv_obj_set_style_text_font(s_lbl_dash_brake_target, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_brake_target, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_dash_brake_target, LV_ALIGN_CENTER, 0, 18);

    s_lbl_dash_brake_aux = lv_label_create(c_dbrake);
    lv_label_set_text(s_lbl_dash_brake_aux, "Stroke: 17.8 mm  |  Temp: 38°C");
    lv_obj_set_style_text_font(s_lbl_dash_brake_aux, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_brake_aux, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
    lv_obj_align(s_lbl_dash_brake_aux, LV_ALIGN_CENTER, 0, 38);

    s_lbl_dash_brake_stat = lv_label_create(c_dbrake);
    lv_label_set_text(s_lbl_dash_brake_stat, "[ OK ] SEB HEALTHY (100 Hz)");
    lv_obj_set_style_text_font(s_lbl_dash_brake_stat, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_brake_stat, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_dash_brake_stat, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Card 3: Drive Overview
    lv_obj_t *c_ddrive = lv_obj_create(s_screens[WIN_DASHBOARD]);
    lv_obj_set_size(c_ddrive, act_w, act_h);
    lv_obj_align(c_ddrive, LV_ALIGN_TOP_LEFT, 538, act_y);
    lv_obj_set_style_bg_color(c_ddrive, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_ddrive, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_ddrive, 8, 0);
    lv_obj_add_event_cb(c_ddrive, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_DRIVE);

    lv_obj_t *lbl_ddt = lv_label_create(c_ddrive);
    lv_label_set_text(lbl_ddt, "3. DRIVE (MTR 0x206) >");
    lv_obj_set_style_text_font(lbl_ddt, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_ddt, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(lbl_ddt, LV_ALIGN_TOP_LEFT, 0, 0);

    s_lbl_dash_drive_act = lv_label_create(c_ddrive);
    lv_label_set_text(s_lbl_dash_drive_act, "14.8 km/h");
    lv_obj_set_style_text_font(s_lbl_dash_drive_act, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(s_lbl_dash_drive_act, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_dash_drive_act, LV_ALIGN_CENTER, 0, -18);

    s_lbl_dash_drive_target = lv_label_create(c_ddrive);
    lv_label_set_text(s_lbl_dash_drive_target, "CMD: 15.0 km/h  |  Δ: 0.2 [OK]");
    lv_obj_set_style_text_font(s_lbl_dash_drive_target, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_drive_target, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_dash_drive_target, LV_ALIGN_CENTER, 0, 18);

    s_lbl_dash_drive_aux = lv_label_create(c_ddrive);
    lv_label_set_text(s_lbl_dash_drive_aux, "RPM: 1240  |  GEAR: [ D ] (DRIVE)");
    lv_obj_set_style_text_font(s_lbl_dash_drive_aux, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_drive_aux, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
    lv_obj_align(s_lbl_dash_drive_aux, LV_ALIGN_CENTER, 0, 38);

    s_lbl_dash_drive_stat = lv_label_create(c_ddrive);
    lv_label_set_text(s_lbl_dash_drive_stat, "[ OK ] MTR HEALTHY (50 Hz)");
    lv_obj_set_style_text_font(s_lbl_dash_drive_stat, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_drive_stat, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_dash_drive_stat, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // 3. CAN Watch Cockpit: Bus Diagnostics + 5-Node Heartbeat Deck
    const int can_y = 296;
    const int can_h = 176;

    // CAN Bus Box
    lv_obj_t *c_can_box = lv_obj_create(s_screens[WIN_DASHBOARD]);
    lv_obj_set_size(c_can_box, act_w, can_h);
    lv_obj_align(c_can_box, LV_ALIGN_TOP_LEFT, 8, can_y);
    lv_obj_set_style_bg_color(c_can_box, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_can_box, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_can_box, 8, 0);

    lv_obj_t *lbl_cb_t = lv_label_create(c_can_box);
    lv_label_set_text(lbl_cb_t, "CAN BUS HEALTH");
    lv_obj_set_style_text_font(lbl_cb_t, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_cb_t, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_cb_t, LV_ALIGN_TOP_LEFT, 0, 0);

    s_lbl_dash_can_rate = lv_label_create(c_can_box);
    lv_label_set_text(s_lbl_dash_can_rate, "420 msg/s");
    lv_obj_set_style_text_font(s_lbl_dash_can_rate, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(s_lbl_dash_can_rate, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(s_lbl_dash_can_rate, LV_ALIGN_CENTER, 0, -18);

    s_lbl_dash_can_err = lv_label_create(c_can_box);
    lv_label_set_text(s_lbl_dash_can_err, "TEC: 0 | REC: 0 [BUS OK]");
    lv_obj_set_style_text_font(s_lbl_dash_can_err, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_can_err, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_dash_can_err, LV_ALIGN_CENTER, 0, 18);

    s_lbl_dash_rail_volts = lv_label_create(c_can_box);
    lv_label_set_text(s_lbl_dash_rail_volts, "12V Rail: 13.8 V [BATTERY OK]");
    lv_obj_set_style_text_font(s_lbl_dash_rail_volts, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_rail_volts, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_dash_rail_volts, LV_ALIGN_CENTER, 0, 38);

    // 5-Node Heartbeat Deck
    lv_obj_t *c_nodes_box = lv_obj_create(s_screens[WIN_DASHBOARD]);
    lv_obj_set_size(c_nodes_box, 519, can_h);
    lv_obj_align(c_nodes_box, LV_ALIGN_TOP_LEFT, 273, can_y);
    lv_obj_set_style_bg_color(c_nodes_box, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_nodes_box, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_nodes_box, 8, 0);

    lv_obj_t *lbl_nb_t = lv_label_create(c_nodes_box);
    lv_label_set_text(lbl_nb_t, "LOW-BUS ACTUATOR & GATEWAY LIVENESS (250ms FAIL-CLOSED WATCHDOG)");
    lv_obj_set_style_text_font(lbl_nb_t, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_nb_t, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_nb_t, LV_ALIGN_TOP_LEFT, 0, 0);

    const char *node_ids[5] = {"SYS (0x011)", "RT (0x210)", "MTR (0x206)", "SES (0x201)", "SEB (0x721)"};
    const int n_w = 93;
    const int n_h = 130;
    for (int i = 0; i < 5; i++) {
        lv_obj_t *nc = lv_obj_create(c_nodes_box);
        lv_obj_set_size(nc, n_w, n_h);
        lv_obj_align(nc, LV_ALIGN_TOP_LEFT, i * (n_w + 6), 24);
        lv_obj_set_style_bg_color(nc, lv_color_hex(UI_COLOR_BG), 0);
        lv_obj_set_style_border_color(nc, lv_color_hex(UI_COLOR_BORDER), 0);
        lv_obj_set_style_radius(nc, 6, 0);
        lv_obj_set_style_pad_all(nc, 4, 0);

        lv_obj_t *ln = lv_label_create(nc);
        lv_label_set_text(ln, node_ids[i]);
        lv_obj_set_style_text_font(ln, &lv_font_montserrat_12, 0);
        lv_obj_set_style_text_color(ln, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
        lv_obj_align(ln, LV_ALIGN_TOP_MID, 0, 4);

        s_lbl_dash_node_rates[i] = lv_label_create(nc);
        lv_label_set_text(s_lbl_dash_node_rates[i], "100 Hz");
        lv_obj_set_style_text_font(s_lbl_dash_node_rates[i], &lv_font_montserrat_14, 0);
        lv_obj_set_style_text_color(s_lbl_dash_node_rates[i], lv_color_hex(UI_COLOR_STATE_OK), 0);
        lv_obj_align(s_lbl_dash_node_rates[i], LV_ALIGN_CENTER, 0, -4);

        s_lbl_dash_node_states[i] = lv_label_create(nc);
        lv_label_set_text(s_lbl_dash_node_states[i], "[ OK ]");
        lv_obj_set_style_text_font(s_lbl_dash_node_states[i], &lv_font_montserrat_12, 0);
        lv_obj_set_style_text_color(s_lbl_dash_node_states[i], lv_color_hex(UI_COLOR_STATE_OK), 0);
        lv_obj_align(s_lbl_dash_node_states[i], LV_ALIGN_BOTTOM_MID, 0, -4);
    }

    // =========================================================================
    // Window 1: 1. STEER (SES) - Numerics + Embedded 5s Scope Plot
    // =========================================================================
    s_screens[WIN_STEER] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_STEER], lv_color_hex(UI_COLOR_BG), 0);
    create_top_nav_bar(s_screens[WIN_STEER], WIN_STEER);

    // Upper Deck: 3 Cards (Command, Actuation, Delta/Torque) - Height 195px
    const int u_h = 195;
    const int u_y = 50;

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
    lv_obj_align(s_lbl_steer_cmd, LV_ALIGN_CENTER, 0, -22);

    lv_obj_t *box_s_spd = lv_obj_create(c_scmd);
    lv_obj_set_size(box_s_spd, 226, 32);
    lv_obj_align(box_s_spd, LV_ALIGN_CENTER, 0, 16);
    lv_obj_set_style_bg_color(box_s_spd, lv_color_hex(0x121A24), 0);
    lv_obj_set_style_border_color(box_s_spd, lv_color_hex(0x1E3A50), 0);
    lv_obj_set_style_radius(box_s_spd, 6, 0);
    lv_obj_set_style_pad_all(box_s_spd, 0, 0);
    s_lbl_steer_target_spd = lv_label_create(box_s_spd);
    lv_label_set_text(s_lbl_steer_target_spd, "TARGET SPEED: 200 °/s");
    lv_obj_set_style_text_font(s_lbl_steer_target_spd, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_target_spd, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_steer_target_spd, LV_ALIGN_CENTER, 0, 0);

    lv_obj_t *lbl_s_cl = lv_label_create(c_scmd);
    lv_label_set_text(lbl_s_cl, "[ OK ] CLOSED-LOOP ENABLED");
    lv_obj_set_style_text_font(lbl_s_cl, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_s_cl, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_s_cl, LV_ALIGN_BOTTOM_LEFT, 0, 0);

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
    lv_obj_align(s_lbl_steer_act, LV_ALIGN_CENTER, 0, -22);

    lv_obj_t *box_s_actspd = lv_obj_create(c_sact);
    lv_obj_set_size(box_s_actspd, 226, 32);
    lv_obj_align(box_s_actspd, LV_ALIGN_CENTER, 0, 16);
    lv_obj_set_style_bg_color(box_s_actspd, lv_color_hex(0x0C2218), 0);
    lv_obj_set_style_border_color(box_s_actspd, lv_color_hex(0x155032), 0);
    lv_obj_set_style_radius(box_s_actspd, 6, 0);
    lv_obj_set_style_pad_all(box_s_actspd, 0, 0);
    s_lbl_steer_actual_spd = lv_label_create(box_s_actspd);
    lv_label_set_text(s_lbl_steer_actual_spd, "ACTUAL SPEED: 198 °/s");
    lv_obj_set_style_text_font(s_lbl_steer_actual_spd, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_actual_spd, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_steer_actual_spd, LV_ALIGN_CENTER, 0, 0);

    s_lbl_steer_takeover = lv_label_create(c_sact);
    lv_label_set_text(s_lbl_steer_takeover, "[ OK ] ANGLE TRACKING • ALIGNED");
    lv_obj_set_style_text_font(s_lbl_steer_takeover, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_takeover, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_steer_takeover, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Card 3: Delta & Torque
    lv_obj_t *c_sdt = lv_obj_create(s_screens[WIN_STEER]);
    lv_obj_set_size(c_sdt, act_w, u_h);
    lv_obj_align(c_sdt, LV_ALIGN_TOP_LEFT, 538, u_y);
    lv_obj_set_style_bg_color(c_sdt, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_sdt, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_sdt, 8, 0);

    // 2-tier Delta Badge
    s_card_steer_delta = lv_obj_create(c_sdt);
    lv_obj_set_size(s_card_steer_delta, 226, 44);
    lv_obj_align(s_card_steer_delta, LV_ALIGN_TOP_MID, 0, 0);
    lv_obj_set_style_bg_color(s_card_steer_delta, lv_color_hex(0x064E3B), 0);
    lv_obj_set_style_border_color(s_card_steer_delta, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_set_style_border_width(s_card_steer_delta, 2, 0);
    lv_obj_set_style_radius(s_card_steer_delta, 6, 0);
    lv_obj_set_style_pad_all(s_card_steer_delta, 0, 0);

    s_lbl_steer_delta_val = lv_label_create(s_card_steer_delta);
    lv_label_set_text(s_lbl_steer_delta_val, "Δ: 0.3°  [ TRACKING OK ]");
    lv_obj_set_style_text_font(s_lbl_steer_delta_val, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_steer_delta_val, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_steer_delta_val, LV_ALIGN_CENTER, 0, 0);

    // Torque Box
    s_card_steer_torque = lv_obj_create(c_sdt);
    lv_obj_set_size(s_card_steer_torque, 226, 76);
    lv_obj_align(s_card_steer_torque, LV_ALIGN_TOP_MID, 0, 52);
    lv_obj_set_style_bg_color(s_card_steer_torque, lv_color_hex(0x231806), 0);
    lv_obj_set_style_border_color(s_card_steer_torque, lv_color_hex(UI_COLOR_STATE_WARN), 0);
    lv_obj_set_style_border_width(s_card_steer_torque, 1, 0);
    lv_obj_set_style_radius(s_card_steer_torque, 6, 0);
    lv_obj_set_style_pad_all(s_card_steer_torque, 2, 0);

    lv_obj_t *lbl_t_title = lv_label_create(s_card_steer_torque);
    lv_label_set_text(lbl_t_title, "DRIVER COLUMN TORQUE");
    lv_obj_set_style_text_font(lbl_t_title, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_t_title, lv_color_hex(UI_COLOR_STATE_WARN), 0);
    lv_obj_align(lbl_t_title, LV_ALIGN_TOP_MID, 0, 0);

    s_lbl_steer_torq = lv_label_create(s_card_steer_torque);
    lv_label_set_text(s_lbl_steer_torq, "+0.2 Nm");
    lv_obj_set_style_text_font(s_lbl_steer_torq, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_color(s_lbl_steer_torq, lv_color_hex(UI_COLOR_STATE_WARN), 0);
    lv_obj_align(s_lbl_steer_torq, LV_ALIGN_CENTER, 0, 2);

    s_lbl_steer_override = lv_label_create(s_card_steer_torque);
    lv_label_set_text(s_lbl_steer_override, "[ NO OVERRIDE ]");
    lv_obj_set_style_text_font(s_lbl_steer_override, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_override, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_steer_override, LV_ALIGN_BOTTOM_MID, 0, 0);

    lv_obj_t *lbl_s_hlth = lv_label_create(c_sdt);
    lv_label_set_text(lbl_s_hlth, "[ OK ] SES HEALTHY • 8.4A / 34°C");
    lv_obj_set_style_text_font(lbl_s_hlth, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_s_hlth, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_s_hlth, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Middle Deck: Embedded 5-Second Dual-Trace Live Scope Plot (Height 172px)
    s_chart_steer_5s = lv_chart_create(s_screens[WIN_STEER]);
    lv_obj_set_size(s_chart_steer_5s, 784, 172);
    lv_obj_align(s_chart_steer_5s, LV_ALIGN_TOP_MID, 0, 250);
    lv_chart_set_type(s_chart_steer_5s, LV_CHART_TYPE_LINE);
    lv_chart_set_point_count(s_chart_steer_5s, PLOT_POINTS_5S);
    lv_chart_set_update_mode(s_chart_steer_5s, LV_CHART_UPDATE_MODE_SHIFT);
    lv_chart_set_range(s_chart_steer_5s, LV_CHART_AXIS_PRIMARY_Y, -45, 45);
    lv_obj_set_style_bg_color(s_chart_steer_5s, lv_color_hex(UI_COLOR_BG), 0);
    lv_obj_set_style_border_color(s_chart_steer_5s, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(s_chart_steer_5s, 8, 0);

    s_ser_steer_5s_cmd = lv_chart_add_series(s_chart_steer_5s, lv_color_hex(UI_COLOR_ACCENT_CMD), LV_CHART_AXIS_PRIMARY_Y);
    s_ser_steer_5s_act = lv_chart_add_series(s_chart_steer_5s, lv_color_hex(UI_COLOR_ACCENT_ACT), LV_CHART_AXIS_PRIMARY_Y);

    lv_obj_t *lbl_s5_legend = lv_label_create(s_screens[WIN_STEER]);
    lv_label_set_text(lbl_s5_legend, "5s REAL-TIME SCOPE (100ms) • CMD: CYAN | ACT: EMERALD (-45° to +45°)");
    lv_obj_set_style_text_font(lbl_s5_legend, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_s5_legend, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_s5_legend, LV_ALIGN_TOP_LEFT, 18, 254);

    // Bottom Action Button: Expand to 15s Scope
    lv_obj_t *btn_expand_s = lv_button_create(s_screens[WIN_STEER]);
    lv_obj_set_size(btn_expand_s, 784, 46);
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
    // Window 2: 2. BRAKE (SEB) - Numerics + Embedded 5s Scope Plot
    // =========================================================================
    s_screens[WIN_BRAKE] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_BRAKE], lv_color_hex(UI_COLOR_BG), 0);
    create_top_nav_bar(s_screens[WIN_BRAKE], WIN_BRAKE);

    // Card 1: Command
    lv_obj_t *c_bcmd = lv_obj_create(s_screens[WIN_BRAKE]);
    lv_obj_set_size(c_bcmd, act_w, u_h);
    lv_obj_align(c_bcmd, LV_ALIGN_TOP_LEFT, 8, u_y);
    lv_obj_set_style_bg_color(c_bcmd, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_bcmd, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_bcmd, 8, 0);

    lv_obj_t *lbl_bc1 = lv_label_create(c_bcmd);
    lv_label_set_text(lbl_bc1, "COMMAND (VCU 0x169)");
    lv_obj_set_style_text_font(lbl_bc1, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_bc1, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_bc1, LV_ALIGN_TOP_LEFT, 0, 0);

    s_lbl_brake_cmd = lv_label_create(c_bcmd);
    lv_label_set_text(s_lbl_brake_cmd, "450 kPa");
    lv_obj_set_style_text_font(s_lbl_brake_cmd, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(s_lbl_brake_cmd, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(s_lbl_brake_cmd, LV_ALIGN_CENTER, 0, -22);

    lv_obj_t *box_b_cmd = lv_obj_create(c_bcmd);
    lv_obj_set_size(box_b_cmd, 226, 32);
    lv_obj_align(box_b_cmd, LV_ALIGN_CENTER, 0, 16);
    lv_obj_set_style_bg_color(box_b_cmd, lv_color_hex(0x121A24), 0);
    lv_obj_set_style_border_color(box_b_cmd, lv_color_hex(0x1E3A50), 0);
    lv_obj_set_style_radius(box_b_cmd, 6, 0);
    lv_obj_set_style_pad_all(box_b_cmd, 0, 0);
    lv_obj_t *lbl_b_pcmd = lv_label_create(box_b_cmd);
    lv_label_set_text(lbl_b_pcmd, "TARGET PRESSURE: 450 kPa");
    lv_obj_set_style_text_font(lbl_b_pcmd, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b_pcmd, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(lbl_b_pcmd, LV_ALIGN_CENTER, 0, 0);

    lv_obj_t *lbl_b_cl = lv_label_create(c_bcmd);
    lv_label_set_text(lbl_b_cl, "[ OK ] CLOSED-LOOP HYDRAULIC");
    lv_obj_set_style_text_font(lbl_b_cl, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b_cl, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_b_cl, LV_ALIGN_BOTTOM_LEFT, 0, 0);

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
    lv_obj_align(s_lbl_brake_act, LV_ALIGN_CENTER, 0, -22);

    lv_obj_t *box_b_act = lv_obj_create(c_bact);
    lv_obj_set_size(box_b_act, 226, 32);
    lv_obj_align(box_b_act, LV_ALIGN_CENTER, 0, 16);
    lv_obj_set_style_bg_color(box_b_act, lv_color_hex(0x0C2218), 0);
    lv_obj_set_style_border_color(box_b_act, lv_color_hex(0x155032), 0);
    lv_obj_set_style_radius(box_b_act, 6, 0);
    lv_obj_set_style_pad_all(box_b_act, 0, 0);
    s_lbl_brake_stroke = lv_label_create(box_b_act);
    lv_label_set_text(s_lbl_brake_stroke, "ACTUATOR STROKE: 17.8 mm");
    lv_obj_set_style_text_font(s_lbl_brake_stroke, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_stroke, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_brake_stroke, LV_ALIGN_CENTER, 0, 0);

    lv_obj_t *lbl_b_st = lv_label_create(c_bact);
    lv_label_set_text(lbl_b_st, "[ OK ] PRESSURE TRACKING");
    lv_obj_set_style_text_font(lbl_b_st, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b_st, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_b_st, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Card 3: Delta & Health
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
    lv_label_set_text(s_lbl_brake_delta_val, "Δ: -8 kPa  [ TRACKING OK ]");
    lv_obj_set_style_text_font(s_lbl_brake_delta_val, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_brake_delta_val, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_brake_delta_val, LV_ALIGN_CENTER, 0, 0);

    lv_obj_t *box_b_sec = lv_obj_create(c_bdt);
    lv_obj_set_size(box_b_sec, 226, 76);
    lv_obj_align(box_b_sec, LV_ALIGN_TOP_MID, 0, 52);
    lv_obj_set_style_bg_color(box_b_sec, lv_color_hex(0x121A24), 0);
    lv_obj_set_style_border_color(box_b_sec, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
    lv_obj_set_style_radius(box_b_sec, 6, 0);
    lv_obj_set_style_pad_all(box_b_sec, 2, 0);

    lv_obj_t *lbl_b_stitle = lv_label_create(box_b_sec);
    lv_label_set_text(lbl_b_stitle, "ACTUATOR TEMPERATURE");
    lv_obj_set_style_text_font(lbl_b_stitle, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b_stitle, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_b_stitle, LV_ALIGN_TOP_MID, 0, 0);

    lv_obj_t *lbl_b_temp = lv_label_create(box_b_sec);
    lv_label_set_text(lbl_b_temp, "38°C [NOMINAL]");
    lv_obj_set_style_text_font(lbl_b_temp, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_color(lbl_b_temp, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(lbl_b_temp, LV_ALIGN_CENTER, 0, 2);

    lv_obj_t *lbl_b_pr = lv_label_create(box_b_sec);
    lv_label_set_text(lbl_b_pr, "[ BRAKE PRIORITY READY ]");
    lv_obj_set_style_text_font(lbl_b_pr, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b_pr, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_b_pr, LV_ALIGN_BOTTOM_MID, 0, 0);

    lv_obj_t *lbl_b_hlth = lv_label_create(c_bdt);
    lv_label_set_text(lbl_b_hlth, "[ OK ] SEB ECU HEALTHY (100 Hz)");
    lv_obj_set_style_text_font(lbl_b_hlth, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b_hlth, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_b_hlth, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Middle Deck: Embedded 5-Second Brake Pressure Scope Plot
    s_chart_brake_5s = lv_chart_create(s_screens[WIN_BRAKE]);
    lv_obj_set_size(s_chart_brake_5s, 784, 172);
    lv_obj_align(s_chart_brake_5s, LV_ALIGN_TOP_MID, 0, 250);
    lv_chart_set_type(s_chart_brake_5s, LV_CHART_TYPE_LINE);
    lv_chart_set_point_count(s_chart_brake_5s, PLOT_POINTS_5S);
    lv_chart_set_update_mode(s_chart_brake_5s, LV_CHART_UPDATE_MODE_SHIFT);
    lv_chart_set_range(s_chart_brake_5s, LV_CHART_AXIS_PRIMARY_Y, 0, 1200);
    lv_obj_set_style_bg_color(s_chart_brake_5s, lv_color_hex(UI_COLOR_BG), 0);
    lv_obj_set_style_border_color(s_chart_brake_5s, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(s_chart_brake_5s, 8, 0);

    s_ser_brake_5s_cmd = lv_chart_add_series(s_chart_brake_5s, lv_color_hex(UI_COLOR_ACCENT_CMD), LV_CHART_AXIS_PRIMARY_Y);
    s_ser_brake_5s_act = lv_chart_add_series(s_chart_brake_5s, lv_color_hex(UI_COLOR_ACCENT_ACT), LV_CHART_AXIS_PRIMARY_Y);

    lv_obj_t *lbl_b5_legend = lv_label_create(s_screens[WIN_BRAKE]);
    lv_label_set_text(lbl_b5_legend, "5s REAL-TIME SCOPE (100ms) • CMD: CYAN | ACT: EMERALD (0 to 1200 kPa)");
    lv_obj_set_style_text_font(lbl_b5_legend, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b5_legend, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_b5_legend, LV_ALIGN_TOP_LEFT, 18, 254);

    // Bottom Action Button: Expand to 15s Scope
    lv_obj_t *btn_expand_b = lv_button_create(s_screens[WIN_BRAKE]);
    lv_obj_set_size(btn_expand_b, 784, 46);
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
    // Window 3: 3. DRIVE (MTR) - Numerics + Embedded 5s Scope Plot
    // =========================================================================
    s_screens[WIN_DRIVE] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_DRIVE], lv_color_hex(UI_COLOR_BG), 0);
    create_top_nav_bar(s_screens[WIN_DRIVE], WIN_DRIVE);

    // Card 1: Command
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
    lv_obj_align(s_lbl_drive_cmd, LV_ALIGN_CENTER, 0, -22);

    lv_obj_t *box_d_cmd = lv_obj_create(c_dcmd);
    lv_obj_set_size(box_d_cmd, 226, 32);
    lv_obj_align(box_d_cmd, LV_ALIGN_CENTER, 0, 16);
    lv_obj_set_style_bg_color(box_d_cmd, lv_color_hex(0x121A24), 0);
    lv_obj_set_style_border_color(box_d_cmd, lv_color_hex(0x1E3A50), 0);
    lv_obj_set_style_radius(box_d_cmd, 6, 0);
    lv_obj_set_style_pad_all(box_d_cmd, 0, 0);
    lv_obj_t *lbl_d_gear_tgt = lv_label_create(box_d_cmd);
    lv_label_set_text(lbl_d_gear_tgt, "TARGET: [ D ] (DRIVE)");
    lv_obj_set_style_text_font(lbl_d_gear_tgt, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_d_gear_tgt, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(lbl_d_gear_tgt, LV_ALIGN_CENTER, 0, 0);

    lv_obj_t *lbl_d_cl = lv_label_create(c_dcmd);
    lv_label_set_text(lbl_d_cl, "[ OK ] DRIVE REQ VALID");
    lv_obj_set_style_text_font(lbl_d_cl, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_d_cl, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_d_cl, LV_ALIGN_BOTTOM_LEFT, 0, 0);

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
    lv_obj_align(s_lbl_drive_act, LV_ALIGN_CENTER, 0, -22);

    lv_obj_t *box_d_act = lv_obj_create(c_dact);
    lv_obj_set_size(box_d_act, 226, 32);
    lv_obj_align(box_d_act, LV_ALIGN_CENTER, 0, 16);
    lv_obj_set_style_bg_color(box_d_act, lv_color_hex(0x0C2218), 0);
    lv_obj_set_style_border_color(box_d_act, lv_color_hex(0x155032), 0);
    lv_obj_set_style_radius(box_d_act, 6, 0);
    lv_obj_set_style_pad_all(box_d_act, 0, 0);
    s_lbl_drive_gear = lv_label_create(box_d_act);
    lv_label_set_text(s_lbl_drive_gear, "ACTUAL: [ D ] (ENGAGED)");
    lv_obj_set_style_text_font(s_lbl_drive_gear, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_drive_gear, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_drive_gear, LV_ALIGN_CENTER, 0, 0);

    s_lbl_drive_rpm = lv_label_create(c_dact);
    lv_label_set_text(s_lbl_drive_rpm, "RPM: 1240 | CURRENT: 18.2A");
    lv_obj_set_style_text_font(s_lbl_drive_rpm, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_drive_rpm, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_drive_rpm, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Card 3: Delta & Powertrain Status
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
    lv_label_set_text(s_lbl_drive_delta_val, "Δ: 0.2 km/h  [ TRACKING OK ]");
    lv_obj_set_style_text_font(s_lbl_drive_delta_val, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_drive_delta_val, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_drive_delta_val, LV_ALIGN_CENTER, 0, 0);

    lv_obj_t *box_d_sec = lv_obj_create(c_ddt);
    lv_obj_set_size(box_d_sec, 226, 76);
    lv_obj_align(box_d_sec, LV_ALIGN_TOP_MID, 0, 52);
    lv_obj_set_style_bg_color(box_d_sec, lv_color_hex(0x121A24), 0);
    lv_obj_set_style_border_color(box_d_sec, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
    lv_obj_set_style_radius(box_d_sec, 6, 0);
    lv_obj_set_style_pad_all(box_d_sec, 2, 0);

    lv_obj_t *lbl_d_stitle = lv_label_create(box_d_sec);
    lv_label_set_text(lbl_d_stitle, "SAFETY INTERLOCKS");
    lv_obj_set_style_text_font(lbl_d_stitle, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_d_stitle, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_d_stitle, LV_ALIGN_TOP_MID, 0, 0);

    lv_obj_t *lbl_d_allclr = lv_label_create(box_d_sec);
    lv_label_set_text(lbl_d_allclr, "ALL CLEAR");
    lv_obj_set_style_text_font(lbl_d_allclr, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_color(lbl_d_allclr, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_d_allclr, LV_ALIGN_CENTER, 0, 2);

    lv_obj_t *lbl_d_inhibit = lv_label_create(box_d_sec);
    lv_label_set_text(lbl_d_inhibit, "[ BRAKE PRIORITY OK ]");
    lv_obj_set_style_text_font(lbl_d_inhibit, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_d_inhibit, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_d_inhibit, LV_ALIGN_BOTTOM_MID, 0, 0);

    lv_obj_t *lbl_d_hlth = lv_label_create(c_ddt);
    lv_label_set_text(lbl_d_hlth, "[ OK ] MTR NODE ACTIVE (50 Hz)");
    lv_obj_set_style_text_font(lbl_d_hlth, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_d_hlth, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_d_hlth, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Middle Deck: Embedded 5-Second Drive Speed Scope Plot
    s_chart_drive_5s = lv_chart_create(s_screens[WIN_DRIVE]);
    lv_obj_set_size(s_chart_drive_5s, 784, 172);
    lv_obj_align(s_chart_drive_5s, LV_ALIGN_TOP_MID, 0, 250);
    lv_chart_set_type(s_chart_drive_5s, LV_CHART_TYPE_LINE);
    lv_chart_set_point_count(s_chart_drive_5s, PLOT_POINTS_5S);
    lv_chart_set_update_mode(s_chart_drive_5s, LV_CHART_UPDATE_MODE_SHIFT);
    lv_chart_set_range(s_chart_drive_5s, LV_CHART_AXIS_PRIMARY_Y, 0, 35);
    lv_obj_set_style_bg_color(s_chart_drive_5s, lv_color_hex(UI_COLOR_BG), 0);
    lv_obj_set_style_border_color(s_chart_drive_5s, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(s_chart_drive_5s, 8, 0);

    s_ser_drive_5s_cmd = lv_chart_add_series(s_chart_drive_5s, lv_color_hex(UI_COLOR_ACCENT_CMD), LV_CHART_AXIS_PRIMARY_Y);
    s_ser_drive_5s_act = lv_chart_add_series(s_chart_drive_5s, lv_color_hex(UI_COLOR_ACCENT_ACT), LV_CHART_AXIS_PRIMARY_Y);

    lv_obj_t *lbl_d5_legend = lv_label_create(s_screens[WIN_DRIVE]);
    lv_label_set_text(lbl_d5_legend, "5s REAL-TIME SCOPE (100ms) • CMD: CYAN | ACT: EMERALD (0 to 35 km/h)");
    lv_obj_set_style_text_font(lbl_d5_legend, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_d5_legend, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_d5_legend, LV_ALIGN_TOP_LEFT, 18, 254);

    // Bottom Action Button: Expand to 15s Scope
    lv_obj_t *btn_expand_d = lv_button_create(s_screens[WIN_DRIVE]);
    lv_obj_set_size(btn_expand_d, 784, 46);
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
    // Window 4: 4. BUS & NODES (Detailed Bus & Watchdog Diagnostics)
    // =========================================================================
    s_screens[WIN_BUS_SAFETY] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_BUS_SAFETY], lv_color_hex(UI_COLOR_BG), 0);
    create_top_nav_bar(s_screens[WIN_BUS_SAFETY], WIN_BUS_SAFETY);

    // E-Stop Banner
    lv_obj_t *card_estop_det = lv_obj_create(s_screens[WIN_BUS_SAFETY]);
    lv_obj_set_size(card_estop_det, 784, 68);
    lv_obj_align(card_estop_det, LV_ALIGN_TOP_MID, 0, 52);
    lv_obj_set_style_bg_color(card_estop_det, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(card_estop_det, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(card_estop_det, 8, 0);

    s_lbl_bus_estop_status = lv_label_create(card_estop_det);
    lv_label_set_text(s_lbl_bus_estop_status, "[ OK ] E-STOP DISENGAGED • SYSTEM CLEAR");
    lv_obj_set_style_text_font(s_lbl_bus_estop_status, &lv_font_montserrat_18, 0);
    lv_obj_set_style_text_color(s_lbl_bus_estop_status, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_bus_estop_status, LV_ALIGN_CENTER, 0, -10);

    s_lbl_bus_estop_origin = lv_label_create(card_estop_det);
    lv_label_set_text(s_lbl_bus_estop_origin, "Interlock Source: NONE  |  Hardware Pin: HIGH  |  Reason: 0");
    lv_obj_set_style_text_font(s_lbl_bus_estop_origin, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_bus_estop_origin, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(s_lbl_bus_estop_origin, LV_ALIGN_CENTER, 0, 14);

    // 3 Hardware Stats (12V Rail, CAN Health, SD Recorder)
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
    lv_label_set_text(s_lbl_drive_15s_hdr, "DRIVE 15s SCOPE  •  CMD: 15.0 km/h  |  ACT: 14.8 km/h  |  Δ: 0.2  |  RPM: 1240");
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
    ESP_LOGI(TAG, "UI Manager initialized with 8 screens (Cockpit Dashboard + 5s Embedded Scopes)");
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

    // Push data to 5-second and 15-second charts if not paused
    if (!s_scope_paused) {
        if (s_chart_steer_5s && s_ser_steer_5s_cmd && s_ser_steer_5s_act) {
            lv_chart_set_next_value(s_chart_steer_5s, s_ser_steer_5s_cmd, (int32_t)t->steer_cmd_deg);
            lv_chart_set_next_value(s_chart_steer_5s, s_ser_steer_5s_act, (int32_t)t->steer_act_deg);
        }
        if (s_chart_brake_5s && s_ser_brake_5s_cmd && s_ser_brake_5s_act) {
            lv_chart_set_next_value(s_chart_brake_5s, s_ser_brake_5s_cmd, (int32_t)t->brake_cmd_kpa);
            lv_chart_set_next_value(s_chart_brake_5s, s_ser_brake_5s_act, (int32_t)t->brake_act_kpa);
        }
        if (s_chart_drive_5s && s_ser_drive_5s_cmd && s_ser_drive_5s_act) {
            lv_chart_set_next_value(s_chart_drive_5s, s_ser_drive_5s_cmd, (int32_t)t->drive_cmd_kmh);
            lv_chart_set_next_value(s_chart_drive_5s, s_ser_drive_5s_act, (int32_t)t->drive_act_kmh);
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

    const char gear_chars[] = {'P', 'R', 'N', 'D'};
    char g = (t->drive_act_gear < 4) ? gear_chars[t->drive_act_gear] : 'D';
    bool takeover = (t->ses_control_mode_status == 3);

    // -------------------------------------------------------------------------
    // Update Screen 0: Dashboard (CAN Watch Cockpit)
    // -------------------------------------------------------------------------
    if (s_current_win == WIN_DASHBOARD) {
        if (s_lbl_dash_estop) {
            if (t->estop_active) {
                lv_label_set_text(s_lbl_dash_estop, "[ ! ] E-STOP ACTIVE • HARDWARE INTERLOCK");
                lv_obj_set_style_text_color(s_lbl_dash_estop, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
                if (s_card_dash_estop) {
                    lv_obj_set_style_bg_color(s_card_dash_estop, lv_color_hex(0x38080F), 0);
                    lv_obj_set_style_border_color(s_card_dash_estop, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
                }
            } else {
                lv_label_set_text(s_lbl_dash_estop, "[ OK ] E-STOP DISENGAGED • SYSTEM CLEAR");
                lv_obj_set_style_text_color(s_lbl_dash_estop, lv_color_hex(UI_COLOR_STATE_OK), 0);
                if (s_card_dash_estop) {
                    lv_obj_set_style_bg_color(s_card_dash_estop, lv_color_hex(0x062817), 0);
                    lv_obj_set_style_border_color(s_card_dash_estop, lv_color_hex(UI_COLOR_STATE_OK), 0);
                }
            }
        }

        if (s_lbl_dash_steer_act) {
            snprintf(buf, sizeof(buf), "%+0.1f°", t->steer_act_deg);
            lv_label_set_text(s_lbl_dash_steer_act, buf);
        }
        if (s_lbl_dash_steer_target) {
            float delta = fabsf(t->steer_cmd_deg - t->steer_act_deg);
            snprintf(buf, sizeof(buf), "CMD: %+0.1f°  |  Δ: %0.1f° [%s]",
                     t->steer_cmd_deg, delta, delta > 2.0f ? "LAG" : "OK");
            lv_label_set_text(s_lbl_dash_steer_target, buf);
        }
        if (s_lbl_dash_steer_torq) {
            snprintf(buf, sizeof(buf), "Torque: %+0.1f Nm [%s]",
                     t->steer_torque_nm, takeover ? "TAKEOVER!" : "NO OVERRIDE");
            lv_label_set_text(s_lbl_dash_steer_torq, buf);
        }

        if (s_lbl_dash_brake_act) {
            snprintf(buf, sizeof(buf), "%.0f kPa", t->brake_act_kpa);
            lv_label_set_text(s_lbl_dash_brake_act, buf);
        }
        if (s_lbl_dash_brake_target) {
            float delta = t->brake_act_kpa - t->brake_cmd_kpa;
            snprintf(buf, sizeof(buf), "CMD: %.0f kPa  |  Δ: %+0.0f [%s]",
                     t->brake_cmd_kpa, delta, fabsf(delta) > 50.0f ? "LAG" : "OK");
            lv_label_set_text(s_lbl_dash_brake_target, buf);
        }

        if (s_lbl_dash_drive_act) {
            snprintf(buf, sizeof(buf), "%0.1f km/h", t->drive_act_kmh);
            lv_label_set_text(s_lbl_dash_drive_act, buf);
        }
        if (s_lbl_dash_drive_target) {
            snprintf(buf, sizeof(buf), "CMD: %0.1f km/h  |  Δ: %+0.1f [OK]",
                     t->drive_cmd_kmh, t->drive_act_kmh - t->drive_cmd_kmh);
            lv_label_set_text(s_lbl_dash_drive_target, buf);
        }
        if (s_lbl_dash_drive_aux) {
            snprintf(buf, sizeof(buf), "RPM: %u  |  GEAR: [ %c ]", t->drive_motor_rpm, g);
            lv_label_set_text(s_lbl_dash_drive_aux, buf);
        }

        if (s_lbl_dash_can_rate) {
            snprintf(buf, sizeof(buf), "%.0f msg/s", t->bus_rate_hz);
            lv_label_set_text(s_lbl_dash_can_rate, buf);
        }
        if (s_lbl_dash_can_err) {
            snprintf(buf, sizeof(buf), "TEC: %d | REC: %d [%s]",
                     t->twai_tec, t->twai_rec, t->twai_tec > 96 || t->twai_rec > 96 ? "WARN" : "BUS OK");
            lv_label_set_text(s_lbl_dash_can_err, buf);
        }
        if (s_lbl_dash_rail_volts) {
            snprintf(buf, sizeof(buf), "12V Rail: %0.1f V [BATTERY OK]", t->rail_volts_12v);
            lv_label_set_text(s_lbl_dash_rail_volts, buf);
        }

        for (int i = 0; i < 5; i++) {
            if (s_lbl_dash_node_rates[i]) {
                snprintf(buf, sizeof(buf), "%.0f Hz", t->nodes[i].rate_hz);
                lv_label_set_text(s_lbl_dash_node_rates[i], buf);
            }
            if (s_lbl_dash_node_states[i]) {
                bool ok = !t->nodes[i].timeout;
                lv_label_set_text(s_lbl_dash_node_states[i], ok ? "[ OK ]" : "[ TIMEOUT ]");
                lv_obj_set_style_text_color(s_lbl_dash_node_states[i], lv_color_hex(ok ? UI_COLOR_STATE_OK : UI_COLOR_STATE_FAULT), 0);
            }
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
        if (s_lbl_steer_act) {
            snprintf(buf, sizeof(buf), "%+0.1f°", t->steer_act_deg);
            lv_label_set_text(s_lbl_steer_act, buf);
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
    }

    // -------------------------------------------------------------------------
    // Update Screen 2: Brake (SEB)
    // -------------------------------------------------------------------------
    else if (s_current_win == WIN_BRAKE) {
        if (s_lbl_brake_cmd) {
            snprintf(buf, sizeof(buf), "%.0f kPa", t->brake_cmd_kpa);
            lv_label_set_text(s_lbl_brake_cmd, buf);
        }
        if (s_lbl_brake_act) {
            snprintf(buf, sizeof(buf), "%.0f kPa", t->brake_act_kpa);
            lv_label_set_text(s_lbl_brake_act, buf);
        }
        if (s_lbl_brake_delta_val) {
            float delta = t->brake_act_kpa - t->brake_cmd_kpa;
            snprintf(buf, sizeof(buf), "Δ: %+0.0f kPa   [ %s ]", delta, fabsf(delta) > 50.0f ? "TRACKING LAG" : "TRACKING OK");
            lv_label_set_text(s_lbl_brake_delta_val, buf);
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
        if (s_lbl_drive_delta_val) {
            float delta = t->drive_act_kmh - t->drive_cmd_kmh;
            snprintf(buf, sizeof(buf), "Δ: %+0.1f km/h   [ %s ]", delta, fabsf(delta) > 1.0f ? "TRACKING LAG" : "TRACKING OK");
            lv_label_set_text(s_lbl_drive_delta_val, buf);
        }
    }

    // -------------------------------------------------------------------------
    // Update Screen 4: Bus & Safety
    // -------------------------------------------------------------------------
    else if (s_current_win == WIN_BUS_SAFETY) {
        if (s_lbl_bus_rate) {
            snprintf(buf, sizeof(buf), "%.0f msg/s", t->bus_rate_hz);
            lv_label_set_text(s_lbl_bus_rate, buf);
        }
        if (s_lbl_bus_tec_rec) {
            snprintf(buf, sizeof(buf), "TEC: %d | REC: %d [NORMAL]", t->twai_tec, t->twai_rec);
            lv_label_set_text(s_lbl_bus_tec_rec, buf);
        }
        for (int i = 0; i < 5; i++) {
            if (s_lbl_bus_node_rates[i]) {
                snprintf(buf, sizeof(buf), "%.0f Hz", t->nodes[i].rate_hz);
                lv_label_set_text(s_lbl_bus_node_rates[i], buf);
            }
            if (s_lbl_bus_node_states[i]) {
                bool ok = !t->nodes[i].timeout;
                lv_label_set_text(s_lbl_bus_node_states[i], ok ? "[ OK ] ACTIVE" : "[ ! ] TIMEOUT");
                lv_obj_set_style_text_color(s_lbl_bus_node_states[i], lv_color_hex(ok ? UI_COLOR_STATE_OK : UI_COLOR_STATE_FAULT), 0);
            }
        }
    }

    // -------------------------------------------------------------------------
    // Update 15s Expanded Scope Screens
    // -------------------------------------------------------------------------
    else if (s_current_win == WIN_STEER_PLOT_15S && s_lbl_steer_15s_hdr) {
        snprintf(buf, sizeof(buf), "STEER 15s SCOPE • CMD: %+0.1f° | ACT: %+0.1f° | Δ: %0.1f° | Torq: %+0.1f Nm",
                 t->steer_cmd_deg, t->steer_act_deg, fabsf(t->steer_cmd_deg - t->steer_act_deg), t->steer_torque_nm);
        lv_label_set_text(s_lbl_steer_15s_hdr, buf);
    }
    else if (s_current_win == WIN_BRAKE_PLOT_15S && s_lbl_brake_15s_hdr) {
        snprintf(buf, sizeof(buf), "BRAKE 15s SCOPE • CMD: %.0f kPa | ACT: %.0f kPa | Δ: %+0.0f kPa",
                 t->brake_cmd_kpa, t->brake_act_kpa, t->brake_act_kpa - t->brake_cmd_kpa);
        lv_label_set_text(s_lbl_brake_15s_hdr, buf);
    }
    else if (s_current_win == WIN_DRIVE_PLOT_15S && s_lbl_drive_15s_hdr) {
        snprintf(buf, sizeof(buf), "DRIVE 15s SCOPE • CMD: %0.1f km/h | ACT: %0.1f km/h | RPM: %u",
                 t->drive_cmd_kmh, t->drive_act_kmh, t->drive_motor_rpm);
        lv_label_set_text(s_lbl_drive_15s_hdr, buf);
    }
}
