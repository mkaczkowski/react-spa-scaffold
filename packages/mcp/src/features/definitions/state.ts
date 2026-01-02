import type { Feature } from '../types.js';

export const state: Feature = {
  name: 'State Management',
  description: 'Zustand with persistence, devtools, versioning, and auto-generated selectors',
  required: false,
  dependencies: ['zustand'],
  files: [
    'src/stores/preferencesStore.ts',
    'src/stores/index.ts',
    'src/lib/createSelectors.ts',
    'src/lib/storage.ts',
    'src/lib/storageKeys.ts',
    'src/types/preferences.ts',
    'src/hooks/useLocalStorage.ts',
  ],
  testFiles: [
    'src/lib/storage.test.ts',
    'src/lib/createSelectors.test.ts',
    'src/stores/preferencesStore.test.ts',
    'src/hooks/useLocalStorage.test.ts',
  ],
  scripts: {},
};
