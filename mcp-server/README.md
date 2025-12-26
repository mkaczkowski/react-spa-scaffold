# webapp-base MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that enables AI agents to scaffold new projects based on the webapp-base template. Instead of generating code directly, this server provides **knowledge and patterns** that AI agents use to create projects.

## Philosophy

This MCP server follows the principle: **MCP provides knowledge, AI provides execution**.

| MCP Server Does | AI Agent Does |
|-----------------|---------------|
| Lists available features | Decides which to include |
| Reports dependencies | Writes package.json |
| Provides code patterns | Generates actual files |
| Documents conventions | Follows the patterns |
| Answers "what exists" | Handles "how to create" |

## Quick Start

### Installation

```bash
cd mcp-server
npm install
npm run build
```

### Running the Server

```bash
# Direct execution
node dist/index.js

# Or via npm
npm start
```

### Testing with MCP Inspector

```bash
npm run inspect
```

## Configuration

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "webapp-base": {
      "command": "node",
      "args": ["/path/to/webapp-base/mcp-server/dist/index.js"]
    }
  }
}
```

### VS Code (Copilot)

Add to `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "webapp-base": {
      "command": "node",
      "args": ["./mcp-server/dist/index.js"]
    }
  }
}
```

### Claude Code

Add to project's `.claude/settings.json`:

```json
{
  "mcpServers": {
    "webapp-base": {
      "command": "node",
      "args": ["./mcp-server/dist/index.js"]
    }
  }
}
```

## Available Features

The server provides 10 feature modules that can be combined:

| Feature | Description | Required |
|---------|-------------|----------|
| `core` | React 19 + TypeScript + Vite 7 + Tailwind CSS | ✓ Always |
| `routing` | React Router 7 with lazy loading | Optional |
| `ui` | Shadcn/UI + icons + theming + toasts | Optional |
| `forms` | React Hook Form + Zod validation | Optional |
| `state` | Zustand with persistence | Optional |
| `data` | TanStack Query + API client | Optional |
| `i18n` | LinguiJS internationalization | Optional |
| `testing` | Vitest + Playwright + MSW | Optional |
| `devtools` | ESLint + Prettier + Husky | Optional |
| `ci` | GitHub Actions + Lighthouse | Optional |

### Feature Dependencies

Some features require others:
- `ui` → requires `state` (for theme persistence)
- `ci` → requires `devtools` + `testing`

Dependencies are automatically resolved when scaffolding.

## Tools

### `get_features`

List all available feature modules.

```typescript
// No parameters required
const result = await client.callTool('get_features', {});

// Returns array of:
{
  id: string;
  name: string;
  description: string;
  required: boolean;
  includes: string[];      // What this feature provides
  requiresFeatures: string[];  // Dependencies
  options?: Record<string, { description: string; default: boolean }>;
}
```

### `get_scaffold`

Get complete scaffold information for selected features.

```typescript
const result = await client.callTool('get_scaffold', {
  features: ['routing', 'ui', 'forms', 'testing'],
  projectName: 'my-app',         // Optional, defaults to 'my-app'
  includeExamples: false         // Optional, include code examples
});

// Returns:
{
  projectName: string;
  selectedFeatures: string[];
  resolvedFeatures: string[];    // Including auto-included dependencies
  packageJson: {
    name: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    scripts: Record<string, string>;
  };
  fileStructure: string[];       // All files to create
  configFiles: string[];         // Config files needed
  setupCommands: string[];       // Commands to run after creation
  instructions: string;          // Human-readable setup guide
}
```

### `get_example`

Get real code example for a specific pattern.

```typescript
const result = await client.callTool('get_example', {
  pattern: 'component-shared'    // See available patterns below
});

// Returns:
{
  pattern: string;
  description: string;
  filePath: string;              // Where this file lives in webapp-base
  keyPoints: string[];           // Important things to note
  code: string;                  // Actual code from webapp-base
  usage: string;                 // Hint for where to place generated files
}
```

#### Available Patterns

**Components:**
- `component-ui` - Shadcn/UI component with CVA variants
- `component-shared` - Feature component with store integration
- `component-layout` - Layout component for page structure

**Hooks:**
- `hook-state` - State hook with browser API
- `hook-query` - TanStack Query data fetching
- `hook-form` - React Hook Form + Zod
- `hook-effect` - Effect-only hook
- `use-language-hook` - Language/locale management

**State:**
- `zustand-store` - Store with persistence and devtools

**Pages:**
- `page-component` - Page with i18n
- `lazy-page` - Lazy loading pattern

**Context:**
- `context-provider` - React Context with provider
- `query-provider` - TanStack Query setup

**API:**
- `api-client` - Typed API client

**Testing:**
- `test-component` - Component test
- `test-hook` - Hook test with renderHook
- `test-store` - Zustand store test
- `msw-handler` - MSW request handler

**Other:**
- `zod-schema` - Validation schema
- `trans-component` - i18n Trans usage
- `t-function` - i18n t() usage
- `storage-utility` - localStorage utilities
- `format-utility` - Formatting utilities
- `theme-toggle` - Theme toggle component
- `seo-component` - SEO meta tags

## Resources

Resources are **read from actual files** in the webapp-base repository at runtime.
This ensures documentation stays in sync automatically.

| URI | Source Files | Description |
|-----|--------------|-------------|
| `docs://conventions` | `CODING_STANDARDS.md` + `COMPONENT_GUIDELINES.md` | Code patterns and naming conventions |
| `docs://architecture` | `ARCHITECTURE.md` | Technology stack and data flow |
| `docs://testing` | `TESTING.md` + `E2E_TESTING.md` | Unit and E2E testing guides |
| `docs://i18n` | `INTERNATIONALIZATION.md` | LinguiJS setup and translation workflow |
| `docs://api` | `API_REFERENCE.md` | API client and data fetching patterns |
| `docs://workflow` | `WORKFLOW.md` | Development process and CI/CD |
| `docs://claude` | `CLAUDE.md` | AI assistant guidance |

### How Resources Stay in Sync

Unlike hardcoded content, resources read the actual markdown files from `docs/`:

```typescript
// When client requests docs://architecture
const content = await readFile('docs/ARCHITECTURE.md', 'utf-8');
return { contents: [{ uri, text: content }] };
```

**Benefits:**
- Edit `docs/ARCHITECTURE.md` → MCP resource updates automatically
- No duplicate content to maintain
- Single source of truth

## Example AI Agent Workflow

Here's how an AI agent would use this MCP server to scaffold a new project:

```
User: "Create a new React app called 'my-dashboard' with routing,
       UI components, forms, and testing"

AI Agent:

1. Query available features
   → MCP: get_features()
   ← Returns 10 features with descriptions

2. Get scaffold for selected features
   → MCP: get_scaffold({
       features: ['routing', 'ui', 'forms', 'testing'],
       projectName: 'my-dashboard'
     })
   ← Returns dependencies, file structure, setup commands

3. Create project directory
   → mkdir my-dashboard && cd my-dashboard

4. Write package.json with returned dependencies

5. For each file type needed, get patterns:
   → MCP: get_example({ pattern: 'component-ui' })
   → MCP: get_example({ pattern: 'hook-form' })
   → MCP: get_example({ pattern: 'test-component' })

6. Generate files based on patterns

7. Create config files (vite.config.ts, etc.)

8. Run setup commands:
   → npm install
   → npm run prepare
   → npx playwright install chromium

9. Verify with npm run build
```

## Extending with New Features

### Adding a New Feature

1. **Define the feature** in `src/features/registry.ts`:

```typescript
const myFeature: Feature = {
  name: 'My Feature',
  description: 'Description shown to users',
  required: false,
  includes: [
    'Thing 1 this feature provides',
    'Thing 2 this feature provides',
  ],
  dependencies: {
    'some-package': '^1.0.0',
  },
  devDependencies: {
    'some-dev-package': '^2.0.0',
  },
  files: [
    'src/lib/myFeature.ts',
    'src/hooks/useMyFeature.ts',
  ],
  patterns: [
    'my-feature-pattern',
  ],
  scripts: {
    'my-script': 'some-command',
  },
  requiresFeatures: ['state'], // Optional dependencies
  configFiles: [
    'my-feature.config.js',
  ],
};
```

2. **Add to the registry**:

```typescript
export const FEATURES: FeatureRegistry = {
  // ... existing features
  myFeature,
};
```

3. **Add pattern examples** in `src/utils/examples.ts`:

```typescript
const PATTERN_MAP: Record<string, {...}> = {
  // ... existing patterns
  'my-feature-pattern': {
    file: 'src/lib/myFeature.ts',
    description: 'My feature implementation',
    keyPoints: [
      'Key point 1',
      'Key point 2',
    ],
  },
};
```

4. **Create the actual files** in webapp-base's `src/` directory (the MCP server reads real code, not templates).

5. **Rebuild**: `npm run build`

### Adding a New Pattern

If you just want to expose a new pattern without a full feature:

1. Add to `PATTERN_MAP` in `src/utils/examples.ts`
2. Ensure the referenced file exists in webapp-base
3. Rebuild

### Adding a New Resource

Resources are defined in `src/resources/docs.ts` and read from actual files:

1. Add entry to `DOCS_MAP` in `src/resources/docs.ts`:

```typescript
const DOCS_MAP: Record<string, {...}> = {
  // ... existing entries

  'docs://my-topic': {
    files: ['docs/MY_TOPIC.md'],           // Can list multiple files
    name: 'My Topic',
    description: 'Description shown to clients',
  },
};
```

2. Create the actual documentation file in webapp-base:

```bash
# Create docs/MY_TOPIC.md with your content
```

3. Rebuild: `npm run build`

**That's it!** The server reads the file at runtime, so updates to the markdown file are reflected immediately (no rebuild needed for content changes).

#### Combining Multiple Files

You can combine multiple docs into one resource:

```typescript
'docs://testing': {
  files: ['docs/TESTING.md', 'docs/E2E_TESTING.md'],  // Concatenated with ---
  name: 'Testing Guide',
  description: 'Unit and E2E testing documentation',
},
```

## Development

### Project Structure

```
mcp-server/
├── src/
│   ├── index.ts           # Entry point (STDIO transport)
│   ├── server.ts          # MCP server setup
│   ├── features/
│   │   ├── types.ts       # Type definitions
│   │   ├── registry.ts    # Feature definitions
│   │   └── index.ts
│   ├── tools/
│   │   ├── get-features.ts
│   │   ├── get-scaffold.ts
│   │   ├── get-example.ts
│   │   └── index.ts
│   ├── resources/
│   │   ├── docs.ts            # Dynamic documentation loading
│   │   └── index.ts
│   └── utils/
│       ├── scaffold.ts    # Scaffold computation
│       ├── examples.ts    # Pattern example loading
│       └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Scripts

```bash
npm run build      # Compile TypeScript
npm run dev        # Watch mode
npm start          # Run server
npm run typecheck  # Type check only
npm run inspect    # Test with MCP Inspector
```

### How Examples Work

The `get_example` tool reads **actual code from the webapp-base repository**, not templates. This means:

1. Examples are always in sync with the real codebase
2. No template maintenance needed
3. Patterns update automatically when code changes

The server assumes it's running from within the webapp-base directory. File paths are resolved relative to the mcp-server location.

## Troubleshooting

### "File not found" in examples

Ensure you're running the MCP server from within the webapp-base repository:

```bash
cd /path/to/webapp-base/mcp-server
npm start
```

### Tools not appearing in client

1. Check the client configuration points to the correct path
2. Ensure the server is built: `npm run build`
3. Check server logs (written to stderr)

### Type errors after changes

Run `npm run typecheck` to see TypeScript errors, then rebuild.

## License

MIT
