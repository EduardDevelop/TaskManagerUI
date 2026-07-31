import type { Task, TaskStatus } from '../models/task.model';

export interface TaskFilter {
  readonly searchTerm: string;
  readonly status: TaskStatus | 'all';
  readonly createdFrom?: string;
  readonly createdTo?: string;
}

export const isDateRangeInvalid = (filter: TaskFilter): boolean =>
  Boolean(filter.createdFrom && filter.createdTo && filter.createdFrom > filter.createdTo);

const matchesCreationDate = (createdAt: string | undefined, filter: TaskFilter): boolean => {
  if (!createdAt) return !filter.createdFrom && !filter.createdTo;
  const createdDate = createdAt.slice(0, 10);
  return (!filter.createdFrom || createdDate >= filter.createdFrom) &&
    (!filter.createdTo || createdDate <= filter.createdTo);
};

export const filterTasks = (tasks: readonly Task[], filter: TaskFilter): Task[] => {
  const search = filter.searchTerm.trim().toLocaleLowerCase();
  if (isDateRangeInvalid(filter)) return [];
  return tasks.filter((task) => {
    const matchesStatus = filter.status === 'all' || task.status === filter.status;
    const haystack = `${task.title} ${task.description ?? ''}`.toLocaleLowerCase();
    return matchesStatus && matchesCreationDate(task.createdAt, filter) && (!search || haystack.includes(search));
  });
};
