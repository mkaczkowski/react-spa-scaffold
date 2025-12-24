import { act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { initPreferencesSync, usePreferencesStore } from '@/stores/preferencesStore';

// Mock matchMedia for system theme detection
const mockMatchMedia = (matches: boolean) => {
  return vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
};

describe('preferencesStore', () => {
  beforeEach(() => {
    usePreferencesStore.setState({ theme: 'light' });
    window.matchMedia = mockMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('setTheme', () => {
    it('sets theme to light', () => {
      act(() => {
        usePreferencesStore.getState().setTheme('light');
      });
      expect(usePreferencesStore.getState().theme).toBe('light');
    });

    it('sets theme to dark', () => {
      act(() => {
        usePreferencesStore.getState().setTheme('dark');
      });
      expect(usePreferencesStore.getState().theme).toBe('dark');
    });

    it('sets theme to system', () => {
      act(() => {
        usePreferencesStore.getState().setTheme('system');
      });
      expect(usePreferencesStore.getState().theme).toBe('system');
    });
  });

  describe('toggleTheme', () => {
    it('toggles from light to dark', () => {
      usePreferencesStore.setState({ theme: 'light' });

      act(() => {
        usePreferencesStore.getState().toggleTheme();
      });

      expect(usePreferencesStore.getState().theme).toBe('dark');
    });

    it('toggles from dark to light', () => {
      usePreferencesStore.setState({ theme: 'dark' });

      act(() => {
        usePreferencesStore.getState().toggleTheme();
      });

      expect(usePreferencesStore.getState().theme).toBe('light');
    });

    it('toggles from system (light) to dark', () => {
      window.matchMedia = mockMatchMedia(false); // System prefers light
      usePreferencesStore.setState({ theme: 'system' });

      act(() => {
        usePreferencesStore.getState().toggleTheme();
      });

      expect(usePreferencesStore.getState().theme).toBe('dark');
    });

    it('toggles from system (dark) to light', () => {
      window.matchMedia = mockMatchMedia(true); // System prefers dark
      usePreferencesStore.setState({ theme: 'system' });

      act(() => {
        usePreferencesStore.getState().toggleTheme();
      });

      expect(usePreferencesStore.getState().theme).toBe('light');
    });
  });

  describe('getResolvedTheme', () => {
    it('returns light when theme is light', () => {
      usePreferencesStore.setState({ theme: 'light' });
      expect(usePreferencesStore.getState().getResolvedTheme()).toBe('light');
    });

    it('returns dark when theme is dark', () => {
      usePreferencesStore.setState({ theme: 'dark' });
      expect(usePreferencesStore.getState().getResolvedTheme()).toBe('dark');
    });

    it('returns system preference when theme is system (light)', () => {
      window.matchMedia = mockMatchMedia(false);
      usePreferencesStore.setState({ theme: 'system' });
      expect(usePreferencesStore.getState().getResolvedTheme()).toBe('light');
    });

    it('returns system preference when theme is system (dark)', () => {
      window.matchMedia = mockMatchMedia(true);
      usePreferencesStore.setState({ theme: 'system' });
      expect(usePreferencesStore.getState().getResolvedTheme()).toBe('dark');
    });
  });

  describe('reset', () => {
    it('resets to initial state', () => {
      usePreferencesStore.setState({ theme: 'dark' });

      act(() => {
        usePreferencesStore.getState().reset();
      });

      expect(usePreferencesStore.getState().theme).toBe('system');
    });
  });

  describe('initPreferencesSync', () => {
    it('returns a cleanup function', () => {
      const cleanup = initPreferencesSync();
      expect(typeof cleanup).toBe('function');
      cleanup();
    });

    it('adds storage event listener', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      const cleanup = initPreferencesSync();

      expect(addEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));

      cleanup();
    });

    it('removes storage event listener on cleanup', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const cleanup = initPreferencesSync();
      cleanup();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
    });
  });
});
