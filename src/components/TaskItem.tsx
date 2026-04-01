import { Task } from '../models/task';
import '../styles/tasks.css';

interface TaskItemProps {
  task: Task;
}

const PRIORITY_CLASS: Record<Task['priority'], string> = {
  Low: 'badge badge--low',
  Medium: 'badge badge--medium',
  High: 'badge badge--high',
};

export function TaskItem({ task }: TaskItemProps) {
  const isCompleted = task.status === 'completed';

  return (
    <li className={`task-item ${isCompleted ? 'task-item--completed' : ''}`}>
      <span className={`task-item__status-dot ${isCompleted ? 'task-item__status-dot--done' : ''}`} />
      <span className="task-item__title">{task.title}</span>
      <span className={PRIORITY_CLASS[task.priority]}>{task.priority}</span>
      <span className="task-item__status">{task.status}</span>
    </li>
  );
}
