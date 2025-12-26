# @webapp-base/tsconfig

Shared TypeScript configurations for webapp-base projects.

## Installation

```bash
npm install -D @webapp-base/tsconfig typescript
```

## Usage

### React Applications

```json
{
  "extends": "@webapp-base/tsconfig/react",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "tests"]
}
```

### Node.js Projects

```json
{
  "extends": "@webapp-base/tsconfig/node",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Vite Config Files

```json
{
  "extends": "@webapp-base/tsconfig/vite",
  "include": ["vite.config.ts", "vitest.config.ts"]
}
```

## Available Configs

| Config  | Import                        | Description                           |
| ------- | ----------------------------- | ------------------------------------- |
| Base    | `@webapp-base/tsconfig/base`  | Shared foundation (not used directly) |
| React   | `@webapp-base/tsconfig/react` | React apps with DOM types             |
| Node.js | `@webapp-base/tsconfig/node`  | Node.js with NodeNext modules         |
| Vite    | `@webapp-base/tsconfig/vite`  | Vite/Vitest config files              |

## Path Aliases

Path aliases like `@/*` must be configured per-project since they depend on your directory structure:

```json
{
  "extends": "@webapp-base/tsconfig/react",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## What's Included

### All Configs

- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `skipLibCheck: true`

### React Config

- DOM and DOM.Iterable libs
- `jsx: "react-jsx"`
- `verbatimModuleSyntax: true`

### Node.js Config

- `module: "NodeNext"`
- Declaration files enabled
- Source maps enabled
