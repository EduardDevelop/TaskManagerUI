import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TASK_STATUS_LABELS, TASK_STATUSES, type Task, type TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Input() busy = false;
  @Output() edit = new EventEmitter<Task>();
  @Output() remove = new EventEmitter<Task>();
  @Output() keyboardStatusChange = new EventEmitter<TaskStatus>();

  readonly statuses = TASK_STATUSES;
  readonly labels = TASK_STATUS_LABELS;

  statusLabel(status: TaskStatus): string { return TASK_STATUS_LABELS[status]; }
  availableKeyboardStatuses(): TaskStatus[] { return this.statuses.filter((status) => status !== this.task.status); }
}
