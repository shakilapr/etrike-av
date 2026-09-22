/**
 * Electron Main Process for CANByte Watcher.
 * Conforms to canonical boundary:
 * Window management, system menus, updater, native dialogs, and Python child process lifecycle management only.
 */

const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

let mainWindow = null;
let pythonProcess = null;
const BACKEND_PORT = 8000;
const BACKEND_URL = `http://127.0.0.1:${BACKEND_PORT}`;

// Check if Python backend is already running on port 8000
function checkBackendHealth() {
  return new Promise((resolve) => {
    const req = http.get(`${BACKEND_URL}/api/v1/status`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(600, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Find Python executable on Windows
function getPythonCommand() {
  if (process.platform !== 'win32') return 'python3';
  const candidates = [
    process.env.PYTHON,
    'E:\\miniconda\\python.exe',
    'python.exe',
  ];
  for (const c of candidates) {
    if (c && fs.existsSync(c)) return c;
  }
  return 'python';
}

// Spawn Python backend process if not already alive
async function ensureBackendRunning() {
  const isHealthy = await checkBackendHealth();
  if (isHealthy) {
    console.log(`[Electron] Python backend already active on ${BACKEND_URL}`);
    return;
  }

  const workspaceRoot = path.resolve(__dirname, '../../..');
  const pythonCmd = getPythonCommand();
  console.log(`[Electron] Spawning Python backend via '${pythonCmd}' from ${workspaceRoot}...`);

  pythonProcess = spawn(pythonCmd, ['-m', 'tools.can_watcher.backend.server', '--sim', '--port', String(BACKEND_PORT)], {
    cwd: workspaceRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, PYTHONPATH: workspaceRoot },
  });

  pythonProcess.stdout.on('data', (data) => {
    console.log(`[Backend stdout] ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`[Backend stderr] ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`[Electron] Backend process exited with code ${code}`);
    pythonProcess = null;
  });

  // Poll until backend is healthy (up to 8s)
  for (let i = 0; i < 32; i++) {
    await new Promise((r) => setTimeout(r, 250));
    if (await checkBackendHealth()) {
      console.log('[Electron] Backend connection confirmed!');
      return;
    }
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'CANByte Watcher - E-Trike Telemetry & Bus Analyzer',
    width: 1560,
    height: 920,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#020617',
    show: true, // Show immediately to prevent blank/hidden window states
    autoHideMenuBar: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false, // Ensure local WebSocket and Fetch are unrestricted
    },
  });

  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Reload View',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow && mainWindow.reload(),
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        {
          label: 'Developer Tools',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => mainWindow && mainWindow.webContents.toggleDevTools(),
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'API Documentation (/docs)',
          click: () => shell.openExternal(`${BACKEND_URL}/docs`),
        },
        {
          label: 'About CANByte Watcher',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About CANByte Watcher',
              message: 'CANByte Watcher v2.0.0\nE-Trike AV Telemetry & Bus Protocol Analyzer',
              detail: 'Built with React 18, Vite, TypeScript, Tailwind CSS, Zustand, and Python FastAPI backend.',
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Error handling and console logging
  mainWindow.webContents.on('did-fail-load', (e, code, desc, validatedURL) => {
    console.error(`[Electron] Failed to load ${validatedURL}: [${code}] ${desc}`);
    setTimeout(() => {
      if (mainWindow) {
        console.log(`[Electron] Retrying loadURL(${BACKEND_URL})...`);
        mainWindow.loadURL(BACKEND_URL);
      }
    }, 1500);
  });

  mainWindow.webContents.on('console-message', (e, level, message) => {
    console.log(`[Renderer] ${message}`);
  });

  console.log(`[Electron] Loading ${BACKEND_URL}...`);
  mainWindow.loadURL(BACKEND_URL);
  mainWindow.focus();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  await ensureBackendRunning();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('will-quit', () => {
  if (pythonProcess) {
    console.log('[Electron] Terminating Python child process...');
    pythonProcess.kill();
    pythonProcess = null;
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
