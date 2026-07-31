import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  NgZone,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { AlertService } from '../../../../core/services/alert.service';
import { HttpErrorMapperService } from '../../../../core/services/http-error-mapper.service';
import { TaskBoardComponent } from '../../components/task-board/task-board.component';
import { TaskFiltersComponent } from '../../components/task-filters/task-filters.component';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import type { CreateTaskRequest, Task, TaskStatusMove, UpdateTaskRequest } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { filterTasks, isDateRangeInvalid, type TaskFilter } from '../../utils/task-filtering';
import { hasDuplicateTitle } from '../../utils/task-validation';

@Component({
  selector: 'app-task-page',
  standalone: true,
  imports: [CommonModule, TaskFormComponent, TaskFiltersComponent, TaskBoardComponent],
  templateUrl: './task-page.component.html',
  styleUrl: './task-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskPageComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly errors = inject(HttpErrorMapperService);
  private readonly alerts = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly zone = inject(NgZone);

  tasks: readonly Task[] = [];
  loading = false;
  loadError: string | null = null;
  formError: string | null = null;
  saving = false;
  busyTaskId: string | null = null;
  editingTask: Task | null = null;
  showForm = false;
  filter: TaskFilter = { searchTerm: '', status: 'all' };

  get visibleTasks(): Task[] {
    return filterTasks(this.tasks, this.filter);
  }

  get filtersActive(): boolean {
    return this.filter.searchTerm.trim().length > 0
      || this.filter.status !== 'all'
      || Boolean(this.filter.createdFrom || this.filter.createdTo);
  }

  get invalidFilterRange(): boolean {
    return isDateRangeInvalid(this.filter);
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.commitState(() => {
      this.loading = true;
      this.loadError = null;
    });

    this.taskService.getTasks().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.commitState(() => { this.loading = false; })),
    ).subscribe({
      next: (tasks) => this.commitState(() => { this.tasks = [...tasks]; }),
      error: (error: unknown) => this.commitState(() => {
        this.loadError = this.errors.map(error).message;
      }),
    });
  }

  openCreate(): void {
    this.commitState(() => {
      this.editingTask = null;
      this.formError = null;
      this.showForm = true;
    });
  }

  openEdit(task: Task): void {
    this.commitState(() => {
      this.editingTask = { ...task };
      this.formError = null;
      this.showForm = true;
    });
  }

  closeForm(): void {
    this.commitState(() => {
      this.showForm = false;
      this.editingTask = null;
      this.formError = null;
    });
  }

  async save(request: CreateTaskRequest | UpdateTaskRequest): Promise<void> {
    if (this.saving) return;

    this.commitState(() => { this.formError = null; });
    const taskId = this.editingTask?.id;

    if (!taskId && hasDuplicateTitle(this.tasks, request.title)) {
      const duplicateMessage = 'Ya existe una tarea con ese titulo.';
      this.commitState(() => { this.formError = duplicateMessage; });
      void this.alerts.error('Titulo duplicado', duplicateMessage);
      return;
    }

    if (taskId) {
      const confirmed = await this.alerts.confirm({
        title: 'Confirmar actualizacion',
        text: 'Se actualizara la informacion de esta tarea.',
        confirmButtonText: 'Actualizar',
        icon: 'question',
      });

      if (!confirmed) return;
    }

    this.commitState(() => { this.saving = true; });

    const operation = taskId
      ? this.taskService.updateTask(taskId, request as UpdateTaskRequest)
      : this.taskService.createTask(request as CreateTaskRequest);

    operation.pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.commitState(() => { this.saving = false; })),
    ).subscribe({
      next: (task) => {
        this.commitState(() => {
          this.tasks = taskId
            ? this.tasks.map((item) => item.id === task.id ? task : item)
            : [...this.tasks, task];
          this.showForm = false;
          this.editingTask = null;
          this.formError = null;
        });

        void this.alerts.success(
          taskId ? 'Tarea actualizada' : 'Tarea creada',
          taskId ? 'Los cambios fueron guardados correctamente.' : 'La tarea fue agregada al tablero.',
        );
      },
      error: (error: unknown) => {
        const mapped = this.errors.map(error);
        this.commitState(() => { this.formError = mapped.message; });
        void this.alerts.error(taskId ? 'No se pudo actualizar' : 'No se pudo crear', mapped.message);
      },
    });
  }

  async requestDelete(task: Task): Promise<void> {
    if (this.busyTaskId) return;

    const confirmed = await this.alerts.confirm({
      title: 'Eliminar tarea',
      text: `Se eliminara "${task.title}". Esta accion no se puede deshacer.`,
      confirmButtonText: 'Eliminar',
      icon: 'warning',
    });

    if (!confirmed) return;

    this.commitState(() => { this.busyTaskId = task.id; });

    this.taskService.deleteTask(task.id).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.commitState(() => { this.busyTaskId = null; })),
    ).subscribe({
      next: () => {
        this.commitState(() => {
          this.tasks = this.tasks.filter((item) => item.id !== task.id);
        });
        void this.alerts.success('Tarea eliminada', 'La tarea fue removida del tablero.');
      },
      error: (error: unknown) => {
        const mapped = this.errors.map(error);
        void this.alerts.error('No se pudo eliminar', mapped.message);
        if (mapped.type === 'not_found') this.loadTasks();
      },
    });
  }

  async moveTaskStatus(move: TaskStatusMove): Promise<void> {
    if (this.busyTaskId || move.toStatus === move.fromStatus) return;

    const confirmed = await this.alerts.confirm({
      title: 'Cambiar estado',
      text: `Mover "${move.task.title}" a un nuevo estado.`,
      confirmButtonText: 'Mover',
      icon: 'question',
    });

    if (!confirmed) return;

    this.commitState(() => { this.busyTaskId = move.task.id; });

    const request: UpdateTaskRequest = {
      title: move.task.title,
      description: move.task.description,
      status: move.toStatus,
    };

    this.taskService.updateTask(move.task.id, request).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.commitState(() => { this.busyTaskId = null; })),
    ).subscribe({
      next: (updated) => {
        this.commitState(() => {
          this.tasks = this.tasks.map((item) => item.id === updated.id ? updated : item);
        });
        void this.alerts.success('Estado actualizado', 'La tarea fue movida en el tablero.');
      },
      error: (error: unknown) => {
        void this.alerts.error('No se pudo cambiar el estado', this.errors.map(error).message);
      },
    });
  }

  updateFilter(filter: TaskFilter): void {
    this.commitState(() => { this.filter = { ...filter }; });
  }

  private commitState(update: () => void): void {
    this.zone.run(() => {
      update();
      this.cdr.markForCheck();
    });
  }
}
