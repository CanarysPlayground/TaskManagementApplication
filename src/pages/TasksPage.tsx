import { useTasks } from '../hooks/useTasks';
import { TaskList } from '../components/TaskList';
import '../styles/tasks.css';

export function TasksPage() {
  const { tasks, loading, error, reload } = useTasks();

  return (
    <main className="tasks-page">
      <header className="tasks-page__header">
        <h1>Task Manager</h1>
        <button className="btn" onClick={reload} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>
      <TaskList tasks={tasks} loading={loading} error={error} onReload={reload} />
    </main>
  );
}
