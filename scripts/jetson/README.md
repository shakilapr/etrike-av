# Jetson Remote Management Scripts (`scripts/jetson/`)

This directory contains utility tools to inspect connectivity, verify Syncthing mirroring, and build custom packages on the NVIDIA Jetson Orin (`172.16.25.67`) over SSH.

---

## Scripts

### 1. [check_connection.py](file:///E:/work/av_project/scripts/jetson/check_connection.py)
Tests network ping latency, SSH port 22 status, and verifies SSH credential authentication with system information.
```bash
python scripts/jetson/check_connection.py
```

### 2. [check_sync.py](file:///E:/work/av_project/scripts/jetson/check_sync.py)
Audits the Jetson's Syncthing service status, inspects the newest file modification timestamps in `autoware/src/our_packages/`, and compares them against git status and current `install/` state.
```bash
python scripts/jetson/check_sync.py
```

### 3. [compile_packages.py](file:///E:/work/av_project/scripts/jetson/compile_packages.py)
Automates building packages inside the `autoware_test` Docker container on the Jetson:
- Automatically starts the container if stopped.
- Provisions `libfreenect2`, `turbojpeg`, and `glfw` headers/libraries into the container to enable Kinect and rendering drivers.
- Executes `colcon build --symlink-install --packages-select <packages>`.

```bash
# Build all custom packages (default)
python scripts/jetson/compile_packages.py

# Build specific packages
python scripts/jetson/compile_packages.py --packages etrike_remote_control autoware_vehicle_bridge
```

### 4. [sync_and_build.ps1](file:///E:/work/av_project/scripts/jetson/sync_and_build.ps1)
Unified PowerShell wrapper for Windows developers.
```powershell
# Run full cycle: Ping -> Check Sync -> Compile
pwsh -File scripts/jetson/sync_and_build.ps1

# Run ping only
pwsh -File scripts/jetson/sync_and_build.ps1 -Action Ping

# Run sync check only
pwsh -File scripts/jetson/sync_and_build.ps1 -Action CheckSync

# Run build only
pwsh -File scripts/jetson/sync_and_build.ps1 -Action Build
```
