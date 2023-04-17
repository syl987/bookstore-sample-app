import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subject, takeUntil } from 'rxjs';
import { BookCondition, BookStatus, UserBookEditDraftDTO } from 'src/app/models/book.models';
import { RouterService } from 'src/app/services/router.service';
import { UserBooksService } from 'src/app/services/user-books.service';

// TODO remove details from the card
// TODO publish confirm dialog
// TODO navigate to user books after an action (need correlation ids?)
// TODO delete book (if not sold)
// TODO separate spinners for separate actions

@Component({
  selector: 'app-user-book-edit-page',
  templateUrl: './user-book-edit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookEditPageComponent implements OnInit, OnDestroy {
  readonly id: string = this.route.snapshot.params['bookId'];

  readonly book$ = this.userBooksService.userBookByRoute$;

  readonly pending$ = this.userBooksService.pending$;

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
    private readonly router: Router,
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
        if (book?.status !== BookStatus.DRAFT) {
          this.form.disable();
        } else {
          this.form.enable();
        }
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
    // TODO kick static variables
    this.userBooksService.publish(this.id).subscribe({
      next: _ => this.router.navigateByUrl(`/user/books`),
      error: err => {
        // reliably retrieve error details
        const errors: { [key: string]: ValidationErrors | null } = err?.err?.customData ?? {};

        this.form.controls.description.setErrors(errors['description']);
        this.form.controls.condition.setErrors(errors['condition']);
        this.form.controls.price.setErrors(errors['price']);
        this.form.markAllAsTouched();
      },
    });
  }

  deleteBook(): void {
    throw new Error('Method not implemented.');
  }
}
