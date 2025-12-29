/**
 * React ESLint configuration (default)
 *
 * Full configuration for React + TypeScript + LinguiJS projects.
 * Includes React Hooks rules, React Refresh, and i18n enforcement.
 *
 * Usage:
 *   import config from '@react-spa-scaffold/eslint-config';
 *   export default config;
 *
 * Or with customization:
 *   import config from '@react-spa-scaffold/eslint-config';
 *   export default [...config, { rules: { 'no-console': 'off' } }];
 */

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import lingui from 'eslint-plugin-lingui';

/** @type {import('typescript-eslint').Config} */
const config = tseslint.config(
  // Global ignores
  { ignores: ['dist', 'coverage', 'node_modules', 'src/locales/*.mjs'] },

  // Main TypeScript + React rules
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      lingui,
    },
    rules: {
      // React Hooks
      ...reactHooks.configs.recommended.rules,

      // React Refresh - warn on non-component exports
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // LinguiJS i18n rules
      'lingui/no-unlocalized-strings': [
        'warn',
        {
          ignore: [
            '^[^a-zA-Z]*$', // Strings without letters
            '^(light|dark|system)$', // Theme values
            '^\\(.*\\)$', // CSS media queries
          ],
          ignoreNames: [
            'className', 'styleName', 'type', 'id', 'key', 'name',
            'variant', 'size', 'href', 'to', 'src', 'alt',
            'data-testid', 'role', 'path', 'element',
            'viewBox', 'd', 'fill', 'stroke', 'strokeWidth',
            'strokeLinecap', 'strokeLinejoin',
            'queryKey', 'staleTime',
            // Component props - don't need translation for prop values
            'align', 'side', 'asChild', 'open', 'disabled',
            'ogType', 'ogImage', 'canonical', 'noIndex', // SEO component props
          ],
          ignoreFunctions: [
            'console.*', 'Error', 'TypeError', 'require', 'import',
            'matchMedia', 'addEventListener', 'removeEventListener',
            'querySelector', 'querySelectorAll',
            'getAttribute', 'setAttribute', 'classList.*',
          ],
        },
      ],
      'lingui/t-call-in-function': 'error',
      'lingui/no-single-variables-to-translate': 'warn',
      'lingui/no-expression-in-message': 'warn',
      'lingui/no-trans-inside-trans': 'error',

      // TypeScript
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',

      // General
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },

  // Test files - relaxed rules
  {
    files: ['**/*.test.{ts,tsx}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'lingui/no-unlocalized-strings': 'off',
    },
  },

  // Files that don't need i18n
  {
    files: [
      'e2e/**/*.{ts,tsx}',
      '*.config.{ts,js}',
      'src/components/ui/**/*.{ts,tsx}',
      'src/mocks/**/*.{ts,tsx}',
      'src/test/**/*.{ts,tsx}',
      'src/test-*.{ts,tsx}',
      // Technical/non-user-facing files
      'src/lib/**/*.{ts,tsx}',        // API, utilities, format, validation
      'src/hooks/**/*.{ts,tsx}',      // Custom hooks with technical strings
      'src/i18n/**/*.{ts,tsx}',       // i18n configuration
      'src/stores/**/*.{ts,tsx}',     // Store configuration
      'src/contexts/**/*.{ts,tsx}',   // Context providers with technical strings
      'src/components/shared/SEO/**/*.{ts,tsx}', // SEO component (metadata only)
      'src/main.tsx',                 // App setup
      'packages/mcp/templates/**/*.{ts,tsx}', // Template files
    ],
    rules: {
      'lingui/no-unlocalized-strings': 'off',
    },
  },

  eslintConfigPrettier,
);

export default config;
