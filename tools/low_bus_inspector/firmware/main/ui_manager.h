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
