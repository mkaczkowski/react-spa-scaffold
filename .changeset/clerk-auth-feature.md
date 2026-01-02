---
'@react-spa-scaffold/mcp': minor
---

feat(auth): add Clerk authentication with modal sign-in

- Add ClerkThemeProvider with shadcn theme integration and dark mode support
- Create AccountButton component for header (sign-in modal / user dropdown)
- Create ProtectedRoute wrapper for authenticated routes
- Add comprehensive test mocks for @clerk/react-router
- Update MCP package with auth feature definition for scaffolding
- Update generators for VITE_CLERK_PUBLISHABLE_KEY env variable
