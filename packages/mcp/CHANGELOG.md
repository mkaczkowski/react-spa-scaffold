# @react-spa-scaffold/mcp

## 1.1.2

### Patch Changes

- [#14](https://github.com/mkaczkowski/react-spa-scaffold/pull/14) [`e824726`](https://github.com/mkaczkowski/react-spa-scaffold/commit/e8247260a97036015767096f6b30da29b04a91c8) Thanks [@mkaczkowski](https://github.com/mkaczkowski)! - Move unit tests to be co-located with source files
  - Migrate 21 test files from `tests/unit/` to `src/` alongside their source files
  - Update vitest config to only include `src/**/*.test.{ts,tsx}`
  - Update documentation to reflect co-located test pattern
  - Remove empty `tests/unit/` directory
