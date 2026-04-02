# Research: Extend Task Management API to Filter Tasks by Status

**Feature**: `002-api-filter-by-status`  
**Date**: 2026-04-02  
**Status**: Complete — all NEEDS CLARIFICATION resolved

---

## Decision 1: Existing Implementation Coverage

**Decision**: The core filtering logic (`filterTasks()`, `TaskFilter`, status validation in `server.ts`) already exists in the codebase. This feature's primary work is adding test coverage and verifying correctness.

**Rationale**: Code audit of `src/services/taskService.ts`, `src/models/task.ts`, `server.ts`, and `src/services/taskApiService.ts` shows:
- `filterTasks(filter: TaskFilter)` already filters by both `status` and `priority` in `taskService.ts`
- `GET /tasks` in `server.ts` already accepts and validates `status` query parameter, returning `400` for invalid values and calling `filterTasks()`
- `fetchTasks(filter?)` in `taskApiService.ts` already appends `status` to the request URL
- `TaskFilter` interface in `models/task.ts` already defines optional `status` and `priority` fields

**Alternatives considered**: Building filtering from scratch — rejected because the logic already exists and is functionally correct.

---

## Decision 2: No New Dependencies Required

**Decision**: No new npm packages are needed. Vitest (already installed as `vitest@4.1.2`) provides the test framework.

**Rationale**: The project already has vitest in `devDependencies` and `npm test` runs `vitest run`. Express and TypeScript cover all route and validation needs. Supertest could be added for HTTP-level integration tests but is not strictly required — `filterTasks()` can be unit-tested directly.

**Alternatives considered**:
- `supertest` for HTTP integration tests — optional enhancement, not required for this feature scope
- `jest` — rejected, vitest is already configured

---

## Decision 3: Case-Insensitive Status Normalisation

**Decision**: The `server.ts` route normalises `status` to lowercase via `String(status).toLowerCase()` before validation. This satisfies FR-007 (case-insensitive filtering).

**Rationale**: `'Pending'.toLowerCase() === 'pending'` — simple, no extra logic needed. The `Status` type uses lowercase values (`pending` | `completed`), so the normalisation maps directly.

**Alternatives considered**: Storing mixed-case values — rejected as it complicates comparisons throughout the codebase.

---

## Decision 4: Test Structure

**Decision**: Tests reside in `tests/api/` at the repository root. Two test files:
1. `filter-by-status.test.ts` — unit tests for `filterTasks()` service function
2. `get-tasks-route.test.ts` — integration-style tests for the Express route handler

**Rationale**: Vitest supports both styles. Unit tests run fastest and cover the filter logic directly. Route tests validate the HTTP contract (status codes, response shape, query param parsing). Keeping them in `tests/api/` follows the project's planned single-project structure from `plan.md`.

**Alternatives considered**: Placing tests in `src/` alongside source — rejected to maintain separation of concerns (Constitution Principle IV).

---

## Decision 5: Backward Compatibility

**Decision**: No changes to the `GET /tasks` response schema. When `status` is omitted, `filterTasks({})` is called with an empty filter, which returns all tasks — identical to the current `getAllTasks()` behaviour.

**Rationale**: `filterTasks` with no filter properties returns `true` for every task in the `Array.filter()` predicate, functionally equivalent to returning `tasks` without filtering.

**Alternatives considered**: Keeping `getAllTasks()` for the no-filter path — acceptable but redundant; `filterTasks({})` is equivalent and avoids dual code paths.

---

## Summary of Resolved Unknowns

| Unknown | Resolution |
|---------|-----------|
| Is filtering already implemented? | Yes — `filterTasks()` and route validation exist |
| What test framework to use? | Vitest (already installed) |
| Where do tests live? | `tests/api/` at project root |
| Is case-insensitive normalisation needed? | Yes — already done in `server.ts` |
| Does omitting `status` break anything? | No — `filterTasks({})` returns all tasks |
</content>
</invoke>