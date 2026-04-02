import { Task, TaskFilter } from '../models/task';

const API_BASE = '/tasks';

export interface TasksResponse {
  count: number;
  tasks: Task[];
}

export async function fetchTasks(filter?: TaskFilter): Promise<Task[]> {
  const url = new URL(API_BASE, window.location.origin);
  if (filter?.status !== undefined) url.searchParams.set('status', filter.status);
  if (filter?.priority !== undefined) url.searchParams.set('priority', filter.priority);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }
  const data: TasksResponse = await response.json();
  return data.tasks;
}
