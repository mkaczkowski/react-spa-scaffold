export { isPublishedMode, CONTENT_ROOT, resolveTemplatePath } from './paths.js';
export { createCache, createSingletonCache } from './cache.js';
export { readWithFallback, getErrorMessage } from './errors.js';

export {
  resolveFeatureDependencies,
  mergeDependencies,
  mergeScripts,
  computeFileStructure,
  getConfigFiles,
  getSetupCommands,
  computeScaffold,
} from './scaffold/index.js';

export { computeDocsForFeatures, computeDocsContent } from './docs.js';
