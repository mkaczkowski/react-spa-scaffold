import { STORAGE_KEYS } from '@/lib/storageKeys';

import {
  DEFAULT_LOCALE,
  FALLBACK_LOCALES,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from './config';

function isSupported(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale.toLowerCase() as SupportedLocale);
}

function findBestMatch(langTag: string): SupportedLocale | null {
  const normalized = langTag.toLowerCase();

  if (isSupported(normalized)) return normalized;

  const exactMatch = SUPPORTED_LOCALES.find((locale) => locale.toLowerCase() === normalized);
  if (exactMatch) return exactMatch;

  const baseLanguage = normalized.split('-')[0];
  if (isSupported(baseLanguage)) return baseLanguage as SupportedLocale;

  const fallback = FALLBACK_LOCALES[baseLanguage];
  if (fallback) return fallback;

  const regionalFallback = SUPPORTED_LOCALES.find((locale) =>
    locale.toLowerCase().startsWith(baseLanguage),
  );
  if (regionalFallback) return regionalFallback;

  return null;
}

export function detectLanguage(): SupportedLocale {
  // 1. Check localStorage for user preference
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEYS.locale);
    if (stored) {
      let parsedLocale: string;
      try {
        parsedLocale = JSON.parse(stored) as string;
      } catch {
        parsedLocale = stored;
      }
      const match = findBestMatch(parsedLocale);
      if (match) return match;
    }
  }

  // 2. Check browser language preferences
  if (typeof navigator !== 'undefined' && navigator.languages) {
    for (const lang of navigator.languages) {
      const match = findBestMatch(lang);
      if (match) return match;
    }
  }

  // 3. Check primary browser language
  if (typeof navigator !== 'undefined' && navigator.language) {
    const match = findBestMatch(navigator.language);
    if (match) return match;
  }

  return DEFAULT_LOCALE;
}
