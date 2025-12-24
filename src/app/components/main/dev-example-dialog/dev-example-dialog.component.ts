import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ExampleDevDialogData {
  text?: string;
}

@Component({
  selector: 'app-dev-example-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './dev-example-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevExampleDialogComponent {
  readonly data = inject<ExampleDevDialogData>(MAT_DIALOG_DATA);
}
