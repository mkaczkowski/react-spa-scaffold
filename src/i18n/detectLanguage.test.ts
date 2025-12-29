import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { detectLanguage } from '@/i18n/detectLanguage';
import { STORAGE_KEYS } from '@/lib/storageKeys';

describe('detectLanguage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('navigator', { languages: ['en-US', 'en'], language: 'en-US' });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  describe('from localStorage', () => {
    it.each([
      { stored: '"es"', expected: 'es', desc: 'JSON format' },
      { stored: 'de', expected: 'de', desc: 'plain string' },
      { stored: '{invalid', expected: 'en', desc: 'invalid JSON (falls back)' },
    ])('returns $expected for $desc', ({ stored, expected }) => {
      localStorage.setItem(STORAGE_KEYS.locale, stored);
      expect(detectLanguage()).toBe(expected);
    });
  });

  describe('from browser', () => {
    it.each([
      { languages: ['es-ES', 'es'], language: 'es-ES', expected: 'es' },
      { languages: ['de-AT'], language: 'de-AT', expected: 'de' },
      { languages: [], language: 'es', expected: 'es' },
      { languages: ['fr-FR'], language: 'fr-FR', expected: 'en' },
      { languages: ['zh-CN'], language: 'zh-CN', expected: 'en' },
    ])('returns $expected for languages=$languages', ({ languages, language, expected }) => {
      vi.stubGlobal('navigator', { languages, language });
      expect(detectLanguage()).toBe(expected);
    });
  });
});
