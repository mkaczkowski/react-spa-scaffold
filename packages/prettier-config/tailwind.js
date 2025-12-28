/**
 * Prettier configuration with Tailwind CSS plugin
 *
 * Includes automatic Tailwind class sorting.
 * Requires: npm install -D prettier-plugin-tailwindcss
 *
 * Usage in prettier.config.js:
 *   export { default } from '@react-spa-scaffold/prettier-config/tailwind';
 */

/** @type {import('prettier').Config} */
const config = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
