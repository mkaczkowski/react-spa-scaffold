/**
 * Scaffold computation utilities
 */

import { readFile } from 'fs/promises';

import { FEATURES } from '../features/index.js';
import type { ScaffoldResult } from '../features/types.js';
import { computeDocsContent, computeDocsForFeatures } from './docs.js';
import { resolveTemplatePath } from './paths.js';

/**
 * Resolve feature dependencies recursively
 */
export function resolveFeatureDependencies(selectedFeatures: string[]): string[] {
  const resolved = new Set<string>();
  const toProcess = [...selectedFeatures];

  // Always include core
  resolved.add('core');

  while (toProcess.length > 0) {
    const featureId = toProcess.pop()!;
    if (resolved.has(featureId)) continue;

    const feature = FEATURES[featureId];
    if (!feature) continue;

    resolved.add(featureId);

    // Add required dependencies
    if (feature.requiresFeatures) {
      for (const dep of feature.requiresFeatures) {
        if (!resolved.has(dep)) {
          toProcess.push(dep);
        }
      }
    }
  }

  return Array.from(resolved);
}

/**
 * Merge dependencies from multiple features
 */
export function mergeDependencies(featureIds: string[]): {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
} {
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};

  for (const featureId of featureIds) {
    const feature = FEATURES[featureId];
    if (!feature) continue;

    if (feature.dependencies) {
      Object.assign(dependencies, feature.dependencies);
    }
    if (feature.devDependencies) {
      Object.assign(devDependencies, feature.devDependencies);
    }
  }

  // Sort alphabetically
  const sortObject = (obj: Record<string, string>) =>
    Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));

  return {
    dependencies: sortObject(dependencies),
    devDependencies: sortObject(devDependencies),
  };
}

/**
 * Merge scripts from multiple features
 */
export function mergeScripts(featureIds: string[]): Record<string, string> {
  const scripts: Record<string, string> = {};

  for (const featureId of featureIds) {
    const feature = FEATURES[featureId];
    if (!feature?.scripts) continue;
    Object.assign(scripts, feature.scripts);
  }

  return scripts;
}

/**
 * Compute file structure for selected features
 */
export function computeFileStructure(featureIds: string[]): string[] {
  const files = new Set<string>();

  for (const featureId of featureIds) {
    const feature = FEATURES[featureId];
    if (!feature?.files) continue;

    for (const file of feature.files) {
      files.add(file);
    }
  }

  return Array.from(files).sort();
}

/**
 * Get config files needed for selected features
 */
export function getConfigFiles(featureIds: string[]): string[] {
  const configs = new Set<string>();

  for (const featureId of featureIds) {
    const feature = FEATURES[featureId];
    if (!feature?.configFiles) continue;

    for (const config of feature.configFiles) {
      configs.add(config);
    }
  }

  return Array.from(configs).sort();
}

/**
 * Read config file content from template
 */
async function readConfigFileContent(configPath: string): Promise<string> {
  const fullPath = resolveTemplatePath(configPath);

  try {
    return await readFile(fullPath, 'utf-8');
  } catch {
    // File might not exist if running outside webapp-base
    return `// File not found: ${configPath}\n// Run MCP server from within webapp-base repository`;
  }
}

/**
 * Generate setup commands based on selected features
 */
export function getSetupCommands(featureIds: string[]): string[] {
  const commands: string[] = ['npm install'];

  if (featureIds.includes('devtools')) {
    commands.push('npm run prepare'); // Initialize husky
  }

  if (featureIds.includes('testing')) {
    commands.push('npx playwright install chromium'); // Install Playwright browser
  }

  if (featureIds.includes('i18n')) {
    commands.push('npm run i18n:extract'); // Extract initial translations
  }

  return commands;
}

/**
 * Generate CLAUDE.md content based on selected features
 */
export function generateClaudeMd(featureIds: string[], projectName: string, scripts: Record<string, string>): string {
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

  if (featureIds.includes('data') || featureIds.includes('i18n') || featureIds.includes('mobile')) {
    structureParts.push('├── contexts/      # React Context providers');
  }
  structureParts.push('├── hooks/         # Custom hooks');
  structureParts.push(
    '├── lib/           # config, utils, format' +
      (featureIds.includes('data') ? ', api' : '') +
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
    structureParts.push('tests/unit/        # Vitest (mirrors src/)');
    structureParts.push('e2e/               # Playwright tests');
  }

  sections.push(`
## Project Structure

\`\`\`
${structureParts.join('\n')}
\`\`\``);

  // Code Patterns - always included
  const stateHierarchy: string[] = [];
  if (featureIds.includes('state')) stateHierarchy.push('Zustand (persisted)');
  if (featureIds.includes('data')) stateHierarchy.push('TanStack Query (server)');
  stateHierarchy.push('Context (UI)', 'useState (local)');

  sections.push(`
## Code Patterns

**Imports**: Always use \`@/\` path alias

**Components**: Named exports + \`Props\` interface. Pages use default exports for lazy loading.

**TypeScript**: \`type\` for unions, \`interface\` for objects

**State hierarchy**: ${stateHierarchy.join(' → ')}`);

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

  // MCP Servers section - always helpful
  sections.push(`
## MCP Servers (PREFER OVER WebSearch)

Use MCP servers for documentation lookup. They provide **structured, version-accurate data** directly from source.

### Context7 MCP (All Libraries)

Use for **any npm package** documentation:

\`\`\`
resolve-library-id → get-library-docs
\`\`\`

**Examples**: react-hook-form, @tanstack/react-query, zustand, zod, date-fns`);

  if (featureIds.includes('ui')) {
    sections.push(`
### Shadcn MCP (UI Components)

| Need                | Tool                                             |
| ------------------- | ------------------------------------------------ |
| Find component      | \`mcp__shadcn__search_items_in_registries\`        |
| View component code | \`mcp__shadcn__view_items_in_registries\`          |
| Usage examples      | \`mcp__shadcn__get_item_examples_from_registries\` |`);
  }

  // Translations section - only if i18n feature
  if (featureIds.includes('i18n')) {
    sections.push(`
## Translations (CRITICAL)

All user-facing text MUST have translator comments. ESLint enforces this.

\`\`\`tsx
<Trans comment="Dashboard heading">Welcome back</Trans>
t({ message: 'Close', comment: 'Close button' })
\`\`\``);
  }

  // Testing section - only if testing feature
  if (featureIds.includes('testing')) {
    sections.push(`
## Testing

Tests in \`tests/unit/\` mirror \`src/\` structure. 80% coverage required.

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
export function generateViteEnvDts(featureIds: string[]): string {
  const envVars: string[] = [];

  // Core env vars (always included)
  envVars.push('  readonly VITE_APP_NAME: string;');
  envVars.push('  readonly VITE_APP_URL: string;');

  // Data feature env vars
  if (featureIds.includes('data')) {
    envVars.push('  readonly VITE_API_URL: string;');
  }

  // Observability feature env vars
  if (featureIds.includes('observability')) {
    envVars.push('  readonly VITE_SENTRY_DSN: string;');
    envVars.push('  readonly VITE_SENTRY_ENABLED: string;');
  }

  return `/// <reference types="vite/client" />

interface ImportMetaEnv {
${envVars.join('\n')}
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
`;
}

/**
 * Generate env.ts content based on selected features
 */
export function generateEnvTs(featureIds: string[]): string {
  const schemaFields: string[] = [];
  const envFields: string[] = [];

  // Core env vars (always included)
  schemaFields.push('  VITE_APP_NAME: z.string().min(1).optional(),');
  schemaFields.push('  VITE_APP_URL: z.string().url().optional(),');
  envFields.push('    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,');
  envFields.push('    VITE_APP_URL: import.meta.env.VITE_APP_URL,');

  // Data feature env vars
  if (featureIds.includes('data')) {
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

  return result.success ? result.data : (env as Env);
}

/**
 * Validated environment variables.
 * Access this instead of import.meta.env for type safety.
 */
export const env = validateEnv();
`;
}

/**
 * Read and parse the source package.json
 */
async function readSourcePackageJson(): Promise<Record<string, unknown>> {
  const path = resolveTemplatePath('package.json');
  const content = await readFile(path, 'utf-8');
  return JSON.parse(content);
}

/**
 * Compute complete scaffold for selected features
 */
export async function computeScaffold(
  selectedFeatures: string[],
  projectName: string = 'my-app',
): Promise<ScaffoldResult> {
  // Resolve all dependencies
  const resolvedFeatures = resolveFeatureDependencies(selectedFeatures);

  // Read engines from source package.json
  const sourcePackageJson = await readSourcePackageJson();
  const engines = (sourcePackageJson.engines as Record<string, string>) || {};

  // Merge all dependencies
  const { dependencies, devDependencies } = mergeDependencies(resolvedFeatures);

  // Merge all scripts
  const scripts = mergeScripts(resolvedFeatures);

  // Get file structure (add CLAUDE.md which is generated, not from patterns)
  // Also add docs based on selected features
  const docPaths = computeDocsForFeatures(resolvedFeatures);
  const structure = [...computeFileStructure(resolvedFeatures), 'CLAUDE.md', ...docPaths];

  // Get config files with actual content read from templates
  const configFiles: Record<string, string> = {};
  const configPaths = getConfigFiles(resolvedFeatures);
  for (const config of configPaths) {
    configFiles[config] = await readConfigFileContent(config);
  }

  // Get setup commands
  const setupCommands = getSetupCommands(resolvedFeatures);

  // Generate CLAUDE.md content
  const claudeMd = generateClaudeMd(resolvedFeatures, projectName, scripts);

  // Generate vite-env.d.ts content
  const viteEnvDts = generateViteEnvDts(resolvedFeatures);

  // Generate env.ts content
  const envTs = generateEnvTs(resolvedFeatures);

  // Get docs with content filtered by features
  const docs = await computeDocsContent(resolvedFeatures);

  return {
    packageJson: {
      name: projectName,
      dependencies,
      devDependencies,
      scripts,
      engines,
    },
    structure,
    configFiles,
    setupCommands,
    claudeMd,
    viteEnvDts,
    envTs,
    docs,
  };
}
