import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BookCondition } from 'src/app/models/book.models';
import { RouterService } from 'src/app/services/router.service';
import { UserBooksService } from 'src/app/services/user-books.service';

// TODO display volume data
// TODO edit book data (if not published or sold)
// TODO delete book (if not sold)
// TODO navigate to user books

@Component({
  selector: 'app-user-book-edit-page',
  templateUrl: './user-book-edit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookEditPageComponent implements OnInit, OnDestroy {
  readonly id: string = this.route.snapshot.params['bookId'];

  readonly book$ = this.userBooksService.userBookByRoute$;

  readonly BookCondition = BookCondition;

  private readonly _destroyed$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly routerService: RouterService,
    private readonly userBooksService: UserBooksService,
  ) {}

  ngOnInit(): void {
    this.userBooksService.load(this.id);
    this.routerService.navigated$.pipe(takeUntil(this._destroyed$)).subscribe(_ => {
      this.userBooksService.loadAll(); // TODO query the right book
    });
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  publish(): void {
    this.userBooksService.publish(this.id);
  }
}
