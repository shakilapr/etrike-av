/**
 * @file board_waveshare_43b.h
 * @brief Board support for SKU 28141 on Low CAN Bus
 */

#pragma once

#include <stdbool.h>
#include <stdint.h>
#include "esp_err.h"
#include "driver/gpio.h"
#include "driver/twai.h"
#include "esp_lcd_panel_ops.h"
#include "lvgl.h"

#ifdef __cplusplus
extern "C" {
#endif

#define LCD_H_RES              800
#define LCD_V_RES              480

#define BOARD_CAN_TX_PIN       GPIO_NUM_15
#define BOARD_CAN_RX_PIN       GPIO_NUM_16
#define BOARD_CAN_BAUDRATE_KBPS 500

#define BOARD_I2C_SDA_PIN      GPIO_NUM_8
#define BOARD_I2C_SCL_PIN      GPIO_NUM_9
#define BOARD_I2C_PORT         I2C_NUM_0

esp_err_t board_hardware_init(void);
esp_err_t board_lvgl_init(void);
esp_err_t board_lcd_init(esp_lcd_panel_handle_t *panel_handle);
esp_err_t board_set_backlight(uint8_t percent);
esp_err_t board_twai_init(void);
bool board_gt911_init(void);
bool board_gt911_read(uint16_t *x, uint16_t *y);

/**
 * @brief Thread-safe LVGL display mutex locking (per Waveshare & LVGL guidelines)
 */
bool board_display_lock(uint32_t timeout_ms);
void board_display_unlock(void);

#ifdef __cplusplus
}
#endif
