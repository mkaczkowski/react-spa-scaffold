import type { Feature } from '../types.js';

export const devtools: Feature = {
  name: 'Developer Tooling',
  description: 'ESLint + Prettier + Husky + Commitlint (using @react-spa-scaffold shared configs)',
  required: false,
  devDependencies: [
    '@commitlint/config-conventional',
    '@eslint/js',
    '@react-spa-scaffold/eslint-config',
    '@react-spa-scaffold/prettier-config',
    'commitlint',
    'eslint',
    'eslint-config-prettier',
    'eslint-plugin-lingui',
    'eslint-plugin-react-hooks',
    'eslint-plugin-react-refresh',
    'husky',
    'lint-staged',
    'prettier',
    'prettier-plugin-tailwindcss',
    'typescript-eslint',
  ],
  files: [
    'eslint.config.js',
    'prettier.config.js',
    'commitlint.config.js',
    '.husky/pre-commit',
    '.husky/commit-msg',
    '.nvmrc',
  ],
  scripts: {
    lint: 'eslint .',
    'lint:fix': 'eslint . --fix',
    format: 'prettier --write .',
    'format:check': 'prettier --check .',
    prepare: 'husky',
  },
  configFiles: ['eslint.config.js', 'prettier.config.js', 'commitlint.config.js'],
  lintStaged: {
    '*.{ts,tsx,js}': ['eslint --fix', 'prettier --write'],
    '*.{json,md,yml,yaml,css}': ['prettier --write'],
  },
};
