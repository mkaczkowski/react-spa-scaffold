import { useLingui } from '@lingui/react/macro';
import { useCallback } from 'react';

import { dynamicActivate, SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n';

const LANGUAGE_STORAGE_KEY = 'app-language';

export function useLanguage() {
  const { i18n } = useLingui();

  const currentLocale = i18n.locale as SupportedLocale;

  const changeLanguage = useCallback(async (locale: SupportedLocale) => {
    await dynamicActivate(locale);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
  }, []);

  return {
    currentLocale,
    changeLanguage,
    supportedLocales: SUPPORTED_LOCALES,
  };
}
