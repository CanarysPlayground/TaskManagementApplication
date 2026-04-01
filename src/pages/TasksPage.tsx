import { useTasks } from '../hooks/useTasks';
import { TaskList } from '../components/TaskList';
import { Priority, Status } from '../models/task';
import '../styles/tasks.css';

export function TasksPage() {
  const { tasks, loading, error, filters, setFilters, reload } = useTasks();

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilters({ ...filters, status: e.target.value ? (e.target.value as Status) : undefined });
  }

  function handlePriorityChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilters({ ...filters, priority: e.target.value ? (e.target.value as Priority) : undefined });
  }

  return (
    <main className="tasks-page">
      <header className="tasks-page__header">
        <h1>Task Manager</h1>
        <button className="btn" onClick={reload} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>
      <div className="tasks-page__filters">
        <select
          className="filter-select"
          value={filters.status ?? ''}
          onChange={handleStatusChange}
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select
          className="filter-select"
          value={filters.priority ?? ''}
          onChange={handlePriorityChange}
          aria-label="Filter by priority"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <TaskList tasks={tasks} loading={loading} error={error} onReload={reload} />
    </main>
  );
}

