import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TaskFiltersComponent } from './task-filters.component';

describe('TaskFiltersComponent', () => {
  let fixture: ComponentFixture<TaskFiltersComponent>;
  let component: TaskFiltersComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaskFiltersComponent, NoopAnimationsModule] }).compileComponents();
    fixture = TestBed.createComponent(TaskFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('emits text, status, and calendar filters', () => {
    spyOn(component.changed, 'emit');
    component.searchTerm = 'docs';
    component.status = 'done';
    component.setCreatedFrom(new Date(2026, 6, 1));
    component.setCreatedTo(new Date(2026, 6, 31));
    component.emit();
    expect(component.changed.emit).toHaveBeenCalledWith({ searchTerm: 'docs', status: 'done', createdFrom: '2026-07-01', createdTo: '2026-07-31' });
  });
  it('shows invalid ranges and clears all filters', () => {
    component.createdFrom = '2026-07-31';
    component.createdTo = '2026-07-01';
    fixture.detectChanges();
    expect(component.invalidRange).toBeTrue();
    component.clear();
    expect(component.hasActiveFilters).toBeFalse();
    expect(component.createdFrom).toBe('');
  });
});
