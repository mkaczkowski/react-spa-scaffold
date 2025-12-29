import { useLingui } from '@lingui/react/macro';
import { useCallback } from 'react';

import { dynamicActivate, SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n';
import { setStorageItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storageKeys';

export function useLanguage() {
  const { i18n } = useLingui();

  const currentLocale = i18n.locale as SupportedLocale;

  const changeLanguage = useCallback(async (locale: SupportedLocale) => {
    await dynamicActivate(locale);
    setStorageItem(STORAGE_KEYS.locale, locale);
  }, []);

  return {
    currentLocale,
    changeLanguage,
    supportedLocales: SUPPORTED_LOCALES,
  };
}
