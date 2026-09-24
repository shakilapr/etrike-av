/**
 * @file ui_manager.c
 * @brief 2D Window Matrix Navigation and 15s Scope Chart Feeder Implementation
 *
 * Implements ergonomic layout for Waveshare 4.3" 800x480 (RGB565):
 * - Screen 0: Bus & Safety Overview (Deck of 3 columns + Fail-Closed Watchdog Array)
 * - Screen 1A: Steering SES 2D Matrix Numeric (56pt Hero, 2-tier Delta badge, 58px Action Button)
 * - Screen 1B: Steering SES 15-Second Scope Plot (Dual-axis angle + torque)
 * - Screen 2A: Brake SEB 2D Matrix Numeric (52pt Hero, 20pt stacked units, 58px Action Button)
 * - Screen 2B: Brake SEB 15-Second Scope Plot (Hydraulic pressure + stroke)
 * - Screen 3A: Drive Powertrain 2D Matrix Numeric (52pt Hero, 20pt stacked units, 58px Action Button)
 * - Screen 3B: Drive Powertrain 15-Second Scope Plot (Speed + RPM)
 */

#include "ui_manager.h"
#include <stdio.h>
#include <math.h>

static inspector_window_t s_current_win = WIN_BUS_SAFETY;
static lv_obj_t *s_screens[WIN_COUNT] = {NULL};

/* Screen 0 (General/Safety) Widgets */
static lv_obj_t *s_lbl_estop_status = NULL;
static lv_obj_t *s_lbl_estop_origin = NULL;
static lv_obj_t *s_lbl_rail_volts = NULL;
static lv_obj_t *s_lbl_bus_rate = NULL;
static lv_obj_t *s_lbl_tec_rec = NULL;
static lv_obj_t *s_lbl_node_rates[NODE_COUNT] = {NULL};
static lv_obj_t *s_lbl_node_states[NODE_COUNT] = {NULL};

/* Screen 1A (Steer Digits) Widgets */
static lv_obj_t *s_lbl_steer_cmd = NULL;
static lv_obj_t *s_lbl_steer_act = NULL;
static lv_obj_t *s_lbl_steer_delta_val = NULL;
static lv_obj_t *s_lbl_steer_delta_tag = NULL;
static lv_obj_t *s_lbl_steer_torq = NULL;
static lv_obj_t *s_lbl_steer_fault = NULL;

/* Screen 1B (Steer Plot) Widgets */
static lv_obj_t *s_chart_steer = NULL;
static lv_chart_series_t *s_ser_steer_cmd = NULL;
static lv_chart_series_t *s_ser_steer_act = NULL;
static lv_chart_series_t *s_ser_steer_torque = NULL;
static lv_obj_t *s_lbl_steer_plot_hdr_delta = NULL;
static lv_obj_t *s_lbl_steer_plot_torque = NULL;

/* Screen 2A (Brake Digits) Widgets */
static lv_obj_t *s_lbl_brake_cmd = NULL;
static lv_obj_t *s_lbl_brake_act = NULL;
static lv_obj_t *s_lbl_brake_delta_val = NULL;
static lv_obj_t *s_lbl_brake_delta_tag = NULL;
static lv_obj_t *s_lbl_brake_stroke = NULL;
static lv_obj_t *s_lbl_brake_fault = NULL;

/* Screen 2B (Brake Plot) Widgets */
static lv_obj_t *s_chart_brake = NULL;
static lv_chart_series_t *s_ser_brake_cmd = NULL;
static lv_chart_series_t *s_ser_brake_act = NULL;
static lv_chart_series_t *s_ser_brake_stroke = NULL;
static lv_obj_t *s_lbl_brake_plot_hdr_delta = NULL;
static lv_obj_t *s_lbl_brake_plot_stroke = NULL;

/* Screen 3A (Drive Digits) Widgets */
static lv_obj_t *s_lbl_drive_cmd = NULL;
static lv_obj_t *s_lbl_drive_act = NULL;
static lv_obj_t *s_lbl_drive_delta_val = NULL;
static lv_obj_t *s_lbl_drive_delta_tag = NULL;
static lv_obj_t *s_lbl_drive_rpm = NULL;
static lv_obj_t *s_lbl_drive_inhibit = NULL;

/* Screen 3B (Drive Plot) Widgets */
static lv_obj_t *s_chart_drive = NULL;
static lv_chart_series_t *s_ser_drive_cmd = NULL;
static lv_chart_series_t *s_ser_drive_act = NULL;
static lv_obj_t *s_lbl_drive_plot_hdr_delta = NULL;
static lv_obj_t *s_lbl_drive_plot_rpm = NULL;

static void btn_nav_event_cb(lv_event_t *e) {
    inspector_window_t target = (inspector_window_t)(intptr_t)lv_event_get_user_data(e);
    ui_manager_switch_window(target);
}

static void btn_pause_event_cb(lv_event_t *e) {
    int plot_id = (int)(intptr_t)lv_event_get_user_data(e);
    if (plot_id == 1) low_bus_decoder_toggle_pause_steer();
    else if (plot_id == 2) low_bus_decoder_toggle_pause_brake();
    else if (plot_id == 3) low_bus_decoder_toggle_pause_drive();
}

/**
 * @brief Top Navigation Bar (52px tall, 4 full tabs, thumb-friendly >=185px wide)
 */
static void create_top_nav_bar(lv_obj_t *parent, inspector_window_t active_win) {
    lv_obj_t *nav = lv_obj_create(parent);
    lv_obj_set_size(nav, 800, 52);
    lv_obj_align(nav, LV_ALIGN_TOP_MID, 0, 0);
    lv_obj_set_style_bg_color(nav, lv_color_hex(0x080808), 0);
    lv_obj_set_style_border_color(nav, lv_color_hex(0x262626), 0);
    lv_obj_set_style_border_width(nav, 1, 0);
    lv_obj_set_style_pad_all(nav, 4, 0);
    lv_obj_set_layout(nav, LV_LAYOUT_FLEX);
    lv_obj_set_flex_flow(nav, LV_FLEX_FLOW_ROW);
    lv_obj_set_flex_align(nav, LV_FLEX_ALIGN_SPACE_BETWEEN, LV_FLEX_ALIGN_CENTER, LV_FLEX_ALIGN_CENTER);

    const char *labels[4] = {"0. BUS/SAFETY", "1. STEER (SES)", "2. BRAKE (SEB)", "3. DRIVE (MTR)"};
    inspector_window_t targets[4] = {WIN_BUS_SAFETY, WIN_STEER_DIGITS, WIN_BRAKE_DIGITS, WIN_DRIVE_DIGITS};

    for (int i = 0; i < 4; i++) {
        lv_obj_t *btn = lv_button_create(nav);
        lv_obj_set_size(btn, 185, 44);
        bool is_active = (active_win == targets[i]) ||
                         (active_win == WIN_STEER_PLOT && targets[i] == WIN_STEER_DIGITS) ||
                         (active_win == WIN_BRAKE_PLOT && targets[i] == WIN_BRAKE_DIGITS) ||
                         (active_win == WIN_DRIVE_PLOT && targets[i] == WIN_DRIVE_DIGITS);

        lv_obj_set_style_bg_color(btn, lv_color_hex(is_active ? 0x1E293B : 0x141414), 0);
        lv_obj_set_style_border_color(btn, lv_color_hex(is_active ? 0x38BDF8 : 0x333333), 0);
        lv_obj_set_style_border_width(btn, is_active ? 2 : 1, 0);

        lv_obj_t *lbl = lv_label_create(btn);
        lv_label_set_text(lbl, labels[i]);
        lv_obj_align(lbl, LV_ALIGN_CENTER, 0, 0);
        lv_obj_set_style_text_color(lbl, lv_color_hex(is_active ? 0x38BDF8 : 0x888888), 0);

        lv_obj_add_event_cb(btn, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)targets[i]);
    }
}

void ui_manager_init(void) {
    // =============================================================
    // Window 0: General / Bus & Safety
    // =============================================================
    s_screens[WIN_BUS_SAFETY] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_BUS_SAFETY], lv_color_hex(0x000000), 0);
    create_top_nav_bar(s_screens[WIN_BUS_SAFETY], WIN_BUS_SAFETY);

    // E-Stop Armed Banner (Prominent full-width block)
    lv_obj_t *card_estop = lv_obj_create(s_screens[WIN_BUS_SAFETY]);
    lv_obj_set_size(card_estop, 784, 76);
    lv_obj_align(card_estop, LV_ALIGN_TOP_MID, 0, 56);
    lv_obj_set_style_bg_color(card_estop, lv_color_hex(0x0D0D0D), 0);
    lv_obj_set_style_border_color(card_estop, lv_color_hex(0x262626), 0);

    s_lbl_estop_status = lv_label_create(card_estop);
    lv_label_set_text(s_lbl_estop_status, "E-STOP DISENGAGED • SYSTEM CLEAR");
    lv_obj_set_style_text_color(s_lbl_estop_status, lv_color_hex(0x10B981), 0);
    lv_obj_align(s_lbl_estop_status, LV_ALIGN_CENTER, 0, -10);

    s_lbl_estop_origin = lv_label_create(card_estop);
    lv_label_set_text(s_lbl_estop_origin, "Interlock Source: NONE  |  Hardware Pin: HIGH  |  Reason: 0");
    lv_obj_set_style_text_color(s_lbl_estop_origin, lv_color_hex(0x888888), 0);
    lv_obj_align(s_lbl_estop_origin, LV_ALIGN_CENTER, 0, 14);

    // 3-Column Deck (12V Rail, CAN Health, SD Flight Recorder)
    lv_obj_t *c_rail = lv_obj_create(s_screens[WIN_BUS_SAFETY]);
    lv_obj_set_size(c_rail, 252, 128);
    lv_obj_align(c_rail, LV_ALIGN_TOP_LEFT, 8, 140);
    lv_obj_set_style_bg_color(c_rail, lv_color_hex(0x0D0D0D), 0);
    lv_obj_t *lbl_r_title = lv_label_create(c_rail);
    lv_label_set_text(lbl_r_title, "12V SYSTEM BUS");
    lv_obj_align(lbl_r_title, LV_ALIGN_TOP_LEFT, 0, 0);
    lv_obj_set_style_text_color(lbl_r_title, lv_color_hex(0x888888), 0);
    s_lbl_rail_volts = lv_label_create(c_rail);
    lv_label_set_text(s_lbl_rail_volts, "13.8 V");
    lv_obj_align(s_lbl_rail_volts, LV_ALIGN_CENTER, 0, 2);
    lv_obj_set_style_text_color(s_lbl_rail_volts, lv_color_hex(0x10B981), 0);

    lv_obj_t *c_can = lv_obj_create(s_screens[WIN_BUS_SAFETY]);
    lv_obj_set_size(c_can, 252, 128);
    lv_obj_align(c_can, LV_ALIGN_TOP_MID, 0, 140);
    lv_obj_set_style_bg_color(c_can, lv_color_hex(0x0D0D0D), 0);
    lv_obj_t *lbl_c_title = lv_label_create(c_can);
    lv_label_set_text(lbl_c_title, "CAN BUS HEALTH");
    lv_obj_align(lbl_c_title, LV_ALIGN_TOP_LEFT, 0, 0);
    lv_obj_set_style_text_color(lbl_c_title, lv_color_hex(0x888888), 0);
    s_lbl_bus_rate = lv_label_create(c_can);
    lv_label_set_text(s_lbl_bus_rate, "420 Hz (500 kbps)");
    lv_obj_align(s_lbl_bus_rate, LV_ALIGN_CENTER, 0, -8);
    s_lbl_tec_rec = lv_label_create(c_can);
    lv_label_set_text(s_lbl_tec_rec, "TEC: 0 | REC: 0 [NORMAL]");
    lv_obj_align(s_lbl_tec_rec, LV_ALIGN_CENTER, 0, 18);
    lv_obj_set_style_text_color(s_lbl_tec_rec, lv_color_hex(0x10B981), 0);

    lv_obj_t *c_rec = lv_obj_create(s_screens[WIN_BUS_SAFETY]);
    lv_obj_set_size(c_rec, 252, 128);
    lv_obj_align(c_rec, LV_ALIGN_TOP_RIGHT, -8, 140);
    lv_obj_set_style_bg_color(c_rec, lv_color_hex(0x0D0D0D), 0);
    lv_obj_t *lbl_rc_title = lv_label_create(c_rec);
    lv_label_set_text(lbl_rc_title, "CAN FLIGHT RECORDER");
    lv_obj_align(lbl_rc_title, LV_ALIGN_TOP_LEFT, 0, 0);
    lv_obj_set_style_text_color(lbl_rc_title, lv_color_hex(0x888888), 0);
    lv_obj_t *lbl_rc_st = lv_label_create(c_rec);
    lv_label_set_text(lbl_rc_st, "LOGGING ACTIVE");
    lv_obj_align(lbl_rc_st, LV_ALIGN_CENTER, 0, -8);
    lv_obj_set_style_text_color(lbl_rc_st, lv_color_hex(0x10B981), 0);
    lv_obj_t *lbl_rc_sub = lv_label_create(c_rec);
    lv_label_set_text(lbl_rc_sub, "Buffer: Circular SD (FatFS)");
    lv_obj_align(lbl_rc_sub, LV_ALIGN_CENTER, 0, 18);
    lv_obj_set_style_text_color(lbl_rc_sub, lv_color_hex(0x888888), 0);

    // Watchdog Deck: 5 Node cards
    const char *node_names[5] = {"SES (EPS)", "SEB (BRAKE)", "MTR (DRIVE)", "SCU (SAFETY)", "VCU (CORE)"};
    for (int i = 0; i < 5; i++) {
        lv_obj_t *c_node = lv_obj_create(s_screens[WIN_BUS_SAFETY]);
        lv_obj_set_size(c_node, 146, 170);
        lv_obj_align(c_node, LV_ALIGN_TOP_LEFT, 8 + i * 158, 280);
        lv_obj_set_style_bg_color(c_node, lv_color_hex(0x0D0D0D), 0);

        lv_obj_t *lbl_n = lv_label_create(c_node);
        lv_label_set_text(lbl_n, node_names[i]);
        lv_obj_align(lbl_n, LV_ALIGN_TOP_MID, 0, 0);
        lv_obj_set_style_text_color(lbl_n, lv_color_hex(0xCCCCCC), 0);

        s_lbl_node_rates[i] = lv_label_create(c_node);
        lv_label_set_text(s_lbl_node_rates[i], "100 Hz");
        lv_obj_align(s_lbl_node_rates[i], LV_ALIGN_CENTER, 0, -8);

        s_lbl_node_states[i] = lv_label_create(c_node);
        lv_label_set_text(s_lbl_node_states[i], "[ ACTIVE ]");
        lv_obj_align(s_lbl_node_states[i], LV_ALIGN_CENTER, 0, 24);
        lv_obj_set_style_text_color(s_lbl_node_states[i], lv_color_hex(0x10B981), 0);
    }

    // =============================================================
    // Window 1A: Steering Digits (SES)
    // =============================================================
    s_screens[WIN_STEER_DIGITS] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_STEER_DIGITS], lv_color_hex(0x000000), 0);
    create_top_nav_bar(s_screens[WIN_STEER_DIGITS], WIN_STEER_DIGITS);

    // Command Card (Cyan)
    lv_obj_t *c_scmd = lv_obj_create(s_screens[WIN_STEER_DIGITS]);
    lv_obj_set_size(c_scmd, 250, 260);
    lv_obj_align(c_scmd, LV_ALIGN_TOP_LEFT, 8, 58);
    lv_obj_set_style_bg_color(c_scmd, lv_color_hex(0x0D0D0D), 0);
    lv_obj_t *lbl_sct = lv_label_create(c_scmd);
    lv_label_set_text(lbl_sct, "CMD (SES)");
    lv_obj_align(lbl_sct, LV_ALIGN_TOP_LEFT, 0, 0);
    lv_obj_set_style_text_color(lbl_sct, lv_color_hex(0x06B6D4), 0);
    s_lbl_steer_cmd = lv_label_create(c_scmd);
    lv_label_set_text(s_lbl_steer_cmd, "+14.5°");
    lv_obj_set_style_text_color(s_lbl_steer_cmd, lv_color_hex(0x06B6D4), 0);
    lv_obj_align(s_lbl_steer_cmd, LV_ALIGN_CENTER, 0, -10);

    // Actual Feedback Card (Emerald)
    lv_obj_t *c_sact = lv_obj_create(s_screens[WIN_STEER_DIGITS]);
    lv_obj_set_size(c_sact, 250, 260);
    lv_obj_align(c_sact, LV_ALIGN_TOP_MID, 0, 58);
    lv_obj_set_style_bg_color(c_sact, lv_color_hex(0x0D0D0D), 0);
    lv_obj_t *lbl_sat = lv_label_create(c_sact);
    lv_label_set_text(lbl_sat, "FEEDBACK");
    lv_obj_align(lbl_sat, LV_ALIGN_TOP_LEFT, 0, 0);
    lv_obj_set_style_text_color(lbl_sat, lv_color_hex(0x10B981), 0);
    s_lbl_steer_act = lv_label_create(c_sact);
    lv_label_set_text(s_lbl_steer_act, "+14.2°");
    lv_obj_set_style_text_color(s_lbl_steer_act, lv_color_hex(0x10B981), 0);
    lv_obj_align(s_lbl_steer_act, LV_ALIGN_CENTER, 0, -10);

    // Delta & Torque Card (2-tier badge)
    lv_obj_t *c_sdelta = lv_obj_create(s_screens[WIN_STEER_DIGITS]);
    lv_obj_set_size(c_sdelta, 260, 260);
    lv_obj_align(c_sdelta, LV_ALIGN_TOP_RIGHT, -8, 58);
    lv_obj_set_style_bg_color(c_sdelta, lv_color_hex(0x0D0D0D), 0);
    s_lbl_steer_delta_val = lv_label_create(c_sdelta);
    lv_label_set_text(s_lbl_steer_delta_val, "Δ: 0.3°");
    lv_obj_align(s_lbl_steer_delta_val, LV_ALIGN_CENTER, 0, -32);
    s_lbl_steer_delta_tag = lv_label_create(c_sdelta);
    lv_label_set_text(s_lbl_steer_delta_tag, "[ TRACKING OK ]");
    lv_obj_align(s_lbl_steer_delta_tag, LV_ALIGN_CENTER, 0, -6);
    lv_obj_set_style_text_color(s_lbl_steer_delta_tag, lv_color_hex(0x10B981), 0);
    s_lbl_steer_torq = lv_label_create(c_sdelta);
    lv_label_set_text(s_lbl_steer_torq, "TORQ: +0.2 Nm");
    lv_obj_set_style_text_color(s_lbl_steer_torq, lv_color_hex(0xF59E0B), 0);
    lv_obj_align(s_lbl_steer_torq, LV_ALIGN_CENTER, 0, 24);
    s_lbl_steer_fault = lv_label_create(c_sdelta);
    lv_label_set_text(s_lbl_steer_fault, "FAULT: NONE");
    lv_obj_set_style_text_color(s_lbl_steer_fault, lv_color_hex(0x888888), 0);
    lv_obj_align(s_lbl_steer_fault, LV_ALIGN_CENTER, 0, 48);

    // Ergonomic Full-Width Action Button (58px tall)
    lv_obj_t *btn_plot1 = lv_button_create(s_screens[WIN_STEER_DIGITS]);
    lv_obj_set_size(btn_plot1, 784, 58);
    lv_obj_align(btn_plot1, LV_ALIGN_BOTTOM_MID, 0, -10);
    lv_obj_set_style_bg_color(btn_plot1, lv_color_hex(0x1E293B), 0);
    lv_obj_set_style_border_color(btn_plot1, lv_color_hex(0x38BDF8), 0);
    lv_obj_set_style_border_width(btn_plot1, 2, 0);
    lv_obj_t *lbl_bp1 = lv_label_create(btn_plot1);
    lv_label_set_text(lbl_bp1, "VIEW 15-SECOND STEERING SCOPE PLOT (OR SWIPE DOWN) >");
    lv_obj_align(lbl_bp1, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_plot1, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_STEER_PLOT);

    // =============================================================
    // Window 1B: Steering 15s Scope Plot
    // =============================================================
    s_screens[WIN_STEER_PLOT] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_STEER_PLOT], lv_color_hex(0x000000), 0);

    lv_obj_t *hdr1b = lv_obj_create(s_screens[WIN_STEER_PLOT]);
    lv_obj_set_size(hdr1b, 784, 48);
    lv_obj_align(hdr1b, LV_ALIGN_TOP_MID, 0, 6);
    lv_obj_set_style_bg_color(hdr1b, lv_color_hex(0x0D0D0D), 0);
    lv_obj_set_style_border_color(hdr1b, lv_color_hex(0x262626), 0);

    lv_obj_t *lbl_title1b = lv_label_create(hdr1b);
    lv_label_set_text(lbl_title1b, "STEER (SES)");
    lv_obj_set_style_text_color(lbl_title1b, lv_color_hex(0xFFFFFF), 0);
    lv_obj_align(lbl_title1b, LV_ALIGN_LEFT_MID, 10, 0);

    s_lbl_steer_plot_hdr_delta = lv_label_create(hdr1b);
    lv_label_set_text(s_lbl_steer_plot_hdr_delta, "Δ: 0.3°");
    lv_obj_set_style_text_color(s_lbl_steer_plot_hdr_delta, lv_color_hex(0x10B981), 0);
    lv_obj_align(s_lbl_steer_plot_hdr_delta, LV_ALIGN_LEFT_MID, 280, 0);

    s_lbl_steer_plot_torque = lv_label_create(hdr1b);
    lv_label_set_text(s_lbl_steer_plot_torque, "TORQ: +0.2 Nm");
    lv_obj_set_style_text_color(s_lbl_steer_plot_torque, lv_color_hex(0xF59E0B), 0);
    lv_obj_align(s_lbl_steer_plot_torque, LV_ALIGN_RIGHT_MID, -125, 0);

    lv_obj_t *btn_back_num1 = lv_button_create(hdr1b);
    lv_obj_set_size(btn_back_num1, 110, 36);
    lv_obj_align(btn_back_num1, LV_ALIGN_RIGHT_MID, 0, 0);
    lv_obj_set_style_bg_color(btn_back_num1, lv_color_hex(0x141414), 0);
    lv_obj_t *lbl_bn1 = lv_label_create(btn_back_num1);
    lv_label_set_text(lbl_bn1, "< NUMERICS");
    lv_obj_align(lbl_bn1, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_back_num1, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_STEER_DIGITS);

    s_chart_steer = lv_chart_create(s_screens[WIN_STEER_PLOT]);
    lv_obj_set_size(s_chart_steer, 784, 352);
    lv_obj_align(s_chart_steer, LV_ALIGN_TOP_MID, 0, 58);
    lv_chart_set_type(s_chart_steer, LV_CHART_TYPE_LINE);
    lv_chart_set_point_count(s_chart_steer, PLOT_POINTS_15S);
    lv_chart_set_range(s_chart_steer, LV_CHART_AXIS_PRIMARY_Y, -450, 450);
    lv_chart_set_range(s_chart_steer, LV_CHART_AXIS_SECONDARY_Y, -45, 45); // -4.5 to +4.5 Nm
    lv_obj_set_style_bg_color(s_chart_steer, lv_color_hex(0x080808), 0);

    s_ser_steer_cmd = lv_chart_add_series(s_chart_steer, lv_color_hex(0x06B6D4), LV_CHART_AXIS_PRIMARY_Y);
    s_ser_steer_act = lv_chart_add_series(s_chart_steer, lv_color_hex(0x10B981), LV_CHART_AXIS_PRIMARY_Y);
    s_ser_steer_torque = lv_chart_add_series(s_chart_steer, lv_color_hex(0xF59E0B), LV_CHART_AXIS_SECONDARY_Y);

    lv_obj_t *btn_pause_s = lv_button_create(s_screens[WIN_STEER_PLOT]);
    lv_obj_set_size(btn_pause_s, 180, 44);
    lv_obj_align(btn_pause_s, LV_ALIGN_BOTTOM_RIGHT, -200, -6);
    lv_obj_set_style_bg_color(btn_pause_s, lv_color_hex(0x1E293B), 0);
    lv_obj_t *lbl_ps = lv_label_create(btn_pause_s);
    lv_label_set_text(lbl_ps, "|| PAUSE / FREEZE");
    lv_obj_align(lbl_ps, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_pause_s, btn_pause_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)1);

    lv_obj_t *btn_next_s = lv_button_create(s_screens[WIN_STEER_PLOT]);
    lv_obj_set_size(btn_next_s, 180, 44);
    lv_obj_align(btn_next_s, LV_ALIGN_BOTTOM_RIGHT, -8, -6);
    lv_obj_set_style_bg_color(btn_next_s, lv_color_hex(0x141414), 0);
    lv_obj_t *lbl_ns = lv_label_create(btn_next_s);
    lv_label_set_text(lbl_ns, "BRAKE PLOT >");
    lv_obj_align(lbl_ns, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_next_s, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_BRAKE_PLOT);

    // =============================================================
    // Window 2A: Brake Digits (SEB)
    // =============================================================
    s_screens[WIN_BRAKE_DIGITS] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_BRAKE_DIGITS], lv_color_hex(0x000000), 0);
    create_top_nav_bar(s_screens[WIN_BRAKE_DIGITS], WIN_BRAKE_DIGITS);

    // Command Card (Cyan)
    lv_obj_t *c_bcmd = lv_obj_create(s_screens[WIN_BRAKE_DIGITS]);
    lv_obj_set_size(c_bcmd, 250, 260);
    lv_obj_align(c_bcmd, LV_ALIGN_TOP_LEFT, 8, 58);
    lv_obj_set_style_bg_color(c_bcmd, lv_color_hex(0x0D0D0D), 0);
    lv_obj_t *lbl_bct = lv_label_create(c_bcmd);
    lv_label_set_text(lbl_bct, "CMD (SEB)");
    lv_obj_align(lbl_bct, LV_ALIGN_TOP_LEFT, 0, 0);
    lv_obj_set_style_text_color(lbl_bct, lv_color_hex(0x06B6D4), 0);
    s_lbl_brake_cmd = lv_label_create(c_bcmd);
    lv_label_set_text(s_lbl_brake_cmd, "450\nkPa");
    lv_obj_set_style_text_color(s_lbl_brake_cmd, lv_color_hex(0x06B6D4), 0);
    lv_obj_align(s_lbl_brake_cmd, LV_ALIGN_CENTER, 0, -10);

    // Actual Feedback Card (Emerald)
    lv_obj_t *c_bact = lv_obj_create(s_screens[WIN_BRAKE_DIGITS]);
    lv_obj_set_size(c_bact, 250, 260);
    lv_obj_align(c_bact, LV_ALIGN_TOP_MID, 0, 58);
    lv_obj_set_style_bg_color(c_bact, lv_color_hex(0x0D0D0D), 0);
    lv_obj_t *lbl_bat = lv_label_create(c_bact);
    lv_label_set_text(lbl_bat, "FEEDBACK");
    lv_obj_align(lbl_bat, LV_ALIGN_TOP_LEFT, 0, 0);
    lv_obj_set_style_text_color(lbl_bat, lv_color_hex(0x10B981), 0);
    s_lbl_brake_act = lv_label_create(c_bact);
    lv_label_set_text(s_lbl_brake_act, "442\nkPa");
    lv_obj_set_style_text_color(s_lbl_brake_act, lv_color_hex(0x10B981), 0);
    lv_obj_align(s_lbl_brake_act, LV_ALIGN_CENTER, 0, -10);

    // Delta & Status Card (2-tier badge)
    lv_obj_t *c_bdelta = lv_obj_create(s_screens[WIN_BRAKE_DIGITS]);
    lv_obj_set_size(c_bdelta, 260, 260);
    lv_obj_align(c_bdelta, LV_ALIGN_TOP_RIGHT, -8, 58);
    lv_obj_set_style_bg_color(c_bdelta, lv_color_hex(0x0D0D0D), 0);
    s_lbl_brake_delta_val = lv_label_create(c_bdelta);
    lv_label_set_text(s_lbl_brake_delta_val, "Δ: -8 kPa");
    lv_obj_align(s_lbl_brake_delta_val, LV_ALIGN_CENTER, 0, -32);
    s_lbl_brake_delta_tag = lv_label_create(c_bdelta);
    lv_label_set_text(s_lbl_brake_delta_tag, "[ TRACKING OK ]");
    lv_obj_align(s_lbl_brake_delta_tag, LV_ALIGN_CENTER, 0, -6);
    lv_obj_set_style_text_color(s_lbl_brake_delta_tag, lv_color_hex(0x10B981), 0);
    s_lbl_brake_stroke = lv_label_create(c_bdelta);
    lv_label_set_text(s_lbl_brake_stroke, "STROKE: 12.4 mm");
    lv_obj_align(s_lbl_brake_stroke, LV_ALIGN_CENTER, 0, 24);
    s_lbl_brake_fault = lv_label_create(c_bdelta);
    lv_label_set_text(s_lbl_brake_fault, "ERR: NONE");
    lv_obj_set_style_text_color(s_lbl_brake_fault, lv_color_hex(0x888888), 0);
    lv_obj_align(s_lbl_brake_fault, LV_ALIGN_CENTER, 0, 48);

    // Full-Width Action Button (58px tall)
    lv_obj_t *btn_plot2 = lv_button_create(s_screens[WIN_BRAKE_DIGITS]);
    lv_obj_set_size(btn_plot2, 784, 58);
    lv_obj_align(btn_plot2, LV_ALIGN_BOTTOM_MID, 0, -10);
    lv_obj_set_style_bg_color(btn_plot2, lv_color_hex(0x1E293B), 0);
    lv_obj_set_style_border_color(btn_plot2, lv_color_hex(0x38BDF8), 0);
    lv_obj_set_style_border_width(btn_plot2, 2, 0);
    lv_obj_t *lbl_bp2 = lv_label_create(btn_plot2);
    lv_label_set_text(lbl_bp2, "VIEW 15-SECOND BRAKE SCOPE PLOT (OR SWIPE DOWN) >");
    lv_obj_align(lbl_bp2, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_plot2, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_BRAKE_PLOT);

    // =============================================================
    // Window 2B: Brake 15s Scope Plot
    // =============================================================
    s_screens[WIN_BRAKE_PLOT] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_BRAKE_PLOT], lv_color_hex(0x000000), 0);

    lv_obj_t *hdr2b = lv_obj_create(s_screens[WIN_BRAKE_PLOT]);
    lv_obj_set_size(hdr2b, 784, 48);
    lv_obj_align(hdr2b, LV_ALIGN_TOP_MID, 0, 6);
    lv_obj_set_style_bg_color(hdr2b, lv_color_hex(0x0D0D0D), 0);
    lv_obj_set_style_border_color(hdr2b, lv_color_hex(0x262626), 0);

    lv_obj_t *lbl_title2b = lv_label_create(hdr2b);
    lv_label_set_text(lbl_title2b, "BRAKE (SEB)");
    lv_obj_set_style_text_color(lbl_title2b, lv_color_hex(0xFFFFFF), 0);
    lv_obj_align(lbl_title2b, LV_ALIGN_LEFT_MID, 10, 0);

    s_lbl_brake_plot_hdr_delta = lv_label_create(hdr2b);
    lv_label_set_text(s_lbl_brake_plot_hdr_delta, "Δ: -8 kPa");
    lv_obj_set_style_text_color(s_lbl_brake_plot_hdr_delta, lv_color_hex(0x10B981), 0);
    lv_obj_align(s_lbl_brake_plot_hdr_delta, LV_ALIGN_LEFT_MID, 280, 0);

    s_lbl_brake_plot_stroke = lv_label_create(hdr2b);
    lv_label_set_text(s_lbl_brake_plot_stroke, "STRK: 12.4mm");
    lv_obj_set_style_text_color(s_lbl_brake_plot_stroke, lv_color_hex(0x06B6D4), 0);
    lv_obj_align(s_lbl_brake_plot_stroke, LV_ALIGN_RIGHT_MID, -125, 0);

    lv_obj_t *btn_back_num2 = lv_button_create(hdr2b);
    lv_obj_set_size(btn_back_num2, 110, 36);
    lv_obj_align(btn_back_num2, LV_ALIGN_RIGHT_MID, 0, 0);
    lv_obj_set_style_bg_color(btn_back_num2, lv_color_hex(0x141414), 0);
    lv_obj_t *lbl_bn2 = lv_label_create(btn_back_num2);
    lv_label_set_text(lbl_bn2, "< NUMERICS");
    lv_obj_align(lbl_bn2, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_back_num2, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_BRAKE_DIGITS);

    s_chart_brake = lv_chart_create(s_screens[WIN_BRAKE_PLOT]);
    lv_obj_set_size(s_chart_brake, 784, 352);
    lv_obj_align(s_chart_brake, LV_ALIGN_TOP_MID, 0, 58);
    lv_chart_set_type(s_chart_brake, LV_CHART_TYPE_LINE);
    lv_chart_set_point_count(s_chart_brake, PLOT_POINTS_15S);
    lv_chart_set_range(s_chart_brake, LV_CHART_AXIS_PRIMARY_Y, 0, 12000); // 0 to 12000 kPa
    lv_chart_set_range(s_chart_brake, LV_CHART_AXIS_SECONDARY_Y, 0, 300); // 0 to 30.0 mm stroke
    lv_obj_set_style_bg_color(s_chart_brake, lv_color_hex(0x080808), 0);

    s_ser_brake_cmd = lv_chart_add_series(s_chart_brake, lv_color_hex(0x06B6D4), LV_CHART_AXIS_PRIMARY_Y);
    s_ser_brake_act = lv_chart_add_series(s_chart_brake, lv_color_hex(0x10B981), LV_CHART_AXIS_PRIMARY_Y);
    s_ser_brake_stroke = lv_chart_add_series(s_chart_brake, lv_color_hex(0x38BDF8), LV_CHART_AXIS_SECONDARY_Y);

    lv_obj_t *btn_pause_b = lv_button_create(s_screens[WIN_BRAKE_PLOT]);
    lv_obj_set_size(btn_pause_b, 180, 44);
    lv_obj_align(btn_pause_b, LV_ALIGN_BOTTOM_RIGHT, -200, -6);
    lv_obj_set_style_bg_color(btn_pause_b, lv_color_hex(0x1E293B), 0);
    lv_obj_t *lbl_pb = lv_label_create(btn_pause_b);
    lv_label_set_text(lbl_pb, "|| PAUSE / FREEZE");
    lv_obj_align(lbl_pb, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_pause_b, btn_pause_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)2);

    lv_obj_t *btn_next_b = lv_button_create(s_screens[WIN_BRAKE_PLOT]);
    lv_obj_set_size(btn_next_b, 180, 44);
    lv_obj_align(btn_next_b, LV_ALIGN_BOTTOM_RIGHT, -8, -6);
    lv_obj_set_style_bg_color(btn_next_b, lv_color_hex(0x141414), 0);
    lv_obj_t *lbl_nb = lv_label_create(btn_next_b);
    lv_label_set_text(lbl_nb, "DRIVE PLOT >");
    lv_obj_align(lbl_nb, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_next_b, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_DRIVE_PLOT);

    // =============================================================
    // Window 3A: Drive Digits (MTR)
    // =============================================================
    s_screens[WIN_DRIVE_DIGITS] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_DRIVE_DIGITS], lv_color_hex(0x000000), 0);
    create_top_nav_bar(s_screens[WIN_DRIVE_DIGITS], WIN_DRIVE_DIGITS);

    // Command Card (Cyan)
    lv_obj_t *c_dcmd = lv_obj_create(s_screens[WIN_DRIVE_DIGITS]);
    lv_obj_set_size(c_dcmd, 250, 260);
    lv_obj_align(c_dcmd, LV_ALIGN_TOP_LEFT, 8, 58);
    lv_obj_set_style_bg_color(c_dcmd, lv_color_hex(0x0D0D0D), 0);
    lv_obj_t *lbl_dct = lv_label_create(c_dcmd);
    lv_label_set_text(lbl_dct, "CMD (MTR)");
    lv_obj_align(lbl_dct, LV_ALIGN_TOP_LEFT, 0, 0);
    lv_obj_set_style_text_color(lbl_dct, lv_color_hex(0x06B6D4), 0);
    s_lbl_drive_cmd = lv_label_create(c_dcmd);
    lv_label_set_text(s_lbl_drive_cmd, "15.0\nkm/h");
    lv_obj_set_style_text_color(s_lbl_drive_cmd, lv_color_hex(0x06B6D4), 0);
    lv_obj_align(s_lbl_drive_cmd, LV_ALIGN_CENTER, 0, -10);

    // Actual Feedback Card (Emerald)
    lv_obj_t *c_dact = lv_obj_create(s_screens[WIN_DRIVE_DIGITS]);
    lv_obj_set_size(c_dact, 250, 260);
    lv_obj_align(c_dact, LV_ALIGN_TOP_MID, 0, 58);
    lv_obj_set_style_bg_color(c_dact, lv_color_hex(0x0D0D0D), 0);
    lv_obj_t *lbl_dat = lv_label_create(c_dact);
    lv_label_set_text(lbl_dat, "FEEDBACK");
    lv_obj_align(lbl_dat, LV_ALIGN_TOP_LEFT, 0, 0);
    lv_obj_set_style_text_color(lbl_dat, lv_color_hex(0x10B981), 0);
    s_lbl_drive_act = lv_label_create(c_dact);
    lv_label_set_text(s_lbl_drive_act, "14.8\nkm/h");
    lv_obj_set_style_text_color(s_lbl_drive_act, lv_color_hex(0x10B981), 0);
    lv_obj_align(s_lbl_drive_act, LV_ALIGN_CENTER, 0, -10);

    // Delta & Interlock Card (2-tier badge)
    lv_obj_t *c_ddelta = lv_obj_create(s_screens[WIN_DRIVE_DIGITS]);
    lv_obj_set_size(c_ddelta, 260, 260);
    lv_obj_align(c_ddelta, LV_ALIGN_TOP_RIGHT, -8, 58);
    lv_obj_set_style_bg_color(c_ddelta, lv_color_hex(0x0D0D0D), 0);
    s_lbl_drive_delta_val = lv_label_create(c_ddelta);
    lv_label_set_text(s_lbl_drive_delta_val, "Δ: -0.2 km/h");
    lv_obj_align(s_lbl_drive_delta_val, LV_ALIGN_CENTER, 0, -32);
    s_lbl_drive_delta_tag = lv_label_create(c_ddelta);
    lv_label_set_text(s_lbl_drive_delta_tag, "[ TRACKING OK ]");
    lv_obj_align(s_lbl_drive_delta_tag, LV_ALIGN_CENTER, 0, -6);
    lv_obj_set_style_text_color(s_lbl_drive_delta_tag, lv_color_hex(0x10B981), 0);
    s_lbl_drive_rpm = lv_label_create(c_ddelta);
    lv_label_set_text(s_lbl_drive_rpm, "RPM: 1240 | GEAR: D");
    lv_obj_align(s_lbl_drive_rpm, LV_ALIGN_CENTER, 0, 24);
    s_lbl_drive_inhibit = lv_label_create(c_ddelta);
    lv_label_set_text(s_lbl_drive_inhibit, "INTERLOCK: BRAKE PRIORITY OK");
    lv_obj_set_style_text_color(s_lbl_drive_inhibit, lv_color_hex(0x10B981), 0);
    lv_obj_align(s_lbl_drive_inhibit, LV_ALIGN_CENTER, 0, 48);

    // Full-Width Action Button (58px tall)
    lv_obj_t *btn_plot3 = lv_button_create(s_screens[WIN_DRIVE_DIGITS]);
    lv_obj_set_size(btn_plot3, 784, 58);
    lv_obj_align(btn_plot3, LV_ALIGN_BOTTOM_MID, 0, -10);
    lv_obj_set_style_bg_color(btn_plot3, lv_color_hex(0x1E293B), 0);
    lv_obj_set_style_border_color(btn_plot3, lv_color_hex(0x38BDF8), 0);
    lv_obj_set_style_border_width(btn_plot3, 2, 0);
    lv_obj_t *lbl_bp3 = lv_label_create(btn_plot3);
    lv_label_set_text(lbl_bp3, "VIEW 15-SECOND DRIVE SCOPE PLOT (OR SWIPE DOWN) >");
    lv_obj_align(lbl_bp3, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_plot3, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_DRIVE_PLOT);

    // =============================================================
    // Window 3B: Drive 15s Scope Plot
    // =============================================================
    s_screens[WIN_DRIVE_PLOT] = lv_obj_create(NULL);
    lv_obj_set_style_bg_color(s_screens[WIN_DRIVE_PLOT], lv_color_hex(0x000000), 0);

    lv_obj_t *hdr3b = lv_obj_create(s_screens[WIN_DRIVE_PLOT]);
    lv_obj_set_size(hdr3b, 784, 48);
    lv_obj_align(hdr3b, LV_ALIGN_TOP_MID, 0, 6);
    lv_obj_set_style_bg_color(hdr3b, lv_color_hex(0x0D0D0D), 0);
    lv_obj_set_style_border_color(hdr3b, lv_color_hex(0x262626), 0);

    lv_obj_t *lbl_title3b = lv_label_create(hdr3b);
    lv_label_set_text(lbl_title3b, "DRIVE (MTR)");
    lv_obj_set_style_text_color(lbl_title3b, lv_color_hex(0xFFFFFF), 0);
    lv_obj_align(lbl_title3b, LV_ALIGN_LEFT_MID, 10, 0);

    s_lbl_drive_plot_hdr_delta = lv_label_create(hdr3b);
    lv_label_set_text(s_lbl_drive_plot_hdr_delta, "Δ: -0.2 km/h");
    lv_obj_set_style_text_color(s_lbl_drive_plot_hdr_delta, lv_color_hex(0x10B981), 0);
    lv_obj_align(s_lbl_drive_plot_hdr_delta, LV_ALIGN_LEFT_MID, 280, 0);

    s_lbl_drive_plot_rpm = lv_label_create(hdr3b);
    lv_label_set_text(s_lbl_drive_plot_rpm, "RPM: 1240");
    lv_obj_set_style_text_color(s_lbl_drive_plot_rpm, lv_color_hex(0x38BDF8), 0);
    lv_obj_align(s_lbl_drive_plot_rpm, LV_ALIGN_RIGHT_MID, -125, 0);

    lv_obj_t *btn_back_num3 = lv_button_create(hdr3b);
    lv_obj_set_size(btn_back_num3, 110, 36);
    lv_obj_align(btn_back_num3, LV_ALIGN_RIGHT_MID, 0, 0);
    lv_obj_set_style_bg_color(btn_back_num3, lv_color_hex(0x141414), 0);
    lv_obj_t *lbl_bn3 = lv_label_create(btn_back_num3);
    lv_label_set_text(lbl_bn3, "< NUMERICS");
    lv_obj_align(lbl_bn3, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_back_num3, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_DRIVE_DIGITS);

    s_chart_drive = lv_chart_create(s_screens[WIN_DRIVE_PLOT]);
    lv_obj_set_size(s_chart_drive, 784, 352);
    lv_obj_align(s_chart_drive, LV_ALIGN_TOP_MID, 0, 58);
    lv_chart_set_type(s_chart_drive, LV_CHART_TYPE_LINE);
    lv_chart_set_point_count(s_chart_drive, PLOT_POINTS_15S);
    lv_chart_set_range(s_chart_drive, LV_CHART_AXIS_PRIMARY_Y, 0, 45); // 0 to 45 km/h
    lv_obj_set_style_bg_color(s_chart_drive, lv_color_hex(0x080808), 0);

    s_ser_drive_cmd = lv_chart_add_series(s_chart_drive, lv_color_hex(0x06B6D4), LV_CHART_AXIS_PRIMARY_Y);
    s_ser_drive_act = lv_chart_add_series(s_chart_drive, lv_color_hex(0x10B981), LV_CHART_AXIS_PRIMARY_Y);

    lv_obj_t *btn_pause_d = lv_button_create(s_screens[WIN_DRIVE_PLOT]);
    lv_obj_set_size(btn_pause_d, 180, 44);
    lv_obj_align(btn_pause_d, LV_ALIGN_BOTTOM_RIGHT, -200, -6);
    lv_obj_set_style_bg_color(btn_pause_d, lv_color_hex(0x1E293B), 0);
    lv_obj_t *lbl_pd = lv_label_create(btn_pause_d);
    lv_label_set_text(lbl_pd, "|| PAUSE / FREEZE");
    lv_obj_align(lbl_pd, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_pause_d, btn_pause_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)3);

    lv_obj_t *btn_next_d = lv_button_create(s_screens[WIN_DRIVE_PLOT]);
    lv_obj_set_size(btn_next_d, 180, 44);
    lv_obj_align(btn_next_d, LV_ALIGN_BOTTOM_RIGHT, -8, -6);
    lv_obj_set_style_bg_color(btn_next_d, lv_color_hex(0x141414), 0);
    lv_obj_t *lbl_nd = lv_label_create(btn_next_d);
    lv_label_set_text(lbl_nd, "STEER PLOT >");
    lv_obj_align(lbl_nd, LV_ALIGN_CENTER, 0, 0);
    lv_obj_add_event_cb(btn_next_d, btn_nav_event_cb, LV_EVENT_CLICKED, (void *)(intptr_t)WIN_STEER_PLOT);

    // Initial load: Screen 0
    lv_screen_load(s_screens[WIN_BUS_SAFETY]);
}

void ui_manager_switch_window(inspector_window_t win) {
    if (win >= WIN_COUNT || !s_screens[win]) return;
    s_current_win = win;
    lv_screen_load_anim(s_screens[win], LV_SCR_LOAD_ANIM_FADE_ON, 150, 0, false);
}

inspector_window_t ui_manager_get_current_window(void) {
    return s_current_win;
}

void ui_manager_update(const low_bus_telemetry_t *t) {
    if (!t) return;
    char buf[64];

    // Screen 0 Updates
    if (s_current_win == WIN_BUS_SAFETY) {
        if (s_lbl_estop_status) {
            if (t->estop_active) {
                lv_label_set_text(s_lbl_estop_status, "E-STOP ACTIVE • SYSTEM LATCHED");
                lv_obj_set_style_text_color(s_lbl_estop_status, lv_color_hex(0xF43F5E), 0);
            } else {
                lv_label_set_text(s_lbl_estop_status, "E-STOP DISENGAGED • SYSTEM CLEAR");
                lv_obj_set_style_text_color(s_lbl_estop_status, lv_color_hex(0x10B981), 0);
            }
        }
        if (s_lbl_rail_volts) {
            snprintf(buf, sizeof(buf), "%.1f V", t->rail_volts_12v);
            lv_label_set_text(s_lbl_rail_volts, buf);
        }
        if (s_lbl_bus_rate) {
            snprintf(buf, sizeof(buf), "%.0f Hz (500 kbps)", t->bus_rate_hz);
            lv_label_set_text(s_lbl_bus_rate, buf);
        }
        if (s_lbl_tec_rec) {
            snprintf(buf, sizeof(buf), "TEC: %d | REC: %d [%s]", t->twai_tec, t->twai_rec, t->bus_off ? "BUS OFF" : "NORMAL");
            lv_label_set_text(s_lbl_tec_rec, buf);
            lv_obj_set_style_text_color(s_lbl_tec_rec, t->bus_off ? lv_color_hex(0xF43F5E) : lv_color_hex(0x10B981), 0);
        }
        for (int i = 0; i < NODE_COUNT; i++) {
            if (s_lbl_node_rates[i]) {
                snprintf(buf, sizeof(buf), "%.0f Hz", t->nodes[i].rate_hz);
                lv_label_set_text(s_lbl_node_rates[i], buf);
            }
            if (s_lbl_node_states[i]) {
                if (t->nodes[i].timeout) {
                    lv_label_set_text(s_lbl_node_states[i], "[ TIMEOUT ]");
                    lv_obj_set_style_text_color(s_lbl_node_states[i], lv_color_hex(0xF43F5E), 0);
                } else {
                    lv_label_set_text(s_lbl_node_states[i], "[ ACTIVE ]");
                    lv_obj_set_style_text_color(s_lbl_node_states[i], lv_color_hex(0x10B981), 0);
                }
            }
        }
    }

    // Screen 1A Updates (Steer Digits)
    if (s_current_win == WIN_STEER_DIGITS) {
        if (s_lbl_steer_cmd) {
            snprintf(buf, sizeof(buf), "%s%.1f°", t->steer_cmd_deg > 0 ? "+" : "", t->steer_cmd_deg);
            lv_label_set_text(s_lbl_steer_cmd, buf);
        }
        if (s_lbl_steer_act) {
            snprintf(buf, sizeof(buf), "%s%.1f°", t->steer_act_deg > 0 ? "+" : "", t->steer_act_deg);
            lv_label_set_text(s_lbl_steer_act, buf);
        }
        if (s_lbl_steer_delta_val && s_lbl_steer_delta_tag) {
            snprintf(buf, sizeof(buf), "Δ: %.1f°", fabsf(t->steer_delta_deg));
            lv_label_set_text(s_lbl_steer_delta_val, buf);
            bool is_lag = fabsf(t->steer_delta_deg) > 3.0f;
            lv_label_set_text(s_lbl_steer_delta_tag, is_lag ? "[ TRACKING LAG ]" : "[ TRACKING OK ]");
            lv_obj_set_style_text_color(s_lbl_steer_delta_tag, is_lag ? lv_color_hex(0xF43F5E) : lv_color_hex(0x10B981), 0);
        }
        if (s_lbl_steer_torq) {
            snprintf(buf, sizeof(buf), "TORQ: %s%.1f Nm", t->steer_torque_nm > 0 ? "+" : "", t->steer_torque_nm);
            lv_label_set_text(s_lbl_steer_torq, buf);
        }
    }

    // Screen 1B Updates (Steer Chart Feeder)
    if (s_current_win == WIN_STEER_PLOT && s_chart_steer) {
        plot_buffer_15s_t pbuf;
        low_bus_decoder_get_steer_plot(&pbuf);
        for (int i = 0; i < PLOT_POINTS_15S; i++) {
            uint16_t ring_idx = (pbuf.head + i) % PLOT_POINTS_15S;
            s_ser_steer_cmd->y_points[i] = pbuf.cmd[ring_idx];
            s_ser_steer_act->y_points[i] = pbuf.act[ring_idx];
            if (s_ser_steer_torque) {
                s_ser_steer_torque->y_points[i] = pbuf.aux[ring_idx];
            }
        }
        lv_chart_refresh(s_chart_steer);

        if (s_lbl_steer_plot_hdr_delta) {
            snprintf(buf, sizeof(buf), "Δ: %.1f°", fabsf(t->steer_delta_deg));
            lv_label_set_text(s_lbl_steer_plot_hdr_delta, buf);
        }
        if (s_lbl_steer_plot_torque) {
            snprintf(buf, sizeof(buf), "TORQ: %s%.1f Nm", t->steer_torque_nm > 0 ? "+" : "", t->steer_torque_nm);
            lv_label_set_text(s_lbl_steer_plot_torque, buf);
        }
    }

    // Screen 2A Updates (Brake Digits)
    if (s_current_win == WIN_BRAKE_DIGITS) {
        if (s_lbl_brake_cmd) {
            snprintf(buf, sizeof(buf), "%.0f\nkPa", t->brake_cmd_kpa);
            lv_label_set_text(s_lbl_brake_cmd, buf);
        }
        if (s_lbl_brake_act) {
            snprintf(buf, sizeof(buf), "%.0f\nkPa", t->brake_act_kpa);
            lv_label_set_text(s_lbl_brake_act, buf);
        }
        if (s_lbl_brake_delta_val && s_lbl_brake_delta_tag) {
            snprintf(buf, sizeof(buf), "Δ: %.0f kPa", t->brake_delta_kpa);
            lv_label_set_text(s_lbl_brake_delta_val, buf);
            bool is_lag = fabsf(t->brake_delta_kpa) > 80.0f;
            lv_label_set_text(s_lbl_brake_delta_tag, is_lag ? "[ TRACKING LAG ]" : "[ TRACKING OK ]");
            lv_obj_set_style_text_color(s_lbl_brake_delta_tag, is_lag ? lv_color_hex(0xF43F5E) : lv_color_hex(0x10B981), 0);
        }
        if (s_lbl_brake_stroke) {
            snprintf(buf, sizeof(buf), "STROKE: %.1f mm", t->brake_act_stroke_mm);
            lv_label_set_text(s_lbl_brake_stroke, buf);
        }
    }

    // Screen 2B Updates (Brake Chart Feeder)
    if (s_current_win == WIN_BRAKE_PLOT && s_chart_brake) {
        plot_buffer_15s_t pbuf;
        low_bus_decoder_get_brake_plot(&pbuf);
        for (int i = 0; i < PLOT_POINTS_15S; i++) {
            uint16_t ring_idx = (pbuf.head + i) % PLOT_POINTS_15S;
            s_ser_brake_cmd->y_points[i] = pbuf.cmd[ring_idx];
            s_ser_brake_act->y_points[i] = pbuf.act[ring_idx];
            if (s_ser_brake_stroke) {
                s_ser_brake_stroke->y_points[i] = pbuf.aux[ring_idx];
            }
        }
        lv_chart_refresh(s_chart_brake);

        if (s_lbl_brake_plot_hdr_delta) {
            snprintf(buf, sizeof(buf), "Δ: %.0f kPa", t->brake_delta_kpa);
            lv_label_set_text(s_lbl_brake_plot_hdr_delta, buf);
        }
        if (s_lbl_brake_plot_stroke) {
            snprintf(buf, sizeof(buf), "STRK: %.1fmm", t->brake_act_stroke_mm);
            lv_label_set_text(s_lbl_brake_plot_stroke, buf);
        }
    }

    // Screen 3A Updates (Drive Digits)
    if (s_current_win == WIN_DRIVE_DIGITS) {
        if (s_lbl_drive_cmd) {
            snprintf(buf, sizeof(buf), "%.1f\nkm/h", t->drive_cmd_kmh);
            lv_label_set_text(s_lbl_drive_cmd, buf);
        }
        if (s_lbl_drive_act) {
            snprintf(buf, sizeof(buf), "%.1f\nkm/h", t->drive_act_kmh);
            lv_label_set_text(s_lbl_drive_act, buf);
        }
        if (s_lbl_drive_delta_val && s_lbl_drive_delta_tag) {
            snprintf(buf, sizeof(buf), "Δ: %.1f km/h", t->drive_delta_kmh);
            lv_label_set_text(s_lbl_drive_delta_val, buf);
            bool is_lag = fabsf(t->drive_delta_kmh) > 2.0f;
            lv_label_set_text(s_lbl_drive_delta_tag, is_lag ? "[ TRACKING LAG ]" : "[ TRACKING OK ]");
            lv_obj_set_style_text_color(s_lbl_drive_delta_tag, is_lag ? lv_color_hex(0xF43F5E) : lv_color_hex(0x10B981), 0);
        }
        if (s_lbl_drive_rpm) {
            const char *gear_str = (t->drive_act_gear == 1) ? "D" : (t->drive_act_gear == 2 ? "R" : "N");
            snprintf(buf, sizeof(buf), "RPM: %d | GEAR: %s", t->drive_motor_rpm, gear_str);
            lv_label_set_text(s_lbl_drive_rpm, buf);
        }
    }

    // Screen 3B Updates (Drive Chart Feeder)
    if (s_current_win == WIN_DRIVE_PLOT && s_chart_drive) {
        plot_buffer_15s_t pbuf;
        low_bus_decoder_get_drive_plot(&pbuf);
        for (int i = 0; i < PLOT_POINTS_15S; i++) {
            uint16_t ring_idx = (pbuf.head + i) % PLOT_POINTS_15S;
            s_ser_drive_cmd->y_points[i] = pbuf.cmd[ring_idx];
            s_ser_drive_act->y_points[i] = pbuf.act[ring_idx];
        }
        lv_chart_refresh(s_chart_drive);

        if (s_lbl_drive_plot_hdr_delta) {
            snprintf(buf, sizeof(buf), "Δ: %.1f km/h", t->drive_delta_kmh);
            lv_label_set_text(s_lbl_drive_plot_hdr_delta, buf);
        }
        if (s_lbl_drive_plot_rpm) {
            snprintf(buf, sizeof(buf), "RPM: %d", t->drive_motor_rpm);
            lv_label_set_text(s_lbl_drive_plot_rpm, buf);
        }
    }
}
