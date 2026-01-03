/**
 * CLAUDE.md section generators - each function generates one section.
 */

import { FEATURE } from '../../../constants.js';
import type { FeatureId } from '../../../features/types.js';

/** Script descriptions for commands section. */
const SCRIPT_DESCRIPTIONS: Record<string, string> = {
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
  'db:types': 'Generate Supabase TypeScript types',
  'db:push': 'Push database migrations',
  'db:reset': 'Reset database (destructive)',
  'db:studio': 'Open Supabase Studio',
};

export function generateHeader(projectName: string): string {
  return `# CLAUDE.md

AI assistant guidance for **${projectName}** - a React 19 + TypeScript + Vite 7 codebase.`;
}

export function generateCommandsSection(scripts: Record<string, string>): string {
  const commandLines = Object.keys(scripts)
    .sort()
    .map((script) => {
      const desc = SCRIPT_DESCRIPTIONS[script] || '';
      const padding = ' '.repeat(Math.max(1, 20 - script.length));
      return `npm run ${script}${padding}# ${desc}`;
    });

  return `
## Commands

\`\`\`bash
${commandLines.join('\n')}
\`\`\``;
}

export function generateStructureSection(featureIds: FeatureId[]): string {
  const parts: string[] = ['src/', '├── components/    # ui/ (primitives), layout/, shared/ (features)'];

  if (
    featureIds.includes(FEATURE.API) ||
    featureIds.includes(FEATURE.I18N) ||
    featureIds.includes(FEATURE.MOBILE) ||
    featureIds.includes(FEATURE.DATABASE)
  ) {
    parts.push('├── contexts/      # React Context providers');
  }

  parts.push('├── hooks/         # Custom hooks');

  const libParts = ['config', 'utils', 'format'];
  if (featureIds.includes(FEATURE.API)) libParts.push('api');
  if (featureIds.includes(FEATURE.ROUTING)) libParts.push('routes');
  if (featureIds.includes(FEATURE.STATE)) libParts.push('storage');
  if (featureIds.includes(FEATURE.DATABASE)) libParts.push('supabase');
  parts.push(`├── lib/           # ${libParts.join(', ')}`);

  if (featureIds.includes(FEATURE.ROUTING)) parts.push('├── pages/         # Lazy-loaded route components');
  if (featureIds.includes(FEATURE.STATE)) parts.push('├── stores/        # Zustand stores');
  if (featureIds.includes(FEATURE.I18N)) {
    parts.push('├── i18n/          # LinguiJS config and catalogs');
    parts.push('├── locales/       # Translation files (.po)');
  }
  parts.push('└── types/         # TypeScript definitions');

  if (featureIds.includes(FEATURE.TESTING)) {
    parts.push('', '# Unit tests co-located: *.test.ts/tsx next to source');
    parts.push('e2e/tests/         # Playwright functional E2E tests');
    if (featureIds.includes(FEATURE.PERFORMANCE)) {
      parts.push('e2e/performance/   # Performance regression tests');
    }
  }

  return `
## Project Structure

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full structure and data flow.

\`\`\`
${parts.join('\n')}
\`\`\``;
}

export function generateCodePatternsSection(featureIds: FeatureId[]): string {
  const stateHierarchy: string[] = [];
  if (featureIds.includes(FEATURE.STATE)) stateHierarchy.push('Zustand (persisted)');
  if (featureIds.includes(FEATURE.API)) stateHierarchy.push('TanStack Query (server)');
  stateHierarchy.push('Context (UI)', 'useState (local)');

  return `
## Code Patterns

**Imports**: Always use \`@/\` path alias

**Components**: Named exports + \`Props\` interface. Pages use default exports for lazy loading.

**TypeScript**: \`type\` for unions, \`interface\` for objects

**State hierarchy**: ${stateHierarchy.join(' → ')}

See [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md) and [docs/COMPONENT_GUIDELINES.md](docs/COMPONENT_GUIDELINES.md).`;
}

export function generateUiSection(): string {
  return `
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
\`\`\``;
}

export function generateMobileSection(): string {
  return `
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
\`\`\``;
}

export function generateThemingSection(): string {
  return `
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
The ThemeToggle component provides a UI for switching between light, dark, and system themes.`;
}

export function generateAuthSection(): string {
  return `
## Authentication (Clerk)

Clerk provides authentication with modal-based sign-in.

### Setup

1. Create an account at [clerk.com](https://clerk.com)
2. Get your Publishable Key from the dashboard
3. Set \`VITE_CLERK_PUBLISHABLE_KEY\` in \`.env\`

### Usage

\`\`\`tsx
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/react-router';
import { ProtectedRoute } from '@/components/shared';

// Conditional rendering
<SignedIn><UserButton /></SignedIn>
<SignedOut><SignInButton mode="modal"><Button>Sign In</Button></SignInButton></SignedOut>

// Protected routes
<Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
\`\`\`

### Testing

\`\`\`tsx
import { setMockClerkSignedIn, resetClerkMocks } from '@/test';

beforeEach(() => resetClerkMocks());

it('shows sign-in when not authenticated', () => {
  setMockClerkSignedIn(false);
  // ...
});
\`\`\``;
}

export function generateDatabaseSection(): string {
  return `
## Database (Supabase)

Supabase provides PostgreSQL with Row Level Security (RLS), integrated with Clerk authentication.

### Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Configure Clerk as third-party auth provider in Supabase Dashboard
3. Enable Supabase integration in Clerk Dashboard → Integrations
4. Set \`VITE_SUPABASE_URL\` and \`VITE_SUPABASE_ANON_KEY\` in \`.env\`

### Usage

\`\`\`tsx
import { useSupabase, useSupabaseQuery, useProfile } from '@/hooks';

// Direct client access
const supabase = useSupabase();
const { data } = await supabase.from('profiles').select();

// TanStack Query wrapper
const { data, isLoading } = useSupabaseQuery({
  table: 'profiles',
  queryKey: ['current'],
});

// Current user's profile
const { profile, isLoading, exists } = useProfile();
\`\`\`

### Profile Mutations

\`\`\`tsx
import { useUpsertProfile, useUpdateProfile, useDeleteProfile } from '@/hooks';

const upsertProfile = useUpsertProfile();
await upsertProfile.mutateAsync({ id: userId, email: 'user@example.com' });
\`\`\`

### Auto-Sync

\`\`\`tsx
import { ProfileSync } from '@/components/shared';

// Add to app to auto-sync Clerk user to Supabase
<ProfileSync />
\`\`\`

### Testing

\`\`\`tsx
import { render, setMockSupabaseData, setMockSupabaseError, createProfile, resetSupabaseMocks } from '@/test';

beforeEach(() => resetSupabaseMocks());

it('displays profile data', async () => {
  setMockSupabaseData([createProfile({ full_name: 'Test User' })]);
  render(<ProfileCard />);
  // Assert profile is displayed
});

it('handles error', async () => {
  setMockSupabaseError({ message: 'Failed', code: 'ERROR' });
  render(<ProfileCard />);
  // Assert error state
});
\`\`\`

See [docs/SUPABASE_INTEGRATION.md](docs/SUPABASE_INTEGRATION.md) for full details.`;
}

export function generateMcpSection(featureIds: FeatureId[]): string {
  let section = `
## MCP Servers (PREFER OVER WebSearch)

Use MCP servers for documentation lookup. They provide **structured, version-accurate data** directly from source.`;

  if (featureIds.includes(FEATURE.UI)) {
    section += `

### Shadcn MCP (UI Components)

| Need                | Tool                                             |
| ------------------- | ------------------------------------------------ |
| Find component      | \`mcp__shadcn__search_items_in_registries\`        |
| View component code | \`mcp__shadcn__view_items_in_registries\`          |
| Usage examples      | \`mcp__shadcn__get_item_examples_from_registries\` |
| CLI add command     | \`mcp__shadcn__get_add_command_for_items\`         |`;
  }

  section += `

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
\`\`\``;

  return section;
}

export function generateI18nSection(): string {
  return `
## Translations (CRITICAL)

All user-facing text MUST have translator comments. ESLint enforces this.

\`\`\`tsx
<Trans comment="Dashboard heading">Welcome back</Trans>
t({ message: 'Close', comment: 'Close button' })
\`\`\`

See [docs/INTERNATIONALIZATION.md](docs/INTERNATIONALIZATION.md).`;
}

export function generateTestingSection(): string {
  return `
## Testing

See [docs/TESTING.md](docs/TESTING.md) and [docs/E2E_TESTING.md](docs/E2E_TESTING.md).

Unit tests are **co-located** with source files (\`*.test.ts/tsx\`). 80% coverage required.

\`\`\`typescript
import { describe, it, expect, vi } from 'vitest';
import { screen, renderHook } from '@testing-library/react';
import { render, mockMatchMedia, server } from '@/test';
\`\`\`

MSW handlers auto-reset after each test.`;
}

export function generateGotchasSection(featureIds: FeatureId[]): string {
  const gotchas: string[] = [];

  if (featureIds.includes(FEATURE.DEVTOOLS)) {
    gotchas.push('**Node.js >= 22.0.0** required (check `.nvmrc`)');
    gotchas.push('**Conventional commits** enforced by commitlint');
  }
  if (featureIds.includes(FEATURE.MOBILE)) {
    gotchas.push('**Context hooks throw** outside provider (e.g., `useMobileContext()`, `useSupabase()`)');
  }
  gotchas.push('**Barrel exports** in each directory via `index.ts`');
  if (featureIds.includes(FEATURE.UI)) {
    gotchas.push('**UI components** import directly: `@/components/ui/button` (no barrel)');
  }
  if (featureIds.includes(FEATURE.AUTH)) {
    gotchas.push('**Clerk auth required** - set `VITE_CLERK_PUBLISHABLE_KEY` in `.env`');
  }
  if (featureIds.includes(FEATURE.DATABASE)) {
    gotchas.push('**Supabase requires Clerk** - SupabaseProvider must be inside ClerkProvider');
    gotchas.push('**RLS policies required** - All Supabase tables should have Row Level Security enabled');
  }

  return `
## Common Gotchas

${gotchas.map((g, i) => `${i + 1}. ${g}`).join('\n')}
`;
}
