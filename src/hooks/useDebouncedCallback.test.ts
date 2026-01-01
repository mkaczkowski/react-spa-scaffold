import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TIMING } from '@/lib/constants';

import { useDebouncedCallback } from './useDebouncedCallback';

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debounces callback execution', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback));

    act(() => {
      result.current('arg1');
      result.current('arg2');
      result.current('arg3');
    });

    // Not called yet
    expect(callback).not.toHaveBeenCalled();

    // Advance time past debounce delay
    act(() => {
      vi.advanceTimersByTime(TIMING.DEBOUNCE_DELAY);
    });

    // Called once with last arguments
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('arg3');
  });

  it('uses default delay from TIMING.DEBOUNCE_DELAY', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback));

    act(() => {
      result.current();
    });

    // Just before default delay
    act(() => {
      vi.advanceTimersByTime(TIMING.DEBOUNCE_DELAY - 1);
    });
    expect(callback).not.toHaveBeenCalled();

    // At default delay
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('respects custom delay', () => {
    const callback = vi.fn();
    const customDelay = 500;
    const { result } = renderHook(() => useDebouncedCallback(callback, customDelay));

    act(() => {
      result.current();
    });

    act(() => {
      vi.advanceTimersByTime(customDelay - 1);
    });
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('resets timer on each call', () => {
    const callback = vi.fn();
    const delay = 100;
    const { result } = renderHook(() => useDebouncedCallback(callback, delay));

    act(() => {
      result.current();
    });

    // Advance halfway
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Call again - resets timer
    act(() => {
      result.current();
    });

    // Advance another 50ms (100ms total from first call)
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(callback).not.toHaveBeenCalled();

    // Advance remaining 50ms
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('maintains stable callback reference', () => {
    const callback = vi.fn();
    const { result, rerender } = renderHook(() => useDebouncedCallback(callback, 100));

    const firstRef = result.current;
    rerender();
    const secondRef = result.current;

    expect(firstRef).toBe(secondRef);
  });

  it('uses latest callback version', () => {
    let counter = 0;
    const { result, rerender } = renderHook(({ cb }) => useDebouncedCallback(cb, 100), {
      initialProps: { cb: () => counter++ },
    });

    act(() => {
      result.current();
    });

    // Update callback before debounce fires
    const newCallback = vi.fn(() => (counter = 100));
    rerender({ cb: newCallback });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Should have used the new callback
    expect(counter).toBe(100);
    expect(newCallback).toHaveBeenCalled();
  });

  it('cleans up timeout on unmount', () => {
    const callback = vi.fn();
    const { result, unmount } = renderHook(() => useDebouncedCallback(callback, 100));

    act(() => {
      result.current();
    });

    unmount();

    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Callback should not be called after unmount
    expect(callback).not.toHaveBeenCalled();
  });
});
