import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { clearAppStorage, getStorageItem, removeStorageItem, setStorageItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storageKeys';

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
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

    it('returns false and logs error on storage failure', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceeded');
      });

      const result = setStorageItem(STORAGE_KEYS.preferences, { theme: 'dark' });

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to set localStorage'),
        expect.any(Error),
      );
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

    it('returns default when raw string is null after parse failure', () => {
      // Mock getItem to return null on second call (simulating storage cleared between calls)
      let callCount = 0;
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        callCount++;
        if (callCount === 1) return 'invalid-json{';
        return null;
      });

      const result = getStorageItem(STORAGE_KEYS.locale, 'default');
      expect(result).toBe('default');
    });
  });

  describe('removeStorageItem', () => {
    it('removes a stored value', () => {
      localStorage.setItem(STORAGE_KEYS.preferences, '{"theme":"dark"}');
      const result = removeStorageItem(STORAGE_KEYS.preferences);
      expect(result).toBe(true);
      expect(localStorage.getItem(STORAGE_KEYS.preferences)).toBeNull();
    });

    it('returns false and logs error on removal failure', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = removeStorageItem(STORAGE_KEYS.preferences);

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to remove localStorage'),
        expect.any(Error),
      );
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

    it('returns false and logs error on clear failure', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = clearAppStorage();

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to clear app storage'),
        expect.any(Error),
      );
    });
  });
});
