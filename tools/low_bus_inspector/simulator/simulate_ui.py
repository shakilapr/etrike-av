"""800x480 Pixel-Perfect Low-Bus Inspector UI Simulator and Screenshot Generator.

Renders high-contrast, authentic 800x480 displays matching the exact LVGL XML
layout, 6-tier typography, semantic color tokens, and 15-second rolling waveform plots.
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

# Semantic Color Tokens (matching styles.xml)
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

# 6-Tier Typography Hierarchy (Montserrat / Arial Bold)
try:
    font_hero = ImageFont.truetype("arialbd.ttf", 52)
    font_large = ImageFont.truetype("arialbd.ttf", 26)
    font_badge = ImageFont.truetype("arialbd.ttf", 22)
    font_med = ImageFont.truetype("arialbd.ttf", 18)
    font_bold = ImageFont.truetype("arialbd.ttf", 15)
    font_small = ImageFont.truetype("arialbd.ttf", 14)
    font_tiny = ImageFont.truetype("arialbd.ttf", 12)
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


def render_waveshare_43b_enclosure(screen_img: Image.Image, screen_name: str) -> Path:
    """Renders the 800x480 screen inside the physical Waveshare 4.3B-BOX enclosure (SKU 28141)."""
    box_w = int(116.3 * 8.417)  # ~978 px
    box_h = int(79.0 * 8.417)   # ~665 px

    box_img = Image.new("RGB", (box_w, box_h), (12, 13, 16))
    draw_box = ImageDraw.Draw(box_img)

    draw_box.rounded_rectangle([4, 4, box_w - 4, box_h - 4], radius=32, fill=(28, 29, 33), outline=(62, 66, 76), width=3)
    draw_box.rounded_rectangle([14, 14, box_w - 14, box_h - 14], radius=24, fill=(18, 19, 22), outline=(35, 37, 42), width=2)

    scr_x0 = (box_w - WIDTH) // 2
    scr_y0 = (box_h - HEIGHT) // 2
    scr_x1 = scr_x0 + WIDTH
    scr_y1 = scr_y0 + HEIGHT

    glass_pad = 12
    draw_box.rounded_rectangle(
        [scr_x0 - glass_pad, scr_y0 - glass_pad, scr_x1 + glass_pad, scr_y1 + glass_pad],
        radius=14,
        fill=(5, 5, 7),
        outline=(22, 23, 26),
        width=2,
    )

    box_img.paste(screen_img, (scr_x0, scr_y0))

    draw_box.text((scr_x0 + 4, scr_y0 - 28), "WAVESHARE ESP32-S3-Touch-LCD-4.3B-BOX (SKU: 28141)", font=font_small, fill=(148, 163, 184))
    draw_box.text((scr_x1 - 4, scr_y0 - 28), "4.3\" IPS 800x480 | 550 cd/m² | RGB565 65K", font=font_tiny, fill=(148, 163, 184), anchor="ra")
    draw_box.text((scr_x0 + 4, scr_y1 + 14), "GT911 CAPACITIVE TOUCH • PARALLEL RGB ST7262 • ISOLATED CAN 500k", font=font_tiny, fill=(100, 116, 139))
    draw_box.text((scr_x1 - 4, scr_y1 + 14), "LOW-BUS ACTUATOR INSPECTOR", font=font_small, fill=C_CYAN, anchor="ra")

    out_path = OUTPUT_DIR / f"{screen_name}_hardware_box.png"
    box_img.save(out_path)
    return out_path


def save_screen(img: Image.Image, screen_name: str):
    """Enforces strict 800x480 canvas bounds, applies RGB565 quantization, and generates both raw and enclosure views."""
    assert img.size == (WIDTH, HEIGHT), f"Invalid canvas size: {img.size}, expected ({WIDTH}, {HEIGHT})"
    quantized_img = quantize_to_rgb565(img)
    raw_path = OUTPUT_DIR / f"{screen_name}.png"
    quantized_img.save(raw_path)
    print(f"Saved (Raw 800x480): {raw_path}")
    box_path = render_waveshare_43b_enclosure(quantized_img, screen_name)
    print(f"Saved (Hardware Box): {box_path}")


def draw_nav_bar(draw: ImageDraw.ImageDraw, active_tab: int):
    draw.rectangle([0, 0, WIDTH, 52], fill=C_NAV_BG, outline=C_CARD_BORDER, width=1)
    tabs = ["0. BUS & SAFETY", "1. STEER (SES)", "2. BRAKE (SEB)", "3. DRIVE (MTR)"]
    tab_w = 186
    for i, title in enumerate(tabs):
        x0 = 8 + i * (tab_w + 10)
        x1 = x0 + tab_w
        is_active = (i == active_tab)
        bg = C_NAV_ACTIVE if is_active else C_NAV_BTN
        border = C_CYAN if is_active else C_CARD_BORDER
        text_color = C_CYAN if is_active else C_GRAY_TEXT

        draw.rounded_rectangle([x0, 4, x1, 48], radius=8, fill=bg, outline=border, width=2 if is_active else 1)
        draw.text((x0 + tab_w // 2, 26), title, font=font_bold, fill=text_color, anchor="mm")


def render_screen0_general():
    img = Image.new("RGB", (WIDTH, HEIGHT), C_BG)
    draw = ImageDraw.Draw(img)
    draw_nav_bar(draw, active_tab=0)

    # 1. E-Stop & Master Interlock Card (Height 76px)
    draw.rounded_rectangle([8, 56, 792, 132], radius=8, fill=(6, 40, 24), outline=C_EMERALD, width=2)
    draw.text((400, 84), "[ OK ] E-STOP DISENGAGED • SYSTEM CLEAR", font=font_large, fill=(52, 211, 153), anchor="mm")
    draw.text((400, 112), "LOW-BUS LOOP MASTER ACTIVE (500 kbps)  •  INTERLOCK PIN: HIGH", font=font_bold, fill=(167, 243, 208), anchor="mm")

    # 2. 5-Node Watchdog Array (Height 114px)
    draw.rounded_rectangle([8, 138, 792, 252], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((20, 154), "LOW-BUS ACTUATORS & GATEWAY LIVENESS (250ms FAIL-CLOSED WATCHDOG)", font=font_small, fill=C_GRAY_TEXT)

    nodes = [
        ("SYS (0x011)", "10 Hz [OK]"),
        ("RT (0x210)", "100 Hz [OK]"),
        ("MTR (0x206)", "50 Hz [OK]"),
        ("SES (0x201)", "100 Hz [OK]"),
        ("SEB (0x721)", "100 Hz [OK]"),
    ]
    card_w = 146
    for i, (name, rate) in enumerate(nodes):
        x0 = 18 + i * (card_w + 9)
        x1 = x0 + card_w
        draw.rounded_rectangle([x0, 172, x1, 240], radius=6, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
        draw.text((x0 + card_w // 2, 192), name, font=font_bold, fill=C_WHITE, anchor="mm")
        draw.text((x0 + card_w // 2, 222), rate, font=font_bold, fill=C_EMERALD, anchor="mm")

    # 3. Bottom Tri-Metric Health Deck (Height 214px, 3 spacious columns)
    draw.rounded_rectangle([8, 258, 792, 472], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    stats = [
        ("12V SYSTEM BUS", "13.8 V", "[ BATTERY HEALTHY ]", C_WHITE, C_EMERALD),
        ("CAN BUS HEALTH", "420 msg/s", "[ 0 ERRORS • BUS OK ]", C_CYAN, C_EMERALD),
        ("FLIGHT RECORDER", "LOGGING", "[ RAW_CAN_01.LOG ]", C_EMERALD, C_CYAN),
    ]
    col_w = 248
    for i, (label, val, sub, v_col, s_col) in enumerate(stats):
        x0 = 18 + i * (col_w + 12)
        x1 = x0 + col_w
        cx = (x0 + x1) // 2
        draw.rounded_rectangle([x0, 268, x1, 462], radius=6, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
        draw.text((cx, 296), label, font=font_small, fill=C_GRAY_TEXT, anchor="mm")
        draw.text((cx, 362), val, font=font_hero, fill=v_col, anchor="mm")
        draw.text((cx, 434), sub, font=font_bold, fill=s_col, anchor="mm")

    save_screen(img, "screen0_general_bus")


def render_screen1_steer_digits():
    img = Image.new("RGB", (WIDTH, HEIGHT), C_BG)
    draw = ImageDraw.Draw(img)
    draw_nav_bar(draw, active_tab=1)

    card_w = 254
    # Card 1: Command (VCU 0x169)
    draw.rounded_rectangle([8, 58, 8 + card_w, 406], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((8 + card_w // 2, 82), "COMMAND (VCU 0x169)", font=font_small, fill=C_GRAY_TEXT, anchor="mm")
    draw.text((8 + card_w // 2, 175), "+15.0°", font=font_hero, fill=C_CYAN, anchor="mm")
    draw.rounded_rectangle([20, 245, 8 + card_w - 12, 295], radius=6, fill=(18, 26, 36), outline=(30, 58, 80), width=1)
    draw.text((8 + card_w // 2, 270), "TARGET SPEED: 200 °/s", font=font_bold, fill=C_WHITE, anchor="mm")
    draw.text((8 + card_w // 2, 335), "[ OK ] CLOSED-LOOP", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((8 + card_w // 2, 375), "[ OK ] CLUSTER SYNC", font=font_small, fill=C_GRAY_SUB, anchor="mm")

    # Card 2: Feedback (SES 0x201)
    draw.rounded_rectangle([272, 58, 272 + card_w, 406], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((272 + card_w // 2, 82), "ACTUATION (SES 0x201)", font=font_small, fill=C_GRAY_TEXT, anchor="mm")
    draw.text((272 + card_w // 2, 175), "+14.7°", font=font_hero, fill=C_EMERALD, anchor="mm")
    draw.rounded_rectangle([284, 245, 272 + card_w - 12, 295], radius=6, fill=(12, 34, 24), outline=(21, 80, 50), width=1)
    draw.text((272 + card_w // 2, 270), "ACTUAL SPEED: 198 °/s", font=font_bold, fill=C_WHITE, anchor="mm")
    draw.text((272 + card_w // 2, 335), "[ OK ] ANGLE TRACKING", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((272 + card_w // 2, 375), "[ OK ] SES ALIGNED", font=font_small, fill=C_GRAY_SUB, anchor="mm")

    # Card 3: Tracking Error & Driver Torque
    draw.rounded_rectangle([536, 58, 536 + card_w, 406], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.rounded_rectangle([550, 68, 536 + card_w - 14, 142], radius=6, fill=(6, 78, 59), outline=C_EMERALD, width=2)
    draw.text((536 + card_w // 2, 92), "Δ: 0.3°", font=font_badge, fill=(52, 211, 153), anchor="mm")
    draw.text((536 + card_w // 2, 122), "[ TRACKING OK ]", font=font_bold, fill=(167, 243, 208), anchor="mm")

    draw.rounded_rectangle([550, 150, 536 + card_w - 14, 280], radius=6, fill=(35, 24, 6), outline=C_AMBER, width=1)
    draw.text((536 + card_w // 2, 172), "DRIVER COLUMN TORQUE", font=font_small, fill=C_AMBER, anchor="mm")
    draw.text((536 + card_w // 2, 215), "+0.2 Nm", font=font_hero, fill=C_AMBER, anchor="mm")
    draw.text((536 + card_w // 2, 258), "[ NO OVERRIDE ]", font=font_bold, fill=C_EMERALD, anchor="mm")

    draw.text((536 + card_w // 2, 325), "[ OK ] SES HEALTHY", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((536 + card_w // 2, 365), "Motor: 8.4A  •  Temp: 34°C", font=font_small, fill=C_WHITE, anchor="mm")

    # Bottom Full-Width Scope Action Button (Height 58px)
    draw.rounded_rectangle([8, 414, 792, 472], radius=8, fill=(15, 41, 55), outline=C_CYAN, width=2)
    draw.text((400, 443), "VIEW 15-SECOND STEERING SCOPE PLOT  (OR SWIPE DOWN)  >", font=font_bold, fill=C_CYAN, anchor="mm")

    save_screen(img, "screen1_steer_digits")


def render_screen1_steer_plot():
    img = Image.new("RGB", (WIDTH, HEIGHT), C_BG)
    draw = ImageDraw.Draw(img)

    # Top Header
    draw.rounded_rectangle([8, 6, 792, 54], radius=6, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((18, 30), "STEER (SES)", font=font_med, fill=C_WHITE, anchor="lm")
    draw.text((205, 30), "CMD: +15.0°", font=font_bold, fill=C_CYAN, anchor="mm")
    draw.text((345, 30), "ACT: +14.7°", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((465, 30), "Δ: 0.3° [OK]", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((585, 30), "TORQ: +0.2 Nm", font=font_bold, fill=C_AMBER, anchor="mm")

    draw.rounded_rectangle([686, 12, 782, 48], radius=6, fill=C_NAV_BTN, outline=C_CARD_BORDER, width=1)
    draw.text((734, 30), "< NUMERICS", font=font_bold, fill=C_GRAY_TEXT, anchor="mm")

    # Chart Area
    c_x0, c_y0, c_x1, c_y1 = 8, 60, 792, 410
    draw.rounded_rectangle([c_x0, c_y0, c_x1, c_y1], radius=8, fill=(8, 8, 8), outline=C_CARD_BORDER, width=1)

    chart_w = c_x1 - c_x0
    chart_h = c_y1 - c_y0
    for s in range(16):
        gx = c_x0 + int(s * (chart_w / 15))
        draw.line([(gx, c_y0), (gx, c_y1)], fill=C_GRID, width=1)

    # Horizontal center zero line
    cy = c_y0 + chart_h // 2
    draw.line([(c_x0, cy), (c_x1, cy)], fill=(70, 70, 70), width=2)

    # Time ticks along bottom
    draw.text((c_x0 + 20, c_y1 - 16), "-15s", font=font_tiny, fill=C_GRAY_SUB)
    draw.text((c_x0 + chart_w // 3, c_y1 - 16), "-10s", font=font_tiny, fill=C_GRAY_SUB)
    draw.text((c_x0 + 2 * chart_w // 3, c_y1 - 16), "-5s", font=font_tiny, fill=C_GRAY_SUB)
    draw.text((c_x1 - 35, c_y1 - 16), "NOW", font=font_tiny, fill=C_GRAY_SUB)

    # +/- 20° lines
    y_p20 = cy - int((20 / 45) * (chart_h / 2))
    y_m20 = cy + int((20 / 45) * (chart_h / 2))
    draw.line([(c_x0, y_p20), (c_x1, y_p20)], fill=(40, 40, 40), width=1)
    draw.line([(c_x0, y_m20), (c_x1, y_m20)], fill=(40, 40, 40), width=1)

    # Synthetic realistic steering wave trace
    np.random.seed(42)
    cmd_trace = np.zeros(150)
    cmd_trace[10:50] = 12.0
    cmd_trace[50:90] = -15.0
    cmd_trace[90:130] = 20.0
    cmd_trace[130:] = 15.0

    act_trace = np.zeros(150)
    for i in range(1, 150):
        act_trace[i] = act_trace[i - 1] + (cmd_trace[i] - act_trace[i - 1]) * 0.28 + np.random.normal(0, 0.15)

    torq_trace = np.zeros(150)
    for i in range(1, 150):
        d_angle = act_trace[i] - act_trace[i - 1]
        torq_trace[i] = 0.45 * d_angle + 0.04 * act_trace[i] + np.random.normal(0, 0.06)

    def to_canvas(idx, deg):
        px = c_x0 + int(idx * (chart_w / 149))
        py = cy - int((deg / 45.0) * (chart_h / 2 - 10))
        return (px, max(c_y0 + 5, min(c_y1 - 5, py)))

    def to_canvas_torq(idx, nm):
        px = c_x0 + int(idx * (chart_w / 149))
        py = cy - int((nm / 4.5) * (chart_h / 2 - 10))
        return (px, max(c_y0 + 5, min(c_y1 - 5, py)))

    # Draw Command (Cyan, width 3)
    cmd_pts = [to_canvas(i, cmd_trace[i]) for i in range(150)]
    draw.line(cmd_pts, fill=C_CYAN, width=3)

    # Draw Feedback (Emerald, width 2)
    act_pts = [to_canvas(i, act_trace[i]) for i in range(150)]
    draw.line(act_pts, fill=C_EMERALD, width=2)

    # Draw Driver Column Torque (Amber, width 2)
    torq_pts = [to_canvas_torq(i, torq_trace[i]) for i in range(150)]
    draw.line(torq_pts, fill=C_AMBER, width=2)

    # Non-occluded Y-Axis labels with dark plate
    def draw_y_label(x, y, text, color, anchor="la"):
        bbox = draw.textbbox((x, y), text, font=font_small, anchor=anchor)
        draw.rectangle([bbox[0] - 2, bbox[1] - 2, bbox[2] + 2, bbox[3] + 2], fill=(0, 0, 0))
        draw.text((x, y), text, font=font_small, fill=color, anchor=anchor)

    draw_y_label(c_x0 + 10, cy - 10, "0.0°", C_WHITE)
    draw_y_label(c_x0 + 10, y_p20 - 10, "+20°", C_GRAY_TEXT)
    draw_y_label(c_x0 + 10, y_m20 - 10, "-20°", C_GRAY_TEXT)

    draw_y_label(c_x1 - 10, cy - 10, "0.0 Nm", C_AMBER, anchor="ra")
    draw_y_label(c_x1 - 10, y_p20 - 10, "+2.0 Nm", C_AMBER, anchor="ra")
    draw_y_label(c_x1 - 10, y_m20 - 10, "-2.0 Nm", C_AMBER, anchor="ra")
    draw_y_label(c_x1 - 10, c_y0 + 10, "+4.5 Nm", C_AMBER, anchor="ra")

    # Bottom Controls Bar (52px tall)
    draw.rounded_rectangle([8, 414, 792, 472], radius=6, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((20, 443), "±45° [CYN/EMR]  |  Torq: ±4.5Nm [AMB]  |  15s (10Hz)", font=font_small, fill=C_GRAY_TEXT, anchor="lm")

    draw.rounded_rectangle([415, 418, 595, 468], radius=6, fill=C_NAV_ACTIVE, outline=C_CYAN, width=1)
    draw.text((505, 443), "||  PAUSE / FREEZE", font=font_bold, fill=C_CYAN, anchor="mm")

    draw.rounded_rectangle([605, 418, 785, 468], radius=6, fill=C_NAV_BTN, outline=C_CARD_BORDER, width=1)
    draw.text((695, 443), "BRAKE PLOT >", font=font_bold, fill=C_WHITE, anchor="mm")

    save_screen(img, "screen1_steer_plot")


def render_screen2_brake_digits():
    img = Image.new("RGB", (WIDTH, HEIGHT), C_BG)
    draw = ImageDraw.Draw(img)
    draw_nav_bar(draw, active_tab=2)

    card_w = 254
    # Card 1: Command (VCU 0x7B9)
    draw.rounded_rectangle([8, 58, 8 + card_w, 406], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((8 + card_w // 2, 82), "COMMAND (VCU 0x7B9)", font=font_small, fill=C_GRAY_TEXT, anchor="mm")
    draw.text((8 + card_w // 2, 155), "450", font=font_hero, fill=C_CYAN, anchor="mm")
    draw.text((8 + card_w // 2, 198), "kPa", font=font_med, fill=C_CYAN, anchor="mm")
    draw.rounded_rectangle([20, 245, 8 + card_w - 12, 295], radius=6, fill=(18, 26, 36), outline=(30, 58, 80), width=1)
    draw.text((8 + card_w // 2, 270), "TARGET STROKE: 18.0 mm", font=font_bold, fill=C_WHITE, anchor="mm")
    draw.text((8 + card_w // 2, 335), "[ OK ] BRAKE ARMED", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((8 + card_w // 2, 375), "[ OK ] PRESSURE SYNC", font=font_small, fill=C_GRAY_SUB, anchor="mm")

    # Card 2: Feedback (SEB 0x721)
    draw.rounded_rectangle([272, 58, 272 + card_w, 406], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((272 + card_w // 2, 82), "ACTUATION (SEB 0x721)", font=font_small, fill=C_GRAY_TEXT, anchor="mm")
    draw.text((272 + card_w // 2, 155), "442", font=font_hero, fill=C_EMERALD, anchor="mm")
    draw.text((272 + card_w // 2, 198), "kPa", font=font_med, fill=C_EMERALD, anchor="mm")
    draw.rounded_rectangle([284, 245, 272 + card_w - 12, 295], radius=6, fill=(12, 34, 24), outline=(21, 80, 50), width=1)
    draw.text((272 + card_w // 2, 270), "ACTUAL STROKE: 17.8 mm", font=font_bold, fill=C_WHITE, anchor="mm")
    draw.text((272 + card_w // 2, 335), "[ OK ] PRESSURE SERVO", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((272 + card_w // 2, 375), "[ OK ] SEB ARMED", font=font_small, fill=C_GRAY_SUB, anchor="mm")

    # Card 3: Tracking Error & Diagnostics
    draw.rounded_rectangle([536, 58, 536 + card_w, 406], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.rounded_rectangle([550, 68, 536 + card_w - 14, 142], radius=6, fill=(6, 78, 59), outline=C_EMERALD, width=2)
    draw.text((536 + card_w // 2, 92), "Δ: -8 kPa", font=font_badge, fill=(52, 211, 153), anchor="mm")
    draw.text((536 + card_w // 2, 122), "[ TRACKING OK ]", font=font_bold, fill=(167, 243, 208), anchor="mm")

    draw.rounded_rectangle([550, 150, 536 + card_w - 14, 280], radius=6, fill=(15, 23, 42), outline=(56, 189, 248), width=1)
    draw.text((536 + card_w // 2, 172), "PISTON DISPLACEMENT", font=font_small, fill=C_CYAN, anchor="mm")
    draw.text((536 + card_w // 2, 215), "17.8 mm", font=font_hero, fill=C_WHITE, anchor="mm")
    draw.text((536 + card_w // 2, 258), "[ STROKE Δ: 0.2 mm OK ]", font=font_bold, fill=C_EMERALD, anchor="mm")

    draw.text((536 + card_w // 2, 325), "[ OK ] SEB HEALTHY", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((536 + card_w // 2, 365), "Motor: 4.2A  •  Temp: 38°C", font=font_small, fill=C_WHITE, anchor="mm")

    # Bottom Full-Width Scope Action Button (Height 58px)
    draw.rounded_rectangle([8, 414, 792, 472], radius=8, fill=(15, 41, 55), outline=C_CYAN, width=2)
    draw.text((400, 443), "VIEW 15-SECOND BRAKE PRESSURE SCOPE  (OR SWIPE DOWN)  >", font=font_bold, fill=C_CYAN, anchor="mm")

    save_screen(img, "screen2_brake_digits")


def render_screen2_brake_plot():
    img = Image.new("RGB", (WIDTH, HEIGHT), C_BG)
    draw = ImageDraw.Draw(img)

    # Top Header
    draw.rounded_rectangle([8, 6, 792, 54], radius=6, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((18, 30), "BRAKE (SEB)", font=font_med, fill=C_WHITE, anchor="lm")
    draw.text((205, 30), "CMD: 450 kPa", font=font_bold, fill=C_CYAN, anchor="mm")
    draw.text((345, 30), "ACT: 442 kPa", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((465, 30), "Δ: -8 kPa [OK]", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((585, 30), "STRK: 17.8mm", font=font_bold, fill=C_WHITE, anchor="mm")

    draw.rounded_rectangle([686, 12, 782, 48], radius=6, fill=C_NAV_BTN, outline=C_CARD_BORDER, width=1)
    draw.text((734, 30), "< NUMERICS", font=font_bold, fill=C_GRAY_TEXT, anchor="mm")

    # Chart Area
    c_x0, c_y0, c_x1, c_y1 = 8, 60, 792, 410
    draw.rounded_rectangle([c_x0, c_y0, c_x1, c_y1], radius=8, fill=(8, 8, 8), outline=C_CARD_BORDER, width=1)

    chart_w = c_x1 - c_x0
    chart_h = c_y1 - c_y0
    for s in range(16):
        gx = c_x0 + int(s * (chart_w / 15))
        draw.line([(gx, c_y0), (gx, c_y1)], fill=C_GRID, width=1)

    # Time ticks along bottom (y = c_y1 - 13)
    draw.text((c_x0 + 20, c_y1 - 13), "-15s", font=font_tiny, fill=C_GRAY_SUB)
    draw.text((c_x0 + chart_w // 3, c_y1 - 13), "-10s", font=font_tiny, fill=C_GRAY_SUB)
    draw.text((c_x0 + 2 * chart_w // 3, c_y1 - 13), "-5s", font=font_tiny, fill=C_GRAY_SUB)
    draw.text((c_x1 - 35, c_y1 - 13), "NOW", font=font_tiny, fill=C_GRAY_SUB)

    # Synthetic realistic brake pressure trace
    np.random.seed(101)
    cmd_trace = np.zeros(150)
    cmd_trace[20:65] = 600.0
    cmd_trace[85:120] = 1200.0
    cmd_trace[135:] = 450.0

    act_trace = np.zeros(150)
    for i in range(1, 150):
        act_trace[i] = act_trace[i - 1] + (cmd_trace[i] - act_trace[i - 1]) * 0.32 + np.random.normal(0, 4.0)
        if act_trace[i] < 0:
            act_trace[i] = 0

    def to_canvas_brake(idx, kpa):
        px = c_x0 + int(idx * (chart_w / 149))
        py = (c_y1 - 26) - int((kpa / 1500.0) * (chart_h - 52))
        return (px, max(c_y0 + 5, min(c_y1 - 5, py)))

    cmd_pts = [to_canvas_brake(i, cmd_trace[i]) for i in range(150)]
    draw.line(cmd_pts, fill=C_CYAN, width=3)

    act_pts = [to_canvas_brake(i, act_trace[i]) for i in range(150)]
    draw.line(act_pts, fill=C_EMERALD, width=2)

    # Y-scale lines with protective background plates
    for kpa in [0, 500, 1000, 1500]:
        py = (c_y1 - 26) - int((kpa / 1500.0) * (chart_h - 52))
        draw.line([(c_x0, py), (c_x1, py)], fill=(40, 40, 40) if kpa > 0 else (70, 70, 70), width=1 if kpa > 0 else 2)
        bbox = draw.textbbox((c_x0 + 10, py - 10), f"{kpa} kPa", font=font_small)
        draw.rectangle([bbox[0] - 2, bbox[1] - 2, bbox[2] + 2, bbox[3] + 2], fill=(0, 0, 0))
        draw.text((c_x0 + 10, py - 10), f"{kpa} kPa", font=font_small, fill=C_WHITE if kpa == 0 else C_GRAY_TEXT)

    # Bottom Controls Bar (52px tall)
    draw.rounded_rectangle([8, 414, 792, 472], radius=6, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((20, 443), "Scale: 0 .. 1500 kPa (Line Pressure) | 15s Window", font=font_small, fill=C_GRAY_TEXT, anchor="lm")

    draw.rounded_rectangle([415, 418, 595, 468], radius=6, fill=C_NAV_ACTIVE, outline=C_CYAN, width=1)
    draw.text((505, 443), "||  PAUSE / FREEZE", font=font_bold, fill=C_CYAN, anchor="mm")

    draw.rounded_rectangle([605, 418, 785, 468], radius=6, fill=C_NAV_BTN, outline=C_CARD_BORDER, width=1)
    draw.text((695, 443), "DRIVE PLOT >", font=font_bold, fill=C_WHITE, anchor="mm")

    save_screen(img, "screen2_brake_plot")


def render_screen3_drive_digits():
    img = Image.new("RGB", (WIDTH, HEIGHT), C_BG)
    draw = ImageDraw.Draw(img)
    draw_nav_bar(draw, active_tab=3)

    card_w = 254
    # Card 1: Command (VCU 0x204)
    draw.rounded_rectangle([8, 58, 8 + card_w, 406], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((8 + card_w // 2, 82), "COMMAND (VCU 0x204)", font=font_small, fill=C_GRAY_TEXT, anchor="mm")
    draw.text((8 + card_w // 2, 155), "15.0", font=font_hero, fill=C_CYAN, anchor="mm")
    draw.text((8 + card_w // 2, 198), "km/h", font=font_med, fill=C_CYAN, anchor="mm")
    draw.rounded_rectangle([20, 245, 8 + card_w - 12, 295], radius=6, fill=(18, 26, 36), outline=(30, 58, 80), width=1)
    draw.text((8 + card_w // 2, 270), "TARGET: [ D ] (DRIVE)", font=font_bold, fill=C_WHITE, anchor="mm")
    draw.text((8 + card_w // 2, 335), "[ OK ] DRIVE REQ VALID", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((8 + card_w // 2, 375), "[ OK ] SLEW ACTIVE", font=font_small, fill=C_GRAY_SUB, anchor="mm")

    # Card 2: Feedback (MTR 0x206)
    draw.rounded_rectangle([272, 58, 272 + card_w, 406], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((272 + card_w // 2, 82), "ACTUATION (MTR 0x206)", font=font_small, fill=C_GRAY_TEXT, anchor="mm")
    draw.text((272 + card_w // 2, 155), "14.8", font=font_hero, fill=C_EMERALD, anchor="mm")
    draw.text((272 + card_w // 2, 198), "km/h", font=font_med, fill=C_EMERALD, anchor="mm")
    draw.rounded_rectangle([284, 245, 272 + card_w - 12, 295], radius=6, fill=(12, 34, 24), outline=(21, 80, 50), width=1)
    draw.text((272 + card_w // 2, 270), "ACTUAL: [ D ] (ENGAGED)", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((272 + card_w // 2, 335), "MOTOR: 1,620 RPM", font=font_bold, fill=C_WHITE, anchor="mm")
    draw.text((272 + card_w // 2, 375), "[ OK ] PROPULSION OK", font=font_small, fill=C_GRAY_SUB, anchor="mm")

    # Card 3: Delta & Safety Interlocks
    draw.rounded_rectangle([536, 58, 536 + card_w, 406], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.rounded_rectangle([550, 68, 536 + card_w - 14, 142], radius=6, fill=(6, 78, 59), outline=C_EMERALD, width=2)
    draw.text((536 + card_w // 2, 92), "Δ: 0.2 km/h", font=font_badge, fill=(52, 211, 153), anchor="mm")
    draw.text((536 + card_w // 2, 122), "[ TRACKING OK ]", font=font_bold, fill=(167, 243, 208), anchor="mm")

    draw.rounded_rectangle([550, 150, 536 + card_w - 14, 280], radius=6, fill=(6, 40, 24), outline=C_EMERALD, width=1)
    draw.text((536 + card_w // 2, 172), "SAFETY INTERLOCKS", font=font_small, fill=C_EMERALD, anchor="mm")
    draw.text((536 + card_w // 2, 215), "ALL CLEAR", font=font_large, fill=(52, 211, 153), anchor="mm")
    draw.text((536 + card_w // 2, 258), "[ BRAKE PRIORITY OK ]", font=font_bold, fill=C_EMERALD, anchor="mm")

    draw.text((536 + card_w // 2, 325), "[ OK ] MTR ACTIVE", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((536 + card_w // 2, 365), "Drive Output: ENABLED", font=font_small, fill=C_WHITE, anchor="mm")

    # Bottom Full-Width Scope Action Button (Height 58px)
    draw.rounded_rectangle([8, 414, 792, 472], radius=8, fill=(15, 41, 55), outline=C_CYAN, width=2)
    draw.text((400, 443), "VIEW 15-SECOND DRIVE SPEED SCOPE  (OR SWIPE DOWN)  >", font=font_bold, fill=C_CYAN, anchor="mm")

    save_screen(img, "screen3_drive_digits")


def render_screen3_drive_plot():
    img = Image.new("RGB", (WIDTH, HEIGHT), C_BG)
    draw = ImageDraw.Draw(img)

    # Top Header
    draw.rounded_rectangle([8, 6, 792, 54], radius=6, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((18, 30), "DRIVE (MTR)", font=font_med, fill=C_WHITE, anchor="lm")
    draw.text((205, 30), "CMD: 15.0 km/h", font=font_bold, fill=C_CYAN, anchor="mm")
    draw.text((350, 30), "ACT: 14.8 km/h", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((490, 30), "Δ: 0.2 km/h [OK]", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((615, 30), "MTR: 1620 RPM", font=font_bold, fill=C_WHITE, anchor="mm")

    draw.rounded_rectangle([686, 12, 782, 48], radius=6, fill=C_NAV_BTN, outline=C_CARD_BORDER, width=1)
    draw.text((734, 30), "< NUMERICS", font=font_bold, fill=C_GRAY_TEXT, anchor="mm")

    # Chart Area
    c_x0, c_y0, c_x1, c_y1 = 8, 60, 792, 410
    draw.rounded_rectangle([c_x0, c_y0, c_x1, c_y1], radius=8, fill=(8, 8, 8), outline=C_CARD_BORDER, width=1)

    chart_w = c_x1 - c_x0
    chart_h = c_y1 - c_y0
    for s in range(16):
        gx = c_x0 + int(s * (chart_w / 15))
        draw.line([(gx, c_y0), (gx, c_y1)], fill=C_GRID, width=1)

    # Time ticks along bottom (y = c_y1 - 13)
    draw.text((c_x0 + 20, c_y1 - 13), "-15s", font=font_tiny, fill=C_GRAY_SUB)
    draw.text((c_x0 + chart_w // 3, c_y1 - 13), "-10s", font=font_tiny, fill=C_GRAY_SUB)
    draw.text((c_x0 + 2 * chart_w // 3, c_y1 - 13), "-5s", font=font_tiny, fill=C_GRAY_SUB)
    draw.text((c_x1 - 35, c_y1 - 13), "NOW", font=font_tiny, fill=C_GRAY_SUB)

    # Synthetic realistic drive speed trace
    np.random.seed(202)
    cmd_trace = np.zeros(150)
    cmd_trace[15:60] = 10.0
    cmd_trace[60:110] = 22.0
    cmd_trace[110:] = 15.0

    act_trace = np.zeros(150)
    for i in range(1, 150):
        act_trace[i] = act_trace[i - 1] + (cmd_trace[i] - act_trace[i - 1]) * 0.16 + np.random.normal(0, 0.18)
        if act_trace[i] < 0:
            act_trace[i] = 0

    def to_canvas_drive(idx, kmh):
        px = c_x0 + int(idx * (chart_w / 149))
        py = (c_y1 - 26) - int((kmh / 30.0) * (chart_h - 52))
        return (px, max(c_y0 + 5, min(c_y1 - 5, py)))

    cmd_pts = [to_canvas_drive(i, cmd_trace[i]) for i in range(150)]
    draw.line(cmd_pts, fill=C_CYAN, width=3)

    act_pts = [to_canvas_drive(i, act_trace[i]) for i in range(150)]
    draw.line(act_pts, fill=C_EMERALD, width=2)

    # Y-scale lines with protective plates
    for spd in [0, 10, 20, 30]:
        py = (c_y1 - 26) - int((spd / 30.0) * (chart_h - 52))
        draw.line([(c_x0, py), (c_x1, py)], fill=(40, 40, 40) if spd > 0 else (70, 70, 70), width=1 if spd > 0 else 2)
        bbox = draw.textbbox((c_x0 + 10, py - 10), f"{spd} km/h", font=font_small)
        draw.rectangle([bbox[0] - 2, bbox[1] - 2, bbox[2] + 2, bbox[3] + 2], fill=(0, 0, 0))
        draw.text((c_x0 + 10, py - 10), f"{spd} km/h", font=font_small, fill=C_WHITE if spd == 0 else C_GRAY_TEXT)

    # Bottom Controls Bar (52px tall)
    draw.rounded_rectangle([8, 414, 792, 472], radius=6, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((20, 443), "Scale: 0.0 .. 30.0 km/h | 15s Window", font=font_small, fill=C_GRAY_TEXT, anchor="lm")

    draw.rounded_rectangle([415, 418, 595, 468], radius=6, fill=C_NAV_ACTIVE, outline=C_CYAN, width=1)
    draw.text((505, 443), "||  PAUSE / FREEZE", font=font_bold, fill=C_CYAN, anchor="mm")

    draw.rounded_rectangle([605, 418, 785, 468], radius=6, fill=C_NAV_BTN, outline=C_CARD_BORDER, width=1)
    draw.text((695, 443), "STEER PLOT >", font=font_bold, fill=C_WHITE, anchor="mm")

    save_screen(img, "screen3_drive_plot")


def main():
    print("Generating simulated 800x480 screenshots...")
    render_screen0_general()
    render_screen1_steer_digits()
    render_screen1_steer_plot()
    render_screen2_brake_digits()
    render_screen2_brake_plot()
    render_screen3_drive_digits()
    render_screen3_drive_plot()
    print("All screenshots generated successfully.")


if __name__ == "__main__":
    main()
