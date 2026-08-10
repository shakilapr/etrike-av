# AV Project Syncthing Operations Guide

*Daily use, start/stop behavior, offline work, maintenance, failures, and recovery*

| Item | Value |
|---|---|
| Windows project root | E:\work\av_project |
| Linux project root | /home/med1/av_project |
| Linux SSH host | med1@172.16.25.56 |
| Synchronization | Syncthing (bidirectional after initial seed) |

> Version 1.0 - 10 August 2026
> Project-specific guide for the AV development workspace.

## 1. What must be running for synchronization

The synchronization path is direct between the Windows Syncthing process and the Linux Syncthing service. The Web GUIs are only control panels. The SSH tunnel used to view the Linux GUI is not required for normal file synchronization.

```
NORMAL SYNC PATH
Windows Syncthing  <==== TCP 22000 ====>  Linux Syncthing service
E:\work\av_project                       /home/med1/av_project

MANAGEMENT ONLY
Windows browser -> 127.0.0.1:8390 -> SSH tunnel -> Linux GUI 127.0.0.1:8384
```

> **Daily rule:** Do not open the Linux GUI tunnel every day. Do not keep either browser GUI open. They are only needed when checking status or changing settings.

## 2. Normal daily startup

### 2.1 Linux

Linux was configured with syncthing@med1.service as a system service. It should start automatically when the Linux machine boots, before any interactive med1 login is required.

```
systemctl status syncthing@med1.service
```

### 2.2 Windows

Windows Syncthing should start automatically when you log in, assuming the Windows installation/autostart option was enabled. You normally do not launch it manually.

### 2.3 What you actually do

```
code E:\work\av_project
# work normally in VS Code / Claude / OpenCode / Codex
```

When a change is written under the synchronized project tree and is not ignored, Syncthing detects it and sends it to Linux when the peer is reachable.

## 3. Quick daily health check

Most days no check is necessary. If you want to verify before a build or important test:

1. Open http://127.0.0.1:8384 on Windows.

2. Confirm med1-linux is Connected.

3. Confirm av_project shows Up to Date.

4. If Linux status is also required, temporarily open the SSH GUI tunnel described later in this guide.

> **Before a critical Linux build:** Wait for Windows av_project to show Up to Date, especially after a large refactor or file move.

## 4. Normal development workflow

1. Open E:\work\av_project in local VS Code.

2. Edit source/configuration with local Windows tools.

3. Allow Syncthing to propagate changes automatically.

4. SSH to Linux when you need to compile, launch, run Docker, ROS 2, AWSIM, or hardware tests.

5. Build only the package(s) that changed where practical.

6. Commit/version-control changes from the Linux repositories under the current Git strategy because .git is not mirrored to Windows.

```
ssh med1@172.16.25.56
cd ~/av_project
docker compose up -d
docker compose exec dev bash
cd /workspace/autoware
colcon build --symlink-install --packages-select <package>
```

## 5. Opening the Syncthing GUIs

### 5.1 Windows GUI

```
http://127.0.0.1:8384
```

This works whenever the Windows Syncthing process is running.

### 5.2 Linux GUI from Windows

Open a Windows PowerShell window and run:

```
ssh -N -L 8390:127.0.0.1:8384 med1@172.16.25.56
```

After entering the password, silence is normal. While that PowerShell window remains open, browse to:

```
http://127.0.0.1:8390
```

### 5.3 Closing the Linux GUI tunnel

Press Ctrl+C in that PowerShell window. This closes only the management tunnel. File synchronization continues because it uses the Syncthing device connection, not port 8390.

## 6. What happens when machines are turned off

| Situation | What happens | What to do |
| --- | --- | --- |
| Windows is off; Linux is on | Linux continues running. No transfer to Windows occurs. | Nothing. On the next Windows login, Syncthing reconnects and catches up. |
| Linux is off; Windows is on | Windows changes remain local and pending. | Keep working if desired. When Linux returns, changes sync automatically. |
| Both are off | Nothing changes or transfers. | Start them normally later. |
| Linux reboots | The system service should restart automatically. | Usually nothing. If not connected after boot, check systemctl status. |
| Windows reboots/logs out | Windows Syncthing stops with the session unless configured as a system service. | Log in; autostart should launch it and synchronization resumes. |

## 7. Working while disconnected or offline

It is safe to work on one device while the other is offline. Syncthing tracks local changes and reconciles them after reconnection. The main risk is editing the same file independently on both sides while disconnected.

> **Avoid dual edits:** If Windows and Linux both modify the same file before they can exchange updates, Syncthing may create a sync-conflict copy instead of silently overwriting one version.

For planned offline work, choose one side as the active editor. In this project, Windows should normally remain the editing side and Linux the build/runtime side.

## 8. Conflict files

When the same file is changed independently on multiple devices, Syncthing can preserve both versions by renaming one with a .sync-conflict-... name. Treat this as a manual merge event.

```
example.cpp
example.sync-conflict-YYYYMMDD-HHMMSS-DEVICE.cpp
```

1. Stop editing the affected file temporarily.

2. Compare the normal file with the sync-conflict copy.

3. Merge the required changes into the correct file.

4. Build/test the merged result on Linux.

5. Delete the conflict copy only after confirming the merge.

6. Let Syncthing return to Up to Date.

## 9. Deletions, renames, and large refactors

In Send & Receive mode, deletions and renames are synchronization events. A deletion on Windows can therefore delete the corresponding Linux file, and vice versa.

> **Before a large destructive change:** Commit important work to Git on Linux and/or create a backup. Syncthing is synchronization, not a substitute for source control or backups.

For a very large rename/refactor, keep both devices connected until the folder returns to Up to Date before starting a build or shutting either machine down.

## 10. Recommended file versioning for safety

Syncthing file versioning is optional but useful as a second line of defense against accidental remote replacement/deletion. Versioning is configured per folder and per device, and applies to changes received from the other device.

Recommended approach for this project: enable Staggered File Versioning on the Linux av_project folder so Windows-originated deletions/replacements can leave recoverable older copies on Linux. This is not a substitute for Git or a real backup.

1. Open the Linux Syncthing GUI through the SSH tunnel.

2. av_project > Edit > File Versioning.

3. Select Staggered File Versioning.

4. Choose a retention period appropriate to available disk space (for example, 30-90 days).

5. Save and monitor disk usage, especially after large refactors.

> **Important limitation:** If you modify a file locally on the same device where versioning is enabled, Syncthing cannot archive that local pre-change version. Versioning protects versions replaced/deleted due to remote synchronization.

## 11. Pause or stop synchronization intentionally

### 11.1 Temporarily pause a folder/device

Use the Web GUI pause control when you intentionally need to prevent transfer without shutting Syncthing down. Resume when finished and wait for Up to Date.

### 11.2 Stop Windows Syncthing

Use Actions > Shutdown in the Windows GUI when you intentionally want to stop the Syncthing process. Starting/relogging later resumes synchronization.

### 11.3 Stop Linux Syncthing service

```
sudo systemctl stop syncthing@med1.service
# later
sudo systemctl start syncthing@med1.service
```

> **Do not use stop as a normal workflow:** There is no need to stop Syncthing before shutting down either computer. Normal OS shutdown/reboot is fine.

## 12. After Windows or Linux changes IP/network

The Windows configuration currently points directly to tcp://172.16.25.56:22000. If the Linux server IP changes, Windows may no longer connect using that static address.

1. Confirm the new Linux IP address.

2. Windows Syncthing > med1-linux > Edit > Advanced > Addresses.

3. Replace the old tcp://172.16.25.56:22000 value with the new address.

4. Optionally retain dynamic as an additional address so discovery can provide a fallback.

If 172.16.25.56 is intentionally a fixed LAN address, no routine change is needed.

## 13. If synchronization stops

| Symptom | Check | Fix |
| --- | --- | --- |
| Windows says Disconnected | Is Linux powered on and reachable by SSH? | Test ssh med1@172.16.25.56. Then check Linux Syncthing service. |
| SSH works, Syncthing disconnected | systemctl status syncthing@med1.service | Start/restart the service; verify firewall and port 22000. |
| Folder says Out of Sync | Open folder details and inspect failed items. | Resolve permissions, invalid filenames, conflicts, or unavailable paths; then rescan. |
| Windows GUI does not open | Is Windows Syncthing process running? | Start Syncthing / verify autostart. |
| Linux GUI does not open on 8390 | Is the SSH tunnel running? | Run the ssh -N -L 8390... command from Windows PowerShell. |
| 8390 bind permission/used error | Local port unavailable/reserved. | Use another free local port, e.g. 8391, and browse to the matching localhost port. |

## 14. Linux service diagnostics

```
systemctl status syncthing@med1.service
journalctl -u syncthing@med1.service -n 100 --no-pager
sudo systemctl restart syncthing@med1.service
```

Use restart only when necessary; normal synchronization should recover automatically from temporary network outages.

## 15. Windows autostart diagnostics

If Syncthing does not start after Windows login:

- Check the chosen Windows Syncthing wrapper/installer startup option.

- Check Task Manager for the Syncthing process.

- If using Task Scheduler, confirm the task is enabled and triggers at logon/startup.

- If using the Startup folder, verify the Syncthing shortcut still exists.

- After starting Syncthing, confirm http://127.0.0.1:8384 loads.

## 16. Ignore rules maintenance

Because .stignore itself is not synchronized, changes to ignore rules must be deliberately made on both Windows and Linux.

```
Current key ignores:
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

> **When adding a new generated directory:** Add the same ignore rule on both devices before large generated content is created, whenever possible.

## 17. Git workflow under the current setup

The synchronization policy excludes **/.git. Therefore the Windows mirror contains source files but not the nested repository databases/history. Continue Git operations on Linux for the current setup.

```
ssh med1@172.16.25.56
cd ~/av_project/autoware/src/<repository>
git status
git diff
git add ...
git commit ...
```

Do not remove the .git ignore simply to get local Git without first redesigning the Git workflow. Autoware is a multi-repository workspace, and independently modifying synchronized Git metadata on Windows and Linux can create unnecessary risk.

## 18. Build artifacts and generated files

The following are intentionally Linux-local and should not be expected to appear on Windows:

- autoware/build/

- autoware/install/

- autoware/log/

- data/bags/

- Python/cache directories matched by ignore rules

- AWSIM Unity-generated Library/Temp/obj/Logs/UserSettings directories

This is intentional. Linux is the execution/build environment; Windows is the editing mirror.

## 19. Special condition: change folder modes temporarily

| Goal | Windows mode | Linux mode | Use |
| --- | --- | --- | --- |
| Normal development | Send & Receive | Send & Receive | Default daily operation. |
| Re-seed Windows from known-good Linux copy | Receive Only | Send Only | Use carefully; verify Linux is the desired reference copy first. |
| Protect Linux from incoming edits temporarily | Send & Receive | Send Only | Linux observes remote differences but will not apply them. |
| Make Windows a passive mirror temporarily | Receive Only | Send & Receive | Windows receives but does not propagate its local changes. |

> **Danger:** Never press Override Changes or Revert Local Changes casually. Those actions intentionally force one side’s state and can overwrite/delete files.

## 20. Special condition: one side was edited while sync was intentionally paused

1. Before resuming, identify which side contains the intended latest state.

2. If only one side was edited, resume synchronization normally.

3. If both sides were edited, expect possible conflict copies; do not force override until changes are reviewed.

4. After resuming, wait for Up to Date and inspect any sync-conflict files before building.

## 21. Special condition: accidental mass deletion or corruption

1. If synchronization has not yet propagated, pause the affected folder/device immediately on the other machine.

2. Do not use Override Changes or Revert Local Changes without understanding which side is correct.

3. Recover from Git commits/branches first for source code where possible.

4. If Syncthing File Versioning is enabled on the receiving device, inspect .stversions / restore an archived version.

5. Use independent backups for anything not recoverable from Git or versioning.

6. After recovery, resume synchronization and verify both sides carefully.

## 22. Special condition: server replaced or project moved

If /home/med1/av_project moves to a different Linux path or the server is replaced, do not point an existing folder blindly at an unrelated/empty path.

1. Pause synchronization.

2. Create/restore the intended project on the new Linux location.

3. Verify contents independently.

4. Update the Linux Syncthing folder path or recreate the share deliberately.

5. If the Linux device identity changes, pair the new Device ID with Windows.

6. Use Send Only/Receive Only for a controlled re-seed if one copy is clearly authoritative.

7. Return both to Send & Receive after verification.

## 23. Security practices

- Keep the Linux Syncthing GUI bound to localhost; access it through SSH instead of exposing 8384 to the LAN/Internet.

- Use trusted Device IDs; do not accept unknown devices or folders.

- Keep SSH access protected and consider SSH keys instead of repeated password authentication.

- Do not expose Syncthing GUI port 8384 through the firewall unless there is a specific secured reason.

- Keep Syncthing updated on both sides, but avoid changing both configurations during an active critical build/refactor.

## 24. End-of-day procedure

There is no mandatory shutdown ritual. For normal work:

1. Save your files.

2. Optionally check Windows Syncthing shows Up to Date.

3. Commit important work to Git on Linux.

4. Close VS Code and terminals normally.

5. Shut down Windows and/or Linux normally if desired. Syncthing will resume after startup/reconnection.

> **Best practice:** Before shutting down immediately after a large edit, rename, or deletion, wait for Up to Date so you know Linux has received the intended state.

## 25. Quick command/reference sheet

| Purpose | Command / Address |
| --- | --- |
| Open Windows project | code E:\work\av_project |
| SSH to Linux | ssh med1@172.16.25.56 |
| Windows GUI | http://127.0.0.1:8384 |
| Open Linux GUI tunnel | ssh -N -L 8390:127.0.0.1:8384 med1@172.16.25.56 |
| Linux GUI while tunnel open | http://127.0.0.1:8390 |
| Check Linux Syncthing | systemctl status syncthing@med1.service |
| Restart Linux Syncthing | sudo systemctl restart syncthing@med1.service |
| Linux project root | /home/med1/av_project |
| Windows project root | E:\work\av_project |
| Linux sync address from Windows | tcp://172.16.25.56:22000 |

## 26. Operational checklist

- Windows Syncthing running after login.

- Linux syncthing@med1.service active after boot.

- med1-linux Connected when both machines are online.

- av_project Up to Date before important Linux builds/tests.

- No unexpected sync-conflict files.

- No generated build/cache directories entering synchronization.

- Important source work committed to Git on Linux.

- Backups/versioning used for recovery needs; do not treat Syncthing itself as a backup.

## References

Official Syncthing documentation used for operational details:

- Syncthing - Starting Automatically

- Syncthing - Configuration / Device Addresses

- Syncthing - Folder Types

- Syncthing - Ignoring Files

- Syncthing - Understanding Synchronization and Conflicts

- Syncthing - File Versioning

- Syncthing - FAQ / Remote GUI and backup guidance

- Project source: SETUP.md supplied for this AV workspace (project structure, Docker bind-mount model, colcon workflow).
