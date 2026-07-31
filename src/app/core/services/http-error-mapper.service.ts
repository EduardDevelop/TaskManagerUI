import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TimeoutError } from 'rxjs';
import type { ApplicationError } from '../models/application-error.model';

@Injectable({ providedIn: 'root' })
export class HttpErrorMapperService {
  map(error: unknown): ApplicationError {
    if (error instanceof TimeoutError) {
      return { type: 'timeout', message: 'La solicitud tardó demasiado. Inténtalo nuevamente.' };
    }

    if (!(error instanceof HttpErrorResponse)) {
      return { type: 'unknown', message: 'Ocurrió un error inesperado. Inténtalo nuevamente.' };
    }

    const apiMessage = this.safeMessage(error.error);
    switch (error.status) {
      case 0:
        return { type: 'network', message: 'No fue posible conectarse con el servidor.' };
      case 400:
        return { type: 'validation', status: 400, message: apiMessage ?? 'La información enviada no es válida.' };
      case 401:
        return { type: 'unknown', status: 401, message: apiMessage ?? 'No tienes autorización para realizar esta acción.' };
      case 404:
        return { type: 'not_found', status: 404, message: apiMessage ?? 'La tarea solicitada no existe o fue eliminada.' };
      case 500:
        return { type: 'server', status: 500, message: 'Ocurrió un error en el servidor. Inténtalo más tarde.' };
      default:
        return { type: error.status >= 500 ? 'server' : 'unknown', status: error.status, message: 'Ocurrió un error inesperado. Inténtalo nuevamente.' };
    }
  }

  private safeMessage(value: unknown): string | null {
    if (typeof value === 'string' && value.length < 240) return value;
    if (value && typeof value === 'object' && 'message' in value && typeof value.message === 'string') {
      return value.message.length < 240 ? value.message : null;
    }
    if (value && typeof value === 'object' && 'error' in value && value.error && typeof value.error === 'object' && 'message' in value.error && typeof value.error.message === 'string') {
      return value.error.message.length < 240 ? value.error.message : null;
    }
    return null;
  }
}
