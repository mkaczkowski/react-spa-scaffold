/**
 * Browser API mocks for testing.
 *
 * Provides reusable mock implementations for browser APIs
 * that are commonly needed across tests.
 */

import { vi } from 'vitest';

// =============================================================================
// Media Query Mocks
// =============================================================================

/**
 * Creates a mock for window.matchMedia.
 *
 * @example
 * ```ts
 * beforeEach(() => {
 *   window.matchMedia = mockMatchMedia(true); // matches query
 * });
 * ```
 */
export const mockMatchMedia = (matches: boolean) =>
  vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

// =============================================================================
// Console Mocks
// =============================================================================

/**
 * Silence console.error during a test.
 * Returns a spy that can be restored with `.mockRestore()`.
 *
 * @example
 * ```ts
 * it('handles error gracefully', () => {
 *   const spy = silenceConsoleError();
 *   // ... test that triggers console.error
 *   spy.mockRestore();
 * });
 * ```
 */
export function silenceConsoleError() {
  return vi.spyOn(console, 'error').mockImplementation(() => {});
}

/**
 * Silence console.warn during a test.
 */
export function silenceConsoleWarn() {
  return vi.spyOn(console, 'warn').mockImplementation(() => {});
}

/**
 * Silence console.log during a test.
 */
export function silenceConsoleLog() {
  return vi.spyOn(console, 'log').mockImplementation(() => {});
}

// =============================================================================
// Animation Frame Mocks
// =============================================================================

/**
 * Creates mocks for requestAnimationFrame and cancelAnimationFrame.
 * Returns the callback capture for manual triggering.
 *
 * @example
 * ```ts
 * let rafCallback: FrameRequestCallback | null = null;
 * beforeEach(() => {
 *   rafCallback = mockAnimationFrame();
 * });
 *
 * it('updates on animation frame', () => {
 *   // trigger state change
 *   act(() => rafCallback?.(0));
 *   // assert new state
 * });
 * ```
 */
export function mockAnimationFrame() {
  let callback: FrameRequestCallback | null = null;

  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    callback = cb;
    return 1;
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

  return () => callback;
}

// =============================================================================
// Scroll Mocks
// =============================================================================

/**
 * Mock window.scrollTo for tests.
 * Returns a spy for assertions.
 *
 * @example
 * ```ts
 * const scrollSpy = mockScrollTo();
 * // trigger scroll
 * expect(scrollSpy).toHaveBeenCalledWith(0, 0);
 * ```
 */
export function mockScrollTo() {
  return vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
}

// =============================================================================
// Storage Mocks
// =============================================================================

/**
 * Mock localStorage.setItem to throw (simulate quota exceeded).
 */
export function mockStorageSetItemError() {
  return vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('QuotaExceeded');
  });
}

/**
 * Mock localStorage.removeItem to throw.
 */
export function mockStorageRemoveItemError() {
  return vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
    throw new Error('Storage error');
  });
}
