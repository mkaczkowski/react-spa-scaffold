/**
 * Node.js ESLint configuration
 *
 * Configuration for Node.js/server projects (no React, no i18n).
 * Used by MCP server and other backend packages.
 *
 * Usage:
 *   import config from '@webapp-base/eslint-config/node';
 *   export default config;
 */

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('typescript-eslint').Config} */
const config = tseslint.config(
  // Global ignores
  { ignores: ['dist', 'coverage', 'node_modules'] },

  // TypeScript rules for Node.js
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
    },
    rules: {
      // TypeScript
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',

      // Allow console for server logging
      'no-console': 'off',
    },
  },

  eslintConfigPrettier,
);

export default config;
