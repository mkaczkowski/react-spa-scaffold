import type { Feature } from '../types.js';

export const performance: Feature = {
  name: 'Performance Testing',
  description: 'React Profiler + Lighthouse + Web Vitals via react-performance-tracking',
  required: false,
  includes: [
    'react-performance-tracking for unified performance testing',
    'React Profiler metrics (render duration, re-renders)',
    'Lighthouse audits (performance, accessibility, best practices)',
    'Core Web Vitals (LCP, INP, CLS)',
    'FPS monitoring (Chromium only)',
    'PerformanceProviderWrapper with lazy loading (zero prod overhead)',
    'Safe usePerformance hook (never throws)',
    'Separate Playwright project for performance tests',
    'CI-optimized Chrome flags (--no-sandbox)',
  ],
  dependencyNames: ['react-performance-tracking'],
  devDependencyNames: ['chrome-launcher', 'lighthouse'],
  files: ['src/contexts/performanceContext.tsx', 'e2e/performance/setup.ts'],
  testFiles: ['e2e/performance/home.spec.ts', 'src/contexts/performanceContext.test.tsx'],
  scripts: {
    'e2e:perf': 'PERF_TEST=true playwright test --project=performance',
    'e2e:perf:ui': 'PERF_TEST=true playwright test --project=performance --ui',
    'e2e:all': 'PERF_TEST=true playwright test',
  },
  configFiles: [],
};
