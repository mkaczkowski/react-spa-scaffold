---
description: Setup for TDD feature implementation
argument-hint: Feature description to implement
---

# TDD Feature Implementation Setup

## Feature to Implement

$ARGUMENTS

---

## Step 1: Create Task Branch

```bash
git checkout -b claude/implement-$(date +%s | tail -c 5)
```

---

## Step 2: Run Feature Dev with TDD

Now run the following command to start implementation:

```
/feature-dev:feature-dev $ARGUMENTS

IMPORTANT: During Phase 5 (Implementation), follow TDD strictly:
- Write failing tests BEFORE implementation code
- Follow Red-Green-Refactor cycle
- Place tests in tests/unit/ mirroring src/
- Reference docs/TESTING.md for test patterns
```

---

## Step 3: After Feature Dev Completes

Run quality checks before committing:

```
/workflow/check
```

This runs: tests → typecheck → lint → build

---

## Step 4: Commit

If all checks pass, create a conventional commit.

---

## TDD Reference

The `tdd-workflow` skill provides guidance:

- RED: Write failing test first
- GREEN: Minimal code to pass
- REFACTOR: Clean up (tests stay green)
