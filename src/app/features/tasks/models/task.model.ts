export const TASK_STATUSES = ['pending', 'in_progress', 'done'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  done: 'Completada',
};

export const TASK_BOARD_COLUMNS: readonly TaskStatus[] = TASK_STATUSES;

export const NEXT_TASK_STATUS: Record<TaskStatus, TaskStatus | null> = {
  pending: 'in_progress',
  in_progress: 'done',
  done: null,
};

export interface Task {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly status: TaskStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status: TaskStatus;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string;
  status: TaskStatus;
}

export interface TaskStatusMove {
  readonly task: Task;
  readonly fromStatus: TaskStatus;
  readonly toStatus: TaskStatus;
}

export const isTaskStatus = (value: unknown): value is TaskStatus =>
  typeof value === 'string' && TASK_STATUSES.includes(value as TaskStatus);

export const getNextTaskStatus = (status: TaskStatus): TaskStatus | null =>
  NEXT_TASK_STATUS[status];
