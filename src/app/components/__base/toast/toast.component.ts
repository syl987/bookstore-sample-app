import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SimpleSnackBar, MatSnackBarModule, MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

export interface ToastData {
  message: string;
  icon: string;
  action?: { name: string; icon: string };
}

@Component({
  selector: 'app-toast',
  imports: [MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toast' },
})
export class ToastComponent extends SimpleSnackBar {
  override readonly snackBarRef = inject<MatSnackBarRef<ToastComponent>>(MatSnackBarRef);
  override readonly data = inject<ToastData>(MAT_SNACK_BAR_DATA);
}
