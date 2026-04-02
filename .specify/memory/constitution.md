<!--
SYNC IMPACT REPORT
==================
Version change: 0.0.0 → 1.0.0
Rationale: MAJOR — initial ratification of the project constitution (all sections new).

Modified principles: N/A (initial creation)
Added sections:
  - I. Component-First
  - II. TypeScript Everywhere
  - III. Test-First (NON-NEGOTIABLE)
  - IV. Separation of Concerns
  - V. Simplicity & Maintainability
  - Tech Stack Constraints
  - Development Workflow
  - Governance

Templates:
  ✅ .specify/templates/plan-template.md — Constitution Check gates align with principles
  ✅ .specify/templates/spec-template.md — No mandatory section conflicts
  ✅ .specify/templates/tasks-template.md — Task categorisation consistent with principles

Follow-up TODOs: None. All placeholders resolved.
-->

# Task Manager Application Constitution

## Core Principles

### I. Component-First

Every feature MUST be implemented as a reusable, self-contained component.
Components MUST have a single, clearly defined responsibility.
Components MUST be independently testable without requiring a full application context.
Shared UI primitives belong in `src/components/`; page-level composition belongs in `src/pages/`.

### II. TypeScript Everywhere

All source files MUST be TypeScript (`.ts` / `.tsx`). Plain JavaScript files are not permitted.
Explicit types MUST be declared for all function parameters, return values, and data models.
Use of `any` is prohibited outside of explicitly justified and commented exceptions.
All data models MUST be defined in `src/models/` before use across services or components.

### III. Test-First (NON-NEGOTIABLE)

Tests MUST be written and reviewed before implementation begins.
The Red-Green-Refactor cycle MUST be followed: tests fail first, then implementation makes them pass, then code is refactored.
Every acceptance criterion in a feature spec MUST have a corresponding test.
No feature is considered complete until all tests pass.

### IV. Separation of Concerns

UI logic (rendering, user interaction) MUST reside in components and pages only.
Business logic and data operations MUST reside in `src/services/` or `src/hooks/`.
Components MUST NOT directly call localStorage, APIs, or perform data transformations.
Custom hooks in `src/hooks/` are the approved bridge between services and components.

### V. Simplicity & Maintainability

YAGNI (You Aren't Gonna Need It): implement only what is explicitly required.
Functions MUST be small, single-purpose, and independently understandable.
Naming MUST be consistent and descriptive: `camelCase` for variables/functions, `PascalCase` for components/types.
All Copilot-generated code MUST be reviewed, understood, and refactored before merging.

## Tech Stack Constraints

The following stack is mandatory and MUST NOT be changed without a constitution amendment:

- **Frontend**: React 18+ with TypeScript
- **Styling**: CSS Modules or Tailwind CSS (no inline styles for reusable components)
- **State management**: React Hooks only (`useState`, `useReducer`, `useContext`) — no external state libraries
- **Persistence**: Browser `localStorage` only (no cloud storage, no backend database)
- **Tooling**: ESLint and Prettier MUST be configured and passing on all commits
- **Build**: Vite

## Development Workflow

- All new features MUST begin with a spec (`/speckit.specify`) before any code is written.
- Implementation tasks MUST be generated from the spec before coding starts.
- Each pull request MUST reference the relevant spec and task IDs.
- Code review MUST verify compliance with all five Core Principles before merge.
- The `main` branch MUST always be in a deployable, passing-tests state.
- Breaking changes to existing component contracts MUST be flagged in the PR description.

## Governance

This constitution supersedes all other team practices and informal agreements.
Amendments MUST be proposed as a pull request modifying this file, with explicit justification.
Version numbering follows semantic versioning:
- MAJOR: backward-incompatible governance changes, principle removal, or redefinition
- MINOR: new principle or section added, or materially expanded guidance
- PATCH: clarifications, wording improvements, or typo fixes

All PRs and code reviews MUST verify compliance with the Core Principles above.
Complexity beyond what the requirements demand MUST be explicitly justified in the PR.

**Version**: 1.0.0 | **Ratified**: 2026-04-02 | **Last Amended**: 2026-04-02
