import { v4 as uuidv4 } from 'uuid';
import { Task, CreateTaskBody, Priority, Status } from '../models/task';
import { seedTasks } from './taskSeed';

/** In-memory task store. Pre-loaded with seed data on startup. */
const tasks: Task[] = [...seedTasks];

/** Allowed priority values for a task. */
export const validPriorities: Priority[] = ['Low', 'Medium', 'High'];

/** Optional filters for querying tasks. */
export interface TaskFilters {
  status?: Status;
  priority?: Priority;
}

/**
 * Returns all tasks currently held in memory.
 *
 * @returns {Task[]} Ordered array of tasks in insertion order.
 *
 * @example
 * // GET /tasks
 * const all = getAllTasks(); // []
 */
export function getAllTasks(): Task[] {
  return tasks;
}

/**
 * Returns tasks filtered by optional status and/or priority.
 * Omitting a filter means that dimension is not restricted.
 *
 * @param {TaskFilters} filters - Optional status and/or priority filter values.
 * @returns {Task[]} Array of tasks matching all provided filters.
 *
 * @example
 * // GET /tasks?status=pending
 * const pending = getFilteredTasks({ status: 'pending' });
 *
 * @example
 * // GET /tasks?priority=High
 * const highPriority = getFilteredTasks({ priority: 'High' });
 *
 * @example
 * // GET /tasks?status=pending&priority=High
 * const urgent = getFilteredTasks({ status: 'pending', priority: 'High' });
 */
export function getFilteredTasks(filters: TaskFilters): Task[] {
  return tasks.filter((task) => {
    if (filters.status !== undefined && task.status !== filters.status) return false;
    if (filters.priority !== undefined && task.priority !== filters.priority) return false;
    return true;
  });
}

/**
 * Creates a new task and appends it to the in-memory store.
 *
 * @param {CreateTaskBody} body - Task creation payload.
 * @param {string}         body.title    - Human-readable task title (must be non-empty).
 * @param {Priority}       [body.priority='Medium'] - Task urgency level: `'Low'`, `'Medium'`, or `'High'`.
 *
 * @returns {Task} The newly created task with a generated `id`, `status: 'pending'`,
 *                 and an ISO 8601 `createdAt` timestamp.
 *
 * @example
 * // POST /tasks  { "title": "Write tests", "priority": "High" }
 * const task = createTask({ title: 'Write tests', priority: 'High' });
 * // {
 * //   id: '550e8400-...',
 * //   title: 'Write tests',
 * //   status: 'pending',
 * //   priority: 'High',
 * //   createdAt: '2026-03-31T07:00:00.000Z'
 * // }
 */
export function createTask(body: CreateTaskBody): Task {
  const { title, priority = 'Medium' } = body;
  const newTask: Task = {
    id: uuidv4(),
    title: title.trim(),
    status: 'pending',
    priority,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  return newTask;
}
