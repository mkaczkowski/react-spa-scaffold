/**
 * Base Prettier configuration
 *
 * Standard formatting rules for react-spa-scaffold projects.
 * Use tailwind.js if you need Tailwind CSS class sorting.
 *
 * Usage in package.json:
 *   "prettier": "@react-spa-scaffold/prettier-config"
 *
 * Or in prettier.config.js:
 *   export { default } from '@react-spa-scaffold/prettier-config';
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
