export const SUPPORTED_LOCALES = ['en', 'es', 'de', 'fr', 'ja', 'pl', 'pt-BR', 'zh-CN'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = 'en';

export const LOCALE_LABELS: Record<SupportedLocale, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  es: { native: 'Español', english: 'Spanish' },
  de: { native: 'Deutsch', english: 'German' },
  fr: { native: 'Français', english: 'French' },
  ja: { native: '日本語', english: 'Japanese' },
  pl: { native: 'Polski', english: 'Polish' },
  'pt-BR': { native: 'Português', english: 'Portuguese' },
  'zh-CN': { native: '简体中文', english: 'Chinese' },
};

export const FALLBACK_LOCALES: Record<string, SupportedLocale> = {
  pt: 'pt-BR',
  zh: 'zh-CN',
};
