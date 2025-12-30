# react-spa-scaffold MCP Server

![npm](https://img.shields.io/npm/v/@react-spa-scaffold/mcp)
![MCP](https://img.shields.io/badge/MCP-1.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D22-brightgreen)

> **TL;DR:** An MCP server that provides knowledge for AI agents to scaffold React projects. The AI asks what you need, this server provides the info, and the AI generates your project.

**3 Tools:**

- `get_features` — List available feature modules
- `get_scaffold` — Get dependencies and file structure for selected features
- `get_file` — Fetch ANY file content (config, docs, source files)

## Philosophy

**MCP provides knowledge, AI provides execution.**

| MCP Server Does          | AI Agent Does                |
| ------------------------ | ---------------------------- |
| Lists available features | Decides which to include     |
| Reports dependencies     | Writes package.json          |
| Provides file content    | Adapts for selected features |
| Documents conventions    | Follows the patterns         |

## Quick Start

```bash
# From monorepo root
npm install && npm run mcp:build

# Test with MCP Inspector
npm run mcp:inspect
```

## Configuration

Add to your MCP client config:

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

| Client         | Config Location                                                   |
| -------------- | ----------------------------------------------------------------- |
| Claude Code    | `.mcp.json` (project) or `~/.claude/settings.json` (global)       |
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| VS Code        | `.vscode/mcp.json`                                                |

**Quick Start (Claude Code):**

```bash
mkdir my-app && cd my-app
echo '{"mcpServers":{"react-spa-scaffold":{"command":"npx","args":["-y","@react-spa-scaffold/mcp@latest"]}}}' > .mcp.json
```

Open in Claude Code and start scaffolding.

<details>
<summary>Local Development Setup</summary>

For development without publishing:

```bash
cd packages/mcp
npm run build
npm link  # Makes react-spa-scaffold-mcp available globally
```

Then use in config:

```json
{
  "mcpServers": {
    "react-spa-scaffold": {
      "command": "react-spa-scaffold-mcp"
    }
  }
}
```

Or point directly to the built file:

```json
{
  "mcpServers": {
    "react-spa-scaffold": {
      "command": "node",
      "args": ["/path/to/packages/mcp/dist/index.js"]
    }
  }
}
```

</details>

## Available Features

14 feature modules that can be combined:

| Feature         | Description                                   | Required |
| --------------- | --------------------------------------------- | -------- |
| `core`          | React 19 + TypeScript + Vite 7 + Tailwind CSS | Always   |
| `mobile`        | Responsive design utilities + viewport hooks  | Optional |
| `routing`       | React Router 7 with lazy loading              | Optional |
| `ui`            | Shadcn/UI + icons + animations + toasts       | Optional |
| `theming`       | Light/dark/system theme (requires state)      | Optional |
| `forms`         | React Hook Form + Zod validation              | Optional |
| `state`         | Zustand with persistence + theme state        | Optional |
| `api`           | TanStack Query + API client                   | Optional |
| `i18n`          | LinguiJS internationalization                 | Optional |
| `testing`       | Vitest + Playwright + MSW                     | Optional |
| `performance`   | React Profiler + Lighthouse + Web Vitals      | Optional |
| `devtools`      | ESLint + Prettier + Husky                     | Optional |
| `ci`            | GitHub Actions + Dependabot                   | Optional |
| `observability` | Sentry error tracking                         | Optional |

## Tools

### `get_features`

List all available feature modules.

```typescript
const result = await client.callTool('get_features', {});
// Returns: { id, name, description, required, includes }[]
```

### `get_scaffold`

Get complete scaffold information for selected features.

```typescript
const result = await client.callTool('get_scaffold', {
  features: ['routing', 'ui', 'forms', 'testing'],
  projectName: 'my-app',
});
// Returns: { packageJson, fileStructure, configFiles, docs, setupCommands, instructions }
// Note: All paths are lazy-loaded via get_file
```

### `get_file`

Fetch content of ANY file from templates.

```typescript
const result = await client.callTool('get_file', {
  path: 'src/App.tsx', // or 'vite.config.ts', 'docs/ARCHITECTURE.md'
});
// Returns: { path, content }
```

Use paths from `get_scaffold` response:

- `configFiles`: config file paths
- `docs`: documentation paths
- `fileStructure`: ALL source file paths

**IMPORTANT**: Fetch content for EVERY file, then strip code for unselected features.

## Resources

Documentation resources read from actual files (auto-synced):

| URI                   | Source                                            | Description               |
| --------------------- | ------------------------------------------------- | ------------------------- |
| `docs://conventions`  | `CODING_STANDARDS.md` + `COMPONENT_GUIDELINES.md` | Code patterns and naming  |
| `docs://architecture` | `ARCHITECTURE.md`                                 | Technology stack and flow |
| `docs://testing`      | `TESTING.md` + `E2E_TESTING.md`                   | Unit and E2E testing      |
| `docs://i18n`         | `INTERNATIONALIZATION.md`                         | LinguiJS setup            |
| `docs://api`          | `API_REFERENCE.md`                                | API client patterns       |
| `docs://claude`       | `CLAUDE.md`                                       | AI assistant guidance     |

## Example Workflow

```
get_features() → choose features → get_scaffold() → get_file() for each path → write project
```

**Step 1: Query features**

```typescript
const features = await mcp.callTool('get_features', {});
// Returns: core, routing, ui, forms, state, api, i18n, testing, devtools, ci
```

**Step 2: Get scaffold**

```typescript
const scaffold = await mcp.callTool('get_scaffold', {
  features: ['routing', 'ui', 'forms'],
  projectName: 'my-app',
});
// Returns: packageJson, fileStructure paths, configFiles paths, docs paths
```

**Step 3: Fetch each file**

```typescript
// Fetch ALL files from fileStructure, configFiles, and docs
const appContent = await mcp.callTool('get_file', { path: 'src/App.tsx' });
const viteConfig = await mcp.callTool('get_file', { path: 'vite.config.ts' });
// ... fetch every file path
```

**Step 4: AI writes project**

```
mkdir my-app && cd my-app
→ Write package.json from scaffold.packageJson
→ Write each file (strip code for unselected features)
→ npm install && npm run build
```

## Development

### Scripts

| Command             | Description              |
| ------------------- | ------------------------ |
| `npm run build`     | Compile TypeScript       |
| `npm run dev`       | Watch mode               |
| `npm start`         | Run server               |
| `npm run inspect`   | Test with MCP Inspector  |
| `npm run bundle`    | Bundle templates for npm |
| `npm run typecheck` | Type check only          |

<details>
<summary>Monorepo Structure</summary>

```
react-spa-scaffold/
├── package.json               # Workspaces config
├── src/                       # Main react-spa-scaffold app
├── docs/                      # Documentation (read by MCP)
├── tests/                     # Test files (read by MCP)
└── packages/
    └── mcp/
        ├── src/
        │   ├── index.ts       # Entry point (STDIO transport)
        │   ├── server.ts      # MCP server setup
        │   ├── features/      # Feature registry and types
        │   ├── tools/         # Tool implementations
        │   ├── resources/     # MCP resources (docs)
        │   └── utils/         # Helpers
        ├── scripts/
        │   └── bundle-templates.js
        └── package.json
```

</details>

<details>
<summary>How Examples Work</summary>

The server supports two modes:

**Development mode** (monorepo):

- Reads files directly from monorepo root
- Changes reflected immediately
- No bundling needed

**Published mode** (npx):

- Reads from bundled `templates/` directory
- Templates copied at publish time via `npm run bundle`

```typescript
// Automatically detects which mode via .bundled marker file
export const isPublishedMode = existsSync(BUNDLE_MARKER);
export const CONTENT_ROOT = isPublishedMode ? BUNDLED_PATH : MONOREPO_ROOT;
```

</details>

<details>
<summary>Publishing to npm</summary>

```bash
# prepublishOnly runs bundle + build automatically
npm publish
```

Or manually:

```bash
npm run bundle    # Copy templates
npm run build     # Compile TypeScript
npm publish
```

</details>

<details>
<summary>Adding a New Feature</summary>

1. **Create feature file** in `src/features/definitions/my-feature.ts`:

```typescript
import type { Feature } from '../types.js';

export const myFeature: Feature = {
  name: 'My Feature',
  description: 'Description shown to users',
  required: false,
  includes: ['Thing 1', 'Thing 2'],
  dependencyNames: ['some-package'],
  devDependencyNames: ['some-dev-package'],
  files: ['src/lib/myFeature.ts'],
  scripts: { 'my-script': 'some-command' },
};
```

2. **Export from** `src/features/definitions/index.ts`

3. **Add to** `src/features/registry.ts` FEATURES object

4. **Create actual files** in react-spa-scaffold's `src/`

5. **Rebuild**: `npm run build`

</details>

<details>
<summary>Adding a New Resource</summary>

1. **Add to** `src/resources/docs.ts`:

```
'docs://my-topic': {
  files: ['docs/MY_TOPIC.md'],
  name: 'My Topic',
  description: 'Description shown to clients',
},
```

2. **Create** `docs/MY_TOPIC.md`

3. **Rebuild**: `npm run build`

Resources read files at runtime — content updates without rebuilding.

</details>

## Troubleshooting

| Problem                   | Solution                                                  |
| ------------------------- | --------------------------------------------------------- |
| "File not found"          | Run from monorepo: `cd packages/mcp && npm start`         |
| Tools not appearing       | Check config path, run `npm run build`, check stderr logs |
| Type errors after changes | Run `npm run typecheck`, then rebuild                     |

## License

MIT
