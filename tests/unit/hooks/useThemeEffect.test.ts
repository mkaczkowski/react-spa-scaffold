import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useThemeEffect } from '@/hooks/useThemeEffect';
import { usePreferencesStore } from '@/stores/preferencesStore';

// Mock matchMedia
const mockMatchMedia = (matches: boolean) => {
  const listeners: Array<(e: { matches: boolean }) => void> = [];
  return vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn((_event: string, cb: (e: { matches: boolean }) => void) => {
      listeners.push(cb);
    }),
    removeEventListener: vi.fn(),
    // Helper to trigger change
    _triggerChange: (newMatches: boolean) => {
      listeners.forEach((cb) => cb({ matches: newMatches }));
    },
  }));
};

describe('useThemeEffect', () => {
  beforeEach(() => {
    // Reset store
    usePreferencesStore.setState({ theme: 'light' });
    // Reset document class
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('applies light theme class when theme is light', () => {
    usePreferencesStore.setState({ theme: 'light' });
    window.matchMedia = mockMatchMedia(false);

    renderHook(() => useThemeEffect());

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('applies dark theme class when theme is dark', () => {
    usePreferencesStore.setState({ theme: 'dark' });
    window.matchMedia = mockMatchMedia(false);

    renderHook(() => useThemeEffect());

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('applies system theme based on prefers-color-scheme (dark)', () => {
    usePreferencesStore.setState({ theme: 'system' });
    window.matchMedia = mockMatchMedia(true); // System prefers dark

    renderHook(() => useThemeEffect());

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('applies system theme based on prefers-color-scheme (light)', () => {
    usePreferencesStore.setState({ theme: 'system' });
    window.matchMedia = mockMatchMedia(false); // System prefers light

    renderHook(() => useThemeEffect());

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('updates theme when store changes', () => {
    window.matchMedia = mockMatchMedia(false);

    renderHook(() => useThemeEffect());

    expect(document.documentElement.classList.contains('dark')).toBe(false);

    act(() => {
      usePreferencesStore.setState({ theme: 'dark' });
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
