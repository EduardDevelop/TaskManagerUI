import { hasDuplicateTitle, isMeaningfulTitle, isValidTaskRequest, normalizeOptionalText, normalizeTitle, toTaskStatus } from './task-validation';
import type { Task } from '../models/task.model';

describe('task validation', () => {
  it('accepts meaningful titles within the boundary and rejects whitespace', () => {
    expect(isMeaningfulTitle('  Task  ')).toBeTrue();
    expect(isMeaningfulTitle('   ')).toBeFalse();
  });

  it('normalizes optional descriptions and validates requests', () => {
    expect(normalizeOptionalText('  ')).toBeUndefined();
    expect(isValidTaskRequest({ title: 'Task', status: 'pending' })).toBeTrue();
    expect(isValidTaskRequest({ title: ' '.repeat(101), status: 'pending' })).toBeFalse();
    expect(isValidTaskRequest({ title: 'Task', description: 'x'.repeat(501), status: 'pending' })).toBeFalse();
  });

  it('rejects unsupported statuses', () => {
    expect(toTaskStatus('done')).toBe('done');
    expect(toTaskStatus('blocked')).toBeNull();
  });

  it('normalizes titles and detects duplicates without matching the edited task', () => {
    const tasks: Task[] = [{ id: '1', title: 'Write docs', status: 'pending', createdAt: '', updatedAt: '' }];
    expect(normalizeTitle('  WRITE DOCS ')).toBe('write docs');
    expect(hasDuplicateTitle(tasks, ' WRITE DOCS ')).toBeTrue();
    expect(hasDuplicateTitle(tasks, ' WRITE DOCS ', '1')).toBeFalse();
  });
});
