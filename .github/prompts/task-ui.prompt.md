---
name: task-ui
description: Build, refactor, review, or document the Task Manager UI following project instructions.
argument-hint: What UI task should Copilot help with?
agent: agent
---
Related skill: `agent-customization`. Follow prompt design principles from **prompts.md**.

You are working in a repository that contains a Task Management Application UI.

## Context
- The frontend is built using React with TypeScript.
- A Task API already exists (for example: GET /tasks, POST /tasks).
- Project architecture, structure, and coding rules are defined in the Copilot instruction file.
- The UI consumes the API and reflects real runtime behavior.

## Core Task Pattern
This prompt is intended for **repeatable UI-related work**, such as:
- Building or extending UI components
- Wiring UI components to existing APIs
- Refactoring UI code for structure and clarity
- Reviewing or documenting UI logic

Assume the user’s current focus is on **frontend/UI files**
(e.g. selected `.tsx` files or UI-related folders).

## Responsibilities
When this prompt is invoked, you must:
- Follow all project architecture and coding rules from the Copilot instruction file
- Keep UI components clean, reusable, and well-structured
- Maintain clear separation between:
  - Presentation
  - State management
  - API interaction
- Preserve existing behavior unless the user explicitly requests changes

## Supported Tasks

### 1. Build or Extend UI Features
You may:
- Create or update components such as TaskForm, TaskList, or TaskItem
- Implement task creation, listing, or update flows
- Bind UI components to existing API endpoints
- Reflect real-time updates from API responses

### 2. API Integration (UI Scope Only)
You may:
- Fetch tasks using existing endpoints
- Create tasks through POST interactions
- Handle loading, empty, and error states gracefully
- Keep API access logic reusable and decoupled from UI components

### 3. Refactor UI Code
You may:
- Improve component structure and readability
- Extract reusable hooks or helpers
- Reduce duplication
- Maintain a single source of truth for task-related state

### 4. Review or Improve UX
You may:
- Review components for usability and clarity
- Suggest UX improvements that do not change behavior
- Ensure task status, priority, and state are clearly represented

### 5. Explain or Document
You may:
- Explain how the UI works end to end
- Describe component responsibilities and data flow
- Generate concise UI documentation on request

## Constraints
- Do not recreate or modify the Task API
- Do not introduce unnecessary dependencies
- Do not hardcode task data; rely on API responses
- Keep implementations minimal, readable, and demo-friendly
- Use clean, readable TypeScript and React best practices

## Output Expectations
- Modify only files relevant to the requested UI task
- Ensure imports, hooks, and component boundaries are correct
- Clearly explain major changes or recommendations
- If no changes are required, explain why


