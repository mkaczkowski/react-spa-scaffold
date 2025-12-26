/**
 * Scaffold computation utilities
 */

import { FEATURES } from '../features/index.js';
import type { ScaffoldResult } from '../features/types.js';

/**
 * Resolve feature dependencies recursively
 */
export function resolveFeatureDependencies(selectedFeatures: string[]): string[] {
  const resolved = new Set<string>();
  const toProcess = [...selectedFeatures];

  // Always include core
  resolved.add('core');

  while (toProcess.length > 0) {
    const featureId = toProcess.pop()!;
    if (resolved.has(featureId)) continue;

    const feature = FEATURES[featureId];
    if (!feature) continue;

    resolved.add(featureId);

    // Add required dependencies
    if (feature.requiresFeatures) {
      for (const dep of feature.requiresFeatures) {
        if (!resolved.has(dep)) {
          toProcess.push(dep);
        }
      }
    }
  }

  return Array.from(resolved);
}

/**
 * Merge dependencies from multiple features
 */
export function mergeDependencies(featureIds: string[]): {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
} {
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};

  for (const featureId of featureIds) {
    const feature = FEATURES[featureId];
    if (!feature) continue;

    if (feature.dependencies) {
      Object.assign(dependencies, feature.dependencies);
    }
    if (feature.devDependencies) {
      Object.assign(devDependencies, feature.devDependencies);
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
export function mergeScripts(featureIds: string[]): Record<string, string> {
  const scripts: Record<string, string> = {};

  for (const featureId of featureIds) {
    const feature = FEATURES[featureId];
    if (!feature?.scripts) continue;
    Object.assign(scripts, feature.scripts);
  }

  return scripts;
}

/**
 * Compute file structure for selected features
 */
export function computeFileStructure(featureIds: string[]): string[] {
  const files = new Set<string>();

  for (const featureId of featureIds) {
    const feature = FEATURES[featureId];
    if (!feature?.files) continue;

    for (const file of feature.files) {
      files.add(file);
    }
  }

  return Array.from(files).sort();
}

/**
 * Get config files needed for selected features
 */
export function getConfigFiles(featureIds: string[]): string[] {
  const configs = new Set<string>();

  for (const featureId of featureIds) {
    const feature = FEATURES[featureId];
    if (!feature?.configFiles) continue;

    for (const config of feature.configFiles) {
      configs.add(config);
    }
  }

  return Array.from(configs).sort();
}

/**
 * Generate setup commands based on selected features
 */
export function getSetupCommands(featureIds: string[]): string[] {
  const commands: string[] = ['npm install'];

  if (featureIds.includes('devtools')) {
    commands.push('npm run prepare'); // Initialize husky
  }

  if (featureIds.includes('testing')) {
    commands.push('npx playwright install chromium'); // Install Playwright browser
  }

  if (featureIds.includes('i18n')) {
    commands.push('npm run i18n:extract'); // Extract initial translations
  }

  return commands;
}

/**
 * Compute complete scaffold for selected features
 */
export function computeScaffold(selectedFeatures: string[], projectName: string = 'my-app'): ScaffoldResult {
  // Resolve all dependencies
  const resolvedFeatures = resolveFeatureDependencies(selectedFeatures);

  // Merge all dependencies
  const { dependencies, devDependencies } = mergeDependencies(resolvedFeatures);

  // Merge all scripts
  const scripts = mergeScripts(resolvedFeatures);

  // Get file structure
  const structure = computeFileStructure(resolvedFeatures);

  // Get config files
  const configFiles: Record<string, string> = {};
  for (const config of getConfigFiles(resolvedFeatures)) {
    configFiles[config] = `// See webapp-base repository for ${config} contents`;
  }

  // Get setup commands
  const setupCommands = getSetupCommands(resolvedFeatures);

  return {
    packageJson: {
      name: projectName,
      dependencies,
      devDependencies,
      scripts,
    },
    structure,
    configFiles,
    setupCommands,
  };
}
