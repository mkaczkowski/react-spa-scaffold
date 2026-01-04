/**
 * Shared constants for type-safe string values throughout the MCP server.
 */

/** Feature IDs - use instead of raw strings for feature checks. */
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
  AUTH: 'auth',
  DATABASE: 'database',
} as const;

/** Script names for setup commands. */
export const SCRIPT = {
  PREPARE: 'prepare',
  I18N_EXTRACT: 'i18n:extract',
} as const;

/** Documentation resource URIs. */
export const DOCS_URI = {
  CONVENTIONS: 'docs://conventions',
  ARCHITECTURE: 'docs://architecture',
  TESTING: 'docs://testing',
  I18N: 'docs://i18n',
  API: 'docs://api',
  DATABASE: 'docs://database',
  CLAUDE: 'docs://claude',
} as const;
