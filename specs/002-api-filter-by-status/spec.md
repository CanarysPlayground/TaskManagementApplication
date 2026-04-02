# Feature Specification: Extend Task Management API to Filter Tasks by Status

**Feature Branch**: `002-api-filter-by-status`  
**Created**: 2026-04-02  
**Status**: Draft  
**Input**: User description: "Extend the Task Management API to support filtering tasks by status"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filter Tasks by Status (Priority: P1)

As a user of the Task Management application, I want to request only tasks that match a specific status — either `pending` or `completed` — so that I can focus on the subset of tasks relevant to my current workflow without having to process the full task list client-side.

**Why this priority**: Filtering by status is the core deliverable of this feature. It directly reduces information overload for users managing many tasks and is the minimum viable outcome.

**Independent Test**: Can be fully tested by making a request with a `status` query parameter and verifying that only tasks matching that status are returned, without needing any other filter.

**Acceptance Scenarios**:

1. **Given** tasks exist with both `pending` and `completed` statuses, **When** a request is made with `status=pending`, **Then** only tasks with status `pending` are returned.
2. **Given** tasks exist with both `pending` and `completed` statuses, **When** a request is made with `status=completed`, **Then** only tasks with status `completed` are returned.
3. **Given** no tasks exist with a given status, **When** a request is made with that `status` value, **Then** an empty list is returned with a count of 0.

---

### User Story 2 - Return All Tasks When No Filter Applied (Priority: P2)

As a user, I want to retrieve all tasks without specifying a filter so that existing behaviour is preserved and no current integrations are broken.

**Why this priority**: Backward compatibility is essential. Any consumer of the API that does not pass `status` must continue to receive all tasks unchanged.

**Independent Test**: Can be fully tested by making a request with no query parameters and confirming that all tasks are returned regardless of status.

**Acceptance Scenarios**:

1. **Given** tasks with mixed statuses exist, **When** a request is made with no `status` parameter, **Then** all tasks are returned.
2. **Given** zero tasks exist, **When** a request is made with no `status` parameter, **Then** an empty list with count 0 is returned.

---

### User Story 3 - Reject Invalid Status Values (Priority: P3)

As a user, I want to receive a clear error message when I provide an unrecognised status value so that I can quickly identify and correct my request.

**Why this priority**: Input validation prevents silent incorrect results and provides a better developer and user experience. It is secondary to the core filtering behaviour.

**Independent Test**: Can be fully tested by supplying an invalid `status` value and confirming a `400 Bad Request` response with a descriptive error message.

**Acceptance Scenarios**:

1. **Given** a request is made with `status=done` (unrecognised value), **When** the system processes the request, **Then** a `400 Bad Request` response is returned with an error explaining valid values.
2. **Given** a request is made with an empty `status=` value, **When** the system processes the request, **Then** a `400 Bad Request` response is returned.

---

### Edge Cases

- What happens when `status` is provided with mixed case (e.g., `Status=Pending`)? The system should normalise the value to lowercase before validation.
- What happens when both `status` and an unrelated query parameter are provided? The unrelated parameter is ignored; only `status` filtering is applied.
- What happens when the task list is empty? A valid response with an empty list and count of 0 is returned.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The task retrieval endpoint MUST accept an optional `status` query parameter.
- **FR-002**: When `status=pending` is provided, the response MUST contain only tasks whose status is `pending`.
- **FR-003**: When `status=completed` is provided, the response MUST contain only tasks whose status is `completed`.
- **FR-004**: When no `status` parameter is provided, the endpoint MUST return all tasks (no filtering applied).
- **FR-005**: The endpoint MUST validate that the `status` value is one of the allowed values (`pending`, `completed`); all other values MUST result in a `400 Bad Request` response.
- **FR-006**: The response MUST include both the list of matching tasks and the total count of matching tasks.
- **FR-007**: The filtering MUST be case-insensitive (e.g., `Pending` and `PENDING` are treated as `pending`).

### Key Entities

- **Task**: Represents a unit of work. Key attributes: unique identifier, title, status (`pending` | `completed`), priority, creation timestamp.
- **TaskFilter**: Represents the filtering criteria applied to a task list. Relevant attribute for this feature: `status`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A request with `status=pending` returns only pending tasks — 0 completed tasks appear in the response.
- **SC-002**: A request with `status=completed` returns only completed tasks — 0 pending tasks appear in the response.
- **SC-003**: A request with no `status` parameter returns all tasks identically to current behaviour (backward compatibility fully preserved).
- **SC-004**: A request with an invalid status value receives a `400` error response with a human-readable message in under 200ms.
- **SC-005**: The response always includes a `count` field that accurately reflects the number of tasks returned.

## Assumptions

- Status values are restricted to `pending` and `completed`; no new status values will be introduced as part of this feature.
- The task data is stored in memory (no persistent database); filtering operates on the in-memory store.
- No authentication or authorisation is required to access the task list endpoint.
- The feature scope is limited to the server-side API; no UI changes are required in this feature.
- Consumers of the API that do not pass a `status` parameter must continue to receive all tasks unchanged (backward compatibility is non-negotiable).
