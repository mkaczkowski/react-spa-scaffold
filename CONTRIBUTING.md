# Contributing to react-spa-scaffold

Thank you for your interest in contributing to react-spa-scaffold! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Releasing](#releasing)

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/react-spa-scaffold.git
   cd react-spa-scaffold
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/mkaczkowski/react-spa-scaffold.git
   ```

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates.

When filing an issue, include:

- A clear, descriptive title
- Steps to reproduce the behavior
- Expected vs actual behavior
- Your environment (OS, Node.js version, browser)
- Screenshots if applicable

### Suggesting Features

Feature requests are welcome! Please:

- Check if the feature has already been requested
- Provide a clear use case
- Explain why this feature would benefit the project

### Submitting Changes

1. Create a feature branch from `master`
2. Make your changes
3. Write/update tests as needed
4. Ensure all tests pass
5. Submit a pull request

## Development Setup

### Prerequisites

- Node.js >= 22.0.0 (check `.nvmrc`)
- npm >= 10.0.0

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Build for production
npm run build
```

### Project Structure

```
react-spa-scaffold/
├── src/                    # Main React application
├── packages/               # Monorepo packages
│   ├── mcp/               # MCP server (@react-spa-scaffold/mcp)
│   ├── eslint-config/     # Shared ESLint config
│   ├── prettier-config/   # Shared Prettier config
│   └── tsconfig/          # Shared TypeScript configs
├── tests/unit/            # Unit tests (Vitest)
├── e2e/                   # E2E tests (Playwright)
└── docs/                  # Documentation
```

## Code Standards

This project follows strict coding standards. Please review:

- [CLAUDE.md](CLAUDE.md) - AI assistant guidance and quick reference
- [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md) - Code patterns
- [docs/COMPONENT_GUIDELINES.md](docs/COMPONENT_GUIDELINES.md) - Component design

### Key Points

- Use TypeScript for all new code
- Use `@/` path alias for imports
- Use `type` for unions, `interface` for objects
- All user-facing text must use i18n with translator comments
- Components use named exports; pages use default exports

### Linting & Formatting

```bash
# Check linting
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## Commit Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Commits are enforced by commitlint.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting (no code change)
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `test`: Adding/updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```bash
feat(auth): add OAuth2 login support
fix(api): handle timeout errors gracefully
docs(readme): update installation instructions
refactor(hooks): simplify useAuth implementation
```

## Pull Request Process

1. **Update your fork**:

   ```bash
   git fetch upstream
   git rebase upstream/master
   ```

2. **Create a branch**:

   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Make your changes** and commit using conventional commits

4. **Run quality checks**:

   ```bash
   npm run lint
   npm run typecheck
   npm test
   npm run build
   ```

5. **Push and create PR**:

   ```bash
   git push origin feat/your-feature-name
   ```

6. **Fill out the PR template** with:
   - Summary of changes
   - Type of change (feature, fix, etc.)
   - Testing performed
   - Checklist completion

### PR Review Criteria

- All CI checks pass
- Code follows project conventions
- Tests cover new functionality
- Documentation updated if needed
- No decrease in test coverage

## Releasing

> Note: Releases are managed by maintainers.

### Version Bumping

This project uses semantic versioning. Update versions in:

- Root `package.json`
- Individual package `package.json` files
- `CHANGELOG.md`

### Publishing Packages

```bash
# Build all packages
npm run build -ws

# Publish packages (maintainers only)
npm publish -w @react-spa-scaffold/mcp
npm publish -w @react-spa-scaffold/eslint-config
npm publish -w @react-spa-scaffold/prettier-config
npm publish -w @react-spa-scaffold/tsconfig
```

---

Thank you for contributing!
