/**
 * Scaffold computation orchestrator
 *
 * Coordinates all scaffold components to produce the final scaffold result.
 */

import { readFile } from 'fs/promises';

import type { ScaffoldResult } from '../../features/types.js';
import { computeDocsContent, computeDocsForFeatures } from '../docs.js';
import { resolveTemplatePath } from '../paths.js';

import { resolveFeatureDependencies, mergeDependencies, mergeScripts } from './dependencies.js';
import { computeFileStructure, getConfigFiles, readConfigFileContent } from './file-structure.js';
import { getSetupCommands } from './commands.js';
import { generateClaudeMd, generateViteEnvDts, generateEnvTs, generateRoutesTs } from './generators.js';

async function readSourcePackageJson(): Promise<Record<string, unknown>> {
  const path = resolveTemplatePath('package.json');
  const content = await readFile(path, 'utf-8');
  return JSON.parse(content);
}

/**
 * Computes complete scaffold for selected features.
 *
 * Orchestrates dependency resolution, file structure computation,
 * and dynamic content generation to produce a complete project scaffold.
 *
 * @example
 * const scaffold = await computeScaffold(['routing', 'ui'], 'my-app');
 * // Returns: { packageJson, structure, configFiles, claudeMd, ... }
 */
export async function computeScaffold(
  selectedFeatures: string[],
  projectName: string = 'my-app',
): Promise<ScaffoldResult> {
  // Resolve all dependencies
  const resolvedFeatures = resolveFeatureDependencies(selectedFeatures);

  // Read engines from source package.json
  const sourcePackageJson = await readSourcePackageJson();
  const engines = (sourcePackageJson.engines as Record<string, string>) || {};

  // Merge all dependencies (async to read versions from source package.json)
  const { dependencies, devDependencies } = await mergeDependencies(resolvedFeatures);

  // Merge all scripts
  const scripts = mergeScripts(resolvedFeatures);

  // Get file structure (add CLAUDE.md which is generated, not from patterns)
  // Also add docs based on selected features
  const docPaths = computeDocsForFeatures(resolvedFeatures);
  const structure = [...computeFileStructure(resolvedFeatures), 'CLAUDE.md', ...docPaths];

  // Get config files with actual content read from templates
  const configFiles: Record<string, string> = {};
  const configPaths = getConfigFiles(resolvedFeatures);
  for (const config of configPaths) {
    configFiles[config] = await readConfigFileContent(config);
  }

  // Get setup commands
  const setupCommands = getSetupCommands(resolvedFeatures);

  // Generate CLAUDE.md content
  const claudeMd = generateClaudeMd(resolvedFeatures, projectName, scripts);

  // Generate vite-env.d.ts content
  const viteEnvDts = generateViteEnvDts(resolvedFeatures);

  // Generate env.ts content
  const envTs = generateEnvTs(resolvedFeatures);

  // Generate routes.ts content (only if routing feature is selected)
  const routesTs = resolvedFeatures.includes('routing') ? generateRoutesTs() : undefined;

  // Get docs with content filtered by features
  const docs = await computeDocsContent(resolvedFeatures);

  return {
    packageJson: {
      name: projectName,
      dependencies,
      devDependencies,
      scripts,
      engines,
    },
    structure,
    configFiles,
    setupCommands,
    claudeMd,
    viteEnvDts,
    envTs,
    routesTs,
    docs,
  };
}
