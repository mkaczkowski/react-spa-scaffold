const PREFIX = 'myapp';

export const STORAGE_KEYS = {
  preferences: `${PREFIX}-preferences`,
  locale: `${PREFIX}-locale`,
} as const;

export function isAppKey(key: string): boolean {
  return key.startsWith(`${PREFIX}-`);
}
