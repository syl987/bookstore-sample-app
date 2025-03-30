import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { UserBookDTO } from 'src/app/models/book.models';
import { BookConditionPipe } from 'src/app/pipes/book-condition.pipe';

@Component({
  selector: 'app-user-book-card-content',
  imports: [MatDividerModule, BookConditionPipe, CurrencyPipe],
  templateUrl: './user-book-card-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookCardContentComponent {
  readonly book = input.required<UserBookDTO>();
}
