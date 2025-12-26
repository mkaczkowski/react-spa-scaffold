/**
 * Architecture resource
 *
 * Provides architectural overview and data flow for webapp-base projects.
 */

export const architectureContent = `# webapp-base Architecture

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React 19 | UI rendering with concurrent features |
| Language | TypeScript 5.9 | Type safety and developer experience |
| Build | Vite 7 | Fast dev server and optimized builds |
| Styling | Tailwind CSS v4 | Utility-first CSS framework |
| Components | Shadcn/UI | Accessible, customizable components |
| Routing | React Router 7 | SPA navigation with lazy loading |
| Client State | Zustand | Lightweight state with persistence |
| Server State | TanStack Query v5 | Data fetching, caching, sync |
| Forms | React Hook Form + Zod | Type-safe form handling |
| i18n | LinguiJS | Internationalization with .po files |
| Testing | Vitest + Playwright | Unit and E2E testing |
| Mocking | MSW | Network-level API mocking |

## Data Flow

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Pages     │  │  Components │  │   Hooks     │              │
│  │  (Routes)   │  │  (UI/Shared)│  │  (Logic)    │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
│         └────────────────┼────────────────┘                      │
│                          │                                       │
│  ┌───────────────────────┼───────────────────────────────────┐  │
│  │                 State Management                          │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │  │
│  │  │   Zustand   │  │  TanStack   │  │   Context   │        │  │
│  │  │  (Client)   │  │   Query     │  │    (UI)     │        │  │
│  │  │ Persisted   │  │  (Server)   │  │  Transient  │        │  │
│  │  └──────┬──────┘  └──────┬──────┘  └─────────────┘        │  │
│  │         │                │                                 │  │
│  │         │         ┌──────┴──────┐                         │  │
│  │         │         │  API Client │                         │  │
│  │         │         │  (lib/api)  │                         │  │
│  │         │         └──────┬──────┘                         │  │
│  └─────────┼────────────────┼────────────────────────────────┘  │
│            │                │                                    │
│  ┌─────────┴────────┐  ┌────┴──────┐                            │
│  │   localStorage   │  │  Backend  │                            │
│  │   (Persisted)    │  │   API     │                            │
│  └──────────────────┘  └───────────┘                            │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

## Component Architecture

### UI Components (src/components/ui/)
- Shadcn/UI primitives
- Unstyled/minimally styled
- Use CVA for variants
- Forward refs for DOM access
- No business logic

### Shared Components (src/components/shared/)
- Feature-specific components
- May use stores, hooks, i18n
- Each in subdirectory with barrel export
- Compose UI components

### Layout Components (src/components/layout/)
- Page structure (Header, Footer, Sidebar)
- Compose shared components
- Minimal logic

### Pages (src/pages/)
- Route entry points
- Lazy-loaded for code splitting
- Thin wrappers around features
- Handle route params

## State Management Decision Tree

\`\`\`
Is the state persisted across sessions?
├── Yes → Zustand with persist middleware
└── No
    ├── Is it server data (API response)?
    │   ├── Yes → TanStack Query
    │   └── No
    │       ├── Is it shared across many components?
    │       │   ├── Yes → React Context
    │       │   └── No → useState / useReducer
    │       └── Is it URL state?
    │           └── Yes → React Router (searchParams, params)
\`\`\`

## Lazy Loading Strategy

### Pages
\`\`\`typescript
const HomePage = lazy(() =>
  import('@/pages/Home').then(m => ({ default: m.HomePage }))
);
\`\`\`

### Heavy Libraries
- Sentry loaded on-demand after error
- i18n catalogs loaded per-locale

### Code Splitting (Vite)
\`\`\`typescript
// vite.config.ts
manualChunks: {
  vendor: ['react', 'react-dom'],
  ui: ['radix-ui', 'lucide-react'],
  i18n: ['@lingui/core', '@lingui/react'],
}
\`\`\`

## Testing Architecture

### Unit Tests (Vitest)
\`\`\`
tests/unit/
├── components/     # React component tests
├── hooks/          # Custom hook tests
├── stores/         # Zustand store tests
├── lib/            # Utility function tests
└── contexts/       # Context provider tests
\`\`\`

### E2E Tests (Playwright)
\`\`\`
e2e/tests/
├── home.spec.ts       # Page-level tests
├── navigation.spec.ts # Flow tests
├── theme.spec.ts      # Feature tests
└── language.spec.ts   # i18n tests
\`\`\`

### Mocking Strategy
- **MSW**: All API calls mocked at network level
- **Handlers**: Defined per-endpoint in src/mocks/handlers/
- **Fixtures**: Static mock data in src/mocks/fixtures/
- **Reset**: Handlers reset after each test automatically

## Error Handling

### API Errors
\`\`\`typescript
class ApiClientError extends Error {
  status: number;
  code?: string;
}
\`\`\`

### React Errors
- ErrorBoundary wraps app
- Logs to Sentry (if configured)
- Shows fallback UI
- Offers retry action

### Form Errors
- Zod schema validation
- Field-level error messages
- Form-level error summary

## Performance Optimizations

1. **Code Splitting**: Lazy routes, chunked vendors
2. **Caching**: TanStack Query with staleTime/gcTime
3. **Memoization**: useMemo, useCallback where needed
4. **Persistence**: Zustand persist to avoid re-fetching preferences
5. **Font Loading**: Variable font with font-display: swap
6. **Asset Optimization**: Vite production build optimizations
`;

export const architectureResourceDefinition = {
  uri: 'docs://architecture',
  name: 'Architecture Overview',
  description: 'Technology stack, data flow, and architectural decisions for webapp-base',
  mimeType: 'text/markdown',
};
