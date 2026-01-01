import { useHotkeys, type Options } from 'react-hotkeys-hook';

interface ShortcutOptions {
  /** Enable shortcuts in form tags (input, textarea, select). Default: false */
  enableOnFormTags?: boolean;
  /** Prevent default browser behavior. Default: true */
  preventDefault?: boolean;
}

const DEFAULT_OPTIONS: Required<ShortcutOptions> = {
  enableOnFormTags: false,
  preventDefault: true,
};

/**
 * Registers a single keyboard shortcut with platform-aware modifiers.
 * Uses react-hotkeys-hook under the hood.
 *
 * For multiple shortcuts, call this hook once for each shortcut.
 *
 * @param shortcut - The keyboard shortcut (e.g., 'mod+s', 'mod+enter')
 * @param handler - Function to call when shortcut is triggered
 * @param options - Configuration options for shortcut behavior
 *
 * @example
 * ```tsx
 * // Single shortcut
 * useKeyboardShortcut('mod+s', () => handleSave());
 *
 * // Multiple shortcuts (call the hook multiple times)
 * useKeyboardShortcut('mod+s', () => handleSave());
 * useKeyboardShortcut('mod+z', () => handleUndo());
 * ```
 */
export function useKeyboardShortcut(shortcut: string, handler: () => void, options: ShortcutOptions = {}): void {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  const hotkeyOptions: Options = {
    enableOnFormTags: mergedOptions.enableOnFormTags,
    preventDefault: mergedOptions.preventDefault,
  };

  useHotkeys(shortcut, handler, hotkeyOptions, [handler]);
}
