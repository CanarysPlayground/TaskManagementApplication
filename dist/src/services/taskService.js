"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validPriorities = void 0;
exports.getAllTasks = getAllTasks;
exports.getFilteredTasks = getFilteredTasks;
exports.createTask = createTask;
const uuid_1 = require("uuid");
const taskSeed_1 = require("./taskSeed");
/** In-memory task store. Pre-loaded with seed data on startup. */
const tasks = [...taskSeed_1.seedTasks];
/** Allowed priority values for a task. */
exports.validPriorities = ['Low', 'Medium', 'High'];
/**
 * Returns all tasks currently held in memory.
 *
 * @returns {Task[]} Ordered array of tasks in insertion order.
 *
 * @example
 * // GET /tasks
 * const all = getAllTasks(); // []
 */
function getAllTasks() {
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
function getFilteredTasks(filters) {
    return tasks.filter((task) => {
        if (filters.status !== undefined && task.status !== filters.status)
            return false;
        if (filters.priority !== undefined && task.priority !== filters.priority)
            return false;
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
function createTask(body) {
    const { title, priority = 'Medium' } = body;
    const newTask = {
        id: (0, uuid_1.v4)(),
        title: title.trim(),
        status: 'pending',
        priority,
        createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    return newTask;
}
