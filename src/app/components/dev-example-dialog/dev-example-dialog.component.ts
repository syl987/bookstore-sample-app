import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export interface ExampleDevDialogData {
  text?: string;
}

@Component({
  selector: 'ib-dev-example-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './dev-example-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevExampleDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) readonly data: ExampleDevDialogData) {}
}
