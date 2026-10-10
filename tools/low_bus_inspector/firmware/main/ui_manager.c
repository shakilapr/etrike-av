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

// Row 2: ISO 2575 Telltale cards & labels
static lv_obj_t *s_card_dash_telltales[5] = {NULL};
static lv_obj_t *s_lbl_dash_telltale_sym[5] = {NULL};
static lv_obj_t *s_lbl_dash_telltale_lbl[5] = {NULL};

// Row 2: Subsystem Connectivity Buttons (SYS, RT, HOST, SEB, SES)
static lv_obj_t *s_btn_dash_nodes[5] = {NULL};
static lv_obj_t *s_lbl_dash_nodes[5] = {NULL};

// 2 Actuator Columns (Steering SES & Braking SEB)
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
 * Screen 3: Detailed Bus & Safety Diagnostics
 * ========================================================================= */
static lv_obj_t *s_lbl_bus_estop_status = NULL;
static lv_obj_t *s_lbl_bus_estop_origin = NULL;
static lv_obj_t *s_lbl_bus_rail_volts = NULL;
static lv_obj_t *s_lbl_bus_rate = NULL;
static lv_obj_t *s_lbl_bus_tec_rec = NULL;
static lv_obj_t *s_lbl_bus_sys_heap = NULL;
static lv_obj_t *s_lbl_bus_sys_diag = NULL;
static lv_obj_t *s_card_bus_nodes[5] = {NULL};
static lv_obj_t *s_lbl_bus_node_rates[5] = {NULL};
static lv_obj_t *s_lbl_bus_node_states[5] = {NULL};
static lv_obj_t *s_lbl_bus_node_silent[5] = {NULL};

/* =========================================================================
 * Screen 4: Industrial Active DTC & Chronological Event Journal Widgets
 * ========================================================================= */
#define DTC_TABLE_MAX_ROWS 8

typedef struct {
    lv_obj_t *row_obj;
    lv_obj_t *badge_box;
    lv_obj_t *lbl_badge;
    lv_obj_t *lbl_code;
    lv_obj_t *lbl_origin;
    lv_obj_t *lbl_desc;
    lv_obj_t *lbl_status;
} dtc_row_widget_t;

static uint8_t s_logs_view_mode = 0; // 0 = DTC MATRIX, 1 = EVENT JOURNAL
static lv_obj_t *s_btn_view_dtc = NULL;
static lv_obj_t *s_btn_view_journal = NULL;
static lv_obj_t *s_lbl_logs_l3_cnt = NULL;
static lv_obj_t *s_lbl_logs_l2_cnt = NULL;
static lv_obj_t *s_lbl_logs_l1_cnt = NULL;
static lv_obj_t *s_lbl_logs_total_cnt = NULL;

static lv_obj_t *s_cont_dtc_view = NULL;
static lv_obj_t *s_card_dtc_healthy = NULL;
static lv_obj_t *s_lbl_dtc_healthy_sub = NULL;
static lv_obj_t *s_cont_dtc_table = NULL;
static dtc_row_widget_t s_dtc_rows[DTC_TABLE_MAX_ROWS];

static lv_obj_t *s_cont_journal_view = NULL;
static lv_obj_t *s_lbl_journal_text = NULL;
static lv_obj_t *s_lbl_journal_stats = NULL;

static void logs_mode_btn_cb(lv_event_t *e) {
    intptr_t mode = (intptr_t)lv_event_get_user_data(e);
    s_logs_view_mode = (uint8_t)mode;
    if (s_logs_view_mode == 0) {
        lv_obj_clear_flag(s_cont_dtc_view, LV_OBJ_FLAG_HIDDEN);
        lv_obj_add_flag(s_cont_journal_view, LV_OBJ_FLAG_HIDDEN);
        lv_obj_set_style_bg_color(s_btn_view_dtc, lv_color_hex(UI_COLOR_SURFACE_ALT), 0);
        lv_obj_set_style_border_color(s_btn_view_dtc, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
        lv_obj_set_style_bg_color(s_btn_view_journal, lv_color_hex(UI_COLOR_SURFACE), 0);
        lv_obj_set_style_border_color(s_btn_view_journal, lv_color_hex(UI_COLOR_BORDER), 0);
    } else {
        lv_obj_add_flag(s_cont_dtc_view, LV_OBJ_FLAG_HIDDEN);
        lv_obj_clear_flag(s_cont_journal_view, LV_OBJ_FLAG_HIDDEN);
        lv_obj_set_style_bg_color(s_btn_view_journal, lv_color_hex(UI_COLOR_SURFACE_ALT), 0);
        lv_obj_set_style_border_color(s_btn_view_journal, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
        lv_obj_set_style_bg_color(s_btn_view_dtc, lv_color_hex(UI_COLOR_SURFACE), 0);
        lv_obj_set_style_border_color(s_btn_view_dtc, lv_color_hex(UI_COLOR_BORDER), 0);
    }
}

/* =========================================================================
 * Screens 5, 6: Expanded 15-Second Scope Plots
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

static lv_obj_t *s_card_steer_bitview = NULL;
static lv_obj_t *s_lbl_steer_bitview = NULL;

static lv_obj_t *s_card_brake_bitview = NULL;
static lv_obj_t *s_lbl_brake_bitview = NULL;

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
        "0. DASH", "1. STEER", "2. BRAKE", "3. NODES", "4. LOGS"
    };
    inspector_window_t targets[5] = {
        WIN_DASHBOARD, WIN_STEER, WIN_BRAKE, WIN_BUS_SAFETY, WIN_LOGS
    };

    const int tab_w = 152;
    const int tab_h = 42;
    const int gap = 6;
    const int start_x = 7;

    for (int i = 0; i < 5; i++) {
        lv_obj_t *btn = lv_button_create(bar);
        lv_obj_set_size(btn, tab_w, tab_h);
        lv_obj_align(btn, LV_ALIGN_LEFT_MID, start_x + i * (tab_w + gap), 0);

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
    lv_obj_align(lbl_cs_t, LV_ALIGN_LEFT_MID, 12, 0);

    s_card_dash_safety = lv_obj_create(c_dstate);
    lv_obj_set_size(s_card_dash_safety, 120, 26);
    lv_obj_align(s_card_dash_safety, LV_ALIGN_LEFT_MID, 130, 0);
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
    lv_label_set_text(lbl_m_t, "CONTROL MODE:");
    lv_obj_set_style_text_font(lbl_m_t, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_m_t, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_m_t, LV_ALIGN_LEFT_MID, 275, 0);

    s_card_dash_mode = lv_obj_create(c_dstate);
    lv_obj_set_size(s_card_dash_mode, 140, 26);
    lv_obj_align(s_card_dash_mode, LV_ALIGN_LEFT_MID, 395, 0);
    lv_obj_set_style_bg_color(s_card_dash_mode, lv_color_hex(0x121A24), 0);
    lv_obj_set_style_border_color(s_card_dash_mode, lv_color_hex(0x1E3A50), 0);
    lv_obj_set_style_radius(s_card_dash_mode, 6, 0);
    lv_obj_set_style_pad_all(s_card_dash_mode, 0, 0);
    s_lbl_dash_mode = lv_label_create(s_card_dash_mode);
    lv_label_set_text(s_lbl_dash_mode, "AUTONOMOUS");
    lv_obj_set_style_text_font(s_lbl_dash_mode, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_dash_mode, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(s_lbl_dash_mode, LV_ALIGN_CENTER, 0, 0);

    lv_obj_t *lbl_lbm = lv_label_create(c_dstate);
    lv_label_set_text(lbl_lbm, "LOW-BUS (500 kbps)");
    lv_obj_set_style_text_font(lbl_lbm, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_lbm, lv_color_hex(UI_COLOR_STATE_OFFLINE), 0);
    lv_obj_align(lbl_lbm, LV_ALIGN_RIGHT_MID, -12, 0);

    // 2. Subsystem Connectivity & Telltales Deck (Y=98, H=46)
    // Left: 5 Compact ISO 2575 Telltales | Right: 5 Node Buttons (SYS, RT, HOST, SEB, SES)
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

    // Right: 5 Node Connectivity buttons (SYS, RT, HOST, SEB, SES)
    const char *dash_node_names[5] = {"SYS", "RT", "HOST", "SEB", "SES"};
    const inspector_window_t dash_node_dest[5] = {
        WIN_BUS_SAFETY, WIN_BUS_SAFETY, WIN_BUS_SAFETY,
        WIN_BRAKE, WIN_STEER
    };
    const int node_w[5] = {70, 70, 78, 70, 70};
    int node_x = 380;
    for (int i = 0; i < 5; i++) {
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

        node_x += node_w[i] + 8;
    }

    // 3. Cockpit 2-Actuator Deck (Y=146, H=272) - 2 Columns (Steering & Braking, 388px each)
    const int col_w = 388;
    const int inst_h = 272;
    const int inst_y = 146;

    // --- Column 1: Steering Angle (SES) ---
    lv_obj_t *c_dsteer = lv_obj_create(s_screens[WIN_DASHBOARD]);
    lv_obj_set_size(c_dsteer, col_w, inst_h);
    lv_obj_align(c_dsteer, LV_ALIGN_TOP_LEFT, 6, inst_y);
    lv_obj_set_style_bg_opa(c_dsteer, LV_OPA_TRANSP, 0);
    lv_obj_set_style_border_width(c_dsteer, 0, 0);
    lv_obj_set_style_pad_all(c_dsteer, 6, 0);
    lv_obj_add_event_cb(c_dsteer, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_STEER);

    lv_obj_t *lbl_stt = lv_label_create(c_dsteer);
    lv_label_set_text(lbl_stt, "STEERING ANGLE (+/-45 deg)");
    lv_obj_set_style_text_font(lbl_stt, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_stt, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_stt, LV_ALIGN_TOP_LEFT, 4, 0);

    s_lbl_dash_steer_val = lv_label_create(c_dsteer);
    lv_label_set_text(s_lbl_dash_steer_val, "+0.0 deg");
    lv_obj_set_style_text_font(s_lbl_dash_steer_val, &lv_font_montserrat_48, 0);
    lv_obj_set_style_text_color(s_lbl_dash_steer_val, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_dash_steer_val, LV_ALIGN_TOP_MID, 0, 36);

    lv_obj_t *lbl_stu = lv_label_create(c_dsteer);
    lv_label_set_text(lbl_stu, "ACTUAL ROAD-WHEEL ANGLE");
    lv_obj_set_style_text_font(lbl_stu, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_stu, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_stu, LV_ALIGN_TOP_MID, 0, 92);

    s_lbl_dash_steer_cmd = lv_label_create(c_dsteer);
    lv_label_set_text(s_lbl_dash_steer_cmd, "CMD: +0.0 [DIFF: 0.0 OK]");
    lv_obj_set_style_text_font(s_lbl_dash_steer_cmd, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_dash_steer_cmd, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(s_lbl_dash_steer_cmd, LV_ALIGN_TOP_MID, 0, 138);

    s_lbl_dash_steer_torq = lv_label_create(c_dsteer);
    lv_label_set_text(s_lbl_dash_steer_torq, "TORQUE: +0.0 Nm [NO OVERRIDE]");
    lv_obj_set_style_text_font(s_lbl_dash_steer_torq, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_dash_steer_torq, lv_color_hex(UI_COLOR_STATE_WARN), 0);
    lv_obj_align(s_lbl_dash_steer_torq, LV_ALIGN_TOP_MID, 0, 180);

    lv_obj_t *lbl_s_stat = lv_label_create(c_dsteer);
    lv_label_set_text(lbl_s_stat, "[ OK ] SES ASSIST ACTIVE");
    lv_obj_set_style_text_font(lbl_s_stat, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_s_stat, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_s_stat, LV_ALIGN_BOTTOM_MID, 0, 0);

    // Subtle divider between Column 1 & Column 2
    lv_obj_t *div1 = lv_obj_create(s_screens[WIN_DASHBOARD]);
    lv_obj_set_size(div1, 1, inst_h - 16);
    lv_obj_align(div1, LV_ALIGN_TOP_LEFT, 399, inst_y + 8);
    lv_obj_set_style_bg_color(div1, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_border_width(div1, 0, 0);

    // --- Column 2: Hydraulic Brake (SEB) ---
    lv_obj_t *c_dbrk = lv_obj_create(s_screens[WIN_DASHBOARD]);
    lv_obj_set_size(c_dbrk, col_w, inst_h);
    lv_obj_align(c_dbrk, LV_ALIGN_TOP_LEFT, 404, inst_y);
    lv_obj_set_style_bg_opa(c_dbrk, LV_OPA_TRANSP, 0);
    lv_obj_set_style_border_width(c_dbrk, 0, 0);
    lv_obj_set_style_pad_all(c_dbrk, 6, 0);
    lv_obj_add_event_cb(c_dbrk, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_BRAKE);

    lv_obj_t *lbl_brt = lv_label_create(c_dbrk);
    lv_label_set_text(lbl_brt, "HYDRAULIC BRAKE (0-1500 kPa)");
    lv_obj_set_style_text_font(lbl_brt, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_brt, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_brt, LV_ALIGN_TOP_LEFT, 4, 0);

    s_lbl_dash_brake_val = lv_label_create(c_dbrk);
    lv_label_set_text(s_lbl_dash_brake_val, "0 kPa");
    lv_obj_set_style_text_font(s_lbl_dash_brake_val, &lv_font_montserrat_48, 0);
    lv_obj_set_style_text_color(s_lbl_dash_brake_val, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_dash_brake_val, LV_ALIGN_TOP_MID, 0, 36);

    // Progress Bars: Feedback & Command (Width 340px)
    lv_obj_t *lbl_bf = lv_label_create(c_dbrk);
    lv_label_set_text(lbl_bf, "ACT:");
    lv_obj_set_style_text_font(lbl_bf, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_bf, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_bf, LV_ALIGN_TOP_LEFT, 4, 96);

    s_bar_dash_brake_act = lv_bar_create(c_dbrk);
    lv_obj_set_size(s_bar_dash_brake_act, 340, 12);
    lv_obj_align(s_bar_dash_brake_act, LV_ALIGN_TOP_LEFT, 38, 98);
    lv_bar_set_range(s_bar_dash_brake_act, 0, 1500);
    lv_bar_set_value(s_bar_dash_brake_act, 0, LV_ANIM_OFF);
    lv_obj_set_style_bg_color(s_bar_dash_brake_act, lv_color_hex(0x141414), 0);
    lv_obj_set_style_bg_color(s_bar_dash_brake_act, lv_color_hex(UI_COLOR_STATE_OK), LV_PART_INDICATOR);

    lv_obj_t *lbl_bc = lv_label_create(c_dbrk);
    lv_label_set_text(lbl_bc, "CMD:");
    lv_obj_set_style_text_font(lbl_bc, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_bc, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(lbl_bc, LV_ALIGN_TOP_LEFT, 4, 120);

    s_bar_dash_brake_cmd = lv_bar_create(c_dbrk);
    lv_obj_set_size(s_bar_dash_brake_cmd, 340, 10);
    lv_obj_align(s_bar_dash_brake_cmd, LV_ALIGN_TOP_LEFT, 38, 122);
    lv_bar_set_range(s_bar_dash_brake_cmd, 0, 1500);
    lv_bar_set_value(s_bar_dash_brake_cmd, 0, LV_ANIM_OFF);
    lv_obj_set_style_bg_color(s_bar_dash_brake_cmd, lv_color_hex(0x141414), 0);
    lv_obj_set_style_bg_color(s_bar_dash_brake_cmd, lv_color_hex(UI_COLOR_ACCENT_CMD), LV_PART_INDICATOR);

    s_lbl_dash_brake_aux = lv_label_create(c_dbrk);
    lv_label_set_text(s_lbl_dash_brake_aux, "STROKE: 0.0 mm  •  TEMP: 0°C");
    lv_obj_set_style_text_font(s_lbl_dash_brake_aux, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_dash_brake_aux, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_dash_brake_aux, LV_ALIGN_TOP_MID, 0, 156);

    lv_obj_t *lbl_b_stat = lv_label_create(c_dbrk);
    lv_label_set_text(lbl_b_stat, "[ OK ] SEB CLOSED-LOOP HEALTHY");
    lv_obj_set_style_text_font(lbl_b_stat, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b_stat, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_b_stat, LV_ALIGN_BOTTOM_MID, 0, 0);

    // 4. Bottom Bus Diagnostics Strip (Y=424, H=48)
    lv_obj_t *c_dbus = lv_obj_create(s_screens[WIN_DASHBOARD]);
    lv_obj_set_size(c_dbus, 792, 46);
    lv_obj_align(c_dbus, LV_ALIGN_TOP_MID, 0, 424);
    lv_obj_set_style_bg_color(c_dbus, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_dbus, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_radius(c_dbus, 6, 0);
    lv_obj_set_style_pad_all(c_dbus, 0, 0);

    s_lbl_dash_bus_strip = lv_label_create(c_dbus);
    lv_label_set_text(s_lbl_dash_bus_strip, "LOW-BUS CAN: -- msg/s  •  TEC: 0 | REC: 0 [BUS OK]  •  12V Rail: --.- V  •  Core: --°C");
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

    const int act_w = 264;
    const int u_h = 368;
    const int u_y = 50;

    // Column 1: Command (VCU 0x169) - Borderless
    lv_obj_t *c_scmd = lv_obj_create(s_screens[WIN_STEER]);
    lv_obj_set_size(c_scmd, act_w, u_h);
    lv_obj_align(c_scmd, LV_ALIGN_TOP_LEFT, 4, u_y);
    lv_obj_set_style_bg_opa(c_scmd, LV_OPA_TRANSP, 0);
    lv_obj_set_style_border_width(c_scmd, 0, 0);
    lv_obj_set_style_pad_all(c_scmd, 4, 0);

    lv_obj_t *lbl_sc1 = lv_label_create(c_scmd);
    lv_label_set_text(lbl_sc1, "COMMAND (VCU 0x169)");
    lv_obj_set_style_text_font(lbl_sc1, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_sc1, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_sc1, LV_ALIGN_TOP_LEFT, 4, 0);

    s_lbl_steer_cmd = lv_label_create(c_scmd);
    lv_label_set_text(s_lbl_steer_cmd, "+0.0 deg");
    lv_obj_set_style_text_font(s_lbl_steer_cmd, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(s_lbl_steer_cmd, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(s_lbl_steer_cmd, LV_ALIGN_TOP_MID, 0, 24);

    // In-Box 5s Mini-Plot under value (Touch navigates to Full Scope, widened to 256px)
    s_chart_steer_5s_cmd = create_inbox_sparkline(c_scmd, 256, 96, 72, -45, 45);
    s_ser_steer_5s_cmd = lv_chart_add_series(s_chart_steer_5s_cmd, lv_color_hex(UI_COLOR_ACCENT_CMD), LV_CHART_AXIS_PRIMARY_Y);
    lv_obj_add_event_cb(s_chart_steer_5s_cmd, chart_click_nav_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_STEER_PLOT_15S);

    s_lbl_steer_target_spd = lv_label_create(c_scmd);
    lv_label_set_text(s_lbl_steer_target_spd, "TARGET SPEED: 0 deg/s");
    lv_obj_set_style_text_font(s_lbl_steer_target_spd, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_steer_target_spd, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_steer_target_spd, LV_ALIGN_TOP_LEFT, 4, 180);

    s_lbl_steer_cmd_telemetry = lv_label_create(c_scmd);
    lv_label_set_text(s_lbl_steer_cmd_telemetry, "ROLLING CNT: 0  •  CHK: OK");
    lv_obj_set_style_text_font(s_lbl_steer_cmd_telemetry, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_cmd_telemetry, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_steer_cmd_telemetry, LV_ALIGN_TOP_LEFT, 4, 212);

    lv_obj_t *lbl_s_id = lv_label_create(c_scmd);
    lv_label_set_text(lbl_s_id, "CAN ID: 0x169 (20ms / 50 Hz)");
    lv_obj_set_style_text_font(lbl_s_id, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_s_id, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_s_id, LV_ALIGN_TOP_LEFT, 4, 240);

    s_lbl_steer_vcu_stat = lv_label_create(c_scmd);
    lv_label_set_text(s_lbl_steer_vcu_stat, "[ OK ] TARGET STREAM (50 Hz)");
    lv_obj_set_style_text_font(s_lbl_steer_vcu_stat, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_vcu_stat, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_steer_vcu_stat, LV_ALIGN_BOTTOM_LEFT, 4, 0);

    // Subtle divider line 1
    lv_obj_t *s_div1 = lv_obj_create(s_screens[WIN_STEER]);
    lv_obj_set_size(s_div1, 1, u_h - 16);
    lv_obj_align(s_div1, LV_ALIGN_TOP_LEFT, 269, u_y + 8);
    lv_obj_set_style_bg_color(s_div1, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_border_width(s_div1, 0, 0);

    // Column 2: Actuation (SES 0x201) - Borderless
    lv_obj_t *c_sact = lv_obj_create(s_screens[WIN_STEER]);
    lv_obj_set_size(c_sact, act_w, u_h);
    lv_obj_align(c_sact, LV_ALIGN_TOP_LEFT, 272, u_y);
    lv_obj_set_style_bg_opa(c_sact, LV_OPA_TRANSP, 0);
    lv_obj_set_style_border_width(c_sact, 0, 0);
    lv_obj_set_style_pad_all(c_sact, 4, 0);

    lv_obj_t *lbl_sa1 = lv_label_create(c_sact);
    lv_label_set_text(lbl_sa1, "ACTUATION (SES 0x201)");
    lv_obj_set_style_text_font(lbl_sa1, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_sa1, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_sa1, LV_ALIGN_TOP_LEFT, 4, 0);

    s_lbl_steer_act = lv_label_create(c_sact);
    lv_label_set_text(s_lbl_steer_act, "+0.0 deg");
    lv_obj_set_style_text_font(s_lbl_steer_act, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(s_lbl_steer_act, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_steer_act, LV_ALIGN_TOP_MID, 0, 24);

    // In-Box 5s Mini-Plot under value (Touch navigates to Full Scope, widened to 256px)
    s_chart_steer_5s_act = create_inbox_sparkline(c_sact, 256, 96, 72, -45, 45);
    s_ser_steer_5s_act = lv_chart_add_series(s_chart_steer_5s_act, lv_color_hex(UI_COLOR_ACCENT_ACT), LV_CHART_AXIS_PRIMARY_Y);
    lv_obj_add_event_cb(s_chart_steer_5s_act, chart_click_nav_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_STEER_PLOT_15S);

    s_lbl_steer_actual_spd = lv_label_create(c_sact);
    lv_label_set_text(s_lbl_steer_actual_spd, "ACTUAL SPEED: 0 deg/s");
    lv_obj_set_style_text_font(s_lbl_steer_actual_spd, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_steer_actual_spd, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_steer_actual_spd, LV_ALIGN_TOP_LEFT, 4, 180);

    s_lbl_steer_act_telemetry = lv_label_create(c_sact);
    lv_label_set_text(s_lbl_steer_act_telemetry, "MOTOR: 0.0 A  •  TEMP: 0°C");
    lv_obj_set_style_text_font(s_lbl_steer_act_telemetry, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_act_telemetry, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_steer_act_telemetry, LV_ALIGN_TOP_LEFT, 4, 212);

    s_lbl_steer_align = lv_label_create(c_sact);
    lv_label_set_text(s_lbl_steer_align, "ALIGNMENT: ZERO-POINT OK");
    lv_obj_set_style_text_font(s_lbl_steer_align, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_align, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(s_lbl_steer_align, LV_ALIGN_TOP_LEFT, 4, 240);

    s_lbl_steer_feedback_stat = lv_label_create(c_sact);
    lv_label_set_text(s_lbl_steer_feedback_stat, "[ OK ] FEEDBACK STREAM (100 Hz)");
    lv_obj_set_style_text_font(s_lbl_steer_feedback_stat, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_feedback_stat, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_steer_feedback_stat, LV_ALIGN_BOTTOM_LEFT, 4, 0);

    // Subtle divider line 2
    lv_obj_t *s_div2 = lv_obj_create(s_screens[WIN_STEER]);
    lv_obj_set_size(s_div2, 1, u_h - 16);
    lv_obj_align(s_div2, LV_ALIGN_TOP_LEFT, 537, u_y + 8);
    lv_obj_set_style_bg_color(s_div2, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_border_width(s_div2, 0, 0);

    // Column 3: Delta, Torque & DTC Diagnostics - Borderless
    lv_obj_t *c_sdt = lv_obj_create(s_screens[WIN_STEER]);
    lv_obj_set_size(c_sdt, act_w, u_h);
    lv_obj_align(c_sdt, LV_ALIGN_TOP_LEFT, 540, u_y);
    lv_obj_set_style_bg_opa(c_sdt, LV_OPA_TRANSP, 0);
    lv_obj_set_style_border_width(c_sdt, 0, 0);
    lv_obj_set_style_pad_all(c_sdt, 4, 0);

    lv_obj_t *lbl_sdt_title = lv_label_create(c_sdt);
    lv_label_set_text(lbl_sdt_title, "CLOSED-LOOP TRACKING");
    lv_obj_set_style_text_font(lbl_sdt_title, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_sdt_title, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_sdt_title, LV_ALIGN_TOP_LEFT, 4, 0);

    s_lbl_steer_delta_val = lv_label_create(c_sdt);
    lv_label_set_text(s_lbl_steer_delta_val, "DIFF: 0.0 deg  [ OK ]");
    lv_obj_set_style_text_font(s_lbl_steer_delta_val, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_color(s_lbl_steer_delta_val, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_steer_delta_val, LV_ALIGN_TOP_LEFT, 4, 22);

    lv_obj_t *lbl_tt = lv_label_create(c_sdt);
    lv_label_set_text(lbl_tt, "DRIVER COLUMN TORQUE");
    lv_obj_set_style_text_font(lbl_tt, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_tt, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_tt, LV_ALIGN_TOP_LEFT, 4, 68);

    s_lbl_steer_torq = lv_label_create(c_sdt);
    lv_label_set_text(s_lbl_steer_torq, "+0.0 Nm");
    lv_obj_set_style_text_font(s_lbl_steer_torq, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_color(s_lbl_steer_torq, lv_color_hex(UI_COLOR_STATE_WARN), 0);
    lv_obj_align(s_lbl_steer_torq, LV_ALIGN_TOP_LEFT, 4, 90);

    s_lbl_steer_override = lv_label_create(c_sdt);
    lv_label_set_text(s_lbl_steer_override, "[ NO OVERRIDE ]");
    lv_obj_set_style_text_font(s_lbl_steer_override, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_override, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_steer_override, LV_ALIGN_TOP_LEFT, 4, 126);

    s_lbl_steer_volt = lv_label_create(c_sdt);
    lv_label_set_text(s_lbl_steer_volt, "SUPPLY VOLT: --.- V  •  PWR: 0 W");
    lv_obj_set_style_text_font(s_lbl_steer_volt, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_volt, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_steer_volt, LV_ALIGN_TOP_LEFT, 4, 180);

    s_lbl_steer_dtc = lv_label_create(c_sdt);
    lv_label_set_text(s_lbl_steer_dtc, "DTC DIAGNOSIS: ALL CLEAR (0x0000)");
    lv_obj_set_style_text_font(s_lbl_steer_dtc, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_dtc, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_steer_dtc, LV_ALIGN_TOP_LEFT, 4, 212);

    s_lbl_steer_watchdog = lv_label_create(c_sdt);
    lv_label_set_text(s_lbl_steer_watchdog, "NODE SILENCE: -- ms  •  RX: 0");
    lv_obj_set_style_text_font(s_lbl_steer_watchdog, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_watchdog, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(s_lbl_steer_watchdog, LV_ALIGN_TOP_LEFT, 4, 240);

    s_lbl_steer_health = lv_label_create(c_sdt);
    lv_label_set_text(s_lbl_steer_health, "[ OK ] SES HEALTHY (100 Hz)");
    lv_obj_set_style_text_font(s_lbl_steer_health, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_steer_health, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_steer_health, LV_ALIGN_BOTTOM_LEFT, 4, 0);

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

    // Column 1: Command (VCU 0x7B9) - Borderless
    lv_obj_t *c_bcmd = lv_obj_create(s_screens[WIN_BRAKE]);
    lv_obj_set_size(c_bcmd, act_w, u_h);
    lv_obj_align(c_bcmd, LV_ALIGN_TOP_LEFT, 4, u_y);
    lv_obj_set_style_bg_opa(c_bcmd, LV_OPA_TRANSP, 0);
    lv_obj_set_style_border_width(c_bcmd, 0, 0);
    lv_obj_set_style_pad_all(c_bcmd, 4, 0);

    lv_obj_t *lbl_bc1 = lv_label_create(c_bcmd);
    lv_label_set_text(lbl_bc1, "COMMAND (VCU 0x7B9)");
    lv_obj_set_style_text_font(lbl_bc1, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_bc1, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_bc1, LV_ALIGN_TOP_LEFT, 4, 0);

    s_lbl_brake_cmd = lv_label_create(c_bcmd);
    lv_label_set_text(s_lbl_brake_cmd, "0 kPa");
    lv_obj_set_style_text_font(s_lbl_brake_cmd, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(s_lbl_brake_cmd, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
    lv_obj_align(s_lbl_brake_cmd, LV_ALIGN_TOP_MID, 0, 24);

    // In-Box 5s Mini-Plot under value (Touch navigates to Full Scope, widened to 256px)
    s_chart_brake_5s_cmd = create_inbox_sparkline(c_bcmd, 256, 96, 72, 0, 1200);
    s_ser_brake_5s_cmd = lv_chart_add_series(s_chart_brake_5s_cmd, lv_color_hex(UI_COLOR_ACCENT_CMD), LV_CHART_AXIS_PRIMARY_Y);
    lv_obj_add_event_cb(s_chart_brake_5s_cmd, chart_click_nav_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_BRAKE_PLOT_15S);

    s_lbl_brake_target_stroke = lv_label_create(c_bcmd);
    lv_label_set_text(s_lbl_brake_target_stroke, "TARGET STROKE: 0.0 mm");
    lv_obj_set_style_text_font(s_lbl_brake_target_stroke, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_brake_target_stroke, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_brake_target_stroke, LV_ALIGN_TOP_LEFT, 4, 180);

    s_lbl_brake_cmd_telemetry = lv_label_create(c_bcmd);
    lv_label_set_text(s_lbl_brake_cmd_telemetry, "ROLLING CNT: 0  •  MODE: PRES");
    lv_obj_set_style_text_font(s_lbl_brake_cmd_telemetry, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_cmd_telemetry, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_brake_cmd_telemetry, LV_ALIGN_TOP_LEFT, 4, 212);

    lv_obj_t *lbl_b_id = lv_label_create(c_bcmd);
    lv_label_set_text(lbl_b_id, "CAN ID: 0x7B9 (20ms / 50 Hz)");
    lv_obj_set_style_text_font(lbl_b_id, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(lbl_b_id, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_b_id, LV_ALIGN_TOP_LEFT, 4, 240);

    s_lbl_brake_vcu_stat = lv_label_create(c_bcmd);
    lv_label_set_text(s_lbl_brake_vcu_stat, "[ OK ] TARGET STREAM (50 Hz)");
    lv_obj_set_style_text_font(s_lbl_brake_vcu_stat, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_vcu_stat, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_brake_vcu_stat, LV_ALIGN_BOTTOM_LEFT, 4, 0);

    // Subtle divider line 1
    lv_obj_t *b_div1 = lv_obj_create(s_screens[WIN_BRAKE]);
    lv_obj_set_size(b_div1, 1, u_h - 16);
    lv_obj_align(b_div1, LV_ALIGN_TOP_LEFT, 269, u_y + 8);
    lv_obj_set_style_bg_color(b_div1, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_border_width(b_div1, 0, 0);

    // Column 2: Actuation (SEB 0x721) - Borderless
    lv_obj_t *c_bact = lv_obj_create(s_screens[WIN_BRAKE]);
    lv_obj_set_size(c_bact, act_w, u_h);
    lv_obj_align(c_bact, LV_ALIGN_TOP_LEFT, 272, u_y);
    lv_obj_set_style_bg_opa(c_bact, LV_OPA_TRANSP, 0);
    lv_obj_set_style_border_width(c_bact, 0, 0);
    lv_obj_set_style_pad_all(c_bact, 4, 0);

    lv_obj_t *lbl_ba1 = lv_label_create(c_bact);
    lv_label_set_text(lbl_ba1, "ACTUATION (SEB 0x721)");
    lv_obj_set_style_text_font(lbl_ba1, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_ba1, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_ba1, LV_ALIGN_TOP_LEFT, 4, 0);

    s_lbl_brake_act = lv_label_create(c_bact);
    lv_label_set_text(s_lbl_brake_act, "0 kPa");
    lv_obj_set_style_text_font(s_lbl_brake_act, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(s_lbl_brake_act, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_brake_act, LV_ALIGN_TOP_MID, 0, 24);

    // In-Box 5s Mini-Plot under value (Touch navigates to Full Scope, widened to 256px)
    s_chart_brake_5s_act = create_inbox_sparkline(c_bact, 256, 96, 72, 0, 1200);
    s_ser_brake_5s_act = lv_chart_add_series(s_chart_brake_5s_act, lv_color_hex(UI_COLOR_ACCENT_ACT), LV_CHART_AXIS_PRIMARY_Y);
    lv_obj_add_event_cb(s_chart_brake_5s_act, chart_click_nav_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_BRAKE_PLOT_15S);

    s_lbl_brake_act_stroke = lv_label_create(c_bact);
    lv_label_set_text(s_lbl_brake_act_stroke, "ACTUAL STROKE: 0.0 mm");
    lv_obj_set_style_text_font(s_lbl_brake_act_stroke, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_brake_act_stroke, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_brake_act_stroke, LV_ALIGN_TOP_LEFT, 4, 180);

    s_lbl_brake_act_telemetry = lv_label_create(c_bact);
    lv_label_set_text(s_lbl_brake_act_telemetry, "MOTOR: 0.0 A  •  TEMP: 0°C");
    lv_obj_set_style_text_font(s_lbl_brake_act_telemetry, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_act_telemetry, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_brake_act_telemetry, LV_ALIGN_TOP_LEFT, 4, 212);

    s_lbl_brake_align = lv_label_create(c_bact);
    lv_label_set_text(s_lbl_brake_align, "ALIGNMENT: SENSOR ZEROED");
    lv_obj_set_style_text_font(s_lbl_brake_align, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_align, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(s_lbl_brake_align, LV_ALIGN_TOP_LEFT, 4, 240);

    s_lbl_brake_feedback_stat = lv_label_create(c_bact);
    lv_label_set_text(s_lbl_brake_feedback_stat, "[ OK ] FEEDBACK STREAM (100 Hz)");
    lv_obj_set_style_text_font(s_lbl_brake_feedback_stat, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_feedback_stat, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_brake_feedback_stat, LV_ALIGN_BOTTOM_LEFT, 4, 0);

    // Subtle divider line 2
    lv_obj_t *b_div2 = lv_obj_create(s_screens[WIN_BRAKE]);
    lv_obj_set_size(b_div2, 1, u_h - 16);
    lv_obj_align(b_div2, LV_ALIGN_TOP_LEFT, 537, u_y + 8);
    lv_obj_set_style_bg_color(b_div2, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_border_width(b_div2, 0, 0);

    // Column 3: Delta, Stroke & Diagnostics - Borderless
    lv_obj_t *c_bdt = lv_obj_create(s_screens[WIN_BRAKE]);
    lv_obj_set_size(c_bdt, act_w, u_h);
    lv_obj_align(c_bdt, LV_ALIGN_TOP_LEFT, 540, u_y);
    lv_obj_set_style_bg_opa(c_bdt, LV_OPA_TRANSP, 0);
    lv_obj_set_style_border_width(c_bdt, 0, 0);
    lv_obj_set_style_pad_all(c_bdt, 4, 0);

    lv_obj_t *lbl_bdt_title = lv_label_create(c_bdt);
    lv_label_set_text(lbl_bdt_title, "CLOSED-LOOP TRACKING");
    lv_obj_set_style_text_font(lbl_bdt_title, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_bdt_title, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_bdt_title, LV_ALIGN_TOP_LEFT, 4, 0);

    s_lbl_brake_delta_val = lv_label_create(c_bdt);
    lv_label_set_text(s_lbl_brake_delta_val, "DIFF: 0 kPa  [ OK ]");
    lv_obj_set_style_text_font(s_lbl_brake_delta_val, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_color(s_lbl_brake_delta_val, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_brake_delta_val, LV_ALIGN_TOP_LEFT, 4, 22);

    lv_obj_t *lbl_bst = lv_label_create(c_bdt);
    lv_label_set_text(lbl_bst, "PISTON DISPLACEMENT");
    lv_obj_set_style_text_font(lbl_bst, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_bst, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_bst, LV_ALIGN_TOP_LEFT, 4, 68);

    s_lbl_brake_piston_val = lv_label_create(c_bdt);
    lv_label_set_text(s_lbl_brake_piston_val, "0.0 mm");
    lv_obj_set_style_text_font(s_lbl_brake_piston_val, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_color(s_lbl_brake_piston_val, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_brake_piston_val, LV_ALIGN_TOP_LEFT, 4, 90);

    s_lbl_brake_piston_delta = lv_label_create(c_bdt);
    lv_label_set_text(s_lbl_brake_piston_delta, "[ STROKE DIFF: 0.0 mm OK ]");
    lv_obj_set_style_text_font(s_lbl_brake_piston_delta, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_piston_delta, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_brake_piston_delta, LV_ALIGN_TOP_LEFT, 4, 126);

    s_lbl_brake_volt = lv_label_create(c_bdt);
    lv_label_set_text(s_lbl_brake_volt, "SUPPLY VOLT: --.- V  •  PWR: 0 W");
    lv_obj_set_style_text_font(s_lbl_brake_volt, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_volt, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_brake_volt, LV_ALIGN_TOP_LEFT, 4, 180);

    s_lbl_brake_dtc = lv_label_create(c_bdt);
    lv_label_set_text(s_lbl_brake_dtc, "DTC DIAGNOSIS: ALL CLEAR (0x0000)");
    lv_obj_set_style_text_font(s_lbl_brake_dtc, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_dtc, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_brake_dtc, LV_ALIGN_TOP_LEFT, 4, 212);

    s_lbl_brake_watchdog = lv_label_create(c_bdt);
    lv_label_set_text(s_lbl_brake_watchdog, "NODE SILENCE: -- ms  •  RX: 0");
    lv_obj_set_style_text_font(s_lbl_brake_watchdog, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_watchdog, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(s_lbl_brake_watchdog, LV_ALIGN_TOP_LEFT, 4, 240);

    s_lbl_brake_health = lv_label_create(c_bdt);
    lv_label_set_text(s_lbl_brake_health, "[ OK ] SEB HEALTHY (100 Hz)");
    lv_obj_set_style_text_font(s_lbl_brake_health, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_brake_health, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_brake_health, LV_ALIGN_BOTTOM_LEFT, 4, 0);

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
    lv_label_set_text(s_lbl_bus_rail_volts, "--.- V");
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
    lv_label_set_text(s_lbl_bus_rate, "-- msg/s");
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
    lv_label_set_text(lbl_rc_title, "SYS HEALTH (0x600)");
    lv_obj_set_style_text_font(lbl_rc_title, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(lbl_rc_title, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(lbl_rc_title, LV_ALIGN_TOP_LEFT, 0, 0);
    s_lbl_bus_sys_heap = lv_label_create(c_rec);
    lv_label_set_text(s_lbl_bus_sys_heap, "-- KB");
    lv_obj_set_style_text_font(s_lbl_bus_sys_heap, &lv_font_montserrat_36, 0);
    lv_obj_set_style_text_color(s_lbl_bus_sys_heap, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_bus_sys_heap, LV_ALIGN_CENTER, 0, -4);
    s_lbl_bus_sys_diag = lv_label_create(c_rec);
    lv_label_set_text(s_lbl_bus_sys_diag, "UPTIME: -- s  •  RST: --");
    lv_obj_set_style_text_font(s_lbl_bus_sys_diag, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_bus_sys_diag, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
    lv_obj_align(s_lbl_bus_sys_diag, LV_ALIGN_BOTTOM_LEFT, 0, 0);

    // Watchdog Deck: 5 Node cards (Height 200px, Width 150px)
    const char *node_names[5] = {
        "SYS (0x011)", "RT (0x210)", "HOST (0x7FC)", "SEB (0x721)", "SES (0x201)"
    };
    const int w5_w = 150;
    for (int i = 0; i < 5; i++) {
        s_card_bus_nodes[i] = lv_obj_create(s_screens[WIN_BUS_SAFETY]);
        lv_obj_set_size(s_card_bus_nodes[i], w5_w, 200);
        lv_obj_align(s_card_bus_nodes[i], LV_ALIGN_TOP_LEFT, 8 + i * (w5_w + 8), 268);
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
    // Window 5: 5. LOGS - Active DTC Diagnostic Trouble Codes & Chronological Event Journal
    // =========================================================================
    s_screens[WIN_LOGS] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_LOGS], lv_color_hex(UI_COLOR_BG), 0);
    create_top_nav_bar(s_screens[WIN_LOGS], WIN_LOGS);

    // 1. Diagnostic Console Sub-Header & Selector Bar (Y=52, H=38, W=784)
    lv_obj_t *hdr_logs = lv_obj_create(s_screens[WIN_LOGS]);
    lv_obj_set_size(hdr_logs, 784, 38);
    lv_obj_align(hdr_logs, LV_ALIGN_TOP_MID, 0, 52);
    lv_obj_set_style_bg_color(hdr_logs, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(hdr_logs, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_border_width(hdr_logs, 1, 0);
    lv_obj_set_style_radius(hdr_logs, 6, 0);
    lv_obj_set_style_pad_all(hdr_logs, 0, 0);

    // Toggle Button 1: DTC Matrix
    s_btn_view_dtc = lv_button_create(hdr_logs);
    lv_obj_set_size(s_btn_view_dtc, 150, 30);
    lv_obj_align(s_btn_view_dtc, LV_ALIGN_LEFT_MID, 4, 0);
    lv_obj_set_style_bg_color(s_btn_view_dtc, lv_color_hex(UI_COLOR_SURFACE_ALT), 0);
    lv_obj_set_style_border_color(s_btn_view_dtc, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
    lv_obj_set_style_border_width(s_btn_view_dtc, 1, 0);
    lv_obj_set_style_radius(s_btn_view_dtc, 4, 0);
    lv_obj_t *lbl_btn_dtc = lv_label_create(s_btn_view_dtc);
    lv_label_set_text(lbl_btn_dtc, "1. DTC MATRIX");
    lv_obj_set_style_text_font(lbl_btn_dtc, &lv_font_montserrat_12, 0);
    lv_obj_align(lbl_btn_dtc, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(s_btn_view_dtc, logs_mode_btn_cb, LV_EVENT_CLICKED, (void *)(intptr_t)0);

    // Toggle Button 2: Event Journal
    s_btn_view_journal = lv_button_create(hdr_logs);
    lv_obj_set_size(s_btn_view_journal, 165, 30);
    lv_obj_align(s_btn_view_journal, LV_ALIGN_LEFT_MID, 158, 0);
    lv_obj_set_style_bg_color(s_btn_view_journal, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(s_btn_view_journal, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_border_width(s_btn_view_journal, 1, 0);
    lv_obj_set_style_radius(s_btn_view_journal, 4, 0);
    lv_obj_t *lbl_btn_j = lv_label_create(s_btn_view_journal);
    lv_label_set_text(lbl_btn_j, "2. EVENT JOURNAL");
    lv_obj_set_style_text_font(lbl_btn_j, &lv_font_montserrat_12, 0);
    lv_obj_align(lbl_btn_j, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(s_btn_view_journal, logs_mode_btn_cb, LV_EVENT_CLICKED, (void *)(intptr_t)1);

    // Severity Counters on the right of Sub-Header: L3, L2, L1, Total
    s_lbl_logs_l3_cnt = lv_label_create(hdr_logs);
    lv_label_set_text(s_lbl_logs_l3_cnt, "● L3: 0");
    lv_obj_set_style_text_font(s_lbl_logs_l3_cnt, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_logs_l3_cnt, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(s_lbl_logs_l3_cnt, LV_ALIGN_RIGHT_MID, -210, 0);

    s_lbl_logs_l2_cnt = lv_label_create(hdr_logs);
    lv_label_set_text(s_lbl_logs_l2_cnt, "▲ L2: 0");
    lv_obj_set_style_text_font(s_lbl_logs_l2_cnt, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_logs_l2_cnt, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(s_lbl_logs_l2_cnt, LV_ALIGN_RIGHT_MID, -145, 0);

    s_lbl_logs_l1_cnt = lv_label_create(hdr_logs);
    lv_label_set_text(s_lbl_logs_l1_cnt, "ℹ L1: 0");
    lv_obj_set_style_text_font(s_lbl_logs_l1_cnt, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_logs_l1_cnt, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(s_lbl_logs_l1_cnt, LV_ALIGN_RIGHT_MID, -80, 0);

    s_lbl_logs_total_cnt = lv_label_create(hdr_logs);
    lv_label_set_text(s_lbl_logs_total_cnt, "[ 0 DTC ]");
    lv_obj_set_style_text_font(s_lbl_logs_total_cnt, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_logs_total_cnt, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(s_lbl_logs_total_cnt, LV_ALIGN_RIGHT_MID, -8, 0);

    // =========================================================================
    // View 1: DTC Matrix Container (Y=94, H=380, W=784)
    // =========================================================================
    s_cont_dtc_view = lv_obj_create(s_screens[WIN_LOGS]);
    lv_obj_set_size(s_cont_dtc_view, 784, 380);
    lv_obj_align(s_cont_dtc_view, LV_ALIGN_TOP_MID, 0, 94);
    lv_obj_set_style_bg_opa(s_cont_dtc_view, LV_OPA_TRANSP, 0);
    lv_obj_set_style_border_width(s_cont_dtc_view, 0, 0);
    lv_obj_set_style_pad_all(s_cont_dtc_view, 0, 0);

    // State A: Healthy Card (shown when DTC count == 0)
    s_card_dtc_healthy = lv_obj_create(s_cont_dtc_view);
    lv_obj_set_size(s_card_dtc_healthy, 784, 376);
    lv_obj_align(s_card_dtc_healthy, LV_ALIGN_CENTER, 0, 0);
    lv_obj_set_style_bg_color(s_card_dtc_healthy, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(s_card_dtc_healthy, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_border_width(s_card_dtc_healthy, 1, 0);
    lv_obj_set_style_radius(s_card_dtc_healthy, 8, 0);

    lv_obj_t *lbl_h_title = lv_label_create(s_card_dtc_healthy);
    lv_label_set_text(lbl_h_title, "✓ ALL SYSTEMS NORMAL - 0 ACTIVE DTCs");
    lv_obj_set_style_text_font(lbl_h_title, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_color(lbl_h_title, lv_color_hex(UI_COLOR_STATE_OK), 0);
    lv_obj_align(lbl_h_title, LV_ALIGN_CENTER, 0, -40);

    s_lbl_dtc_healthy_sub = lv_label_create(s_card_dtc_healthy);
    lv_label_set_text(s_lbl_dtc_healthy_sub, "All low-bus ECUs (SYS, RT, HOST, SEB, SES) operating within nominal envelope.\nZero active diagnostic trouble codes across steering, braking, and safety interlocks.\nLow-Bus Rate: 280 msg/s  •  TEC: 0 | REC: 0  •  12V Supply: 12.1 V  •  Core: 48°C");
    lv_obj_set_style_text_font(s_lbl_dtc_healthy_sub, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(s_lbl_dtc_healthy_sub, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_set_style_text_align(s_lbl_dtc_healthy_sub, LV_TEXT_ALIGN_CENTER, 0);
    lv_obj_align(s_lbl_dtc_healthy_sub, LV_ALIGN_CENTER, 0, 30);

    // State B: Active DTC Table Container (shown when DTC count > 0)
    s_cont_dtc_table = lv_obj_create(s_cont_dtc_view);
    lv_obj_set_size(s_cont_dtc_table, 784, 376);
    lv_obj_align(s_cont_dtc_table, LV_ALIGN_CENTER, 0, 0);
    lv_obj_set_style_bg_opa(s_cont_dtc_table, LV_OPA_TRANSP, 0);
    lv_obj_set_style_border_width(s_cont_dtc_table, 0, 0);
    lv_obj_set_style_pad_all(s_cont_dtc_table, 0, 0);
    lv_obj_set_style_pad_row(s_cont_dtc_table, 3, 0);
    lv_obj_set_flex_flow(s_cont_dtc_table, LV_FLEX_FLOW_COLUMN);
    lv_obj_add_flag(s_cont_dtc_table, LV_OBJ_FLAG_HIDDEN); // Hidden by default until fault triggers

    // Table Header Row (H=26, W=784)
    lv_obj_t *tbl_hdr = lv_obj_create(s_cont_dtc_table);
    lv_obj_set_size(tbl_hdr, 784, 26);
    lv_obj_set_style_bg_color(tbl_hdr, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(tbl_hdr, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_border_width(tbl_hdr, 1, 0);
    lv_obj_set_style_radius(tbl_hdr, 4, 0);
    lv_obj_set_style_pad_all(tbl_hdr, 0, 0);

    lv_obj_t *th_sev = lv_label_create(tbl_hdr);
    lv_label_set_text(th_sev, "SEV");
    lv_obj_set_style_text_font(th_sev, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(th_sev, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(th_sev, LV_ALIGN_LEFT_MID, 12, 0);

    lv_obj_t *th_code = lv_label_create(tbl_hdr);
    lv_label_set_text(th_code, "DTC / ID");
    lv_obj_set_style_text_font(th_code, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(th_code, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(th_code, LV_ALIGN_LEFT_MID, 76, 0);

    lv_obj_t *th_orig = lv_label_create(tbl_hdr);
    lv_label_set_text(th_orig, "SUBSYSTEM");
    lv_obj_set_style_text_font(th_orig, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(th_orig, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(th_orig, LV_ALIGN_LEFT_MID, 172, 0);

    lv_obj_t *th_desc = lv_label_create(tbl_hdr);
    lv_label_set_text(th_desc, "DIAGNOSTIC NAME & ROOT CAUSE");
    lv_obj_set_style_text_font(th_desc, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(th_desc, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(th_desc, LV_ALIGN_LEFT_MID, 280, 0);

    lv_obj_t *th_stat = lv_label_create(tbl_hdr);
    lv_label_set_text(th_stat, "STATE");
    lv_obj_set_style_text_font(th_stat, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(th_stat, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
    lv_obj_align(th_stat, LV_ALIGN_RIGHT_MID, -16, 0);

    // Pre-allocate 8 DTC Row Widgets
    for (int i = 0; i < DTC_TABLE_MAX_ROWS; i++) {
        s_dtc_rows[i].row_obj = lv_obj_create(s_cont_dtc_table);
        lv_obj_set_size(s_dtc_rows[i].row_obj, 784, 38);
        lv_obj_set_style_bg_color(s_dtc_rows[i].row_obj, lv_color_hex(UI_COLOR_SURFACE), 0);
        lv_obj_set_style_border_color(s_dtc_rows[i].row_obj, lv_color_hex(UI_COLOR_BORDER), 0);
        lv_obj_set_style_border_width(s_dtc_rows[i].row_obj, 1, 0);
        lv_obj_set_style_radius(s_dtc_rows[i].row_obj, 4, 0);
        lv_obj_set_style_pad_all(s_dtc_rows[i].row_obj, 0, 0);

        // Badge Box (W=54, H=22)
        s_dtc_rows[i].badge_box = lv_obj_create(s_dtc_rows[i].row_obj);
        lv_obj_set_size(s_dtc_rows[i].badge_box, 54, 22);
        lv_obj_align(s_dtc_rows[i].badge_box, LV_ALIGN_LEFT_MID, 6, 0);
        lv_obj_set_style_bg_color(s_dtc_rows[i].badge_box, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
        lv_obj_set_style_border_width(s_dtc_rows[i].badge_box, 0, 0);
        lv_obj_set_style_radius(s_dtc_rows[i].badge_box, 3, 0);
        lv_obj_set_style_pad_all(s_dtc_rows[i].badge_box, 0, 0);

        s_dtc_rows[i].lbl_badge = lv_label_create(s_dtc_rows[i].badge_box);
        lv_label_set_text(s_dtc_rows[i].lbl_badge, "L3");
        lv_obj_set_style_text_font(s_dtc_rows[i].lbl_badge, &lv_font_montserrat_12, 0);
        lv_obj_set_style_text_color(s_dtc_rows[i].lbl_badge, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
        lv_obj_align(s_dtc_rows[i].lbl_badge, LV_ALIGN_CENTER, 0, 0);

        // Code
        s_dtc_rows[i].lbl_code = lv_label_create(s_dtc_rows[i].row_obj);
        lv_label_set_text(s_dtc_rows[i].lbl_code, "SEB:B1.3");
        lv_obj_set_style_text_font(s_dtc_rows[i].lbl_code, &lv_font_montserrat_14, 0);
        lv_obj_set_style_text_color(s_dtc_rows[i].lbl_code, lv_color_hex(UI_COLOR_ACCENT_CMD), 0);
        lv_obj_align(s_dtc_rows[i].lbl_code, LV_ALIGN_LEFT_MID, 74, 0);

        // Origin / Subsystem
        s_dtc_rows[i].lbl_origin = lv_label_create(s_dtc_rows[i].row_obj);
        lv_label_set_text(s_dtc_rows[i].lbl_origin, "BRAKE (0x731)");
        lv_obj_set_style_text_font(s_dtc_rows[i].lbl_origin, &lv_font_montserrat_12, 0);
        lv_obj_set_style_text_color(s_dtc_rows[i].lbl_origin, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
        lv_obj_align(s_dtc_rows[i].lbl_origin, LV_ALIGN_LEFT_MID, 172, 0);

        // Description / Name
        s_dtc_rows[i].lbl_desc = lv_label_create(s_dtc_rows[i].row_obj);
        lv_label_set_text(s_dtc_rows[i].lbl_desc, "Hydraulic pressure sensor open-circuit / unplugged");
        lv_obj_set_style_text_font(s_dtc_rows[i].lbl_desc, &lv_font_montserrat_12, 0);
        lv_obj_set_style_text_color(s_dtc_rows[i].lbl_desc, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
        lv_obj_align(s_dtc_rows[i].lbl_desc, LV_ALIGN_LEFT_MID, 280, 0);

        // State Badge
        s_dtc_rows[i].lbl_status = lv_label_create(s_dtc_rows[i].row_obj);
        lv_label_set_text(s_dtc_rows[i].lbl_status, "ACTIVE");
        lv_obj_set_style_text_font(s_dtc_rows[i].lbl_status, &lv_font_montserrat_12, 0);
        lv_obj_set_style_text_color(s_dtc_rows[i].lbl_status, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
        lv_obj_align(s_dtc_rows[i].lbl_status, LV_ALIGN_RIGHT_MID, -12, 0);

        lv_obj_add_flag(s_dtc_rows[i].row_obj, LV_OBJ_FLAG_HIDDEN);
    }

    // =========================================================================
    // View 2: Chronological Event Journal Container (Y=94, H=380, W=784)
    // =========================================================================
    s_cont_journal_view = lv_obj_create(s_screens[WIN_LOGS]);
    lv_obj_set_size(s_cont_journal_view, 784, 380);
    lv_obj_align(s_cont_journal_view, LV_ALIGN_TOP_MID, 0, 94);
    lv_obj_set_style_bg_opa(s_cont_journal_view, LV_OPA_TRANSP, 0);
    lv_obj_set_style_border_width(s_cont_journal_view, 0, 0);
    lv_obj_set_style_pad_all(s_cont_journal_view, 0, 0);
    lv_obj_add_flag(s_cont_journal_view, LV_OBJ_FLAG_HIDDEN); // Hidden initially until user clicks View 2

    // Journal Status Strip
    lv_obj_t *c_j_hdr = lv_obj_create(s_cont_journal_view);
    lv_obj_set_size(c_j_hdr, 784, 28);
    lv_obj_align(c_j_hdr, LV_ALIGN_TOP_MID, 0, 0);
    lv_obj_set_style_bg_color(c_j_hdr, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(c_j_hdr, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_border_width(c_j_hdr, 1, 0);
    lv_obj_set_style_radius(c_j_hdr, 4, 0);
    lv_obj_set_style_pad_all(c_j_hdr, 0, 0);

    s_lbl_journal_stats = lv_label_create(c_j_hdr);
    lv_label_set_text(s_lbl_journal_stats, "RING BUFFER CAPACITY: 32 EVENTS  •  0 EVENTS LOGGED  •  AUTOSAR/DLT TIME-SERIES");
    lv_obj_set_style_text_font(s_lbl_journal_stats, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_journal_stats, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
    lv_obj_align(s_lbl_journal_stats, LV_ALIGN_CENTER, 0, 0);

    // Scrollable Log Output Card
    lv_obj_t *card_j_scroll = lv_obj_create(s_cont_journal_view);
    lv_obj_set_size(card_j_scroll, 784, 346);
    lv_obj_align(card_j_scroll, LV_ALIGN_TOP_MID, 0, 32);
    lv_obj_set_style_bg_color(card_j_scroll, lv_color_hex(UI_COLOR_SURFACE), 0);
    lv_obj_set_style_border_color(card_j_scroll, lv_color_hex(UI_COLOR_BORDER), 0);
    lv_obj_set_style_border_width(card_j_scroll, 1, 0);
    lv_obj_set_style_radius(card_j_scroll, 6, 0);
    lv_obj_set_style_pad_all(card_j_scroll, 8, 0);
    lv_obj_add_flag(card_j_scroll, LV_OBJ_FLAG_SCROLLABLE);

    s_lbl_journal_text = lv_label_create(card_j_scroll);
    lv_label_set_long_mode(s_lbl_journal_text, LV_LABEL_LONG_WRAP);
    lv_obj_set_width(s_lbl_journal_text, 750);
    lv_label_set_text(s_lbl_journal_text, "[+00:00.000] [INFO] SYS:BOOT    [SET] Low-Bus Inspector HMI initialized");
    lv_obj_set_style_text_font(s_lbl_journal_text, &lv_font_montserrat_12, 0);
    lv_obj_set_style_text_color(s_lbl_journal_text, lv_color_hex(UI_COLOR_TEXT_PRIMARY), 0);
    lv_obj_align(s_lbl_journal_text, LV_ALIGN_TOP_LEFT, 0, 0);

    // =========================================================================
    // Window 6: 15-Second High-Resolution Steer Scope (Maximized 426px Height)
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
    lv_label_set_text(s_lbl_steer_15s_hdr, "STEER 15s SCOPE  •  CMD: 0.0 deg  |  ACT: 0.0 deg  |  DIFF: 0.0 deg  |  Torque: 0.0 Nm");
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
    lv_label_set_text(s_lbl_brake_15s_hdr, "BRAKE 15s SCOPE  •  CMD: 0 kPa  |  ACT: 0 kPa  |  DIFF: 0 kPa  |  Stroke: 0.0mm");
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

    // Initial load: Dashboard
    lv_screen_load(s_screens[WIN_DASHBOARD]);
    ESP_LOGI(TAG, "UI Manager initialized with 7 screens (CAN Watch Cockpit + In-Box 5s Plots)");
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
    }

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
            } else if (fabsf(t->steer_act_deg) > 1.0f || t->brake_act_kpa > 50.0f) {
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

        // Update Subsystem Connectivity Buttons (SYS, RT, HOST, SEB, SES)
        for (int i = 0; i < 5; i++) {
            if (s_btn_dash_nodes[i] && s_lbl_dash_nodes[i]) {
                bool is_conn = (!t->nodes[i].timeout && t->nodes[i].rx_count > 0);
                lv_obj_set_style_bg_color(s_btn_dash_nodes[i], lv_color_hex(is_conn ? UI_COLOR_STATE_OK : 0x121212), 0);
                lv_obj_set_style_border_color(s_btn_dash_nodes[i], lv_color_hex(is_conn ? UI_COLOR_STATE_OK : UI_COLOR_BORDER), 0);
                lv_obj_set_style_text_color(s_lbl_dash_nodes[i], lv_color_hex(is_conn ? 0x000000 : UI_COLOR_TEXT_SECONDARY), 0);
            }
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
        if (s_lbl_bus_sys_heap) {
            if (t->nodes[NODE_SYS].timeout) {
                lv_label_set_text(s_lbl_bus_sys_heap, "-- KB");
                lv_obj_set_style_text_color(s_lbl_bus_sys_heap, lv_color_hex(UI_COLOR_TEXT_SECONDARY), 0);
            } else {
                snprintf(buf, sizeof(buf), "%u KB", t->sys_free_heap_kb);
                lv_label_set_text(s_lbl_bus_sys_heap, buf);
                lv_obj_set_style_text_color(s_lbl_bus_sys_heap, lv_color_hex(UI_COLOR_STATE_OK), 0);
            }
        }
        if (s_lbl_bus_sys_diag) {
            if (t->nodes[NODE_SYS].timeout) {
                lv_label_set_text(s_lbl_bus_sys_diag, "SYS OFFLINE (>250ms)");
                lv_obj_set_style_text_color(s_lbl_bus_sys_diag, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
            } else {
                snprintf(buf, sizeof(buf), "UPTIME: %us  •  RST: %s",
                         t->sys_uptime_s, sys_reset_reason_to_str(t->sys_reset_reason));
                lv_label_set_text(s_lbl_bus_sys_diag, buf);
                lv_obj_set_style_text_color(s_lbl_bus_sys_diag, lv_color_hex(UI_COLOR_BORDER_ACTIVE), 0);
            }
        }
        for (int i = 0; i < 5; i++) {
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
    // Update Screen 5: Active DTC Fault Logs & Diagnostics
    // -------------------------------------------------------------------------
    else if (s_current_win == WIN_LOGS) {
        typedef struct {
            event_severity_t sev;
            const char *code;
            const char *origin;
            const char *desc;
        } active_dtc_item_t;

        #define MAX_ACTIVE_DTCS 48
        active_dtc_item_t active_dtcs[MAX_ACTIVE_DTCS];
        int dtc_count = 0;
        int l3_count = 0;
        int l2_count = 0;
        int l1_count = 0;

        // 1. E-Stop Active Fault
        if (t->estop_active && dtc_count < MAX_ACTIVE_DTCS) {
            active_dtcs[dtc_count++] = (active_dtc_item_t){
                EVENT_SEV_CRIT, "SYS:ESTOP", "SYS (0x011)", "Emergency Stop circuit active / tripped"
            };
            l3_count++;
        }

        // 2. Node Watchdog Timeouts
        for (int i = 0; i < NODE_COUNT; i++) {
            if (t->nodes[i].timeout && dtc_count < MAX_ACTIVE_DTCS) {
                const char *n_name = (i == NODE_SYS) ? "SYS (0x011)" :
                                     (i == NODE_RT) ? "RT (0x210)" :
                                     (i == NODE_HOST) ? "HOST (0x7FC)" :
                                     (i == NODE_SEB) ? "SEB (0x721)" : "SES (0x201)";
                const char *n_code = (i == NODE_SYS) ? "WDT:SYS" :
                                     (i == NODE_RT) ? "WDT:RT" :
                                     (i == NODE_HOST) ? "WDT:HOST" :
                                     (i == NODE_SEB) ? "WDT:SEB" : "WDT:SES";
                bool is_crit = (i == NODE_SEB || i == NODE_SES || i == NODE_SYS);
                active_dtcs[dtc_count++] = (active_dtc_item_t){
                    is_crit ? EVENT_SEV_CRIT : EVENT_SEV_WARN,
                    n_code, n_name, "Node silent (>350ms communication timeout)"
                };
                if (is_crit) l3_count++; else l2_count++;
            }
        }

        // 3. SEB Braking Actuator Faults (0x731)
        uint32_t seb_raw = t->seb_errors.raw_bitmap;
        for (size_t i = 0; i < SEB_DTC_COUNT; i++) {
            if ((seb_raw & (1UL << SEB_DTC_TABLE[i].bit_index)) && dtc_count < MAX_ACTIVE_DTCS) {
                active_dtcs[dtc_count++] = (active_dtc_item_t){
                    SEB_DTC_TABLE[i].sev,
                    SEB_DTC_TABLE[i].code,
                    "BRAKE (0x731)",
                    SEB_DTC_TABLE[i].desc
                };
                if (SEB_DTC_TABLE[i].sev == EVENT_SEV_CRIT) l3_count++;
                else if (SEB_DTC_TABLE[i].sev == EVENT_SEV_WARN) l2_count++;
                else l1_count++;
            }
        }

        // 4. SES Steering Actuator Faults (0x202)
        uint32_t ses_raw = t->ses_errors.raw_bitmap;
        for (size_t i = 0; i < SES_DTC_COUNT; i++) {
            if ((ses_raw & (1UL << SES_DTC_TABLE[i].bit_index)) && dtc_count < MAX_ACTIVE_DTCS) {
                active_dtcs[dtc_count++] = (active_dtc_item_t){
                    SES_DTC_TABLE[i].sev,
                    SES_DTC_TABLE[i].code,
                    "STEER (0x202)",
                    SES_DTC_TABLE[i].desc
                };
                if (SES_DTC_TABLE[i].sev == EVENT_SEV_CRIT) l3_count++;
                else if (SES_DTC_TABLE[i].sev == EVENT_SEV_WARN) l2_count++;
                else l1_count++;
            }
        }

        // 5. Update Sub-Header Counters
        if (s_lbl_logs_l3_cnt) {
            snprintf(buf, sizeof(buf), "● L3: %d", l3_count);
            lv_label_set_text(s_lbl_logs_l3_cnt, buf);
            lv_obj_set_style_text_color(s_lbl_logs_l3_cnt, lv_color_hex(l3_count > 0 ? UI_COLOR_STATE_FAULT : UI_COLOR_TEXT_SECONDARY), 0);
        }
        if (s_lbl_logs_l2_cnt) {
            snprintf(buf, sizeof(buf), "▲ L2: %d", l2_count);
            lv_label_set_text(s_lbl_logs_l2_cnt, buf);
            lv_obj_set_style_text_color(s_lbl_logs_l2_cnt, lv_color_hex(l2_count > 0 ? UI_COLOR_STATE_WARN : UI_COLOR_TEXT_SECONDARY), 0);
        }
        if (s_lbl_logs_l1_cnt) {
            snprintf(buf, sizeof(buf), "ℹ L1: %d", l1_count);
            lv_label_set_text(s_lbl_logs_l1_cnt, buf);
            lv_obj_set_style_text_color(s_lbl_logs_l1_cnt, lv_color_hex(l1_count > 0 ? UI_COLOR_ACCENT_CMD : UI_COLOR_TEXT_SECONDARY), 0);
        }
        if (s_lbl_logs_total_cnt) {
            if (dtc_count == 0) {
                lv_label_set_text(s_lbl_logs_total_cnt, "[ 0 DTC ]");
                lv_obj_set_style_text_color(s_lbl_logs_total_cnt, lv_color_hex(UI_COLOR_STATE_OK), 0);
            } else {
                snprintf(buf, sizeof(buf), "[ %d DTC ]", dtc_count);
                lv_label_set_text(s_lbl_logs_total_cnt, buf);
                lv_obj_set_style_text_color(s_lbl_logs_total_cnt, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
            }
        }

        // 6. Update DTC Matrix View
        if (s_cont_dtc_view) {
            if (dtc_count == 0) {
                if (s_card_dtc_healthy) lv_obj_clear_flag(s_card_dtc_healthy, LV_OBJ_FLAG_HIDDEN);
                if (s_cont_dtc_table)   lv_obj_add_flag(s_cont_dtc_table, LV_OBJ_FLAG_HIDDEN);
                if (s_lbl_dtc_healthy_sub) {
                    snprintf(buf, sizeof(buf),
                             "All low-bus ECUs (SYS, RT, HOST, SEB, SES) operating within nominal envelope.\n"
                             "Zero active diagnostic trouble codes across steering, braking, and safety interlocks.\n"
                             "Low-Bus Rate: %.0f msg/s  •  TEC: %d | REC: %d  •  12V Supply: %.1f V  •  Core: %.1f°C",
                             t->bus_rate_hz, t->twai_tec, t->twai_rec, t->rail_volts_12v, t->esp32_internal_temp_c);
                    lv_label_set_text(s_lbl_dtc_healthy_sub, buf);
                }
            } else {
                if (s_card_dtc_healthy) lv_obj_add_flag(s_card_dtc_healthy, LV_OBJ_FLAG_HIDDEN);
                if (s_cont_dtc_table)   lv_obj_clear_flag(s_cont_dtc_table, LV_OBJ_FLAG_HIDDEN);

                for (int r = 0; r < DTC_TABLE_MAX_ROWS; r++) {
                    if (r < dtc_count) {
                        lv_obj_clear_flag(s_dtc_rows[r].row_obj, LV_OBJ_FLAG_HIDDEN);
                        if (r == DTC_TABLE_MAX_ROWS - 1 && dtc_count > DTC_TABLE_MAX_ROWS) {
                            lv_label_set_text(s_dtc_rows[r].lbl_badge, "+");
                            lv_obj_set_style_bg_color(s_dtc_rows[r].badge_box, lv_color_hex(UI_COLOR_STATE_WARN), 0);
                            lv_label_set_text(s_dtc_rows[r].lbl_code, "MORE");
                            lv_label_set_text(s_dtc_rows[r].lbl_origin, "SYSTEM");
                            snprintf(buf, sizeof(buf), "+%d additional DTCs active. See Event Journal for full trace.",
                                     dtc_count - (DTC_TABLE_MAX_ROWS - 1));
                            lv_label_set_text(s_dtc_rows[r].lbl_desc, buf);
                            lv_label_set_text(s_dtc_rows[r].lbl_status, "OVERFLOW");
                            lv_obj_set_style_text_color(s_dtc_rows[r].lbl_status, lv_color_hex(UI_COLOR_STATE_WARN), 0);
                        } else {
                            active_dtc_item_t *item = &active_dtcs[r];
                            const char *badge_str = (item->sev == EVENT_SEV_CRIT) ? "L3" :
                                                    (item->sev == EVENT_SEV_WARN) ? "L2" : "L1";
                            uint32_t badge_col = (item->sev == EVENT_SEV_CRIT) ? UI_COLOR_STATE_FAULT :
                                                 (item->sev == EVENT_SEV_WARN) ? UI_COLOR_STATE_WARN : UI_COLOR_ACCENT_CMD;

                            lv_label_set_text(s_dtc_rows[r].lbl_badge, badge_str);
                            lv_obj_set_style_bg_color(s_dtc_rows[r].badge_box, lv_color_hex(badge_col), 0);
                            lv_label_set_text(s_dtc_rows[r].lbl_code, item->code);
                            lv_label_set_text(s_dtc_rows[r].lbl_origin, item->origin);
                            lv_label_set_text(s_dtc_rows[r].lbl_desc, item->desc);
                            lv_label_set_text(s_dtc_rows[r].lbl_status, "ACTIVE");
                            lv_obj_set_style_text_color(s_dtc_rows[r].lbl_status, lv_color_hex(UI_COLOR_STATE_FAULT), 0);
                        }
                    } else {
                        lv_obj_add_flag(s_dtc_rows[r].row_obj, LV_OBJ_FLAG_HIDDEN);
                    }
                }
            }
        }

        // 7. Update Chronological Event Journal View
        if (s_cont_journal_view && s_lbl_journal_text) {
            event_journal_buffer_t journal;
            low_bus_decoder_get_event_journal(&journal);

            if (s_lbl_journal_stats) {
                snprintf(buf, sizeof(buf),
                         "RING BUFFER: %d EVENTS  •  %d STORED (%lu LIFETIME)  •  CHRONOLOGICAL REVERSE TRACE",
                         EVENT_JOURNAL_CAPACITY, journal.count, (unsigned long)journal.total_events);
                lv_label_set_text(s_lbl_journal_stats, buf);
            }

            static char j_buf[2048];
            int j_offset = 0;
            j_buf[0] = '\0';

            for (int k = 0; k < journal.count; k++) {
                int idx = (journal.head - 1 - k + EVENT_JOURNAL_CAPACITY) % EVENT_JOURNAL_CAPACITY;
                low_bus_event_t *ev = &journal.events[idx];
                uint32_t s = ev->uptime_ms / 1000;
                uint32_t ms = ev->uptime_ms % 1000;
                uint32_t m = s / 60;
                s = s % 60;
                const char *sev_str = (ev->sev == EVENT_SEV_CRIT) ? "CRIT" :
                                      (ev->sev == EVENT_SEV_WARN) ? "WARN" : "INFO";
                j_offset += snprintf(j_buf + j_offset, sizeof(j_buf) - j_offset,
                                     "+%02lu:%02lu.%03lu  [%-4s]  %-10s  [%-3s]  %s\n",
                                     (unsigned long)m, (unsigned long)s, (unsigned long)ms,
                                     sev_str, ev->code, ev->is_set ? "SET" : "CLR", ev->desc);
                if (j_offset >= sizeof(j_buf) - 120) break;
            }

            if (j_offset == 0) {
                snprintf(j_buf, sizeof(j_buf), "[+00:00.000] [INFO] No state transitions recorded yet.");
            }
            lv_label_set_text(s_lbl_journal_text, j_buf);
        }
    }

    // -------------------------------------------------------------------------
    // Update Scope Headers (Screens 5, 6)
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
    }
}
