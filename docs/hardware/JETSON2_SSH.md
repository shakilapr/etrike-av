# Jetson 2 (med2) SSH Login & System Configuration

## Connection Details

* **SSH Host Alias:** `med2` / `jetson2` (configured in `~/.ssh/config` for passwordless login)
* **IP Address:** `172.16.25.81`
* **Username:** `med2`
* **Password:** `med2`
* **Hardware:** NVIDIA Jetson AGX Orin Developer Kit (64 GB LPDDR5, 57 GB eMMC)
* **OS:** Ubuntu 22.04 LTS (JetPack 6.0/6.1, Kernel 5.15.199-tegra, `aarch64`)

---

## Quick Connect Commands

### 1. From Windows PC or Ubuntu Laptop
```bash
ssh med2
```

### 2. Direct via IP
```bash
ssh med2@172.16.25.81
```

---

## Software & Operational Parity with `med1`

`med2` has been fully configured to run all E-Trike and Autoware scripts identically to `med1`:

1. **Workspace:**
   * `~/av_project`: Complete repository clone including all 11 custom E-Trike ROS 2 packages (`autoware/src/our_packages/`).
   * `~/autoware_map`: Sample planning maps (`sample-map-planning`).
2. **Container Runtime:**
   * Image: `ghcr.io/autowarefoundation/autoware:universe-cuda-humble` and `etrike-kinect-build:latest`.
   * Container: `autoware_test` with NVIDIA GPU acceleration enabled (`--runtime=nvidia --gpus all`).
3. **CAN Interfaces:**
   * Native SocketCAN & `can-utils` (`candump`, `cansend`, `cangen`).
   * CANalyst-II udev rules installed at `/etc/udev/rules.d/99-canalystii.rules`.
   * Interface `can2` configured and ready.
4. **Web Dashboards:**
   * Node.js v20 LTS and pnpm installed.
   * AV 3D Cockpit Dashboard (`http://172.16.25.81:8080`).
   * CAN Watcher Telemetry Analyzer (`http://172.16.25.81:8000`).

---

## Daily Operation Commands

| Task | Command on `med2` |
|---|---|
| **Check System Status** | `bash ~/av_project/scripts/open-etrike.sh --status` |
| **Start Hybrid Bench** | `bash ~/av_project/scripts/open-etrike.sh --hybrid-bench` |
| **Start Pure Bench Sim** | `bash ~/av_project/scripts/open-etrike.sh --bench` |
| **Open AV 3D Dashboard** | `bash ~/av_project/scripts/open_av_dashboard.sh can2` (`:8080`) |
| **Open CAN Watcher** | `bash ~/av_project/scripts/open_can_watch.sh can2` (`:8000`) |
| **Stop All Services** | `bash ~/av_project/scripts/open-etrike.sh --stop` |
| **Build Packages** | `cd ~/av_project && ./docker/build.sh` |
