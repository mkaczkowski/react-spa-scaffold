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
  /** Other features this feature depends on (auto-included when this feature is selected). */
  requires?: FeatureId[];
  /** Dependency package names - versions resolved from package.json at runtime. */
  dependencyNames?: string[];
  devDependencyNames?: string[];
  files: string[];
  /** Test files - only included when 'testing' feature is also selected. */
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
