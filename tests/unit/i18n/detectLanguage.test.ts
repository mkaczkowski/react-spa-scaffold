import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { detectLanguage } from '@/i18n/detectLanguage';
import { STORAGE_KEYS } from '@/lib/storageKeys';

describe('detectLanguage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('navigator', {
      languages: ['en-US', 'en'],
      language: 'en-US',
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('returns stored locale from localStorage', () => {
    localStorage.setItem(STORAGE_KEYS.locale, '"es"');

    const result = detectLanguage();

    expect(result).toBe('es');
  });

  it('handles non-JSON stored locale', () => {
    localStorage.setItem(STORAGE_KEYS.locale, 'de');

    const result = detectLanguage();

    expect(result).toBe('de');
  });

  it('returns browser language when no stored preference', () => {
    vi.stubGlobal('navigator', {
      languages: ['es-ES', 'es'],
      language: 'es-ES',
    });

    const result = detectLanguage();

    expect(result).toBe('es');
  });

  it('returns default locale when browser language not supported', () => {
    vi.stubGlobal('navigator', {
      languages: ['fr-FR', 'fr'],
      language: 'fr-FR',
    });

    const result = detectLanguage();

    expect(result).toBe('en');
  });

  it('matches base language from regional variant', () => {
    vi.stubGlobal('navigator', {
      languages: ['de-AT'],
      language: 'de-AT',
    });

    const result = detectLanguage();

    expect(result).toBe('de');
  });

  it('falls back to navigator.language when languages array is empty', () => {
    vi.stubGlobal('navigator', {
      languages: [],
      language: 'es',
    });

    const result = detectLanguage();

    expect(result).toBe('es');
  });

  it('returns en as default when nothing matches', () => {
    vi.stubGlobal('navigator', {
      languages: ['zh-CN'],
      language: 'zh-CN',
    });

    const result = detectLanguage();

    expect(result).toBe('en');
  });

  it('handles invalid stored JSON gracefully', () => {
    localStorage.setItem(STORAGE_KEYS.locale, '{invalid');

    vi.stubGlobal('navigator', {
      languages: ['en-US'],
      language: 'en-US',
    });

    const result = detectLanguage();

    expect(result).toBe('en');
  });
});
