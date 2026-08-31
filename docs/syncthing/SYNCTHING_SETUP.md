# Syncthing Setup — Linux Server

**Server:** `med1@172.16.25.67`
**Date:** 2026-08-10

---

## 1. SSH into Linux

From Windows PowerShell:

```powershell
ssh med1@172.16.25.67
```

Verify the project:

```bash
cd ~/av_project
pwd        # /home/med1/av_project
ls -la
```

Output confirmed:

```
autoware/
vehicle/
simulator/
data/
repositories/
docker/
SETUP.md
```

Matches the project structure documented in `SETUP.md`.

---

## 2. Project size

```bash
du -sh ~/av_project        # 80K  (skeleton only — no source/build/data yet)
du -sh ~/av_project/*
```

| Path                  | Size   | Notes                          |
| --------------------- | ------ | ------------------------------ |
| `autoware/`           | 12K    | empty skeleton                 |
| `data/`               | 16K    | maps/, bags/, models/ empty    |
| `docker/`             | 4K     | Dockerfile not yet written     |
| `repositories/`       | 4K     | `.repos` manifest not yet written |
| `SETUP.md`            | 12K    | project documentation          |
| `simulator/`          | 8K     | AWSIM/ empty                   |
| `vehicle/`            | 20K    | params/, launch/, calib/, desc/|

`autoware/build`, `autoware/install`, and `autoware/log` don't exist yet — documented as generated
colcon output to be excluded from sync.

---

## 3. Install Syncthing

Using Syncthing's official `stable-v2` repository for Ubuntu/Debian.

### 3a. Add GPG key

```bash
sudo mkdir -p /etc/apt/keyrings
sudo curl -L -o /etc/apt/keyrings/syncthing-archive-keyring.gpg \
  https://syncthing.net/release-key.gpg
```

### 3b. Add stable-v2 repository

```bash
echo "deb [signed-by=/etc/apt/keyrings/syncthing-archive-keyring.gpg] https://apt.syncthing.net/ syncthing stable-v2" | \
  sudo tee /etc/apt/sources.list.d/syncthing.list
```

### 3c. Install

```bash
sudo apt update
sudo apt install -y syncthing
```

### 3d. Verify

```bash
syncthing --version
# syncthing v2.1.3 "Hafnium Hornet" (go1.26.5 linux-arm64)
```

---

## 4. Start Syncthing as a systemd service

```bash
sudo systemctl enable --now syncthing@med1.service
```

Verify:

```bash
systemctl status syncthing@med1.service
# Expected: Active: active (running)
```

Using `syncthing@med1.service` keeps Syncthing running even when `med1` is not
logged in — the recommended approach for a development server.

Press `q` to exit the status view.

---

## 5. Syncthing exclusions (`.stignore`)

Created at `~/av_project/.stignore`:

```
/autoware/build
/autoware/install
/autoware/log

/data/bags

**/.git
**/__pycache__
**/.cache

/simulator/AWSIM/Library
/simulator/AWSIM/Temp
/simulator/AWSIM/obj
/simulator/AWSIM/Logs
/simulator/AWSIM/UserSettings
```

### Why each exclusion

| Pattern                            | Reason                                                      |
| ---------------------------------- | ----------------------------------------------------------- |
| `/autoware/build`                  | colcon build output — Linux-only, large, regenerated on demand |
| `/autoware/install`                | colcon install output — Linux-only, contains symlinks       |
| `/autoware/log`                    | colcon build logs — not needed on Windows                   |
| `/data/bags`                       | ROS bag recordings — can be hundreds of GB                  |
| `**/.git`                          | Git database stays Linux-side; source files still sync      |
| `**/__pycache__`                   | Python bytecode — regenerated automatically                 |
| `**/.cache`                        | Build tool caches                                           |
| `/simulator/AWSIM/Library`         | Unity generated cache                                       |
| `/simulator/AWSIM/Temp`            | Unity temp files                                            |
| `/simulator/AWSIM/obj`             | Unity build artifacts                                       |
| `/simulator/AWSIM/Logs`            | Unity editor logs                                           |
| `/simulator/AWSIM/UserSettings`    | Per-machine Unity settings                                  |

### What Windows WILL receive

Source files only:

```
.cpp  .hpp  .py  .yaml  .xml
CMakeLists.txt  package.xml
Dockerfile
Assets/  ProjectSettings/   (Unity)
```

No `.git/` directories — Git operations stay on Linux.

### Important

- `.stignore` itself is **not synchronized** by Syncthing (by design).
- Patterns are relative to the shared folder root (`~/av_project`).
- Changes to `.stignore` take effect immediately; no restart needed.

---

## 6. Symbolic links check

```bash
find ~/av_project \
  -path '*/build' -prune -o \
  -path '*/install' -prune -o \
  -path '*/log' -prune -o \
  -path '*/.git' -prune -o \
  -type l -print | head -50
```

**Result:** No symlinks found.

If any appear later (e.g., from `colcon build --symlink-install`), they will:
- Remain intact on Linux (the execution environment)
- Not exist as symlinks in the Windows mirror
- Not affect the Linux build

---

## 7. Firewall

```bash
sudo ufw status
# Result: ufw not installed / not available
```

No action needed. If `ufw` is installed and active later, run:

```bash
sudo ufw allow 22000/tcp
sudo ufw allow 22000/udp
```

Do **not** expose port 8384 (the web GUI). Access it via SSH tunnel instead:

```bash
ssh -L 8384:localhost:8384 med1@172.16.25.67
```

Then open `http://localhost:8384` in a browser on Windows.

---

## Verification checklist

- [x] Project directory at `~/av_project` matches `SETUP.md` structure
- [x] Project size measured (80K — skeleton only)
- [x] Syncthing installed (`syncthing --version` → v2.1.3)
- [x] Syncthing service running (`systemctl status syncthing@med1.service` → active)
- [x] `.stignore` created with build/log/data/git exclusions
- [x] No symlinks detected in project tree
- [x] Firewall — N/A (ufw not installed)

---

## Next: Part B — Syncthing device pairing & first sync

From Windows, connect to the Linux Syncthing instance and add `~/av_project` as a shared folder.
