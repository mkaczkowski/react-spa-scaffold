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
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  files: string[];
  patterns: string[];
  requiresFeatures?: string[];
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
}
