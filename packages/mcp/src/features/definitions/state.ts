import type { Feature } from '../types.js';

export const state: Feature = {
  name: 'State Management',
  description: 'Zustand with persistence, devtools, and multi-tab sync',
  required: false,
  includes: [
    'Zustand store',
    'Persist middleware (localStorage)',
    'Devtools middleware',
    'Multi-tab sync utility (initPreferencesSync)',
    'Storage utilities (get/set/remove/clear)',
    'Prefixed storage keys',
    'Example preferences store (theme)',
    'Type-safe store selectors',
  ],
  dependencyNames: ['zustand'],
  files: [
    'src/stores/preferencesStore.ts',
    'src/stores/index.ts',
    'src/lib/storage.ts',
    'src/lib/storageKeys.ts',
    'src/types/preferences.ts',
  ],
  testFiles: ['src/lib/storage.test.ts', 'src/stores/preferencesStore.test.ts'],
  patterns: ['zustand-store', 'store-persistence', 'multi-tab-sync', 'storage-utility'],
  scripts: {},
};
