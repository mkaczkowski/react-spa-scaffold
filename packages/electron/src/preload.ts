import { contextBridge, ipcRenderer } from 'electron';

// Define the API shape
export interface ElectronAPI {
  window: {
    setAlwaysOnTop: (enable: boolean) => Promise<boolean>;
    setContentProtection: (enable: boolean) => Promise<boolean>;
    getState: () => Promise<{
      alwaysOnTop: boolean;
      contentProtection: boolean;
    }>;
  };
  platform: NodeJS.Platform;
  isElectron: true;
}

// Expose protected methods via contextBridge
contextBridge.exposeInMainWorld('electronAPI', {
  window: {
    setAlwaysOnTop: (enable: boolean) => ipcRenderer.invoke('window:setAlwaysOnTop', enable),
    setContentProtection: (enable: boolean) => ipcRenderer.invoke('window:setContentProtection', enable),
    getState: () => ipcRenderer.invoke('window:getState'),
  },
  platform: process.platform,
  isElectron: true,
} satisfies ElectronAPI);
