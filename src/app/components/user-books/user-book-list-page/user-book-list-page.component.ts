import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

import { isTruthy } from 'src/app/functions/typeguard.functions';
import { DialogService } from 'src/app/services/dialog.service';
import { UserBooksService } from 'src/app/services/user-books.service';

import { TitleBarComponent } from '../../base/title-bar/title-bar.component';
import { UserBookCardContentComponent } from '../user-book-card-content/user-book-card-content.component';
import { VolumeCardComponent } from '../../volumes/volume-card/volume-card.component';

@Component({
  selector: 'app-user-book-list-page',
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    TitleBarComponent,
    VolumeCardComponent,
    UserBookCardContentComponent,
  ],
  templateUrl: './user-book-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookListPageComponent implements OnInit {
  protected readonly router = inject(Router);
  protected readonly userBooksService = inject(UserBooksService);
  protected readonly dialogService = inject(DialogService);

  readonly userBooksDraft = toSignal(this.userBooksService.entitiesDraft$, { requireSync: true });
  readonly userBooksPublished = toSignal(this.userBooksService.entitiesPublished$, { requireSync: true });
  readonly userBooksSold = toSignal(this.userBooksService.entitiesSold$, { requireSync: true });
  readonly userBooksBought = toSignal(this.userBooksService.entitiesBought$, { requireSync: true });

  readonly userBooksLoading = toSignal(this.userBooksService.loadPending$, { requireSync: true });

  ngOnInit(): void {
    this.userBooksService.loadAll();
  }

  createBook(): void {
    this.dialogService
      .openUserBookCreateDialog()
      .beforeClosed()
      .pipe(filter(isTruthy))
      .subscribe(book => {
        this.router.navigateByUrl('/user/books/' + book.id + '/edit');
      });
  }
}
