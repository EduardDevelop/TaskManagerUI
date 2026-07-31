import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import type { Task, TaskStatus } from '../../models/task.model';
import { TaskBoardComponent } from './task-board.component';

const tasks: Task[] = [
  { id: '1', title: 'Pendiente', status: 'pending', createdAt: '', updatedAt: '' },
  { id: '2', title: 'En progreso', status: 'in_progress', createdAt: '', updatedAt: '' },
  { id: '3', title: 'Completada', status: 'done', createdAt: '', updatedAt: '' },
];

const dropEvent = (task: Task, fromStatus: TaskStatus, toStatus: TaskStatus): CdkDragDrop<TaskStatus, TaskStatus, Task> => ({
  item: { data: task },
  previousContainer: { data: fromStatus },
  container: { data: toStatus },
} as unknown as CdkDragDrop<TaskStatus, TaskStatus, Task>);

describe('TaskBoardComponent', () => {
  let fixture: ComponentFixture<TaskBoardComponent>;
  let component: TaskBoardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaskBoardComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaskBoardComponent);
    component = fixture.componentInstance;
    component.tasks = tasks;
    fixture.detectChanges();
  });

  it('renders the three status columns and groups cards by status', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Pendiente');
    expect(text).toContain('En progreso');
    expect(text).toContain('Completada');
    expect(component.tasksFor('pending').map((task) => task.id)).toEqual(['1']);
    expect(component.tasksFor('done').map((task) => task.id)).toEqual(['3']);
  });

  it('keeps empty columns visible', () => {
    fixture = TestBed.createComponent(TaskBoardComponent);
    component = fixture.componentInstance;
    component.tasks = [tasks[0]];
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Sin tareas en este estado');
    expect(component.tasksFor('pending')).toHaveSize(1);
    expect(component.tasksFor('in_progress')).toEqual([]);
    expect(component.tasksFor('done')).toEqual([]);
  });

  it('emits typed status moves only for valid cross-column drops', () => {
    spyOn(component.statusMove, 'emit');
    component.drop(dropEvent(tasks[0], 'pending', 'done'));
    expect(component.statusMove.emit).toHaveBeenCalledWith({ task: tasks[0], fromStatus: 'pending', toStatus: 'done' });

    component.drop(dropEvent(tasks[0], 'pending', 'pending'));
    expect(component.statusMove.emit).toHaveBeenCalledTimes(1);
  });

  it('ignores drops for busy tasks', () => {
    spyOn(component.statusMove, 'emit');
    component.busyTaskId = '1';
    component.drop(dropEvent(tasks[0], 'pending', 'done'));
    expect(component.statusMove.emit).not.toHaveBeenCalled();
  });
});
