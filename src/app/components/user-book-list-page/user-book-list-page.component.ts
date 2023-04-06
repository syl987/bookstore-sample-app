import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BookService } from 'src/app/services/book.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-user-book-list-page',
  templateUrl: './user-book-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookListPageComponent implements OnInit, OnDestroy {
  readonly books$ = this.bookService.entities$.pipe(map(books => books.filter(book => book.sellerUid === this.authService.uid)));

  private readonly _destroyed$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly dialogService: DialogService,
    private readonly bookService: BookService
  ) {}

  openBookCreateDialog(): void {
    const dialogRef = this.dialogService.openBookCreateDialog();

    dialogRef.beforeClosed().subscribe(book => {
      if (book) {
        this.router.navigateByUrl('/user/books/' + book.id + '/edit');
      }
    });
  }

  ngOnInit(): void {
    this.bookService.getAll(); // TODO just my books
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
