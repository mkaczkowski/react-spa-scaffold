import type { Feature } from '../types.js';

export const ci: Feature = {
  name: 'CI/CD',
  description: 'GitHub Actions + Performance Testing + Dependabot',
  required: false,
  files: [
    '.github/workflows/ci.yml',
    '.github/actions/setup-node-deps/action.yml',
    '.github/dependabot.yml',
    '.github/PULL_REQUEST_TEMPLATE.md',
  ],
  scripts: {},
  configFiles: [],
};
