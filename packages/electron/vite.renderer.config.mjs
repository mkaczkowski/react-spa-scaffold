import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { lingui } from '@lingui/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Support both flat layout (config at root) and packages/electron layout
// Flat: __dirname is project root, packages: __dirname is packages/electron
const isPackagesLayout = existsSync(path.join(__dirname, '..', '..', 'package.json')) &&
  __dirname.includes('packages/electron');
const rootDir = isPackagesLayout ? path.resolve(__dirname, '../..') : __dirname;

export default defineConfig({
  root: rootDir,
  plugins: [
    react({
      babel: {
        plugins: ['@lingui/babel-plugin-lingui-macro'],
      },
    }),
    lingui(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
  base: './', // Critical: Use relative paths for file:// protocol
  build: {
    outDir: path.resolve(__dirname, '.vite/renderer/main_window'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(rootDir, 'index.html'),
    },
  },
  // Dev server configuration for HMR
  server: {
    port: 5173,
    strictPort: true,
  },
  // Dependency optimization settings
  optimizeDeps: {
    // Include problematic ESM/CJS packages
    include: ['cookie'],
  },
});
