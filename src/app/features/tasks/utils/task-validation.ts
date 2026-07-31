import type { CreateTaskRequest, Task, TaskStatus, UpdateTaskRequest } from '../models/task.model';
import { isTaskStatus } from '../models/task.model';

export const normalizeOptionalText = (value: string): string | undefined => {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
};

export const isMeaningfulTitle = (value: string): boolean => value.trim().length > 0;

export const normalizeTitle = (value: string): string => value.trim().toLocaleLowerCase();

export const hasDuplicateTitle = (tasks: readonly Task[], title: string, excludedTaskId?: string): boolean => {
  const normalizedTitle = normalizeTitle(title);
  return tasks.some((task) => task.id !== excludedTaskId && normalizeTitle(task.title) === normalizedTitle);
};

export const isValidTaskRequest = (
  request: CreateTaskRequest | UpdateTaskRequest,
): boolean =>
  isMeaningfulTitle(request.title) &&
  request.title.trim().length <= 100 &&
  (request.description?.length ?? 0) <= 500 &&
  isTaskStatus(request.status);

export const toTaskStatus = (value: unknown): TaskStatus | null =>
  isTaskStatus(value) ? value : null;