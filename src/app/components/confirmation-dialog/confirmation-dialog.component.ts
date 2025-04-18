import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export interface ConfirmationDialogData {
  title: string;
  description: string;
  action: string;
  theme?: 'primary' | 'success' | 'error';
}

@Component({
  selector: 'app-confirmation-dialog',
  imports: [NgClass, MatButtonModule, MatDialogModule],
  templateUrl: './confirmation-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent {
  readonly data = inject<ConfirmationDialogData>(MAT_DIALOG_DATA);

  readonly themeClass = this.data.theme === 'success' ? 'app-tertiary' : this.data.theme === 'error' ? 'app-error' : '';
}
