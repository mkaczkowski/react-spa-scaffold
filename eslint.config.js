import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules', 'src/locales/*.mjs'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      // Prevent common async/await mistakes
      '@typescript-eslint/no-floating-promises': 'off', // Would require parserOptions.project
      '@typescript-eslint/no-misused-promises': 'off', // Would require parserOptions.project
      // Prevent leaked renders in React
      '@typescript-eslint/no-unnecessary-condition': 'off', // Would require parserOptions.project
      // Prefer nullish coalescing
      '@typescript-eslint/prefer-nullish-coalescing': 'off', // Would require parserOptions.project
      // Enforce explicit function return types for better documentation
      '@typescript-eslint/explicit-function-return-type': 'off',
      // Enforce explicit accessibility modifiers
      '@typescript-eslint/explicit-member-accessibility': 'off',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    rules: {
      'no-console': 'off',
      // Allow any in tests for flexibility
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  eslintConfigPrettier,
);
