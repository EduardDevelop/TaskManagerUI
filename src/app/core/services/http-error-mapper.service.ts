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
      case 404:
        return { type: 'not_found', status: 404, message: 'La tarea solicitada no existe o fue eliminada.' };
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
    return null;
  }
}