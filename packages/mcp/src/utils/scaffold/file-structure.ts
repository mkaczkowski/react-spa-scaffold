/**
 * File structure utilities
 *
 * Handles computing which files to include based on selected features.
 */

import { readFile } from 'fs/promises';

import { FEATURES } from '../../features/index.js';
import type { FeatureId } from '../../features/types.js';
import { resolveTemplatePath } from '../paths.js';

/**
 * Compute file structure for selected features
 *
 * When the 'testing' feature is selected, testFiles from all selected features
 * are also included. This ensures scaffolded projects get tests that match
 * their source files.
 */
export function computeFileStructure(featureIds: FeatureId[]): string[] {
  const files = new Set<string>();
  const includeTests = featureIds.includes('testing');

  for (const featureId of featureIds) {
    const feature = FEATURES[featureId];

    // Always include source files
    for (const file of feature.files) {
      files.add(file);
    }

    // Include test files only when testing feature is selected
    if (includeTests && feature.testFiles) {
      for (const file of feature.testFiles) {
        files.add(file);
      }
    }
  }

  return Array.from(files).sort();
}

/**
 * Get config files needed for selected features
 */
export function getConfigFiles(featureIds: FeatureId[]): string[] {
  const configs = new Set<string>();

  for (const featureId of featureIds) {
    const feature = FEATURES[featureId];
    if (feature.configFiles) {
      for (const config of feature.configFiles) {
        configs.add(config);
      }
    }
  }

  return Array.from(configs).sort();
}

/**
 * Read config file content from template
 */
export async function readConfigFileContent(configPath: string): Promise<string> {
  const fullPath = resolveTemplatePath(configPath);

  try {
    return await readFile(fullPath, 'utf-8');
  } catch {
    // File might not exist if running outside react-spa-scaffold
    return `// File not found: ${configPath}\n// Run MCP server from within react-spa-scaffold repository`;
  }
}
