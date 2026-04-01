import '../styles/tasks.css';

interface TaskListErrorProps {
  message: string;
  onRetry: () => void;
}

export function TaskListError({ message, onRetry }: TaskListErrorProps) {
  return (
    <div className="task-list__error">
      <p>{message}</p>
      <button className="btn" onClick={onRetry}>Retry</button>
    </div>
  );
}
