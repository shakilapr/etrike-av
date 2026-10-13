/**
 * Electron Main Process for CAN Watcher.
 * Conforms to canonical boundary:
 * Window management, system menus, updater, native dialogs, and Python child process lifecycle management only.
 */

const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const logFile = path.join(__dirname, 'electron_debug.log');
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try { fs.appendFileSync(logFile, line); } catch (_) {}
}

const origLog = console.log;
const origErr = console.error;
console.log = (...args) => {
  origLog.apply(console, args);
  log(args.join(' '));
};
console.error = (...args) => {
  origErr.apply(console, args);
  log('[ERROR] ' + args.join(' '));
};

process.on('uncaughtException', (err) => {
  log(`UncaughtException: ${err.stack || err}`);
});
process.on('unhandledRejection', (reason) => {
  log(`UnhandledRejection: ${reason}`);
});

let mainWindow = null;
let pythonProcess = null;
const BACKEND_PORT = Number(process.env.AV_DASHBOARD_PORT || 8080);
const BACKEND_URL = `http://127.0.0.1:${BACKEND_PORT}`;


// Check if Python backend is already running on port 8080
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

  pythonProcess = spawn(pythonCmd, ['-m', 'tools.av_dashboard.backend.server', '--sim', '--port', String(BACKEND_PORT)], {
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
    title: 'seer — e-trike av',
    width: 1560,
    height: 920,
    minWidth: 1200,
    minHeight: 700,
    center: true,
    backgroundColor: '#000000',
    show: true,
    autoHideMenuBar: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
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
          label: 'About seer',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'seer',
              message: 'seer — e-trike av\nEngineering CAN Bus & Telemetry Monitor',
              detail: 'Built with React 18, Vite, TypeScript, Tailwind CSS, Zustand, and Python FastAPI backend.',
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Lifecycle & diagnostic listeners
  mainWindow.webContents.on('did-start-loading', () => {
    log('[Electron] webContents did-start-loading');
  });

  mainWindow.webContents.on('dom-ready', () => {
    log('[Electron] webContents dom-ready');
  });

  mainWindow.webContents.on('did-finish-load', () => {
    log('[Electron] webContents did-finish-load successfully');
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.webContents.on('did-fail-load', (e, code, desc, validatedURL) => {
    log(`[Electron] Failed to load ${validatedURL}: [${code}] ${desc}`);
    setTimeout(() => {
      if (mainWindow) {
        log(`[Electron] Retrying loadURL(${BACKEND_URL})...`);
        mainWindow.loadURL(BACKEND_URL);
      }
    }, 1500);
  });

  mainWindow.webContents.on('console-message', (e, level, message) => {
    log(`[Renderer Console] ${message}`);
  });

  mainWindow.on('ready-to-show', () => {
    log('[Electron] mainWindow ready-to-show');
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('show', () => {
    log('[Electron] mainWindow shown');
  });

  mainWindow.on('closed', () => {
    log('[Electron] mainWindow closed');
    mainWindow = null;
  });

  log(`[Electron] Loading ${BACKEND_URL}...`);
  mainWindow.loadURL(BACKEND_URL);
  mainWindow.show();
  mainWindow.focus();
}

app.whenReady().then(async () => {
  log('[Electron] app.whenReady fired');
  await ensureBackendRunning();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('will-quit', () => {
  log('[Electron] app.will-quit fired');
  if (pythonProcess) {
    log('[Electron] Terminating Python child process...');
    pythonProcess.kill();
    pythonProcess = null;
  }
});

app.on('window-all-closed', () => {
  log('[Electron] window-all-closed fired');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

