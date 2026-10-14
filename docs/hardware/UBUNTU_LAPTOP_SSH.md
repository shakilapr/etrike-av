# Ubuntu Laptop SSH Login & Credentials

## Connection Details

* **SSH Host Alias:** `ubuntu-laptop` (configured in `~/.ssh/config` for passwordless login)
* **IP Address:** `172.16.25.90`
* **Username:** `medros2`
* **Password:** `med@2026`
* **OS:** Ubuntu 22.04.5 LTS (Kernel 6.8.0-138-generic, x86_64)

---

## Quick Connect Commands

### 1. From Windows Dev PC
```bash
ssh ubuntu-laptop
```
*(Passwordless Ed25519 authentication configured in `C:\Users\logsh\.ssh\config`)*

### 2. Direct via IP & User
```bash
ssh medros2@172.16.25.90
```

---

## Network & Inter-Device Communication

* **LAN Subnet:** `172.16.0.0/16`
* **SSH to Jetson:** Passwordless key configured from `ubuntu-laptop` to `med1@172.16.25.67`:
  ```bash
  ssh jetson
  ```
* **AI Workstation Endpoint:** `172.16.26.14` (configured in `~/.ssh/config` on `ubuntu-laptop` as `workstation`).

---

## Installed Developer Tools

| Tool | Binary / Command | Version | Distribution |
| :--- | :--- | :--- | :--- |
| **Antigravity CLI** | `/usr/local/bin/agy` | 1.3.5 | Google Antigravity CLI Installer (`antigravity.google/cli`) |
| **Antigravity Desktop** | `/snap/bin/antigravity` | 2.23.1 | Snapcraft (`latest/stable --classic`) |
| **Python 3.11 Runtime** | `/usr/bin/python3.11` | 3.11.17 | Ubuntu deadsnakes PPA |
| **Node.js LTS** | `/usr/bin/node` | 20.20.2 | NodeSource LTS repository |
| **can-utils** | `/usr/bin/candump`, `/usr/bin/cansend` | 2020.12.0 | Ubuntu APT |

---

## E-Trike Control Toolkit & CANalyst-II

* **Source Directory:** `/home/medros2/Desktop/simmm1/etrike-main/control-toolkit` (Symlink: `~/etrike/control-toolkit`)
* **Backend:** FastAPI with `python-can[canalystii]==4.6.1` and `pyusb==1.3.1` in dedicated `.venv` (`python3.11`).
* **Frontend:** Vite + React + Tailwind (built with Node.js 20).
* **CANalyst-II Driver & udev:**
  * Persistent rule installed at `/etc/udev/rules.d/99-canalystii.rules` (`04d8:0053` and `1d50:606f`).
  * User `medros2` added to `dialout` and `plugdev` groups.
* **To Launch Control Toolkit:**
  ```bash
  /home/medros2/start_control_toolkit.sh
  ```
  * UI available at: `http://localhost:5173` (or `http://172.16.25.90:5173`)
  * Backend API & Docs: `http://localhost:8000/docs`
