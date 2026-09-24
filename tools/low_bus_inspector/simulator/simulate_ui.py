"""800x480 Pixel-Perfect Low-Bus Inspector UI Simulator and Screenshot Generator.

Renders high-contrast, authentic 800x480 displays matching the exact LVGL
layout, fonts, colors, and 15-second rolling waveform plots.
"""

from __future__ import annotations

import math
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import matplotlib.pyplot as plt
import numpy as np

OUTPUT_DIR = Path(__file__).parent / "screenshots"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

WIDTH = 800
HEIGHT = 480

# Colors
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
C_GRAY_SUB = (85, 85, 85)
C_GRID = (24, 24, 24)

# Load fonts - strictly sized for 4.3" 800x480 automotive display (no microscopic fonts!)
try:
    font_hero = ImageFont.truetype("arialbd.ttf", 52)
    font_large = ImageFont.truetype("arialbd.ttf", 26)
    font_badge = ImageFont.truetype("arialbd.ttf", 22)
    font_med = ImageFont.truetype("arialbd.ttf", 18)
    font_bold = ImageFont.truetype("arialbd.ttf", 15)
    font_small = ImageFont.truetype("arialbd.ttf", 14)
    font_tiny = ImageFont.truetype("arialbd.ttf", 13)
except Exception:
    font_hero = font_large = font_badge = font_med = font_bold = font_small = font_tiny = ImageFont.load_default()


def quantize_to_rgb565(img: Image.Image) -> Image.Image:
    """Quantizes 24-bit RGB888 image to true hardware 16-bit RGB565 (65,536 colors).

    This strictly emulates the physical ST7262 Parallel RGB interface of the
    Waveshare ESP32-S3-Touch-LCD-4.3B-BOX:
      - Red:   5 bits (32 levels: 0..31)
      - Green: 6 bits (64 levels: 0..63)
      - Blue:  5 bits (32 levels: 0..31)
    """
    arr = np.array(img, dtype=np.uint16)
    r5 = (arr[:, :, 0] >> 3).astype(np.uint16)
    g6 = (arr[:, :, 1] >> 2).astype(np.uint16)
    b5 = (arr[:, :, 2] >> 3).astype(np.uint16)

    # Reconstitute to RGB888 representation for authentic display on PC
    r8 = ((r5 * 255 + 15) // 31).astype(np.uint8)
    g8 = ((g6 * 255 + 31) // 63).astype(np.uint8)
    b8 = ((b5 * 255 + 15) // 31).astype(np.uint8)
    return Image.fromarray(np.stack([r8, g8, b8], axis=-1))


def render_waveshare_43b_enclosure(screen_img: Image.Image, screen_name: str) -> Path:
    """Renders the 800x480 screen inside the physical Waveshare 4.3B-BOX enclosure (SKU 28141).

    Hardware Display Specifications:
    - Screen Size: 4.3 inch IPS LCD
    - Resolution: 800 x 480 pixels (Aspect Ratio: 5:3)
    - Active Display Area: 95.04 mm x 53.86 mm
    - Outer Case Dimensions: 116.3 mm x 79.0 mm
    - Brightness: 550 cd/m2 High-Brightness Daylight IPS
    - Front Panel: Tempered Glass with Black Bezel & Anti-Glare Coating
    - Touch: 5-Point Multi-touch Capacitive GT911
    """
    # Scaling factor: 800 px / 95.04 mm = 8.417 px/mm
    box_w = int(116.3 * 8.417)  # ~978 px
    box_h = int(79.0 * 8.912)   # ~704 px

    box_img = Image.new("RGB", (box_w, box_h), (18, 18, 20))
    b_draw = ImageDraw.Draw(box_img)

    # Outer industrial chassis with rounded corners & chamfer
    b_draw.rounded_rectangle([0, 0, box_w - 1, box_h - 1], radius=24, fill=(28, 29, 33), outline=(65, 68, 75), width=3)
    b_draw.rounded_rectangle([5, 5, box_w - 6, box_h - 6], radius=20, fill=(16, 17, 19), outline=(42, 44, 48), width=2)

    # Tempered glass panel with bezel
    glass_x0 = 30
    glass_y0 = 36
    glass_x1 = box_w - 30
    glass_y1 = box_h - 36
    b_draw.rounded_rectangle([glass_x0, glass_y0, glass_x1, glass_y1], radius=16, fill=(5, 5, 7), outline=(22, 23, 26), width=2)

    # Center the active 800x480 LCD inside the glass
    lcd_x0 = (box_w - WIDTH) // 2
    lcd_y0 = (box_h - HEIGHT) // 2
    box_img.paste(screen_img, (lcd_x0, lcd_y0))

    # LCD physical active border
    b_draw.rectangle([lcd_x0 - 1, lcd_y0 - 1, lcd_x0 + WIDTH, lcd_y0 + HEIGHT], outline=(35, 37, 42), width=1)

    # Subtle tempered glass top-edge optical reflection line
    b_draw.line([(glass_x0 + 20, glass_y0 + 4), (glass_x1 - 20, glass_y0 + 4)], fill=(45, 48, 55), width=1)

    # Branding & Hardware Spec Labels
    b_draw.text((lcd_x0 + 4, lcd_y0 - 18), "WAVESHARE ESP32-S3-Touch-LCD-4.3B-BOX (SKU: 28141)", font=font_bold, fill=(170, 175, 185), anchor="ls")
    b_draw.text((lcd_x0 + WIDTH - 4, lcd_y0 - 18), "4.3\" IPS 800x480 | 550 cd/m² | RGB565 65K", font=font_small, fill=(110, 115, 125), anchor="rs")

    b_draw.text((lcd_x0 + 4, lcd_y0 + HEIGHT + 22), "GT911 CAPACITIVE TOUCH • PARALLEL RGB ST7262 • ISOLATED CAN 500k", font=font_tiny, fill=(100, 105, 115), anchor="ls")
    b_draw.text((lcd_x0 + WIDTH - 4, lcd_y0 + HEIGHT + 22), "LOW-BUS ACTUATOR INSPECTOR", font=font_bold, fill=C_CYAN, anchor="rs")

    out_path = OUTPUT_DIR / f"{screen_name}_hardware_box.png"
    box_img.save(out_path)
    return out_path


def save_screen(img: Image.Image, screen_name: str):
    """Enforces strict 800x480 canvas bounds, applies RGB565 quantization, and generates both raw and enclosure views."""
    assert img.size == (WIDTH, HEIGHT), f"Invalid canvas size: {img.size}, expected ({WIDTH}, {HEIGHT})"

    # 1. Apply true 16-bit RGB565 hardware color quantization
    quantized_img = quantize_to_rgb565(img)

    # 2. Save the raw pixel-perfect 800x480 framebuffer
    raw_path = OUTPUT_DIR / f"{screen_name}.png"
    quantized_img.save(raw_path)
    print(f"Saved (Raw 800x480): {raw_path}")

    # 3. Render and save the physical Waveshare 4.3B-BOX enclosure mockup
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

        draw.rounded_rectangle([x0, 4, x1, 48], radius=6, fill=bg, outline=border, width=2 if is_active else 1)
        draw.text((x0 + tab_w // 2, 26), title, font=font_bold, fill=text_color, anchor="mm")


def render_screen0_general():
    img = Image.new("RGB", (WIDTH, HEIGHT), C_BG)
    draw = ImageDraw.Draw(img)
    draw_nav_bar(draw, active_tab=0)

    # 1. E-Stop & Master Interlock Card (Height 100px)
    draw.rounded_rectangle([8, 56, 792, 156], radius=8, fill=(6, 40, 24), outline=C_EMERALD, width=2)
    draw.text((400, 92), "● E-STOP DISENGAGED • SYSTEM ARMED", font=font_large, fill=(52, 211, 153), anchor="mm")
    draw.text((400, 128), "LOW-BUS LOOP MASTER ACTIVE (500 kbps)  •  INTERLOCK PIN: HIGH", font=font_bold, fill=(167, 243, 208), anchor="mm")

    # 2. 5-Node Watchdog Array (Height 114px)
    draw.rounded_rectangle([8, 164, 792, 280], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((20, 180), "LOW-BUS ACTUATORS & GATEWAY LIVENESS (250ms WATCHDOG)", font=font_small, fill=C_GRAY_TEXT)

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
        draw.rounded_rectangle([x0, 198, x1, 268], radius=6, fill=(5, 46, 22), outline=(21, 128, 61), width=1)
        draw.text((x0 + card_w // 2, 218), name, font=font_bold, fill=C_WHITE, anchor="mm")
        draw.text((x0 + card_w // 2, 248), rate, font=font_bold, fill=C_EMERALD, anchor="mm")

    # 3. Bottom Tri-Metric Health Deck (Height 184px, 3 spacious columns)
    draw.rounded_rectangle([8, 288, 792, 472], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    stats = [
        ("12V SYSTEM BUS", "12.6 V", "[ BATTERY HEALTHY ]", C_WHITE, C_EMERALD),
        ("CAN BUS HEALTH", "210 msg/s", "[ 0 ERRORS • BUS OK ]", C_CYAN, C_EMERALD),
        ("FLIGHT RECORDER", "RECORDING", "[ RAW_CAN_01.LOG ]", C_EMERALD, C_CYAN),
    ]
    col_w = 248
    for i, (label, val, sub, v_col, s_col) in enumerate(stats):
        x0 = 18 + i * (col_w + 12)
        x1 = x0 + col_w
        cx = (x0 + x1) // 2
        draw.rounded_rectangle([x0, 298, x1, 462], radius=6, fill=(13, 13, 13), outline=C_CARD_BORDER, width=1)
        draw.text((cx, 322), label, font=font_small, fill=C_GRAY_TEXT, anchor="mm")
        draw.text((cx, 376), val, font=font_hero if val != "RECORDING" else font_large, fill=v_col, anchor="mm")
        draw.text((cx, 434), sub, font=font_bold, fill=s_col, anchor="mm")

    save_screen(img, "screen0_general_bus")


def render_screen1_steer_digits():
    img = Image.new("RGB", (WIDTH, HEIGHT), C_BG)
    draw = ImageDraw.Draw(img)
    draw_nav_bar(draw, active_tab=1)

    # 3 Large Subsystem Cards (y: 58 to 406)
    card_w = 254
    # Card 1: Command (VCU 0x169)
    draw.rounded_rectangle([8, 58, 8 + card_w, 406], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((8 + card_w // 2, 82), "COMMAND (VCU 0x169)", font=font_small, fill=C_GRAY_TEXT, anchor="mm")
    draw.text((8 + card_w // 2, 175), "+15.0°", font=font_hero, fill=C_CYAN, anchor="mm")
    # Sub-metric pill
    draw.rounded_rectangle([20, 245, 8 + card_w - 12, 295], radius=6, fill=(18, 26, 36), outline=(30, 58, 80), width=1)
    draw.text((8 + card_w // 2, 270), "TARGET SPEED: 200 °/s", font=font_bold, fill=C_WHITE, anchor="mm")
    draw.text((8 + card_w // 2, 335), "Target Slew: 0.4s", font=font_med, fill=C_GRAY_TEXT, anchor="mm")
    draw.text((8 + card_w // 2, 375), "CAN 2.0B • 100 Hz", font=font_small, fill=C_GRAY_SUB, anchor="mm")

    # Card 2: Feedback (SES 0x201)
    draw.rounded_rectangle([272, 58, 272 + card_w, 406], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((272 + card_w // 2, 82), "ACTUATION (SES 0x201)", font=font_small, fill=C_GRAY_TEXT, anchor="mm")
    draw.text((272 + card_w // 2, 175), "+14.7°", font=font_hero, fill=C_EMERALD, anchor="mm")
    # Sub-metric pill
    draw.rounded_rectangle([284, 245, 272 + card_w - 12, 295], radius=6, fill=(12, 34, 24), outline=(21, 80, 50), width=1)
    draw.text((272 + card_w // 2, 270), "ACTUAL SPEED: 198 °/s", font=font_bold, fill=C_WHITE, anchor="mm")
    draw.text((272 + card_w // 2, 335), "CLOSED-LOOP ANGLE", font=font_med, fill=C_EMERALD, anchor="mm")
    draw.text((272 + card_w // 2, 375), "SES ALIGNED • READY", font=font_small, fill=C_GRAY_SUB, anchor="mm")

    # Card 3: Tracking Error & Driver Torque
    draw.rounded_rectangle([536, 58, 536 + card_w, 406], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    # Delta Badge (2-tier layout)
    draw.rounded_rectangle([550, 68, 536 + card_w - 14, 142], radius=6, fill=(6, 78, 59), outline=C_EMERALD, width=2)
    draw.text((536 + card_w // 2, 92), "Δ: 0.3°", font=font_badge, fill=(52, 211, 153), anchor="mm")
    draw.text((536 + card_w // 2, 122), "[ TRACKING OK ]", font=font_bold, fill=(167, 243, 208), anchor="mm")

    # Driver Column Torque Box
    draw.rounded_rectangle([550, 150, 536 + card_w - 14, 280], radius=6, fill=(35, 24, 6), outline=C_AMBER, width=1)
    draw.text((536 + card_w // 2, 172), "DRIVER COLUMN TORQUE", font=font_small, fill=C_AMBER, anchor="mm")
    draw.text((536 + card_w // 2, 215), "0.2 Nm", font=font_hero, fill=C_AMBER, anchor="mm")
    draw.text((536 + card_w // 2, 258), "[ NO OVERRIDE ]", font=font_bold, fill=C_EMERALD, anchor="mm")

    # Health & Diagnostics
    draw.text((536 + card_w // 2, 325), "SES ECU: HEALTHY", font=font_med, fill=C_EMERALD, anchor="mm")
    draw.text((536 + card_w // 2, 365), "Motor: 8.4A  •  Temp: 34°C", font=font_bold, fill=C_WHITE, anchor="mm")

    # Bottom Full-Width Scope Action Button (Height 58px)
    draw.rounded_rectangle([8, 414, 792, 472], radius=8, fill=(15, 41, 55), outline=C_CYAN, width=2)
    draw.text((400, 443), "VIEW 15-SECOND STEERING SCOPE PLOT  (OR SWIPE DOWN)  >", font=font_bold, fill=C_CYAN, anchor="mm")

    save_screen(img, "screen1_steer_digits")


def render_screen1_steer_plot():
    img = Image.new("RGB", (WIDTH, HEIGHT), C_BG)
    draw = ImageDraw.Draw(img)

    # Top Header (with Driver Column Torque Readout)
    draw.rounded_rectangle([8, 6, 792, 54], radius=6, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((18, 30), "STEER (SES)", font=font_med, fill=C_WHITE, anchor="lm")
    draw.text((195, 30), "CMD: +15.0°", font=font_bold, fill=C_CYAN, anchor="mm")
    draw.text((315, 30), "ACT: +14.7°", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((425, 30), "Δ: 0.3° [OK]", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((545, 30), "TORQ: 0.2 Nm", font=font_bold, fill=C_AMBER, anchor="mm")

    draw.rounded_rectangle([665, 10, 786, 50], radius=6, fill=C_NAV_BTN, outline=C_CARD_BORDER, width=1)
    draw.text((725, 30), "< NUMERICS", font=font_bold, fill=C_GRAY_TEXT, anchor="mm")

    # Main Scope Chart Area
    c_x0, c_y0, c_x1, c_y1 = 8, 60, 792, 410
    draw.rounded_rectangle([c_x0, c_y0, c_x1, c_y1], radius=8, fill=(8, 8, 8), outline=C_CARD_BORDER, width=1)

    # Grid lines (15 vertical time divisions)
    chart_w = c_x1 - c_x0
    chart_h = c_y1 - c_y0
    for s in range(16):
        gx = c_x0 + int(s * (chart_w / 15))
        draw.line([(gx, c_y0), (gx, c_y1)], fill=C_GRID, width=1)

    # Horizontal center zero line
    cy = c_y0 + chart_h // 2
    draw.line([(c_x0, cy), (c_x1, cy)], fill=(70, 70, 70), width=2)
    draw.text((c_x0 + 10, cy - 10), "0.0°", font=font_small, fill=C_WHITE)

    # +/- 20° lines
    y_p20 = cy - int((20 / 45) * (chart_h / 2))
    y_m20 = cy + int((20 / 45) * (chart_h / 2))
    draw.line([(c_x0, y_p20), (c_x1, y_p20)], fill=(40, 40, 40), width=1)
    draw.line([(c_x0, y_m20), (c_x1, y_m20)], fill=(40, 40, 40), width=1)
    draw.text((c_x0 + 10, y_p20 - 10), "+20°", font=font_small, fill=C_GRAY_TEXT)
    draw.text((c_x0 + 10, y_m20 - 10), "-20°", font=font_small, fill=C_GRAY_TEXT)

    # Synthetic realistic steering wave trace over 150 points (15s @ 10Hz)
    np.random.seed(42)
    t = np.linspace(0, 15, 150)
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

    # Right-side axis labels for Driver Column Torque (-4.5 to +4.5 Nm)
    draw.text((c_x1 - 10, cy - 10), "0.0 Nm", font=font_small, fill=C_AMBER, anchor="ra")
    draw.text((c_x1 - 10, y_p20 - 10), "+2.0 Nm", font=font_small, fill=C_AMBER, anchor="ra")
    draw.text((c_x1 - 10, y_m20 - 10), "-2.0 Nm", font=font_small, fill=C_AMBER, anchor="ra")
    draw.text((c_x1 - 10, c_y0 + 10), "+4.5 Nm", font=font_small, fill=C_AMBER, anchor="ra")

    # Draw Command (Cyan, width 3)
    cmd_pts = [to_canvas(i, cmd_trace[i]) for i in range(150)]
    draw.line(cmd_pts, fill=C_CYAN, width=3)

    # Draw Feedback (Emerald, width 2)
    act_pts = [to_canvas(i, act_trace[i]) for i in range(150)]
    draw.line(act_pts, fill=C_EMERALD, width=2)

    # Draw Driver Column Torque (Amber, width 2)
    torq_pts = [to_canvas_torq(i, torq_trace[i]) for i in range(150)]
    draw.line(torq_pts, fill=C_AMBER, width=2)

    # Bottom Controls Bar (Height 58px)
    draw.rounded_rectangle([8, 416, 792, 474], radius=6, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((20, 445), "±45° [CYN/EMR]  |  Torq: ±4.5Nm [AMB]  |  15s (10Hz)", font=font_small, fill=C_GRAY_TEXT, anchor="lm")

    draw.rounded_rectangle([415, 420, 595, 470], radius=6, fill=C_NAV_ACTIVE, outline=C_CYAN, width=1)
    draw.text((505, 445), "||  PAUSE / FREEZE", font=font_bold, fill=C_CYAN, anchor="mm")

    draw.rounded_rectangle([605, 420, 785, 470], radius=6, fill=C_NAV_BTN, outline=C_CARD_BORDER, width=1)
    draw.text((695, 445), "BRAKE PLOT >", font=font_bold, fill=C_WHITE, anchor="mm")

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
    # Sub-metric pill
    draw.rounded_rectangle([20, 245, 8 + card_w - 12, 295], radius=6, fill=(18, 26, 36), outline=(30, 58, 80), width=1)
    draw.text((8 + card_w // 2, 270), "TARGET STROKE: 18.0 mm", font=font_bold, fill=C_WHITE, anchor="mm")
    draw.text((8 + card_w // 2, 335), "AUTOBRAKE: ARMED", font=font_med, fill=C_GRAY_TEXT, anchor="mm")
    draw.text((8 + card_w // 2, 375), "CAN 2.0B • 100 Hz", font=font_small, fill=C_GRAY_SUB, anchor="mm")

    # Card 2: Feedback (SEB 0x721)
    draw.rounded_rectangle([272, 58, 272 + card_w, 406], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((272 + card_w // 2, 82), "ACTUATION (SEB 0x721)", font=font_small, fill=C_GRAY_TEXT, anchor="mm")
    draw.text((272 + card_w // 2, 155), "442", font=font_hero, fill=C_EMERALD, anchor="mm")
    draw.text((272 + card_w // 2, 198), "kPa", font=font_med, fill=C_EMERALD, anchor="mm")
    # Sub-metric pill
    draw.rounded_rectangle([284, 245, 272 + card_w - 12, 295], radius=6, fill=(12, 34, 24), outline=(21, 80, 50), width=1)
    draw.text((272 + card_w // 2, 270), "ACTUAL STROKE: 17.8 mm", font=font_bold, fill=C_WHITE, anchor="mm")
    draw.text((272 + card_w // 2, 335), "CLOSED-LOOP PRESSURE", font=font_med, fill=C_EMERALD, anchor="mm")
    draw.text((272 + card_w // 2, 375), "SEB ARMED • READY", font=font_small, fill=C_GRAY_SUB, anchor="mm")

    # Card 3: Tracking Error & Diagnostics
    draw.rounded_rectangle([536, 58, 536 + card_w, 406], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    # Delta Badge (2-tier layout)
    draw.rounded_rectangle([550, 68, 536 + card_w - 14, 142], radius=6, fill=(6, 78, 59), outline=C_EMERALD, width=2)
    draw.text((536 + card_w // 2, 92), "Δ: -8 kPa", font=font_badge, fill=(52, 211, 153), anchor="mm")
    draw.text((536 + card_w // 2, 122), "[ TRACKING OK ]", font=font_bold, fill=(167, 243, 208), anchor="mm")

    # Stroke Tracking Box
    draw.rounded_rectangle([550, 150, 536 + card_w - 14, 280], radius=6, fill=(15, 23, 42), outline=(56, 189, 248), width=1)
    draw.text((536 + card_w // 2, 172), "PISTON DISPLACEMENT", font=font_small, fill=C_CYAN, anchor="mm")
    draw.text((536 + card_w // 2, 215), "17.8 mm", font=font_hero, fill=C_WHITE, anchor="mm")
    draw.text((536 + card_w // 2, 258), "[ STROKE Δ: 0.2 mm OK ]", font=font_bold, fill=C_EMERALD, anchor="mm")

    # Health & Diagnostics
    draw.text((536 + card_w // 2, 325), "SEB ECU: HEALTHY", font=font_med, fill=C_EMERALD, anchor="mm")
    draw.text((536 + card_w // 2, 365), "Motor: 4.2A  •  Temp: 38°C", font=font_bold, fill=C_WHITE, anchor="mm")

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
    draw.text((335, 30), "ACT: 442 kPa", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((450, 30), "Δ: -8 kPa [OK]", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((565, 30), "STRK: 17.8mm", font=font_bold, fill=C_WHITE, anchor="mm")

    draw.rounded_rectangle([665, 10, 786, 50], radius=6, fill=C_NAV_BTN, outline=C_CARD_BORDER, width=1)
    draw.text((725, 30), "< NUMERICS", font=font_bold, fill=C_GRAY_TEXT, anchor="mm")

    # Chart Area
    c_x0, c_y0, c_x1, c_y1 = 8, 60, 792, 410
    draw.rounded_rectangle([c_x0, c_y0, c_x1, c_y1], radius=8, fill=(8, 8, 8), outline=C_CARD_BORDER, width=1)

    chart_w = c_x1 - c_x0
    chart_h = c_y1 - c_y0
    for s in range(16):
        gx = c_x0 + int(s * (chart_w / 15))
        draw.line([(gx, c_y0), (gx, c_y1)], fill=C_GRID, width=1)

    # Y-scale lines (0, 500, 1000, 1500 kPa)
    for kpa in [0, 500, 1000, 1500]:
        py = c_y1 - int((kpa / 1500.0) * (chart_h - 20)) - 10
        draw.line([(c_x0, py), (c_x1, py)], fill=(40, 40, 40) if kpa > 0 else (70, 70, 70), width=1 if kpa > 0 else 2)
        draw.text((c_x0 + 10, py - 10), f"{kpa} kPa", font=font_small, fill=C_WHITE if kpa == 0 else C_GRAY_TEXT)

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

    def to_canvas(idx, kpa):
        px = c_x0 + int(idx * (chart_w / 149))
        py = c_y1 - int((kpa / 1500.0) * (chart_h - 20)) - 10
        return (px, max(c_y0 + 5, min(c_y1 - 5, py)))

    # Draw Command (Cyan, width 3)
    cmd_pts = [to_canvas(i, cmd_trace[i]) for i in range(150)]
    draw.line(cmd_pts, fill=C_CYAN, width=3)

    # Draw Feedback (Emerald, width 2)
    act_pts = [to_canvas(i, act_trace[i]) for i in range(150)]
    draw.line(act_pts, fill=C_EMERALD, width=2)

    # Bottom Controls Bar (Height 58px)
    draw.rounded_rectangle([8, 416, 792, 474], radius=6, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((20, 445), "Scale: 0 .. 1500 kPa (Line Pressure) | 15s Window", font=font_small, fill=C_GRAY_TEXT, anchor="lm")

    draw.rounded_rectangle([415, 420, 595, 470], radius=6, fill=C_NAV_ACTIVE, outline=C_CYAN, width=1)
    draw.text((505, 445), "||  PAUSE / FREEZE", font=font_bold, fill=C_CYAN, anchor="mm")

    draw.rounded_rectangle([605, 420, 785, 470], radius=6, fill=C_NAV_BTN, outline=C_CARD_BORDER, width=1)
    draw.text((695, 445), "DRIVE PLOT >", font=font_bold, fill=C_WHITE, anchor="mm")

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
    # Sub-metric pill
    draw.rounded_rectangle([20, 245, 8 + card_w - 12, 295], radius=6, fill=(18, 26, 36), outline=(30, 58, 80), width=1)
    draw.text((8 + card_w // 2, 270), "TARGET: [ D ] (DRIVE)", font=font_bold, fill=C_WHITE, anchor="mm")
    draw.text((8 + card_w // 2, 335), "Slew Limit: 1.5 m/s²", font=font_med, fill=C_GRAY_TEXT, anchor="mm")
    draw.text((8 + card_w // 2, 375), "CAN 2.0B • 100 Hz", font=font_small, fill=C_GRAY_SUB, anchor="mm")

    # Card 2: Feedback (MTR 0x120/0x206)
    draw.rounded_rectangle([272, 58, 272 + card_w, 406], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((272 + card_w // 2, 82), "ACTUATION (MTR 0x206)", font=font_small, fill=C_GRAY_TEXT, anchor="mm")
    draw.text((272 + card_w // 2, 155), "14.8", font=font_hero, fill=C_EMERALD, anchor="mm")
    draw.text((272 + card_w // 2, 198), "km/h", font=font_med, fill=C_EMERALD, anchor="mm")
    # Sub-metric pill
    draw.rounded_rectangle([284, 245, 272 + card_w - 12, 295], radius=6, fill=(12, 34, 24), outline=(21, 80, 50), width=1)
    draw.text((272 + card_w // 2, 270), "ACTUAL: [ D ] (ENGAGED)", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((272 + card_w // 2, 335), "MOTOR: 1,620 RPM", font=font_med, fill=C_WHITE, anchor="mm")
    draw.text((272 + card_w // 2, 375), "PROPULSION HEALTHY", font=font_small, fill=C_GRAY_SUB, anchor="mm")

    # Card 3: Interlocks & Lifecycle
    draw.rounded_rectangle([536, 58, 536 + card_w, 406], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    # Delta Badge (2-tier layout)
    draw.rounded_rectangle([550, 68, 536 + card_w - 14, 142], radius=6, fill=(6, 78, 59), outline=C_EMERALD, width=2)
    draw.text((536 + card_w // 2, 92), "Δ: 0.2 km/h", font=font_badge, fill=(52, 211, 153), anchor="mm")
    draw.text((536 + card_w // 2, 122), "[ TRACKING OK ]", font=font_bold, fill=(167, 243, 208), anchor="mm")

    # Interlock Status Box
    draw.rounded_rectangle([550, 150, 536 + card_w - 14, 280], radius=6, fill=(6, 40, 24), outline=C_EMERALD, width=1)
    draw.text((536 + card_w // 2, 172), "SAFETY INTERLOCKS", font=font_small, fill=C_EMERALD, anchor="mm")
    draw.text((536 + card_w // 2, 215), "ALL CLEAR", font=font_large, fill=(52, 211, 153), anchor="mm")
    draw.text((536 + card_w // 2, 258), "[ MASK: 0x0000 OK ]", font=font_bold, fill=C_EMERALD, anchor="mm")

    # Lifecycle & Output
    draw.text((536 + card_w // 2, 325), "MTR NODE: ACTIVE (3)", font=font_med, fill=C_EMERALD, anchor="mm")
    draw.text((536 + card_w // 2, 365), "Output Drive: ENABLED", font=font_bold, fill=C_WHITE, anchor="mm")

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
    draw.text((195, 30), "CMD: 15.0 km/h", font=font_bold, fill=C_CYAN, anchor="mm")
    draw.text((325, 30), "ACT: 14.8 km/h", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((440, 30), "Δ: 0.2 km/h [OK]", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((560, 30), "MTR: 1620 RPM", font=font_bold, fill=C_WHITE, anchor="mm")

    draw.rounded_rectangle([665, 10, 786, 50], radius=6, fill=C_NAV_BTN, outline=C_CARD_BORDER, width=1)
    draw.text((725, 30), "< NUMERICS", font=font_bold, fill=C_GRAY_TEXT, anchor="mm")

    # Chart Area
    c_x0, c_y0, c_x1, c_y1 = 8, 60, 792, 410
    draw.rounded_rectangle([c_x0, c_y0, c_x1, c_y1], radius=8, fill=(8, 8, 8), outline=C_CARD_BORDER, width=1)

    chart_w = c_x1 - c_x0
    chart_h = c_y1 - c_y0
    for s in range(16):
        gx = c_x0 + int(s * (chart_w / 15))
        draw.line([(gx, c_y0), (gx, c_y1)], fill=C_GRID, width=1)

    # Y-scale lines (0, 10, 20, 30 km/h)
    for spd in [0, 10, 20, 30]:
        py = c_y1 - int((spd / 30.0) * (chart_h - 20)) - 10
        draw.line([(c_x0, py), (c_x1, py)], fill=(40, 40, 40) if spd > 0 else (70, 70, 70), width=1 if spd > 0 else 2)
        draw.text((c_x0 + 10, py - 10), f"{spd} km/h", font=font_small, fill=C_WHITE if spd == 0 else C_GRAY_TEXT)

    # Synthetic speed trace
    np.random.seed(202)
    cmd_trace = np.zeros(150)
    cmd_trace[15:60] = 10.0
    cmd_trace[60:110] = 22.0
    cmd_trace[110:] = 15.0

    act_trace = np.zeros(150)
    for i in range(1, 150):
        act_trace[i] = act_trace[i - 1] + (cmd_trace[i] - act_trace[i - 1]) * 0.22 + np.random.normal(0, 0.1)
        if act_trace[i] < 0:
            act_trace[i] = 0

    def to_canvas(idx, spd):
        px = c_x0 + int(idx * (chart_w / 149))
        py = c_y1 - int((spd / 30.0) * (chart_h - 20)) - 10
        return (px, max(c_y0 + 5, min(c_y1 - 5, py)))

    # Draw Command (Cyan, width 3)
    cmd_pts = [to_canvas(i, cmd_trace[i]) for i in range(150)]
    draw.line(cmd_pts, fill=C_CYAN, width=3)

    # Draw Feedback (Emerald, width 2)
    act_pts = [to_canvas(i, act_trace[i]) for i in range(150)]
    draw.line(act_pts, fill=C_EMERALD, width=2)

    # Bottom Controls Bar (Height 58px)
    draw.rounded_rectangle([8, 416, 792, 474], radius=6, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((20, 445), "Scale: 0.0 .. 30.0 km/h | 15s Window", font=font_small, fill=C_GRAY_TEXT, anchor="lm")

    draw.rounded_rectangle([415, 420, 595, 470], radius=6, fill=C_NAV_ACTIVE, outline=C_CYAN, width=1)
    draw.text((505, 445), "||  PAUSE / FREEZE", font=font_bold, fill=C_CYAN, anchor="mm")

    draw.rounded_rectangle([605, 420, 785, 470], radius=6, fill=C_NAV_BTN, outline=C_CARD_BORDER, width=1)
    draw.text((695, 445), "STEER PLOT >", font=font_bold, fill=C_WHITE, anchor="mm")

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
