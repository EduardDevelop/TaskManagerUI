import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { TaskCardComponent } from '../task-card/task-card.component';
import {
  TASK_BOARD_COLUMNS,
  TASK_STATUS_LABELS,
  type Task,
  type TaskStatus,
  type TaskStatusMove,
} from '../../models/task.model';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskCardComponent],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskBoardComponent {
  @Input() tasks: readonly Task[] = [];
  @Input() loading = false;
  @Input() filtered = false;
  @Input() busyTaskId: string | null = null;
  @Output() edit = new EventEmitter<Task>();
  @Output() remove = new EventEmitter<Task>();
  @Output() statusMove = new EventEmitter<TaskStatusMove>();

  readonly columns = TASK_BOARD_COLUMNS;
  readonly labels = TASK_STATUS_LABELS;

  tasksFor(status: TaskStatus): Task[] {
    return this.tasks.filter((task) => task.status === status);
  }

  columnId(status: TaskStatus): string {
    return `task-column-${status}`;
  }

  connectedColumnIds(status: TaskStatus): string[] {
    return this.columns.filter((item) => item !== status).map((item) => this.columnId(item));
  }

  isBusy(task: Task): boolean {
    return this.busyTaskId === task.id;
  }

  drop(event: CdkDragDrop<TaskStatus, TaskStatus, Task>): void {
    const task = event.item.data;
    const fromStatus = event.previousContainer.data;
    const toStatus = event.container.data;

    if (!task || fromStatus === toStatus || task.status !== fromStatus || this.isBusy(task)) {
      return;
    }

    this.statusMove.emit({ task, fromStatus, toStatus });
  }

  trackByStatus(_index: number, status: TaskStatus): TaskStatus {
    return status;
  }

  trackByTask(_index: number, task: Task): string {
    return task.id;
  }
}
