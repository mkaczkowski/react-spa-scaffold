import { useCallback, useEffect, useRef } from 'react';

import { TIMING } from '@/lib/constants';

/**
 * Returns a debounced version of a callback that only fires after a delay
 * since the last call.
 *
 * @param callback - Function to debounce
 * @param delay - Delay in ms (defaults to TIMING.DEBOUNCE_DELAY)
 */
export function useDebouncedCallback<T extends (...args: never[]) => void>(
  callback: T,
  delay: number = TIMING.DEBOUNCE_DELAY,
): T {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Keep callback ref up to date without restarting debounce
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Stable reference via useCallback (delay is the only dependency)
  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay],
  ) as T;

  return debouncedCallback;
}
