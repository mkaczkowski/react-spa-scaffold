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
├── index.ts           # Entry point (STDIO transport)
├── server.ts          # MCP server setup
├── version.ts         # Dynamic version from package.json
├── features/
│   ├── types.ts       # Feature interface, FeatureId type
│   ├── registry.ts    # Aggregates all features
│   ├── versions.ts    # Config package versions
│   └── definitions/   # Individual feature definitions
│       ├── core.ts, mobile.ts, routing.ts, ui.ts, forms.ts
│       ├── state.ts, api.ts, i18n.ts, testing.ts
│       └── performance.ts, devtools.ts, ci.ts, observability.ts, theming.ts
├── tools/
│   ├── types.ts       # Tool type definitions
│   ├── registry.ts    # Tool registry
│   ├── get-features.ts, get-scaffold.ts, get-file.ts
├── resources/
│   └── docs.ts        # Documentation resources
└── utils/
    ├── paths.ts       # isPublishedMode, CONTENT_ROOT, resolveTemplatePath
    ├── cache.ts       # createCache, createSingletonCache
    ├── errors.ts      # readWithFallback, getErrorMessage
    ├── docs.ts        # Doc selection by feature
    └── scaffold/
        ├── dependencies.ts, file-structure.ts, generators.ts
        ├── commands.ts, compute.ts
```

## Code Patterns

**Adding features**: Create file in `src/features/definitions/`, export from index.ts, add to registry.ts

**Adding tools**: Add to `src/tools/registry.ts` with definition, handler, and schema

**Adding resources**: Edit `src/resources/docs.ts` DOCS_MAP

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

Tests co-located with source:

- `src/tools/*.test.ts` - Tool tests
- `src/utils/*.test.ts` - Utility tests
- `src/server.test.ts` - Server integration
