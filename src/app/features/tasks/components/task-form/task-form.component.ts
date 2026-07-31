import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { TASK_STATUS_LABELS, TASK_STATUSES, isTaskStatus, type CreateTaskRequest, type Task, type TaskStatus, type UpdateTaskRequest } from '../../models/task.model';

const meaningfulTitle = (control: AbstractControl): ValidationErrors | null => typeof control.value === 'string' && control.value.trim() ? null : { blank: true };
const supportedStatus = (control: AbstractControl): ValidationErrors | null => isTaskStatus(control.value) ? null : { invalidStatus: true };

@Component({ selector: 'app-task-form', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './task-form.component.html', styleUrl: './task-form.component.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class TaskFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private currentTask: Task | null = null;
  @Input() set task(value: Task | null) { this.currentTask = value; this.form.reset({ title: value?.title ?? '', description: value?.description ?? '', status: value?.status ?? 'pending' }); }
  @Input() loading = false;
  @Input() error: string | null = null;
  @Output() submitted = new EventEmitter<CreateTaskRequest | UpdateTaskRequest>();
  @Output() cancelled = new EventEmitter<void>();
  readonly statuses = TASK_STATUSES;
  readonly labels = TASK_STATUS_LABELS;
  readonly form = this.fb.group({ title: this.fb.control('', [Validators.required, meaningfulTitle, Validators.maxLength(100)]), description: this.fb.control('', [Validators.maxLength(500)]), status: this.fb.control<TaskStatus>('pending', [Validators.required, supportedStatus]) });
  get editing(): boolean { return this.currentTask !== null; }
  errorFor(control: keyof typeof this.form.controls): string | null { const field = this.form.controls[control]; if (!field.touched) return null; if (field.hasError('required') || field.hasError('blank')) return control === 'title' ? 'El título es obligatorio.' : 'Selecciona un estado válido.'; if (field.hasError('maxlength')) return control === 'title' ? 'El título admite máximo 100 caracteres.' : 'La descripción admite máximo 500 caracteres.'; if (field.hasError('invalidStatus')) return 'Selecciona un estado válido.'; return null; }
  submit(): void { if (this.form.invalid) { this.form.markAllAsTouched(); return; } const value = this.form.getRawValue(); this.submitted.emit({ title: value.title.trim(), description: value.description.trim() || undefined, status: value.status }); }
}
