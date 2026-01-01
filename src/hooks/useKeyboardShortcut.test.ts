import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useKeyboardShortcut } from './useKeyboardShortcuts';

// Mock react-hotkeys-hook
vi.mock('react-hotkeys-hook', () => ({
  useHotkeys: vi.fn(),
}));

import { useHotkeys } from 'react-hotkeys-hook';

const mockedUseHotkeys = vi.mocked(useHotkeys);

describe('useKeyboardShortcut', () => {
  beforeEach(() => {
    mockedUseHotkeys.mockClear();
  });

  it('calls useHotkeys with the correct shortcut and handler', () => {
    const handler = vi.fn();

    renderHook(() => useKeyboardShortcut('mod+s', handler));

    expect(mockedUseHotkeys).toHaveBeenCalledWith(
      'mod+s',
      handler,
      expect.objectContaining({
        enableOnFormTags: false,
        preventDefault: true,
      }),
      [handler],
    );
  });

  it('respects custom options', () => {
    const handler = vi.fn();

    renderHook(() =>
      useKeyboardShortcut('mod+enter', handler, {
        enableOnFormTags: true,
        preventDefault: false,
      }),
    );

    expect(mockedUseHotkeys).toHaveBeenCalledWith(
      'mod+enter',
      handler,
      expect.objectContaining({
        enableOnFormTags: true,
        preventDefault: false,
      }),
      [handler],
    );
  });

  it('uses default options when not provided', () => {
    const handler = vi.fn();

    renderHook(() => useKeyboardShortcut('escape', handler));

    expect(mockedUseHotkeys).toHaveBeenCalledWith(
      'escape',
      handler,
      expect.objectContaining({
        enableOnFormTags: false,
        preventDefault: true,
      }),
      [handler],
    );
  });

  it('can be used for multiple shortcuts by calling hook multiple times', () => {
    const saveHandler = vi.fn();
    const undoHandler = vi.fn();

    renderHook(() => {
      useKeyboardShortcut('mod+s', saveHandler);
      useKeyboardShortcut('mod+z', undoHandler);
    });

    expect(mockedUseHotkeys).toHaveBeenCalledTimes(2);
    expect(mockedUseHotkeys).toHaveBeenCalledWith('mod+s', saveHandler, expect.any(Object), [saveHandler]);
    expect(mockedUseHotkeys).toHaveBeenCalledWith('mod+z', undoHandler, expect.any(Object), [undoHandler]);
  });
});
