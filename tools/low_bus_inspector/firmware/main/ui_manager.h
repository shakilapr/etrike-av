/**
 * @file ui_manager.h
 * @brief 2D Window Matrix Navigation and 15s Scope Chart Feeder
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

/* =========================================================================
 * Semantic Typography Tokens (Fixed 6-Tier Hierarchy - Montserrat/Inter)
 * ========================================================================= */
#define UI_FONT_SIZE_HERO        96  // Speed / primary focus metric
#define UI_FONT_SIZE_MAJOR       48  // Command & Feedback values, Gear, E-Stop state
#define UI_FONT_SIZE_HEADING     28  // Section titles, header labels, primary badges
#define UI_FONT_SIZE_BODY        20  // Touch button labels, normal values, unit labels
#define UI_FONT_SIZE_SECONDARY   16  // Card titles, telemetry labels, auxiliary rates
#define UI_FONT_SIZE_METADATA    14  // Bus addresses, cycle times, qualitative tags

typedef enum {
    WIN_BUS_SAFETY     = 0,
    WIN_STEER_DIGITS   = 1,
    WIN_STEER_PLOT     = 2,
    WIN_BRAKE_DIGITS   = 3,
    WIN_BRAKE_PLOT     = 4,
    WIN_DRIVE_DIGITS   = 5,
    WIN_DRIVE_PLOT     = 6,
    WIN_COUNT          = 7
} inspector_window_t;

/**
 * @brief Initialize all 7 LVGL screens, styles, and event listeners.
 */
void ui_manager_init(void);

/**
 * @brief Update active window widgets and feed 15s scope charts.
 * @param t Low-bus telemetry snapshot.
 */
void ui_manager_update(const low_bus_telemetry_t *t);

/**
 * @brief Switch explicitly to a target window (with smooth animation).
 */
void ui_manager_switch_window(inspector_window_t win);

/**
 * @brief Get currently active window.
 */
inspector_window_t ui_manager_get_current_window(void);

#ifdef __cplusplus
}
#endif
