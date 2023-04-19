import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-book-delete-dialog',
  templateUrl: './user-book-delete-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookDeleteDialogComponent {}
