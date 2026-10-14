#!/usr/bin/env python3
"""
Audit Syncthing synchronization and file states in our_packages on the Jetson Orin.
"""

from typing import Tuple
import sys
import paramiko

sys.stdout.reconfigure(encoding="utf-8")

JETSON_IP: str = "172.16.25.67"
SSH_PORT: int = 22
USERNAME: str = "med1"
PASSWORD: str = "med1"


def execute_ssh_command(client: paramiko.SSHClient, cmd: str, title: str) -> Tuple[int, str]:
    """Execute command on remote machine and display output."""
    print(f"\n{'=' * 65}\n  {title}\n{'=' * 65}")
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode("utf-8", errors="replace").strip()
    err = stderr.read().decode("utf-8", errors="replace").strip()
    code = stdout.channel.recv_exit_status()

    if out:
        print(out)
    if err and code != 0:
        print(f"[STDERR - Code {code}]:\n{err}", file=sys.stderr)
    return code, out


def main() -> int:
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        print(f"Connecting to Jetson at {JETSON_IP}...")
        client.connect(JETSON_IP, port=SSH_PORT, username=USERNAME, password=PASSWORD, timeout=10)
        print("[OK] Connected.")
    except Exception as e:
        print(f"[FAIL] Could not connect to Jetson: {e}", file=sys.stderr)
        return 1

    try:
        # 1. Check Syncthing daemon
        execute_ssh_command(
            client,
            "systemctl --user status syncthing --no-pager 2>/dev/null | head -n 12 || pgrep -a syncthing",
            "1. Syncthing Daemon Status",
        )

        # 2. Check 20 most recent files modified in our_packages
        cmd_find = (
            'find ~/av_project/autoware/src/our_packages -type f -not -path "*/.*" '
            '-printf "%TY-%Tm-%Td %TH:%TM:%TS  %p\\n" | sort -r | head -n 20'
        )
        execute_ssh_command(client, cmd_find, "2. Most Recent Files in our_packages on Jetson")

        # 3. Check git status of our_packages
        execute_ssh_command(
            client,
            "cd ~/av_project && git status --short autoware/src/our_packages/",
            "3. Git Status of our_packages on Jetson",
        )

        # 4. Compare with install directories
        execute_ssh_command(
            client,
            "ls -ld ~/av_project/autoware/install/*etrike* ~/av_project/autoware/install/*bridge* ~/av_project/autoware/install/*kinect* 2>/dev/null",
            "4. Current Build Install State",
        )

    finally:
        client.close()

    print("\n[SUCCESS] Sync audit completed successfully.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
