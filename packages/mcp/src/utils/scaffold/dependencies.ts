/**
 * Dependency resolution utilities
 *
 * Handles merging dependencies from features and resolving versions
 * from the source package.json at runtime.
 */

import { readFile } from 'fs/promises';

import { FEATURES, isFeatureId } from '../../features/index.js';
import type { FeatureId } from '../../features/types.js';
import { resolveTemplatePath } from '../paths.js';

// Cache for source package.json to avoid repeated file reads
let cachedSourcePackageJson: {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
} | null = null;

/**
 * Read and cache the source package.json dependencies
 */
async function getSourceDependencies(): Promise<{
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}> {
  if (!cachedSourcePackageJson) {
    const path = resolveTemplatePath('package.json');
    const content = await readFile(path, 'utf-8');
    const pkg = JSON.parse(content);
    cachedSourcePackageJson = {
      dependencies: (pkg.dependencies || {}) as Record<string, string>,
      devDependencies: (pkg.devDependencies || {}) as Record<string, string>,
    };
  }
  return cachedSourcePackageJson;
}

/**
 * Resolves feature dependencies and auto-includes required features.
 *
 * - Core is always included
 * - Theming auto-includes state (for Zustand persistence)
 *
 * @param selectedFeatures - Array of feature IDs selected by user
 * @returns Array of resolved FeatureIds including auto-included dependencies
 */
export function resolveFeatureDependencies(selectedFeatures: string[]): FeatureId[] {
  const resolved = new Set<FeatureId>();

  // Always include core
  resolved.add('core');

  // Add all selected features (no recursive dependency resolution)
  for (const featureId of selectedFeatures) {
    if (isFeatureId(featureId)) {
      resolved.add(featureId);
    }
  }

  // Theming requires state feature for Zustand persistence
  if (resolved.has('theming') && !resolved.has('state')) {
    resolved.add('state');
  }

  return Array.from(resolved);
}

/**
 * Merges dependencies from multiple features.
 *
 * Resolves package versions from the source package.json at runtime.
 * This ensures scaffolded projects always use up-to-date dependency versions.
 */
export async function mergeDependencies(featureIds: FeatureId[]): Promise<{
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}> {
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};

  // Get source package.json for version lookup
  const sourcePkg = await getSourceDependencies();

  for (const featureId of featureIds) {
    const feature = FEATURES[featureId];

    // Look up dependency versions from source package.json
    if (feature.dependencyNames) {
      for (const name of feature.dependencyNames) {
        if (sourcePkg.dependencies[name]) {
          dependencies[name] = sourcePkg.dependencies[name];
        } else {
          console.warn(`Dependency "${name}" not found in source package.json`);
        }
      }
    }

    if (feature.devDependencyNames) {
      for (const name of feature.devDependencyNames) {
        if (sourcePkg.devDependencies[name]) {
          devDependencies[name] = sourcePkg.devDependencies[name];
        } else {
          console.warn(`DevDependency "${name}" not found in source package.json`);
        }
      }
    }
  }

  // Sort alphabetically
  const sortObject = (obj: Record<string, string>) =>
    Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));

  return {
    dependencies: sortObject(dependencies),
    devDependencies: sortObject(devDependencies),
  };
}

/**
 * Merge scripts from multiple features
 */
export function mergeScripts(featureIds: FeatureId[]): Record<string, string> {
  const scripts: Record<string, string> = {};

  for (const featureId of featureIds) {
    const feature = FEATURES[featureId];
    if (feature.scripts) {
      Object.assign(scripts, feature.scripts);
    }
  }

  return scripts;
}
