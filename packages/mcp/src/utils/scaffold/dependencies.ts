/**
 * Dependency resolution - merges features and resolves versions from package.json.
 */

import { readFile } from 'fs/promises';

import { FEATURES, isFeatureId } from '../../features/index.js';
import type { FeatureId } from '../../features/types.js';
import { createSingletonCache } from '../cache.js';
import { resolveTemplatePath } from '../paths.js';

interface SourceDeps {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

const sourceDepsCache = createSingletonCache<SourceDeps>();

/** Read and cache the source package.json dependencies. */
async function getSourceDependencies(): Promise<SourceDeps> {
  return sourceDepsCache.getOrSet(async () => {
    const path = resolveTemplatePath('package.json');
    const content = await readFile(path, 'utf-8');
    const pkg = JSON.parse(content);
    return {
      dependencies: (pkg.dependencies || {}) as Record<string, string>,
      devDependencies: (pkg.devDependencies || {}) as Record<string, string>,
    };
  });
}

/**
 * Resolves feature dependencies and auto-includes required features.
 * Core is always included. Dependencies declared via `requires` field are resolved recursively.
 */
export function resolveFeatureDependencies(selectedFeatures: string[]): FeatureId[] {
  const resolved = new Set<FeatureId>();

  function addWithDeps(featureId: FeatureId): void {
    if (resolved.has(featureId)) return;
    resolved.add(featureId);

    // Recursively add dependencies declared in `requires`
    const feature = FEATURES[featureId];
    if (feature.requires) {
      for (const dep of feature.requires) {
        addWithDeps(dep);
      }
    }
  }

  // Always include core first
  resolved.add('core');

  // Add selected features with their dependencies
  for (const featureId of selectedFeatures) {
    if (isFeatureId(featureId)) {
      addWithDeps(featureId);
    }
  }

  return Array.from(resolved);
}

/** Result of merging dependencies with any warnings. */
export interface MergeDependenciesResult {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  warnings: string[];
}

/**
 * Merges dependencies from multiple features.
 * Returns structured warnings instead of logging to console.
 */
export async function mergeDependencies(featureIds: FeatureId[]): Promise<MergeDependenciesResult> {
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};
  const warnings: string[] = [];

  const sourcePkg = await getSourceDependencies();

  for (const featureId of featureIds) {
    const feature = FEATURES[featureId];

    if (feature.dependencyNames) {
      for (const name of feature.dependencyNames) {
        if (sourcePkg.dependencies[name]) {
          dependencies[name] = sourcePkg.dependencies[name];
        } else {
          warnings.push(`Dependency "${name}" not found in source package.json (feature: ${featureId})`);
        }
      }
    }

    if (feature.devDependencyNames) {
      for (const name of feature.devDependencyNames) {
        if (sourcePkg.devDependencies[name]) {
          devDependencies[name] = sourcePkg.devDependencies[name];
        } else {
          warnings.push(`DevDependency "${name}" not found in source package.json (feature: ${featureId})`);
        }
      }
    }
  }

  const sortObject = (obj: Record<string, string>) =>
    Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));

  return {
    dependencies: sortObject(dependencies),
    devDependencies: sortObject(devDependencies),
    warnings,
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
