# AI / Autoware Workstation SSH Login & Credentials

## Connection Details

* **SSH Host Alias:** `workstation` (configured in `~/.ssh/config` for passwordless login)
* **IP Address:** `172.16.25.77`
* **Username:** `med`
* **Password:** `123456@@`
* **Sudo:** Full administrative privileges (passwordless sudo configured)

---

## Quick Connect Commands

### 1. Passwordless via SSH Config Alias (Recommended)
```bash
ssh workstation
```

### 2. Direct via IP & User
```bash
ssh med@172.16.25.77
```

### 3. Run Remote Command Directly
```bash
ssh workstation "hostname && whoami && uptime"
```

---

## Hardware Specifications

| Component | Details |
| :--- | :--- |
| **Motherboard** | ASUS Pro WS W680-ACE (Workstation Edition) |
| **CPU** | Intel Core i9-14900K (24 cores / 32 threads, up to 6.0 GHz) |
| **GPU** | NVIDIA RTX 6000 Ada Generation (48 GB GDDR6 with ECC) |
| **RAM** | 128 GB DDR5 (123 GiB usable) |
| **Storage** | 3x 2 TB NVMe SSDs (~6 TB total):<br>• `/dev/nvme2n1p2` (1.8 TB ext4) — Root OS (`/`)<br>• `/dev/nvme0n1p1` (1.8 TB ext4, label `models`) — Mounted at `/models`<br>• `/dev/nvme1n1p1` (1.8 TB ext4, label `data`) — Mounted at `/data` |
| **OS** | Ubuntu 26.04.1 LTS (Kernel 7.0.0-34-generic, x86_64) |

---

## Client SSH Setup (Windows)

Configured at `C:\Users\logsh\.ssh\config`:
```ssh-config
Host workstation
    HostName 172.16.25.77
    User med
    BatchMode yes
    StrictHostKeyChecking accept-new
```
Public key (`C:\Users\logsh\.ssh\id_ed25519.pub`) is authorized in `/home/med/.ssh/authorized_keys`.

---

## Installed Developer Tools

| Tool | Binary / Command | Version | Desktop Entry | Source / Distribution |
| :--- | :--- | :--- | :--- | :--- |
| **Antigravity 2.0** | `/usr/bin/antigravity` (`/opt/Antigravity/antigravity`) | 2.18.1 | `antigravity.desktop` | Google Antigravity Hub (`storage.googleapis.com`) |
| **Antigravity IDE** | `/usr/bin/antigravity-ide` (`/opt/antigravity-ide/bin/antigravity`) | 1.107.0 | `antigravity-ide.desktop` | Google Antigravity APT (`us-central1-apt.pkg.dev`) |
| **VS Code** | `/usr/bin/code` | 1.140.0 | `com.microsoft.VSCode.desktop` | Microsoft APT (`packages.microsoft.com/repos/code`) |
| **Antigravity CLI** | `/usr/local/bin/agy` | 1.2.14 | CLI only (`agy`) | Google Antigravity CLI Installer (`antigravity.google/cli`) |

---

## Desktop Customization (Hide / Show Network Button)

The network indicator in the Ubuntu top bar (GNOME panel) is managed via a custom lightweight GNOME extension at `~/.local/share/gnome-shell/extensions/hide-network@custom/`.

### 1. To Hide the Network Button
Run from terminal or SSH:
```bash
/home/user/scripts/hide_network_button.sh
# or directly via:
gsettings set org.gnome.shell enabled-extensions "['hide-network@custom']"
```

### 2. To Restore / Recover the Network Button (Visible)
Run from terminal or SSH:
```bash
/home/user/scripts/show_network_button.sh
# or directly via:
gsettings set org.gnome.shell enabled-extensions "[]"
```

