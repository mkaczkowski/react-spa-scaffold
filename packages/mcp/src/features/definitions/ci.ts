import type { Feature } from '../types.js';

export const ci: Feature = {
  name: 'CI/CD',
  description: 'GitHub Actions + Performance Testing + Dependabot',
  required: false,
  includes: [
    'GitHub Actions CI workflow',
    'Parallel jobs: lint, typecheck, security audit, build, unit tests, e2e tests, performance tests',
    'Performance testing with react-performance-tracking (React Profiler, Lighthouse, Web Vitals)',
    'Dependabot with grouped updates by category',
    'PR template',
    'Artifact uploads (dist, coverage, performance reports)',
    'Dependency caching for faster builds',
    'Custom setup-node-deps action',
  ],
  files: [
    '.github/workflows/ci.yml',
    '.github/actions/setup-node-deps/action.yml',
    '.github/dependabot.yml',
    '.github/PULL_REQUEST_TEMPLATE.md',
  ],
  patterns: [],
  scripts: {},
  configFiles: [],
};
