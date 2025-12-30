/**
 * get_features tool
 *
 * Lists all available feature modules for project scaffolding.
 * AI agents use this to understand what features are available
 * and present options to users.
 */

import { FEATURES, FEATURE_IDS } from '../features/index.js';
import type { ToolDefinition } from './types.js';

/** Feature summary returned by get_features tool. */
export interface FeatureSummary {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

/**
 * Lists all available features for scaffolding.
 *
 * @returns Array of feature summaries with id, name, description, and required flag
 *
 * @example
 * ```typescript
 * const features = getFeatures();
 * // [{ id: 'core', name: 'Core', required: true, ... }, ...]
 * ```
 */
export function getFeatures(): FeatureSummary[] {
  return FEATURE_IDS.map((id): FeatureSummary => {
    const feature = FEATURES[id];
    return {
      id: String(id),
      name: feature.name,
      description: feature.description,
      required: feature.required,
    };
  });
}

/** Tool definition for get_features - no input required. */
export const getFeaturesToolDefinition: ToolDefinition = {
  name: 'get_features',
  description: `List all available feature modules for react-spa-scaffold project scaffolding.

Returns a list of features that can be selected when creating a new project:
- core: Always included (React 19 + TypeScript + Vite + Tailwind)
- routing: React Router with lazy loading
- ui: Shadcn/UI + icons + theming
- forms: React Hook Form + Zod validation
- state: Zustand state management
- api: TanStack Query + API client
- i18n: LinguiJS internationalization
- testing: Vitest + Playwright + MSW
- performance: React Profiler + Lighthouse + Web Vitals
- devtools: ESLint + Prettier + Husky
- ci: GitHub Actions + Dependabot

Use this to understand available options before scaffolding a project.`,
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};
