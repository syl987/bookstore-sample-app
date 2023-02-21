import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

type SimpleSnackBarConfig = Pick<MatSnackBarConfig<never>, 'duration'>;

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    constructor(private readonly snackbar: MatSnackBar) {}

    showSuccessToast(message: string, options?: SimpleSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
        return this.snackbar.open(message, undefined, { duration: 5000, ...options, panelClass: 'success' });
    }

    showErrorToast(message: string, options?: SimpleSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
        return this.snackbar.open(message, undefined, { duration: 7000, ...options, panelClass: 'warn' });
    }

    showInfoToast(message: string, options?: SimpleSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
        return this.snackbar.open(message, undefined, { duration: 7000, ...options, panelClass: 'info' });
    }
}
