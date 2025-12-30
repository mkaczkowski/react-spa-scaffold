---
'@react-spa-scaffold/mcp': minor
---

Refactor MCP server for improved maintainability and type safety

**Breaking Changes:**

- Renamed `isNpxMode` to `isPublishedMode`
- Renamed `TEMPLATES_ROOT` to `CONTENT_ROOT`

**Structural Improvements:**

- Split `registry.ts` (600 LOC) into 14 individual feature files in `features/definitions/`
- Split `examples.ts` (480 LOC) into 10 category-based pattern files in `utils/examples/`
- Added `tools/types.ts` with proper tool type definitions
- Added `utils/cache.ts` with `createCache()` and `createSingletonCache()` utilities
- Added `utils/errors.ts` with `readWithFallback()` and `getErrorMessage()` utilities

**Testing:**

- Added `server.test.ts` for integration testing
- Added `utils/paths.test.ts` for path resolution testing
- Total tests increased from 48 to 53

**Documentation:**

- Updated CLAUDE.md with new structure diagram
- Updated README.md with new feature/pattern addition instructions
