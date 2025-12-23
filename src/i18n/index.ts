import { i18n } from '@lingui/core';

import { type SupportedLocale } from './config';
import { detectLanguage } from './detectLanguage';
import { dynamicActivate } from './loadCatalog';

export { i18n } from '@lingui/core';
export { detectLanguage } from './detectLanguage';
export { dynamicActivate } from './loadCatalog';
export { SUPPORTED_LOCALES, DEFAULT_LOCALE, LOCALE_LABELS } from './config';
export type { SupportedLocale } from './config';

export async function initI18n(locale?: SupportedLocale): Promise<void> {
  const targetLocale = locale || detectLanguage();
  await dynamicActivate(targetLocale);
}

export function getLocale(): string {
  return i18n.locale || 'en';
}
