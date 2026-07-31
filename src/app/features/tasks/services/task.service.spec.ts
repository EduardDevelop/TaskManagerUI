import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import type { Task } from '../models/task.model';
import { TaskService } from './task.service';

const task: Task = {
  id: 'task-1',
  title: 'Task',
  status: 'done',
  createdAt: '2026-07-10T10:00:00.000Z',
  updatedAt: '2026-07-10T10:00:00.000Z',
};

describe('TaskService', () => {
  let service: TaskService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [TaskService, provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(TaskService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('requests the task collection', () => {
    service.getTasks().subscribe((tasks) => {
      expect(tasks).toEqual([task]);
    });
    const request = http.expectOne('http://localhost:3000/api/tasks');
    expect(request.request.method).toBe('GET');
    request.flush({ success: true, data: [task], meta: { total: 1 } });
  });

  it('uses encoded IDs and typed update bodies', () => {
    service.updateTask('task/1', { title: 'Task', status: 'done' }).subscribe((updated) => {
      expect(updated).toEqual(task);
    });
    const request = http.expectOne('http://localhost:3000/api/tasks/task%2F1');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ title: 'Task', status: 'done' });
    request.flush({ success: true, data: task });
  });
});
