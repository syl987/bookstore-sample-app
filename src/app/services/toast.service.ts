import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

type ToastConfig = Pick<MatSnackBarConfig<never>, 'duration'>;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private readonly snackbar: MatSnackBar) {}

  showSuccessToast(message: string, options?: ToastConfig): MatSnackBarRef<SimpleSnackBar> {
    return this.snackbar.open(message, undefined, { duration: 5000, ...options, panelClass: 'success' });
  }

  showErrorToast(message: string, options?: ToastConfig): MatSnackBarRef<SimpleSnackBar> {
    return this.snackbar.open(message, undefined, { duration: 7000, ...options, panelClass: 'error' });
  }

  showInfoToast(message: string, options?: ToastConfig): MatSnackBarRef<SimpleSnackBar> {
    return this.snackbar.open(message, undefined, { duration: 7000, ...options, panelClass: 'info' });
  }
}
