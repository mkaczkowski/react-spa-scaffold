/**
 * Scaffold utilities - re-exports for convenient importing.
 */

export { resolveFeatureDependencies, mergeDependencies, mergeScripts, mergeLintStaged } from './dependencies.js';
export type { MergeDependenciesResult, ResolveFeatureDependenciesOptions } from './dependencies.js';
export { collectFeatureFiles, computeFileStructure, getConfigFiles, readConfigFileContent } from './file-structure.js';
export type { CollectFeatureFilesResult } from './file-structure.js';
export { getSetupCommands } from './commands.js';
export { generateClaudeMd, generateViteEnvDts, generateEnvTs, generateRoutesTs } from './generators.js';
export { computeScaffold } from './compute.js';
