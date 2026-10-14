#!/usr/bin/env python3
"""
Inspect Jetson system settings to check for any download, update, or auto-start scripts.
"""

import sys
import paramiko

sys.stdout.reconfigure(encoding="utf-8")

JETSON_IP = "172.16.25.67"
SSH_PORT = 22
USERNAME = "med1"
PASSWORD = "med1"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    print(f"[*] Connecting to Jetson at {JETSON_IP}...")
    ssh.connect(JETSON_IP, SSH_PORT, USERNAME, PASSWORD, timeout=8)
    print("[OK] Connected successfully.\n")
except Exception as e:
    print(f"[FAIL] Could not connect: {e}")
    sys.exit(1)

commands = [
    ("1. User Crontab (med1)", "crontab -l 2>&1"),
    ("2. System Cron Jobs (/etc/cron.*)", "ls -la /etc/cron.d /etc/cron.daily /etc/crontab 2>/dev/null"),
    ("3. Desktop Autostart (~/.config/autostart)", "ls -la ~/.config/autostart /etc/xdg/autostart 2>/dev/null"),
    ("4. Shell Startup Scripts (.bashrc, .profile)", "grep -E -i '(git pull|apt|wget|curl|pip|colcon|syncthing)' ~/.bashrc ~/.profile ~/.bash_profile 2>/dev/null || echo 'None found'"),
    ("5. Systemd Timers (Scheduled tasks/updates)", "systemctl list-timers --no-pager 2>/dev/null | grep -E '(apt|snap|timer)' || systemctl list-timers --no-pager 2>/dev/null | head -15"),
    ("6. Ubuntu / APT Unattended-Upgrades", "cat /etc/apt/apt.conf.d/20auto-upgrades /etc/apt/apt.conf.d/10periodic 2>/dev/null || echo 'Not configured'"),
    ("7. Syncthing Auto-Upgrade setting", "grep -i 'autoUpgrade' ~/.config/syncthing/config.xml ~/.local/state/syncthing/config.xml 2>/dev/null || echo 'No syncthing auto-upgrade setting found'"),
    ("8. Custom or Enabled Systemd Services", "systemctl list-unit-files --state=enabled --no-pager 2>/dev/null | grep -E -i '(canalyst|syncthing|autoware|etrike|av_)' || echo 'No custom repo services enabled'"),
    ("9. Running Docker Containers & Restart Policy", "docker ps -a --format 'table {{.Names}}\t{{.Status}}\t{{.Image}}' 2>/dev/null || echo 'Docker not accessible'")
]

for title, cmd in commands:
    print("=" * 60)
    print(f"=== {title} ===")
    print("=" * 60)
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode("utf-8", errors="replace").strip()
    err = stderr.read().decode("utf-8", errors="replace").strip()
    if out:
        print(out)
    if err and not out:
        print("[Notice/Error]:", err)
    print()

ssh.close()
