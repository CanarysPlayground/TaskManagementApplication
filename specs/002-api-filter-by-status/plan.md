# Implementation Plan: Extend Task Management API to Filter Tasks by Status

**Branch**: `002-api-filter-by-status` | **Date**: 2026-04-02 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-api-filter-by-status/spec.md`

## Summary

Extend the existing `GET /tasks` endpoint to accept an optional `status` query parameter (`pending` | `completed`). When provided, only tasks matching the given status are returned. When omitted, all tasks are returned (backward-compatible). Invalid values return `400 Bad Request`. The `filterTasks()` service function and `TaskFilter` model already exist; the primary work is adding test coverage and wiring any remaining validation in `server.ts`.

## Technical Context

**Language/Version**: TypeScript 5.3.3 / Node.js (ES2020 target)  
**Primary Dependencies**: Express 4.18.2, ts-node 10.9.2  
**Storage**: In-memory array (`tasks: Task[]` in `src/services/taskService.ts`) — no database  
**Testing**: Vitest 4.1.2 (`npm test` → `vitest run`) — no test files exist yet  
**Target Platform**: Local Node.js server (demo/development environment)  
**Project Type**: Web service (REST API) + React frontend (feature is server-side only)  
**Performance Goals**: Error responses in < 200ms (per SC-004 in spec)  
**Constraints**: Backward compatible — omitting `status` MUST return all tasks  
**Scale/Scope**: Demo-scale, single process; in-memory store resets on restart

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| I | **Component-First** | ✅ PASS | Feature is server-side only; no new UI components required |
| II | **TypeScript Everywhere** | ✅ PASS | All existing and new files are `.ts`; strict mode enabled |
| III | **Test-First (NON-NEGOTIABLE)** | ⚠️ REQUIRES ACTION | No test files exist. Tests for `filterTasks()` and `GET /tasks?status=` MUST be written before implementation tasks are executed |
| IV | **Separation of Concerns** | ✅ PASS | Filtering logic is in `src/services/taskService.ts`; validation is in `server.ts`; models in `src/models/task.ts` |
| V | **Simplicity & Maintainability** | ✅ PASS | `filterTasks()` and `TaskFilter` already exist; no new abstractions needed |

**Gate result**: PASS with condition — test files must be created as the first implementation task.

## Project Structure

### Documentation (this feature)

```text
specs/002-api-filter-by-status/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── get-tasks.md
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── models/
│   └── task.ts              # Existing — TaskFilter, Task, Status types
├── services/
│   └── taskService.ts       # Existing — filterTasks(), getAllTasks(), createTask()
server.ts                    # Existing — GET /tasks route with status validation

tests/
└── api/
    ├── filter-by-status.test.ts   # NEW — unit tests for filterTasks()
    └── get-tasks-route.test.ts    # NEW — integration tests for GET /tasks?status=
```

**Structure Decision**: Single-project layout (web service). No structural changes to existing directories. New `tests/api/` directory added following vitest conventions.

## Complexity Tracking

> No constitution violations requiring justification.
