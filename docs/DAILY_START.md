# Daily Quick Start Guide

Here is your simple everyday checklist to get up and running on the AV Project.

## 1. Check Windows Sync
Your Windows computer automatically syncs your files in the background. To check if it's working:
- Open your web browser and go to: [http://127.0.0.1:8384](http://127.0.0.1:8384)
- Look for the "Up to Date" status.

## 2. Check Linux Sync
The Linux computer also syncs automatically, but to view its status on your Windows screen, you need to connect to it securely.

1. Open **Windows PowerShell**.
2. Copy and paste this command, then press Enter:
   ```powershell
   ssh -N -L 8390:127.0.0.1:8384 med1@172.16.25.56
   ```
3. Type in the password. *(The window will just sit there without a prompt—this is normal. Just leave it open in the background).*
4. Open your web browser and go to: [http://127.0.0.1:8390](http://127.0.0.1:8390)
5. Look for the "Up to Date" status.

## 3. Write Code (On Windows)
You can write and edit your code normally on your Windows computer.
- Open the project folder (`E:\work\av_project`) in your code editor (like VS Code).
- Whenever you save a file, it will automatically and instantly copy over to the Linux computer.

## 4. Build Code (On Linux)
Instead of typing long docker commands, you can use the helpful shortcut scripts included in the project.

1. Open a **new Windows PowerShell** window.
2. Log into the Linux computer by copying and running this:
   ```powershell
   ssh med1@172.16.25.56
   ```
3. Once logged in, go to the project folder:
   ```bash
   cd ~/av_project
   ```
4. Run the build script to compile your changes:
   ```bash
   ./docker/build.sh
   ```
   *(This automatically handles everything inside the Docker container.)*

## 5. Start the Simulator & RViz (On Linux)
Once your code is built, you can easily launch the Autoware planning simulator (which automatically opens RViz).

Still in the `~/av_project` folder on the Linux computer, run this shortcut command:
```bash
./docker/run.sh
```

### Need to run custom commands?
If you ever need an interactive shell inside the container (with GPU and display setup ready to go), use:
```bash
./docker/shell.sh
```
