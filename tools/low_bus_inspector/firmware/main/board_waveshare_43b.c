/**
 * @file board_waveshare_43b.c
 * @brief Board support package for Waveshare ESP32-S3-Touch-LCD-4.3B (SKU: 28141)
 *
 * Implements:
 * - ST7262 800x480 RGB565 LCD panel initialization with anti-jitter 12.5MHz PCLK
 * - CH422G I/O expander hardware reset sequences:
 *     EXIO1: Touch Reset (GT911)
 *     EXIO2: Backlight/Display Enable (DISP)
 *     EXIO3: LCD Reset (ST7262)
 * - TWAI CAN transceiver initialization on GPIO15 (TX) and GPIO16 (RX) at 500 kbps
 */

#include "board_waveshare_43b.h"
#include <string.h>
#include "esp_log.h"
#include "esp_check.h"
#include "driver/i2c.h"
#include "esp_lcd_panel_rgb.h"
#include "esp_lcd_panel_ops.h"

static const char *TAG = "LOW_BUS_BOARD";

#define CH422G_I2C_ADDR 0x24

/* Static TWAI Driver Configuration for Low Bus (500 kbps) */
static const twai_general_config_t g_config =
    TWAI_GENERAL_CONFIG_DEFAULT(BOARD_CAN_TX_PIN, BOARD_CAN_RX_PIN, TWAI_MODE_NORMAL);
static const twai_timing_config_t t_config =
    TWAI_TIMING_CONFIG_500KBITS();
static const twai_filter_config_t f_config =
    TWAI_FILTER_CONFIG_ACCEPT_ALL();

esp_err_t board_twai_init(void) {
    ESP_LOGI(TAG, "Initializing TWAI on Low CAN Bus (TX=GPIO%d, RX=GPIO%d @ 500k)", BOARD_CAN_TX_PIN, BOARD_CAN_RX_PIN);
    ESP_RETURN_ON_ERROR(twai_driver_install(&g_config, &t_config, &f_config), TAG, "TWAI driver install failed");
    ESP_RETURN_ON_ERROR(twai_start(), TAG, "TWAI start failed");
    ESP_LOGI(TAG, "TWAI Low-Bus driver running");
    return ESP_OK;
}

static esp_err_t i2c_master_init(void) {
    i2c_config_t conf = {
        .mode = I2C_MODE_MASTER,
        .sda_io_num = BOARD_I2C_SDA_PIN,
        .scl_io_num = BOARD_I2C_SCL_PIN,
        .sda_pullup_en = GPIO_PULLUP_ENABLE,
        .scl_pullup_en = GPIO_PULLUP_ENABLE,
        .master.clk_speed = 400000,
    };
    ESP_RETURN_ON_ERROR(i2c_param_config(BOARD_I2C_PORT, &conf), TAG, "I2C config failed");
    return i2c_driver_install(BOARD_I2C_PORT, conf.mode, 0, 0, 0);
}

/**
 * @brief Initialize CH422G expander to release LCD reset (EXIO3),
 *        release touch reset (EXIO1), and turn on display backlight (EXIO2).
 */
static esp_err_t ch422g_init_peripherals(void) {
    // CH422G pin bitmask:
    // EXIO1 (bit 1): TP_RST
    // EXIO2 (bit 2): Backlight DISP
    // EXIO3 (bit 3): LCD_RST
    uint8_t out_mask = (1 << 1) | (1 << 2) | (1 << 3);
    uint8_t cmd[2] = {0x01, out_mask};

    esp_err_t ret = i2c_master_write_to_device(BOARD_I2C_PORT, CH422G_I2C_ADDR, cmd, sizeof(cmd), pdMS_TO_TICKS(50));
    if (ret != ESP_OK) {
        ESP_LOGW(TAG, "CH422G write returned 0x%x, trying alternate address 0x38...", ret);
        ret = i2c_master_write_to_device(BOARD_I2C_PORT, 0x38, &out_mask, 1, pdMS_TO_TICKS(50));
    }
    return ret;
}

esp_err_t board_set_backlight(uint8_t percent) {
    uint8_t out_mask = (1 << 1) | (1 << 3); // Keep resets deasserted
    if (percent > 0) {
        out_mask |= (1 << 2); // Enable backlight DISP
    }
    uint8_t cmd[2] = {0x01, out_mask};
    return i2c_master_write_to_device(BOARD_I2C_PORT, CH422G_I2C_ADDR, cmd, sizeof(cmd), pdMS_TO_TICKS(50));
}

/**
 * @brief ST7262 RGB LCD Panel Configuration with exact anti-jitter timings
 */
esp_err_t board_lcd_init(esp_lcd_panel_handle_t *panel_handle) {
    ESP_LOGI(TAG, "Initializing ST7262 800x480 RGB panel...");

    esp_lcd_rgb_panel_config_t rgb_config = {
        .clk_src = LCD_CLK_SRC_PLL160M,
        .timings = {
            .pclk_hz = 12500000, // 12.5 MHz prevents PSRAM bandwidth starvation and jitter
            .h_res = LCD_H_RES,
            .v_res = LCD_V_RES,
            .hsync_pulse_width = 4,
            .hsync_back_porch = 8,
            .hsync_front_porch = 8,
            .vsync_pulse_width = 4,
            .vsync_back_porch = 8,
            .vsync_front_porch = 8,
            .flags = {
                .pclk_active_neg = true,
            },
        },
        .data_width = 16, // RGB565
        .bits_per_pixel = 16,
        .num_fbs = 1,
        .bounce_buffer_size_px = LCD_H_RES * 10,
        .sram_trans_align = 4,
        .psram_trans_align = 64,
        .hsync_gpio_num = GPIO_NUM_46,
        .vsync_gpio_num = GPIO_NUM_3,
        .de_gpio_num = GPIO_NUM_5,
        .pclk_gpio_num = GPIO_NUM_7,
        .data_gpio_nums = {
            GPIO_NUM_14, GPIO_NUM_38, GPIO_NUM_18, GPIO_NUM_17, GPIO_NUM_10, // B0-B4
            GPIO_NUM_39, GPIO_NUM_0,  GPIO_NUM_45, GPIO_NUM_48, GPIO_NUM_47, GPIO_NUM_21, // G0-G5
            GPIO_NUM_1,  GPIO_NUM_2,  GPIO_NUM_42, GPIO_NUM_41, GPIO_NUM_40  // R0-R4
        },
        .flags = {
            .fb_in_psram = true,
        },
    };

    ESP_RETURN_ON_ERROR(esp_lcd_new_rgb_panel(&rgb_config, panel_handle), TAG, "RGB panel creation failed");
    ESP_RETURN_ON_ERROR(esp_lcd_panel_reset(*panel_handle), TAG, "RGB panel reset failed");
    ESP_RETURN_ON_ERROR(esp_lcd_panel_init(*panel_handle), TAG, "RGB panel init failed");

    ESP_LOGI(TAG, "ST7262 RGB panel successfully initialized");
    return ESP_OK;
}

esp_err_t board_hardware_init(void) {
    ESP_LOGI(TAG, "Initializing hardware subsystems for SKU 28141 on Low Bus...");

    // 1. Shared I2C master bus
    ESP_RETURN_ON_ERROR(i2c_master_init(), TAG, "I2C master init failed");

    // 2. CH422G Peripheral expander (deassert LCD_RST, TP_RST, DISP)
    ESP_RETURN_ON_ERROR(ch422g_init_peripherals(), TAG, "CH422G expander init failed");

    // 3. TWAI CAN controller on GPIO15/16
    ESP_RETURN_ON_ERROR(board_twai_init(), TAG, "CAN init failed");

    ESP_LOGI(TAG, "All hardware subsystems active.");
    return ESP_OK;
}
