import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MobileProvider, useMobileContext } from '@/contexts/mobileContext';
import { BREAKPOINTS } from '@/hooks/useMediaQuery';

const wrapper = ({ children }: { children: ReactNode }) => <MobileProvider>{children}</MobileProvider>;

describe('MobileProvider', () => {
  let rafCallback: FrameRequestCallback | null = null;

  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallback = cb;
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    rafCallback = null;
    vi.restoreAllMocks();
  });

  it.each([
    { width: 500, isMobile: true, isTablet: false, isDesktop: false },
    { width: 800, isMobile: false, isTablet: true, isDesktop: false },
    { width: 1200, isMobile: false, isTablet: false, isDesktop: true },
  ])('detects viewport at $width px', ({ width, isMobile, isTablet, isDesktop }) => {
    Object.defineProperty(window, 'innerWidth', { value: width, writable: true, configurable: true });

    const { result } = renderHook(() => useMobileContext(), { wrapper });

    expect(result.current).toMatchObject({ isMobile, isTablet, isDesktop, width });
  });

  it('updates on resize', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true, configurable: true });

    const { result } = renderHook(() => useMobileContext(), { wrapper });
    expect(result.current.isDesktop).toBe(true);

    Object.defineProperty(window, 'innerWidth', { value: 500, writable: true, configurable: true });
    act(() => {
      window.dispatchEvent(new Event('resize'));
      rafCallback?.(0);
    });

    expect(result.current.isMobile).toBe(true);
  });

  it('skips update when width unchanged', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true, configurable: true });

    const { result } = renderHook(() => useMobileContext(), { wrapper });
    const initialWidth = result.current.width;

    act(() => {
      window.dispatchEvent(new Event('resize'));
      rafCallback?.(0);
    });

    expect(result.current.width).toBe(initialWidth);
  });

  it('exports correct BREAKPOINTS', () => {
    expect(BREAKPOINTS).toEqual({ sm: 640, md: 768, lg: 1024, xl: 1280 });
  });
});

describe('useMobileContext', () => {
  it('throws when used outside provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useMobileContext())).toThrow('useMobileContext must be used within MobileProvider');
  });
});
