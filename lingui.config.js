import { defineConfig } from '@lingui/cli';

export default defineConfig({
  locales: ['en', 'es', 'de', 'fr', 'ja', 'pl', 'pt-BR', 'zh-CN'],
  sourceLocale: 'en',
  fallbackLocales: {
    default: 'en',
  },
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}',
      include: ['src'],
      exclude: ['**/node_modules/**', '**/*.test.{ts,tsx}', '**/*.stories.{ts,tsx}'],
    },
  ],
  format: 'po',
  compileNamespace: 'es',
});
