import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/lib/storageKeys';
import type { Preferences, Theme } from '@/types';

interface PreferencesState extends Preferences {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  reset: () => void;
}

const initialState: Preferences = {
  theme: 'light',
};

export const usePreferencesStore = create<PreferencesState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setTheme: (theme) => set({ theme }),
        toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
        reset: () => set(initialState),
      }),
      {
        name: STORAGE_KEYS.preferences,
        partialize: (state) => ({ theme: state.theme }),
      },
    ),
    { name: 'preferences' },
  ),
);

// Multi-tab sync
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEYS.preferences && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed.state) {
          usePreferencesStore.setState(parsed.state);
        }
      } catch {
        // Ignore parse errors
      }
    }
  });
}
