import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
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
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, TitleBarComponent, VolumeCardComponent, UserBookCardContentComponent],
  templateUrl: './user-book-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookListPageComponent implements OnInit {
  readonly userBooksDraft = toSignal(this.userBooksService.entitiesDraft$, { requireSync: true });
  readonly userBooksPublished = toSignal(this.userBooksService.entitiesPublished$, { requireSync: true });
  readonly userBooksSold = toSignal(this.userBooksService.entitiesSold$, { requireSync: true });
  readonly userBooksBought = toSignal(this.userBooksService.entitiesBought$, { requireSync: true });

  constructor(private readonly router: Router, private readonly userBooksService: UserBooksService, private readonly dialogService: DialogService) {}

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
