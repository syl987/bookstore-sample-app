import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-book-delete-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-book-delete-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookDeleteDialogComponent {}
