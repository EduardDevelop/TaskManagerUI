import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, timeout } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api.config';
import type { CreateTaskRequest, Task, UpdateTaskRequest } from '../models/task.model';

interface ApiSuccessResponse<T> {
  readonly success: true;
  readonly data: T;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(API_CONFIG);
  private readonly tasksUrl = `${this.apiConfig.baseUrl}/tasks`;

  getTasks(): Observable<Task[]> {
    return this.withTimeout(
      this.http
        .get<ApiSuccessResponse<Task[]> | Task[]>(this.tasksUrl)
        .pipe(map((response) => this.unwrapCollection(response))),
    );
  }

  getTaskById(id: string): Observable<Task> {
    return this.withTimeout(
      this.http
        .get<ApiSuccessResponse<Task> | Task>(`${this.tasksUrl}/${encodeURIComponent(id)}`)
        .pipe(map((response) => this.unwrapData(response))),
    );
  }

  createTask(request: CreateTaskRequest): Observable<Task> {
    return this.withTimeout(
      this.http
        .post<ApiSuccessResponse<Task> | Task>(this.tasksUrl, request)
        .pipe(map((response) => this.unwrapData(response))),
    );
  }

  updateTask(id: string, request: UpdateTaskRequest): Observable<Task> {
    return this.withTimeout(
      this.http
        .put<ApiSuccessResponse<Task> | Task>(`${this.tasksUrl}/${encodeURIComponent(id)}`, request)
        .pipe(map((response) => this.unwrapData(response))),
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

  private unwrapCollection(response: ApiSuccessResponse<Task[]> | Task[]): Task[] {
    const data = this.unwrapData(response);
    return Array.isArray(data) ? data : [];
  }

  private unwrapData<T>(response: ApiSuccessResponse<T> | T): T {
    if (response && typeof response === 'object' && 'data' in response) {
      return response.data as T;
    }
    return response as T;
  }
}
