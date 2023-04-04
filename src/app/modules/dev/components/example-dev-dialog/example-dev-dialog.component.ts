import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

export interface ExampleDevDialogData {
  text?: string;
}

@Component({
  selector: 'ib-example-dev-dialog',
  templateUrl: './example-dev-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleDevDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) readonly data: ExampleDevDialogData) {}
}
