import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { app, BrowserWindow, ipcMain, Menu, type MenuItemConstructorOptions } from 'electron';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Track window state
interface WindowState {
  alwaysOnTop: boolean;
  contentProtection: boolean;
}

let mainWindow: BrowserWindow | null = null;
const windowState: WindowState = {
  alwaysOnTop: false,
  contentProtection: false,
};

function createMenu(): void {
  const isMac = process.platform === 'darwin';

  const template: MenuItemConstructorOptions[] = [
    // App menu (macOS only)
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' as const },
              { type: 'separator' as const },
              { role: 'services' as const },
              { type: 'separator' as const },
              { role: 'hide' as const },
              { role: 'hideOthers' as const },
              { role: 'unhide' as const },
              { type: 'separator' as const },
              { role: 'quit' as const },
            ],
          },
        ]
      : []),
    // File menu
    {
      label: 'File',
      submenu: [isMac ? { role: 'close' as const } : { role: 'quit' as const }],
    },
    // Edit menu
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' as const },
        { role: 'redo' as const },
        { type: 'separator' as const },
        { role: 'cut' as const },
        { role: 'copy' as const },
        { role: 'paste' as const },
        ...(isMac
          ? [{ role: 'pasteAndMatchStyle' as const }, { role: 'delete' as const }, { role: 'selectAll' as const }]
          : [{ role: 'delete' as const }, { type: 'separator' as const }, { role: 'selectAll' as const }]),
      ],
    },
    // View menu
    {
      label: 'View',
      submenu: [
        { role: 'reload' as const },
        { role: 'forceReload' as const },
        { role: 'toggleDevTools' as const },
        { type: 'separator' as const },
        { role: 'resetZoom' as const },
        { role: 'zoomIn' as const },
        { role: 'zoomOut' as const },
        { type: 'separator' as const },
        { role: 'togglefullscreen' as const },
        { type: 'separator' as const },
        {
          label: 'Always on Top',
          type: 'checkbox' as const,
          checked: windowState.alwaysOnTop,
          click: () => {
            windowState.alwaysOnTop = !windowState.alwaysOnTop;
            mainWindow?.setAlwaysOnTop(windowState.alwaysOnTop, 'floating');
            createMenu(); // Refresh menu to update checkbox state
          },
        },
        {
          label: 'Hide from Screen Sharing',
          type: 'checkbox' as const,
          checked: windowState.contentProtection,
          click: () => {
            windowState.contentProtection = !windowState.contentProtection;
            mainWindow?.setContentProtection(windowState.contentProtection);
            createMenu(); // Refresh menu to update checkbox state
          },
        },
      ],
    },
    // Window menu
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' as const },
        { role: 'zoom' as const },
        ...(isMac
          ? [
              { type: 'separator' as const },
              { role: 'front' as const },
              { type: 'separator' as const },
              { role: 'window' as const },
            ]
          : [{ role: 'close' as const }]),
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createWindow(): void {
  // Determine preload path based on environment
  const preloadPath = path.join(__dirname, 'preload.js');

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    // macOS specific styling
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    trafficLightPosition: { x: 16, y: 16 },
  });

  // Load the app with retry logic for dev server
  // Increased retries and delay to handle Vite restart during dep-scan
  const loadApp = async (retries = 10, delay = 2000): Promise<void> => {
    if (!mainWindow) return;

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      try {
        await mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
      } catch (error) {
        if (retries > 0) {
          console.log(`Failed to load dev server, retrying in ${delay}ms... (${retries} retries left)`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return loadApp(retries - 1, delay);
        }
        console.error('Failed to load dev server after all retries:', error);
      }
    } else {
      mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }
  };

  loadApp();

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development' || MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Setup IPC handlers
function setupIpcHandlers(): void {
  // Toggle always on top
  ipcMain.handle('window:setAlwaysOnTop', (_event, enable: boolean) => {
    if (mainWindow) {
      windowState.alwaysOnTop = enable;
      mainWindow.setAlwaysOnTop(enable, 'floating');
      createMenu(); // Update menu checkbox state
      return true;
    }
    return false;
  });

  // Toggle content protection (hide from screen sharing)
  ipcMain.handle('window:setContentProtection', (_event, enable: boolean) => {
    if (mainWindow) {
      windowState.contentProtection = enable;
      mainWindow.setContentProtection(enable);
      createMenu(); // Update menu checkbox state
      return true;
    }
    return false;
  });

  // Get current window state
  ipcMain.handle('window:getState', () => {
    return { ...windowState };
  });
}

// App lifecycle
app.whenReady().then(() => {
  setupIpcHandlers();
  createMenu();
  createWindow();

  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // On macOS, keep app running until explicitly quit
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Declare globals injected by Electron Forge Vite plugin
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;
