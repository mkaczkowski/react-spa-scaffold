---
description: Pre-commit quality validation gate
---

# Pre-Commit Quality Check

Run all quality checks before committing.

## Checks (in order)

1. **Tests**: `npm run test`
2. **TypeScript**: `npm run typecheck`
3. **Lint**: `npm run lint`
4. **Build**: `npm run build`

## Behavior

- Run each check in sequence
- Report each check result clearly (PASS/FAIL)
- On failure, identify the issue and suggest fix
- Stop on first failure - no need to run remaining checks
- Only allow commit if ALL checks pass

## Output Format

```
Quality Check Results:

[PASS] Tests - X tests passed
[PASS] TypeScript - No type errors
[PASS] Lint - No lint errors
[PASS] Build - Production build successful

All checks passed. Ready to commit.
```

Or on failure:

```
Quality Check Results:

[PASS] Tests - X tests passed
[FAIL] TypeScript - 3 type errors found

Issue: src/components/Example.tsx:15 - Type 'string' is not assignable to type 'number'

Fix the TypeScript errors before committing.
```

## After All Pass

Confirm ready for commit and ask user for commit message.
