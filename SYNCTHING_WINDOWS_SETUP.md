# Windows Syncthing Setup

Setup completed on August 10, 2026.

## Project directory

The project directory was created and verified as empty before installation:

```powershell
New-Item -ItemType Directory -Force "E:\work\av_project"
Get-ChildItem "E:\work\av_project" -Force
```

No project files were copied into the directory during the Syncthing installation. This document is the first file intentionally added afterward.

## Syncthing installation

The WinGet package used was:

```text
BillStewart.SyncthingWindowsSetup
```

WinGet reported Syncthing Windows Setup version `2.0.2`. It was installed for the current Windows user, without installing a Windows service:

```powershell
winget install --exact --id BillStewart.SyncthingWindowsSetup `
  --source winget `
  --scope user `
  --silent `
  --accept-package-agreements `
  --accept-source-agreements `
  --override "/CURRENTUSER /SILENT /TASKS=startatlogon,startafterinstall"
```

This configuration enables:

- Starting Syncthing automatically when the current user logs on
- Starting Syncthing after installation
- A current-user installation rather than a Windows service

The installed executable is located at:

```text
C:\Users\logsh\AppData\Local\Programs\Syncthing\syncthing.exe
```

## Windows Firewall rule

A silent current-user installation cannot create the firewall rule itself, so the installer's helper was run separately with Windows elevation:

```powershell
cscript.exe //NoLogo "C:\Users\logsh\AppData\Local\Programs\Syncthing\SyncthingFirewallRule.js" /create
```

The resulting firewall rule is named `Syncthing`.

## Verification

The completed installation was checked for the following:

- Scheduled task: `Start Syncthing at logon (logsh@LAPTOP-95TUA24E)`
- Running Syncthing processes: 2
- Windows Firewall rule: `Syncthing`
- Web GUI HTTP status: `200`
- Web GUI address: <http://127.0.0.1:8384>

Open <http://127.0.0.1:8384> to configure folders and remote devices.

## References

- [Syncthing Windows Setup](https://github.com/Bill-Stewart/SyncthingWindowsSetup)
- [Syncthing](https://syncthing.net/)
