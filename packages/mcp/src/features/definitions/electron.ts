import type { Feature } from '../types.js';

export const electron: Feature = {
  name: 'Electron Desktop',
  description: 'Desktop app wrapper with secure IPC bridge',
  required: false,
  requires: ['routing'], // Needs routing for HashRouter conditional
  dependencies: [],
  devDependencies: [
    'electron',
    '@electron-forge/cli',
    '@electron-forge/plugin-vite',
    '@electron-forge/maker-dmg',
    '@electron-forge/maker-zip',
  ],
  files: ['src/main.ts', 'src/preload.ts'],
  testFiles: [],
  scripts: {
    'electron:dev': 'electron-forge start',
    'electron:build': 'electron-forge package',
    'electron:make': 'electron-forge make',
  },
  configFiles: ['forge.config.js', 'vite.main.config.mjs', 'vite.preload.config.mjs', 'vite.renderer.config.mjs'],
};
