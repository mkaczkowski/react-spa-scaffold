/**
 * Type definitions for feature modules
 */

export interface FeatureOption {
  description: string;
  default: boolean;
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
  options?: Record<string, FeatureOption>;
  scripts?: Record<string, string>;
  configFiles?: string[];
}

export interface FeatureRegistry {
  [key: string]: Feature;
}

export interface ScaffoldOptions {
  features: string[];
  options?: Record<string, boolean>;
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
