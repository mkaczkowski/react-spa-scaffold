---
name: tdd-workflow
description: Test-Driven Development guidance. Use during feature-dev Phase 5 (Implementation) or any code implementation. Ensures tests are written BEFORE implementation code, following Red-Green-Refactor cycle.
---

# TDD Workflow

## CRITICAL: Tests First

During implementation, you MUST write tests before writing implementation code. This is non-negotiable.

## The Red-Green-Refactor Cycle

### RED: Write Failing Test

1. Write a test for ONE piece of expected behavior
2. Run the test - it MUST fail
3. Verify it fails for the RIGHT reason (not syntax error, not import error)
4. The failing test defines what you're about to implement

### GREEN: Make It Pass

1. Write MINIMAL code to make the test pass
2. Don't over-engineer - just make it work
3. Hardcoding is acceptable temporarily
4. The goal is a passing test, not perfect code

### REFACTOR: Clean Up

1. Only refactor AFTER tests pass
2. Remove duplication
3. Improve naming
4. Run tests after EACH refactor change
5. If tests fail, undo the refactor

## Rules

- NEVER write implementation before tests
- One test at a time - don't write all tests upfront
- Keep tests focused and isolated
- Each test should test ONE behavior
- Use descriptive test names that explain the expected behavior

## Testing Documentation

For test patterns, utilities, and conventions, reference:

- [docs/TESTING.md](../../../docs/TESTING.md) - Unit test patterns, MSW mocking, coverage
- [docs/E2E_TESTING.md](../../../docs/E2E_TESTING.md) - Playwright E2E patterns

Key points from project testing standards:

- Tests go in `tests/unit/` mirroring `src/` structure
- Use `render` from `@/test` (not @testing-library directly)
- 80% coverage required

## Integration with feature-dev

During Phase 5 (Implementation):

1. Before writing any component/hook/util, write its test first
2. Verify test fails (RED)
3. Then implement the code
4. Verify test passes (GREEN)
5. Refactor if needed
6. Repeat for next piece of functionality

## Common Mistakes to Avoid

1. Writing implementation first, then tests (defeats the purpose)
2. Writing all tests before any implementation (too much upfront)
3. Not running tests after each change
4. Writing tests that don't fail initially
5. Over-engineering during the GREEN phase
