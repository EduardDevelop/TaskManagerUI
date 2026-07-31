import { Injectable } from '@angular/core';
import Swal, { type SweetAlertIcon, type SweetAlertOptions } from 'sweetalert2';

export interface AlertConfirmOptions {
  readonly title: string;
  readonly text?: string;
  readonly confirmButtonText?: string;
  readonly cancelButtonText?: string;
  readonly icon?: SweetAlertIcon;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  async confirm(options: AlertConfirmOptions): Promise<boolean> {
    const result = await Swal.fire({
      title: options.title,
      text: options.text,
      icon: options.icon ?? 'question',
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText ?? 'Confirmar',
      cancelButtonText: options.cancelButtonText ?? 'Cancelar',
      reverseButtons: true,
      focusCancel: true,
      heightAuto: false,
    });

    return result.isConfirmed;
  }

  success(title: string, text?: string): Promise<unknown> {
    return this.notify('success', title, text);
  }

  error(title: string, text?: string): Promise<unknown> {
    return this.notify('error', title, text);
  }

  info(title: string, text?: string): Promise<unknown> {
    return this.notify('info', title, text);
  }

  private notify(icon: SweetAlertIcon, title: string, text?: string): Promise<unknown> {
    const options: SweetAlertOptions = {
      title,
      text,
      icon,
      confirmButtonText: 'Aceptar',
      heightAuto: false,
    };

    return Swal.fire(options);
  }
}
