/**
 * Keyboard shortcut configuration.
 * Uses modifier notation: mod = Cmd on Mac, Ctrl on Windows/Linux
 */

/**
 * Application keyboard shortcuts configuration.
 * Used by useKeyboardShortcuts hook.
 */
export const KEYBOARD_SHORTCUTS = {
  /** Save current item */
  save: 'mod+s',
} as const;

export type ShortcutKey = keyof typeof KEYBOARD_SHORTCUTS;

/**
 * Detects if the current platform is macOS/iOS.
 */
export function isMacPlatform(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform);
}

/**
 * Returns a platform-aware human-readable label for a keyboard shortcut.
 * On Mac: uses ⌘ and ⌥ symbols
 * On Windows/Linux: uses Ctrl and Alt text
 */
export function getShortcutLabel(shortcut: ShortcutKey): string {
  const isMac = isMacPlatform();
  const modifier = isMac ? '⌘' : 'Ctrl';

  const labels: Record<ShortcutKey, string> = {
    save: `${modifier}+S`,
  };

  return labels[shortcut];
}

/**
 * Returns an array of key labels for rendering with Kbd components.
 * On Mac: uses ⌘ and ⌥ symbols
 * On Windows/Linux: uses Ctrl and Alt text
 */
export function getShortcutKeys(shortcut: ShortcutKey): string[] {
  const isMac = isMacPlatform();
  const modifier = isMac ? '⌘' : 'Ctrl';

  const keys: Record<ShortcutKey, string[]> = {
    save: [modifier, 'S'],
  };

  return keys[shortcut];
}
