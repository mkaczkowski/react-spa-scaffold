import type { PatternMap } from './types.js';

export const componentPatterns: PatternMap = {
  'component-ui': {
    file: 'src/components/ui/button.tsx',
    description: 'Shadcn/UI component with CVA variants and forwardRef',
    keyPoints: [
      'Uses forwardRef for ref forwarding',
      'CVA (class-variance-authority) for style variants',
      'cn() utility for class merging',
      'Named export (not default)',
      'Props interface extends HTML attributes + VariantProps',
      'Radix Slot for polymorphic "asChild" prop',
    ],
  },
  'component-shared': {
    file: 'src/components/shared/ThemeToggle/ThemeToggle.tsx',
    description: 'Shared feature component with store integration',
    keyPoints: [
      'Named function export',
      'Located in subdirectory with index.ts barrel',
      'Uses Zustand store with selectors',
      'Integrates with Lingui i18n (t() function)',
      'Composes UI components (Button, icons)',
    ],
  },
  'component-layout': {
    file: 'src/components/layout/Header.tsx',
    description: 'Layout component for page structure',
    keyPoints: [
      'Named function export',
      'Uses Tailwind container pattern',
      'Composes shared components',
      'Trans component for i18n text',
      'No props (stateless layout)',
    ],
  },
  'button-variants': {
    file: 'src/components/ui/button.tsx',
    description: 'Button with CVA variants',
    keyPoints: [
      'variant: default, destructive, outline, secondary, ghost, link',
      'size: default, sm, lg, icon',
      'asChild prop for polymorphic rendering',
    ],
  },
  'forward-ref-component': {
    file: 'src/components/ui/button.tsx',
    description: 'forwardRef component pattern',
    keyPoints: ['React.forwardRef<HTMLElement, Props>', 'ref passed to inner element', 'displayName set for DevTools'],
  },
  'error-boundary': {
    file: 'src/components/shared/ErrorBoundary/ErrorBoundary.tsx',
    description: 'Error boundary with reset functionality',
    keyPoints: [
      'Class component with getDerivedStateFromError',
      'componentDidCatch for logging',
      'Reset button to recover',
    ],
  },
  'seo-component': {
    file: 'src/components/shared/SEO/SEO.tsx',
    description: 'SEO meta tags component (React 19)',
    keyPoints: [
      'React 19 native head hoisting',
      'title, meta, link in JSX',
      'Open Graph tags',
      'Twitter Card tags',
      'Conditional rendering for optional tags',
    ],
  },
};
