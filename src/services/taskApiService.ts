import { Task } from '../models/task';

const API_BASE = '/tasks';

export interface TasksResponse {
  count: number;
  tasks: Task[];
}

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }
  const data: TasksResponse = await response.json();
  return data.tasks;
}
