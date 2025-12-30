import type { PatternMap } from './types.js';

export const i18nPatterns: PatternMap = {
  'i18n-index': {
    file: 'src/i18n/index.ts',
    description: 'i18n barrel export with initialization functions',
    keyPoints: [
      'Re-exports i18n instance from @lingui/core',
      'initI18n() async function for app initialization',
      'getLocale() returns current active locale',
      'Re-exports config, detectLanguage, and dynamicActivate',
    ],
  },
  'trans-component': {
    file: 'src/components/layout/Header.tsx',
    description: 'Trans component usage for JSX text',
    keyPoints: [
      'Import from @lingui/react/macro',
      'comment prop is REQUIRED (ESLint enforced)',
      'Wraps user-visible text',
      'Can contain JSX children',
    ],
  },
  't-function': {
    file: 'src/components/shared/ThemeToggle/ThemeToggle.tsx',
    description: 't() function for programmatic text',
    keyPoints: [
      'useLingui() hook for t function',
      'Object syntax: t({ message, comment })',
      'comment is REQUIRED',
      'Use for dynamic text, attributes',
    ],
  },
  'language-switcher': {
    file: 'src/components/shared/LanguageSwitcher/LanguageSwitcher.tsx',
    description: 'Language selection component',
    keyPoints: [
      'useLanguage() hook',
      'DropdownMenu for selection',
      'supportedLocales array',
      'changeLanguage async function',
    ],
  },
};
