// noinspection JSUnresolvedReference

/**
 * Content generators
 *
 * Generates dynamic content files (CLAUDE.md, env.ts, routes.ts, etc.)
 * based on selected features.
 */

import type { FeatureId } from '../../features/types.js';

/**
 * Generate CLAUDE.md content based on selected features
 */
export function generateClaudeMd(
  featureIds: FeatureId[],
  projectName: string,
  scripts: Record<string, string>,
): string {
  const sections: string[] = [];

  // Header
  sections.push(`# CLAUDE.md

AI assistant guidance for **${projectName}** - a React 19 + TypeScript + Vite 7 codebase.`);

  // Commands section - based on actual scripts
  const commandLines: string[] = [];
  const scriptDescriptions: Record<string, string> = {
    dev: 'Dev server at localhost:5173',
    build: 'Production build (typecheck + bundle)',
    preview: 'Preview production build',
    typecheck: 'TypeScript only',
    lint: 'ESLint check',
    'lint:fix': 'ESLint auto-fix',
    format: 'Prettier format',
    'format:check': 'Prettier check',
    test: 'Vitest once',
    'test:watch': 'Vitest watch mode',
    'test:coverage': 'Coverage (80% threshold)',
    e2e: 'Playwright E2E',
    'e2e:ui': 'Playwright UI mode',
    'i18n:extract': 'Extract translations to .po',
    prepare: 'Initialize Husky hooks',
  };

  for (const script of Object.keys(scripts).sort()) {
    const desc = scriptDescriptions[script] || '';
    const padding = ' '.repeat(Math.max(1, 20 - script.length));
    commandLines.push(`npm run ${script}${padding}# ${desc}`);
  }

  sections.push(`
## Commands

\`\`\`bash
${commandLines.join('\n')}
\`\`\``);

  // Project Structure - dynamic based on features
  const structureParts: string[] = ['src/', '├── components/    # ui/ (primitives), layout/, shared/ (features)'];

  if (featureIds.includes('api') || featureIds.includes('i18n') || featureIds.includes('mobile')) {
    structureParts.push('├── contexts/      # React Context providers');
  }
  structureParts.push('├── hooks/         # Custom hooks');
  structureParts.push(
    '├── lib/           # config, utils, format' +
      (featureIds.includes('api') ? ', api' : '') +
      (featureIds.includes('routing') ? ', routes' : '') +
      (featureIds.includes('state') ? ', storage' : ''),
  );

  if (featureIds.includes('routing')) {
    structureParts.push('├── pages/         # Lazy-loaded route components');
  }
  if (featureIds.includes('state')) {
    structureParts.push('├── stores/        # Zustand stores');
  }
  if (featureIds.includes('i18n')) {
    structureParts.push('├── i18n/          # LinguiJS config and catalogs');
    structureParts.push('├── locales/       # Translation files (.po)');
  }
  structureParts.push('└── types/         # TypeScript definitions');

  if (featureIds.includes('testing')) {
    structureParts.push('');
    structureParts.push('# Unit tests co-located: *.test.ts/tsx next to source');
    structureParts.push('e2e/tests/         # Playwright functional E2E tests');
    if (featureIds.includes('performance')) {
      structureParts.push('e2e/performance/   # Performance regression tests');
    }
  }

  sections.push(`
## Project Structure

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full structure and data flow.

\`\`\`
${structureParts.join('\n')}
\`\`\``);

  // Code Patterns - always included
  const stateHierarchy: string[] = [];
  if (featureIds.includes('state')) stateHierarchy.push('Zustand (persisted)');
  if (featureIds.includes('api')) stateHierarchy.push('TanStack Query (server)');
  stateHierarchy.push('Context (UI)', 'useState (local)');

  sections.push(`
## Code Patterns

**Imports**: Always use \`@/\` path alias

**Components**: Named exports + \`Props\` interface. Pages use default exports for lazy loading.

**TypeScript**: \`type\` for unions, \`interface\` for objects

**State hierarchy**: ${stateHierarchy.join(' → ')}

See [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md) and [docs/COMPONENT_GUIDELINES.md](docs/COMPONENT_GUIDELINES.md).`);

  // UI Components section - only if ui feature
  if (featureIds.includes('ui')) {
    sections.push(`
## UI Components (Shadcn/UI)

This project uses **Shadcn/UI** with radix-nova style. Components live in \`src/components/ui/\`.

### Adding New Components

\`\`\`bash
npx shadcn@latest add button           # Single component
npx shadcn@latest add dialog card input # Multiple components
\`\`\`

**Pattern**: Import directly (no barrel exports for UI):

\`\`\`tsx
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
\`\`\``);
  }

  // Mobile section - only if mobile feature
  if (featureIds.includes('mobile')) {
    sections.push(`
## Mobile & Responsive Design

This project includes mobile-first responsive utilities.

### Viewport Detection

\`\`\`tsx
import { MobileProvider, useMobileContext } from '@/contexts/mobileContext';

// Wrap app with MobileProvider
<MobileProvider>{children}</MobileProvider>

// Use in components
const { isMobile, isTablet, isDesktop, width } = useMobileContext();
\`\`\`

### Breakpoints

\`\`\`tsx
import { BREAKPOINTS, useIsMobile, useIsDesktop } from '@/hooks/useMediaQuery';

// BREAKPOINTS: sm (640), md (768), lg (1024), xl (1280)
const isMobile = useIsMobile();   // width < 768px
const isDesktop = useIsDesktop(); // width >= 1024px
\`\`\`

### Touch-Aware Sizing

\`\`\`tsx
import { useTouchSizes } from '@/hooks/useTouchSizes';

const sizes = useTouchSizes();
<Button size={sizes.button}>Click</Button>  // 'touch' on mobile, 'default' on desktop
\`\`\``);
  }

  // Theming section - only if theming feature
  if (featureIds.includes('theming')) {
    sections.push(`
## Theming

Light/dark/system theme support with Zustand persistence.

### Usage

\`\`\`tsx
import { usePreferencesStore } from '@/stores/preferencesStore';

// Get current theme
const theme = usePreferencesStore((s) => s.theme);

// Toggle theme
const toggleTheme = usePreferencesStore((s) => s.toggleTheme);

// Get resolved theme (actual light/dark value when 'system')
const getResolvedTheme = usePreferencesStore((s) => s.getResolvedTheme);
\`\`\`

The \`useThemeEffect\` hook automatically applies the \`.dark\` class to the document.
The ThemeToggle component provides a UI for switching between light, dark, and system themes.`);
  }

  // MCP Servers section - always helpful
  sections.push(`
## MCP Servers (PREFER OVER WebSearch)

Use MCP servers for documentation lookup. They provide **structured, version-accurate data** directly from source.`);

  if (featureIds.includes('ui')) {
    sections.push(`
### Shadcn MCP (UI Components)

| Need                | Tool                                             |
| ------------------- | ------------------------------------------------ |
| Find component      | \`mcp__shadcn__search_items_in_registries\`        |
| View component code | \`mcp__shadcn__view_items_in_registries\`          |
| Usage examples      | \`mcp__shadcn__get_item_examples_from_registries\` |
| CLI add command     | \`mcp__shadcn__get_add_command_for_items\`         |`);
  }

  sections.push(`
### Context7 MCP (All Libraries)

Use for **any npm package** documentation:

\`\`\`
resolve-library-id → get-library-docs
\`\`\`

**Examples**: react-hook-form, @tanstack/react-query, zustand, zod, date-fns

### Decision Flow

\`\`\`
Need UI component?     → Shadcn MCP
Need library docs?     → Context7 MCP (any npm package)
Need general info?     → WebSearch (fallback only)
\`\`\``);

  // Translations section - only if i18n feature
  if (featureIds.includes('i18n')) {
    sections.push(`
## Translations (CRITICAL)

All user-facing text MUST have translator comments. ESLint enforces this.

\`\`\`tsx
<Trans comment="Dashboard heading">Welcome back</Trans>
t({ message: 'Close', comment: 'Close button' })
\`\`\`

See [docs/INTERNATIONALIZATION.md](docs/INTERNATIONALIZATION.md).`);
  }

  // Testing section - only if testing feature
  if (featureIds.includes('testing')) {
    sections.push(`
## Testing

See [docs/TESTING.md](docs/TESTING.md) and [docs/E2E_TESTING.md](docs/E2E_TESTING.md).

Unit tests are **co-located** with source files (\`*.test.ts/tsx\`). 80% coverage required.

\`\`\`typescript
import { describe, it, expect, vi } from 'vitest';
import { screen, renderHook } from '@testing-library/react';
import { render, mockMatchMedia, server } from '@/test';
\`\`\`

MSW handlers auto-reset after each test.`);
  }

  // Common Gotchas - filtered by features
  const gotchas: string[] = [];
  if (featureIds.includes('devtools')) {
    gotchas.push('**Node.js >= 22.0.0** required (check `.nvmrc`)');
    gotchas.push('**Conventional commits** enforced by commitlint');
  }
  if (featureIds.includes('mobile')) {
    gotchas.push('**Context hooks throw** outside provider (e.g., `useMobileContext()`)');
  }
  gotchas.push('**Barrel exports** in each directory via `index.ts`');
  if (featureIds.includes('ui')) {
    gotchas.push('**UI components** import directly: `@/components/ui/button` (no barrel)');
  }

  sections.push(`
## Common Gotchas

${gotchas.map((g, i) => `${i + 1}. ${g}`).join('\n')}
`);

  return sections.join('\n');
}

/**
 * Generate vite-env.d.ts content based on selected features
 */
export function generateViteEnvDts(featureIds: FeatureId[]): string {
  const sections: string[] = [];

  // Add .po module declaration if i18n feature is selected (LinguiJS uses .po files)
  if (featureIds.includes('i18n')) {
    sections.push(`declare module '*.po' {
  import type { Messages } from '@lingui/core';
  export const messages: Messages;
}`);
  }

  // Build env vars section
  const envVars: string[] = [];

  // Core env vars (always included)
  envVars.push('  readonly VITE_APP_NAME: string;');
  envVars.push('  readonly VITE_APP_URL: string;');

  // API feature env vars
  if (featureIds.includes('api')) {
    envVars.push('  readonly VITE_API_URL: string;');
  }

  // Observability feature env vars
  if (featureIds.includes('observability')) {
    envVars.push('  readonly VITE_SENTRY_DSN: string;');
    envVars.push('  readonly VITE_SENTRY_ENABLED: string;');
  }

  sections.push(`/// <reference types="vite/client" />

interface ImportMetaEnv {
${envVars.join('\n')}
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}`);

  return sections.join('\n\n') + '\n';
}

/**
 * Generate env.ts content based on selected features
 */
export function generateEnvTs(featureIds: FeatureId[]): string {
  const schemaFields: string[] = [];
  const envFields: string[] = [];

  // Core env vars (always included)
  schemaFields.push('  VITE_APP_NAME: z.string().min(1).optional(),');
  schemaFields.push('  VITE_APP_URL: z.string().url().optional(),');
  envFields.push('    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,');
  envFields.push('    VITE_APP_URL: import.meta.env.VITE_APP_URL,');

  // API feature env vars
  if (featureIds.includes('api')) {
    schemaFields.push('  VITE_API_URL: z.string().url().optional(),');
    envFields.push('    VITE_API_URL: import.meta.env.VITE_API_URL,');
  }

  // Observability feature env vars
  if (featureIds.includes('observability')) {
    schemaFields.push('  VITE_SENTRY_DSN: z.string().url().optional(),');
    schemaFields.push('  VITE_SENTRY_ENABLED: z.string().optional(),');
    envFields.push('    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,');
    envFields.push('    VITE_SENTRY_ENABLED: import.meta.env.VITE_SENTRY_ENABLED,');
  }

  // Vite built-in env vars (always included)
  schemaFields.push("  MODE: z.enum(['development', 'production', 'test']).default('development'),");
  schemaFields.push('  DEV: z.boolean().default(false),');
  schemaFields.push('  PROD: z.boolean().default(false),');
  envFields.push('    MODE: import.meta.env.MODE,');
  envFields.push('    DEV: import.meta.env.DEV,');
  envFields.push('    PROD: import.meta.env.PROD,');

  return `/**
 * Environment variable validation using Zod.
 * Validates at runtime to catch missing/invalid env vars early.
 */

import { z } from 'zod';

const envSchema = z.object({
${schemaFields.join('\n')}
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables and return typed env object.
 * Throws if validation fails in production.
 */
export function validateEnv(): Env {
  const env = {
${envFields.join('\n')}
  };

  const result = envSchema.safeParse(env);

  if (!result.success) {
    const errors = result.error.format();
    console.error('Environment validation failed:', errors);

    if (import.meta.env.PROD) {
      throw new Error('Invalid environment configuration');
    }
  }

  return result.data
}

/**
 * Validated environment variables.
 * Access this instead of import.meta.env for type safety.
 */
export const env = validateEnv();
`;
}

/**
 * Generate routes.ts content based on selected features
 */
export function generateRoutesTs(_featureIds: FeatureId[]): string {
  const routes: string[] = [];

  // Core routes (always included when routing feature is selected)
  routes.push("  HOME: '/',");

  // Not found route (always last)
  routes.push("  NOT_FOUND: '*',");

  // Note: Additional routes can be added here based on features
  // For now, all demo content displays on HomePage directly

  return `/**
 * Typed route constants.
 * Use these instead of hardcoded strings for type-safe navigation.
 */

export const ROUTES = {
${routes.join('\n')}
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
`;
}
