# AV Project Syncthing Setup Guide

*Initial setup: Windows local development mirror + Linux build/runtime workspace*

| Item | Value |
|---|---|
| Windows project root | E:\work\av_project |
| Linux project root | /home/med1/av_project |
| Linux SSH host | med1@172.16.25.67 |
| Synchronization | Syncthing (bidirectional after initial seed) |

> Version 1.0 - 10 August 2026
> Project-specific guide for the AV development workspace.

## 1. Purpose and final architecture

This guide documents the one-time setup used to mirror the AV project from the Linux development machine to Windows. Windows is used for local editing and local CLI/AI tools. Linux remains the authoritative runtime environment for Docker, ROS 2, CUDA, colcon builds, simulation, and hardware-facing work.

```
WINDOWS                                          LINUX
E:\work\av_project   <==== Syncthing ====>       /home/med1/av_project
        |                                               |
        +-- VS Code                                     +-- Docker
        +-- Claude / OpenCode / Codex                   +-- ROS 2 / colcon
        +-- local search/editing tools                  +-- CUDA / runtime

Linux Docker bind mount:
/home/med1/av_project/autoware  --->  /workspace/autoware
```

> **Design rule:** Source code is edited on the host filesystem. Docker provides the toolchain and sees the same Linux files through a bind mount; source is not baked into the image.

## 2. Fixed values used by this setup

| Item | Value |
| --- | --- |
| Windows project folder | E:\work\av_project |
| Linux project folder | /home/med1/av_project |
| SSH host | med1@172.16.25.67 |
| Windows Syncthing GUI | http://127.0.0.1:8384 |
| Linux Syncthing GUI from Windows | http://127.0.0.1:8390 |
| SSH management tunnel | Windows local 8390 -> Linux 127.0.0.1:8384 |
| Syncthing sync endpoint | tcp://172.16.25.67:22000 |
| Linux Syncthing service | syncthing@med1.service |
| Normal folder mode after setup | Send & Receive on both devices |

## 3. Linux: verify the project

```
ssh med1@172.16.25.67
cd ~/av_project
pwd
ls -la
```

Expected root path:

```
/home/med1/av_project
```

The project root contains the Autoware workspace and the surrounding project-specific material:

```
av_project/
├── autoware/
│   ├── src/
│   ├── build/      # generated
│   ├── install/    # generated
│   └── log/        # generated
├── vehicle/
├── simulator/AWSIM/
├── data/
├── repositories/
└── docker/
```

## 4. Linux: install and start Syncthing

Install Syncthing using the official Debian/Ubuntu repository:

```
sudo mkdir -p /etc/apt/keyrings
sudo curl -L -o /etc/apt/keyrings/syncthing-archive-keyring.gpg \
  https://syncthing.net/release-key.gpg

echo "deb [signed-by=/etc/apt/keyrings/syncthing-archive-keyring.gpg] https://apt.syncthing.net/ syncthing stable-v2" | \
  sudo tee /etc/apt/sources.list.d/syncthing.list

sudo apt update
sudo apt install -y syncthing
syncthing --version
```

Enable the server-style systemd service so Syncthing starts at boot even when med1 has not logged in:

```
sudo systemctl enable --now syncthing@med1.service
systemctl status syncthing@med1.service
```

> **Expected state:** The service should show active (running). Press q to leave the status screen.

## 5. Linux: configure project exclusions

Create /home/med1/av_project/.stignore. These exclusions keep Linux build products, large/temporary data, Git databases, Python caches, and Unity/AWSIM generated state out of the Windows mirror.

```
cd ~/av_project
nano .stignore
```

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

> **.stignore behavior:** Syncthing does not synchronize the .stignore file itself. An equivalent .stignore must also exist on Windows.

## 6. Linux: firewall

```
sudo ufw status
```

If UFW is active, allow the Syncthing sync service. Do not expose the web GUI port 8384.

```
sudo ufw allow syncthing
sudo ufw status
```

> **Ports:** Port 22000 is used for direct synchronization. Port 8384 is the local administration GUI and remains bound to localhost.

## 7. Windows: create the local project folder

```
New-Item -ItemType Directory -Force "E:\work\av_project"
Get-ChildItem "E:\work\av_project"
```

For the first seed, the folder should be empty. Linux will provide the initial project contents.

## 8. Windows: install and start Syncthing

Install Syncthing Windows Setup (the Windows integration listed from Syncthing's downloads page) for the current user, with automatic start at Windows logon enabled. The Syncthing Web GUI should then be available locally at:

```
http://127.0.0.1:8384
```

> **Autostart:** If the chosen Windows package did not create autostart automatically, configure Syncthing through Windows Task Scheduler or the Startup folder.

## 9. Windows: securely access the Linux Syncthing GUI

Run this command from Windows PowerShell, not from the Linux shell:

```
ssh -N -L 8390:127.0.0.1:8384 med1@172.16.25.67
```

Enter the SSH password. With -N there is no remote shell, so after authentication the PowerShell window normally becomes silent. Leave that window open while you need the Linux GUI.

| GUI | Address |
| --- | --- |
| Windows Syncthing | http://127.0.0.1:8384 |
| Linux Syncthing through SSH | http://127.0.0.1:8390 |

> Why 8390?: Local port 8385 was denied/reserved on this Windows machine during setup. 8390 was selected instead. If 8390 is ever occupied, any other free local port can be used.

> **Important:** This SSH tunnel is only for viewing/configuring the Linux Syncthing GUI. Syncthing file transfer does not flow through this 8390 tunnel.

## 10. Pair the Windows and Linux devices

1. In the Linux GUI (127.0.0.1:8390), choose Actions > Show ID and copy the Linux Device ID.

2. In the Windows GUI (127.0.0.1:8384), choose Add Remote Device and paste the Linux Device ID.

3. Name the Linux device med1-linux.

4. For the Linux device address on Windows, set tcp://172.16.25.67:22000. Optionally add dynamic as a second address for fallback discovery.

5. Save. On Linux, accept the newly detected Windows device and name it windows-dev.

6. Confirm both sides show the other device under Remote Devices.

## 11. Initial safe transfer: Linux -> Windows

The first copy is deliberately one-way so the empty Windows folder cannot become the reference state.

### 11.1 Linux folder configuration

| Field | Value |
| --- | --- |
| Folder Label | av_project |
| Folder Path | /home/med1/av_project |
| Folder Type | Send Only |
| Share With | windows-dev |

### 11.2 Windows folder configuration

When Windows receives the share notification, accept it using:

| Field | Value |
| --- | --- |
| Folder Path | E:\work\av_project |
| Folder Type | Receive Only |

> **Do not switch modes yet:** Wait until both devices report Up to Date before enabling normal bidirectional editing.

## 12. Windows: create the matching .stignore

```
@'
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
'@ | Set-Content -Encoding utf8 "E:\work\av_project\.stignore"
```

## 13. Enable normal two-way synchronization

1. Confirm both sides show Up to Date.

2. Linux GUI: av_project > Edit > change Folder Type from Send Only to Send & Receive > Save.

3. Windows GUI: av_project > Edit > change Folder Type from Receive Only to Send & Receive > Save.

4. Wait again for Up to Date on both devices.

## 14. Verify both directions

### 14.1 Windows -> Linux

```
"windows sync test" | Set-Content "E:\work\av_project\sync-test.txt"
ssh med1@172.16.25.67 "cat ~/av_project/sync-test.txt"
```

Expected output: windows sync test

### 14.2 Linux -> Windows

```
ssh med1@172.16.25.67 "echo 'linux sync test' > ~/av_project/linux-test.txt"
Get-Content "E:\work\av_project\linux-test.txt"
```

Expected output: linux sync test

### 14.3 Remove test files

```
Remove-Item "E:\work\av_project\sync-test.txt"
Remove-Item "E:\work\av_project\linux-test.txt"
```

## 15. Use the workspace after setup

Open the project locally on Windows:

```
code E:\work\av_project
cd E:\work\av_project
claude
# or
opencode .
# or
codex
```

Build and run on Linux:

```
ssh med1@172.16.25.67
cd ~/av_project
docker compose up -d
docker compose exec dev bash
cd /workspace/autoware
colcon build --symlink-install --packages-select <package>
```

## 16. Setup completion checklist

- Linux Syncthing service is enabled and active.

- Windows Syncthing starts automatically at logon.

- Devices are paired: med1-linux <-> windows-dev.

- Linux folder path is /home/med1/av_project.

- Windows folder path is E:\work\av_project.

- Both folder modes are Send & Receive after the initial seed.

- Both sides have equivalent .stignore rules.

- Both sides report Up to Date.

- Windows -> Linux test succeeds.

- Linux -> Windows test succeeds.

- VS Code opens E:\work\av_project locally, not through Remote-SSH.

## 17. Known constraints

- Git metadata: The current ignore policy excludes **/.git. Use Git on Linux for repository history, branches, commits and remotes unless the Git strategy is changed later.

- Linux symbolic links: Windows is a development mirror; Linux remains the runtime workspace. Linux-specific symlink behavior may not reproduce identically on Windows.

- Generated artifacts: build/, install/, log/, caches and selected large data are intentionally not mirrored.

- Synchronization is not backup: A deletion in a Send & Receive folder normally propagates to the other device. Use source control and/or Syncthing file versioning/another backup mechanism for recovery.

## References

Official Syncthing documentation used for operational details:

- Syncthing - Starting Automatically

- Syncthing - Folder Types

- Syncthing - Ignoring Files

- Syncthing - FAQ / Remote GUI via SSH

- Syncthing - Understanding Synchronization and Conflicts

- Project source: SETUP.md supplied for this AV workspace (project structure, Docker bind-mount model, colcon workflow).
