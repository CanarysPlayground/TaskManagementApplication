export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  createdAt: string;
}

export interface CreateTaskBody {
  title: string;
  priority?: Priority;
}

export interface TaskFilter {
  status?: Status;
  priority?: Priority;
}
