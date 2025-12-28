# Webapp Base

An opinionated, production-ready starter template for React 19 + TypeScript + Vite 7 projects.

## What Is This?

This is a **starting point** for building modern web applications. It comes pre-configured with carefully selected
technologies and patterns that work well together.

**This is not a framework** - it's a foundation you can build upon, modify, or strip down to fit your needs.

## Philosophy

- **Pick what you need** - Not every project needs i18n or E2E tests. Remove what doesn't apply.
- **Customize freely** - All configurations are exposed and meant to be adjusted.
- **Learn and adapt** - Use as reference, then make it your own.

## Technology Choices

### Core Stack

| Technology          | Why This One?                                                                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **React 19**        | Largest ecosystem, best hiring pool, concurrent features. Vue/Svelte are great but React's market share means more resources and libraries.  |
| **TypeScript**      | Catches bugs at compile time, enables better IDE support. The upfront cost pays off in maintainability.                                      |
| **Vite 7**          | 10-100x faster than Webpack in dev mode. Native ESM, instant HMR. The new standard for React projects.                                       |
| **Tailwind CSS v4** | Utility-first scales better than CSS-in-JS for teams. No runtime cost, smaller bundles than styled-components. v4 brings native CSS nesting. |

### UI Components

| Technology    | Why This One?                                                                                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **shadcn/ui** | Copy-paste components you own (not a dependency). Built on accessible Radix primitives. Fully customizable, no vendor lock-in. Unlike MUI/Chakra, you control the code. |

### State & Data

| Technology          | Why This One?                                                                                                                      | Optional? |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------- |
| **Zustand**         | Simpler than Redux (no boilerplate), smaller than MobX (1KB). Works outside React components. Built-in devtools and persistence.   | Yes       |
| **TanStack Query**  | Industry standard for server state. Automatic caching, background updates, optimistic mutations. Eliminates manual loading states. | Yes       |
| **React Hook Form** | Best-in-class form handling. Minimal re-renders, native integration with Zod for validation.                                       | Yes       |
| **Zod**             | TypeScript-first schema validation. Single source of truth for runtime validation and static types.                                | Yes       |
| **LinguiJS**        | Smaller runtime than react-i18next. ICU message format. Compile-time extraction catches missing translations.                      | Yes       |

### Quality & Testing

| Technology            | Why This One?                                                                                                        | Optional?    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------ |
| **Vitest**            | Same API as Jest but 10x faster. Native ESM, works with Vite config. No separate setup needed.                       | No           |
| **MSW**               | Industry standard API mocking. Network-level interception, works with any HTTP client. Per-test handler overrides.   | Yes          |
| **Playwright**        | More reliable than Cypress, true cross-browser testing. Auto-wait eliminates flaky tests. Faster parallel execution. | Yes          |
| **ESLint + Prettier** | Industry standard. ESLint for bugs, Prettier for formatting. Separate concerns, no conflicts.                        | Adjust rules |

### DevOps & Monitoring

| Technology              | Why This One?                                                                  | Optional?        |
| ----------------------- | ------------------------------------------------------------------------------ | ---------------- |
| **Husky + lint-staged** | Catches issues before commit, not in CI. Only checks changed files (fast).     | Adjust           |
| **Commitlint**          | Conventional commits enable auto-changelogs and semantic versioning.           | Yes              |
| **GitHub Actions**      | Free for public repos, generous limits for private. Native GitHub integration. | Adapt to your CI |
| **Sentry**              | Best-in-class error tracking with source maps. Free tier is generous.          | Yes              |

## Getting Started

### Prerequisites

- Node.js >= 22.0.0

### Clone and Customize

```bash
git clone <repo-url> my-app
cd my-app
rm -rf .git && git init  # Start fresh
npm install
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── ui/          # Base UI components (shadcn/ui)
│   ├── layout/      # Layout components
│   └── shared/      # Reusable feature components
├── contexts/        # React Context providers
├── hooks/           # Custom React hooks
├── i18n/            # Internationalization (optional)
├── lib/             # Utilities, API client, config
├── locales/         # Translation files (optional)
├── mocks/           # MSW handlers and fixtures (optional)
├── pages/           # Route page components
├── stores/          # Zustand stores (optional)
├── test/            # Test utilities and providers
└── types/           # TypeScript types

tests/unit/          # Vitest tests (mirrors src/)
e2e/                 # Playwright E2E tests
```

See [CLAUDE.md](CLAUDE.md) for code patterns and developer workflow.

## Scripts

| Command                 | Description                   |
| ----------------------- | ----------------------------- |
| `npm run dev`           | Start dev server              |
| `npm run build`         | Production build              |
| `npm run typecheck`     | TypeScript type checking      |
| `npm run lint`          | ESLint check                  |
| `npm run lint:fix`      | ESLint with auto-fix          |
| `npm run format`        | Prettier format all files     |
| `npm run test`          | Run unit tests                |
| `npm run test:watch`    | Unit tests in watch mode      |
| `npm run test:coverage` | Tests with coverage (80% min) |
| `npm run e2e`           | Run Playwright E2E tests      |
| `npm run i18n:extract`  | Extract translation strings   |

## Adding Components

```bash
npx shadcn@latest add button card dialog
```

## License

MIT - Use however you want.
