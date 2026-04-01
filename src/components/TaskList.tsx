import { Task } from '../models/task';
import { TaskItem } from './TaskItem';
import { TaskListLoading } from './TaskListLoading';
import { TaskListError } from './TaskListError';
import { TaskListEmpty } from './TaskListEmpty';
import '../styles/tasks.css';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onReload: () => void;
}

export function TaskList({ tasks, loading, error, onReload }: TaskListProps) {
  if (loading) return <TaskListLoading />;
  if (error) return <TaskListError message={error} onRetry={onReload} />;
  if (tasks.length === 0) return <TaskListEmpty />;

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
