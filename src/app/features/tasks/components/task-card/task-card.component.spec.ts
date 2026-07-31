import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCardComponent } from './task-card.component';
import type { Task } from '../../models/task.model';

describe('TaskCardComponent', () => {
  let fixture: ComponentFixture<TaskCardComponent>;
  let component: TaskCardComponent;
  const task: Task = { id: '1', title: 'Task', status: 'pending', createdAt: '', updatedAt: '' };
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaskCardComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
    component.task = task;
    fixture.detectChanges();
  });
  it('renders valid status labels and emits keyboard fallback status changes', () => {
    spyOn(component.keyboardStatusChange, 'emit');
    const button = Array.from(fixture.nativeElement.querySelectorAll('button')).find((item) =>
      (item as HTMLButtonElement).textContent?.includes('Completada'),
    ) as HTMLButtonElement;
    button.click();
    expect(component.keyboardStatusChange.emit).toHaveBeenCalledWith('done');
    expect(fixture.nativeElement.textContent).toContain('Pendiente');
  });
});
