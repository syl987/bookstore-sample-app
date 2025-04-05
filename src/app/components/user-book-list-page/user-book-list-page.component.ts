import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { isTruthy } from 'src/app/functions/typeguard.functions';
import { DialogService } from 'src/app/services/dialog.service';
import { UserBooksService } from 'src/app/services/user-books.service';

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';
import { UserBookCardContentComponent } from '../user-book-card-content/user-book-card-content.component';
import { VolumeCardComponent } from '../volume-card/volume-card.component';

@Component({
  selector: 'app-user-book-list-page',
  imports: [RouterModule, MatButtonModule, MatProgressSpinnerModule, TitleBarComponent, VolumeCardComponent, UserBookCardContentComponent],
  templateUrl: './user-book-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookListPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly userBooksService = inject(UserBooksService);
  private readonly dialogService = inject(DialogService);

  readonly userBooksDraft = this.userBooksService.entitiesDraft;
  readonly userBooksPublished = this.userBooksService.entitiesPublished;
  readonly userBooksSold = this.userBooksService.entitiesSold;
  readonly userBooksBought = this.userBooksService.entitiesBought;

  readonly userBooksLoading = this.userBooksService.loadPending;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

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
