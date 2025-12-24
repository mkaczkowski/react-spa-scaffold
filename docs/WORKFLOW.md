# Workflow Commands

Custom commands to support TDD feature development.

## Commands

### /implement

**Purpose**: Setup for TDD feature implementation.

**Usage**:

```
/implement <feature description>
```

**What it does**:

1. Creates a task branch
2. Provides instructions to run `/feature-dev` with TDD context
3. Reminds you to run `/check` before committing

**Note**: This is a setup command. You'll manually run `/feature-dev` with the TDD instructions provided.

### /check

**Purpose**: Pre-commit quality validation.

**Usage**:

```
/check
```

**Runs**:

1. `npm run test` - All tests must pass
2. `npm run typecheck` - No TypeScript errors
3. `npm run lint` - No lint errors
4. `npm run build` - Build must succeed

### /feature-dev

**Purpose**: Full guided feature development (plugin command).

**Usage**:

```
/feature-dev:feature-dev <feature description>
```

**7 Phases**:

1. Discovery - Understand requirements
2. Codebase Exploration - Find patterns
3. Clarifying Questions - Resolve ambiguities
4. Architecture Design - Plan approach
5. Implementation - Build the feature
6. Quality Review - Check code quality
7. Summary - Document what was built

## TDD Workflow

The `tdd-workflow` skill (`.claude/skills/tdd-workflow/SKILL.md`) provides TDD guidance.

### Red-Green-Refactor

1. **RED**: Write failing test first
2. **GREEN**: Minimal code to pass
3. **REFACTOR**: Clean up (tests stay green)

### Test Location

Tests go in `tests/unit/` mirroring `src/`:

| Source                      | Test                                    |
| --------------------------- | --------------------------------------- |
| `src/hooks/useAuth.ts`      | `tests/unit/hooks/useAuth.test.ts`      |
| `src/components/Button.tsx` | `tests/unit/components/Button.test.tsx` |

### Test Patterns

See [docs/TESTING.md](TESTING.md) for detailed patterns.

## Typical Workflow

```
1. /implement Add user authentication
   → Creates branch, shows TDD instructions

2. /feature-dev:feature-dev Add user authentication
   → Follow the 7 phases
   → During Phase 5, apply TDD (tests first)

3. /check
   → Verify all quality gates pass

4. Commit
   → Create conventional commit
```

## File Structure

```
.claude/
├── commands/
│   ├── implement/implement.md   # /implement
│   └── quality/check.md         # /check
├── skills/
│   └── tdd-workflow/SKILL.md    # TDD guidance
└── settings.local.json          # Permissions
```
