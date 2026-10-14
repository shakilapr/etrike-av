#!/usr/bin/env python3
"""
Build our_packages on Jetson Orin inside the Autoware Docker container.
Ensures the autoware_test container is running, provisions hardware libraries
(libfreenect2, turbojpeg, glfw), and invokes colcon build.
"""

from typing import List, Optional
import argparse
import sys
import time
import paramiko

sys.stdout.reconfigure(encoding="utf-8")

JETSON_IP: str = "172.16.25.67"
SSH_PORT: int = 22
USERNAME: str = "med1"
PASSWORD: str = "med1"

DEFAULT_PACKAGES: List[str] = [
    "etrike_protocol",
    "autoware_vehicle_bridge",
    "etrike_vehicle_description",
    "etrike_vehicle_launch",
    "etrike_common_launch",
    "etrike_sensor_kit_launch",
    "etrike_sensor_kit_description",
    "etrike_lidar_viewer",
    "etrike_stability_guard",
    "etrike_remote_control",
    "etrike_kinect2",
]


def run_ssh_stream(client: paramiko.SSHClient, cmd: str, timeout: int = 600) -> int:
    """Run an SSH command streaming output live to stdout."""
    print(f"\n>>> [Jetson] {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)

    while not stdout.channel.exit_status_ready():
        if stdout.channel.recv_ready():
            chunk = stdout.channel.recv(1024).decode("utf-8", errors="replace")
            sys.stdout.write(chunk)
            sys.stdout.flush()
        time.sleep(0.1)

    remaining = stdout.read().decode("utf-8", errors="replace")
    if remaining:
        sys.stdout.write(remaining)
        sys.stdout.flush()

    err = stderr.read().decode("utf-8", errors="replace").strip()
    code = stdout.channel.recv_exit_status()
    if err and code != 0:
        print(f"\n[STDERR - Exit Code {code}]:\n{err}", file=sys.stderr)
    return code


def ensure_container_and_libs(client: paramiko.SSHClient) -> int:
    """Start container and provision Kinect / rendering libraries."""
    provision_script = """
    CONTAINER="autoware_test"
    if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
        if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
            echo "Starting existing autoware_test container..."
            docker start "$CONTAINER"
        else
            echo "Creating and starting autoware_test container..."
            docker run -d --name "$CONTAINER" \
                --privileged --runtime=nvidia --gpus all \
                --net=host --ipc=host \
                -v ~/av_project:/workspace/av_project \
                -v ~/av_project/autoware:/workspace/autoware \
                -v ~/autoware_map:/autoware_map \
                ghcr.io/autowarefoundation/autoware:universe-cuda-humble \
                bash -c 'while true; do sleep 1000; done'
        fi
    fi

    # Provision Kinect v2 and display libraries from host into container
    if [ -d /usr/local/include/libfreenect2 ]; then
        docker exec "$CONTAINER" mkdir -p /usr/local/include
        docker cp /usr/local/include/libfreenect2 "$CONTAINER":/usr/local/include/
    fi
    if [ -d /usr/local/lib/cmake/freenect2 ]; then
        docker exec "$CONTAINER" mkdir -p /usr/local/lib/cmake
        docker cp /usr/local/lib/cmake/freenect2 "$CONTAINER":/usr/local/lib/cmake/
    fi
    if [ -f /usr/local/lib/libfreenect2.so.0.2.0 ]; then
        docker cp /usr/local/lib/libfreenect2.so.0.2.0 "$CONTAINER":/usr/local/lib/
        docker exec "$CONTAINER" ln -sf /usr/local/lib/libfreenect2.so.0.2.0 /usr/local/lib/libfreenect2.so.0.2
        docker exec "$CONTAINER" ln -sf /usr/local/lib/libfreenect2.so.0.2 /usr/local/lib/libfreenect2.so
    fi
    if [ -f /usr/include/turbojpeg.h ]; then
        docker cp /usr/include/turbojpeg.h "$CONTAINER":/usr/include/
    fi
    if [ -f /usr/lib/aarch64-linux-gnu/libturbojpeg.so.0.2.0 ]; then
        docker cp /usr/lib/aarch64-linux-gnu/libturbojpeg.so.0.2.0 "$CONTAINER":/usr/lib/aarch64-linux-gnu/
        docker exec "$CONTAINER" ln -sf /usr/lib/aarch64-linux-gnu/libturbojpeg.so.0.2.0 /usr/lib/aarch64-linux-gnu/libturbojpeg.so.0
        docker exec "$CONTAINER" ln -sf /usr/lib/aarch64-linux-gnu/libturbojpeg.so.0 /usr/lib/aarch64-linux-gnu/libturbojpeg.so
    fi
    if [ -d /usr/include/GLFW ]; then
        docker cp /usr/include/GLFW "$CONTAINER":/usr/include/
    fi
    if [ -f /usr/lib/aarch64-linux-gnu/libglfw.so.3.3 ]; then
        docker cp /usr/lib/aarch64-linux-gnu/libglfw.so.3.3 "$CONTAINER":/usr/lib/aarch64-linux-gnu/
        docker exec "$CONTAINER" ln -sf /usr/lib/aarch64-linux-gnu/libglfw.so.3.3 /usr/lib/aarch64-linux-gnu/libglfw.so.3
        docker exec "$CONTAINER" ln -sf /usr/lib/aarch64-linux-gnu/libglfw.so.3 /usr/lib/aarch64-linux-gnu/libglfw.so
    fi
    docker exec "$CONTAINER" ldconfig
    echo "[OK] Container autoware_test is ready with provisioned hardware libraries."
    """
    return run_ssh_stream(client, provision_script)


def compile_packages(client: paramiko.SSHClient, packages: List[str]) -> int:
    """Run colcon build in the container for selected packages."""
    pkg_str = " ".join(packages)
    print(f"\n[*] Compiling {len(packages)} packages: {pkg_str}")
    build_cmd = (
        "docker exec autoware_test bash -c '"
        "source /opt/autoware/setup.bash && "
        "cd /workspace/autoware && "
        f"colcon build --symlink-install --packages-select {pkg_str} 2>&1"
        "'"
    )
    return run_ssh_stream(client, build_cmd, timeout=600)


def main() -> int:
    parser = argparse.ArgumentParser(description="Build our_packages on Jetson")
    parser.add_argument(
        "--packages",
        nargs="+",
        default=DEFAULT_PACKAGES,
        help="List of packages to build (defaults to all our_packages)",
    )
    args = parser.parse_args()

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        print(f"Connecting to Jetson Orin ({JETSON_IP})...")
        client.connect(JETSON_IP, port=SSH_PORT, username=USERNAME, password=PASSWORD, timeout=15)
        print("[OK] Connected.")
    except Exception as e:
        print(f"[FAIL] Could not connect to Jetson: {e}", file=sys.stderr)
        return 1

    try:
        # Step 1: Ensure container & libraries
        code = ensure_container_and_libs(client)
        if code != 0:
            print("[ERROR] Container/library provisioning failed.", file=sys.stderr)
            return code

        # Step 2: Colcon build
        code = compile_packages(client, args.packages)
        if code == 0:
            print("\n" + "=" * 50)
            print("  BUILD COMPLETED SUCCESSFULLY!")
            print("=" * 50)
        else:
            print(f"\n[FAIL] Build failed with exit code {code}", file=sys.stderr)
        return code
    finally:
        client.close()


if __name__ == "__main__":
    sys.exit(main())
