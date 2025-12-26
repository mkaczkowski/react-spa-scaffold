/**
 * ESLint configuration for webapp-base
 *
 * Uses @webapp-base/eslint-config with local overrides for monorepo packages.
 */

import config from '@webapp-base/eslint-config';

export default [
  // Main app uses React config
  ...config,

  // Additional ignore for monorepo packages dist
  { ignores: ['packages/**/dist'] },

  // Packages use Node.js rules (override the React/i18n rules from main config)
  {
    files: ['packages/**/*.ts'],
    rules: {
      // Disable React-specific rules (not a React app)
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react-refresh/only-export-components': 'off',
      // Disable i18n rules (server-side code)
      'lingui/no-unlocalized-strings': 'off',
      'lingui/t-call-in-function': 'off',
      'lingui/no-single-variables-to-translate': 'off',
      'lingui/no-expression-in-message': 'off',
      'lingui/no-trans-inside-trans': 'off',
      // Allow console for server logging
      'no-console': 'off',
    },
  },
];
