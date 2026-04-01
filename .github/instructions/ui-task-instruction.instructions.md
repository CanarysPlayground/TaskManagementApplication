---
name: ui-task-instruction

description: Frontend Copilot Instructions – Task Manager UI These instructions apply only to frontend/UI files under the React application.
under the React application.

applyTo: **/*.tsx **

---

<!-- Tip: Use /create-instructions in chat to generate content with agent assistance -->

## Scope
- Applies to UI, components, hooks, and frontend services
- Does NOT apply to backend or API files

## Technology
- React with TypeScript
- Functional components only
- Hooks for state and side effects

## Architectural Rules
- Keep UI components presentational where possible
- Extract data fetching and business logic into hooks or services
- Maintain a clear separation between UI and API logic

## State Management
- Use React hooks (useState, useEffect)
- Avoid duplicating task state across components
- Prefer lifting state up or using a single custom hook

## API Usage
- Consume the existing Task API
- Do not mock or hardcode task data in the UI
- Handle loading, empty, and error states clearly

## Coding Standards
- Prefer readable, self-explanatory code
- Small, focused components
- Strong typing for all props and state
- Follow existing naming conventions

## UX Expectations
- UI should be clean and demo-friendly
- Clearly display task title, priority, and completion status
- Avoid unnecessary complexity
