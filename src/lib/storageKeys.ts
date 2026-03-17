const PREFIX = 'myapp';

export const STORAGE_KEYS = {
  preferences: `${PREFIX}-preferences`,
  locale: `${PREFIX}-locale`,
} as const;

export function isAppKey(key: string): boolean {
  return key.startsWith(`${PREFIX}-`);
}

/**
 * Get all localStorage keys that belong to this app.
 * Useful for cleanup, export, or debugging.
 */
export function getAllAppKeys(): string[] {
  if (typeof window === 'undefined') return [];

  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && isAppKey(key)) {
      keys.push(key);
    }
  }
  return keys;
}
