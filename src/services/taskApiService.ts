import { Task, Priority, Status } from '../models/task';

const API_BASE = '/tasks';

export interface TasksResponse {
  count: number;
  tasks: Task[];
}

export interface TaskFilterParams {
  status?: Status;
  priority?: Priority;
}

export async function fetchTasks(filters?: TaskFilterParams): Promise<Task[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.priority) params.set('priority', filters.priority);

  const url = params.toString() ? `${API_BASE}?${params.toString()}` : API_BASE;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }
  const data: TasksResponse = await response.json();
  return data.tasks;
}
