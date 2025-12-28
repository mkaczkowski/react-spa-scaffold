# @react-spa-scaffold/tsconfig

Shared TypeScript configurations for react-spa-scaffold projects.

## Installation

```bash
npm install -D @react-spa-scaffold/tsconfig typescript
```

## Usage

### React Applications

```json
{
  "extends": "@react-spa-scaffold/tsconfig/react",
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
  "extends": "@react-spa-scaffold/tsconfig/node",
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
  "extends": "@react-spa-scaffold/tsconfig/vite",
  "include": ["vite.config.ts", "vitest.config.ts"]
}
```

## Available Configs

| Config  | Import                               | Description                           |
| ------- | ------------------------------------ | ------------------------------------- |
| Base    | `@react-spa-scaffold/tsconfig/base`  | Shared foundation (not used directly) |
| React   | `@react-spa-scaffold/tsconfig/react` | React apps with DOM types             |
| Node.js | `@react-spa-scaffold/tsconfig/node`  | Node.js with NodeNext modules         |
| Vite    | `@react-spa-scaffold/tsconfig/vite`  | Vite/Vitest config files              |

## Path Aliases

Path aliases like `@/*` must be configured per-project since they depend on your directory structure:

```json
{
  "extends": "@react-spa-scaffold/tsconfig/react",
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
