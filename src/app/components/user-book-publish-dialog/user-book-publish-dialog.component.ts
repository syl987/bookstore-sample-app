import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-book-publish-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-book-publish-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookPublishDialogComponent {}
