# Data Model: Extend Task Management API to Filter Tasks by Status

**Feature**: `002-api-filter-by-status`  
**Date**: 2026-04-02  
**Source**: `src/models/task.ts`

---

## Entities

### Task *(existing — no changes)*

Represents a unit of work tracked in the application.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` (UUID v4) | Yes | Unique identifier, auto-generated on creation |
| `title` | `string` | Yes | Human-readable task description; must be non-empty |
| `status` | `Status` | Yes | Lifecycle state of the task; defaults to `pending` on creation |
| `priority` | `Priority` | Yes | Urgency level; defaults to `Medium` on creation |
| `createdAt` | `string` (ISO 8601) | Yes | Timestamp of creation, auto-set on creation |

### Status *(existing — no changes)*

Enumerated string union representing the lifecycle state of a task.

| Value | Meaning |
|-------|---------|
| `pending` | Task has not yet been completed |
| `completed` | Task has been marked as done |

**Validation rule**: The API MUST reject any value that is not in this set (after lowercase normalisation).

### Priority *(existing — no changes)*

Enumerated string union for task urgency.

| Value | Meaning |
|-------|---------|
| `Low` | Low urgency |
| `Medium` | Default urgency |
| `High` | High urgency |

### TaskFilter *(existing — no changes)*

Represents optional filtering criteria passed to `filterTasks()`. All fields are optional; omitting a field means "no filter on that attribute".

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | `Status` | No | When set, only tasks with this status are returned |
| `priority` | `Priority` | No | When set, only tasks with this priority are returned |

---

## Filter Logic

```
filterTasks(filter: TaskFilter): Task[]
  For each task in the in-memory store:
    if filter.status is set AND task.status != filter.status -> exclude
    if filter.priority is set AND task.priority != filter.priority -> exclude
    otherwise -> include
  Return included tasks
```

This logic is already implemented in `src/services/taskService.ts`.

---

## Validation Rules

| Input | Rule | Error Response |
|-------|------|----------------|
| `status` query param | Must be `pending` or `completed` (case-insensitive) | `400 Bad Request` with human-readable error |
| `status` absent | No filter applied; all tasks returned | N/A — normal response |

---

## State Transitions

This feature does not introduce new state transitions. Task status is set to `pending` at creation and can be changed to `completed` via existing update operations (out of scope for this feature).

---

## No Schema Changes Required

All types (`Task`, `Status`, `Priority`, `TaskFilter`) are defined in `src/models/task.ts` and require no modification for this feature.
