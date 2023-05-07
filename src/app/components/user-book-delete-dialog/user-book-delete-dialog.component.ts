import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-user-book-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './user-book-delete-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookDeleteDialogComponent {}
