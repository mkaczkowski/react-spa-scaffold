/**
 * Shared constants used throughout the MCP server.
 */

/** Feature IDs for type-safe feature checks. */
export const FEATURE = {
  CORE: 'core',
  MOBILE: 'mobile',
  ROUTING: 'routing',
  UI: 'ui',
  FORMS: 'forms',
  STATE: 'state',
  API: 'api',
  I18N: 'i18n',
  TESTING: 'testing',
  PERFORMANCE: 'performance',
  DEVTOOLS: 'devtools',
  CI: 'ci',
  OBSERVABILITY: 'observability',
  THEMING: 'theming',
} as const;

/** NPM script names. */
export const SCRIPT = {
  DEV: 'dev',
  BUILD: 'build',
  PREVIEW: 'preview',
  TYPECHECK: 'typecheck',
  LINT: 'lint',
  LINT_FIX: 'lint:fix',
  FORMAT: 'format',
  FORMAT_CHECK: 'format:check',
  TEST: 'test',
  TEST_WATCH: 'test:watch',
  TEST_COVERAGE: 'test:coverage',
  E2E: 'e2e',
  E2E_UI: 'e2e:ui',
  I18N_EXTRACT: 'i18n:extract',
  PREPARE: 'prepare',
} as const;

/** Environment variable names. */
export const ENV_VAR = {
  APP_NAME: 'VITE_APP_NAME',
  APP_URL: 'VITE_APP_URL',
  API_URL: 'VITE_API_URL',
  SENTRY_DSN: 'VITE_SENTRY_DSN',
  SENTRY_ENABLED: 'VITE_SENTRY_ENABLED',
  MODE: 'MODE',
  DEV: 'DEV',
  PROD: 'PROD',
} as const;

/** MCP tool names. */
export const TOOL = {
  GET_FEATURES: 'get_features',
  GET_SCAFFOLD: 'get_scaffold',
  GET_EXAMPLE: 'get_example',
} as const;

/** Documentation resource URIs. */
export const DOCS_URI = {
  CONVENTIONS: 'docs://conventions',
  ARCHITECTURE: 'docs://architecture',
  TESTING: 'docs://testing',
  I18N: 'docs://i18n',
  API: 'docs://api',
  CLAUDE: 'docs://claude',
} as const;
