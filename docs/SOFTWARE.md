# Software Architecture & Specification

## 1. Host Operating System
* **OS:** Ubuntu 22.04.5 LTS (Jammy Jellyfish)
* **Kernel:** Linux 5.15.185-tegra (aarch64)
* **NVIDIA BSP:** L4T R36.5.0
* **JetPack Version:** 6.2.3 (+b81)
* **Host Python:** 3.10.12
* **Time Sync:** `chronyd` v4.2, `ptp4l` v3.1.1
* **Drivers:** `libopenni2-0` (v2.2.0.33) for 3D camera sensors.

## 2. Container Environment
* **Engine:** Docker Engine v29.7.1
* **Storage Driver:** `overlayfs`
* **Supported Runtimes:** `io.containerd.runc.v2`, `nvidia`, `runc`
* **Default Runtime:** `runc` (configured for GPU passthrough via NVIDIA Container Toolkit)
* **Primary Image:** `ghcr.io/autowarefoundation/autoware:universe-cuda-humble` (Size: ~17.8GB extracted)
* **Strategy:** All primary ROS nodes, GPU workloads, and drivers execute within the isolated container environment.

## 3. Deep Learning & Perception Stack (In-Container)
* **Compute Architecture:** Natively built for ARM64 with NVIDIA GPU acceleration.
* **CUDA Version:** 12.8 (Build 12.8.93)
* **TensorRT Version:** 10.3.0.26 (`libnvinfer10`)
* **Role:** Real-time point cloud processing, neural network inference, and matrix transformations.

## 4. Autonomous Driving Framework (In-Container)
* **Middleware:** ROS 2 Humble Hawksbill
* **Framework:** Autoware Universe
* **Role:** Handles perception, planning, control loops, localization, and vehicle interfacing.
