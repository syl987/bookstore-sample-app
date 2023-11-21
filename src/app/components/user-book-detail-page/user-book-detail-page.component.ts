import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { BookCondition, BookStatus } from 'src/app/models/book.models';
import { BookConditionPipe } from 'src/app/pipes/book-condition.pipe';
import { RouterService } from 'src/app/services/router.service';
import { UserBooksService } from 'src/app/services/user-books.service';

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';
import { VolumeCardComponent } from '../volume-card/volume-card.component';
import { VolumeOfferFieldsComponent } from '../volume-offer-fields/volume-offer-fields.component';

@Component({
  selector: 'app-user-book-detail-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, TitleBarComponent, VolumeCardComponent, VolumeOfferFieldsComponent, BookConditionPipe],
  templateUrl: './user-book-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookDetailPageComponent {
  id: string = this.route.snapshot.params['bookId'];

  readonly book$ = this.userBooksService.entityByRoute$;

  readonly BookStatus = BookStatus;
  readonly BookCondition = BookCondition;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly routerService: RouterService,
    private readonly userBooksService: UserBooksService,
  ) {
    this.routerService
      .selectRouteParam('bookId')
      .pipe(takeUntilDestroyed())
      .subscribe(id => {
        if (id) {
          this.id = id;
          this.userBooksService.load(id);
        }
      });
  }
}
