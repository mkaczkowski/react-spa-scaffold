/**
 * Type definitions for feature modules
 */

/**
 * All valid feature IDs as a const tuple.
 * Used for compile-time type safety when referencing features.
 */
export const FEATURE_IDS = [
  'core',
  'mobile',
  'routing',
  'ui',
  'forms',
  'state',
  'api',
  'i18n',
  'testing',
  'performance',
  'devtools',
  'ci',
  'observability',
  'theming',
] as const;

/** Type-safe feature identifier */
export type FeatureId = (typeof FEATURE_IDS)[number];

/** Type guard to check if a string is a valid FeatureId */
export function isFeatureId(value: string): value is FeatureId {
  return FEATURE_IDS.includes(value as FeatureId);
}

export interface Feature {
  name: string;
  description: string;
  required: boolean;
  includes: string[];
  /**
   * Dependency package names - versions resolved from webapp-base package.json at runtime.
   * This ensures scaffolded projects always get up-to-date dependency versions.
   */
  dependencyNames?: string[];
  devDependencyNames?: string[];
  files: string[];
  /**
   * Test files associated with this feature.
   * Only included in scaffold when the 'testing' feature is also selected.
   * This keeps feature source files separate from test infrastructure concerns.
   */
  testFiles?: string[];
  patterns: string[];
  scripts?: Record<string, string>;
  configFiles?: string[];
}

/** Type-safe feature registry mapping FeatureId to Feature */
export type FeatureRegistry = Record<FeatureId, Feature>;

export interface ScaffoldOptions {
  features: string[];
  projectName?: string;
}

export interface ScaffoldResult {
  packageJson: {
    name: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    scripts: Record<string, string>;
    engines: Record<string, string>;
  };
  structure: string[];
  configFiles: Record<string, string>;
  setupCommands: string[];
  claudeMd: string;
  viteEnvDts: string;
  envTs: string;
  routesTs?: string; // Only when routing feature is selected
  docs: Record<string, string>;
}
