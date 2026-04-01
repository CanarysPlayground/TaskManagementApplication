1. Product Overview
The Task Manager Application is a demo project used to showcase GitHub Copilot’s ability to assist in designing, building, and maintaining a modern application.
The app enables users to manage tasks efficiently with basic CRUD operations and filtering.

2. Requirements (Summary)
Functional

Create, update, delete tasks
Mark tasks as completed or pending
Assign priority (Low, Medium, High)
Filter tasks by status and priority
Persist tasks across refresh (local storage)

Non Functional

Responsive UI
Clean, modular, and readable code
Easy to extend for demos and training

3. Design Tasks

Build reusable components (TaskForm, TaskList, TaskItem)
Implement task filtering & sorting
Handle form validation and errors
Persist data locally
Add basic unit tests

4. Tech Stack

Frontend: React + TypeScript
Styling: CSS Modules or Tailwind
State: React Hooks
Storage: Local Storage
Tooling: ESLint, Prettier, GitHub Copilot

5. Project Structure

src/
├── components/
├── hooks/
├── services/
├── models/
├── pages/
├── styles/
├── App.tsx
└── main.tsx
``

6. Coding Rules

Use TypeScript everywhere
Functional components only
Separate UI and business logic
Small, reusable functions
Follow consistent naming conventions
Review and refactor all Copilot-generated code

