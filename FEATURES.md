# Task Manager Application — Feature Documentation

## Overview

The Task Manager Application is a full-stack TypeScript application that lets users create, view, and track tasks. It is built with React on the frontend and an Express.js REST API on the backend, and is designed as a clean, extensible demo of modern web development practices with GitHub Copilot.

---

## Table of Contents

1. [Feature Summary](#1-feature-summary)
2. [Task Model](#2-task-model)
3. [Backend API](#3-backend-api)
4. [Frontend Features](#4-frontend-features)
5. [Component Reference](#5-component-reference)
6. [Custom Hooks](#6-custom-hooks)
7. [Services](#7-services)
8. [Seed Data](#8-seed-data)
9. [Styling and UI](#9-styling-and-ui)
10. [Architecture](#10-architecture)
11. [Running the Application](#11-running-the-application)

---

## 1. Feature Summary

| Feature | Status | Details |
|---|---|---|
| View all tasks | ✅ Implemented | Fetched from REST API on page load |
| Create a task | ✅ Implemented | POST `/tasks` with title and optional priority |
| Task priority levels | ✅ Implemented | Low, Medium, High — color-coded badges |
| Task status tracking | ✅ Implemented | Pending (🟠) and Completed (🟢) indicators |
| Loading state | ✅ Implemented | Shown while tasks are being fetched |
| Empty state | ✅ Implemented | Shown when no tasks exist |
| Error state with retry | ✅ Implemented | Shown when the API call fails |
| Manual refresh | ✅ Implemented | Refresh button in the page header |
| Seed/demo data | ✅ Implemented | 108 realistic pre-populated tasks |
| Filter by status/priority | 🔄 Architecture ready | Data model and types in place |
| Update / delete tasks | 🔄 Planned | Future feature |
| User authentication | ❌ Out of scope | — |

---

## 2. Task Model

Every task is represented by the `Task` interface defined in `src/models/task.ts`.

```typescript
type Priority = 'Low' | 'Medium' | 'High';
type Status   = 'pending' | 'completed';

interface Task {
  id        : string;   // UUID, generated on creation
  title     : string;   // Human-readable task name
  status    : Status;   // 'pending' | 'completed'
  priority  : Priority; // 'Low' | 'Medium' | 'High'
  createdAt : string;   // ISO 8601 timestamp
}
```

When creating a task, the request body uses `CreateTaskBody`:

```typescript
interface CreateTaskBody {
  title    : string;
  priority?: Priority; // Optional; defaults to 'Medium'
}
```

---

## 3. Backend API

The Express.js server (`server.ts`) exposes the following REST endpoints on **port 3001**. The Vite development server proxies all `/tasks` requests to this port automatically.

### GET /tasks

Returns every task currently in the in-memory store.

**Response**

```json
{
  "count": 108,
  "tasks": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "title": "Define project scope",
      "status": "completed",
      "priority": "High",
      "createdAt": "2026-03-01T00:00:00.000Z"
    }
  ]
}
```

### POST /tasks

Creates a new task and appends it to the in-memory store.

**Request body**

```json
{
  "title": "Write unit tests",
  "priority": "High"
}
```

**Response** — the created task object (HTTP 201)

```json
{
  "id": "b9d4e671-...",
  "title": "Write unit tests",
  "status": "pending",
  "priority": "High",
  "createdAt": "2026-04-02T07:00:00.000Z"
}
```

**Validation errors** (HTTP 400)

| Condition | Message |
|---|---|
| `title` missing or empty | `"Title is required and must be a non-empty string."` |
| `priority` not in allowed values | `"Priority must be one of: Low, Medium, High."` |

---

## 4. Frontend Features

### Task List

All tasks are displayed on the main page (`/`). Each task card shows:

- **Status dot** — orange for `pending`, green for `completed`
- **Title** — grey strikethrough applied when `completed`
- **Priority badge** — colour-coded pill (green / yellow / red)
- **Status text** — "Pending" or "Completed" aligned to the right

### Loading State

While the API request is in flight, a `"Loading tasks…"` message is displayed in place of the list so the user always has visual feedback.

### Empty State

When the API returns an empty task array, the message `"No tasks yet. Create one to get started."` is displayed.

### Error State with Retry

If the API call fails, an error message is shown together with a **Retry** button that triggers a fresh `fetchTasks()` call without a full page reload.

### Manual Refresh

A **Refresh** button in the page header allows the user to re-fetch the task list on demand. The button is disabled while a request is already in progress to prevent duplicate calls.

---

## 5. Component Reference

All components live under `src/components/` and `src/pages/`.

### `TasksPage` (`src/pages/TasksPage.tsx`)

Top-level page component. Renders the header with the **Refresh** button and delegates task rendering to `TaskList`. It consumes the `useTasks` custom hook to obtain `{ tasks, loading, error, reload }`.

### `TaskList` (`src/components/TaskList.tsx`)

Container component responsible for conditional rendering:

| Condition | Rendered Component |
|---|---|
| `loading === true` | `<TaskListLoading />` |
| `error !== null` | `<TaskListError />` |
| `tasks.length === 0` | `<TaskListEmpty />` |
| Otherwise | Maps `tasks` to `<TaskItem />` instances |

### `TaskItem` (`src/components/TaskItem.tsx`)

Presentational component for a single task card. Receives a `Task` object as a prop and renders the status dot, title, priority badge, and status label.

### `TaskListLoading` (`src/components/TaskListLoading.tsx`)

Displays a `"Loading tasks…"` placeholder while data is being fetched.

### `TaskListEmpty` (`src/components/TaskListEmpty.tsx`)

Displays a `"No tasks yet. Create one to get started."` call-to-action when the task list is empty.

### `TaskListError` (`src/components/TaskListError.tsx`)

Displays the error message and a **Retry** button. Calls the `onRetry` callback passed down from `TasksPage` when clicked.

---

## 6. Custom Hooks

### `useTasks` (`src/hooks/useTasks.ts`)

Encapsulates all data-fetching logic for tasks. Returns:

```typescript
{
  tasks  : Task[];          // Array of fetched tasks
  loading: boolean;         // True while the request is in flight
  error  : string | null;   // Error message, or null if no error
  reload : () => void;      // Call to re-fetch tasks
}
```

**Behaviour**

- Calls `fetchTasks()` on mount and whenever `reload()` is invoked.
- Uses an `isCancelled` flag to prevent state updates after the component unmounts.
- Resets `error` to `null` and sets `loading: true` at the start of each request.

---

## 7. Services

### `taskApiService` (`src/services/taskApiService.ts`)

Client-side API wrapper. Exports:

```typescript
fetchTasks(): Promise<Task[]>
```

- Makes a `GET /tasks` request via the browser `fetch` API.
- Throws a descriptive `Error` if the response status is not OK.
- Parses the `{ count, tasks }` envelope and returns the `tasks` array.

### `taskService` (`src/services/taskService.ts`)

Server-side business logic. Exports:

```typescript
getAllTasks(): Task[]
createTask(body: CreateTaskBody): Task
```

- Maintains an **in-memory task store** initialised with seed data on server start.
- `createTask` generates a UUID, sets `status` to `"pending"`, defaults `priority` to `"Medium"`, and stamps `createdAt` with the current UTC time.

---

## 8. Seed Data

`src/services/taskSeed.ts` generates **108 demo tasks** that are loaded into memory when the server starts. The seed tasks:

- Cover a realistic project-management workflow (requirements → design → development → QA → deployment → documentation).
- Cycle through all three priority levels: Low → Medium → High.
- Mark every fourth task as `"completed"` (~25%), leaving the rest `"pending"` (~75%).
- Span creation dates from 1 March 2026 through 17 June 2026.

---

## 9. Styling and UI

All styles are in `src/styles/tasks.css`, which uses **BEM-style class names** and plain CSS.

| Element | Class | Visual treatment |
|---|---|---|
| Page container | `.tasks-page` | Max-width 720 px, centred, responsive padding |
| Header | `.tasks-page__header` | Flex row, space-between alignment |
| Refresh button | `.tasks-page__refresh-btn` | Light border, hover background, disabled opacity |
| Task list | `.task-list` | Flex column, 0.5 rem gap |
| Task item | `.task-item` | Flex row, vertically centred |
| Status dot | `.task-item__dot` | 10 px circle — orange (`pending`) / green (`completed`) |
| Task title | `.task-item__title` | Flex-grow; `line-through` when completed |
| Priority badge | `.task-item__priority--low/medium/high` | Pill shape — green / yellow / red |
| Status text | `.task-item__status` | Right-aligned label |
| Loading/Empty/Error | `.task-list__message` | Grey italic; error text in red |

---

## 10. Architecture

```
┌─────────────────────────────────────────────┐
│               Browser (port 5173)           │
│                                             │
│  TasksPage                                  │
│    └─ useTasks (hook)                       │
│         └─ taskApiService.fetchTasks()      │
│    └─ TaskList                              │
│         ├─ TaskListLoading                  │
│         ├─ TaskListEmpty                    │
│         ├─ TaskListError (+ retry)          │
│         └─ TaskItem (×N)                   │
└────────────────────┬────────────────────────┘
                     │  Vite proxy /tasks → :3001
┌────────────────────▼────────────────────────┐
│               Express API (port 3001)        │
│                                             │
│  GET  /tasks  → taskService.getAllTasks()   │
│  POST /tasks  → taskService.createTask()   │
│                    └─ in-memory task store  │
│                         └─ taskSeed (init)  │
└─────────────────────────────────────────────┘
```

### Design Principles

- **Separation of concerns** — Components are presentational; hooks and services own data logic.
- **Single source of truth** — `useTasks` is the only place task-state is managed on the client.
- **TypeScript strict mode** — All models, props, and return types are fully typed.
- **Graceful degradation** — Every network state (loading / empty / error) has a dedicated UI.

---

## 11. Running the Application

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Install dependencies

```bash
npm install
```

### Start development servers (API + UI together)

```bash
npm run dev
```

- **UI:** http://localhost:5173
- **API:** http://localhost:3001

The Vite dev server automatically proxies `/tasks` requests to the Express API.

### Run servers individually

```bash
npm run dev:api   # Express API only  (port 3001)
npm run dev:ui    # Vite frontend only (port 5173)
```

### Production build

```bash
npm run build   # Compiles TypeScript → dist/
npm start       # Runs compiled server from dist/server.js
```
