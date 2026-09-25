"""800x480 Pixel-Perfect Low-Bus Inspector UI Simulator and Screenshot Generator.

Renders authentic 800x480 displays matching the exact LVGL layout:
- Screen 0: CAN Watch Sidebar Cockpit (Gears, Telltales, Dual-needle Speed Arc, Steer Arc, Brake Bars)
- Screen 1: Steering (SES) Digits + In-Box 5s Sparkline Plots
- Screen 2: Brake (SEB) Digits + In-Box 5s Sparkline Plots
- Screen 3: Drive (MTR) Digits + In-Box 5s Sparkline Plots
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

# Semantic Color Tokens
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
C_SKY = (56, 189, 248)
C_WHITE = (255, 255, 255)
C_GRAY_TEXT = (136, 136, 136)
C_GRAY_SUB = (100, 116, 139)
C_GRID = (24, 24, 24)

# Typography Hierarchy
try:
    font_hero = ImageFont.truetype("arialbd.ttf", 36)
    font_large = ImageFont.truetype("arialbd.ttf", 22)
    font_badge = ImageFont.truetype("arialbd.ttf", 15)
    font_med = ImageFont.truetype("arialbd.ttf", 13)
    font_bold = ImageFont.truetype("arialbd.ttf", 12)
    font_small = ImageFont.truetype("arialbd.ttf", 11)
    font_tiny = ImageFont.truetype("arialbd.ttf", 10)
except Exception:
    font_hero = font_large = font_badge = font_med = font_bold = font_small = font_tiny = ImageFont.load_default()


def quantize_to_rgb565(img: Image.Image) -> Image.Image:
    """Quantizes 24-bit RGB888 image to true hardware 16-bit RGB565."""
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
        border_col = C_SKY if is_active else C_CARD_BORDER
        border_w = 2 if is_active else 1
        text_col = C_SKY if is_active else C_GRAY_TEXT

        draw.rounded_rectangle([tx, ty, tx + tab_w, ty + tab_h], radius=6, fill=bg_col, outline=border_col, width=border_w)
        draw.text((tx + tab_w // 2, ty + tab_h // 2), title, font=font_small, fill=text_col, anchor="mm")


def render_screen0_dashboard():
    """Screen 0: CAN Watch Cockpit Sidebar layout scaled to 800x480."""
    img = Image.new("RGB", (WIDTH, HEIGHT), C_BG)
    draw = ImageDraw.Draw(img)
    draw_nav_bar(draw, active_tab=0)

    # 1. State & Mode Strip (Y=52 to 92, H=40)
    draw.rounded_rectangle([8, 52, 792, 92], radius=6, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    
    # Cockpit State
    draw.text((20, 72), "COCKPIT STATE:", font=font_small, fill=C_GRAY_TEXT, anchor="lm")
    draw.rounded_rectangle([115, 60, 205, 84], radius=12, fill=(6, 40, 23), outline=C_EMERALD, width=1)
    draw.text((160, 72), "SAFETY OK", font=font_bold, fill=C_EMERALD, anchor="mm")

    # Mode
    draw.text((230, 72), "MODE:", font=font_small, fill=C_GRAY_TEXT, anchor="lm")
    draw.rounded_rectangle([275, 60, 395, 84], radius=6, fill=(18, 26, 36), outline=(30, 58, 80), width=1)
    draw.text((335, 72), "AUTONOMOUS", font=font_bold, fill=C_CYAN, anchor="mm")

    # Gear Selector [ P | R | N | D | S ]
    draw.text((425, 72), "GEAR:", font=font_small, fill=C_GRAY_TEXT, anchor="lm")
    gears = ["P", "R", "N", "D", "S"]
    for idx, g in enumerate(gears):
        gx = 475 + idx * 30
        is_d = g == "D"
        gbg = C_CYAN if is_d else (18, 18, 18)
        gtxt = (0, 0, 0) if is_d else C_GRAY_TEXT
        draw.rounded_rectangle([gx, 60, gx + 24, 84], radius=4, fill=gbg, outline=C_CARD_BORDER, width=1)
        draw.text((gx + 12, 72), g, font=font_bold, fill=gtxt, anchor="mm")

    # Low-Bus Master
    draw.text((645, 72), "LOW-BUS (500 kbps)", font=font_small, fill=C_GRAY_SUB, anchor="lm")

    # 2. ISO 2575 Telltales Deck (Y=98 to 146, H=48)
    draw.rounded_rectangle([8, 98, 792, 146], radius=6, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    telltales = [
        ("⮜", "LEFT", False, False),
        ("⮞", "RGHT", False, False),
        ("⚠", "HAZD", False, False),
        ("💡", "BEAM", True, True),
        ("STOP", "BRK", True, True),
    ]
    t_w = 148
    for idx, (sym, lbl, cmd_on, act_on) in enumerate(telltales):
        tx = 16 + idx * (t_w + 8)
        ty = 104
        bg_col = (12, 34, 24) if act_on else (18, 18, 18)
        border_col = C_EMERALD if act_on else (C_CYAN if cmd_on else C_CARD_BORDER)
        draw.rounded_rectangle([tx, ty, tx + t_w, ty + 36], radius=6, fill=bg_col, outline=border_col, width=1)
        text_col = C_EMERALD if act_on else C_GRAY_TEXT
        draw.text((tx + 22, ty + 18), sym, font=font_badge, fill=text_col, anchor="mm")
        draw.text((tx + 55, ty + 18), lbl, font=font_bold, fill=text_col, anchor="lm")
        draw.text((tx + t_w - 24, ty + 18), "ACT" if act_on else "OFF", font=font_tiny, fill=text_col, anchor="mm")

    # 3. Cockpit 3-Instrument Deck (Y=152 to 414, H=262)
    inst_w = 254
    inst_h = 262
    inst_y = 152

    # --- Instrument 1: Speedometer (0 - 50 km/h) ---
    draw.rounded_rectangle([8, inst_y, 8 + inst_w, inst_y + inst_h], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((18, inst_y + 16), "SPEEDOMETER", font=font_med, fill=C_WHITE, anchor="lm")
    draw.text((8 + inst_w - 18, inst_y + 16), "0-50 km/h", font=font_tiny, fill=C_GRAY_TEXT, anchor="rm")

    # Radial dial arc
    cx, cy = 8 + inst_w // 2, inst_y + 105
    r = 52
    draw.arc([cx - r, cy - r, cx + r, cy + r], start=135, end=405, fill=(40, 40, 40), width=8)

    # Command pointer (cyan) & Actual needle (emerald)
    cmd_ang = 135 + (15.0 / 50.0) * 270
    act_ang = 135 + (14.8 / 50.0) * 270
    rad_c = math.radians(cmd_ang)
    rad_a = math.radians(act_ang)
    draw.line([(cx, cy), (cx + int(46 * math.cos(rad_c)), cy + int(46 * math.sin(rad_c)))], fill=C_CYAN, width=2)
    draw.line([(cx, cy), (cx + int(50 * math.cos(rad_a)), cy + int(50 * math.sin(rad_a)))], fill=C_EMERALD, width=4)
    draw.ellipse([cx - 4, cy - 4, cx + 4, cy + 4], fill=C_EMERALD)

    # Numerics
    draw.text((cx, inst_y + 158), "14.8", font=font_hero, fill=C_EMERALD, anchor="mm")
    draw.text((cx, inst_y + 186), "km/h", font=font_small, fill=C_GRAY_TEXT, anchor="mm")

    # Command badge & Motor
    draw.rounded_rectangle([18, inst_y + 200, 8 + inst_w - 10, inst_y + 226], radius=4, fill=(18, 26, 36), outline=(30, 58, 80), width=1)
    draw.text((cx, inst_y + 213), "CMD: 15.0 km/h  [Δ: 0.2]", font=font_bold, fill=C_CYAN, anchor="mm")
    draw.text((cx, inst_y + 242), "MOTOR: 1,620 RPM  •  RATIO: 8.5:1", font=font_tiny, fill=C_WHITE, anchor="mm")

    # --- Instrument 2: Steering Angle (-45° to +45°) ---
    draw.rounded_rectangle([273, inst_y, 273 + inst_w, inst_y + inst_h], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((283, inst_y + 16), "STEERING ANGLE", font=font_med, fill=C_WHITE, anchor="lm")
    draw.text((273 + inst_w - 18, inst_y + 16), "±45.0°", font=font_tiny, fill=C_GRAY_TEXT, anchor="rm")

    # Steering Center-Zero Arc
    cx2, cy2 = 273 + inst_w // 2, inst_y + 105
    draw.arc([cx2 - r, cy2 - r, cx2 + r, cy2 + r], start=210, end=330, fill=(40, 40, 40), width=8)
    draw.line([(cx2, cy2 - r - 4), (cx2, cy2 - r + 8)], fill=C_GRAY_TEXT, width=1) # 0 deg center tick

    s_cmd_ang = 270 + (15.0 / 45.0) * 60
    s_act_ang = 270 + (14.7 / 45.0) * 60
    rad_sc = math.radians(s_cmd_ang)
    rad_sa = math.radians(s_act_ang)
    draw.line([(cx2, cy2), (cx2 + int(46 * math.cos(rad_sc)), cy2 + int(46 * math.sin(rad_sc)))], fill=C_CYAN, width=2)
    draw.line([(cx2, cy2), (cx2 + int(50 * math.cos(rad_sa)), cy2 + int(50 * math.sin(rad_sa)))], fill=C_EMERALD, width=4)
    draw.ellipse([cx2 - 4, cy2 - 4, cx2 + 4, cy2 + 4], fill=C_EMERALD)

    # Numerics
    draw.text((cx2, inst_y + 158), "+14.7°", font=font_hero, fill=C_EMERALD, anchor="mm")
    draw.text((cx2, inst_y + 186), "ACTUAL ANGLE", font=font_small, fill=C_GRAY_TEXT, anchor="mm")

    # Command badge & Torque
    draw.rounded_rectangle([283, inst_y + 200, 273 + inst_w - 10, inst_y + 226], radius=4, fill=(18, 26, 36), outline=(30, 58, 80), width=1)
    draw.text((cx2, inst_y + 213), "CMD: +15.0°  [Δ: 0.3° OK]", font=font_bold, fill=C_CYAN, anchor="mm")
    draw.text((cx2, inst_y + 242), "TORQUE: +0.2 Nm [NO OVERRIDE]", font=font_tiny, fill=C_AMBER, anchor="mm")

    # --- Instrument 3: Hydraulic Brake (0 - 1500 kPa) ---
    draw.rounded_rectangle([538, inst_y, 538 + inst_w, inst_y + inst_h], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((548, inst_y + 16), "HYDRAULIC BRAKE", font=font_med, fill=C_WHITE, anchor="lm")
    draw.text((538 + inst_w - 18, inst_y + 16), "0-1500 kPa", font=font_tiny, fill=C_GRAY_TEXT, anchor="rm")

    cx3 = 538 + inst_w // 2
    draw.text((cx3, inst_y + 60), "442 kPa", font=font_hero, fill=C_EMERALD, anchor="mm")

    # Feedback Bar
    draw.text((548, inst_y + 94), "FEEDBACK: 442 kPa", font=font_tiny, fill=C_EMERALD, anchor="lm")
    draw.rounded_rectangle([548, inst_y + 104, 538 + inst_w - 10, inst_y + 116], radius=6, fill=(20, 20, 20))
    act_bar_w = int((442.0 / 1500.0) * (inst_w - 20))
    draw.rounded_rectangle([548, inst_y + 104, 548 + act_bar_w, inst_y + 116], radius=6, fill=C_EMERALD)

    # Command Bar
    draw.text((548, inst_y + 130), "COMMAND: 450 kPa", font=font_tiny, fill=C_CYAN, anchor="lm")
    draw.rounded_rectangle([548, inst_y + 140, 538 + inst_w - 10, inst_y + 150], radius=5, fill=(20, 20, 20))
    cmd_bar_w = int((450.0 / 1500.0) * (inst_w - 20))
    draw.rounded_rectangle([548, inst_y + 140, 548 + cmd_bar_w, inst_y + 150], radius=5, fill=C_CYAN)

    # Stroke & Temp
    draw.rounded_rectangle([548, inst_y + 168, 538 + inst_w - 10, inst_y + 204], radius=6, fill=(18, 26, 36), outline=C_SKY, width=1)
    draw.text((cx3, inst_y + 186), "STROKE: 17.8 mm  •  TEMP: 38°C", font=font_bold, fill=C_WHITE, anchor="mm")
    draw.text((cx3, inst_y + 224), "[ OK ] SEB CLOSED-LOOP HEALTHY", font=font_bold, fill=C_EMERALD, anchor="mm")
    draw.text((cx3, inst_y + 244), "PRESSURE TRACKING: Δ: -8 kPa", font=font_tiny, fill=C_GRAY_SUB, anchor="mm")

    # 4. Bottom Bus Diagnostics Strip (Y=422 to 472, H=50)
    draw.rounded_rectangle([8, 422, 792, 472], radius=6, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((20, 447), "LOW-BUS CAN: 420 msg/s  •  TEC: 0 | REC: 0 [BUS OK]  •  12V Rail: 13.8V  •  Core Temp: 41°C", font=font_small, fill=C_SKY, anchor="lm")

    save_screen(img, "screen0_dashboard")


def render_actuator_screen(active_tab: int, title_code: str, vcu_id: str, act_id: str,
                           cmd_val_str: str, act_val_str: str,
                           cmd_data: np.ndarray, act_data: np.ndarray,
                           data_min: float, data_max: float,
                           cmd_badge: str, act_badge: str,
                           delta_str: str,
                           sec_card_title: str, sec_card_val: str, sec_card_sub: str,
                           sec_card_col: tuple,
                           live_telemetry_1: str, live_telemetry_2: str,
                           btn_text: str, filename: str):
    """Renders 800x480 actuator window with in-box 5s plots and zero static filler."""
    img = Image.new("RGB", (WIDTH, HEIGHT), C_BG)
    draw = ImageDraw.Draw(img)
    draw_nav_bar(draw, active_tab=active_tab)

    act_w = 254
    u_h = 352
    u_y = 54

    # ==================== CARD 1: COMMAND ====================
    draw.rounded_rectangle([8, u_y, 8 + act_w, u_y + u_h], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((18, u_y + 18), f"COMMAND ({vcu_id})", font=font_small, fill=C_GRAY_TEXT, anchor="lm")
    draw.text((8 + act_w // 2, u_y + 54), cmd_val_str, font=font_hero, fill=C_CYAN, anchor="mm")

    # IN-BOX 5s SPARKLINE MINI-PLOT (Height 86px, Width 226px)
    p_x0, p_y0 = 22, u_y + 82
    p_w, p_h = act_w - 28, 86
    draw.rounded_rectangle([p_x0, p_y0, p_x0 + p_w, p_y0 + p_h], radius=6, fill=(8, 8, 8), outline=C_CARD_BORDER, width=1)
    for s in range(5):
        gx = p_x0 + int(s * (p_w / 4))
        draw.line([(gx, p_y0), (gx, p_y0 + p_h)], fill=C_GRID, width=1)
    cy1 = p_y0 + p_h // 2
    draw.line([(p_x0, cy1), (p_x0 + p_w, cy1)], fill=(45, 45, 45), width=1)

    def to_box_plot(idx, val, box_x):
        px = box_x + int(idx * (p_w / 49))
        norm = (val - data_min) / (data_max - data_min)
        py = (p_y0 + p_h - 6) - int(norm * (p_h - 12))
        return (px, max(p_y0 + 2, min(p_y0 + p_h - 2, py)))

    cmd_pts = [to_box_plot(i, cmd_data[i], p_x0) for i in range(50)]
    draw.line(cmd_pts, fill=C_CYAN, width=2)
    draw.text((p_x0 + 8, p_y0 + 10), "5s CMD TREND", font=font_tiny, fill=C_GRAY_SUB)

    # Dynamic CAN Badges & Telemetry
    draw.rounded_rectangle([22, u_y + 180, 8 + act_w - 14, u_y + 214], radius=6, fill=(18, 26, 36), outline=(30, 58, 80), width=1)
    draw.text((8 + act_w // 2, u_y + 197), cmd_badge, font=font_bold, fill=C_WHITE, anchor="mm")

    draw.text((22, u_y + 238), "ROLLING CNT: 7  •  CHK: VALID", font=font_tiny, fill=C_WHITE, anchor="lm")
    draw.text((22, u_y + 264), "CAN ID: " + vcu_id + "  (20ms / 50 Hz)", font=font_tiny, fill=C_GRAY_TEXT, anchor="lm")
    draw.text((22, u_y + 328), "[ OK ] TARGET STREAM ACTIVE", font=font_small, fill=C_EMERALD, anchor="lm")

    # ==================== CARD 2: ACTUATION ====================
    draw.rounded_rectangle([273, u_y, 273 + act_w, u_y + u_h], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    draw.text((283, u_y + 18), f"ACTUATION ({act_id})", font=font_small, fill=C_GRAY_TEXT, anchor="lm")
    draw.text((273 + act_w // 2, u_y + 54), act_val_str, font=font_hero, fill=C_EMERALD, anchor="mm")

    # IN-BOX 5s SPARKLINE MINI-PLOT (Height 86px, Width 226px)
    p2_x0 = 287
    draw.rounded_rectangle([p2_x0, p_y0, p2_x0 + p_w, p_y0 + p_h], radius=6, fill=(8, 8, 8), outline=C_CARD_BORDER, width=1)
    for s in range(5):
        gx = p2_x0 + int(s * (p_w / 4))
        draw.line([(gx, p_y0), (gx, p_y0 + p_h)], fill=C_GRID, width=1)
    draw.line([(p2_x0, cy1), (p2_x0 + p_w, cy1)], fill=(45, 45, 45), width=1)

    act_pts = [to_box_plot(i, act_data[i], p2_x0) for i in range(50)]
    draw.line(act_pts, fill=C_EMERALD, width=2)
    draw.text((p2_x0 + 8, p_y0 + 10), "5s FEEDBACK TREND", font=font_tiny, fill=C_GRAY_SUB)

    # Dynamic CAN Badges & Telemetry
    draw.rounded_rectangle([287, u_y + 180, 273 + act_w - 14, u_y + 214], radius=6, fill=(12, 34, 24), outline=(21, 80, 50), width=1)
    draw.text((273 + act_w // 2, u_y + 197), act_badge, font=font_bold, fill=C_WHITE, anchor="mm")

    draw.text((287, u_y + 238), live_telemetry_1, font=font_tiny, fill=C_WHITE, anchor="lm")
    draw.text((287, u_y + 264), live_telemetry_2, font=font_tiny, fill=C_GRAY_TEXT, anchor="lm")
    draw.text((287, u_y + 328), "[ OK ] FEEDBACK STREAM (100 Hz)", font=font_small, fill=C_EMERALD, anchor="lm")

    # ==================== CARD 3: TRACKING & INTERLOCKS ====================
    draw.rounded_rectangle([538, u_y, 538 + act_w, u_y + u_h], radius=8, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
    
    # Delta Badge
    draw.rounded_rectangle([550, u_y + 14, 538 + act_w - 12, u_y + 64], radius=6, fill=(6, 78, 59), outline=C_EMERALD, width=2)
    draw.text((538 + act_w // 2, u_y + 39), delta_str, font=font_badge, fill=C_WHITE, anchor="mm")

    # Secondary Measurement Box (Torque, Stroke, or Interlocks)
    draw.rounded_rectangle([550, u_y + 76, 538 + act_w - 12, u_y + 186], radius=6, fill=(20, 20, 20), outline=sec_card_col, width=1)
    draw.text((538 + act_w // 2, u_y + 98), sec_card_title, font=font_tiny, fill=sec_card_col, anchor="mm")
    draw.text((538 + act_w // 2, u_y + 130), sec_card_val, font=font_large, fill=C_WHITE, anchor="mm")
    draw.text((538 + act_w // 2, u_y + 162), sec_card_sub, font=font_small, fill=C_EMERALD, anchor="mm")

    # Live CAN Diagnostics & Fault Word
    draw.text((550, u_y + 208), "SUPPLY VOLT: 13.8 V  •  CURRENT: OK", font=font_tiny, fill=C_WHITE, anchor="lm")
    draw.text((550, u_y + 234), "DTC DIAGNOSIS: ALL CLEAR (0x0000)", font=font_tiny, fill=C_EMERALD, anchor="lm")
    draw.text((550, u_y + 260), "WATCHDOG: LAST SEEN 10ms AGO", font=font_tiny, fill=C_GRAY_TEXT, anchor="lm")
    draw.text((550, u_y + 328), f"[ OK ] {title_code} HEALTHY (100 Hz)", font=font_small, fill=C_EMERALD, anchor="lm")

    # ==================== BOTTOM EXPAND BUTTON ====================
    draw.rounded_rectangle([8, 416, 792, 470], radius=8, fill=(30, 41, 59), outline=C_SKY, width=2)
    draw.text((400, 443), btn_text, font=font_med, fill=C_WHITE, anchor="mm")

    save_screen(img, filename)


def main():
    print("Generating updated 800x480 screenshots with in-box 5s plots and CAN Watch Cockpit...")
    render_screen0_dashboard()

    # Screen 1: Steer
    np.random.seed(101)
    scmd = np.zeros(50)
    scmd[:15] = 10.0; scmd[15:35] = 22.0; scmd[35:] = 15.0
    sact = np.zeros(50)
    for i in range(1, 50):
        sact[i] = sact[i - 1] + (scmd[i] - sact[i - 1]) * 0.32 + np.random.normal(0, 0.12)
    render_actuator_screen(
        active_tab=1, title_code="SES", vcu_id="0x169", act_id="0x201",
        cmd_val_str="+15.0°", act_val_str="+14.7°",
        cmd_data=scmd, act_data=sact, data_min=-45.0, data_max=45.0,
        cmd_badge="TARGET SPEED: 200 °/s", act_badge="ACTUAL SPEED: 198 °/s",
        delta_str="Δ: 0.3°   [ TRACKING OK ]",
        sec_card_title="DRIVER COLUMN TORQUE", sec_card_val="+0.2 Nm", sec_card_sub="[ NO OVERRIDE ]",
        sec_card_col=C_AMBER,
        live_telemetry_1="MOTOR: 8.4 A  •  TEMP: 34°C",
        live_telemetry_2="ALIGNMENT: ZERO-POINT OK",
        btn_text="VIEW 15-SECOND FULL STEERING SCOPE PLOT (OR SWIPE DOWN) >",
        filename="screen1_steer_with_5s_plot"
    )

    # Screen 2: Brake
    np.random.seed(202)
    bcmd = np.full(50, 450.0); bcmd[:10] = 0.0
    bact = np.zeros(50)
    for i in range(1, 50):
        bact[i] = bact[i - 1] + (bcmd[i] - bact[i - 1]) * 0.28 + np.random.normal(0, 3.5)
    render_actuator_screen(
        active_tab=2, title_code="SEB", vcu_id="0x7B9", act_id="0x721",
        cmd_val_str="450 kPa", act_val_str="442 kPa",
        cmd_data=bcmd, act_data=bact, data_min=0.0, data_max=1200.0,
        cmd_badge="TARGET STROKE: 18.0 mm", act_badge="ACTUAL STROKE: 17.8 mm",
        delta_str="Δ: -8 kPa   [ TRACKING OK ]",
        sec_card_title="PISTON DISPLACEMENT", sec_card_val="17.8 mm", sec_card_sub="[ STROKE Δ: 0.2 mm OK ]",
        sec_card_col=C_SKY,
        live_telemetry_1="MOTOR: 4.2 A  •  TEMP: 38°C",
        live_telemetry_2="MODE: PRESSURE CLOSED-LOOP",
        btn_text="VIEW 15-SECOND FULL BRAKE PRESSURE SCOPE (OR SWIPE DOWN) >",
        filename="screen2_brake_with_5s_plot"
    )

    # Screen 3: Drive
    np.random.seed(303)
    dcmd = np.full(50, 15.0); dcmd[:10] = 5.0
    dact = np.zeros(50)
    for i in range(1, 50):
        dact[i] = dact[i - 1] + (dcmd[i] - dact[i - 1]) * 0.25 + np.random.normal(0, 0.08)
    render_actuator_screen(
        active_tab=3, title_code="MTR", vcu_id="0x204", act_id="0x206",
        cmd_val_str="15.0 km/h", act_val_str="14.8 km/h",
        cmd_data=dcmd, act_data=dact, data_min=0.0, data_max=35.0,
        cmd_badge="TARGET GEAR: [ D ] (DRIVE)", act_badge="ENGAGED GEAR: [ D ] (ENGAGED)",
        delta_str="Δ: 0.2 km/h   [ TRACKING OK ]",
        sec_card_title="SAFETY INTERLOCKS", sec_card_val="ALL CLEAR", sec_card_sub="[ BRAKE PRIORITY OK ]",
        sec_card_col=C_EMERALD,
        live_telemetry_1="MOTOR: 1,620 RPM  •  RATIO: 8.5:1",
        live_telemetry_2="STATE: RUN (0x03) • BRAKE CUTOUT: OK",
        btn_text="VIEW 15-SECOND FULL DRIVE SPEED SCOPE (OR SWIPE DOWN) >",
        filename="screen3_drive_with_5s_plot"
    )
    print("All screenshots generated successfully.")


if __name__ == "__main__":
    main()
