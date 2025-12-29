import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/lib/storageKeys';

export type Theme = 'light' | 'dark' | 'system';

export interface Preferences {
  theme: Theme;
}

interface PreferencesState extends Preferences {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  reset: () => void;
  /**
   * Get the resolved theme (light/dark) based on system preference when theme is 'system'
   */
  getResolvedTheme: () => 'light' | 'dark';
}

const initialState: Preferences = {
  theme: 'system',
};

/**
 * Get the system's preferred color scheme
 */
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const usePreferencesStore = create<PreferencesState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setTheme: (theme) => set({ theme }),
        toggleTheme: () =>
          set((state) => {
            const resolved = state.theme === 'system' ? getSystemTheme() : state.theme;
            return { theme: resolved === 'light' ? 'dark' : 'light' };
          }),
        reset: () => set(initialState),
        getResolvedTheme: () => {
          const { theme } = get();
          return theme === 'system' ? getSystemTheme() : theme;
        },
      }),
      {
        name: STORAGE_KEYS.preferences,
        partialize: (state) => ({ theme: state.theme }),
      },
    ),
    { name: 'preferences' },
  ),
);

/**
 * Initialize multi-tab sync for preferences.
 * Call this once at app startup.
 */
export function initPreferencesSync(): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleStorage = (e: StorageEvent) => {
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
  };

  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener('storage', handleStorage);
  };
}
