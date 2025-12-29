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
├── server.ts          # MCP server setup, tool handlers, Zod validation
├── version.ts         # Dynamic version from package.json
├── features/          # Feature registry and types
│   ├── registry.ts    # All 10 features defined here
│   └── versions.ts    # Config package versions
├── tools/             # MCP tool implementations
│   ├── get-features.ts
│   ├── get-scaffold.ts  # Uses Zod schema with .refine()
│   └── get-example.ts   # Uses z.enum() for patterns
├── resources/         # MCP resources (docs)
│   └── docs.ts        # Reads from docs/, caches results
└── utils/             # Helpers
    ├── examples.ts    # PATTERN_MAP definitions
    ├── scaffold.ts    # Dependency resolution
    └── paths.ts       # Monorepo vs published path detection
```

## Code Patterns

**Validation**: Use Zod schemas in tool files, validate with `.safeParse()` in server.ts

```typescript
// In tools/get-scaffold.ts
export const getScaffoldSchema = z.object({
  features: z.array(z.string()).refine(...),
});

// In server.ts
const result = getScaffoldSchema.safeParse(args);
if (!result.success) return errorResponse(result.error.message);
```

**Caching**: Resources use in-memory Map cache for file reads

**Adding features**: Edit `src/features/registry.ts`, add patterns to `src/utils/examples.ts`

**Adding resources**: Edit `src/resources/docs.ts` DOCS_MAP, create doc in `docs/`

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

Tests in `tests/tools.test.ts` verify:

- Feature listing and metadata
- Scaffold generation with dependency resolution
- Example retrieval for all patterns
- Zod schema validation (invalid inputs)
