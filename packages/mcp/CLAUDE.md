# packages/mcp

MCP server for react-spa-scaffold scaffolding. See [README.md](README.md) for full documentation.

## Commands

```bash
npm run build      # Compile TypeScript
npm run dev        # Watch mode
npm run test       # Run tests
npm run bundle     # Bundle templates for npm
npm run inspect    # Test with MCP Inspector
```

## Structure

```
src/
├── index.ts           # Entry point (STDIO transport, graceful shutdown)
├── server.ts          # MCP server setup, uses tool registry
├── version.ts         # Dynamic version from package.json
├── features/          # Feature registry and types
│   ├── types.ts       # Feature interface, FeatureId type, FEATURE_IDS
│   └── registry.ts    # All 14 features defined here
├── tools/             # MCP tool implementations
│   ├── get-features.ts
│   ├── get-scaffold.ts
│   ├── get-example.ts
│   └── registry.ts    # Tool registry (single source of truth)
├── resources/         # MCP resources (docs)
│   └── docs.ts        # Reads from docs/, caches results
└── utils/             # Helpers
    ├── examples.ts    # PATTERN_MAP definitions
    ├── paths.ts       # Monorepo vs published path detection
    ├── docs.ts        # Doc selection by feature
    └── scaffold/      # Scaffold computation (split for readability)
        ├── dependencies.ts   # Dependency resolution
        ├── file-structure.ts # File list computation
        ├── generators.ts     # Content generators (CLAUDE.md, env.ts, etc.)
        ├── commands.ts       # Setup commands
        └── compute.ts        # Orchestrator
```

## Code Patterns

**Tool Registration**: Add new tools to `src/tools/registry.ts`:

```typescript
export const TOOL_REGISTRY: Record<string, ToolConfig> = {
  get_features: { definition, handler, schema: null },
  get_scaffold: { definition, handler, schema: getScaffoldSchema },
  // Add new tools here
};
```

**Type-safe Features**: Use `FeatureId` type and `isFeatureId()` guard from `features/types.ts`

**Caching**: Resources use in-memory Map cache for file reads

**Adding features**: Edit `src/features/registry.ts`, add patterns to `src/utils/examples.ts`

**Adding resources**: Edit `src/resources/docs.ts` DOCS_MAP, create doc in `docs/`

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

Tests are co-located with source files:

- `src/tools/get-features.test.ts` - Feature listing
- `src/tools/get-scaffold.test.ts` - Scaffold generation
- `src/tools/get-example.test.ts` - Example retrieval
- `src/utils/docs.test.ts` - Doc utilities
