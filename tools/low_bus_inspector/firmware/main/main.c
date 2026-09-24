/**
 * @file main.c
 * @brief Low-Bus Actuator & Gateway Inspector Firmware Entry Point
 */

#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "esp_timer.h"
#include "board_waveshare_43b.h"
#include "low_bus_decoder.h"
#include "ui_manager.h"

static const char *TAG = "INSPECTOR_MAIN";

static void can_rx_low_bus_task(void *arg) {
    ESP_LOGI(TAG, "CAN Low-Bus RX task running on Core %d", xPortGetCoreID());
    twai_message_t rx_msg;

    while (1) {
        esp_err_t res = twai_receive(&rx_msg, pdMS_TO_TICKS(50));
        if (res == ESP_OK) {
            low_bus_decoder_process_frame(&rx_msg);
        } else if (res != ESP_ERR_TIMEOUT) {
            twai_status_info_t st;
            twai_get_status_info(&st);
            if (st.state == TWAI_STATE_BUS_OFF) {
                ESP_LOGE(TAG, "Low Bus Off! Initiating recovery...");
                twai_initiate_recovery();
            }
        }
    }
}

static void lvgl_render_task(void *arg) {
    ESP_LOGI(TAG, "LVGL Render task running on Core %d", xPortGetCoreID());

    lv_init();
    ui_manager_init();

    low_bus_telemetry_t t;
    int64_t last_100ms_tick = esp_timer_get_time();

    while (1) {
        int64_t now = esp_timer_get_time();
        if ((now - last_100ms_tick) >= 100000) {
            low_bus_decoder_tick_100ms();
            last_100ms_tick = now;
        }

        low_bus_decoder_get_telemetry(&t);
        ui_manager_update(&t);

        uint32_t delay_ms = lv_timer_handler();
        if (delay_ms < 5) delay_ms = 5;
        if (delay_ms > 20) delay_ms = 20;

        vTaskDelay(pdMS_TO_TICKS(delay_ms));
    }
}

void app_main(void) {
    ESP_LOGI(TAG, "==========================================================");
    ESP_LOGI(TAG, "   Low-Bus Actuator & Gateway Inspector (Waveshare 4.3B)  ");
    ESP_LOGI(TAG, "   Dedicated Ground-Truth Diagnostic & 15s Scope Tool    ");
    ESP_LOGI(TAG, "==========================================================");

    ESP_ERROR_CHECK(board_hardware_init());
    low_bus_decoder_init();

    xTaskCreatePinnedToCore(can_rx_low_bus_task, "can_rx_low", 4096, NULL, 10, NULL, 0);
    xTaskCreatePinnedToCore(lvgl_render_task, "lvgl_render", 8192, NULL, 5, NULL, 1);

    ESP_LOGI(TAG, "Inspector running.");
}
