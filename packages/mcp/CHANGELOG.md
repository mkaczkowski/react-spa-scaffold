# @react-spa-scaffold/mcp

## 2.1.0

### Minor Changes

- [`845bc82`](https://github.com/mkaczkowski/react-spa-scaffold/commit/845bc8253d23225ffa9ec2a1a7d88165d539e619) - Add `add_features` tool for extending existing projects with new features. Refactor Feature schema to remove redundant `includes` property and rename `dependencyNames`/`devDependencyNames` to `dependencies`/`devDependencies`. Enhance file structure utilities with `collectFeatureFiles` function for separate file/test file handling. Update scaffold instructions with progress tracking protocol.

## 2.0.0

### Major Changes

- [`1673f4f`](https://github.com/mkaczkowski/react-spa-scaffold/commit/1673f4fb801757f239503c79b4d94775ebee75b8) - clean up

- [`948f30c`](https://github.com/mkaczkowski/react-spa-scaffold/commit/948f30c759bd74ae8a5d6440a01676e6a2fa0faf) - clean up

## 1.2.1

### Patch Changes

- [`469d3dc`](https://github.com/mkaczkowski/react-spa-scaffold/commit/469d3dc82160279f0b985882653fc7d13067ef55) - clean up

## 1.2.0

### Minor Changes

- [#18](https://github.com/mkaczkowski/react-spa-scaffold/pull/18) [`ad65cce`](https://github.com/mkaczkowski/react-spa-scaffold/commit/ad65ccefaf656d4ec345ff0cec941205790937af) Thanks [@mkaczkowski](https://github.com/mkaczkowski)! - Refactor MCP server for improved maintainability and type safety

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

## 1.1.3

### Patch Changes

- [#16](https://github.com/mkaczkowski/react-spa-scaffold/pull/16) [`08a2a5c`](https://github.com/mkaczkowski/react-spa-scaffold/commit/08a2a5c3baef10ad88bec4492b93f1b0cba57535) Thanks [@mkaczkowski](https://github.com/mkaczkowski)! - fix: configure npm registry authentication for automated publishing

## 1.1.2

### Patch Changes

- [#14](https://github.com/mkaczkowski/react-spa-scaffold/pull/14) [`e824726`](https://github.com/mkaczkowski/react-spa-scaffold/commit/e8247260a97036015767096f6b30da29b04a91c8) Thanks [@mkaczkowski](https://github.com/mkaczkowski)! - Move unit tests to be co-located with source files
  - Migrate 21 test files from `tests/unit/` to `src/` alongside their source files
  - Update vitest config to only include `src/**/*.test.{ts,tsx}`
  - Update documentation to reflect co-located test pattern
  - Remove empty `tests/unit/` directory
