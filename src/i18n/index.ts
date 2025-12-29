import { i18n } from '@lingui/core';

import { type SupportedLocale } from './config';
import { detectLanguage } from './detectLanguage';
import { dynamicActivate } from './loadCatalog';

// Re-export everything from a single source
export { i18n };
export { detectLanguage };
export { dynamicActivate };
export { SUPPORTED_LOCALES, DEFAULT_LOCALE, LOCALE_LABELS, type SupportedLocale } from './config';

export async function initI18n(locale?: SupportedLocale): Promise<void> {
  const targetLocale = locale || detectLanguage();
  await dynamicActivate(targetLocale);
}

export function getLocale(): string {
  return i18n.locale || 'en';
}
