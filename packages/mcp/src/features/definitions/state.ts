import type { Feature } from '../types.js';

export const state: Feature = {
  name: 'State Management',
  description: 'Zustand with persistence, devtools, and multi-tab sync',
  required: false,
  dependencies: ['zustand'],
  files: [
    'src/stores/preferencesStore.ts',
    'src/stores/index.ts',
    'src/lib/storage.ts',
    'src/lib/storageKeys.ts',
    'src/types/preferences.ts',
  ],
  testFiles: ['src/lib/storage.test.ts', 'src/stores/preferencesStore.test.ts'],
  scripts: {},
};
