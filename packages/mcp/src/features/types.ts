/**
 * Type definitions for feature modules
 */

import { FEATURE } from '../constants.js';

/** All valid feature IDs derived from FEATURE constant (single source of truth). */
export const FEATURE_IDS = Object.values(FEATURE) as readonly FeatureId[];

/** Type-safe feature identifier. */
export type FeatureId = (typeof FEATURE)[keyof typeof FEATURE];

/** Type guard to check if a string is a valid FeatureId. */
export function isFeatureId(value: string): value is FeatureId {
  return (FEATURE_IDS as readonly string[]).includes(value);
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
  /** Config file paths (use get_file to fetch content) */
  configFiles: string[];
  setupCommands: string[];
  claudeMd: string;
  viteEnvDts: string;
  envTs: string;
  routesTs?: string; // Only when routing feature is selected
  /** Documentation file paths (use get_file to fetch content) */
  docs: string[];
}
