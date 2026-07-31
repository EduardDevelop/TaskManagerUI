import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AlertService } from '../../../../core/services/alert.service';
import { HttpErrorMapperService } from '../../../../core/services/http-error-mapper.service';
import type { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskPageComponent } from './task-page.component';

const task: Task = {
  id: '1',
  title: 'Existing task',
  description: 'Description',
  status: 'pending',
  createdAt: '2026-07-10T10:00:00.000Z',
  updatedAt: '2026-07-10T10:00:00.000Z',
};

const createdTask: Task = {
  ...task,
  id: '2',
  title: 'New task',
};

describe('TaskPageComponent', () => {
  let fixture: ComponentFixture<TaskPageComponent>;
  let component: TaskPageComponent;
  let taskService: jasmine.SpyObj<TaskService>;
  let alerts: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    taskService = jasmine.createSpyObj<TaskService>('TaskService', [
      'getTasks', 'getTaskById', 'createTask', 'updateTask', 'deleteTask',
    ]);
    alerts = jasmine.createSpyObj<AlertService>('AlertService', ['confirm', 'success', 'error', 'info']);
    alerts.confirm.and.resolveTo(true);
    alerts.success.and.resolveTo(undefined);
    alerts.error.and.resolveTo(undefined);
    alerts.info.and.resolveTo(undefined);
    taskService.getTasks.and.returnValue(of([task]));
    await TestBed.configureTestingModule({
      imports: [TaskPageComponent],
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: AlertService, useValue: alerts },
        HttpErrorMapperService,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TaskPageComponent);
    component = fixture.componentInstance;
  });

  it('loads the server task collection', () => {
    fixture.detectChanges();
    expect(taskService.getTasks).toHaveBeenCalled();
    expect(component.tasks).toEqual([task]);
    expect(component.loading).toBeFalse();
  });

  it('returns to the board after a confirmed create', async () => {
    taskService.createTask.and.returnValue(of(createdTask));
    component.showForm = true;
    await component.save({ title: 'New task', status: 'pending' });
    expect(component.tasks).toContain(createdTask);
    expect(component.showForm).toBeFalse();
    expect(component.editingTask).toBeNull();
    expect(component.formError).toBeNull();
    expect(alerts.success).toHaveBeenCalledWith('Tarea creada', 'La tarea fue agregada al tablero.');
  });

  it('blocks a duplicate normalized title before POST', async () => {
    component.tasks = [task];
    component.showForm = true;
    await component.save({ title: ' EXISTING TASK ', status: 'pending' });
    expect(taskService.createTask).not.toHaveBeenCalled();
    expect(component.formError).toContain('Ya existe');
    expect(component.showForm).toBeTrue();
    expect(alerts.error).toHaveBeenCalled();
  });

  it('keeps the form open after a rejected create', async () => {
    taskService.createTask.and.returnValue(throwError(() => new Error('rejected')));
    component.showForm = true;
    await component.save({ title: 'New task', status: 'pending' });
    expect(component.showForm).toBeTrue();
    expect(component.formError).toBeTruthy();
  });

  it('does not update an edited task when confirmation is cancelled', async () => {
    alerts.confirm.and.resolveTo(false);
    component.tasks = [task];
    component.openEdit(task);
    await component.save({ title: 'Changed', status: 'pending' });
    expect(taskService.updateTask).not.toHaveBeenCalled();
    expect(component.showForm).toBeTrue();
  });

  it('removes a task only after SweetAlert2 confirmation succeeds', async () => {
    taskService.deleteTask.and.returnValue(of(undefined));
    component.tasks = [task];
    await component.requestDelete(task);
    expect(component.tasks).toEqual([]);
    expect(alerts.confirm).toHaveBeenCalled();
    expect(alerts.success).toHaveBeenCalledWith('Tarea eliminada', 'La tarea fue removida del tablero.');
  });

  it('does not delete when confirmation is cancelled', async () => {
    alerts.confirm.and.resolveTo(false);
    component.tasks = [task];
    await component.requestDelete(task);
    expect(taskService.deleteTask).not.toHaveBeenCalled();
    expect(component.tasks).toEqual([task]);
  });

  it('preserves the previous status when a board move fails', async () => {
    taskService.updateTask.and.returnValue(throwError(() => new Error('rejected')));
    component.tasks = [task];
    await component.moveTaskStatus({ task, fromStatus: 'pending', toStatus: 'done' });
    expect(component.tasks[0].status).toBe('pending');
    expect(component.busyTaskId).toBeNull();
    expect(alerts.error).toHaveBeenCalled();
  });

  it('updates status after a confirmed board move', async () => {
    const updated: Task = { ...task, status: 'done' };
    taskService.updateTask.and.returnValue(of(updated));
    component.tasks = [task];
    await component.moveTaskStatus({ task, fromStatus: 'pending', toStatus: 'done' });
    expect(component.tasks[0].status).toBe('done');
    expect(alerts.success).toHaveBeenCalledWith('Estado actualizado', 'La tarea fue movida en el tablero.');
  });
});
