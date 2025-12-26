import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import lingui from 'eslint-plugin-lingui';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules', 'src/locales/*.mjs', 'packages/**/*'] },
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
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // Lingui i18n rules - catches untranslated user-facing text in JSX
      'lingui/no-unlocalized-strings': [
        'warn',
        {
          ignore: [
            '^[^a-zA-Z]*$', // Strings without letters (numbers, punctuation)
            '^(light|dark|system)$', // Theme values
            '^\\(.*\\)$', // CSS media queries
          ],
          ignoreNames: [
            // HTML/JSX attributes
            'className',
            'styleName',
            'type',
            'id',
            'key',
            'name',
            'variant',
            'size',
            'href',
            'to',
            'src',
            'alt',
            'data-testid',
            'role',
            'path',
            'element',
            // SVG attributes
            'viewBox',
            'd',
            'fill',
            'stroke',
            'strokeWidth',
            'strokeLinecap',
            'strokeLinejoin',
            // Query/hook parameters
            'queryKey',
            'staleTime',
          ],
          ignoreFunctions: [
            'console.*',
            'Error',
            'TypeError',
            'require',
            'import',
            'matchMedia',
            'addEventListener',
            'removeEventListener',
            'querySelector',
            'querySelectorAll',
            'getAttribute',
            'setAttribute',
            'classList.*',
          ],
        },
      ],
      'lingui/t-call-in-function': 'error',
      'lingui/no-single-variables-to-translate': 'warn',
      'lingui/no-expression-in-message': 'warn',
      'lingui/no-trans-inside-trans': 'error',
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
      // Tests don't need translation
      'lingui/no-unlocalized-strings': 'off',
    },
  },
  {
    // E2E tests, config files, mocks, test utilities, and UI primitives don't need translation
    files: [
      'e2e/**/*.{ts,tsx}',
      '*.config.{ts,js}',
      'src/components/ui/**/*.{ts,tsx}',
      'src/mocks/**/*.{ts,tsx}',
      'src/test/**/*.{ts,tsx}',
      'src/test-*.{ts,tsx}',
    ],
    rules: {
      'lingui/no-unlocalized-strings': 'off',
    },
  },
  eslintConfigPrettier,
);
