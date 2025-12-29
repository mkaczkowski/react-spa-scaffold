# @react-spa-scaffold/mcp

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
