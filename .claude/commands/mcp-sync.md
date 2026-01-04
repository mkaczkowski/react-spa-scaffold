---
description: Check if MCP scaffold files need updating after main app changes
argument-hint: [file paths] or empty for git-based detection
---

# MCP Sync Check

Verify MCP scaffold files are synchronized with main app changes.

> **Meta-note**: This command file itself documents the MCP ↔ main app mappings. When adding new features, files, or changing the scaffold structure, update this file too.

## Detection Mode

1. **No arguments**: Use `git diff --name-only HEAD~1` to find recently changed files
2. **With arguments**: Check the specified file paths

## File Mapping Rules

### Category 1: Config Files (Direct Copies)

| Main App               | MCP Template                                  |
| ---------------------- | --------------------------------------------- |
| `.env.example`         | `packages/mcp/templates/.env.example`         |
| `package.json`         | `packages/mcp/templates/package.json`         |
| `vite.config.ts`       | `packages/mcp/templates/vite.config.ts`       |
| `vitest.config.ts`     | `packages/mcp/templates/vitest.config.ts`     |
| `playwright.config.ts` | `packages/mcp/templates/playwright.config.ts` |
| `tsconfig.json`        | `packages/mcp/templates/tsconfig.json`        |
| `eslint.config.js`     | `packages/mcp/templates/eslint.config.js`     |
| `prettier.config.js`   | `packages/mcp/templates/prettier.config.js`   |
| `components.json`      | `packages/mcp/templates/components.json`      |
| `lingui.config.js`     | `packages/mcp/templates/lingui.config.js`     |

### Category 2: Documentation

| Main App    | MCP Template                                                         |
| ----------- | -------------------------------------------------------------------- |
| `docs/*.md` | `packages/mcp/templates/docs/*.md`                                   |
| `CLAUDE.md` | Compare with `packages/mcp/src/utils/scaffold/claude-md/sections.ts` |

### Category 3: Feature Definitions

Check that files listed in feature definitions exist in main app:

| Feature     | Definition File                                        | Check                        |
| ----------- | ------------------------------------------------------ | ---------------------------- |
| Core        | `packages/mcp/src/features/definitions/core.ts`        | `files[]` exist              |
| Auth        | `packages/mcp/src/features/definitions/auth.ts`        | `files[]` exist              |
| Database    | `packages/mcp/src/features/definitions/database.ts`    | `files[]`, `scripts{}` match |
| Routing     | `packages/mcp/src/features/definitions/routing.ts`     | `files[]` exist              |
| State       | `packages/mcp/src/features/definitions/state.ts`       | `files[]` exist              |
| Forms       | `packages/mcp/src/features/definitions/forms.ts`       | `files[]` exist              |
| UI          | `packages/mcp/src/features/definitions/ui.ts`          | `files[]` exist              |
| Theming     | `packages/mcp/src/features/definitions/theming.ts`     | `files[]` exist              |
| I18n        | `packages/mcp/src/features/definitions/i18n.ts`        | `files[]` exist              |
| Mobile      | `packages/mcp/src/features/definitions/mobile.ts`      | `files[]` exist              |
| API         | `packages/mcp/src/features/definitions/api.ts`         | `files[]` exist              |
| Testing     | `packages/mcp/src/features/definitions/testing.ts`     | `files[]` exist              |
| Performance | `packages/mcp/src/features/definitions/performance.ts` | `files[]` exist              |
| DevTools    | `packages/mcp/src/features/definitions/devtools.ts`    | `files[]` exist              |

### Category 4: Generated Content

Check hardcoded values in generators match main app:

**`packages/mcp/src/utils/scaffold/generators.ts`**:

- Environment variable names match `src/lib/env.ts`

**`packages/mcp/src/utils/scaffold/claude-md/sections.ts`**:

- Hook names match exports from `src/hooks/index.ts`
- Component names match exports from `src/components/shared/index.ts`
- Import paths match actual file structure
- Test utility names match `src/test/index.ts`

### Category 5: Package.json Scripts

Verify scripts in feature definitions match `package.json`:

| Feature  | Scripts to Check                                        |
| -------- | ------------------------------------------------------- |
| Core     | `dev`, `build`, `preview`, `typecheck`                  |
| Database | `db:types`, `db:push`, `db:reset`, `db:studio`          |
| I18n     | `i18n:extract`                                          |
| Testing  | `test`, `test:watch`, `test:coverage`, `e2e`, `e2e:*`   |
| DevTools | `lint`, `lint:fix`, `format`, `format:check`, `prepare` |

## Analysis Process

For each changed file:

1. Identify which category it belongs to
2. Find the corresponding MCP file(s)
3. Read both files and compare relevant content
4. Report differences with specific line numbers

## Output Format

### Summary Table

| Status | Main App | MCP File | Category    | Issue       |
| ------ | -------- | -------- | ----------- | ----------- |
| ✅     | file     | mcp-file | Config      | In sync     |
| ⚠️     | file     | mcp-file | Feature Def | Minor drift |
| ❌     | file     | mcp-file | Generator   | Out of sync |

### Differences Found

For each out-of-sync file:

- **Files**: main app path → MCP path
- **What's different**: Description of the difference
- **Line numbers**: Where to look in each file
- **Recommended fix**: Specific change to make

### Recommended Actions

Numbered list of updates needed with exact file paths and line numbers.

## Maintenance

When making changes to the main app, also check:

1. **This command file** (`.claude/commands/mcp-sync.md`) - Update mappings if structure changes
2. **Feature definitions** - Add/remove files from `files[]` arrays
3. **sections.ts** - Update hardcoded hook/component names
4. **generators.ts** - Update environment variable lists
5. **Template files** - Keep config files in sync

## Notes

- This command is READ-ONLY (no modifications)
- Focus on structural/content differences, not formatting
- Skip individual source files in `src/` (too noisy, check via feature definitions)
