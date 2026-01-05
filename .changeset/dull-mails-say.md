---
'@react-spa-scaffold/mcp': minor
---

Add electron as scaffoldable feature

- New `electron` feature for desktop app support via Electron Forge + Vite
- Auto-includes `routing` dependency (for HashRouter support)
- Adds `generateGlobalDts()` for feature-aware type generation
- Includes electron scripts: `electron:dev`, `electron:build`, `electron:make`
- Adds CLAUDE.md section with electron-specific guidance
- Supports flat layout with files at `src/main.ts`, `src/preload.ts`
- macOS-only builders (DMG + ZIP)
