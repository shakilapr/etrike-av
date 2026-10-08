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

"""PySide6 / PyQt5 Cockpit GUI for remote controlling the E-Trike through vehicle bridge."""

import math
import sys
from typing import Any, Dict, Optional, Set

try:
    from PySide6.QtCore import QEvent, Qt, QTimer
    from PySide6.QtGui import QFont, QKeyEvent
    from PySide6.QtWidgets import (
        QApplication,
        QButtonGroup,
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
    from PyQt5.QtCore import QEvent, Qt, QTimer
    from PyQt5.QtGui import QFont, QKeyEvent
    from PyQt5.QtWidgets import (
        QApplication,
        QButtonGroup,
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


class RemoteControlMainWindow(QMainWindow):
    """Main cockpit window for vehicle bridge remote teleoperation."""

    def __init__(self, node: RemoteControlNode) -> None:
        super().__init__()
        self.node = node
        self.setWindowTitle("E-Trike Remote Control Cockpit [Vehicle Bridge]")

        # Dynamic screen adaptation: fit within 1366x768 Jetson monitor bounds cleanly
        self.setMinimumSize(840, 520)
        app = QApplication.instance()
        if app and app.primaryScreen():
            avail = app.primaryScreen().availableGeometry()
            target_w = min(1220, max(840, avail.width() - 40))
            target_h = min(680, max(520, avail.height() - 50))
            self.resize(target_w, target_h)
        else:
            self.resize(1100, 640)

        # Active input trackers: dual mouse press-and-hold & keyboard driving
        self._pressed_keys: Set[int] = set()
        self._mouse_states: Dict[str, bool] = {
            "fwd": False,
            "rev": False,
            "left": False,
            "right": False,
            "brake": False,
        }
        self._keyboard_enabled: bool = True
        self._auto_center_steering: bool = True
        self._auto_decelerate: bool = True

        # Commanded setpoints & authority limits
        self._cmd_speed: float = 0.0
        self._cmd_steering: float = 0.0
        self._target_forward_speed: float = 2.0  # m/s
        self._target_reverse_speed: float = 0.5  # m/s
        self._target_accel: float = 1.0  # m/s^2
        self._target_decel: float = 3.0  # m/s^2
        self._target_steer_limit: float = 0.314  # rad (~18 deg)
        self._steer_rate: float = 0.6  # rad/s

        self._init_ui()
        self._apply_dark_theme()

        # Connect node hooks
        self.node.set_publish_hook(self._on_node_telemetry)
        self.node.set_service_response_hook(self._on_service_response)

        # 50 Hz Motion control loop (20ms)
        self._timer_control = QTimer(self)
        self._timer_control.setInterval(20)
        self._timer_control.timeout.connect(self._update_motion_tick)
        self._timer_control.start()

        # 25 Hz ROS spin timer (if ROS 2 is active)
        self._timer_ros: Optional[QTimer] = None
        if HAS_ROS2:
            self._timer_ros = QTimer(self)
            self._timer_ros.setInterval(40)
            self._timer_ros.timeout.connect(self._spin_ros_tick)
            self._timer_ros.start()

    def _init_ui(self) -> None:
        """Construct balanced cockpit interface with zero feedback clutter."""
        # Scroll area container prevents clipping if window is scaled down
        scroll_area = QScrollArea(self)
        scroll_area.setWidgetResizable(True)
        scroll_area.setFrameShape(QFrame.NoFrame)
        scroll_area.setHorizontalScrollBarPolicy(Qt.ScrollBarAsNeeded)
        scroll_area.setVerticalScrollBarPolicy(Qt.ScrollBarAsNeeded)
        self.setCentralWidget(scroll_area)

        content_widget = QWidget()
        scroll_area.setWidget(content_widget)

        main_layout = QVBoxLayout(content_widget)
        main_layout.setContentsMargins(10, 6, 10, 6)
        main_layout.setSpacing(6)

        # 1. Top Operational Status Bar
        main_layout.addWidget(self._create_top_banner())

        # 2. Balanced 2-Column Layout (4:5 Proportional Split)
        # Left: Powertrain, Safety & Driving Options | Right: Directional D-Pad & Dynamics Sliders
        cols_layout = QHBoxLayout()
        cols_layout.setSpacing(10)

        left_col = QVBoxLayout()
        left_col.setSpacing(6)
        left_col.addWidget(self._create_safety_group())
        left_col.addWidget(self._create_gear_group())
        left_col.addWidget(self._create_signals_group())
        left_col.addWidget(self._create_key_settings_group())
        left_col.addStretch(1)

        right_col = QVBoxLayout()
        right_col.setSpacing(6)
        right_col.addWidget(self._create_dpad_group())
        right_col.addWidget(self._create_adjustments_group())
        right_col.addStretch(1)

        cols_layout.addLayout(left_col, 4)
        cols_layout.addLayout(right_col, 5)
        main_layout.addLayout(cols_layout)

        # 3. Live Transmitted Actuation Stream (CAN & Bridge Telemetry)
        main_layout.addWidget(self._create_telemetry_group())

        # Bottom Status Bar
        self.statusBar().showMessage(
            "Ready. Dual Driving Enabled: Keyboard (Arrows / WASD / Space) & Mouse (Press-and-Hold / Click)."
        )

        # Strip keyboard focus from buttons and checkboxes so mouse clicks never steal focus
        for btn in self.findChildren(QPushButton):
            btn.setFocusPolicy(Qt.NoFocus)
        for chk in self.findChildren(QCheckBox):
            chk.setFocusPolicy(Qt.NoFocus)

    # =========================================================================
    # Widget Construction: Top Banner & Left Column (Operations & Powertrain)
    # =========================================================================

    def _create_top_banner(self) -> QWidget:
        """Compact operational status badges."""
        card = QFrame()
        card.setObjectName("topBanner")
        card.setFrameShape(QFrame.StyledPanel)
        layout = QHBoxLayout(card)
        layout.setContentsMargins(12, 6, 12, 6)
        layout.setSpacing(8)

        title = QLabel("E-TRIKE REMOTE COCKPIT")
        title.setFont(QFont("Segoe UI", 12, QFont.Bold))
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

        backend_text = "ROS 2 [ONLINE]" if HAS_ROS2 else "STANDALONE"
        self.lbl_badge_backend = QLabel(backend_text)
        self.lbl_badge_backend.setObjectName("badgeBackend")
        layout.addWidget(self.lbl_badge_backend)

        return card

    def _create_safety_group(self) -> QGroupBox:
        """Safety interlocks, Engage / Disengage, and Autonomous / Manual mode requests."""
        box = QGroupBox("Vehicle Safety && Operation Authority")
        layout = QVBoxLayout(box)
        layout.setSpacing(6)
        layout.setContentsMargins(10, 8, 10, 8)

        # Primary Emergency Stop Button (prominent tactile target)
        self.btn_estop_trigger = QPushButton("■ EMERGENCY STOP (Esc)")
        self.btn_estop_trigger.setObjectName("btnEstop")
        self.btn_estop_trigger.setMinimumHeight(38)
        self.btn_estop_trigger.setFont(QFont("Segoe UI", 10, QFont.Bold))
        self.btn_estop_trigger.clicked.connect(self._on_estop_trigger_clicked)
        layout.addWidget(self.btn_estop_trigger)

        # Clear E-Stop Button
        self.btn_estop_clear = QPushButton("Reset / Clear Emergency Stop")
        self.btn_estop_clear.setObjectName("btnEstopClear")
        self.btn_estop_clear.setMinimumHeight(28)
        self.btn_estop_clear.clicked.connect(self._on_estop_clear_clicked)
        layout.addWidget(self.btn_estop_clear)

        # Engage / Disengage Row
        row_engage = QHBoxLayout()
        row_engage.setSpacing(6)

        self.btn_engage = QPushButton("✔ Engage Vehicle (G)")
        self.btn_engage.setObjectName("btnEngage")
        self.btn_engage.setMinimumHeight(32)
        self.btn_engage.setFont(QFont("Segoe UI", 9, QFont.Bold))
        self.btn_engage.clicked.connect(self._on_engage_clicked)
        row_engage.addWidget(self.btn_engage)

        self.btn_disengage = QPushButton("✖ Disengage Vehicle")
        self.btn_disengage.setObjectName("btnDisengage")
        self.btn_disengage.setMinimumHeight(32)
        self.btn_disengage.setFont(QFont("Segoe UI", 9, QFont.Bold))
        self.btn_disengage.clicked.connect(self._on_disengage_clicked)
        row_engage.addWidget(self.btn_disengage)

        layout.addLayout(row_engage)

        # Control Mode Row
        row_mode = QHBoxLayout()
        row_mode.setSpacing(6)

        self.btn_req_auto = QPushButton("Autonomous Mode")
        self.btn_req_auto.setObjectName("btnReqAuto")
        self.btn_req_auto.setMinimumHeight(28)
        self.btn_req_auto.clicked.connect(
            lambda: self._on_mode_request(ControlModeConstants.AUTONOMOUS)
        )
        row_mode.addWidget(self.btn_req_auto)

        self.btn_req_manual = QPushButton("Manual Mode")
        self.btn_req_manual.setObjectName("btnReqManual")
        self.btn_req_manual.setMinimumHeight(28)
        self.btn_req_manual.clicked.connect(
            lambda: self._on_mode_request(ControlModeConstants.MANUAL)
        )
        row_mode.addWidget(self.btn_req_manual)

        layout.addLayout(row_mode)
        return box

    def _create_gear_group(self) -> QGroupBox:
        """Exclusive transmission gear selector buttons."""
        box = QGroupBox("Transmission Gear Selection")
        layout = QHBoxLayout(box)
        layout.setSpacing(6)
        layout.setContentsMargins(10, 8, 10, 8)

        self.btn_gear_park = QPushButton("PARK (P)")
        self.btn_gear_rev = QPushButton("REV (R)")
        self.btn_gear_neu = QPushButton("NEU (N)")
        self.btn_gear_drive = QPushButton("DRIVE (D)")
        self.btn_gear_low = QPushButton("LOW (L)")

        self._gear_group = QButtonGroup(self)
        self._gear_group.setExclusive(True)

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
            self._gear_group.addButton(btn)
            layout.addWidget(btn)

        self.btn_gear_park.setChecked(True)

        self.btn_gear_park.clicked.connect(lambda: self._select_gear(GearConstants.PARK))
        self.btn_gear_rev.clicked.connect(lambda: self._select_gear(GearConstants.REVERSE))
        self.btn_gear_neu.clicked.connect(lambda: self._select_gear(GearConstants.NEUTRAL))
        self.btn_gear_drive.clicked.connect(lambda: self._select_gear(GearConstants.DRIVE))
        self.btn_gear_low.clicked.connect(lambda: self._select_gear(GearConstants.LOW))

        return box

    def _create_signals_group(self) -> QGroupBox:
        """Lighting and signalling toggles."""
        box = QGroupBox("Lighting && Signalling Controls")
        layout = QHBoxLayout(box)
        layout.setSpacing(6)
        layout.setContentsMargins(10, 8, 10, 8)

        self.btn_turn_left = QPushButton("◄ Left (Q)")
        self.btn_turn_off = QPushButton("Off")
        self.btn_turn_right = QPushButton("Right ► (E)")
        self.btn_hazard = QPushButton("▲ Hazards (H)")

        for btn in (
            self.btn_turn_left,
            self.btn_turn_off,
            self.btn_turn_right,
            self.btn_hazard,
        ):
            btn.setCheckable(True)
            btn.setMinimumHeight(30)
            btn.setFont(QFont("Segoe UI", 9, QFont.Bold))
            layout.addWidget(btn)

        self.btn_turn_off.setChecked(True)

        self.btn_turn_left.clicked.connect(
            lambda: self._toggle_turn(TurnIndicatorsConstants.ENABLE_LEFT)
        )
        self.btn_turn_off.clicked.connect(
            lambda: self._select_turn(TurnIndicatorsConstants.DISABLE)
        )
        self.btn_turn_right.clicked.connect(
            lambda: self._toggle_turn(TurnIndicatorsConstants.ENABLE_RIGHT)
        )
        self.btn_hazard.clicked.connect(self._toggle_hazard)

        return box

    # =========================================================================
    # Widget Construction: Right Column (Motion Controls & Dynamics)
    # =========================================================================

    def _create_dpad_group(self) -> QGroupBox:
        """Directional driving cockpit with dual mouse press-and-hold & keyboard driving."""
        box = QGroupBox("Directional Drive Cockpit (Mouse Press-and-Hold && Hotkeys)")
        layout = QGridLayout(box)
        layout.setSpacing(4)
        layout.setContentsMargins(8, 8, 8, 6)

        self.btn_drive_fwd = QPushButton("▲ Forward (W / ↑)")
        self.btn_drive_rev = QPushButton("▼ Reverse (S / ↓)")
        self.btn_steer_l = QPushButton("◄ Steer Left (A / ←)")
        self.btn_steer_r = QPushButton("Steer Right ► (D / →)")
        self.btn_center_steer = QPushButton("⨁ Center (C)")
        self.btn_zero_speed = QPushButton("■ Stop (0 m/s)")
        self.btn_instant_brake = QPushButton("■ FULL INSTANT BRAKE (Space)")

        # Direct Steering Angle Setpoint & Hold Buttons
        self.btn_preset_m5 = QPushButton("◄ -5° Trim")
        self.btn_preset_p5 = QPushButton("+5° Trim ►")
        self.btn_preset_m10 = QPushButton("◄ -10° Hold")
        self.btn_preset_p10 = QPushButton("+10° Hold ►")

        self.spin_steer_angle = QDoubleSpinBox()
        max_deg = math.degrees(self._target_steer_limit)
        self.spin_steer_angle.setRange(-max_deg, max_deg)
        self.spin_steer_angle.setSingleStep(1.0)
        self.spin_steer_angle.setDecimals(1)
        self.spin_steer_angle.setValue(0.0)
        self.spin_steer_angle.setSuffix("°")
        self.spin_steer_angle.setAlignment(Qt.AlignCenter)
        self.spin_steer_angle.setFocusPolicy(Qt.ClickFocus)

        self.btn_toggle_autocenter = QPushButton("✔ Auto-Center: ON (X)")
        self.btn_toggle_autocenter.setStyleSheet("color: #98c379; font-weight: bold;")

        self.btn_drive_fwd.setMinimumHeight(34)
        self.btn_drive_rev.setMinimumHeight(32)
        self.btn_steer_l.setMinimumHeight(32)
        self.btn_steer_r.setMinimumHeight(32)
        self.btn_center_steer.setMinimumHeight(32)
        self.btn_zero_speed.setMinimumHeight(32)
        self.btn_zero_speed.setObjectName("btnStop")
        self.btn_preset_m5.setMinimumHeight(28)
        self.btn_preset_p5.setMinimumHeight(28)
        self.btn_preset_m10.setMinimumHeight(28)
        self.btn_preset_p10.setMinimumHeight(28)
        self.spin_steer_angle.setMinimumHeight(28)
        self.btn_toggle_autocenter.setMinimumHeight(32)
        self.btn_instant_brake.setMinimumHeight(36)

        self.btn_instant_brake.setObjectName("btnBrake")
        self.btn_instant_brake.setFont(QFont("Segoe UI", 10, QFont.Bold))

        for btn in (
            self.btn_preset_m5,
            self.btn_drive_fwd,
            self.btn_preset_p5,
            self.btn_drive_rev,
            self.btn_steer_l,
            self.btn_steer_r,
            self.btn_center_steer,
            self.btn_zero_speed,
            self.btn_preset_m10,
            self.btn_preset_p10,
            self.btn_toggle_autocenter,
        ):
            btn.setFont(QFont("Segoe UI", 9, QFont.Bold))

        # Grid placement:
        # Row 0: -5° Trim, Forward, +5° Trim
        layout.addWidget(self.btn_preset_m5, 0, 0)
        layout.addWidget(self.btn_drive_fwd, 0, 1)
        layout.addWidget(self.btn_preset_p5, 0, 2)
        # Row 1: Left, Center, Right
        layout.addWidget(self.btn_steer_l, 1, 0)
        layout.addWidget(self.btn_center_steer, 1, 1)
        layout.addWidget(self.btn_steer_r, 1, 2)
        # Row 2: -10° Hold, Steer Angle Spinbox, +10° Hold
        layout.addWidget(self.btn_preset_m10, 2, 0)
        layout.addWidget(self.spin_steer_angle, 2, 1)
        layout.addWidget(self.btn_preset_p10, 2, 2)
        # Row 3: Stop, Reverse, Auto-Center Toggle
        layout.addWidget(self.btn_zero_speed, 3, 0)
        layout.addWidget(self.btn_drive_rev, 3, 1)
        layout.addWidget(self.btn_toggle_autocenter, 3, 2)
        # Row 4: Full Instant Brake
        layout.addWidget(self.btn_instant_brake, 4, 0, 1, 3)

        # Mouse press-and-hold connections for continuous smooth driving
        self.btn_drive_fwd.pressed.connect(lambda: self._set_mouse_motion("fwd", True))
        self.btn_drive_fwd.released.connect(lambda: self._set_mouse_motion("fwd", False))

        self.btn_drive_rev.pressed.connect(lambda: self._set_mouse_motion("rev", True))
        self.btn_drive_rev.released.connect(lambda: self._set_mouse_motion("rev", False))

        self.btn_steer_l.pressed.connect(lambda: self._set_mouse_motion("left", True))
        self.btn_steer_l.released.connect(lambda: self._set_mouse_motion("left", False))

        self.btn_steer_r.pressed.connect(lambda: self._set_mouse_motion("right", True))
        self.btn_steer_r.released.connect(lambda: self._set_mouse_motion("right", False))

        self.btn_instant_brake.pressed.connect(lambda: self._set_mouse_motion("brake", True))
        self.btn_instant_brake.released.connect(lambda: self._set_mouse_motion("brake", False))

        # Steering Hold Presets and Direct Adjustment
        self.btn_preset_m5.clicked.connect(lambda: self._set_steer_degrees(-5.0))
        self.btn_preset_p5.clicked.connect(lambda: self._set_steer_degrees(5.0))
        self.btn_preset_m10.clicked.connect(lambda: self._set_steer_degrees(-10.0))
        self.btn_preset_p10.clicked.connect(lambda: self._set_steer_degrees(10.0))
        self.spin_steer_angle.valueChanged.connect(self._on_spin_steer_angle_changed)
        self.btn_toggle_autocenter.clicked.connect(self._toggle_auto_center)

        # Discrete click actions
        self.btn_center_steer.clicked.connect(self._center_steering)
        self.btn_zero_speed.clicked.connect(self._zero_speed)
        self.btn_instant_brake.clicked.connect(self._instant_brake)

        return box

    def _create_adjustments_group(self) -> QGroupBox:
        """Dynamics authority sliders and spinboxes aligned in a unified grid."""
        box = QGroupBox("Speed, Acceleration && Steering Authority")
        layout = QGridLayout(box)
        layout.setSpacing(3)
        layout.setContentsMargins(8, 6, 8, 6)

        # 1. Forward Speed
        lbl_fwd = QLabel("Max Forward Speed:")
        self.slider_fwd_speed = QSlider(Qt.Horizontal)
        self.slider_fwd_speed.setRange(10, 300)
        self.slider_fwd_speed.setValue(int(self._target_forward_speed * 100))
        self.slider_fwd_speed.setFocusPolicy(Qt.ClickFocus)

        self.spin_fwd_speed = QDoubleSpinBox()
        self.spin_fwd_speed.setRange(0.10, 3.00)
        self.spin_fwd_speed.setSingleStep(0.10)
        self.spin_fwd_speed.setValue(self._target_forward_speed)
        self.spin_fwd_speed.setSuffix(" m/s")
        self.spin_fwd_speed.setFixedWidth(90)
        self.spin_fwd_speed.setFocusPolicy(Qt.ClickFocus)

        self.lbl_fwd_kmh = QLabel(f"({self._target_forward_speed * 3.6:.1f} km/h)")
        self.lbl_fwd_kmh.setFixedWidth(64)

        self.slider_fwd_speed.valueChanged.connect(self._on_slider_fwd_changed)
        self.spin_fwd_speed.valueChanged.connect(self._on_spin_fwd_changed)

        layout.addWidget(lbl_fwd, 0, 0)
        layout.addWidget(self.slider_fwd_speed, 0, 1)
        layout.addWidget(self.spin_fwd_speed, 0, 2)
        layout.addWidget(self.lbl_fwd_kmh, 0, 3)

        # 2. Reverse Speed
        lbl_rev = QLabel("Max Reverse Speed:")
        self.slider_rev_speed = QSlider(Qt.Horizontal)
        self.slider_rev_speed.setRange(10, 100)
        self.slider_rev_speed.setValue(int(self._target_reverse_speed * 100))
        self.slider_rev_speed.setFocusPolicy(Qt.ClickFocus)

        self.spin_rev_speed = QDoubleSpinBox()
        self.spin_rev_speed.setRange(0.10, 1.00)
        self.spin_rev_speed.setSingleStep(0.05)
        self.spin_rev_speed.setValue(self._target_reverse_speed)
        self.spin_rev_speed.setSuffix(" m/s")
        self.spin_rev_speed.setFixedWidth(90)
        self.spin_rev_speed.setFocusPolicy(Qt.ClickFocus)

        self.lbl_rev_kmh = QLabel(f"({self._target_reverse_speed * 3.6:.1f} km/h)")
        self.lbl_rev_kmh.setFixedWidth(64)

        self.slider_rev_speed.valueChanged.connect(self._on_slider_rev_changed)
        self.spin_rev_speed.valueChanged.connect(self._on_spin_rev_changed)

        layout.addWidget(lbl_rev, 1, 0)
        layout.addWidget(self.slider_rev_speed, 1, 1)
        layout.addWidget(self.spin_rev_speed, 1, 2)
        layout.addWidget(self.lbl_rev_kmh, 1, 3)

        # 3. Acceleration Rate
        lbl_acc = QLabel("Acceleration Rate:")
        self.slider_accel = QSlider(Qt.Horizontal)
        self.slider_accel.setRange(10, 300)
        self.slider_accel.setValue(int(self._target_accel * 100))
        self.slider_accel.setFocusPolicy(Qt.ClickFocus)

        self.spin_accel = QDoubleSpinBox()
        self.spin_accel.setRange(0.1, 3.0)
        self.spin_accel.setSingleStep(0.1)
        self.spin_accel.setValue(self._target_accel)
        self.spin_accel.setSuffix(" m/s²")
        self.spin_accel.setFixedWidth(90)
        self.spin_accel.setFocusPolicy(Qt.ClickFocus)

        self.lbl_acc_unit = QLabel(f"(~{self._target_accel / 9.81:.2f}g)")
        self.lbl_acc_unit.setFixedWidth(64)

        self.slider_accel.valueChanged.connect(self._on_slider_accel_changed)
        self.spin_accel.valueChanged.connect(self._on_spin_accel_changed)

        layout.addWidget(lbl_acc, 2, 0)
        layout.addWidget(self.slider_accel, 2, 1)
        layout.addWidget(self.spin_accel, 2, 2)
        layout.addWidget(self.lbl_acc_unit, 2, 3)

        # 4. Deceleration / Brake Force
        lbl_dec = QLabel("Braking Deceleration:")
        self.slider_decel = QSlider(Qt.Horizontal)
        self.slider_decel.setRange(50, 500)
        self.slider_decel.setValue(int(self._target_decel * 100))
        self.slider_decel.setFocusPolicy(Qt.ClickFocus)

        self.spin_decel = QDoubleSpinBox()
        self.spin_decel.setRange(0.5, 5.0)
        self.spin_decel.setSingleStep(0.2)
        self.spin_decel.setValue(self._target_decel)
        self.spin_decel.setSuffix(" m/s²")
        self.spin_decel.setFixedWidth(90)
        self.spin_decel.setFocusPolicy(Qt.ClickFocus)

        self.lbl_dec_unit = QLabel(f"(~{self._target_decel / 9.81:.2f}g)")
        self.lbl_dec_unit.setFixedWidth(64)

        self.slider_decel.valueChanged.connect(self._on_slider_decel_changed)
        self.spin_decel.valueChanged.connect(self._on_spin_decel_changed)

        layout.addWidget(lbl_dec, 3, 0)
        layout.addWidget(self.slider_decel, 3, 1)
        layout.addWidget(self.spin_decel, 3, 2)
        layout.addWidget(self.lbl_dec_unit, 3, 3)

        # 5. Steering Angle Limit
        lbl_steer = QLabel("Max Steering Angle:")
        self.slider_steer_limit = QSlider(Qt.Horizontal)
        self.slider_steer_limit.setRange(5, 35)
        self.slider_steer_limit.setValue(int(self._target_steer_limit * 100))
        self.slider_steer_limit.setFocusPolicy(Qt.ClickFocus)

        self.spin_steer_limit = QDoubleSpinBox()
        self.spin_steer_limit.setRange(0.05, 0.35)
        self.spin_steer_limit.setSingleStep(0.02)
        self.spin_steer_limit.setValue(self._target_steer_limit)
        self.spin_steer_limit.setSuffix(" rad")
        self.spin_steer_limit.setFixedWidth(90)
        self.spin_steer_limit.setFocusPolicy(Qt.ClickFocus)

        self.lbl_steer_deg = QLabel(f"(±{math.degrees(self._target_steer_limit):.1f}°)")
        self.lbl_steer_deg.setFixedWidth(64)

        self.slider_steer_limit.valueChanged.connect(self._on_slider_steer_limit_changed)
        self.spin_steer_limit.valueChanged.connect(self._on_spin_steer_limit_changed)

        layout.addWidget(lbl_steer, 4, 0)
        layout.addWidget(self.slider_steer_limit, 4, 1)
        layout.addWidget(self.spin_steer_limit, 4, 2)
        layout.addWidget(self.lbl_steer_deg, 4, 3)

        layout.setColumnStretch(0, 0)
        layout.setColumnStretch(1, 1)
        layout.setColumnStretch(2, 0)
        layout.setColumnStretch(3, 0)
        return box

    def _create_key_settings_group(self) -> QGroupBox:
        """Teleoperation control mode options."""
        box = QGroupBox("Teleoperation Driving Options")
        layout = QGridLayout(box)
        layout.setSpacing(6)
        layout.setContentsMargins(12, 10, 12, 10)

        self.chk_enable_keys = QCheckBox("Enable Keyboard Driving")
        self.chk_enable_keys.setChecked(True)
        self.chk_enable_keys.toggled.connect(self._on_toggle_keyboard)
        layout.addWidget(self.chk_enable_keys, 0, 0)

        self.chk_auto_decel = QCheckBox("Auto-Decelerate / Coast (Release ↑/↓)")
        self.chk_auto_decel.setChecked(True)
        self.chk_auto_decel.toggled.connect(lambda v: setattr(self, "_auto_decelerate", v))
        layout.addWidget(self.chk_auto_decel, 0, 1)

        self.chk_auto_center = QCheckBox("Auto-Center Steering (Release ←/→) [X]")
        self.chk_auto_center.setChecked(True)
        self.chk_auto_center.toggled.connect(self._on_chk_auto_center_toggled)
        layout.addWidget(self.chk_auto_center, 1, 0, 1, 2)

        lbl_guide = QLabel(
            "Controls: W/↑ Fwd • S/↓ Rev • A/← Steer Left • D/→ Steer Right\n"
            "Hotkeys:  Space Instant Brake • C Center • X Auto-Center • Esc E-Stop"
        )
        lbl_guide.setStyleSheet("color: #707886; font-size: 10px; padding-top: 2px;")
        layout.addWidget(lbl_guide, 2, 0, 1, 2)

        return box

    def _create_telemetry_group(self) -> QGroupBox:
        """Compact live actuation stream inspector with visual deflection bars."""
        box = QGroupBox("Live Transmitted Actuation Stream (CAN && Bridge Telemetry)")
        layout = QHBoxLayout(box)
        layout.setContentsMargins(8, 4, 8, 4)
        layout.setSpacing(6)

        def _make_card(title: str) -> tuple[QFrame, QVBoxLayout, QLabel]:
            card = QFrame()
            card.setObjectName("telemetryCard")
            card_layout = QVBoxLayout(card)
            card_layout.setContentsMargins(6, 3, 6, 3)
            card_layout.setSpacing(1)

            lbl_title = QLabel(title)
            lbl_title.setObjectName("telemetryTitle")
            card_layout.addWidget(lbl_title)

            lbl_val = QLabel("--")
            lbl_val.setObjectName("telemetryValue")
            card_layout.addWidget(lbl_val)
            return card, card_layout, lbl_val

        # 1. Commanded Velocity
        card_spd, lay_spd, self.lbl_telemetry_speed = _make_card("CMD VELOCITY")
        self.lbl_telemetry_speed.setText("0.00 m/s (0.0 km/h)")
        self.bar_telemetry_speed = QProgressBar()
        self.bar_telemetry_speed.setRange(0, 100)
        self.bar_telemetry_speed.setValue(0)
        self.bar_telemetry_speed.setTextVisible(False)
        self.bar_telemetry_speed.setFixedHeight(6)
        lay_spd.addWidget(self.bar_telemetry_speed)
        layout.addWidget(card_spd, 1)

        # 2. Steering Deflection
        card_str, lay_str, self.lbl_telemetry_steer = _make_card("STEERING DEFLECTION")
        self.lbl_telemetry_steer.setText("0.0° (0.000 rad)")
        self.bar_telemetry_steer = QProgressBar()
        self.bar_telemetry_steer.setRange(0, 100)
        self.bar_telemetry_steer.setValue(50)  # 50% is center
        self.bar_telemetry_steer.setTextVisible(False)
        self.bar_telemetry_steer.setFixedHeight(6)
        lay_str.addWidget(self.bar_telemetry_steer)
        layout.addWidget(card_str, 1)

        # 3. Longitudinal Acceleration & Brake
        card_acc, lay_acc, self.lbl_telemetry_accel = _make_card("ACCEL / BRAKING")
        self.lbl_telemetry_accel.setText("0.00 m/s²")
        self.lbl_telemetry_acc_mode = QLabel("Standstill")
        self.lbl_telemetry_acc_mode.setObjectName("telemetrySubtext")
        lay_acc.addWidget(self.lbl_telemetry_acc_mode)
        layout.addWidget(card_acc, 1)

        # 4. Commanded Gear & Signalling
        card_gear, lay_gear, self.lbl_telemetry_gear = _make_card("TRANSMISSION & LIGHTS")
        self.lbl_telemetry_gear.setText("PARK (22)")
        self.lbl_telemetry_signals = QLabel("Signals: Off | Haz: Off")
        self.lbl_telemetry_signals.setObjectName("telemetrySubtext")
        lay_gear.addWidget(self.lbl_telemetry_signals)
        layout.addWidget(card_gear, 1)

        # 5. Stream Rate & Interlocks
        card_stream, lay_stream, self.lbl_telemetry_stream = _make_card("BRIDGE & INTERLOCKS")
        self.lbl_telemetry_stream.setText(f"{self.node.publish_rate_hz:.0f} Hz Active")
        self.lbl_telemetry_interlock = QLabel("Disengaged | E-Stop Clear")
        self.lbl_telemetry_interlock.setObjectName("telemetrySubtext")
        lay_stream.addWidget(self.lbl_telemetry_interlock)
        layout.addWidget(card_stream, 1)

        return box

    # =========================================================================
    # Keyboard & Mouse Input Handling
    # =========================================================================

    def _set_mouse_motion(self, direction: str, active: bool) -> None:
        """Handle mouse press-and-hold for directional driving."""
        self._mouse_states[direction] = active
        snapshot = self.node.get_state_snapshot()

        if active and not snapshot.emergency:
            if direction == "fwd":
                if snapshot.gear in (GearConstants.PARK, GearConstants.NEUTRAL):
                    self._select_gear(GearConstants.DRIVE)
                if abs(self._cmd_speed) < 0.15:
                    self._cmd_speed = min(self._target_forward_speed, 0.35)
            elif direction == "rev":
                if snapshot.gear != GearConstants.REVERSE:
                    self._select_gear(GearConstants.REVERSE)
                if abs(self._cmd_speed) < 0.15:
                    self._cmd_speed = max(-self._target_reverse_speed, -0.25)
            elif direction == "left":
                if abs(self._cmd_steering) < 0.02:
                    self._cmd_steering = min(self._target_steer_limit, 0.05)
            elif direction == "right":
                if abs(self._cmd_steering) < 0.02:
                    self._cmd_steering = max(-self._target_steer_limit, -0.05)
            elif direction == "brake":
                self._instant_brake()

    def keyPressEvent(self, event: QKeyEvent) -> None:
        """Handle keyboard driving and direct hotkeys."""
        if not self._keyboard_enabled:
            super().keyPressEvent(event)
            return

        key = event.key()
        if not event.isAutoRepeat():
            self._pressed_keys.add(key)

        # Immediate hotkey actions
        if key == Qt.Key_Space:
            self._instant_brake()
        elif key == Qt.Key_Escape:
            self._on_estop_trigger_clicked()
        elif key == Qt.Key_P:
            self._select_gear(GearConstants.PARK)
        elif key == Qt.Key_R:
            self._select_gear(GearConstants.REVERSE)
        elif key == Qt.Key_N:
            self._select_gear(GearConstants.NEUTRAL)
        elif key == Qt.Key_D:
            self._select_gear(GearConstants.DRIVE)
        elif key == Qt.Key_L:
            self._select_gear(GearConstants.LOW)
        elif key == Qt.Key_Q:
            self._toggle_turn(TurnIndicatorsConstants.ENABLE_LEFT)
        elif key == Qt.Key_E:
            self._toggle_turn(TurnIndicatorsConstants.ENABLE_RIGHT)
        elif key == Qt.Key_H:
            self._toggle_hazard()
        elif key == Qt.Key_X:
            self._toggle_auto_center()
        elif key in (Qt.Key_G, Qt.Key_Return, Qt.Key_Enter):
            cur_engage = self.node.get_state_snapshot().engage
            if cur_engage:
                self._on_disengage_clicked()
            else:
                self._on_engage_clicked()
        elif key == Qt.Key_C:
            self._center_steering()

        # Responsive initial nudge on first key down if stopped
        if key in (Qt.Key_Up, Qt.Key_W):
            if abs(self._cmd_speed) < 0.15:
                self._cmd_speed = min(self._target_forward_speed, 0.35)
            if self.node.get_state_snapshot().gear in (GearConstants.PARK, GearConstants.NEUTRAL):
                self._select_gear(GearConstants.DRIVE)
        elif key in (Qt.Key_Down, Qt.Key_S):
            if self._cmd_speed <= 0.05 and abs(self._cmd_speed) < 0.15:
                self._cmd_speed = max(-self._target_reverse_speed, -0.25)
                if self.node.get_state_snapshot().gear != GearConstants.REVERSE:
                    self._select_gear(GearConstants.REVERSE)

        super().keyPressEvent(event)

    def keyReleaseEvent(self, event: QKeyEvent) -> None:
        """Handle key release."""
        if not event.isAutoRepeat():
            self._pressed_keys.discard(event.key())
        super().keyReleaseEvent(event)

    def changeEvent(self, event: QEvent) -> None:
        """Fail-closed: clear active inputs on window focus loss."""
        if event.type() == QEvent.ActivationChange and not self.isActiveWindow():
            self._pressed_keys.clear()
            for k in self._mouse_states:
                self._mouse_states[k] = False
        super().changeEvent(event)

    # =========================================================================
    # Motion Control Loop (50 Hz)
    # =========================================================================

    def _update_motion_tick(self) -> None:
        """Smoothly ramp speed and steering based on combined mouse & keyboard inputs."""
        dt = 0.02  # 50 Hz loop = 20ms
        snapshot = self.node.get_state_snapshot()

        if snapshot.emergency:
            self._cmd_speed = 0.0
            self._cmd_steering = 0.0
            return

        # Combine physical keyboard state and mouse press-and-hold state
        up_active = (
            (Qt.Key_Up in self._pressed_keys or Qt.Key_W in self._pressed_keys)
            if self._keyboard_enabled
            else False
        ) or self._mouse_states["fwd"]

        down_active = (
            (Qt.Key_Down in self._pressed_keys or Qt.Key_S in self._pressed_keys)
            if self._keyboard_enabled
            else False
        ) or self._mouse_states["rev"]

        left_active = (
            (Qt.Key_Left in self._pressed_keys or Qt.Key_A in self._pressed_keys)
            if self._keyboard_enabled
            else False
        ) or self._mouse_states["left"]

        right_active = (
            (Qt.Key_Right in self._pressed_keys or Qt.Key_D in self._pressed_keys)
            if self._keyboard_enabled
            else False
        ) or self._mouse_states["right"]

        brake_active = (
            (Qt.Key_Space in self._pressed_keys) if self._keyboard_enabled else False
        ) or self._mouse_states["brake"]

        # Longitudinal Speed Dynamics
        if brake_active:
            self._cmd_speed = 0.0
            accel = -self._target_decel
            braking = True
        elif up_active:
            self._cmd_speed = min(
                self._target_forward_speed,
                self._cmd_speed + self._target_accel * dt,
            )
            accel = self._target_accel
            braking = False
            if snapshot.gear in (GearConstants.PARK, GearConstants.NEUTRAL):
                self._select_gear(GearConstants.DRIVE)
        elif down_active:
            if self._cmd_speed > 0.05:
                # Active service deceleration
                self._cmd_speed = max(0.0, self._cmd_speed - self._target_decel * dt)
                accel = -self._target_decel
                braking = True
            else:
                # Reverse motion
                self._cmd_speed = max(
                    -self._target_reverse_speed,
                    self._cmd_speed - self._target_accel * dt,
                )
                accel = -self._target_accel
                braking = False
                if snapshot.gear != GearConstants.REVERSE:
                    self._select_gear(GearConstants.REVERSE)
        else:
            braking = False
            if self._auto_decelerate and abs(self._cmd_speed) > 0.01:
                # Smooth coast / decelerate to 0
                step = self._target_decel * dt
                if self._cmd_speed > 0:
                    self._cmd_speed = max(0.0, self._cmd_speed - step)
                else:
                    self._cmd_speed = min(0.0, self._cmd_speed + step)
                accel = -self._target_decel if self._cmd_speed > 0 else self._target_decel
            elif not self._auto_decelerate:
                accel = 0.0
            else:
                self._cmd_speed = 0.0
                accel = 0.0

        # Lateral Steering Dynamics
        if left_active and not right_active:
            self._cmd_steering = min(
                self._target_steer_limit,
                self._cmd_steering + self._steer_rate * dt,
            )
        elif right_active and not left_active:
            self._cmd_steering = max(
                -self._target_steer_limit,
                self._cmd_steering - self._steer_rate * dt,
            )
        elif self._auto_center_steering and abs(self._cmd_steering) > 0.005:
            steer_step = self._steer_rate * 1.5 * dt
            if self._cmd_steering > 0:
                self._cmd_steering = max(0.0, self._cmd_steering - steer_step)
            else:
                self._cmd_steering = min(0.0, self._cmd_steering + steer_step)
        elif self._auto_center_steering and abs(self._cmd_steering) <= 0.005:
            self._cmd_steering = 0.0

        # Synchronize angle spinbox with commanded steering angle
        if hasattr(self, "spin_steer_angle"):
            current_deg = round(math.degrees(self._cmd_steering), 1)
            if abs(self.spin_steer_angle.value() - current_deg) >= 0.2:
                self.spin_steer_angle.blockSignals(True)
                self.spin_steer_angle.setValue(current_deg)
                self.spin_steer_angle.blockSignals(False)

        # Transmit continuous command to node
        self.node.set_motion(
            speed=self._cmd_speed,
            steering_angle=self._cmd_steering,
            acceleration=accel,
            is_braking=braking,
        )

    def _spin_ros_tick(self) -> None:
        """Spin ROS 2 executor once non-blockingly."""
        if HAS_ROS2 and self.node is not None:
            rclpy.spin_once(self.node, timeout_sec=0.0)

    # =========================================================================
    # Direct Discrete Actions & Steering Angle Control
    # =========================================================================

    def _center_steering(self) -> None:
        """Immediately center steering to 0.0 rad."""
        self._cmd_steering = 0.0
        if hasattr(self, "spin_steer_angle"):
            self.spin_steer_angle.blockSignals(True)
            self.spin_steer_angle.setValue(0.0)
            self.spin_steer_angle.blockSignals(False)
        self.node.set_motion(self._cmd_speed, 0.0, 0.0, False)
        self.statusBar().showMessage("Steering centered to 0.0°.")

    def _set_steer_degrees(self, deg: float) -> None:
        """Lock steering to an exact angle in degrees and disable auto-center to hold."""
        # Disable auto-center so the angle holds indefinitely
        if self._auto_center_steering:
            self.chk_auto_center.setChecked(False)
        max_deg = math.degrees(self._target_steer_limit)
        clamped_deg = max(-max_deg, min(max_deg, deg))
        self._cmd_steering = math.radians(clamped_deg)
        if hasattr(self, "spin_steer_angle"):
            self.spin_steer_angle.blockSignals(True)
            self.spin_steer_angle.setValue(clamped_deg)
            self.spin_steer_angle.blockSignals(False)
        self.node.set_motion(self._cmd_speed, self._cmd_steering, 0.0, False)
        self.statusBar().showMessage(
            f"Steering angle locked to {clamped_deg:+.1f}° ({self._cmd_steering:+.3f} rad) [Auto-Center OFF - Angle Held]"
        )

    def _on_spin_steer_angle_changed(self, deg: float) -> None:
        """Directly adjust steering angle from spinbox."""
        if self._auto_center_steering and abs(deg) > 0.1:
            self.chk_auto_center.setChecked(False)
        self._cmd_steering = math.radians(deg)
        self.node.set_motion(self._cmd_speed, self._cmd_steering, 0.0, False)

    def _toggle_auto_center(self) -> None:
        """Toggle auto-centering on / off."""
        self.chk_auto_center.setChecked(not self._auto_center_steering)

    def _on_chk_auto_center_toggled(self, checked: bool) -> None:
        """Handle auto-center toggle and synchronize UI button."""
        self._auto_center_steering = checked
        if hasattr(self, "btn_toggle_autocenter"):
            if checked:
                self.btn_toggle_autocenter.setText("✔ Auto-Center: ON (X)")
                self.btn_toggle_autocenter.setStyleSheet("color: #98c379; font-weight: bold;")
                self.statusBar().showMessage(
                    "Auto-Center Steering: ENABLED (Wheels return to center on release)"
                )
            else:
                self.btn_toggle_autocenter.setText("✖ Auto-Center: OFF (X)")
                self.btn_toggle_autocenter.setStyleSheet("color: #e5c07b; font-weight: bold;")
                self.statusBar().showMessage(
                    "Auto-Center Steering: DISABLED (Steering angle held)"
                )

    def _zero_speed(self) -> None:
        """Immediately cut speed setpoint to 0.0 m/s."""
        self._cmd_speed = 0.0
        self.node.set_motion(0.0, self._cmd_steering, 0.0, False)

    def _instant_brake(self) -> None:
        """Instant full brake application."""
        self._cmd_speed = 0.0
        self.node.set_motion(0.0, self._cmd_steering, -self._target_decel, True)
        self.statusBar().showMessage("Instant Brake Applied! Velocity cut to 0.0 m/s.")

    # =========================================================================
    # Powertrain, Safety & Mode Handling
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
        self.statusBar().showMessage("EMERGENCY STOP TRIGGERED! Vehicle fail-closed.")

    def _on_estop_clear_clicked(self) -> None:
        """Clear Emergency Stop."""
        self.node.set_emergency(False)
        self.lbl_badge_estop.setText("E-STOP: CLEAR")
        self.lbl_badge_estop.setObjectName("badgeClear")
        self._update_badge_styles()
        self.statusBar().showMessage("Emergency stop cleared. Vehicle ready to engage.")

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
        self.statusBar().showMessage("Vehicle ENGAGED. Teleop commands active.")

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
        """Update gear selection."""
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

    def _toggle_turn(self, turn: int) -> None:
        """Toggle turn signal on/off."""
        cur_turn = self.node.get_state_snapshot().turn_indicators
        new_turn = TurnIndicatorsConstants.DISABLE if cur_turn == turn else turn
        self._select_turn(new_turn)

    def _select_turn(self, turn: int) -> None:
        """Set turn indicator state."""
        self.node.set_turn_indicators(turn)
        self.btn_turn_left.setChecked(turn == TurnIndicatorsConstants.ENABLE_LEFT)
        self.btn_turn_off.setChecked(turn == TurnIndicatorsConstants.DISABLE)
        self.btn_turn_right.setChecked(turn == TurnIndicatorsConstants.ENABLE_RIGHT)

    def _toggle_hazard(self) -> None:
        """Toggle hazard lights state."""
        cur_hazard = self.node.get_state_snapshot().hazard_lights
        new_hazard = (
            HazardLightsConstants.DISABLE
            if cur_hazard == HazardLightsConstants.ENABLE
            else HazardLightsConstants.ENABLE
        )
        self.node.set_hazard_lights(new_hazard)
        self.btn_hazard.setChecked(new_hazard == HazardLightsConstants.ENABLE)

    # =========================================================================
    # Authority Sliders & SpinBoxes
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
        self.lbl_rev_kmh.setText(f"({speed * 3.6:.1f} km/h)")

    def _on_spin_rev_changed(self, speed: float) -> None:
        self.slider_rev_speed.blockSignals(True)
        self.slider_rev_speed.setValue(int(speed * 100))
        self.slider_rev_speed.blockSignals(False)
        self._target_reverse_speed = speed
        self.lbl_rev_kmh.setText(f"({speed * 3.6:.1f} km/h)")

    def _on_slider_accel_changed(self, val: int) -> None:
        acc = val / 100.0
        self.spin_accel.blockSignals(True)
        self.spin_accel.setValue(acc)
        self.spin_accel.blockSignals(False)
        self._target_accel = acc
        if hasattr(self, "lbl_acc_unit"):
            self.lbl_acc_unit.setText(f"(~{acc / 9.81:.2f}g)")

    def _on_spin_accel_changed(self, acc: float) -> None:
        self.slider_accel.blockSignals(True)
        self.slider_accel.setValue(int(acc * 100))
        self.slider_accel.blockSignals(False)
        self._target_accel = acc
        if hasattr(self, "lbl_acc_unit"):
            self.lbl_acc_unit.setText(f"(~{acc / 9.81:.2f}g)")

    def _on_slider_decel_changed(self, val: int) -> None:
        dec = val / 100.0
        self.spin_decel.blockSignals(True)
        self.spin_decel.setValue(dec)
        self.spin_decel.blockSignals(False)
        self._target_decel = dec
        if hasattr(self, "lbl_dec_unit"):
            self.lbl_dec_unit.setText(f"(~{dec / 9.81:.2f}g)")

    def _on_spin_decel_changed(self, dec: float) -> None:
        self.slider_decel.blockSignals(True)
        self.slider_decel.setValue(int(dec * 100))
        self.slider_decel.blockSignals(False)
        self._target_decel = dec
        if hasattr(self, "lbl_dec_unit"):
            self.lbl_dec_unit.setText(f"(~{dec / 9.81:.2f}g)")

    def _on_slider_steer_limit_changed(self, val: int) -> None:
        lim = val / 100.0
        self.spin_steer_limit.blockSignals(True)
        self.spin_steer_limit.setValue(lim)
        self.spin_steer_limit.blockSignals(False)
        self._target_steer_limit = lim
        max_deg = math.degrees(lim)
        if hasattr(self, "spin_steer_angle"):
            self.spin_steer_angle.setRange(-max_deg, max_deg)
        if hasattr(self, "lbl_steer_deg"):
            self.lbl_steer_deg.setText(f"(±{max_deg:.1f}°)")

    def _on_spin_steer_limit_changed(self, lim: float) -> None:
        self.slider_steer_limit.blockSignals(True)
        self.slider_steer_limit.setValue(int(lim * 100))
        self.slider_steer_limit.blockSignals(False)
        self._target_steer_limit = lim
        max_deg = math.degrees(lim)
        if hasattr(self, "spin_steer_angle"):
            self.spin_steer_angle.setRange(-max_deg, max_deg)
        if hasattr(self, "lbl_steer_deg"):
            self.lbl_steer_deg.setText(f"(±{max_deg:.1f}°)")

    def _on_toggle_keyboard(self, checked: bool) -> None:
        self._keyboard_enabled = checked
        self._pressed_keys.clear()
        self.statusBar().showMessage(
            "Keyboard driving enabled" if checked else "Keyboard driving paused (Mouse controls active)"
        )

    def _on_node_telemetry(self, data: Dict[str, Any]) -> None:
        """Hook for live node telemetry updating visual indicators."""
        if not hasattr(self, "lbl_telemetry_speed"):
            return

        speed = float(data.get("speed", 0.0))
        accel = float(data.get("acceleration", 0.0))
        steer = float(data.get("steering_angle", 0.0))
        gear = int(data.get("gear", 0))
        turn = int(data.get("turn_indicators", 0))
        hazard = int(data.get("hazard_lights", 0))
        engage = bool(data.get("engage", False))
        emerg = bool(data.get("emergency", False))
        is_braking = bool(data.get("is_braking", False))

        steer_deg = math.degrees(steer)
        kmh = speed * 3.6

        # 1. Velocity & progress bar
        self.lbl_telemetry_speed.setText(f"{speed:+.2f} m/s ({kmh:+.1f} km/h)")
        max_speed = max(0.1, self._target_forward_speed)
        speed_pct = int(min(1.0, max(0.0, abs(speed) / max_speed)) * 100)
        self.bar_telemetry_speed.setValue(speed_pct)

        # 2. Steering deflection bar (50% is center)
        self.lbl_telemetry_steer.setText(f"{steer_deg:+.1f}° ({steer:+.3f} rad)")
        max_steer_deg = max(1.0, math.degrees(self._target_steer_limit))
        ratio = max(-1.0, min(1.0, steer_deg / max_steer_deg))
        steer_pos = int(50 + (ratio * 50))
        self.bar_telemetry_steer.setValue(steer_pos)

        # 3. Accel / Braking
        if emerg:
            self.lbl_telemetry_accel.setText("E-STOP ACTIVE")
            self.lbl_telemetry_accel.setStyleSheet("color: #e06c75; font-weight: bold;")
            self.lbl_telemetry_acc_mode.setText("Brakes Clamped")
        elif is_braking or accel < -0.1:
            self.lbl_telemetry_accel.setText(f"{accel:+.2f} m/s²")
            self.lbl_telemetry_accel.setStyleSheet("color: #e5c07b; font-weight: bold;")
            self.lbl_telemetry_acc_mode.setText("Active Braking")
        elif abs(speed) > 0.05:
            self.lbl_telemetry_accel.setText(f"{accel:+.2f} m/s²")
            self.lbl_telemetry_accel.setStyleSheet("color: #98c379; font-weight: bold;")
            self.lbl_telemetry_acc_mode.setText("Propulsion Active")
        else:
            self.lbl_telemetry_accel.setText(f"{accel:+.2f} m/s²")
            self.lbl_telemetry_accel.setStyleSheet("color: #61afef; font-weight: bold;")
            self.lbl_telemetry_acc_mode.setText("Standstill")

        # 4. Transmission & Signals
        gear_names = {
            GearConstants.PARK: "PARK",
            GearConstants.REVERSE: "REV",
            GearConstants.NEUTRAL: "NEU",
            GearConstants.DRIVE: "DRIVE",
            GearConstants.LOW: "LOW",
        }
        g_name = gear_names.get(gear, f"{gear}")
        turn_str = (
            "LEFT"
            if turn == TurnIndicatorsConstants.ENABLE_LEFT
            else ("RIGHT" if turn == TurnIndicatorsConstants.ENABLE_RIGHT else "OFF")
        )
        haz_str = "ON" if hazard == HazardLightsConstants.ENABLE else "OFF"
        self.lbl_telemetry_gear.setText(f"{g_name} ({gear})")
        self.lbl_telemetry_signals.setText(f"Turn: {turn_str} | Haz: {haz_str}")

        # 5. Authority & Interlocks
        eng_str = "ENGAGED" if engage else "DISENGAGED"
        est_str = "E-STOP ACTIVE" if emerg else "CLEAR"
        self.lbl_telemetry_interlock.setText(f"{eng_str} | {est_str}")

    # =========================================================================
    # Fail-Closed Cleanup on Window Close
    # =========================================================================

    def closeEvent(self, event: Any) -> None:  # pylint: disable=invalid-name
        """Fail-closed on exit: cut speed, apply full brake, disengage, deactivate."""
        self._pressed_keys.clear()
        for k in self._mouse_states:
            self._mouse_states[k] = False
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
                font-family: 'Segoe UI', -apple-system, sans-serif;
                font-size: 12px;
            }
            QGroupBox {
                border: 1px solid #333842;
                border-radius: 8px;
                margin-top: 6px;
                padding-top: 8px;
                font-weight: bold;
                color: #80cbc4;
                background-color: #21252b;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                subcontrol-position: top left;
                padding: 0 8px;
                background-color: #21252b;
            }
            #topBanner {
                background-color: #21252b;
                border: 1px solid #333842;
                border-radius: 8px;
            }
            #badgeMode, #badgeGear, #badgeBackend {
                background-color: #2d3139;
                color: #61afef;
                padding: 4px 8px;
                border-radius: 6px;
                font-weight: bold;
                font-size: 11px;
            }
            #badgeEngaged {
                background-color: #2e7d32;
                color: #ffffff;
                padding: 4px 8px;
                border-radius: 6px;
                font-weight: bold;
                font-size: 11px;
            }
            #badgeDisengaged {
                background-color: #37474f;
                color: #b0bec5;
                padding: 4px 8px;
                border-radius: 6px;
                font-weight: bold;
                font-size: 11px;
            }
            #badgeClear {
                background-color: #1b5e20;
                color: #a5d6a7;
                padding: 4px 8px;
                border-radius: 6px;
                font-weight: bold;
                font-size: 11px;
            }
            #badgeEstopActive {
                background-color: #d32f2f;
                color: #ffffff;
                padding: 4px 8px;
                border-radius: 6px;
                font-weight: bold;
                font-size: 11px;
            }
            QPushButton {
                background-color: #282c34;
                border: 1px solid #3e4451;
                border-radius: 6px;
                padding: 6px 12px;
                color: #dcdfe4;
                font-weight: 600;
            }
            QPushButton:hover {
                background-color: #353b45;
                border-color: #528bff;
            }
            QPushButton:pressed, QPushButton:checked {
                background-color: #3e4451;
                border-color: #61afef;
                color: #61afef;
            }
            #btnEstop {
                background-color: #c62828;
                color: white;
                border: none;
            }
            #btnEstop:hover {
                background-color: #e53935;
            }
            #btnEstop:pressed {
                background-color: #b71c1c;
            }
            #btnEstopClear {
                background-color: #37474f;
                color: #eceff1;
            }
            #btnEstopClear:hover {
                background-color: #455a64;
            }
            #btnEngage {
                background-color: #2e7d32;
                color: white;
                border: none;
            }
            #btnEngage:hover {
                background-color: #388e3c;
            }
            #btnEngage:pressed {
                background-color: #1b5e20;
            }
            #btnDisengage {
                background-color: #455a64;
                color: white;
                border: none;
            }
            #btnDisengage:hover {
                background-color: #546e7a;
            }
            #btnBrake {
                background-color: #b71c1c;
                color: white;
                border: none;
            }
            #btnBrake:hover {
                background-color: #d32f2f;
            }
            #btnBrake:pressed {
                background-color: #880e4f;
            }
            #btnStop {
                background-color: #2d2f34;
                border: 1px solid #d19a66;
                color: #e5c07b;
            }
            #btnStop:hover {
                background-color: #3e3b32;
            }
            #btnStop:pressed {
                background-color: #5c4d32;
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
                width: 16px;
                margin-top: -5px;
                margin-bottom: -5px;
                border-radius: 8px;
            }
            QDoubleSpinBox {
                background-color: #21252b;
                border: 1px solid #3e4451;
                border-radius: 4px;
                padding: 3px 6px;
                color: #e0e0e0;
                font-weight: bold;
            }
            QCheckBox {
                color: #abb2bf;
                spacing: 6px;
            }
            QCheckBox::indicator {
                width: 16px;
                height: 16px;
            }
            QStatusBar {
                background-color: #1e2227;
                color: #dcdfe4;
                border-top: 1px solid #282c34;
                font-size: 11px;
                font-weight: 500;
            }
            #telemetryCard {
                background-color: #21252b;
                border: 1px solid #333842;
                border-radius: 6px;
            }
            #telemetryTitle {
                color: #828997;
                font-size: 9px;
                font-weight: bold;
                letter-spacing: 0.5px;
            }
            #telemetryValue {
                color: #61afef;
                font-size: 13px;
                font-weight: bold;
                font-family: 'Consolas', 'Segoe UI', monospace;
            }
            #telemetrySubtext {
                color: #abb2bf;
                font-size: 10px;
                font-weight: 500;
            }
            QProgressBar {
                border: 1px solid #333842;
                border-radius: 3px;
                background-color: #1a1d23;
            }
            QProgressBar::chunk {
                background-color: #61afef;
                border-radius: 2px;
            }
            """
        )


def main(args: Optional[list[str]] = None) -> None:
    """Launch Cockpit GUI and ROS 2 lifecycle node."""
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
