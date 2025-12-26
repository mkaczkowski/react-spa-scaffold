/**
 * Conventions resource
 *
 * Provides coding conventions and standards for webapp-base projects.
 */

export const conventionsContent = `# webapp-base Coding Conventions

## File Organization

### Directory Structure
\`\`\`
src/
├── components/
│   ├── ui/          # Shadcn/UI primitives (kebab-case files)
│   ├── layout/      # Page structure (Header, Footer)
│   └── shared/      # Feature components (subdirs with index.ts)
├── contexts/        # React Context providers
├── hooks/           # Custom hooks (useXxx.ts)
├── lib/             # Pure utilities (no React deps)
├── pages/           # Route components (lazy-loaded)
├── stores/          # Zustand stores
├── types/           # TypeScript definitions
├── i18n/            # Internationalization setup
├── locales/         # Translation files (.po)
├── mocks/           # MSW handlers and fixtures
└── test/            # Test utilities
\`\`\`

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| UI Components | kebab-case file | \`button.tsx\`, \`dropdown-menu.tsx\` |
| Shared Components | PascalCase dir | \`ThemeToggle/ThemeToggle.tsx\` |
| Hooks | camelCase with use | \`useMediaQuery.ts\` |
| Stores | camelCase with Store | \`preferencesStore.ts\` |
| Pages | PascalCase with Page | \`HomePage\`, \`NotFoundPage\` |
| Types | PascalCase | \`ApiError\`, \`UserPreferences\` |

## Export Patterns

### Components
- **UI**: Named exports only, no default
- **Shared**: Named export + barrel index.ts
- **Pages**: Named export (transformed for lazy loading)

\`\`\`typescript
// UI component (src/components/ui/button.tsx)
export function Button() { }
export { Button, buttonVariants };

// Shared component (src/components/shared/ThemeToggle/index.ts)
export { ThemeToggle } from './ThemeToggle';

// Page (src/pages/Home.tsx)
export function HomePage() { }
\`\`\`

### Hooks
\`\`\`typescript
// Named export
export function useMediaQuery(query: string): boolean { }

// Barrel export (src/hooks/index.ts)
export { useMediaQuery } from './useMediaQuery';
\`\`\`

## Import Patterns

### Always use path alias
\`\`\`typescript
// ✓ Good
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks';

// ✗ Bad
import { Button } from '../../../components/ui/button';
\`\`\`

### UI components: Direct import (no barrel)
\`\`\`typescript
// ✓ Good
import { Button } from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/dropdown-menu';

// ✗ Bad (no barrel for UI)
import { Button, DropdownMenu } from '@/components/ui';
\`\`\`

## TypeScript Patterns

### Types vs Interfaces
- \`type\` for unions, primitives, function types
- \`interface\` for object shapes, component props

\`\`\`typescript
// Types
type Theme = 'light' | 'dark' | 'system';
type ButtonVariant = 'default' | 'destructive' | 'outline';

// Interfaces
interface ButtonProps extends HTMLButtonAttributes {
  variant?: ButtonVariant;
  size?: 'sm' | 'default' | 'lg';
}

interface UserPreferences {
  theme: Theme;
  locale: string;
}
\`\`\`

### Props Interface
\`\`\`typescript
// Always named {ComponentName}Props
export interface ButtonProps { }
export interface ThemeToggleProps { }
\`\`\`

## State Management Hierarchy

1. **Zustand** - Persisted client state (preferences, user settings)
2. **TanStack Query** - Server state (API data, caching)
3. **React Context** - UI state shared across components
4. **useState** - Local component state

## i18n Requirements

**All user-facing text MUST have translator comments.**

\`\`\`typescript
// ✓ Good - comment explains context
<Trans comment="Dashboard heading shown after login">
  Welcome back
</Trans>

t({ message: 'Close', comment: 'Close button for modal dialog' })

// ✗ Bad - missing comment (ESLint error)
<Trans>Welcome back</Trans>
t('Close')
\`\`\`

## Testing Patterns

### File Location
Tests mirror src/ structure in tests/unit/

### Imports
\`\`\`typescript
import { describe, it, expect, vi } from 'vitest';
import { screen, renderHook } from '@testing-library/react';
import { render, mockMatchMedia, server } from '@/test';
\`\`\`

### Mocking
- MSW for API calls (auto-reset after each test)
- vi.mock() for module mocking
- mockMatchMedia for media queries

## Code Style

### Formatting (Prettier)
- 120 character line width
- Single quotes
- Trailing commas
- 2 space indentation

### Linting (ESLint)
- No console.log (warn/error allowed)
- Unused variables are errors
- React Hooks rules enforced
- Lingui translator comments required
`;

export const conventionsResourceDefinition = {
  uri: 'docs://conventions',
  name: 'Coding Conventions',
  description: 'Coding standards, naming conventions, and patterns for webapp-base projects',
  mimeType: 'text/markdown',
};
