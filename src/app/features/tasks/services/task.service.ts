import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, timeout } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api.config';
import type { CreateTaskRequest, Task, UpdateTaskRequest } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(API_CONFIG);
  private readonly tasksUrl = `${this.apiConfig.baseUrl}/tasks`;

  getTasks(): Observable<Task[]> {
    return this.withTimeout(this.http.get<Task[]>(this.tasksUrl));
  }

  getTaskById(id: string): Observable<Task> {
    return this.withTimeout(this.http.get<Task>(`${this.tasksUrl}/${encodeURIComponent(id)}`));
  }

  createTask(request: CreateTaskRequest): Observable<Task> {
    return this.withTimeout(this.http.post<Task>(this.tasksUrl, request));
  }

  updateTask(id: string, request: UpdateTaskRequest): Observable<Task> {
    return this.withTimeout(
      this.http.put<Task>(`${this.tasksUrl}/${encodeURIComponent(id)}`, request),
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.withTimeout(
      this.http.delete<void>(`${this.tasksUrl}/${encodeURIComponent(id)}`),
    );
  }

  private withTimeout<T>(request: Observable<T>): Observable<T> {
    return request.pipe(timeout(this.apiConfig.timeoutMs));
  }
}
