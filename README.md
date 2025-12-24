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
| **Lighthouse CI**       | Performance, accessibility, and SEO auditing in CI. Catches regressions.       | Yes              |

## Getting Started

### Prerequisites

- Node.js >= 22.0.0

### Option 1: Clone and Customize

```bash
git clone <repo-url> my-app
cd my-app
rm -rf .git && git init  # Start fresh
npm install
npm run dev
```

### Option 2: Use as Reference

Browse the code to understand how pieces fit together, then copy what you need.

## Removing Optional Features

<details>
<summary><strong>Remove i18n (LinguiJS)</strong></summary>

```bash
npm uninstall @lingui/core @lingui/react @lingui/cli @lingui/vite-plugin @lingui/babel-plugin-lingui-macro
rm -rf src/i18n src/locales lingui.config.js
# Update: vite.config.ts, main.tsx, test-utils.tsx
```

</details>

<details>
<summary><strong>Remove TanStack Query</strong></summary>

```bash
npm uninstall @tanstack/react-query
rm src/contexts/queryContext.tsx src/hooks/useExampleQuery.ts
# Update: main.tsx, test-utils.tsx
```

</details>

<details>
<summary><strong>Remove React Hook Form + Zod</strong></summary>

```bash
npm uninstall react-hook-form @hookform/resolvers zod
rm src/lib/validations.ts src/hooks/useContactForm.ts
```

</details>

<details>
<summary><strong>Remove Sentry</strong></summary>

```bash
npm uninstall @sentry/react @sentry/vite-plugin
# Remove: initSentry() from main.tsx, Sentry from ErrorBoundary, SENTRY_* from CI
```

</details>

<details>
<summary><strong>Remove MSW</strong></summary>

```bash
npm uninstall msw
rm -rf src/mocks
# Remove: MSW imports from src/test-setup.ts and src/test-utils.tsx
```

</details>

<details>
<summary><strong>Remove Zustand</strong></summary>

```bash
npm uninstall zustand
rm -rf src/stores
# Replace with React Context or your preferred state solution
```

</details>

<details>
<summary><strong>Swap Component Library</strong></summary>

shadcn/ui components in `src/components/ui/` can be replaced with MUI, Chakra, or any library. The wrapper pattern keeps
feature code decoupled.

</details>

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
├── lib/             # Utilities
├── locales/         # Translation files (optional)
├── mocks/           # MSW handlers and fixtures (optional)
├── stores/          # Zustand stores (optional)
└── types/           # TypeScript types

tests/
└── unit/            # Unit tests
```

## Scripts

| Command                 | Description             |
| ----------------------- | ----------------------- |
| `npm run dev`           | Start dev server        |
| `npm run build`         | Production build        |
| `npm run test`          | Run unit tests          |
| `npm run test:coverage` | Run tests with coverage |
| `npm run e2e`           | Run E2E tests           |
| `npm run lint:fix`      | Fix lint issues         |
| `npm run format`        | Format code             |
| `npm run i18n:extract`  | Extract i18n strings    |

## Adding Components

```bash
npx shadcn@latest add button card dialog input
```

## Example Usage

### TanStack Query

```typescript
import { useExampleQuery } from '@/hooks/useExampleQuery';

function MyComponent() {
  const { data, isLoading, error } = useExampleQuery();

  if (isLoading) return <div>Loading
...
  </div>;
  if (error) return <div>Error
:
  {
    error.message
  }
  </div>;

  return <div>{ data?.map(item => item.title)
}
  </div>;
}
```

### React Hook Form + Zod

```typescript
import { useContactForm } from '@/hooks/useContactForm';

function ContactForm() {
  const { form, onSubmit, isSubmitting, errors } = useContactForm();

  return (
    <form onSubmit = { onSubmit } >
      <input { ...form.register('name') }
  />
  {
    errors.name && <span>{ errors.name.message } < /span>}
    < button
    type = "submit"
    disabled = { isSubmitting } > Submit < /button>
      < /form>
  )
    ;
  }
```

### SEO Component (React 19 Native Metadata)

React 19 natively supports document metadata tags that are automatically hoisted to `<head>`:

```typescript
import { SEO } from '@/components/shared';

function HomePage() {
  return (
    <>
      <SEO
        title = "Home"
  description = "Welcome to our app"
  keywords = { ['react', 'typescript'
]
}
  />
  < main > Content
  here < /main>
  < />
)
  ;
}
```

### Internationalization (Lingui)

This project uses [LinguiJS](https://lingui.dev/) for internationalization with **mandatory translator comments**.

**Always add comments** to help translators understand context:

```tsx
import { Trans } from '@lingui/react/macro';
import { useLingui } from '@lingui/react/macro';

function Header() {
  const { t } = useLingui();

  return (
    <header>
      {/* Trans component with comment */}
      <h1>
        <Trans comment="Main welcome heading on the home page">Welcome</Trans>
      </h1>

      {/* t() function with comment */}
      <button
        aria-label={t({
          message: 'Close menu',
          comment: 'Accessibility label for mobile menu close button',
        })}
      />

      <LanguageSwitcher />
    </header>
  );
}
```

### API Mocking (MSW)

[Mock Service Worker](https://mswjs.io/) is configured for API mocking in tests. Handlers are defined in
`src/mocks/handlers/`:

```typescript
// In your test file
import { http, HttpResponse, server } from '@/test';

it('handles error state', () => {
  // Override handler for this specific test
  server.use(
    http.get('https://api.example.com/data', () => {
      return new HttpResponse(null, { status: 500 });
    }),
  );

  // Test error handling...
});
```

**Adding new handlers:**

1. Create handler file in `src/mocks/handlers/` (e.g., `users.ts`)
2. Define handlers using `http.get()`, `http.post()`, etc.
3. Export and add to `src/mocks/handlers/index.ts`
4. Create fixtures in `src/mocks/fixtures/` as needed

## License

MIT - Use however you want.
