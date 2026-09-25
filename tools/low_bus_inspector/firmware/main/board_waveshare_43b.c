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
 *     EXIO4: SD Card CS
 * - GT911 Capacitive touch input driver for LVGL
 * - TWAI CAN transceiver initialization on GPIO15 (TX) and GPIO16 (RX) at 500 kbps
 * - LVGL v9 Display & Indev subsystem binding
 */

#include "board_waveshare_43b.h"
#include <string.h>
#include "esp_log.h"
#include "esp_check.h"
#include "freertos/FreeRTOS.h"
#include "freertos/semphr.h"
#include "freertos/task.h"
#include "driver/i2c.h"
#include "esp_lcd_panel_rgb.h"
#include "esp_lcd_panel_ops.h"
#include "esp_timer.h"
#include "esp_heap_caps.h"

static const char *TAG = "LOW_BUS_BOARD";
static SemaphoreHandle_t s_lvgl_mutex = NULL;
static esp_lcd_panel_handle_t s_lcd_panel = NULL;
static lv_display_t *s_lvgl_disp = NULL;
static lv_indev_t *s_lvgl_indev = NULL;

#define GT911_I2C_ADDR_1 0x5D
#define GT911_I2C_ADDR_2 0x14
static uint8_t s_gt911_addr = GT911_I2C_ADDR_1;

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
 * @brief Initialize CH422G expander:
 * - Address 0x24: Set output mode (0x01)
 * - Address 0x38: Pulse reset low, then drive high for LCD_RST, TP_RST, DISP, SD_CS
 */
static esp_err_t ch422g_init_peripherals(void) {
    uint8_t mode = 0x01; // Enable outputs
    esp_err_t ret = i2c_master_write_to_device(BOARD_I2C_PORT, 0x24, &mode, 1, pdMS_TO_TICKS(50));
    if (ret != ESP_OK) {
        ESP_LOGW(TAG, "CH422G set mode returned 0x%x, trying direct pin write...", ret);
    }

    // Hardware reset pulse: pull LCD_RST and TP_RST LOW first
    uint8_t rst_low = 0x00;
    i2c_master_write_to_device(BOARD_I2C_PORT, 0x38, &rst_low, 1, pdMS_TO_TICKS(50));
    vTaskDelay(pdMS_TO_TICKS(20));

    // Release reset & turn on backlight DISP:
    // EXIO1 (bit 1) = TP_RST
    // EXIO2 (bit 2) = DISP / Backlight
    // EXIO3 (bit 3) = LCD_RST
    // EXIO4 (bit 4) = SD_CS
    uint8_t out_active = (1 << 1) | (1 << 2) | (1 << 3) | (1 << 4);
    ret = i2c_master_write_to_device(BOARD_I2C_PORT, 0x38, &out_active, 1, pdMS_TO_TICKS(50));
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "CH422G write to 0x38 failed: 0x%x", ret);
    } else {
        ESP_LOGI(TAG, "CH422G peripherals initialized (LCD_RST, TP_RST, DISP active)");
    }
    vTaskDelay(pdMS_TO_TICKS(50));
    return ret;
}

esp_err_t board_set_backlight(uint8_t percent) {
    uint8_t out_mask = (1 << 1) | (1 << 3) | (1 << 4); // Keep resets deasserted
    if (percent > 0) {
        out_mask |= (1 << 2); // Enable backlight DISP
    }
    return i2c_master_write_to_device(BOARD_I2C_PORT, 0x38, &out_mask, 1, pdMS_TO_TICKS(50));
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

bool board_gt911_init(void) {
    uint8_t dummy = 0;
    if (i2c_master_write_to_device(BOARD_I2C_PORT, GT911_I2C_ADDR_1, &dummy, 0, pdMS_TO_TICKS(20)) == ESP_OK) {
        s_gt911_addr = GT911_I2C_ADDR_1;
        ESP_LOGI(TAG, "GT911 touch found at address 0x%02X", s_gt911_addr);
        return true;
    } else if (i2c_master_write_to_device(BOARD_I2C_PORT, GT911_I2C_ADDR_2, &dummy, 0, pdMS_TO_TICKS(20)) == ESP_OK) {
        s_gt911_addr = GT911_I2C_ADDR_2;
        ESP_LOGI(TAG, "GT911 touch found at address 0x%02X", s_gt911_addr);
        return true;
    }
    ESP_LOGW(TAG, "GT911 touch not responding on 0x5D or 0x14");
    return false;
}

bool board_gt911_read(uint16_t *x, uint16_t *y) {
    uint8_t reg[2] = {0x81, 0x4E};
    uint8_t status = 0;
    if (i2c_master_write_read_device(BOARD_I2C_PORT, s_gt911_addr, reg, 2, &status, 1, pdMS_TO_TICKS(20)) != ESP_OK) {
        return false;
    }

    bool touched = false;
    uint8_t points = status & 0x0F;
    if ((status & 0x80) && points > 0) {
        uint8_t data_reg[2] = {0x81, 0x50};
        uint8_t point_buf[4];
        if (i2c_master_write_read_device(BOARD_I2C_PORT, s_gt911_addr, data_reg, 2, point_buf, 4, pdMS_TO_TICKS(20)) == ESP_OK) {
            *x = point_buf[0] | (point_buf[1] << 8);
            *y = point_buf[2] | (point_buf[3] << 8);
            touched = true;
        }
    }

    if (status & 0x80) {
        uint8_t clear_buf[3] = {0x81, 0x4E, 0x00};
        i2c_master_write_to_device(BOARD_I2C_PORT, s_gt911_addr, clear_buf, 3, pdMS_TO_TICKS(20));
    }

    return touched;
}

static void lvgl_touch_read_cb(lv_indev_t *indev, lv_indev_data_t *data) {
    uint16_t x = 0, y = 0;
    if (board_gt911_read(&x, &y)) {
        data->state = LV_INDEV_STATE_PRESSED;
        data->point.x = x;
        data->point.y = y;
    } else {
        data->state = LV_INDEV_STATE_RELEASED;
    }
}

static void lvgl_flush_cb(lv_display_t *disp, const lv_area_t *area, uint8_t *px_map) {
    esp_lcd_panel_handle_t panel = (esp_lcd_panel_handle_t)lv_display_get_user_data(disp);
    esp_lcd_panel_draw_bitmap(panel, area->x1, area->y1, area->x2 + 1, area->y2 + 1, px_map);
    lv_display_flush_ready(disp);
}

static uint32_t lvgl_tick_cb(void) {
    return (uint32_t)(esp_timer_get_time() / 1000ULL);
}

esp_err_t board_lvgl_init(void) {
    ESP_LOGI(TAG, "Initializing LVGL v9 display and touch drivers...");

    // 1. Initialize ST7262 RGB LCD Panel
    ESP_RETURN_ON_ERROR(board_lcd_init(&s_lcd_panel), TAG, "LCD panel init failed");

    // 2. Register millisecond tick provider
    lv_tick_set_cb(lvgl_tick_cb);

    // 3. Create LVGL Display (800x480)
    s_lvgl_disp = lv_display_create(LCD_H_RES, LCD_V_RES);
    if (!s_lvgl_disp) {
        ESP_LOGE(TAG, "Failed to create LVGL display");
        return ESP_FAIL;
    }
    lv_display_set_user_data(s_lvgl_disp, s_lcd_panel);
    lv_display_set_flush_cb(s_lvgl_disp, lvgl_flush_cb);

    // 4. Allocate 40-line partial draw buffers in PSRAM (64 KB each)
    size_t buf_size = LCD_H_RES * 40 * sizeof(uint16_t);
    void *buf1 = heap_caps_malloc(buf_size, MALLOC_CAP_SPIRAM);
    void *buf2 = heap_caps_malloc(buf_size, MALLOC_CAP_SPIRAM);

    if (!buf1 || !buf2) {
        ESP_LOGW(TAG, "SPIRAM buffer alloc failed, allocating in internal DMA RAM...");
        if (buf1) heap_caps_free(buf1);
        if (buf2) heap_caps_free(buf2);
        buf_size = LCD_H_RES * 20 * sizeof(uint16_t);
        buf1 = heap_caps_malloc(buf_size, MALLOC_CAP_DMA | MALLOC_CAP_INTERNAL);
        buf2 = heap_caps_malloc(buf_size, MALLOC_CAP_DMA | MALLOC_CAP_INTERNAL);
    }

    if (!buf1) {
        ESP_LOGE(TAG, "Failed to allocate draw buffer");
        return ESP_ERR_NO_MEM;
    }

    lv_display_set_buffers(s_lvgl_disp, buf1, buf2, buf_size, LV_DISPLAY_RENDER_MODE_PARTIAL);

    // 5. Initialize capacitive touch
    if (board_gt911_init()) {
        s_lvgl_indev = lv_indev_create();
        lv_indev_set_type(s_lvgl_indev, LV_INDEV_TYPE_POINTER);
        lv_indev_set_read_cb(s_lvgl_indev, lvgl_touch_read_cb);
        lv_indev_set_display(s_lvgl_indev, s_lvgl_disp);
        ESP_LOGI(TAG, "GT911 touch input device active");
    }

    ESP_LOGI(TAG, "LVGL v9 display & input subsystem initialized");
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

    // 4. Thread-safe LVGL Mutex
    if (!s_lvgl_mutex) {
        s_lvgl_mutex = xSemaphoreCreateMutex();
    }

    ESP_LOGI(TAG, "All hardware subsystems active.");
    return ESP_OK;
}

bool board_display_lock(uint32_t timeout_ms) {
    if (!s_lvgl_mutex) return true;
    TickType_t ticks = (timeout_ms == UINT32_MAX) ? portMAX_DELAY : pdMS_TO_TICKS(timeout_ms);
    return xSemaphoreTake(s_lvgl_mutex, ticks) == pdTRUE;
}

void board_display_unlock(void) {
    if (s_lvgl_mutex) {
        xSemaphoreGive(s_lvgl_mutex);
    }
}
