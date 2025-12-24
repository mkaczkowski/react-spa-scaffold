# Webapp Base

An opinionated, production-ready starter template for React 19 + TypeScript + Vite 7 projects.

## What Is This?

This is a **starting point** for building modern web applications. It comes pre-configured with carefully selected technologies and patterns that work well together.

**This is not a framework** - it's a foundation you can build upon, modify, or strip down to fit your needs.

## Philosophy

- **Pick what you need** - Not every project needs i18n, error tracking, or E2E tests. Remove what doesn't apply to your use case.
- **Customize freely** - All configurations are exposed and meant to be adjusted. Change the theme, swap out libraries, or restructure folders.
- **Learn and adapt** - Use this as a reference for how these tools work together, then make it your own.

## Included Technologies

| Category       | Technology               | Purpose                  | Optional?                 |
| -------------- | ------------------------ | ------------------------ | ------------------------- |
| Core           | React 19 + TypeScript    | UI framework             | No                        |
| Build          | Vite 7                   | Development & bundling   | No                        |
| Styling        | Tailwind CSS v4          | Utility-first CSS        | No                        |
| Components     | shadcn/ui (Radix Nova)   | UI primitives            | Swap as needed            |
| State          | Zustand                  | Global state management  | Remove if not needed      |
| i18n           | LinguiJS                 | Internationalization     | Remove if single-language |
| Error Tracking | Sentry                   | Production monitoring    | Remove if not needed      |
| Unit Tests     | Vitest + RTL             | Component testing        | Keep or swap              |
| E2E Tests      | Playwright               | Integration testing      | Remove if not needed      |
| Linting        | ESLint + Prettier        | Code quality             | Adjust rules              |
| Git Hooks      | Husky + lint-staged      | Pre-commit checks        | Adjust or remove          |
| Commits        | Commitlint               | Commit message format    | Remove if not needed      |
| CI/CD          | GitHub Actions           | Automated testing        | Adapt to your CI          |
| Performance    | Bundlewatch + Lighthouse | Bundle & perf monitoring | Remove if not needed      |

## Getting Started

### Option 1: Clone and Customize

```bash
# Clone this repository
git clone <repo-url> my-app
cd my-app

# Remove git history and start fresh
rm -rf .git
git init

# Install dependencies
npm install

# Start development
npm run dev
```

### Option 2: Use as Reference

Browse the code to understand how pieces fit together, then copy what you need into your own project.

## Customization Guide

### Don't Need i18n?

Remove LinguiJS:

```bash
# Remove packages
npm uninstall @lingui/core @lingui/react @lingui/cli @lingui/vite-plugin @lingui/babel-plugin-lingui-macro

# Delete files
rm -rf src/i18n src/locales lingui.config.js

# Remove from vite.config.ts, main.tsx, and test-utils.tsx
```

### Don't Need Sentry?

```bash
npm uninstall @sentry/react @sentry/vite-plugin

# Remove initSentry() from main.tsx
# Remove Sentry reporting from ErrorBoundary
# Remove SENTRY_* from CI workflow
```

### Want Different State Management?

Zustand can be swapped for Redux, Jotai, or React Context. The store pattern in `src/stores/` shows the expected interface.

### Prefer Different Component Library?

shadcn/ui components in `src/components/ui/` can be replaced with any library. The wrapper pattern keeps your feature code decoupled.

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
├── stores/          # Zustand stores (optional)
└── types/           # TypeScript types
```

## Available Scripts

| Command                 | Description              |
| ----------------------- | ------------------------ |
| `npm run dev`           | Start development server |
| `npm run build`         | Build for production     |
| `npm run preview`       | Preview production build |
| `npm run typecheck`     | Run TypeScript check     |
| `npm run lint`          | Run ESLint               |
| `npm run lint:fix`      | Auto-fix ESLint issues   |
| `npm run format`        | Format with Prettier     |
| `npm run test`          | Run unit tests           |
| `npm run test:coverage` | Run tests with coverage  |
| `npm run e2e`           | Run E2E tests            |
| `npm run i18n:extract`  | Extract i18n strings     |

## Adding shadcn/ui Components

```bash
npx shadcn@latest add button card dialog input
```

## License

MIT - Use this however you want.
