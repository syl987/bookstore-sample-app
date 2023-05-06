import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UserBookDTO } from 'src/app/models/book.models';

@Component({
  selector: 'app-user-book-card-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-book-card-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookCardContentComponent {
  @Input({ required: true }) book!: UserBookDTO;
}
