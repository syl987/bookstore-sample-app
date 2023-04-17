import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DialogService } from 'src/app/services/dialog.service';
import { UserBooksService } from 'src/app/services/user-books.service';

@Component({
  selector: 'app-user-book-list-page',
  templateUrl: './user-book-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookListPageComponent implements OnInit, OnDestroy {
  readonly booksDraft$ = this.userBooksService.userBooksDraft$;
  readonly booksPublished$ = this.userBooksService.userBooksPublished$;
  readonly booksSold$ = this.userBooksService.userBooksSold$;

  // TODO check where destroyed is really needed
  private readonly _destroyed$ = new Subject<void>();

  constructor(private readonly router: Router, private readonly userBooksService: UserBooksService, private readonly dialogService: DialogService) {}

  ngOnInit(): void {
    this.userBooksService.loadAll();
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  openBookCreateDialog(): void {
    const dialogRef = this.dialogService.openBookCreateDialog();

    dialogRef.beforeClosed().subscribe(book => {
      if (book) {
        this.router.navigateByUrl('/user/books/' + book.id + '/edit');
      }
    });
  }
}
