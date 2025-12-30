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
 * Uses parallel I/O where possible for better performance.
 */
export async function computeScaffold(
  selectedFeatures: string[],
  projectName: string = 'my-app',
): Promise<ScaffoldResult> {
  // Resolve all dependencies (sync)
  const resolvedFeatures = resolveFeatureDependencies(selectedFeatures);

  // Parallel async operations: package.json, dependencies, and docs
  const [sourcePackageJson, depsResult, docs] = await Promise.all([
    readSourcePackageJson(),
    mergeDependencies(resolvedFeatures),
    computeDocsContent(resolvedFeatures),
  ]);

  const engines = (sourcePackageJson.engines as Record<string, string>) || {};
  const { dependencies, devDependencies, warnings } = depsResult;

  if (warnings.length > 0) {
    console.error('[MCP] Dependency warnings:', warnings.join('; '));
  }

  // Sync operations
  const scripts = mergeScripts(resolvedFeatures);
  const docPaths = computeDocsForFeatures(resolvedFeatures);
  const structure = [...computeFileStructure(resolvedFeatures), 'CLAUDE.md', ...docPaths];
  const setupCommands = getSetupCommands(resolvedFeatures);

  // Read config files in parallel
  const configPaths = getConfigFiles(resolvedFeatures);
  const configContents = await Promise.all(configPaths.map(readConfigFileContent));
  const configFiles: Record<string, string> = Object.fromEntries(
    configPaths.map((path, i) => [path, configContents[i]]),
  );

  // Generate content (sync)
  const claudeMd = generateClaudeMd(resolvedFeatures, projectName, scripts);
  const viteEnvDts = generateViteEnvDts(resolvedFeatures);
  const envTs = generateEnvTs(resolvedFeatures);
  const routesTs = resolvedFeatures.includes('routing') ? generateRoutesTs() : undefined;

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
