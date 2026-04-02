# API Contract: GET /tasks

**Feature**: `002-api-filter-by-status`  
**Date**: 2026-04-02  
**Status**: Existing endpoint — extended with `status` filter parameter

---

## Endpoint

```
GET /tasks
```

---

## Query Parameters

| Parameter | Type | Required | Allowed Values | Description |
|-----------|------|----------|----------------|-------------|
| `status` | string | No | `pending`, `completed` (case-insensitive) | Filter tasks by lifecycle status. Omit to return all tasks. |
| `priority` | string | No | `Low`, `Medium`, `High` (case-insensitive) | Filter tasks by priority (pre-existing parameter, unchanged). |

### Notes
- Parameters are independent and combinable.
- Unrecognised query parameters are silently ignored.
- When `status` is omitted, all tasks are returned regardless of status (backward-compatible).

---

## Response

### 200 OK — Tasks returned

```json
{
  "count": 2,
  "tasks": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Write unit tests",
      "status": "pending",
      "priority": "High",
      "createdAt": "2026-04-02T10:00:00.000Z"
    },
    {
      "id": "661f9511-f30c-52e5-b827-557766551111",
      "title": "Update README",
      "status": "pending",
      "priority": "Low",
      "createdAt": "2026-04-02T11:00:00.000Z"
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `count` | number | Total number of tasks in this response (matches `tasks.length`) |
| `tasks` | Task[] | Array of task objects matching the filter criteria |

### Task object fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID v4) | Unique task identifier |
| `title` | string | Task description |
| `status` | `"pending"` \| `"completed"` | Current lifecycle status |
| `priority` | `"Low"` \| `"Medium"` \| `"High"` | Task urgency |
| `createdAt` | string (ISO 8601) | Creation timestamp |

### 200 OK — Empty result (no tasks match filter)

```json
{
  "count": 0,
  "tasks": []
}
```

### 400 Bad Request — Invalid `status` value

```json
{
  "error": "status must be one of: pending, completed."
}
```

---

## Examples

### Filter by status

```
GET /tasks?status=pending
→ 200 { "count": N, "tasks": [...only pending tasks...] }

GET /tasks?status=completed
→ 200 { "count": N, "tasks": [...only completed tasks...] }

GET /tasks?status=Pending
→ 200 { "count": N, "tasks": [...only pending tasks...] }  (normalised to lowercase)
```

### No filter (backward compatible)

```
GET /tasks
→ 200 { "count": N, "tasks": [...all tasks...] }
```

### Invalid value

```
GET /tasks?status=done
→ 400 { "error": "status must be one of: pending, completed." }

GET /tasks?status=
→ 400 { "error": "status must be one of: pending, completed." }
```

---

## Implementation Notes

- Validation is performed in `server.ts` before calling `filterTasks()`.
- `status` is normalised to lowercase via `String(status).toLowerCase()` before comparison.
- `filterTasks()` accepts a `TaskFilter` and returns the filtered in-memory task array.
- This contract is fully implemented in the existing codebase; this document formalises it.
