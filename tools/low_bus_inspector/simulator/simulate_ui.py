"""800x480 Pixel-Perfect Low-Bus Inspector UI Simulator and Screenshot Generator.

Renders authentic 800x480 displays matching the exact LVGL layout:
- Screen 0: Unified CAN Watch Cockpit / Dashboard
- Screen 1: Steering (SES) Digits + Embedded 5s Dual-Trace Plot
- Screen 2: Brake (SEB) Digits + Embedded 5s Dual-Trace Plot
- Screen 3: Drive (MTR) Digits + Embedded 5s Dual-Trace Plot
- Screen 4: Detailed Bus & 5-Node Watchdog Deck
- Screens 5-7: 15-Second Fullscreen Oscilloscope Scopes
"""

from __future__ import annotations

import math
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import numpy as np

OUTPUT_DIR = Path(__file__).parent / "screenshots"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

WIDTH = 800
HEIGHT = 480

# Semantic Color Tokens (matching styles.xml & ui_manager.h)
C_BG = (0, 0, 0)
C_CARD_BG = (13, 13, 13)
C_CARD_BORDER = (38, 38, 38)
C_NAV_BG = (8, 8, 8)
C_NAV_BTN = (20, 20, 20)
C_NAV_ACTIVE = (30, 41, 59)
C_CYAN = (6, 182, 212)
C_EMERALD = (16, 185, 129)
C_ROSE = (244, 63, 94)
C_AMBER = (245, 158, 11)
C_WHITE = (255, 255, 255)
C_GRAY_TEXT = (136, 136, 136)
C_GRAY_SUB = (100, 116, 139)
C_GRID = (24, 24, 24)

# 6-Tier Typography Hierarchy
try:
    font_hero = ImageFont.truetype("arialbd.ttf", 36)
    font_large = ImageFont.truetype("arialbd.ttf", 24)
    font_badge = ImageFont.truetype("arialbd.ttf", 16)
    font_med = ImageFont.truetype("arialbd.ttf", 14)
    font_bold = ImageFont.truetype("arialbd.ttf", 13)
    font_small = ImageFont.truetype("arialbd.ttf", 12)
    font_tiny = ImageFont.truetype("arialbd.ttf", 11)
except Exception:
    font_hero = font_large = font_badge = font_med = font_bold = font_small = font_tiny = ImageFont.load_default()


def quantize_to_rgb565(img: Image.Image) -> Image.Image:
    """Quantizes 24-bit RGB888 image to true hardware 16-bit RGB565 (65,536 colors)."""
    arr = np.array(img, dtype=np.uint16)
    r5 = (arr[:, :, 0] >> 3).astype(np.uint16)
    g6 = (arr[:, :, 1] >> 2).astype(np.uint16)
    b5 = (arr[:, :, 2] >> 3).astype(np.uint16)

    r8 = ((r5 * 255 + 15) // 31).astype(np.uint8)
    g8 = ((g6 * 255 + 31) // 63).astype(np.uint8)
    b8 = ((b5 * 255 + 15) // 31).astype(np.uint8)
    return Image.fromarray(np.stack([r8, g8, b8], axis=-1))


def save_screen(img: Image.Image, name: str) -> None:
    rgb565 = quantize_to_rgb565(img)
    out_path = OUTPUT_DIR / f"{name}.png"
    rgb565.save(out_path)
    print(f"Saved: {out_path.name}")


def draw_nav_bar(draw: ImageDraw.ImageDraw, active_tab: int = 0) -> None:
    draw.rectangle([0, 0, WIDTH, 48], fill=C_NAV_BG, outline=C_CARD_BORDER, width=1)

    tabs = [
        "0. DASHBOARD",
        "1. STEER (SES)",
        "2. BRAKE (SEB)",
        "3. DRIVE (MTR)",
        "4. BUS & NODES",
    ]
    tab_w = 152
    tab_h = 42

    for i, title in enumerate(tabs):
        tx = 4 + i * (tab_w + 6)
        ty = 3
        is_active = i == active_tab

        bg_col = C_NAV_ACTIVE if is_active else C_CARD_BG
        border_col = (56, 189, 248) if is_active else C_CARD_BORDER
        border_w = 2 if is_active else 1
        text_col = (56, 189, 248) if is_active else C_GRAY_TEXT

        draw.rounded_rectangle([tx, ty, tx + tab_w, ty + tab_h], radius=6, fill=bg_col, outline=border_col, width=border_w)
        draw.text((tx + tab_w // 2, ty + tab_h // 2), title, font=font_small, fill=text_col, anchor="mm")


def render_screen0_dashboard():
    img = Image.new("RGB", (WIDTH, HEIGHT), C_BG)
    draw = ImageDraw.Draw(img)
    draw_nav_bar(draw, active_tab=0)

    # 1. E-Stop Banner
    draw.rounded_rectangle([8, 52, 792, 108], radius=8, fill=(6, 40, 23), outline=C_EMERALD, width=2)
    draw.text((400, 72), "[ OK ] E-STOP DISENGAGED • SYSTEM CLEAR", font=font_large, fill=C_EMERALD, anchor="mm")
    draw.text((400, 94), "LOW-BUS MASTER (500 kbps)  •  INTERLOCK PIN: HIGH  •  FAIL-CLOSED READY", font=font_small, fill=(167, 243, 208), anchor="mm")

    # 2. Quick Cockpit Deck: 3 Actuator Overview Cards
    act_w = 254
    act_h = 175
    act_y = 114

    # Card 1: Steer
    draw.rounded_rectangle([8, act_y, 8 + act_w, act_y + act_h], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((18, act_y + 16), "1. STEER (SES 0x201) >", font=font_med, fill=C_CYAN, anchor="lm")
    draw.text((8 + act_w // 2, act_y + 70), "+14.7°", font=font_hero, fill=C_EMERALD, anchor="mm")
    draw.text((8 + act_w // 2, act_y + 105), "CMD: +15.0°  |  Δ: 0.3° [OK]", font=font_small, fill=C_WHITE, anchor="mm")
    draw.text((8 + act_w // 2, act_y + 125), "Torque: +0.2 Nm [NO OVERRIDE]", font=font_small, fill=C_AMBER, anchor="mm")
    draw.text((18, act_y + act_h - 14), "[ OK ] SES HEALTHY (100 Hz)", font=font_tiny, fill=C_EMERALD, anchor="lm")

    # Card 2: Brake
    draw.rounded_rectangle([273, act_y, 273 + act_w, act_y + act_h], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((283, act_y + 16), "2. BRAKE (SEB 0x721) >", font=font_med, fill=C_CYAN, anchor="lm")
    draw.text((273 + act_w // 2, act_y + 70), "442 kPa", font=font_hero, fill=C_EMERALD, anchor="mm")
    draw.text((273 + act_w // 2, act_y + 105), "CMD: 450 kPa  |  Δ: -8 kPa [OK]", font=font_small, fill=C_WHITE, anchor="mm")
    draw.text((273 + act_w // 2, act_y + 125), "Stroke: 17.8 mm  |  Temp: 38°C", font=font_small, fill=(56, 189, 248), anchor="mm")
    draw.text((283, act_y + act_h - 14), "[ OK ] SEB HEALTHY (100 Hz)", font=font_tiny, fill=C_EMERALD, anchor="lm")

    # Card 3: Drive
    draw.rounded_rectangle([538, act_y, 538 + act_w, act_y + act_h], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((548, act_y + 16), "3. DRIVE (MTR 0x206) >", font=font_med, fill=C_CYAN, anchor="lm")
    draw.text((538 + act_w // 2, act_y + 70), "14.8 km/h", font=font_hero, fill=C_EMERALD, anchor="mm")
    draw.text((538 + act_w // 2, act_y + 105), "CMD: 15.0 km/h  |  Δ: 0.2 [OK]", font=font_small, fill=C_WHITE, anchor="mm")
    draw.text((538 + act_w // 2, act_y + 125), "RPM: 1240  |  GEAR: [ D ] (DRIVE)", font=font_small, fill=(56, 189, 248), anchor="mm")
    draw.text((548, act_y + act_h - 14), "[ OK ] MTR HEALTHY (50 Hz)", font=font_tiny, fill=C_EMERALD, anchor="lm")

    # 3. CAN Watch Cockpit Deck: Bus Health + 5-Node Array
    can_y = 296
    can_h = 176

    # CAN Box
    draw.rounded_rectangle([8, can_y, 8 + act_w, can_y + can_h], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((18, can_y + 16), "CAN BUS HEALTH", font=font_med, fill=C_GRAY_TEXT, anchor="lm")
    draw.text((8 + act_w // 2, can_y + 70), "420 msg/s", font=font_hero, fill=C_CYAN, anchor="mm")
    draw.text((8 + act_w // 2, can_y + 110), "TEC: 0 | REC: 0 [BUS OK]", font=font_small, fill=C_EMERALD, anchor="mm")
    draw.text((8 + act_w // 2, can_y + 135), "12V Rail: 13.8 V [BATTERY OK]", font=font_small, fill=C_WHITE, anchor="mm")

    # 5-Node Heartbeat Deck
    draw.rounded_rectangle([273, can_y, 792, can_y + can_h], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((283, can_y + 16), "LOW-BUS ACTUATOR & GATEWAY LIVENESS (250ms FAIL-CLOSED WATCHDOG)", font=font_small, fill=C_GRAY_TEXT, anchor="lm")

    node_ids = ["SYS (0x011)", "RT (0x210)", "MTR (0x206)", "SES (0x201)", "SEB (0x721)"]
    node_rates = ["10 Hz", "100 Hz", "50 Hz", "100 Hz", "100 Hz"]
    n_w = 95
    n_h = 132
    for i in range(5):
        nx = 283 + i * (n_w + 8)
        ny = can_y + 32
        draw.rounded_rectangle([nx, ny, nx + n_w, ny + n_h], radius=6, fill=C_BG, outline=C_CARD_BORDER, width=1)
        draw.text((nx + n_w // 2, ny + 16), node_ids[i], font=font_tiny, fill=C_WHITE, anchor="mm")
        draw.text((nx + n_w // 2, ny + 60), node_rates[i], font=font_large, fill=C_EMERALD, anchor="mm")
        draw.text((nx + n_w // 2, ny + n_h - 16), "[ OK ]", font=font_small, fill=C_EMERALD, anchor="mm")

    save_screen(img, "screen0_dashboard")


def render_screen1_steer_with_5s_plot():
    img = Image.new("RGB", (WIDTH, HEIGHT), C_BG)
    draw = ImageDraw.Draw(img)
    draw_nav_bar(draw, active_tab=1)

    act_w = 254
    u_h = 195
    u_y = 50

    # Card 1: Command (VCU 0x169)
    draw.rounded_rectangle([8, u_y, 8 + act_w, u_y + u_h], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((18, u_y + 16), "COMMAND (VCU 0x169)", font=font_small, fill=C_GRAY_TEXT, anchor="lm")
    draw.text((8 + act_w // 2, u_y + 70), "+15.0°", font=font_hero, fill=C_CYAN, anchor="mm")
    draw.rounded_rectangle([20, u_y + 105, 8 + act_w - 12, u_y + 140], radius=6, fill=(18, 26, 36), outline=(30, 58, 80), width=1)
    draw.text((8 + act_w // 2, u_y + 122), "TARGET SPEED: 200 °/s", font=font_small, fill=C_WHITE, anchor="mm")
    draw.text((18, u_y + u_h - 14), "[ OK ] CLOSED-LOOP ENABLED", font=font_tiny, fill=C_EMERALD, anchor="lm")

    # Card 2: Feedback (SES 0x201)
    draw.rounded_rectangle([273, u_y, 273 + act_w, u_y + u_h], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((283, u_y + 16), "ACTUATION (SES 0x201)", font=font_small, fill=C_GRAY_TEXT, anchor="lm")
    draw.text((273 + act_w // 2, u_y + 70), "+14.7°", font=font_hero, fill=C_EMERALD, anchor="mm")
    draw.rounded_rectangle([285, u_y + 105, 273 + act_w - 12, u_y + 140], radius=6, fill=(12, 34, 24), outline=(21, 80, 50), width=1)
    draw.text((273 + act_w // 2, u_y + 122), "ACTUAL SPEED: 198 °/s", font=font_small, fill=C_WHITE, anchor="mm")
    draw.text((283, u_y + u_h - 14), "[ OK ] ANGLE TRACKING • ALIGNED", font=font_tiny, fill=C_EMERALD, anchor="lm")

    # Card 3: Delta & Torque
    draw.rounded_rectangle([538, u_y, 538 + act_w, u_y + u_h], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.rounded_rectangle([550, u_y + 10, 538 + act_w - 12, u_y + 54], radius=6, fill=(6, 78, 59), outline=C_EMERALD, width=2)
    draw.text((538 + act_w // 2, u_y + 32), "Δ: 0.3°   [ TRACKING OK ]", font=font_med, fill=C_WHITE, anchor="mm")

    draw.rounded_rectangle([550, u_y + 60, 538 + act_w - 12, u_y + 138], radius=6, fill=(35, 24, 6), outline=C_AMBER, width=1)
    draw.text((538 + act_w // 2, u_y + 74), "DRIVER COLUMN TORQUE", font=font_tiny, fill=C_AMBER, anchor="mm")
    draw.text((538 + act_w // 2, u_y + 98), "+0.2 Nm", font=font_large, fill=C_AMBER, anchor="mm")
    draw.text((538 + act_w // 2, u_y + 124), "[ NO OVERRIDE ]", font=font_tiny, fill=C_EMERALD, anchor="mm")

    draw.text((548, u_y + u_h - 14), "[ OK ] SES HEALTHY • 8.4A / 34°C", font=font_tiny, fill=C_EMERALD, anchor="lm")

    # Middle Deck: Embedded 5-Second Dual-Trace Scope Plot (Height 172px)
    c_x0, c_y0, c_x1, c_y1 = 8, 250, 792, 422
    draw.rounded_rectangle([c_x0, c_y0, c_x1, c_y1], radius=8, fill=(8, 8, 8), outline=C_CARD_BORDER, width=1)

    chart_w = c_x1 - c_x0
    chart_h = c_y1 - c_y0
    for s in range(6):
        gx = c_x0 + int(s * (chart_w / 5))
        draw.line([(gx, c_y0), (gx, c_y1)], fill=C_GRID, width=1)

    cy = c_y0 + chart_h // 2
    draw.line([(c_x0, cy), (c_x1, cy)], fill=(60, 60, 60), width=1)

    draw.text((c_x0 + 16, c_y0 + 14), "5s REAL-TIME SCOPE (100ms) • CMD: CYAN | ACT: EMERALD (-45° to +45°)", font=font_tiny, fill=C_GRAY_SUB)

    # 5-second plot curve (50 points @ 10Hz)
    np.random.seed(101)
    cmd5 = np.zeros(50)
    cmd5[:15] = 10.0
    cmd5[15:35] = 22.0
    cmd5[35:] = 15.0

    act5 = np.zeros(50)
    for i in range(1, 50):
        act5[i] = act5[i - 1] + (cmd5[i] - act5[i - 1]) * 0.32 + np.random.normal(0, 0.12)

    def to_canvas_5s(idx, deg):
        px = c_x0 + int(idx * (chart_w / 49))
        py = cy - int((deg / 45.0) * (chart_h / 2 - 14))
        return (px, max(c_y0 + 5, min(c_y1 - 5, py)))

    cmd_pts = [to_canvas_5s(i, cmd5[i]) for i in range(50)]
    draw.line(cmd_pts, fill=C_CYAN, width=3)

    act_pts = [to_canvas_5s(i, act5[i]) for i in range(50)]
    draw.line(act_pts, fill=C_EMERALD, width=2)

    # Bottom Full-Width Action Button (Height 46px)
    draw.rounded_rectangle([8, 428, 792, 474], radius=8, fill=(30, 41, 59), outline=(56, 189, 248), width=2)
    draw.text((400, 451), "VIEW 15-SECOND FULL STEERING SCOPE PLOT (OR SWIPE DOWN) >", font=font_med, fill=C_WHITE, anchor="mm")

    save_screen(img, "screen1_steer_with_5s_plot")


def render_screen2_brake_with_5s_plot():
    img = Image.new("RGB", (WIDTH, HEIGHT), C_BG)
    draw = ImageDraw.Draw(img)
    draw_nav_bar(draw, active_tab=2)

    act_w = 254
    u_h = 195
    u_y = 50

    # Card 1: Command (VCU 0x169 / 0x7B9)
    draw.rounded_rectangle([8, u_y, 8 + act_w, u_y + u_h], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((18, u_y + 16), "COMMAND (VCU 0x169)", font=font_small, fill=C_GRAY_TEXT, anchor="lm")
    draw.text((8 + act_w // 2, u_y + 70), "450 kPa", font=font_hero, fill=C_CYAN, anchor="mm")
    draw.rounded_rectangle([20, u_y + 105, 8 + act_w - 12, u_y + 140], radius=6, fill=(18, 26, 36), outline=(30, 58, 80), width=1)
    draw.text((8 + act_w // 2, u_y + 122), "TARGET PRESSURE: 450 kPa", font=font_small, fill=C_WHITE, anchor="mm")
    draw.text((18, u_y + u_h - 14), "[ OK ] CLOSED-LOOP HYDRAULIC", font=font_tiny, fill=C_EMERALD, anchor="lm")

    # Card 2: Feedback (SEB 0x721)
    draw.rounded_rectangle([273, u_y, 273 + act_w, u_y + u_h], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((283, u_y + 16), "ACTUATION (SEB 0x721)", font=font_small, fill=C_GRAY_TEXT, anchor="lm")
    draw.text((273 + act_w // 2, u_y + 70), "442 kPa", font=font_hero, fill=C_EMERALD, anchor="mm")
    draw.rounded_rectangle([285, u_y + 105, 273 + act_w - 12, u_y + 140], radius=6, fill=(12, 34, 24), outline=(21, 80, 50), width=1)
    draw.text((273 + act_w // 2, u_y + 122), "ACTUATOR STROKE: 17.8 mm", font=font_small, fill=C_WHITE, anchor="mm")
    draw.text((283, u_y + u_h - 14), "[ OK ] PRESSURE TRACKING", font=font_tiny, fill=C_EMERALD, anchor="lm")

    # Card 3: Delta & Temp
    draw.rounded_rectangle([538, u_y, 538 + act_w, u_y + u_h], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.rounded_rectangle([550, u_y + 10, 538 + act_w - 12, u_y + 54], radius=6, fill=(6, 78, 59), outline=C_EMERALD, width=2)
    draw.text((538 + act_w // 2, u_y + 32), "Δ: -8 kPa   [ TRACKING OK ]", font=font_med, fill=C_WHITE, anchor="mm")

    draw.rounded_rectangle([550, u_y + 60, 538 + act_w - 12, u_y + 138], radius=6, fill=(18, 26, 36), outline=(56, 189, 248), width=1)
    draw.text((538 + act_w // 2, u_y + 74), "ACTUATOR TEMPERATURE", font=font_tiny, fill=C_GRAY_TEXT, anchor="mm")
    draw.text((538 + act_w // 2, u_y + 98), "38°C [NOMINAL]", font=font_large, fill=C_WHITE, anchor="mm")
    draw.text((538 + act_w // 2, u_y + 124), "[ BRAKE PRIORITY READY ]", font=font_tiny, fill=C_EMERALD, anchor="mm")

    draw.text((548, u_y + u_h - 14), "[ OK ] SEB ECU HEALTHY (100 Hz)", font=font_tiny, fill=C_EMERALD, anchor="lm")

    # Middle Deck: Embedded 5s Scope Plot (Height 172px)
    c_x0, c_y0, c_x1, c_y1 = 8, 250, 792, 422
    draw.rounded_rectangle([c_x0, c_y0, c_x1, c_y1], radius=8, fill=(8, 8, 8), outline=C_CARD_BORDER, width=1)

    chart_w = c_x1 - c_x0
    chart_h = c_y1 - c_y0
    for s in range(6):
        gx = c_x0 + int(s * (chart_w / 5))
        draw.line([(gx, c_y0), (gx, c_y1)], fill=C_GRID, width=1)

    cy = c_y1 - 10
    draw.line([(c_x0, cy), (c_x1, cy)], fill=(60, 60, 60), width=1)

    draw.text((c_x0 + 16, c_y0 + 14), "5s REAL-TIME SCOPE (100ms) • CMD: CYAN | ACT: EMERALD (0 to 1200 kPa)", font=font_tiny, fill=C_GRAY_SUB)

    np.random.seed(202)
    bcmd5 = np.full(50, 450.0)
    bcmd5[:10] = 0.0
    bact5 = np.zeros(50)
    for i in range(1, 50):
        bact5[i] = bact5[i - 1] + (bcmd5[i] - bact5[i - 1]) * 0.28 + np.random.normal(0, 3.5)

    def to_canvas_brake(idx, val):
        px = c_x0 + int(idx * (chart_w / 49))
        py = cy - int((val / 1200.0) * (chart_h - 36))
        return (px, max(c_y0 + 5, min(c_y1 - 5, py)))

    cmd_pts = [to_canvas_brake(i, bcmd5[i]) for i in range(50)]
    draw.line(cmd_pts, fill=C_CYAN, width=3)

    act_pts = [to_canvas_brake(i, bact5[i]) for i in range(50)]
    draw.line(act_pts, fill=C_EMERALD, width=2)

    # Bottom Full-Width Action Button (Height 46px)
    draw.rounded_rectangle([8, 428, 792, 474], radius=8, fill=(30, 41, 59), outline=(56, 189, 248), width=2)
    draw.text((400, 451), "VIEW 15-SECOND FULL BRAKE PRESSURE SCOPE (OR SWIPE DOWN) >", font=font_med, fill=C_WHITE, anchor="mm")

    save_screen(img, "screen2_brake_with_5s_plot")


def render_screen3_drive_with_5s_plot():
    img = Image.new("RGB", (WIDTH, HEIGHT), C_BG)
    draw = ImageDraw.Draw(img)
    draw_nav_bar(draw, active_tab=3)

    act_w = 254
    u_h = 195
    u_y = 50

    # Card 1: Command (VCU 0x204)
    draw.rounded_rectangle([8, u_y, 8 + act_w, u_y + u_h], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((18, u_y + 16), "COMMAND (VCU 0x204)", font=font_small, fill=C_GRAY_TEXT, anchor="lm")
    draw.text((8 + act_w // 2, u_y + 70), "15.0 km/h", font=font_hero, fill=C_CYAN, anchor="mm")
    draw.rounded_rectangle([20, u_y + 105, 8 + act_w - 12, u_y + 140], radius=6, fill=(18, 26, 36), outline=(30, 58, 80), width=1)
    draw.text((8 + act_w // 2, u_y + 122), "TARGET: [ D ] (DRIVE)", font=font_small, fill=C_WHITE, anchor="mm")
    draw.text((18, u_y + u_h - 14), "[ OK ] DRIVE REQ VALID", font=font_tiny, fill=C_EMERALD, anchor="lm")

    # Card 2: Feedback (MTR 0x206)
    draw.rounded_rectangle([273, u_y, 273 + act_w, u_y + u_h], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((283, u_y + 16), "ACTUATION (MTR 0x206)", font=font_small, fill=C_GRAY_TEXT, anchor="lm")
    draw.text((273 + act_w // 2, u_y + 70), "14.8 km/h", font=font_hero, fill=C_EMERALD, anchor="mm")
    draw.rounded_rectangle([285, u_y + 105, 273 + act_w - 12, u_y + 140], radius=6, fill=(12, 34, 24), outline=(21, 80, 50), width=1)
    draw.text((273 + act_w // 2, u_y + 122), "ACTUAL: [ D ] (ENGAGED)", font=font_small, fill=C_WHITE, anchor="mm")
    draw.text((283, u_y + u_h - 14), "[ OK ] PROPULSION HEALTHY", font=font_tiny, fill=C_EMERALD, anchor="lm")

    # Card 3: Delta & Powertrain Status
    draw.rounded_rectangle([538, u_y, 538 + act_w, u_y + u_h], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.rounded_rectangle([550, u_y + 10, 538 + act_w - 12, u_y + 54], radius=6, fill=(6, 78, 59), outline=C_EMERALD, width=2)
    draw.text((538 + act_w // 2, u_y + 32), "Δ: 0.2 km/h   [ TRACKING OK ]", font=font_med, fill=C_WHITE, anchor="mm")

    draw.rounded_rectangle([550, u_y + 60, 538 + act_w - 12, u_y + 138], radius=6, fill=(18, 26, 36), outline=(56, 189, 248), width=1)
    draw.text((538 + act_w // 2, u_y + 74), "SAFETY INTERLOCKS", font=font_tiny, fill=C_GRAY_TEXT, anchor="mm")
    draw.text((538 + act_w // 2, u_y + 98), "ALL CLEAR", font=font_large, fill=C_EMERALD, anchor="mm")
    draw.text((538 + act_w // 2, u_y + 124), "[ BRAKE PRIORITY OK ]", font=font_tiny, fill=C_EMERALD, anchor="mm")

    draw.text((548, u_y + u_h - 14), "[ OK ] MTR NODE ACTIVE (3)", font=font_tiny, fill=C_EMERALD, anchor="lm")

    # Middle Deck: Embedded 5s Scope Plot (Height 172px)
    c_x0, c_y0, c_x1, c_y1 = 8, 250, 792, 422
    draw.rounded_rectangle([c_x0, c_y0, c_x1, c_y1], radius=8, fill=(8, 8, 8), outline=C_CARD_BORDER, width=1)

    chart_w = c_x1 - c_x0
    chart_h = c_y1 - c_y0
    for s in range(6):
        gx = c_x0 + int(s * (chart_w / 5))
        draw.line([(gx, c_y0), (gx, c_y1)], fill=C_GRID, width=1)

    cy = c_y1 - 10
    draw.line([(c_x0, cy), (c_x1, cy)], fill=(60, 60, 60), width=1)

    draw.text((c_x0 + 16, c_y0 + 14), "5s REAL-TIME SCOPE (100ms) • CMD: CYAN | ACT: EMERALD (0 to 35 km/h)", font=font_tiny, fill=C_GRAY_SUB)

    np.random.seed(303)
    dcmd5 = np.full(50, 15.0)
    dcmd5[:10] = 5.0
    dact5 = np.zeros(50)
    for i in range(1, 50):
        dact5[i] = dact5[i - 1] + (dcmd5[i] - dact5[i - 1]) * 0.25 + np.random.normal(0, 0.08)

    def to_canvas_drive(idx, val):
        px = c_x0 + int(idx * (chart_w / 49))
        py = cy - int((val / 35.0) * (chart_h - 36))
        return (px, max(c_y0 + 5, min(c_y1 - 5, py)))

    cmd_pts = [to_canvas_drive(i, dcmd5[i]) for i in range(50)]
    draw.line(cmd_pts, fill=C_CYAN, width=3)

    act_pts = [to_canvas_drive(i, dact5[i]) for i in range(50)]
    draw.line(act_pts, fill=C_EMERALD, width=2)

    # Bottom Full-Width Action Button (Height 46px)
    draw.rounded_rectangle([8, 428, 792, 474], radius=8, fill=(30, 41, 59), outline=(56, 189, 248), width=2)
    draw.text((400, 451), "VIEW 15-SECOND FULL DRIVE SPEED SCOPE (OR SWIPE DOWN) >", font=font_med, fill=C_WHITE, anchor="mm")

    save_screen(img, "screen3_drive_with_5s_plot")


def main():
    print("Generating updated 800x480 screenshots...")
    render_screen0_dashboard()
    render_screen1_steer_with_5s_plot()
    render_screen2_brake_with_5s_plot()
    render_screen3_drive_with_5s_plot()
    print("Screenshots updated successfully.")


if __name__ == "__main__":
    main()

