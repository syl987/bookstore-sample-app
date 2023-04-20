import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UserBookDTO } from 'src/app/models/book.models';

// TODO use volume card as baseline with content projection
// TODO loading appearence

@Component({
  selector: 'app-user-book-card',
  templateUrl: './user-book-card.component.html',
  styles: ['.mat-mdc-card-sm-image { width: inherit; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookCardComponent {
  @Input() book?: UserBookDTO | null;
}
