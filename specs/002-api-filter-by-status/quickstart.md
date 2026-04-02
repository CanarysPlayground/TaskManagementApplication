# Quickstart: Task Filtering by Status

**Feature**: `002-api-filter-by-status`  
**Date**: 2026-04-02

---

## Prerequisites

- Node.js 18+
- Dependencies installed: `npm install`

---

## Start the API server

```powershell
npm run dev:api
# Server starts on http://localhost:3001
```

---

## Try the filter

### Return only pending tasks

```bash
curl "http://localhost:3001/tasks?status=pending"
```

Expected response:
```json
{
  "count": 3,
  "tasks": [
    { "id": "...", "title": "...", "status": "pending", "priority": "High", "createdAt": "..." },
    ...
  ]
}
```

### Return only completed tasks

```bash
curl "http://localhost:3001/tasks?status=completed"
```

### Return all tasks (no filter — backward compatible)

```bash
curl "http://localhost:3001/tasks"
```

### Invalid status (expect 400)

```bash
curl "http://localhost:3001/tasks?status=done"
# Response: { "error": "status must be one of: pending, completed." }
```

---

## Run the tests

```powershell
npm test
```

All tests in `tests/api/` should pass.

---

## Key files

| File | Purpose |
|------|---------|
| `server.ts` | Express route — validates `status` param, calls `filterTasks()` |
| `src/services/taskService.ts` | `filterTasks(filter)` — core filter logic |
| `src/models/task.ts` | `Task`, `Status`, `TaskFilter` type definitions |
| `tests/api/filter-by-status.test.ts` | Unit tests for `filterTasks()` |
| `tests/api/get-tasks-route.test.ts` | Route-level tests for `GET /tasks?status=` |
