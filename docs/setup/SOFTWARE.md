# Software Architecture & Specification

## 1. Host Operating System & BSP
* **OS:** Ubuntu 22.04.5 LTS (Jammy Jellyfish)
* **Kernel:** Linux 5.15.185-tegra (aarch64)
* **NVIDIA BSP / L4T:** R36.5.0
* **JetPack Version:** 6.2.3 (+b81)
* **NVIDIA Driver:** 540.5.0
* **Host Python:** 3.10.12
* **Vision Library:** `libopenni2-0` (v2.2.0.33)

## 2. Container Environment
* **Engine:** Docker Engine v29.7.1
* **Storage Driver:** `overlayfs`
* **Configured Runtimes:** `nvidia` (NVIDIA Container Toolkit), `runc`, `io.containerd.runc.v2`
* **Primary Container Image:** `ghcr.io/autowarefoundation/autoware:universe-cuda-humble` (Disk usage: ~17.8 GB, Content size: 5.23 GB)
* **Deployment Policy:** Autonomous driving pipeline nodes, sensor decoders, and planning frameworks run isolated within the containerized runtime.

## 3. In-Container Software & AI Acceleration
* **Middleware:** ROS 2 Humble Hawksbill
* **AV Framework:** Autoware Universe
* **CUDA Compiler (NVCC):** Release 12.8 (Build `cuda_12.8.r12.8/compiler.35583870_0`, V12.8.93)
* **TensorRT Runtime:** Version 10.3.0.26 (`libnvinfer10`, `libnvinfer-plugin10` compiled for CUDA 12.5/12.8)

## 4. Time Synchronization Architecture
### PTP Setup (`ptp4l`)
* **Role:** Slave-only instance (`slaveOnly 1`)
* **Transport Protocol:** `UDPv4`
* **PTP Domain:** `0`
* **Delay Mechanism:** End-to-End (`E2E`)
* **Timestamping:** Software timestamping (`time_stamping software`)
* **Servo Parameters:** Proportional Constant $K_p = 0.7$, Integral Constant $K_i = 0.3$
* **Interval Rates:** `logSyncInterval = 0` (1s), `logAnnounceInterval = 1` (2s), `logDelayReqInterval = 0` (1s)

### Chrony Synchronization (`chrony`)
* **Reference Clock:** `PHC /dev/ptp0 poll 2 dpoll -2 offset 0 stratum 2`
* **NTP Fallback Pool:** `pool.ntp.org iburst minpoll 6 maxpoll 10`
* **Startup Step Tolerance:** `makestep 1.0 3`
* **RTC Synchronization:** `rtcsync` enabled for rapid clock slew correction.
