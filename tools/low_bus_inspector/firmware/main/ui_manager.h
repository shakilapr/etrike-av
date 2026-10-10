/**
 * @file ui_manager.h
 * @brief 2D Window Matrix Navigation and 5s/15s Scope Chart Feeder
 *
 * Implements Waveshare ESP32-S3-Touch-LCD-4.3B (SKU: 28141) HMI:
 * - 0. DASHBOARD: Unified CAN Watch Cockpit with 3-actuator status & 5-node watchdog
 * - 1. STEER (SES): Dual digits + Target speed + Delta/Torque + Embedded 5s Live Plot
 * - 2. BRAKE (SEB): Dual digits + Stroke + Delta + Embedded 5s Live Plot
 * - 3. DRIVE (MTR): Dual digits + RPM/Gear + Delta + Embedded 5s Live Plot
 * - 4. BUS & NODES: Detailed CAN bus diagnostics, 12V rail, SD logger
 * - 5-7. EXPANDED SCOPES: 15-second high-resolution full-screen plots
 */

#pragma once

#include <stdint.h>
#include <stdbool.h>
#include "low_bus_decoder.h"
#include "lvgl.h"

#ifdef __cplusplus
extern "C" {
#endif

/* =========================================================================
 * Semantic Design Tokens for Waveshare 4.3B (800x480 RGB565 Flat Minimalist)
 * ========================================================================= */
#define UI_COLOR_BG              0x000000  // Pure engineering black canvas
#define UI_COLOR_SURFACE         0x0D0D0D  // Dark surface card
#define UI_COLOR_SURFACE_ALT     0x1E293B  // Highlighted / active button
#define UI_COLOR_BORDER          0x262626  // Subtle divider / border (1-2px)
#define UI_COLOR_BORDER_ACTIVE   0x38BDF8  // Active selection border
#define UI_COLOR_TEXT_PRIMARY    0xFFFFFF  // High luma primary text
#define UI_COLOR_TEXT_SECONDARY  0x888888  // Muted secondary label
#define UI_COLOR_TEXT_DISABLED   0x444444  // Inactive / disabled text
#define UI_COLOR_STATE_OK        0x10B981  // Emerald green (normal / clear)
#define UI_COLOR_STATE_WARN      0xF59E0B  // Amber warning / override
#define UI_COLOR_STATE_FAULT     0xF43F5E  // Rose red critical / E-Stop
#define UI_COLOR_STATE_OFFLINE   0x64748B  // Slate offline / timeout
#define UI_COLOR_ACCENT_CMD      0x06B6D4  // Cyan command target
#define UI_COLOR_ACCENT_ACT      0x10B981  // Emerald actual feedback

#define PLOT_POINTS_5S           50   // 5.0 seconds at 100ms sample interval
#define PLOT_POINTS_15S          150  // 15.0 seconds at 100ms sample interval

typedef enum {
    WIN_DASHBOARD      = 0, // Cockpit CAN Watch Dashboard
    WIN_STEER          = 1, // SES Steer digits + embedded 5s plot
    WIN_BRAKE          = 2, // SEB Brake digits + embedded 5s plot
    WIN_BUS_SAFETY     = 3, // Bus & Safety Watchdog Diagnostics
    WIN_LOGS           = 4, // Active DTC & Fault Logs Screen
    WIN_STEER_PLOT_15S = 5, // Fullscreen 15s Steer Scope
    WIN_BRAKE_PLOT_15S = 6, // Fullscreen 15s Brake Scope
    WIN_COUNT          = 7
} inspector_window_t;

/**
 * @brief Initialize all LVGL screens, styles, plots, and event listeners.
 */
void ui_manager_init(void);

/**
 * @brief Switch active window with flat transition.
 */
void ui_manager_switch_window(inspector_window_t win);

/**
 * @brief Get currently active window.
 */
inspector_window_t ui_manager_get_current_window(void);

/**
 * @brief Update all telemetry labels and feed 5s / 15s scope charts.
 */
void ui_manager_update(const low_bus_telemetry_t *t);

#ifdef __cplusplus
}
#endif
