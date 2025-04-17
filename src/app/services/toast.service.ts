import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';

import { ToastComponent, ToastData } from '../components/__base/toast/toast.component';

export interface ToastConfig extends Pick<MatSnackBarConfig<never>, 'duration'> {
  action?: { name: string; icon: string };
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  protected readonly snackbar = inject(MatSnackBar);

  showInfoToast(message: string, options?: ToastConfig): MatSnackBarRef<ToastComponent> {
    const data: ToastData = {
      icon: 'priority_high',
      message,
      action: options?.action,
    };
    return this.snackbar.openFromComponent(ToastComponent, { duration: 9 * 1000, ...options, data, panelClass: 'app-primary' });
  }

  showSuccessToast(message: string, options?: ToastConfig): MatSnackBarRef<ToastComponent> {
    const data: ToastData = {
      icon: 'check',
      message,
      action: options?.action,
    };
    return this.snackbar.openFromComponent(ToastComponent, { duration: 5 * 1000, ...options, data, panelClass: 'app-tertiary' });
  }

  showErrorToast(message: string, options?: ToastConfig): MatSnackBarRef<ToastComponent> {
    const data: ToastData = {
      icon: 'close',
      message,
      action: options?.action,
    };
    return this.snackbar.openFromComponent(ToastComponent, { duration: 7 * 1000, ...options, data, panelClass: 'app-error' });
  }
}
