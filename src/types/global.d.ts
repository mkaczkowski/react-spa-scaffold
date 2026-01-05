/**
 * Global type declarations for Electron integration.
 * These types are automatically available in the renderer process
 * when running inside Electron.
 */

interface ElectronWindowAPI {
  setAlwaysOnTop: (enable: boolean) => Promise<boolean>;
  setContentProtection: (enable: boolean) => Promise<boolean>;
  getState: () => Promise<{
    alwaysOnTop: boolean;
    contentProtection: boolean;
  }>;
}

interface ElectronAPI {
  window: ElectronWindowAPI;
  platform: NodeJS.Platform;
  isElectron: true;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
