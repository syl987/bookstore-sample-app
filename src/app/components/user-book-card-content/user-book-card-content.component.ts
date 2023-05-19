import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { UserBookDTO } from 'src/app/models/book.models';
import { BookConditionPipe } from 'src/app/pipes/book-condition.pipe';

@Component({
  selector: 'app-user-book-card-content',
  standalone: true,
  imports: [CommonModule, MatDividerModule, BookConditionPipe],
  templateUrl: './user-book-card-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookCardContentComponent {
  @Input({ required: true }) book!: UserBookDTO;

  getCompletionStatus(): 'empty' | 'ready' | 'partial' {
    // TODO add picture
    if (this.book.condition == null && this.book.price == null && this.book.description == null) {
      return 'empty';
    }
    if (this.book.condition != null && this.book.price != null && this.book.description != null) {
      return 'ready';
    }
    return 'partial';
  }
}
