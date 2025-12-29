# Feature Development

Guided feature development with codebase understanding, architecture design, and TDD implementation.

## How to Use

```
/feature-dev {feature description}
```

---

## Phase 1: Understand

**Goal**: Understand requirements and existing codebase patterns

### 1.1 Clarify Requirements

If the feature is unclear, ask:

- What problem is being solved?
- What should the feature do?
- Any constraints (performance, compatibility)?

### 1.2 Explore Codebase

**Discovery**:

- Find entry points (components, hooks, API routes)
- Locate core implementation files
- Map feature boundaries

**Flow Tracing**:

- Follow call chains from UI to data
- Trace data transformations
- Identify dependencies

**Architecture Analysis**:

- Map abstraction layers (UI → logic → data)
- Identify design patterns in use
- Note cross-cutting concerns (auth, i18n)

### 1.3 Output

Present findings with **file:line references**:

```
## Codebase Analysis

### Entry Points
- src/pages/[Page].tsx:[line] - Route component
- src/hooks/use[Feature].ts:[line] - Feature hook

### Patterns Found
- State management: [describe pattern found]
- UI components: [describe pattern found]
- Data fetching: [describe pattern found]

### Key Files
1. [file path] - [why it's relevant]
2. [file path] - [why it's relevant]
3. [file path] - [create/modify]
```

---

## Phase 2: Design

**Goal**: Design the implementation approach

### 2.1 Architecture Decision

Based on codebase patterns:

- What components/hooks/utils to create?
- What existing code to reuse?
- Where does state live?
- How does data flow through the feature?

### 2.2 File Plan

List specific files with responsibilities:

```
CREATE: src/hooks/use[Feature].ts
  - [responsibility 1]
  - [responsibility 2]

CREATE: src/components/[Feature].tsx
  - [responsibility 1]
  - [responsibility 2]

MODIFY: src/pages/[Page].tsx
  - [what changes]

CREATE: src/hooks/use[Feature].test.ts
```

### 2.3 Get Approval

Present to user:

- What will be built
- Key design decisions and trade-offs
- Files affected

**Wait for approval before implementing.**

---

## Phase 3: Implement

**Goal**: Build the feature using TDD

### TDD Cycle (Red-Green-Refactor)

For each piece of functionality:

**RED** - Write a failing test first

```typescript
it('should [expected behavior]', () => {
  // Arrange
  const { result } = renderHook(() => useFeature());

  // Act
  act(() => result.current.doSomething());

  // Assert
  expect(result.current.value).toBe(expectedValue);
});
```

Run test - it MUST fail.

**GREEN** - Write minimal code to pass

```typescript
export function useFeature() {
  const [value, setValue] = useState(initialValue);
  const doSomething = () => setValue(newValue);
  return { value, doSomething };
}
```

Run test - it should pass.

**REFACTOR** - Clean up while tests stay green.

### Implementation Rules

- Tests co-located with source files (e.g., `Button.tsx` + `Button.test.tsx`)
- Use `@/` import alias
- Named exports + Props interface for components
- Translator comments on all user-facing text
- 80% coverage required

---

## Phase 4: Review & Complete

**Goal**: Ensure quality and wrap up

### 4.1 Self-Review

Check implementation for:

| Category       | Check For                                                |
| -------------- | -------------------------------------------------------- |
| **Bugs**       | Logic errors, null handling, edge cases, race conditions |
| **Guidelines** | Import patterns, component patterns, translations        |
| **Quality**    | Duplication, error handling, accessibility               |
| **Security**   | Input validation, XSS, injection                         |

### 4.2 Run Quality Checks

```bash
npm run lint        # No lint errors
npm run typecheck   # No type errors
npm run build       # Builds successfully
npm run test        # Tests pass
```

**Output format**:

```
Quality Check Results:

[PASS] Lint - No lint errors
[PASS] TypeScript - No type errors
[PASS] Build - Production build successful
[PASS] Tests - X tests passed

All checks passed. Ready to commit.
```

On failure, fix the issue before proceeding.

### 4.3 Summary

Report:

- What was built
- Key decisions made
- Files modified
- Suggested next steps

---

## Quick Reference

| Phase         | Goal                | Key Output                         |
| ------------- | ------------------- | ---------------------------------- |
| 1. Understand | Know codebase       | File:line analysis, patterns found |
| 2. Design     | Plan implementation | File plan with responsibilities    |
| 3. Implement  | Build with TDD      | Working code with tests            |
| 4. Review     | Ensure quality      | All checks pass, summary           |
