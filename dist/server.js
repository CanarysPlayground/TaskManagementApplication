"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const child_process_1 = require("child_process");
const taskService_1 = require("./src/services/taskService");
const validStatuses = ['pending', 'completed'];
// --- App setup ---
const app = (0, express_1.default)();
app.use(express_1.default.json());
// GET /tasks — return tasks, optionally filtered by ?status= and/or ?priority=
app.get('/tasks', (req, res) => {
    const { status, priority } = req.query;
    if (status !== undefined && !validStatuses.includes(status)) {
        res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}.` });
        return;
    }
    if (priority !== undefined && !taskService_1.validPriorities.includes(priority)) {
        res.status(400).json({ error: `priority must be one of: ${taskService_1.validPriorities.join(', ')}.` });
        return;
    }
    const tasks = (0, taskService_1.getFilteredTasks)({
        status: status,
        priority: priority,
    });
    res.status(200).json({
        count: tasks.length,
        tasks,
    });
});
// POST /tasks — create a new task dynamically
app.post('/tasks', (req, res) => {
    const { title, priority = 'Medium' } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
        res.status(400).json({ error: 'title is required and must be a non-empty string.' });
        return;
    }
    if (!taskService_1.validPriorities.includes(priority)) {
        res.status(400).json({ error: `priority must be one of: ${taskService_1.validPriorities.join(', ')}.` });
        return;
    }
    const newTask = (0, taskService_1.createTask)({ title, priority });
    res.status(201).json(newTask);
});
// --- Start server ---
const PORT = process.env.PORT ?? 3001;
function startServer() {
    const server = app.listen(PORT, () => {
        console.log(`Task API running on http://localhost:${PORT}`);
        console.log('  GET  /tasks   – list all tasks');
        console.log('  POST /tasks   – create a task { title, priority? }');
    });
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${PORT} is busy. Killing existing process and retrying...`);
            try {
                (0, child_process_1.execSync)(`powershell -Command "Get-Process -Id (Get-NetTCPConnection -LocalPort ${PORT} -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force"`, { stdio: 'ignore' });
                setTimeout(startServer, 500);
            }
            catch {
                console.error(`Could not free port ${PORT}. Kill it manually and try again.`);
                process.exit(1);
            }
        }
    });
}
startServer();
