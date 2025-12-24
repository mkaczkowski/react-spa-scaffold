import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BREAKPOINTS, useIsDesktop, useIsMobile, useMediaQuery } from '@/hooks/useMediaQuery';

describe('useMediaQuery', () => {
  const createMatchMedia = (matches: boolean) => {
    return vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  };

  beforeEach(() => {
    window.matchMedia = createMatchMedia(false);
  });

  it('returns false when query does not match', () => {
    window.matchMedia = createMatchMedia(false);

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);
  });

  it('returns true when query matches', () => {
    window.matchMedia = createMatchMedia(true);

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(true);
  });

  it('updates when media query changes', () => {
    let listener: ((e: MediaQueryListEvent) => void) | null = null;

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn((_event: string, cb: (e: MediaQueryListEvent) => void) => {
        listener = cb;
      }),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);

    act(() => {
      listener?.({ matches: true } as MediaQueryListEvent);
    });

    expect(result.current).toBe(true);
  });
});

describe('BREAKPOINTS', () => {
  it('has correct values', () => {
    expect(BREAKPOINTS.sm).toBe(640);
    expect(BREAKPOINTS.md).toBe(768);
    expect(BREAKPOINTS.lg).toBe(1024);
    expect(BREAKPOINTS.xl).toBe(1280);
  });
});

describe('useIsMobile', () => {
  const createMatchMedia = (matches: boolean) => {
    return vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  };

  it('returns true when viewport is mobile-sized', () => {
    // Mobile is when min-width: 768px does NOT match
    window.matchMedia = createMatchMedia(false);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('returns false when viewport is larger than mobile', () => {
    // Not mobile when min-width: 768px matches
    window.matchMedia = createMatchMedia(true);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });
});

describe('useIsDesktop', () => {
  const createMatchMedia = (matches: boolean) => {
    return vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  };

  it('returns true when viewport is desktop-sized', () => {
    // Desktop is when min-width: 1024px matches
    window.matchMedia = createMatchMedia(true);

    const { result } = renderHook(() => useIsDesktop());

    expect(result.current).toBe(true);
  });

  it('returns false when viewport is smaller than desktop', () => {
    // Not desktop when min-width: 1024px does NOT match
    window.matchMedia = createMatchMedia(false);

    const { result } = renderHook(() => useIsDesktop());

    expect(result.current).toBe(false);
  });
});
