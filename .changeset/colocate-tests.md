---
'@react-spa-scaffold/mcp': patch
---

Move unit tests to be co-located with source files

- Migrate 21 test files from `tests/unit/` to `src/` alongside their source files
- Update vitest config to only include `src/**/*.test.{ts,tsx}`
- Update documentation to reflect co-located test pattern
- Remove empty `tests/unit/` directory
