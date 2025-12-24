import { ChangeDetectionStrategy, Component, inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BookCondition, BookStatus } from 'src/app/models/book.models';
import { RouterService } from 'src/app/services/router.service';
import { UserBooksService } from 'src/app/services/user-books.service';

import { TitleBarComponent } from '../../base/title-bar/title-bar.component';
import { VolumeCardComponent } from '../../volumes/volume-card/volume-card.component';
import { VolumeOfferFieldsComponent } from '../../volumes/volume-offer-fields/volume-offer-fields.component';

@Component({
  selector: 'app-user-book-detail-page',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TitleBarComponent,
    VolumeCardComponent,
    VolumeOfferFieldsComponent,
  ],
  templateUrl: './user-book-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookDetailPageComponent implements OnInit {
  protected readonly routerService = inject(RouterService);
  protected readonly userBooksService = inject(UserBooksService);

  readonly bookId = toSignal(this.routerService.params$.bookId, { requireSync: true }) as Signal<string>; // mandatory param defined by route

  readonly book = toSignal(this.userBooksService.entityByRouteParam$, { requireSync: true });
  readonly bookLoading = toSignal(this.userBooksService.loadPending$, { requireSync: true });

  readonly BookStatus = BookStatus;
  readonly BookCondition = BookCondition;

  ngOnInit(): void {
    this.userBooksService.load(this.bookId());
  }
}
