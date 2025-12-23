import { i18n } from '@lingui/core';

import { DEFAULT_LOCALE, type SupportedLocale } from './config';

export async function dynamicActivate(locale: SupportedLocale): Promise<void> {
  if (i18n.locale === locale && i18n.messages[locale]) return;
  if (i18n.messages[locale]) {
    i18n.activate(locale);
    return;
  }

  try {
    const { messages } = await import(`../locales/${locale}.po`);
    i18n.loadAndActivate({ locale, messages });
  } catch (error) {
    console.error(`Failed to load locale: ${locale}`, error);
    if (locale !== DEFAULT_LOCALE) {
      if (i18n.messages[DEFAULT_LOCALE]) {
        i18n.activate(DEFAULT_LOCALE);
      } else {
        try {
          const { messages } = await import(`../locales/${DEFAULT_LOCALE}.po`);
          i18n.loadAndActivate({ locale: DEFAULT_LOCALE, messages });
        } catch {
          console.error('Failed to load default locale');
        }
      }
    }
  }
}
