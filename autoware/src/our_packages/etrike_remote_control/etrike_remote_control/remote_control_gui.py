# Copyright 2026 E-Trike Dev. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""PySide6 Cockpit GUI for remote controlling the E-Trike through vehicle bridge."""

import math
import sys
from typing import Any, Dict, Optional, Set

try:
    from PySide6.QtCore import QEvent, QPoint, QRect, QSize, Qt, QTimer
    from PySide6.QtGui import QColor, QFont, QKeyEvent, QPainter, QPaintEvent, QPen
    from PySide6.QtWidgets import (
        QApplication,
        QCheckBox,
        QDoubleSpinBox,
        QFrame,
        QGridLayout,
        QGroupBox,
        QHBoxLayout,
        QLabel,
        QMainWindow,
        QProgressBar,
        QPushButton,
        QScrollArea,
        QSizePolicy,
        QSlider,
        QStatusBar,
        QVBoxLayout,
        QWidget,
    )
except ImportError:
    from PyQt5.QtCore import QEvent, QPoint, QRect, QSize, Qt, QTimer
    from PyQt5.QtGui import QColor, QFont, QKeyEvent, QPainter, QPaintEvent, QPen
    from PyQt5.QtWidgets import (
        QApplication,
        QCheckBox,
        QDoubleSpinBox,
        QFrame,
        QGridLayout,
        QGroupBox,
        QHBoxLayout,
        QLabel,
        QMainWindow,
        QProgressBar,
        QPushButton,
        QScrollArea,
        QSizePolicy,
        QSlider,
        QStatusBar,
        QVBoxLayout,
        QWidget,
    )

from etrike_remote_control.remote_control_node import (
    ControlModeConstants,
    GearConstants,
    HAS_ROS2,
    HazardLightsConstants,
    RemoteControlNode,
    TurnIndicatorsConstants,
)

# Optional rclpy init for main loop
if HAS_ROS2:
    import rclpy


class BipolarMeter(QWidget):
    """Custom bar widget displaying bipolar values (e.g., -max to +max steering angle)."""

    def __init__(
        self,
        min_val: float = -0.35,
        max_val: float = 0.35,
        title: str = "Steering",
        unit: str = "rad",
        parent: Optional[QWidget] = None,
    ) -> None:
        super().__init__(parent)
        self._min_val = min_val
        self._max_val = max_val
        self._value = 0.0
        self._title = title
        self._unit = unit
        self.setMinimumHeight(44)
        self.setMinimumWidth(220)

    def set_value(self, val: float) -> None:
        """Update current value and trigger repaint."""
        self._value = max(self._min_val, min(val, self._max_val))
        self.update()

    def paintEvent(self, event: QPaintEvent) -> None:  # pylint: disable=unused-argument
        """Draw bipolar horizontal bar."""
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)

        w = self.width()
        h = self.height()
        center_x = w / 2.0
        bar_y = 22
        bar_h = 16

        # Background track
        painter.setPen(Qt.NoPen)
        painter.setBrush(QColor("#252830"))
        painter.drawRoundedRect(QRect(4, bar_y, w - 8, bar_h), 4, 4)

        # Center line
        painter.setPen(QPen(QColor("#606674"), 2))
        painter.drawLine(int(center_x), bar_y - 2, int(center_x), bar_y + bar_h + 2)

        # Filled active region
        val_range = (self._max_val - self._min_val) / 2.0
        if val_range > 0:
            norm = self._value / val_range  # -1.0 to +1.0
            fill_w = int(norm * (center_x - 8))
            if fill_w > 0:
                painter.setBrush(QColor("#00bcd4"))
                painter.drawRoundedRect(QRect(int(center_x), bar_y + 2, fill_w, bar_h - 4), 3, 3)
            elif fill_w < 0:
                painter.setBrush(QColor("#ff9800"))
                painter.drawRoundedRect(QRect(int(center_x + fill_w), bar_y + 2, -fill_w, bar_h - 4), 3, 3)

        # Text labels
        painter.setPen(QColor("#e0e0e0"))
        painter.setFont(QFont("Segoe UI", 9, QFont.Bold))
        text = f"{self._title}: {self._value:+.3f} {self._unit} ({math.degrees(self._value):+.1f}°)"
        painter.drawText(8, 15, text)


class RemoteControlMainWindow(QMainWindow):
    """Main window for vehicle bridge remote teleoperation."""

    def __init__(self, node: RemoteControlNode) -> None:
        super().__init__()
        self.node = node
        self.setWindowTitle("E-Trike Remote Control Cockpit [Vehicle Bridge]")
        # Responsive sizing: adapt to screen geometry (e.g., 1366x768 Jetson display)
        self.setMinimumSize(880, 560)
        app = QApplication.instance()
        if app and app.primaryScreen():
            avail = app.primaryScreen().availableGeometry()
            # Fit within available screen bounds with margin for taskbar/panels
            target_w = min(1180, max(880, avail.width() - 40))
            target_h = min(720, max(560, avail.height() - 60))
            self.resize(target_w, target_h)
        else:
            self.resize(1050, 680)

        # Active key tracker for smooth keyboard driving
        self._pressed_keys: Set[int] = set()
        self._keyboard_enabled: bool = True
        self._auto_center_steering: bool = True
        self._auto_decelerate: bool = True
        self._cruise_mode: bool = False

        # Commanded setpoints
        self._cmd_speed: float = 0.0
        self._cmd_steering: float = 0.0
        self._target_forward_speed: float = 2.0  # m/s
        self._target_reverse_speed: float = 0.5  # m/s
        self._target_accel: float = 1.0  # m/s^2
        self._target_decel: float = 3.0  # m/s^2
        self._target_steer_limit: float = 0.314  # rad
        self._steer_rate: float = 0.6  # rad/s

        # Telemetry snapshot
        self._latest_telemetry: Dict[str, Any] = {}

        self._init_ui()
        self._apply_dark_theme()

        # Connect node publish hook to UI update
        self.node.set_publish_hook(self._on_node_telemetry)
        self.node.set_service_response_hook(self._on_service_response)

        # 50 Hz UI / Keyboard motion update timer
        self._timer_control = QTimer(self)
        self._timer_control.setInterval(20)  # 20ms = 50Hz
        self._timer_control.timeout.connect(self._update_motion_tick)
        self._timer_control.start()

        # 25 Hz ROS spin timer (if ROS 2 is running)
        self._timer_ros: Optional[QTimer] = None
        if HAS_ROS2:
            self._timer_ros = QTimer(self)
            self._timer_ros.setInterval(40)  # 40ms = 25Hz
            self._timer_ros.timeout.connect(self._spin_ros_tick)
            self._timer_ros.start()

    def _init_ui(self) -> None:
        """Construct cockpit widgets and layouts inside a dynamic scrollable area."""
        # Scroll area container ensures content is never clipped regardless of screen size
        scroll_area = QScrollArea(self)
        scroll_area.setWidgetResizable(True)
        scroll_area.setFrameShape(QFrame.NoFrame)
        scroll_area.setHorizontalScrollBarPolicy(Qt.ScrollBarAsNeeded)
        scroll_area.setVerticalScrollBarPolicy(Qt.ScrollBarAsNeeded)
        self.setCentralWidget(scroll_area)

        content_widget = QWidget()
        scroll_area.setWidget(content_widget)

        main_layout = QVBoxLayout(content_widget)
        main_layout.setContentsMargins(10, 8, 10, 8)
        main_layout.setSpacing(8)

        # 1. Top Status Banner
        main_layout.addWidget(self._create_top_banner())

        # 2. Main 2-column split (Left: Controls & Outputs, Right: Adjustment Bars & Telemetry)
        cols_layout = QHBoxLayout()
        cols_layout.setSpacing(10)

        left_col = QVBoxLayout()
        left_col.setSpacing(8)
        left_col.addWidget(self._create_safety_group())
        left_col.addWidget(self._create_gear_group())
        left_col.addWidget(self._create_signals_group())
        left_col.addWidget(self._create_dpad_group())
        left_col.addStretch()

        right_col = QVBoxLayout()
        right_col.setSpacing(8)
        right_col.addWidget(self._create_adjustments_group())
        right_col.addWidget(self._create_key_settings_group())
        right_col.addWidget(self._create_telemetry_group())
        right_col.addStretch()

        cols_layout.addLayout(left_col, 5)
        cols_layout.addLayout(right_col, 6)
        main_layout.addLayout(cols_layout)

        # Status Bar
        self.statusBar().showMessage(
            "Ready. Keyboard driving enabled (Arrows / Space). Node: "
            + ("ROS 2 Active" if HAS_ROS2 else "MOCK MODE (Standalone)")
        )

    # =========================================================================
    # Widget Construction
    # =========================================================================

    def _create_top_banner(self) -> QWidget:
        """Top banner showing high-level operational badges."""
        card = QFrame()
        card.setObjectName("topBanner")
        card.setFrameShape(QFrame.StyledPanel)
        layout = QHBoxLayout(card)
        layout.setContentsMargins(12, 8, 12, 8)

        title = QLabel("E-TRIKE REMOTE COCKPIT")
        title.setFont(QFont("Segoe UI", 13, QFont.Bold))
        layout.addWidget(title)

        layout.addStretch()

        self.lbl_badge_mode = QLabel("MODE: MANUAL")
        self.lbl_badge_mode.setObjectName("badgeMode")
        layout.addWidget(self.lbl_badge_mode)

        self.lbl_badge_engage = QLabel("DISENGAGED")
        self.lbl_badge_engage.setObjectName("badgeDisengaged")
        layout.addWidget(self.lbl_badge_engage)

        self.lbl_badge_estop = QLabel("E-STOP: CLEAR")
        self.lbl_badge_estop.setObjectName("badgeClear")
        layout.addWidget(self.lbl_badge_estop)

        self.lbl_badge_gear = QLabel("GEAR: PARK")
        self.lbl_badge_gear.setObjectName("badgeGear")
        layout.addWidget(self.lbl_badge_gear)

        backend_text = "ROS 2 [ONLINE]" if HAS_ROS2 else "MOCK [TEST]"
        self.lbl_badge_backend = QLabel(backend_text)
        self.lbl_badge_backend.setObjectName("badgeBackend")
        layout.addWidget(self.lbl_badge_backend)

        return card

    def _create_safety_group(self) -> QGroupBox:
        """Emergency Stop, Engage, and Mode request buttons."""
        box = QGroupBox("Vehicle State & Safety Outputs")
        layout = QGridLayout(box)
        layout.setSpacing(6)

        # Big ESTOP Button
        self.btn_estop_trigger = QPushButton("🛑 EMERGENCY STOP (Esc)")
        self.btn_estop_trigger.setObjectName("btnEstop")
        self.btn_estop_trigger.setMinimumHeight(38)
        self.btn_estop_trigger.clicked.connect(self._on_estop_trigger_clicked)
        layout.addWidget(self.btn_estop_trigger, 0, 0, 1, 2)

        self.btn_estop_clear = QPushButton("Reset / Clear E-Stop")
        self.btn_estop_clear.setObjectName("btnEstopClear")
        self.btn_estop_clear.setMinimumHeight(30)
        self.btn_estop_clear.clicked.connect(self._on_estop_clear_clicked)
        layout.addWidget(self.btn_estop_clear, 1, 0, 1, 2)

        # Engage / Disengage Buttons
        self.btn_engage = QPushButton("✔ Engage Vehicle (G)")
        self.btn_engage.setObjectName("btnEngage")
        self.btn_engage.setMinimumHeight(32)
        self.btn_engage.clicked.connect(self._on_engage_clicked)
        layout.addWidget(self.btn_engage, 2, 0)

        self.btn_disengage = QPushButton("✖ Disengage Vehicle")
        self.btn_disengage.setObjectName("btnDisengage")
        self.btn_disengage.setMinimumHeight(32)
        self.btn_disengage.clicked.connect(self._on_disengage_clicked)
        layout.addWidget(self.btn_disengage, 2, 1)

        # Mode Request Buttons
        self.btn_req_auto = QPushButton("Request Autonomous Mode")
        self.btn_req_auto.setObjectName("btnReqAuto")
        self.btn_req_auto.setMinimumHeight(30)
        self.btn_req_auto.clicked.connect(lambda: self._on_mode_request(ControlModeConstants.AUTONOMOUS))
        layout.addWidget(self.btn_req_auto, 3, 0)

        self.btn_req_manual = QPushButton("Request Manual Mode")
        self.btn_req_manual.setObjectName("btnReqManual")
        self.btn_req_manual.setMinimumHeight(30)
        self.btn_req_manual.clicked.connect(lambda: self._on_mode_request(ControlModeConstants.MANUAL))
        layout.addWidget(self.btn_req_manual, 3, 1)

        return box

    def _create_gear_group(self) -> QGroupBox:
        """Gear selection buttons for every gear output."""
        box = QGroupBox("Transmission Gear Outputs")
        layout = QHBoxLayout(box)
        layout.setSpacing(6)

        self.btn_gear_park = QPushButton("PARK (P)")
        self.btn_gear_rev = QPushButton("REV (R)")
        self.btn_gear_neu = QPushButton("NEU (N)")
        self.btn_gear_drive = QPushButton("DRIVE (D)")
        self.btn_gear_low = QPushButton("LOW (L)")

        for btn in (
            self.btn_gear_park,
            self.btn_gear_rev,
            self.btn_gear_neu,
            self.btn_gear_drive,
            self.btn_gear_low,
        ):
            btn.setCheckable(True)
            btn.setMinimumHeight(32)
            btn.setFont(QFont("Segoe UI", 9, QFont.Bold))
            layout.addWidget(btn)

        self.btn_gear_park.setChecked(True)

        self.btn_gear_park.clicked.connect(lambda: self._select_gear(GearConstants.PARK))
        self.btn_gear_rev.clicked.connect(lambda: self._select_gear(GearConstants.REVERSE))
        self.btn_gear_neu.clicked.connect(lambda: self._select_gear(GearConstants.NEUTRAL))
        self.btn_gear_drive.clicked.connect(lambda: self._select_gear(GearConstants.DRIVE))
        self.btn_gear_low.clicked.connect(lambda: self._select_gear(GearConstants.LOW))

        return box

    def _create_signals_group(self) -> QGroupBox:
        """Turn signals and hazard lights output buttons."""
        box = QGroupBox("Lighting & Signalling Outputs")
        layout = QHBoxLayout(box)
        layout.setSpacing(6)

        self.btn_turn_left = QPushButton("◄ Left (Q)")
        self.btn_turn_off = QPushButton("Off")
        self.btn_turn_right = QPushButton("Right ► (E)")
        self.btn_hazard = QPushButton("⚠️ Hazards (H)")

        self.btn_turn_left.setCheckable(True)
        self.btn_turn_off.setCheckable(True)
        self.btn_turn_right.setCheckable(True)
        self.btn_hazard.setCheckable(True)

        self.btn_turn_off.setChecked(True)

        self.btn_turn_left.clicked.connect(lambda: self._select_turn(TurnIndicatorsConstants.ENABLE_LEFT))
        self.btn_turn_off.clicked.connect(lambda: self._select_turn(TurnIndicatorsConstants.DISABLE))
        self.btn_turn_right.clicked.connect(lambda: self._select_turn(TurnIndicatorsConstants.ENABLE_RIGHT))
        self.btn_hazard.clicked.connect(self._toggle_hazard)

        for btn in (self.btn_turn_left, self.btn_turn_off, self.btn_turn_right, self.btn_hazard):
            btn.setMinimumHeight(30)
            layout.addWidget(btn)

        return box

    def _create_dpad_group(self) -> QGroupBox:
        """Directional drive buttons and instant brake."""
        box = QGroupBox("Directional Drive & Instant Brake")
        layout = QGridLayout(box)
        layout.setSpacing(6)

        self.btn_drive_fwd = QPushButton("▲ Forward (Up)")
        self.btn_drive_rev = QPushButton("▼ Reverse (Down)")
        self.btn_steer_l = QPushButton("◄ Steer Left (Left)")
        self.btn_steer_r = QPushButton("Steer Right ► (Right)")
        self.btn_center_steer = QPushButton("⨁ Center (C)")
        self.btn_zero_speed = QPushButton("⬛ Stop / 0 m/s")
        self.btn_instant_brake = QPushButton("🛑 BRAKE (Space)")

        self.btn_drive_fwd.setMinimumHeight(32)
        self.btn_drive_rev.setMinimumHeight(32)
        self.btn_steer_l.setMinimumHeight(32)
        self.btn_steer_r.setMinimumHeight(32)
        self.btn_center_steer.setMinimumHeight(32)
        self.btn_zero_speed.setMinimumHeight(32)
        self.btn_instant_brake.setMinimumHeight(36)
        self.btn_instant_brake.setObjectName("btnBrake")

        # Layout D-Pad
        layout.addWidget(self.btn_drive_fwd, 0, 1)
        layout.addWidget(self.btn_steer_l, 1, 0)
        layout.addWidget(self.btn_center_steer, 1, 1)
        layout.addWidget(self.btn_steer_r, 1, 2)
        layout.addWidget(self.btn_drive_rev, 2, 1)
        layout.addWidget(self.btn_zero_speed, 2, 0)
        layout.addWidget(self.btn_instant_brake, 3, 0, 1, 3)

        # Click actions (steps / pulses)
        self.btn_drive_fwd.clicked.connect(self._step_forward)
        self.btn_drive_rev.clicked.connect(self._step_reverse)
        self.btn_steer_l.clicked.connect(self._step_steer_left)
        self.btn_steer_r.clicked.connect(self._step_steer_right)
        self.btn_center_steer.clicked.connect(self._center_steering)
        self.btn_zero_speed.clicked.connect(self._zero_speed)
        self.btn_instant_brake.clicked.connect(self._instant_brake)

        return box

    def _create_adjustments_group(self) -> QGroupBox:
        """Sliders, bars, and meters to adjust speeds and acceleration."""
        box = QGroupBox("Velocity, Acceleration & Steering Adjustments")
        layout = QVBoxLayout(box)
        layout.setSpacing(10)

        # 1. Forward Speed Bar & Slider
        row_fwd = QHBoxLayout()
        row_fwd.addWidget(QLabel("Max Forward Speed:"))
        self.slider_fwd_speed = QSlider(Qt.Horizontal)
        self.slider_fwd_speed.setRange(10, 300)  # 0.10 to 3.00 m/s
        self.slider_fwd_speed.setValue(int(self._target_forward_speed * 100))
        self.spin_fwd_speed = QDoubleSpinBox()
        self.spin_fwd_speed.setRange(0.10, 3.00)
        self.spin_fwd_speed.setSingleStep(0.10)
        self.spin_fwd_speed.setValue(self._target_forward_speed)
        self.spin_fwd_speed.setSuffix(" m/s")
        self.lbl_fwd_kmh = QLabel(f"({self._target_forward_speed * 3.6:.1f} km/h)")

        self.slider_fwd_speed.valueChanged.connect(self._on_slider_fwd_changed)
        self.spin_fwd_speed.valueChanged.connect(self._on_spin_fwd_changed)

        row_fwd.addWidget(self.slider_fwd_speed, 1)
        row_fwd.addWidget(self.spin_fwd_speed)
        row_fwd.addWidget(self.lbl_fwd_kmh)
        layout.addLayout(row_fwd)

        # 2. Reverse Speed Bar & Slider
        row_rev = QHBoxLayout()
        row_rev.addWidget(QLabel("Max Reverse Speed:"))
        self.slider_rev_speed = QSlider(Qt.Horizontal)
        self.slider_rev_speed.setRange(10, 100)  # 0.10 to 1.00 m/s
        self.slider_rev_speed.setValue(int(self._target_reverse_speed * 100))
        self.spin_rev_speed = QDoubleSpinBox()
        self.spin_rev_speed.setRange(0.10, 1.00)
        self.spin_rev_speed.setSingleStep(0.05)
        self.spin_rev_speed.setValue(self._target_reverse_speed)
        self.spin_rev_speed.setSuffix(" m/s")

        self.slider_rev_speed.valueChanged.connect(self._on_slider_rev_changed)
        self.spin_rev_speed.valueChanged.connect(self._on_spin_rev_changed)

        row_rev.addWidget(self.slider_rev_speed, 1)
        row_rev.addWidget(self.spin_rev_speed)
        layout.addLayout(row_rev)

        # 3. Acceleration Rate Slider
        row_acc = QHBoxLayout()
        row_acc.addWidget(QLabel("Acceleration Rate:"))
        self.slider_accel = QSlider(Qt.Horizontal)
        self.slider_accel.setRange(10, 300)  # 0.1 to 3.0 m/s^2
        self.slider_accel.setValue(int(self._target_accel * 100))
        self.spin_accel = QDoubleSpinBox()
        self.spin_accel.setRange(0.1, 3.0)
        self.spin_accel.setSingleStep(0.1)
        self.spin_accel.setValue(self._target_accel)
        self.spin_accel.setSuffix(" m/s²")

        self.slider_accel.valueChanged.connect(self._on_slider_accel_changed)
        self.spin_accel.valueChanged.connect(self._on_spin_accel_changed)

        row_acc.addWidget(self.slider_accel, 1)
        row_acc.addWidget(self.spin_accel)
        layout.addLayout(row_acc)

        # 4. Deceleration / Brake Force Slider
        row_dec = QHBoxLayout()
        row_dec.addWidget(QLabel("Braking Deceleration:"))
        self.slider_decel = QSlider(Qt.Horizontal)
        self.slider_decel.setRange(50, 500)  # 0.5 to 5.0 m/s^2
        self.slider_decel.setValue(int(self._target_decel * 100))
        self.spin_decel = QDoubleSpinBox()
        self.spin_decel.setRange(0.5, 5.0)
        self.spin_decel.setSingleStep(0.2)
        self.spin_decel.setValue(self._target_decel)
        self.spin_decel.setSuffix(" m/s²")

        self.slider_decel.valueChanged.connect(self._on_slider_decel_changed)
        self.spin_decel.valueChanged.connect(self._on_spin_decel_changed)

        row_dec.addWidget(self.slider_decel, 1)
        row_dec.addWidget(self.spin_decel)
        layout.addLayout(row_dec)

        # 5. Steering Limit Slider
        row_steer_lim = QHBoxLayout()
        row_steer_lim.addWidget(QLabel("Max Steering Angle:"))
        self.slider_steer_limit = QSlider(Qt.Horizontal)
        self.slider_steer_limit.setRange(5, 35)  # 0.05 to 0.35 rad
        self.slider_steer_limit.setValue(int(self._target_steer_limit * 100))
        self.spin_steer_limit = QDoubleSpinBox()
        self.spin_steer_limit.setRange(0.05, 0.35)
        self.spin_steer_limit.setSingleStep(0.02)
        self.spin_steer_limit.setValue(self._target_steer_limit)
        self.spin_steer_limit.setSuffix(" rad")

        self.slider_steer_limit.valueChanged.connect(self._on_slider_steer_limit_changed)
        self.spin_steer_limit.valueChanged.connect(self._on_spin_steer_limit_changed)

        row_steer_lim.addWidget(self.slider_steer_limit, 1)
        row_steer_lim.addWidget(self.spin_steer_limit)
        layout.addLayout(row_steer_lim)

        # 6. Live Commanded Gauges (Visual Meters)
        layout.addWidget(QLabel("Live Commanded Output Meters:"))

        # Speed bar
        speed_box = QHBoxLayout()
        self.lbl_speed_val = QLabel("Speed: 0.00 m/s (0.0 km/h)")
        self.bar_speed = QProgressBar()
        self.bar_speed.setRange(0, 300)
        self.bar_speed.setValue(0)
        self.bar_speed.setTextVisible(False)
        speed_box.addWidget(self.lbl_speed_val)
        speed_box.addWidget(self.bar_speed, 1)
        layout.addLayout(speed_box)

        # Bipolar Steering bar
        self.meter_steering = BipolarMeter(
            min_val=-self._target_steer_limit,
            max_val=self._target_steer_limit,
            title="Steering Angle",
            unit="rad",
        )
        layout.addWidget(self.meter_steering)

        return box

    def _create_key_settings_group(self) -> QGroupBox:
        """Keyboard driving options and key bindings."""
        box = QGroupBox("Keyboard Teleop Driving Settings")
        layout = QHBoxLayout(box)

        self.chk_enable_keys = QCheckBox("Enable Keyboard Driving")
        self.chk_enable_keys.setChecked(True)
        self.chk_enable_keys.toggled.connect(self._on_toggle_keyboard)
        layout.addWidget(self.chk_enable_keys)

        self.chk_auto_center = QCheckBox("Auto-Center Steering (Release ←/→)")
        self.chk_auto_center.setChecked(True)
        self.chk_auto_center.toggled.connect(lambda v: setattr(self, "_auto_center_steering", v))
        layout.addWidget(self.chk_auto_center)

        self.chk_auto_decel = QCheckBox("Auto-Decelerate / Coast (Release ↑/↓)")
        self.chk_auto_decel.setChecked(True)
        self.chk_auto_decel.toggled.connect(lambda v: setattr(self, "_auto_decelerate", v))
        layout.addWidget(self.chk_auto_decel)

        return box

    def _create_telemetry_group(self) -> QGroupBox:
        """Command Telemetry Inspector showing all active ROS messages."""
        box = QGroupBox("Transmitted Command Stream Inspector (Fail-Closed Monitor)")
        layout = QGridLayout(box)
        layout.setSpacing(6)

        self.lbl_val_speed = QLabel("0.00 m/s (0.0 km/h)")
        self.lbl_val_accel = QLabel("0.00 m/s²")
        self.lbl_val_steer = QLabel("0.000 rad (0.0°)")
        self.lbl_val_gear = QLabel("PARK (22)")
        self.lbl_val_engage = QLabel("False")
        self.lbl_val_turn = QLabel("DISABLE (1)")
        self.lbl_val_hazard = QLabel("DISABLE (1)")
        self.lbl_val_estop = QLabel("CLEAR (False)")
        self.lbl_val_rate = QLabel(f"{self.node.publish_rate_hz:.1f} Hz")

        items = [
            ("Speed (/control_cmd):", self.lbl_val_speed),
            ("Acceleration (/control_cmd):", self.lbl_val_accel),
            ("Steering Angle (/control_cmd):", self.lbl_val_steer),
            ("Gear (/gear_cmd):", self.lbl_val_gear),
            ("Engage (/engage):", self.lbl_val_engage),
            ("Turn Signal (/turn_cmd):", self.lbl_val_turn),
            ("Hazards (/hazard_cmd):", self.lbl_val_hazard),
            ("Emergency Stop (/emergency_cmd):", self.lbl_val_estop),
            ("Publish Frequency:", self.lbl_val_rate),
        ]

        row = 0
        col = 0
        for title, val_lbl in items:
            lbl_title = QLabel(title)
            lbl_title.setStyleSheet("color: #9aa0a6;")
            val_lbl.setFont(QFont("Consolas", 10, QFont.Bold))
            layout.addWidget(lbl_title, row, col * 2)
            layout.addWidget(val_lbl, row, col * 2 + 1)
            row += 1
            if row > 4:
                row = 0
                col = 1

        return box

    # =========================================================================
    # Keyboard Event Handlers
    # =========================================================================

    def keyPressEvent(self, event: QKeyEvent) -> None:
        """Handle key press for smooth driving and hotkeys."""
        if not self._keyboard_enabled:
            super().keyPressEvent(event)
            return

        key = event.key()
        if not event.isAutoRepeat():
            self._pressed_keys.add(key)

        # Instant actions
        if key == Qt.Key_Space:
            self._instant_brake()
        elif key == Qt.Key_Escape:
            self._on_estop_trigger_clicked()
        elif key in (Qt.Key_P,):
            self._select_gear(GearConstants.PARK)
        elif key in (Qt.Key_R,):
            self._select_gear(GearConstants.REVERSE)
        elif key in (Qt.Key_N,):
            self._select_gear(GearConstants.NEUTRAL)
        elif key in (Qt.Key_D,):
            self._select_gear(GearConstants.DRIVE)
        elif key in (Qt.Key_L,):
            self._select_gear(GearConstants.LOW)
        elif key in (Qt.Key_Q,):
            self._select_turn(TurnIndicatorsConstants.ENABLE_LEFT)
        elif key in (Qt.Key_E,):
            self._select_turn(TurnIndicatorsConstants.ENABLE_RIGHT)
        elif key in (Qt.Key_H,):
            self._toggle_hazard()
        elif key in (Qt.Key_G, Qt.Key_Return, Qt.Key_Enter):
            # Toggle engage
            cur_engage = self.node.get_state_snapshot().engage
            self.node.set_engage(not cur_engage)
        elif key == Qt.Key_C:
            self._center_steering()

        super().keyPressEvent(event)

    def keyReleaseEvent(self, event: QKeyEvent) -> None:
        """Handle key release."""
        if not event.isAutoRepeat():
            self._pressed_keys.discard(event.key())
        super().keyReleaseEvent(event)

    # =========================================================================
    # Motion Control Loop (50 Hz)
    # =========================================================================

    def _update_motion_tick(self) -> None:
        """Smoothly ramp speed and steering based on pressed keys."""
        dt = 0.02  # 20ms = 0.02s
        snapshot = self.node.get_state_snapshot()

        if snapshot.emergency:
            self._cmd_speed = 0.0
            self._cmd_steering = 0.0
            self._update_meters(0.0, 0.0, 0.0)
            return

        if self._keyboard_enabled and not snapshot.emergency:
            # Check Arrow Keys & WASD
            up_pressed = Qt.Key_Up in self._pressed_keys or Qt.Key_W in self._pressed_keys
            down_pressed = Qt.Key_Down in self._pressed_keys or Qt.Key_S in self._pressed_keys
            left_pressed = Qt.Key_Left in self._pressed_keys or Qt.Key_A in self._pressed_keys
            right_pressed = Qt.Key_Right in self._pressed_keys or Qt.Key_D in self._pressed_keys
            space_pressed = Qt.Key_Space in self._pressed_keys

            # Speed handling
            if space_pressed:
                self._cmd_speed = 0.0
                accel = -self._target_decel
                braking = True
            elif up_pressed:
                # Accelerate forward
                self._cmd_speed = min(
                    self._target_forward_speed,
                    self._cmd_speed + self._target_accel * dt,
                )
                accel = self._target_accel
                braking = False
                # Auto switch to Drive gear if in Park/Neutral
                if snapshot.gear in (GearConstants.PARK, GearConstants.NEUTRAL):
                    self._select_gear(GearConstants.DRIVE)
            elif down_pressed:
                # Decelerate or reverse
                if self._cmd_speed > 0.05:
                    self._cmd_speed = max(0.0, self._cmd_speed - self._target_decel * dt)
                    accel = -self._target_decel
                    braking = True
                else:
                    # Reverse
                    self._cmd_speed = max(
                        -self._target_reverse_speed,
                        self._cmd_speed - self._target_accel * dt,
                    )
                    accel = -self._target_accel
                    braking = False
                    if snapshot.gear != GearConstants.REVERSE:
                        self._select_gear(GearConstants.REVERSE)
            else:
                # Neither up nor down pressed
                braking = False
                if self._auto_decelerate and abs(self._cmd_speed) > 0.01:
                    # Coast/brake to zero
                    step = self._target_decel * dt
                    if self._cmd_speed > 0:
                        self._cmd_speed = max(0.0, self._cmd_speed - step)
                    else:
                        self._cmd_speed = min(0.0, self._cmd_speed + step)
                    accel = -self._target_decel if self._cmd_speed > 0 else self._target_decel
                else:
                    accel = 0.0

            # Steering handling
            if left_pressed and not right_pressed:
                # Steer left (positive or left convention)
                self._cmd_steering = min(
                    self._target_steer_limit,
                    self._cmd_steering + self._steer_rate * dt,
                )
            elif right_pressed and not left_pressed:
                # Steer right (negative convention)
                self._cmd_steering = max(
                    -self._target_steer_limit,
                    self._cmd_steering - self._steer_rate * dt,
                )
            elif self._auto_center_steering and abs(self._cmd_steering) > 0.005:
                # Return to center
                steer_step = self._steer_rate * 1.5 * dt
                if self._cmd_steering > 0:
                    self._cmd_steering = max(0.0, self._cmd_steering - steer_step)
                else:
                    self._cmd_steering = min(0.0, self._cmd_steering + steer_step)
            elif self._auto_center_steering and abs(self._cmd_steering) <= 0.005:
                self._cmd_steering = 0.0

            # Push command to node
            self.node.set_motion(
                speed=self._cmd_speed,
                steering_angle=self._cmd_steering,
                acceleration=accel,
                is_braking=braking,
            )

        self._update_meters(self._cmd_speed, self._cmd_steering, snapshot.acceleration)

    def _spin_ros_tick(self) -> None:
        """Spin ROS 2 executor once non-blockingly."""
        if HAS_ROS2 and self.node is not None:
            rclpy.spin_once(self.node, timeout_sec=0.0)

    # =========================================================================
    # Step Pulses and Buttons
    # =========================================================================

    def _step_forward(self) -> None:
        """Step forward speed."""
        self._cmd_speed = min(self._target_forward_speed, self._cmd_speed + 0.3)
        self.node.set_motion(self._cmd_speed, self._cmd_steering, self._target_accel, False)
        if self.node.get_state_snapshot().gear in (GearConstants.PARK, GearConstants.NEUTRAL):
            self._select_gear(GearConstants.DRIVE)

    def _step_reverse(self) -> None:
        """Step reverse speed."""
        self._cmd_speed = max(-self._target_reverse_speed, self._cmd_speed - 0.2)
        self.node.set_motion(self._cmd_speed, self._cmd_steering, -self._target_accel, False)
        if self.node.get_state_snapshot().gear != GearConstants.REVERSE:
            self._select_gear(GearConstants.REVERSE)

    def _step_steer_left(self) -> None:
        """Step steer left."""
        self._cmd_steering = min(self._target_steer_limit, self._cmd_steering + 0.06)
        self.node.set_motion(self._cmd_speed, self._cmd_steering, 0.0, False)

    def _step_steer_right(self) -> None:
        """Step steer right."""
        self._cmd_steering = max(-self._target_steer_limit, self._cmd_steering - 0.06)
        self.node.set_motion(self._cmd_speed, self._cmd_steering, 0.0, False)

    def _center_steering(self) -> None:
        """Immediately center steering to 0 rad."""
        self._cmd_steering = 0.0
        self.node.set_motion(self._cmd_speed, 0.0, 0.0, False)

    def _zero_speed(self) -> None:
        """Immediately set speed to 0."""
        self._cmd_speed = 0.0
        self.node.set_motion(0.0, self._cmd_steering, 0.0, False)

    def _instant_brake(self) -> None:
        """Instant full brake."""
        self._cmd_speed = 0.0
        self.node.set_motion(0.0, self._cmd_steering, -self._target_decel, True)
        self.statusBar().showMessage("Brake Applied! Velocity cut to 0.0 m/s.")

    # =========================================================================
    # Safety, Mode & Outputs
    # =========================================================================

    def _on_estop_trigger_clicked(self) -> None:
        """Assert Emergency Stop."""
        self.node.set_emergency(True)
        self._cmd_speed = 0.0
        self._cmd_steering = 0.0
        self.lbl_badge_estop.setText("E-STOP: TRIGGERED!")
        self.lbl_badge_estop.setObjectName("badgeEstopActive")
        self.lbl_badge_engage.setText("DISENGAGED")
        self.lbl_badge_engage.setObjectName("badgeDisengaged")
        self._update_badge_styles()
        self.statusBar().showMessage("EMERGENCY STOP ASSERTED! Actuators disabled.")

    def _on_estop_clear_clicked(self) -> None:
        """Clear Emergency Stop."""
        self.node.set_emergency(False)
        self.lbl_badge_estop.setText("E-STOP: CLEAR")
        self.lbl_badge_estop.setObjectName("badgeClear")
        self._update_badge_styles()
        self.statusBar().showMessage("Emergency stop cleared. Ready to engage.")

    def _on_engage_clicked(self) -> None:
        """Engage vehicle."""
        snapshot = self.node.get_state_snapshot()
        if snapshot.emergency:
            self.statusBar().showMessage("Cannot engage: Emergency stop is active!")
            return
        self.node.set_engage(True)
        self.lbl_badge_engage.setText("ENGAGED")
        self.lbl_badge_engage.setObjectName("badgeEngaged")
        self._update_badge_styles()
        self.statusBar().showMessage("Vehicle ENGAGED. Direct commands active.")

    def _on_disengage_clicked(self) -> None:
        """Disengage vehicle."""
        self.node.set_engage(False)
        self.lbl_badge_engage.setText("DISENGAGED")
        self.lbl_badge_engage.setObjectName("badgeDisengaged")
        self._update_badge_styles()
        self.statusBar().showMessage("Vehicle DISENGAGED.")

    def _on_mode_request(self, mode: int) -> None:
        """Request Autonomous or Manual control mode."""
        mode_name = "AUTONOMOUS" if mode == ControlModeConstants.AUTONOMOUS else "MANUAL"
        self.statusBar().showMessage(f"Requesting {mode_name} control mode...")
        self.node.request_control_mode(mode)

    def _on_service_response(self, mode_str: str, success: bool) -> None:
        """Handle response from control mode service."""
        if success:
            self.lbl_badge_mode.setText(f"MODE: {mode_str}")
            self.statusBar().showMessage(f"Control mode set to {mode_str} successfully.")
        else:
            self.statusBar().showMessage(f"Control mode request failed: {mode_str}")

    def _select_gear(self, gear: int) -> None:
        """Update gear output."""
        self.node.set_gear(gear)
        gear_names = {
            GearConstants.PARK: "PARK",
            GearConstants.REVERSE: "REVERSE",
            GearConstants.NEUTRAL: "NEUTRAL",
            GearConstants.DRIVE: "DRIVE",
            GearConstants.LOW: "LOW",
        }
        name = gear_names.get(gear, "UNKNOWN")
        self.lbl_badge_gear.setText(f"GEAR: {name}")

        self.btn_gear_park.setChecked(gear == GearConstants.PARK)
        self.btn_gear_rev.setChecked(gear == GearConstants.REVERSE)
        self.btn_gear_neu.setChecked(gear == GearConstants.NEUTRAL)
        self.btn_gear_drive.setChecked(gear == GearConstants.DRIVE)
        self.btn_gear_low.setChecked(gear == GearConstants.LOW)

    def _select_turn(self, turn: int) -> None:
        """Update turn indicator output."""
        self.node.set_turn_indicators(turn)
        self.btn_turn_left.setChecked(turn == TurnIndicatorsConstants.ENABLE_LEFT)
        self.btn_turn_off.setChecked(turn == TurnIndicatorsConstants.DISABLE)
        self.btn_turn_right.setChecked(turn == TurnIndicatorsConstants.ENABLE_RIGHT)

    def _toggle_hazard(self) -> None:
        """Toggle hazard lights output."""
        cur_hazard = self.node.get_state_snapshot().hazard_lights
        new_hazard = (
            HazardLightsConstants.DISABLE
            if cur_hazard == HazardLightsConstants.ENABLE
            else HazardLightsConstants.ENABLE
        )
        self.node.set_hazard_lights(new_hazard)
        self.btn_hazard.setChecked(new_hazard == HazardLightsConstants.ENABLE)

    # =========================================================================
    # Sliders and Adjustments
    # =========================================================================

    def _on_slider_fwd_changed(self, val: int) -> None:
        speed = val / 100.0
        self.spin_fwd_speed.blockSignals(True)
        self.spin_fwd_speed.setValue(speed)
        self.spin_fwd_speed.blockSignals(False)
        self._target_forward_speed = speed
        self.lbl_fwd_kmh.setText(f"({speed * 3.6:.1f} km/h)")

    def _on_spin_fwd_changed(self, speed: float) -> None:
        self.slider_fwd_speed.blockSignals(True)
        self.slider_fwd_speed.setValue(int(speed * 100))
        self.slider_fwd_speed.blockSignals(False)
        self._target_forward_speed = speed
        self.lbl_fwd_kmh.setText(f"({speed * 3.6:.1f} km/h)")

    def _on_slider_rev_changed(self, val: int) -> None:
        speed = val / 100.0
        self.spin_rev_speed.blockSignals(True)
        self.spin_rev_speed.setValue(speed)
        self.spin_rev_speed.blockSignals(False)
        self._target_reverse_speed = speed

    def _on_spin_rev_changed(self, speed: float) -> None:
        self.slider_rev_speed.blockSignals(True)
        self.slider_rev_speed.setValue(int(speed * 100))
        self.slider_rev_speed.blockSignals(False)
        self._target_reverse_speed = speed

    def _on_slider_accel_changed(self, val: int) -> None:
        acc = val / 100.0
        self.spin_accel.blockSignals(True)
        self.spin_accel.setValue(acc)
        self.spin_accel.blockSignals(False)
        self._target_accel = acc

    def _on_spin_accel_changed(self, acc: float) -> None:
        self.slider_accel.blockSignals(True)
        self.slider_accel.setValue(int(acc * 100))
        self.slider_accel.blockSignals(False)
        self._target_accel = acc

    def _on_slider_decel_changed(self, val: int) -> None:
        dec = val / 100.0
        self.spin_decel.blockSignals(True)
        self.spin_decel.setValue(dec)
        self.spin_decel.blockSignals(False)
        self._target_decel = dec

    def _on_spin_decel_changed(self, dec: float) -> None:
        self.slider_decel.blockSignals(True)
        self.slider_decel.setValue(int(dec * 100))
        self.slider_decel.blockSignals(False)
        self._target_decel = dec

    def _on_slider_steer_limit_changed(self, val: int) -> None:
        lim = val / 100.0
        self.spin_steer_limit.blockSignals(True)
        self.spin_steer_limit.setValue(lim)
        self.spin_steer_limit.blockSignals(False)
        self._target_steer_limit = lim
        self.meter_steering._min_val = -lim
        self.meter_steering._max_val = lim

    def _on_spin_steer_limit_changed(self, lim: float) -> None:
        self.slider_steer_limit.blockSignals(True)
        self.slider_steer_limit.setValue(int(lim * 100))
        self.slider_steer_limit.blockSignals(False)
        self._target_steer_limit = lim
        self.meter_steering._min_val = -lim
        self.meter_steering._max_val = lim

    def _on_toggle_keyboard(self, checked: bool) -> None:
        self._keyboard_enabled = checked
        self._pressed_keys.clear()
        self.statusBar().showMessage(
            "Keyboard driving enabled" if checked else "Keyboard driving paused"
        )

    # =========================================================================
    # Telemetry and Meter Updates
    # =========================================================================

    def _update_meters(self, speed: float, steer: float, accel: float) -> None:
        """Update live graphical gauges."""
        self.lbl_speed_val.setText(f"Speed: {speed:+.2f} m/s ({speed * 3.6:+.1f} km/h)")
        self.bar_speed.setValue(int(abs(speed) * 100))
        self.meter_steering.set_value(steer)

    def _on_node_telemetry(self, data: Dict[str, Any]) -> None:
        """Update transmitted telemetry values in UI inspector."""
        speed = data.get("speed", 0.0)
        accel = data.get("acceleration", 0.0)
        steer = data.get("steering_angle", 0.0)
        gear = data.get("gear", 0)
        turn = data.get("turn_indicators", 0)
        hazard = data.get("hazard_lights", 0)
        engage = data.get("engage", False)
        emerg = data.get("emergency", False)

        gear_map = {
            GearConstants.PARK: "PARK (22)",
            GearConstants.REVERSE: "REVERSE (20)",
            GearConstants.NEUTRAL: "NEUTRAL (1)",
            GearConstants.DRIVE: "DRIVE (2)",
            GearConstants.LOW: "LOW (23)",
        }
        turn_map = {
            TurnIndicatorsConstants.DISABLE: "OFF (1)",
            TurnIndicatorsConstants.ENABLE_LEFT: "LEFT (2)",
            TurnIndicatorsConstants.ENABLE_RIGHT: "RIGHT (3)",
        }
        hazard_map = {
            HazardLightsConstants.DISABLE: "OFF (1)",
            HazardLightsConstants.ENABLE: "ON (2)",
        }

        self.lbl_val_speed.setText(f"{speed:+.2f} m/s ({speed * 3.6:+.1f} km/h)")
        self.lbl_val_accel.setText(f"{accel:+.2f} m/s²")
        self.lbl_val_steer.setText(f"{steer:+.3f} rad ({math.degrees(steer):+.1f}°)")
        self.lbl_val_gear.setText(gear_map.get(gear, f"{gear}"))
        self.lbl_val_engage.setText("TRUE (ENGAGED)" if engage else "False (Disengaged)")
        self.lbl_val_turn.setText(turn_map.get(turn, f"{turn}"))
        self.lbl_val_hazard.setText(hazard_map.get(hazard, f"{hazard}"))
        self.lbl_val_estop.setText("ACTIVE (True)" if emerg else "CLEAR (False)")

    # =========================================================================
    # Fail-Closed Cleanup on Window Close
    # =========================================================================

    def closeEvent(self, event: Any) -> None:  # pylint: disable=invalid-name
        """Fail-closed on exit: cut speed, apply full brake, disengage, deactivate."""
        self._pressed_keys.clear()
        self.node.deactivate_node()
        super().closeEvent(event)

    # =========================================================================
    # Styling and Theme
    # =========================================================================

    def _update_badge_styles(self) -> None:
        """Trigger re-evaluation of dynamic stylesheet properties."""
        self.style().unpolish(self.lbl_badge_estop)
        self.style().polish(self.lbl_badge_estop)
        self.style().unpolish(self.lbl_badge_engage)
        self.style().polish(self.lbl_badge_engage)

    def _apply_dark_theme(self) -> None:
        """Set modern dark automotive dashboard theme."""
        self.setStyleSheet(
            """
            QMainWindow, QWidget {
                background-color: #1a1c23;
                color: #e0e0e0;
                font-family: 'Segoe UI', sans-serif;
                font-size: 12px;
            }
            QGroupBox {
                border: 1px solid #333842;
                border-radius: 6px;
                margin-top: 8px;
                padding-top: 10px;
                font-weight: bold;
                color: #80cbc4;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                subcontrol-position: top left;
                padding: 0 6px;
            }
            #topBanner {
                background-color: #21252b;
                border: 1px solid #333842;
                border-radius: 8px;
            }
            #badgeMode, #badgeGear, #badgeBackend {
                background-color: #2d3139;
                color: #61afef;
                padding: 4px 10px;
                border-radius: 6px;
                font-weight: bold;
            }
            #badgeEngaged {
                background-color: #2e7d32;
                color: #ffffff;
                padding: 4px 10px;
                border-radius: 6px;
                font-weight: bold;
            }
            #badgeDisengaged {
                background-color: #424242;
                color: #b0bec5;
                padding: 4px 10px;
                border-radius: 6px;
                font-weight: bold;
            }
            #badgeClear {
                background-color: #1b5e20;
                color: #a5d6a7;
                padding: 4px 10px;
                border-radius: 6px;
                font-weight: bold;
            }
            #badgeEstopActive {
                background-color: #d32f2f;
                color: #ffffff;
                padding: 4px 10px;
                border-radius: 6px;
                font-weight: bold;
            }
            QPushButton {
                background-color: #2c313a;
                border: 1px solid #3e4451;
                border-radius: 6px;
                padding: 6px 12px;
                color: #dcdfe4;
                font-weight: 600;
            }
            QPushButton:hover {
                background-color: #3e4451;
            }
            QPushButton:pressed, QPushButton:checked {
                background-color: #4b5263;
                border-color: #61afef;
                color: #61afef;
            }
            #btnEstop {
                background-color: #c62828;
                color: white;
                font-size: 15px;
                border: none;
            }
            #btnEstop:hover {
                background-color: #e53935;
            }
            #btnEstopClear {
                background-color: #37474f;
                color: #eceff1;
            }
            #btnEngage {
                background-color: #2e7d32;
                color: white;
            }
            #btnEngage:hover {
                background-color: #388e3c;
            }
            #btnDisengage {
                background-color: #455a64;
                color: white;
            }
            #btnBrake {
                background-color: #b71c1c;
                color: white;
                font-size: 14px;
            }
            #btnBrake:hover {
                background-color: #d32f2f;
            }
            QSlider::groove:horizontal {
                height: 6px;
                background: #282c34;
                border-radius: 3px;
            }
            QSlider::sub-page:horizontal {
                background: #61afef;
                border-radius: 3px;
            }
            QSlider::handle:horizontal {
                background: #dcdfe4;
                border: 1px solid #5c6370;
                width: 14px;
                margin-top: -4px;
                margin-bottom: -4px;
                border-radius: 7px;
            }
            QDoubleSpinBox {
                background-color: #21252b;
                border: 1px solid #3e4451;
                border-radius: 4px;
                padding: 2px 6px;
                color: #e0e0e0;
            }
            QProgressBar {
                border: 1px solid #333842;
                border-radius: 4px;
                background-color: #21252b;
                height: 14px;
            }
            QProgressBar::chunk {
                background-color: #98c379;
                border-radius: 3px;
            }
            QStatusBar {
                background-color: #1e2227;
                color: #abb2bf;
                border-top: 1px solid #282c34;
            }
            """
        )


def main(args: Optional[list[str]] = None) -> None:
    """Launch PySide6 GUI and ROS 2 lifecycle node."""
    if HAS_ROS2:
        rclpy.init(args=args)

    app = QApplication(sys.argv if args is None else [sys.argv[0]] + args)

    node = RemoteControlNode()
    node.activate_node()

    window = RemoteControlMainWindow(node)
    window.show()

    try:
        sys.exit(app.exec())
    finally:
        node.deactivate_node()
        if HAS_ROS2:
            node.destroy_node()
            rclpy.shutdown()


if __name__ == "__main__":
    main()
