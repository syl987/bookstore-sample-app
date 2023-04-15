import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { UserBooksService } from 'src/app/services/user-books.service';

// TODO consider revamping data model: volumes_with_books, user_books_as_volume_ids, user_bought_books_as_volume_ids, book_volume_id (check if efficient querying is possible)

// TODO display user books with volume data
// TODO display bought books with volume data
// TODO display books separately by status (draft, published, sold, bought)
// TODO navigate to book edit

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

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly userBooksService: UserBooksService,
    private readonly dialogService: DialogService,
  ) {}

  openBookCreateDialog(): void {
    const dialogRef = this.dialogService.openBookCreateDialog();

    dialogRef.beforeClosed().subscribe(bookId => {
      if (bookId) {
        this.router.navigateByUrl('/user/books/' + bookId + '/edit');
      }
    });
  }

  ngOnInit(): void {
    this.userBooksService.loadAll();
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
