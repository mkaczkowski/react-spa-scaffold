import { useLingui } from '@lingui/react/macro';
import { useCallback, useEffect, useRef, useState } from 'react';

import { dynamicActivate, SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n';
import { setStorageItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storageKeys';

export function useLanguage() {
  const { i18n } = useLingui();
  const [isLoading, setIsLoading] = useState(false);

  const currentLocale = i18n.locale as SupportedLocale;

  // Track mounted state to avoid state updates after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const changeLanguage = useCallback(async (locale: SupportedLocale) => {
    setIsLoading(true);
    try {
      await dynamicActivate(locale);
      if (mountedRef.current) {
        setStorageItem(STORAGE_KEYS.locale, locale);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  return {
    currentLocale,
    isLoading,
    changeLanguage,
    supportedLocales: SUPPORTED_LOCALES,
  };
}
