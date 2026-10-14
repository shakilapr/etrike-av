#!/usr/bin/env python3
"""
Test network reachability, SSH port availability, and SSH login to NVIDIA Jetson Orin.
"""

from typing import Tuple
import socket
import subprocess
import sys
import paramiko

sys.stdout.reconfigure(encoding="utf-8")

JETSON_IP: str = "172.16.25.67"
SSH_PORT: int = 22
USERNAME: str = "med1"
PASSWORD: str = "med1"


def test_ping(host: str, count: int = 4) -> bool:
    """Ping remote host using system ping."""
    print(f"[*] Pinging {host} ({count} packets)...")
    cmd = ["ping", "-n" if sys.platform == "win32" else "-c", str(count), host]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    print(res.stdout)
    return res.returncode == 0


def test_tcp_port(host: str, port: int, timeout: float = 3.0) -> bool:
    """Verify TCP port connectivity."""
    print(f"[*] Checking TCP port {port} on {host}...")
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(timeout)
        try:
            s.connect((host, port))
            print(f"[OK] Port {port} is open and accepting connections.")
            return True
        except (socket.timeout, ConnectionRefusedError, OSError) as e:
            print(f"[FAIL] Port {port} check failed: {e}", file=sys.stderr)
            return False


def test_ssh_login(host: str, user: str, password: str, timeout: int = 10) -> Tuple[bool, str]:
    """Verify SSH credentials and fetch system info."""
    print(f"[*] Attempting SSH login to {user}@{host}...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, port=SSH_PORT, username=user, password=password, timeout=timeout)
        _, stdout, stderr = client.exec_command("hostname && uname -a && uptime")
        output = stdout.read().decode("utf-8", errors="replace").strip()
        client.close()
        print(f"[OK] SSH authentication succeeded!\n\nSystem Info:\n{output}\n")
        return True, output
    except Exception as e:
        print(f"[FAIL] SSH connection failed: {e}", file=sys.stderr)
        return False, str(e)


def main() -> int:
    ping_ok = test_ping(JETSON_IP)
    if not ping_ok:
        print(f"[ERROR] Host {JETSON_IP} is not responding to ping.", file=sys.stderr)
        return 1

    port_ok = test_tcp_port(JETSON_IP, SSH_PORT)
    if not port_ok:
        print(f"[ERROR] Port {SSH_PORT} on {JETSON_IP} is closed or unreachable.", file=sys.stderr)
        return 2

    ssh_ok, _ = test_ssh_login(JETSON_IP, USERNAME, PASSWORD)
    if not ssh_ok:
        print(f"[ERROR] SSH authentication to {JETSON_IP} failed.", file=sys.stderr)
        return 3

    print("[SUCCESS] All connectivity checks passed!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
