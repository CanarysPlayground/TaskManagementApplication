import { useEffect, useState } from 'react';
import { Task } from '../models/task';
import { fetchTasks } from '../services/taskApiService';

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchTasks()
      .then((data) => {
        if (!cancelled) setTasks(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unknown error');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const reload = () => setRefreshKey((k) => k + 1);

  return { tasks, loading, error, reload };
}
