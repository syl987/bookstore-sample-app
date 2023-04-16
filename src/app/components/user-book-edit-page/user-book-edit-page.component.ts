import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Subject, takeUntil } from 'rxjs';
import { BookCondition, UserBookEditDraftDTO } from 'src/app/models/book.models';
import { RouterService } from 'src/app/services/router.service';
import { UserBooksService } from 'src/app/services/user-books.service';

// TODO disabled controls if published or sold
// TODO delete book (if not sold)
// TODO navigate to user books after an action (need correlation ids?)
// TODO display spinners on pending actions
// TODO publish confirm dialog
// TODO check button and field behavior correct
// TODO check validations on publish

@Component({
  selector: 'app-user-book-edit-page',
  templateUrl: './user-book-edit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookEditPageComponent implements OnInit, OnDestroy {
  readonly id: string = this.route.snapshot.params['bookId'];

  readonly book$ = this.userBooksService.userBookByRoute$;

  readonly BookCondition = BookCondition;

  readonly form = this.fb.nonNullable.group({
    description: new FormControl<string | null>(null),
    condition: new FormControl<BookCondition | null>(null),
    price: new FormControl<number | null>(null),
  });

  private readonly _resetFields = new BehaviorSubject<void>(undefined);
  private readonly _destroyed$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly routerService: RouterService,
    private readonly userBooksService: UserBooksService,
  ) {}

  ngOnInit(): void {
    this.userBooksService.load(this.id);
    this.routerService.navigated$.pipe(takeUntil(this._destroyed$)).subscribe(_ => {
      this.userBooksService.loadAll(); // TODO load just one
    });

    combineLatest([this.book$, this._resetFields])
      .pipe(takeUntil(this._destroyed$))
      .subscribe(([book]) => {
        this.form.setValue({
          description: book?.description ?? null,
          condition: book?.condition ?? null,
          price: book?.price ?? null,
        });
      });
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  saveChanges(): void {
    const data: UserBookEditDraftDTO = {
      description: this.form.value.description,
      condition: this.form.value.condition,
      price: this.form.value.price,
    };
    this.userBooksService.editDraft(this.id, data);
  }

  discardChanges(): void {
    this._resetFields.next();
  }

  publishBook(): void {
    this.userBooksService.publish(this.id); // TODO kick static variables
  }

  deleteBook(): void {
    throw new Error('Method not implemented.');
  }
}
