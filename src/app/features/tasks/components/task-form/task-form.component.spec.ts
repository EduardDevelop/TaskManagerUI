import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';

describe('TaskFormComponent', () => {
  let fixture: ComponentFixture<TaskFormComponent>;
  let component: TaskFormComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaskFormComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('rejects whitespace titles and emits normalized valid values', () => {
    spyOn(component.submitted, 'emit');
    component.form.controls.title.setValue('   ');
    component.submit();
    expect(component.submitted.emit).not.toHaveBeenCalled();
    component.form.controls.title.setValue('  New task  ');
    component.submit();
    expect(component.submitted.emit).toHaveBeenCalledWith({ title: 'New task', description: undefined, status: 'pending' });
  });
  it('accepts the boundaries and rejects overflow', () => {
    component.form.controls.title.setValue('x'.repeat(100));
    component.form.controls.description.setValue('x'.repeat(500));
    expect(component.form.valid).toBeTrue();
    component.form.controls.title.setValue('x'.repeat(101));
    expect(component.form.invalid).toBeTrue();
  });
});
