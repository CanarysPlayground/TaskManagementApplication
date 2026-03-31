import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

type Priority = 'Low' | 'Medium' | 'High';
type Status = 'pending' | 'completed';

interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: string;
}

const tasks: Task[] = [];

app.get('/tasks', (_req: Request, res: Response) => {
  res.json({ count: tasks.length, tasks });
});

app.post('/tasks', (req: Request, res: Response) => {
  const { title, description = '', priority = 'Medium' } = req.body as {
    title?: string;
    description?: string;
    priority?: Priority;
  };

  if (!title || typeof title !== 'string' || title.trim() === '') {
    res.status(400).json({ error: 'title is required' });
    return;
  }

  const validPriorities: Priority[] = ['Low', 'Medium', 'High'];
  if (!validPriorities.includes(priority)) {
    res.status(400).json({ error: 'priority must be Low, Medium, or High' });
    return;
  }

  const task: Task = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: title.trim(),
    description,
    status: 'pending',
    priority,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  res.status(201).json(task);
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`Task API running on http://localhost:${PORT}`);
});
