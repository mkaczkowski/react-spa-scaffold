/**
 * Scaffold computation orchestrator - coordinates all components.
 *
 * Returns paths only for configFiles and docs (lazy loading).
 * Use get_file tool to fetch actual content.
 */

import { readFile } from 'fs/promises';

import { FEATURE } from '../../constants.js';
import type { ScaffoldResult } from '../../features/types.js';
import { computeDocsForFeatures } from '../docs.js';
import { resolveTemplatePath } from '../paths.js';

import { resolveFeatureDependencies, mergeDependencies, mergeScripts } from './dependencies.js';
import { computeFileStructure, getConfigFiles } from './file-structure.js';
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
 * Returns paths only for configFiles and docs (lazy loading).
 * Use get_file tool to fetch actual content when needed.
 */
export async function computeScaffold(
  selectedFeatures: string[],
  projectName: string = 'my-app',
): Promise<ScaffoldResult> {
  // Resolve all dependencies (sync)
  const resolvedFeatures = resolveFeatureDependencies(selectedFeatures);

  // Parallel async operations: package.json and dependencies
  const [sourcePackageJson, depsResult] = await Promise.all([
    readSourcePackageJson(),
    mergeDependencies(resolvedFeatures),
  ]);

  const engines = (sourcePackageJson.engines as Record<string, string>) || {};
  const { dependencies, devDependencies, warnings } = depsResult;

  if (warnings.length > 0) {
    console.error('[MCP] Dependency warnings:', warnings.join('; '));
  }

  // Sync operations
  const scripts = mergeScripts(resolvedFeatures);
  const docs = computeDocsForFeatures(resolvedFeatures);
  const structure = [...computeFileStructure(resolvedFeatures), 'CLAUDE.md', ...docs];
  const setupCommands = getSetupCommands(resolvedFeatures);

  // Config files: paths only (lazy loading)
  const configFiles = getConfigFiles(resolvedFeatures);

  // Generate content (sync)
  const claudeMd = generateClaudeMd(resolvedFeatures, projectName, scripts);
  const viteEnvDts = generateViteEnvDts(resolvedFeatures);
  const envTs = generateEnvTs(resolvedFeatures);
  const routesTs = resolvedFeatures.includes(FEATURE.ROUTING) ? generateRoutesTs() : undefined;

  return {
    packageJson: { name: projectName, dependencies, devDependencies, scripts, engines },
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
