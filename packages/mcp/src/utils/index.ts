export { isNpxMode, TEMPLATES_ROOT, resolveTemplatePath } from './paths.js';

export {
  resolveFeatureDependencies,
  mergeDependencies,
  mergeScripts,
  computeFileStructure,
  getConfigFiles,
  getSetupCommands,
  computeScaffold,
} from './scaffold.js';

export { getAvailablePatterns, getCodeExample, getFeatureExamples, type CodeExample } from './examples.js';
