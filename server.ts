import express, { Request, Response } from 'express';
import { execSync } from 'child_process';
import { CreateTaskBody, TaskFilter } from './src/models/task';
import { filterTasks, createTask, validPriorities } from './src/services/taskService';

// --- App setup ---
const app = express();
app.use(express.json());

// GET /tasks — return tasks, optionally filtered by status and/or priority
app.get('/tasks', (req: Request, res: Response) => {
  const { status, priority } = req.query;

  const filter: TaskFilter = {};

  if (status !== undefined) {
    const normalised = String(status).toLowerCase();
    if (normalised !== 'pending' && normalised !== 'completed') {
      res.status(400).json({ error: 'status must be one of: pending, completed.' });
      return;
    }
    filter.status = normalised as TaskFilter['status'];
  }

  if (priority !== undefined) {
    const raw = String(priority);
    const normalised = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
    if (!validPriorities.includes(normalised as 'Low' | 'Medium' | 'High')) {
      res.status(400).json({ error: `priority must be one of: ${validPriorities.join(', ')}.` });
      return;
    }
    filter.priority = normalised as 'Low' | 'Medium' | 'High';
  }

  const tasks = filterTasks(filter);
  res.status(200).json({ count: tasks.length, tasks });
});

// POST /tasks — create a new task dynamically
app.post('/tasks', (req: Request<{}, {}, CreateTaskBody>, res: Response) => {
  const { title, priority = 'Medium' } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    res.status(400).json({ error: 'title is required and must be a non-empty string.' });
    return;
  }

  if (!validPriorities.includes(priority)) {
    res.status(400).json({ error: `priority must be one of: ${validPriorities.join(', ')}.` });
    return;
  }

  const newTask = createTask({ title, priority });
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

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is busy. Killing existing process and retrying...`);
      try {
        execSync(
          `powershell -Command "Get-Process -Id (Get-NetTCPConnection -LocalPort ${PORT} -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force"`,
          { stdio: 'ignore' }
        );
        setTimeout(startServer, 500);
      } catch {
        console.error(`Could not free port ${PORT}. Kill it manually and try again.`);
        process.exit(1);
      }
    }
  });
}

startServer();
