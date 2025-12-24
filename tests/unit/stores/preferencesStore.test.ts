import { act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { initPreferencesSync, usePreferencesStore } from '@/stores/preferencesStore';
import { mockMatchMedia } from '@/test';

describe('preferencesStore', () => {
  beforeEach(() => {
    usePreferencesStore.setState({ theme: 'light' });
    window.matchMedia = mockMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('setTheme', () => {
    it.each(['light', 'dark', 'system'] as const)('sets theme to %s', (theme) => {
      act(() => usePreferencesStore.getState().setTheme(theme));
      expect(usePreferencesStore.getState().theme).toBe(theme);
    });
  });

  describe('toggleTheme', () => {
    it.each([
      { initial: 'light', systemDark: false, expected: 'dark' },
      { initial: 'dark', systemDark: false, expected: 'light' },
      { initial: 'system', systemDark: false, expected: 'dark' },
      { initial: 'system', systemDark: true, expected: 'light' },
    ] as const)('toggles from $initial to $expected', ({ initial, systemDark, expected }) => {
      window.matchMedia = mockMatchMedia(systemDark);
      usePreferencesStore.setState({ theme: initial });

      act(() => usePreferencesStore.getState().toggleTheme());

      expect(usePreferencesStore.getState().theme).toBe(expected);
    });
  });

  describe('getResolvedTheme', () => {
    it.each([
      { theme: 'light', systemDark: false, expected: 'light' },
      { theme: 'dark', systemDark: false, expected: 'dark' },
      { theme: 'system', systemDark: false, expected: 'light' },
      { theme: 'system', systemDark: true, expected: 'dark' },
    ] as const)('resolves $theme to $expected', ({ theme, systemDark, expected }) => {
      window.matchMedia = mockMatchMedia(systemDark);
      usePreferencesStore.setState({ theme });
      expect(usePreferencesStore.getState().getResolvedTheme()).toBe(expected);
    });
  });

  describe('reset', () => {
    it('resets to initial state', () => {
      usePreferencesStore.setState({ theme: 'dark' });
      act(() => usePreferencesStore.getState().reset());
      expect(usePreferencesStore.getState().theme).toBe('system');
    });
  });

  describe('initPreferencesSync', () => {
    it('adds and removes storage event listener', () => {
      const addSpy = vi.spyOn(window, 'addEventListener');
      const removeSpy = vi.spyOn(window, 'removeEventListener');

      const cleanup = initPreferencesSync();

      expect(addSpy).toHaveBeenCalledWith('storage', expect.any(Function));

      cleanup();

      expect(removeSpy).toHaveBeenCalledWith('storage', expect.any(Function));
    });
  });
});
