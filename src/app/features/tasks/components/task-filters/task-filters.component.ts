import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { TASK_STATUS_LABELS, TASK_STATUSES, type TaskStatus } from '../../models/task.model';
import { isDateRangeInvalid, type TaskFilter } from '../../utils/task-filtering';

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
  templateUrl: './task-filters.component.html',
  styleUrl: './task-filters.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFiltersComponent {
  @Output() changed = new EventEmitter<TaskFilter>();
  searchTerm = '';
  status: TaskStatus | 'all' = 'all';
  createdFrom = '';
  createdTo = '';
  createdFromDate: Date | null = null;
  createdToDate: Date | null = null;
  readonly statuses = TASK_STATUSES;
  readonly labels = TASK_STATUS_LABELS;
  statusLabel(status: TaskStatus): string { return TASK_STATUS_LABELS[status]; }
  selectedStatusLabel(): string { return this.status === 'all' ? 'Todos' : TASK_STATUS_LABELS[this.status]; }
  get invalidRange(): boolean { return isDateRangeInvalid(this.currentFilter); }
  get hasActiveFilters(): boolean { return Boolean(this.searchTerm.trim() || this.status !== 'all' || this.createdFrom || this.createdTo); }
  get currentFilter(): TaskFilter { return { searchTerm: this.searchTerm, status: this.status, createdFrom: this.createdFrom || undefined, createdTo: this.createdTo || undefined }; }
  emit(): void { this.changed.emit(this.currentFilter); }
  setCreatedFrom(date: Date | null): void { this.createdFromDate = date; this.createdFrom = this.toCalendarDate(date); this.emit(); }
  setCreatedTo(date: Date | null): void { this.createdToDate = date; this.createdTo = this.toCalendarDate(date); this.emit(); }
  clear(): void { this.searchTerm = ''; this.status = 'all'; this.createdFrom = ''; this.createdTo = ''; this.createdFromDate = null; this.createdToDate = null; this.emit(); }
  private toCalendarDate(date: Date | null): string {
    if (!date) return '';
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }
}
