import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { TaskList } from '../components/TaskList';
import { TaskFilter, Status, Priority } from '../models/task';
import '../styles/tasks.css';

export function TasksPage() {
  const [statusFilter, setStatusFilter] = useState<Status | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('');

  const filter: TaskFilter = {};
  if (statusFilter) filter.status = statusFilter;
  if (priorityFilter) filter.priority = priorityFilter;

  const { tasks, loading, error, reload } = useTasks(filter);

  const isFiltered = Boolean(statusFilter || priorityFilter);

  return (
    <main className="tasks-page">
      <header className="tasks-page__header">
        <h1>Task Manager</h1>
        <div className="tasks-page__filters">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | '')}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Priority | '')}
            aria-label="Filter by priority"
          >
            <option value="">All priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <button className="btn" onClick={reload} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>
      <TaskList tasks={tasks} loading={loading} error={error} onReload={reload} isFiltered={isFiltered} />
    </main>
  );
}
