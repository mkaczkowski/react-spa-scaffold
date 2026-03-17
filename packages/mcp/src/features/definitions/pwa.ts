import type { Feature } from '../types.js';

export const pwa: Feature = {
  name: 'PWA Support',
  description: 'Progressive Web App with offline support, installability, and auto-update prompts',
  required: false,
  requires: ['ui'],
  dependencies: [],
  devDependencies: ['vite-plugin-pwa'],
  files: [
    'src/components/shared/PWAUpdatePrompt/PWAUpdatePrompt.tsx',
    'src/components/shared/PWAUpdatePrompt/index.ts',
    'src/mocks/virtual-pwa-register-react.ts',
    'public/pwa-192x192.png',
    'public/pwa-512x512.png',
  ],
  testFiles: ['src/components/shared/PWAUpdatePrompt/PWAUpdatePrompt.test.tsx'],
  scripts: {},
};
