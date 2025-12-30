/**
 * Scaffold utilities - re-exports for convenient importing.
 */

export { resolveFeatureDependencies, mergeDependencies, mergeScripts } from './dependencies.js';
export type { MergeDependenciesResult } from './dependencies.js';
export { computeFileStructure, getConfigFiles, readConfigFileContent } from './file-structure.js';
export { getSetupCommands } from './commands.js';
export { generateClaudeMd, generateViteEnvDts, generateEnvTs, generateRoutesTs } from './generators.js';
export { computeScaffold } from './compute.js';
