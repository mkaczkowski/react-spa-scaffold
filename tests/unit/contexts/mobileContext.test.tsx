import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MobileProvider, useMobileContext } from '@/contexts/mobileContext';
import { BREAKPOINTS } from '@/hooks/useMediaQuery';

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

  const wrapper = ({ children }: { children: ReactNode }) => <MobileProvider>{children}</MobileProvider>;

  it('provides mobile context values', () => {
    Object.defineProperty(window, 'innerWidth', { value: 500, writable: true, configurable: true });

    const { result } = renderHook(() => useMobileContext(), { wrapper });

    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.width).toBe(500);
  });

  it('detects tablet viewport', () => {
    Object.defineProperty(window, 'innerWidth', { value: 800, writable: true, configurable: true });

    const { result } = renderHook(() => useMobileContext(), { wrapper });

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it('detects desktop viewport', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true, configurable: true });

    const { result } = renderHook(() => useMobileContext(), { wrapper });

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
  });

  it('updates on resize', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true, configurable: true });

    const { result } = renderHook(() => useMobileContext(), { wrapper });
    expect(result.current.isDesktop).toBe(true);

    // Simulate resize
    Object.defineProperty(window, 'innerWidth', { value: 500, writable: true, configurable: true });
    act(() => {
      window.dispatchEvent(new Event('resize'));
      // Execute the RAF callback
      if (rafCallback) {
        rafCallback(0);
      }
    });

    expect(result.current.isMobile).toBe(true);
    expect(result.current.width).toBe(500);
  });

  it('does not update if width unchanged', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true, configurable: true });

    const { result } = renderHook(() => useMobileContext(), { wrapper });
    const initialWidth = result.current.width;

    // Trigger resize without changing width
    act(() => {
      window.dispatchEvent(new Event('resize'));
      if (rafCallback) {
        rafCallback(0);
      }
    });

    expect(result.current.width).toBe(initialWidth);
  });

  it('has correct breakpoint constants', () => {
    // Verify the default BREAKPOINTS.lg is used for SSR fallback
    expect(BREAKPOINTS.lg).toBe(1024);
  });
});

describe('useMobileContext', () => {
  it('throws error when used outside MobileProvider', () => {
    // Suppress console.error for this test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useMobileContext());
    }).toThrow('useMobileContext must be used within MobileProvider');

    consoleErrorSpy.mockRestore();
  });
});
