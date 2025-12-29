# React Single-Page-Application (SPA) Scaffold

![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Vite](https://img.shields.io/badge/Vite-7-646CFF)
![MCP](https://img.shields.io/badge/MCP-enabled-8A2BE2)
![License](https://img.shields.io/badge/license-MIT-green)

A production-ready starter template for React 19 + TypeScript + Vite 7 projects.

## AI-Powered Scaffolding (MCP Server)

This project includes an **MCP (Model Context Protocol) server** that enables AI assistants to scaffold new projects based on react-spa-scaffold patterns.

**Quick Start (Claude Code):**

```bash
mkdir my-app && cd my-app
echo '{"mcpServers":{"react-spa-scaffold":{"command":"npx","args":["-y","@react-spa-scaffold/mcp@latest"]}}}' > .mcp.json
```

Open in Claude Code and ask: _"Scaffold a React app with routing, forms, and testing."_

**How it works:**

1. You tell the AI what features you need (routing, forms, testing, etc.)
2. The MCP server provides knowledge: dependencies, file structures, code patterns
3. The AI generates your project following react-spa-scaffold conventions

**MCP Configuration:**

```json
{
  "mcpServers": {
    "react-spa-scaffold": {
      "command": "npx",
      "args": ["-y", "@react-spa-scaffold/mcp@latest"]
    }
  }
}
```

See [packages/mcp/README.md](packages/mcp/README.md) for full MCP documentation.

## Philosophy

- **Pick what you need** — Not every project needs i18n or E2E tests. Skip what doesn't apply.
- **Customize freely** — All configurations are exposed and meant to be adjusted.
- **Learn and adapt** — Use as reference, then make it your own.

## Technology Stack

### Core (Always Included)

| Technology          | Purpose                                  |
| ------------------- | ---------------------------------------- |
| **React 19**        | UI framework with concurrent features    |
| **TypeScript**      | Type safety and IDE support              |
| **Vite 7**          | Build tool — 10-100x faster than Webpack |
| **Tailwind CSS v4** | Utility-first CSS with native nesting    |
| **Vitest**          | Fast unit testing (Jest-compatible API)  |
| **ESLint**          | Code quality and bug detection           |
| **Prettier**        | Consistent code formatting               |

### Optional (Remove What You Don't Need)

| Feature          | Technologies          | Remove If...                   |
| ---------------- | --------------------- | ------------------------------ |
| UI Components    | Shadcn/UI + Radix     | Building custom design system  |
| State Management | Zustand               | React state is sufficient      |
| Server State     | TanStack Query        | Simple REST without caching    |
| Forms            | React Hook Form + Zod | Few or simple forms            |
| i18n             | LinguiJS              | Single language app            |
| E2E Testing      | Playwright            | Unit tests cover enough        |
| API Mocking      | MSW                   | No API integration tests       |
| Error Tracking   | Sentry                | Using alternative monitoring   |
| Git Hooks        | Husky + lint-staged   | CI handles all checks          |
| Commit Linting   | Commitlint            | No changelog automation needed |

## Project Structure

```
src/
├── components/
│   ├── ui/          # Base UI components (shadcn/ui)
│   ├── layout/      # Layout components
│   └── shared/      # Reusable feature components
├── contexts/        # React Context providers
├── hooks/           # Custom React hooks
├── i18n/            # Internationalization config
├── lib/             # Utilities, API client, config
├── locales/         # Translation files (.po)
├── mocks/           # MSW handlers and fixtures
├── pages/           # Route page components
├── stores/          # Zustand stores
├── test/            # Test utilities and providers
└── types/           # TypeScript types

tests/unit/          # Vitest tests (mirrors src/)
e2e/                 # Playwright E2E tests
```

## Quick Start

```bash
git clone <repo-url> my-app && cd my-app
rm -rf .git && git init
npm install && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — you're ready to build.

## Scripts

### Development

| Command         | Description               |
| --------------- | ------------------------- |
| `npm run dev`   | Start dev server at :5173 |
| `npm run build` | Production build          |

### Code Quality

| Command             | Description              |
| ------------------- | ------------------------ |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint`      | ESLint check             |
| `npm run lint:fix`  | ESLint with auto-fix     |
| `npm run format`    | Prettier format all      |

### Testing

| Command                 | Description                   |
| ----------------------- | ----------------------------- |
| `npm run test`          | Run unit tests                |
| `npm run test:watch`    | Unit tests in watch mode      |
| `npm run test:coverage` | Tests with coverage (80% min) |
| `npm run e2e`           | Playwright E2E tests          |

### i18n

| Command                | Description                 |
| ---------------------- | --------------------------- |
| `npm run i18n:extract` | Extract translation strings |

## Adding Components

```bash
npx shadcn@latest add button card dialog
```

## Documentation

- [Architecture & Data Flow](docs/ARCHITECTURE.md)
- [Coding Standards](docs/CODING_STANDARDS.md)
- [Component Guidelines](docs/COMPONENT_GUIDELINES.md)
- [Testing Guide](docs/TESTING.md)
- [i18n Setup](docs/INTERNATIONALIZATION.md)
- [Developer Workflow](CLAUDE.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

MIT — Use however you want.
