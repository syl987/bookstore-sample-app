import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UserBookDTO } from 'src/app/models/book.models';

// TODO loading appearence

@Component({
  selector: 'app-user-book-card',
  templateUrl: './user-book-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookCardComponent {
  @Input() book?: UserBookDTO | null;
}
