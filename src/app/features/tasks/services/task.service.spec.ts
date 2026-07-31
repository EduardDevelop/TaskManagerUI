import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';

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
    service.getTasks().subscribe();
    const request = http.expectOne('http://localhost:3000/api/tasks');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('uses encoded IDs and typed update bodies', () => {
    service.updateTask('task/1', { title: 'Task', status: 'done' }).subscribe();
    const request = http.expectOne('http://localhost:3000/api/tasks/task%2F1');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ title: 'Task', status: 'done' });
    request.flush({ id: 'task/1', title: 'Task', status: 'done', createdAt: '', updatedAt: '' });
  });
});
