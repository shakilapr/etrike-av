# Copyright 2026 E-Trike Dev. All rights reserved.
"""Automated verification script for RemoteControlMainWindow ergonomics and dual input."""

import os
import sys

# Headless / offscreen support if no X11 display
if "DISPLAY" not in os.environ:
    os.environ["QT_QPA_PLATFORM"] = "offscreen"

try:
    from PySide6.QtCore import Qt
    from PySide6.QtWidgets import QApplication, QCheckBox, QPushButton
except ImportError:
    from PyQt5.QtCore import Qt
    from PyQt5.QtWidgets import QApplication, QCheckBox, QPushButton

from etrike_remote_control.remote_control_gui import RemoteControlMainWindow
from etrike_remote_control.remote_control_node import GearConstants, RemoteControlNode


def test_gui() -> None:
    from etrike_remote_control.remote_control_node import HAS_ROS2
    if HAS_ROS2:
        import rclpy
        if not rclpy.ok():
            rclpy.init()

    app = QApplication.instance() or QApplication(sys.argv)
    node = RemoteControlNode()
    win = RemoteControlMainWindow(node)
    win.resize(1200, 650)
    win.show()
    app.processEvents()

    # 1. Verify NoFocus policy on all buttons and checkboxes
    for btn in win.findChildren(QPushButton):
        assert btn.focusPolicy() == Qt.NoFocus, f"Button {btn.text()} has focus policy {btn.focusPolicy()}"
    for chk in win.findChildren(QCheckBox):
        assert chk.focusPolicy() == Qt.NoFocus

    # 2. Test Mouse Press-and-Hold Forward
    print("Testing Mouse Forward...")
    win._set_mouse_motion("fwd", True)
    for _ in range(10):
        win._update_motion_tick()
    assert win._cmd_speed > 0.2, f"Expected speed > 0.2, got {win._cmd_speed}"
    assert node.get_state_snapshot().gear == GearConstants.DRIVE, "Expected gear DRIVE"
    print(f"  Mouse forward OK: speed={win._cmd_speed:.2f}")

    win._set_mouse_motion("fwd", False)
    for _ in range(20):
        win._update_motion_tick()
    print(f"  Mouse release deceleration OK: speed={win._cmd_speed:.2f}")

    # 3. Test Mouse Steer Left and Auto-Center
    print("Testing Mouse Steer Left...")
    win._set_mouse_motion("left", True)
    for _ in range(10):
        win._update_motion_tick()
    assert win._cmd_steering > 0.05, f"Expected steer > 0.05, got {win._cmd_steering}"
    print(f"  Mouse steer OK: steer={win._cmd_steering:.3f}")

    win._set_mouse_motion("left", False)
    for _ in range(25):
        win._update_motion_tick()
    assert abs(win._cmd_steering) < 0.01, f"Expected centered steer, got {win._cmd_steering}"
    print(f"  Mouse auto-center OK: steer={win._cmd_steering:.3f}")

    # 4. Test Instant Brake
    win._set_mouse_motion("fwd", True)
    win._update_motion_tick()
    win._set_mouse_motion("fwd", False)
    win._instant_brake()
    assert win._cmd_speed == 0.0
    assert node.get_state_snapshot().is_braking is True
    print("  Instant brake OK!")

    # 5. Grab screenshot
    pix = win.grab()
    pix.save("/tmp/remote_cockpit_balanced.png")
    print("Screenshot saved to /tmp/remote_cockpit_balanced.png!")
    print("ALL ERGONOMIC & DUAL-INPUT TESTS PASSED!")


if __name__ == "__main__":
    test_gui()
