import { filterTasks, isDateRangeInvalid } from './task-filtering';
import type { Task } from '../models/task.model';

const tasks: Task[] = [
  { id: '1', title: 'Write docs', description: 'README', status: 'pending', createdAt: '2026-07-10T10:00:00.000Z', updatedAt: '' },
  { id: '2', title: 'Ship feature', description: 'Release', status: 'done', createdAt: '2026-07-20T10:00:00.000Z', updatedAt: '' },
];

describe('filterTasks', () => {
  it('filters case-insensitive text without mutating the source collection', () => {
    expect(filterTasks(tasks, { searchTerm: '  README ', status: 'all' }).map((task) => task.id)).toEqual(['1']);
    expect(tasks.length).toBe(2);
  });

  it('filters by status and returns no matches predictably', () => {
    expect(filterTasks(tasks, { searchTerm: '', status: 'done' }).map((task) => task.id)).toEqual(['2']);
    expect(filterTasks(tasks, { searchTerm: 'missing', status: 'all' })).toEqual([]);
  });

  it('applies inclusive one-sided and two-sided calendar ranges', () => {
    expect(filterTasks(tasks, { searchTerm: '', status: 'all', createdFrom: '2026-07-10', createdTo: '2026-07-20' }).map((task) => task.id)).toEqual(['1', '2']);
    expect(filterTasks(tasks, { searchTerm: '', status: 'all', createdFrom: '2026-07-20' }).map((task) => task.id)).toEqual(['2']);
    expect(filterTasks(tasks, { searchTerm: '', status: 'all', createdTo: '2026-07-10' }).map((task) => task.id)).toEqual(['1']);
  });

  it('flags invalid ranges and returns no valid filtered result', () => {
    const filter = { searchTerm: '', status: 'all' as const, createdFrom: '2026-07-21', createdTo: '2026-07-10' };
    expect(isDateRangeInvalid(filter)).toBeTrue();
    expect(filterTasks(tasks, filter)).toEqual([]);
  });
});
