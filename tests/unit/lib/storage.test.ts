import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { clearAppStorage, getStorageItem, removeStorageItem, setStorageItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storageKeys';

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('setStorageItem', () => {
    it('stores a value', () => {
      const result = setStorageItem(STORAGE_KEYS.preferences, { theme: 'dark' });
      expect(result).toBe(true);
      expect(localStorage.getItem(STORAGE_KEYS.preferences)).toBe('{"theme":"dark"}');
    });

    it('stores a string value', () => {
      setStorageItem(STORAGE_KEYS.locale, 'en');
      expect(localStorage.getItem(STORAGE_KEYS.locale)).toBe('"en"');
    });
  });

  describe('getStorageItem', () => {
    it('retrieves a stored value', () => {
      localStorage.setItem(STORAGE_KEYS.preferences, '{"theme":"dark"}');
      const result = getStorageItem(STORAGE_KEYS.preferences, { theme: 'light' });
      expect(result).toEqual({ theme: 'dark' });
    });

    it('returns default value when key does not exist', () => {
      const result = getStorageItem(STORAGE_KEYS.preferences, { theme: 'light' });
      expect(result).toEqual({ theme: 'light' });
    });

    it('handles invalid JSON gracefully', () => {
      localStorage.setItem(STORAGE_KEYS.locale, 'not-json');
      const result = getStorageItem(STORAGE_KEYS.locale, 'en');
      // Should return the raw string value
      expect(result).toBe('not-json');
    });
  });

  describe('removeStorageItem', () => {
    it('removes a stored value', () => {
      localStorage.setItem(STORAGE_KEYS.preferences, '{"theme":"dark"}');
      const result = removeStorageItem(STORAGE_KEYS.preferences);
      expect(result).toBe(true);
      expect(localStorage.getItem(STORAGE_KEYS.preferences)).toBeNull();
    });
  });

  describe('clearAppStorage', () => {
    it('clears all app storage keys', () => {
      localStorage.setItem(STORAGE_KEYS.preferences, '{"theme":"dark"}');
      localStorage.setItem(STORAGE_KEYS.locale, '"en"');
      localStorage.setItem('other-key', 'value');

      const result = clearAppStorage();
      expect(result).toBe(true);
      expect(localStorage.getItem(STORAGE_KEYS.preferences)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.locale)).toBeNull();
      // Other keys should remain
      expect(localStorage.getItem('other-key')).toBe('value');
    });
  });
});
