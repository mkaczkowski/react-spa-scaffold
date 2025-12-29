/**
 * Base ESLint configuration
 *
 * Shared TypeScript rules used by all react-spa-scaffold configurations.
 * This is the foundation that react and node configs extend.
 */

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('typescript-eslint').Config} */
export const baseConfig = tseslint.config(
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
    },
    rules: {
      // Type imports for cleaner builds
      '@typescript-eslint/consistent-type-imports': 'error',

      // Allow unused vars prefixed with underscore
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // These would require parserOptions.project (slower)
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
    },
  },
  eslintConfigPrettier,
);

export default baseConfig;
