# Webapp Base

A minimal, production-ready template for React 19 + TypeScript + Vite 7 projects with shadcn/ui, Tailwind CSS v4, and modern tooling.

## Features

- **React 19** with TypeScript
- **Vite 7** for fast development and builds
- **Tailwind CSS v4** with OKLCH colors
- **shadcn/ui** (Radix Nova style) component library
- **Zustand** for state management
- **LinguiJS** for internationalization (8 languages)
- **Sentry** for error tracking (production)
- **Vitest + React Testing Library** for unit tests
- **Playwright** for E2E tests
- **ESLint + Prettier** with strict rules
- **Husky + lint-staged** for pre-commit hooks
- **Commitlint** for conventional commits
- **GitHub Actions CI** with caching
- **Bundlewatch + Lighthouse CI** for performance monitoring

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development
npm run dev
```

## Available Scripts

| Command                 | Description                       |
| ----------------------- | --------------------------------- |
| `npm run dev`           | Start development server          |
| `npm run build`         | Build for production              |
| `npm run preview`       | Preview production build          |
| `npm run typecheck`     | Run TypeScript type check         |
| `npm run lint`          | Run ESLint                        |
| `npm run lint:fix`      | Auto-fix ESLint issues            |
| `npm run format`        | Format with Prettier              |
| `npm run test`          | Run unit tests                    |
| `npm run test:coverage` | Run tests with coverage           |
| `npm run e2e`           | Run E2E tests                     |
| `npm run i18n:extract`  | Extract i18n strings to .po files |

## Project Structure

```
src/
├── components/
│   ├── ui/          # shadcn/ui base components
│   ├── layout/      # Layout components (Header)
│   └── shared/      # Reusable feature components
├── contexts/        # React Context providers
├── hooks/           # Custom React hooks
├── i18n/            # Internationalization
├── lib/             # Utilities
├── locales/         # Translation files (.po)
├── stores/          # Zustand stores
└── types/           # TypeScript types
```

## Adding Components

```bash
npx shadcn@latest add button card dialog
```

## i18n Workflow

```bash
# Extract new strings from code
npm run i18n:extract

# Edit .po files in src/locales/ (translations compile automatically during build)
```

## License

MIT
