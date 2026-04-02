---
description: "Task list for feature: Extend Task Management API to Filter Tasks by Status"
---

# Tasks: Extend Task Management API to Filter Tasks by Status

**Input**: Design documents from `/specs/002-api-filter-by-status/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Included — mandated by Constitution Principle III (Test-First NON-NEGOTIABLE). No test files exist yet in this project.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

> **⚠️ Research finding**: The implementation (`filterTasks()`, `TaskFilter`, route validation in `server.ts`) already exists.  
> The primary deliverable of this feature is **test coverage**. Each story's test tasks MUST be written first, run to confirm they pass, then the implementation verified against them.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label (US1, US2, US3)
- All paths are relative to the repository root

---

## Phase 1: Setup

**Purpose**: Create the test directory structure so vitest can discover tests

- [X] T001 Create `.gitignore` with Node.js/TypeScript patterns at repository root *(adapted: no tests per user constraints — .gitignore created instead)*

---

## Phase 2: Foundational

**Purpose**: Confirm existing building blocks are correct before writing tests against them

> No new source files required. `filterTasks()`, `TaskFilter`, and route validation already exist (see research.md). This phase is a verification checkpoint only.

- [X] T002 Verify `src/models/task.ts` exports `Task`, `Status`, `TaskFilter` types correctly and are importable in test files
- [X] T003 Verify `src/services/taskService.ts` exports `filterTasks()` as a named, directly importable function (no server dependency)

**Checkpoint**: Foundation confirmed — user story test and implementation work can now begin

---

## Phase 3: User Story 1 — Filter Tasks by Status (Priority: P1) 🎯 MVP

**Goal**: `GET /tasks?status=pending` returns only pending tasks; `GET /tasks?status=completed` returns only completed tasks.

**Independent Test**: `npm test` passes all tests in `tests/api/filter-by-status.test.ts` and the `status filter` describe block of `tests/api/get-tasks-route.test.ts` without requiring US2 or US3 tasks to be complete.

### Tests for User Story 1 ⚠️ Write FIRST — must FAIL before implementation is verified

- [ ] T004 [P] [US1] Create unit tests for `filterTasks()` with status filtering in `tests/api/filter-by-status.test.ts` — cover: `filterTasks({ status: 'pending' })` returns only pending tasks; `filterTasks({ status: 'completed' })` returns only completed tasks; empty result when no tasks match
- [ ] T005 [P] [US1] Create route-level tests for `GET /tasks?status=` in `tests/api/get-tasks-route.test.ts` — cover: `status=pending` → 200 with only pending tasks; `status=completed` → 200 with only completed tasks; response always includes `count` field equal to `tasks.length`

### Implementation verification for User Story 1

- [X] T006 [US1] Verified `filterTasks()` logic in `src/services/taskService.ts` — correct, no fixes needed. `tsc --noEmit` passes cleanly.
- [X] T007 [US1] Verified `server.ts` GET /tasks route — status validation, normalisation, `filterTasks()` call, and `count` response all correct. No fixes needed.

**Checkpoint**: US1 complete — `GET /tasks?status=pending` and `GET /tasks?status=completed` both work and are covered by passing tests

---

## Phase 4: User Story 2 — Return All Tasks When No Filter Applied (Priority: P2)

**Goal**: `GET /tasks` with no `status` param returns all tasks, preserving backward compatibility.

**Independent Test**: Add backward-compat tests to existing test files and run `npm test` — passes without any changes to source files (backward compat is already implemented via `filterTasks({})`).

### Tests for User Story 2 ⚠️ Write FIRST — must FAIL before implementation is verified

- [ ] T008 [US2] Add backward-compat unit tests to `tests/api/filter-by-status.test.ts` — cover: `filterTasks({})` returns all tasks regardless of status; `filterTasks({})` on empty store returns empty array

- [ ] T009 [US2] Add backward-compat route tests to `tests/api/get-tasks-route.test.ts` — cover: `GET /tasks` (no params) returns all tasks; response `count` matches total task count; empty store returns `{ count: 0, tasks: [] }`

### Implementation verification for User Story 2

- [X] T010 [US2] Verified backward compat — `filterTasks({})` returns all tasks; omitting `status` param works correctly. No fixes needed.

**Checkpoint**: US2 complete — `GET /tasks` without params still returns all tasks; no regressions in US1 tests

---

## Phase 5: User Story 3 — Reject Invalid Status Values (Priority: P3)

**Goal**: `GET /tasks?status=done` (or any unrecognised value) returns `400 Bad Request` with a clear error message. Case-insensitive normalisation (`Pending` → `pending`) is accepted.

**Independent Test**: Add validation tests to `tests/api/get-tasks-route.test.ts` and run `npm test` — all validation tests pass without touching US1 or US2 test blocks.

### Tests for User Story 3 ⚠️ Write FIRST — must FAIL before implementation is verified

- [ ] T011 [US3] Add invalid-status tests to `tests/api/get-tasks-route.test.ts` — cover: `status=done` → 400 with error message containing valid values; `status=` (empty string) → 400; `status=123` → 400; error response body has `error` string field

- [ ] T012 [P] [US3] Add case-normalisation tests to `tests/api/get-tasks-route.test.ts` — cover: `status=Pending` → 200 (normalised to `pending`); `status=COMPLETED` → 200 (normalised to `completed`)

### Implementation verification for User Story 3

- [ ] T013 [US3] Run `npm test` and confirm all validation and normalisation tests pass — fix `server.ts` status validation block only if tests fail

**Checkpoint**: All three user stories complete and independently testable — full `npm test` suite passes

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and consistency checks across all stories

- [ ] T014 [P] Run full vitest suite (`npm test`) and confirm all tests in `tests/api/` pass with no failures or skips
- [ ] T015 [P] Manually verify the quickstart scenarios in `specs/002-api-filter-by-status/quickstart.md` against the running server (`npm run dev:api`) — confirm all curl examples return expected responses

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — verifies existing files before tests are written
- **US1 (Phase 3)**: Depends on Phase 2 — T004/T005 can start in parallel; T006/T007 depend on T004/T005
- **US2 (Phase 4)**: Depends on Phase 2 — can start after Phase 2 independently of US1
- **US3 (Phase 5)**: Depends on Phase 2 — can start after Phase 2 independently of US1 and US2
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends only on Phase 2 — no dependencies on US2 or US3
- **US2 (P2)**: Depends only on Phase 2 — no dependencies on US1 or US3
- **US3 (P3)**: Depends only on Phase 2 — no dependencies on US1 or US2

### Within Each User Story

1. Tests MUST be written first (T004/T005 before T006/T007, etc.)
2. Run tests and expect them to pass (implementation already exists)
3. Fix source files only if tests fail
4. Story complete when `npm test` passes for that story's tests

### Parallel Opportunities

- T004 and T005 can run in parallel (different files: `filter-by-status.test.ts` vs `get-tasks-route.test.ts`)
- T008 and T009 can run in parallel (different describe-blocks in different files, both are additive)
- T011 and T012 can run in parallel (both add to `get-tasks-route.test.ts` but in different describe-blocks)
- T014 and T015 can run in parallel (npm test + manual verification are independent)
- After Phase 2: US1, US2, and US3 phases can be executed in parallel by different team members

---

## Parallel Example: User Story 1

```text
# After Phase 2 checkpoint — launch these in parallel:
Task T004: "Create unit tests for filterTasks() in tests/api/filter-by-status.test.ts"
Task T005: "Create route-level tests for GET /tasks?status= in tests/api/get-tasks-route.test.ts"

# Once both test files exist, verify in sequence:
Task T006: "Run npm test — confirm filterTasks() unit tests pass"
Task T007: "Run npm test — confirm route tests pass"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002, T003)
3. Complete Phase 3: User Story 1 (T004–T007)
4. **STOP and VALIDATE**: `npm test` — all US1 tests green
5. Demo: `curl "http://localhost:3001/tasks?status=pending"` returns only pending tasks

### Incremental Delivery

1. Setup + Foundational → baseline confirmed
2. US1 → `GET /tasks?status=` filtering works with test coverage (MVP!)
3. US2 → backward compat verified with tests (no regressions)
4. US3 → invalid input handling verified with tests
5. Polish → full suite green, quickstart confirmed

### Single-Developer Sequential Order

T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010 → T011 → T012 → T013 → T014 → T015

---

## Notes

- `[P]` tasks = different target files, no dependencies on incomplete tasks in same phase
- `[Story]` label maps each task to a specific user story for traceability
- The implementation (`filterTasks`, `TaskFilter`, route validation) already exists — primary work is test coverage
- Write tests first; if they pass immediately, that confirms the implementation is correct
- If a test fails, fix only the file named in the verification task — do not change test files to match broken implementations
- Commit after each user story phase is complete and `npm test` is green
