import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BookCondition, BookStatus } from 'src/app/models/book.models';
import { RouterService } from 'src/app/services/router.service';
import { UserBooksService } from 'src/app/services/user-books.service';

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';
import { VolumeCardComponent } from '../volume-card/volume-card.component';
import { VolumeOfferFieldsComponent } from '../volume-offer-fields/volume-offer-fields.component';

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

  readonly bookId = computed(() => this.routerService.routeParams().bookId!); // mandatory param defined by route

  readonly book = this.userBooksService.entityByRoute;
  readonly bookLoading = this.userBooksService.loadPending;

  readonly BookStatus = BookStatus;
  readonly BookCondition = BookCondition;

  ngOnInit(): void {
    this.userBooksService.load(this.bookId());
  }
}
