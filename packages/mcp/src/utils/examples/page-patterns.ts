import type { PatternMap } from './types.js';

export const pagePatterns: PatternMap = {
  'page-component': {
    file: 'src/pages/Home.tsx',
    description: 'Page component with i18n and SEO',
    keyPoints: [
      'Named export (PageNamePage convention)',
      'SEO component for page-specific meta tags',
      'Trans component for all user text',
      'Container layout classes',
      'Minimal logic (pages are thin)',
    ],
  },
  'lazy-page': {
    file: 'src/App.tsx',
    description: 'Lazy loading pattern for pages with default SEO',
    keyPoints: [
      'React.lazy() with dynamic import',
      'Transform named to default: .then(m => ({ default: m.PageName }))',
      'Suspense boundary with fallback',
      'Route constants from lib/routes.ts',
      'Default SEO component for site-wide meta tags',
    ],
  },
  'route-constants': {
    file: 'src/lib/routes.ts',
    description: 'Typed route constants',
    keyPoints: [
      'ROUTES object with as const',
      'AppRoute type for type-safe navigation',
      'Centralized route definitions',
    ],
  },
};
