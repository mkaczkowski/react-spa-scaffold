/**
 * Base Prettier configuration
 *
 * Standard formatting rules for webapp-base projects.
 * Use tailwind.js if you need Tailwind CSS class sorting.
 *
 * Usage in package.json:
 *   "prettier": "@webapp-base/prettier-config"
 *
 * Or in prettier.config.js:
 *   export { default } from '@webapp-base/prettier-config';
 */

/** @type {import('prettier').Config} */
const config = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
};

export default config;
