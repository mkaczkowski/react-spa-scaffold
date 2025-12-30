import type { PatternMap } from './types.js';

export const storePatterns: PatternMap = {
  'zustand-store': {
    file: 'src/stores/preferencesStore.ts',
    description: 'Zustand store with persistence and devtools',
    keyPoints: [
      'Separate type and interface definitions',
      'Middleware stack: devtools(persist(...))',
      'partialize for selective persistence',
      'Computed getter (getResolvedTheme)',
      'reset() action for initial state',
      'Multi-tab sync function export',
    ],
  },
  'store-persistence': {
    file: 'src/stores/preferencesStore.ts',
    description: 'Zustand persist middleware',
    keyPoints: [
      'persist() middleware with name key',
      'partialize to select what to persist',
      'Storage key naming convention',
    ],
  },
  'multi-tab-sync': {
    file: 'src/stores/preferencesStore.ts',
    description: 'Multi-tab state synchronization',
    keyPoints: ['Storage event listener', 'Rehydrate on storage change', 'Cleanup function for HMR'],
  },
  'storage-utility': {
    file: 'src/lib/storage.ts',
    description: 'Type-safe localStorage utilities',
    keyPoints: [
      'SSR-safe (typeof window check)',
      'JSON serialization',
      'Generic type parameter',
      'Error handling with fallback',
      'clearAppStorage for all prefixed keys',
    ],
  },
};
