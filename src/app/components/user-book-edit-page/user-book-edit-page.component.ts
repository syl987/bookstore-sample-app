import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { concatMap, filter, map, takeUntil } from 'rxjs/operators';
import { isTrue } from 'src/app/functions/typeguard.functions';
import { BookCondition, BookStatus, UserBookEditDraftDTO } from 'src/app/models/book.models';
import { DialogService } from 'src/app/services/dialog.service';
import { RouterService } from 'src/app/services/router.service';
import { UserBooksService } from 'src/app/services/user-books.service';

// TODO use volume card with published books info
// TODO add navigation to volume, if published books exist
// TODO navigate to user books after an action (need correlation ids?)
// TODO delete book (if not sold)
// TODO add support for 404

@Component({
  selector: 'app-user-book-edit-page',
  templateUrl: './user-book-edit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookEditPageComponent implements OnInit, OnDestroy {
  readonly id: string = this.route.snapshot.params['bookId'];

  readonly book$ = this.userBooksService.userBookByRoute$;
  readonly editingDraft$ = this.userBooksService.editingDraft$;
  readonly publishing$ = this.userBooksService.publishing$;
  readonly deleting$ = this.userBooksService.deleting$;

  readonly editDraftDisabled$ = this.editingDraft$.pipe(map(editing => editing || this.form.disabled)); // TODO false on startup

  readonly publishDisabled$ = combineLatest([this.publishing$, this.book$]).pipe(map(([publishing, book]) => publishing || book?.status !== BookStatus.DRAFT));
  readonly deleteDisabled$ = combineLatest([this.deleting$, this.book$]).pipe(map(([deleting, book]) => deleting || book?.status !== BookStatus.DRAFT));

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
    private readonly dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.routerService.params$.pipe(takeUntil(this._destroyed$)).subscribe(params => {
      if (params?.bookId) {
        this.userBooksService.load(params.bookId);
      }
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
    this.dialogService
      .openUserBookPublishDialog()
      .beforeClosed()
      .pipe(
        filter(isTrue), // ignore close without result
        concatMap(_ => this.userBooksService.publish(this.id)),
      )
      .subscribe({
        next: _ => this.router.navigateByUrl(`/user/books`),
        error: err => {
          // TODO customize typing
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
    this.dialogService
      .openUserBookDeleteDialog()
      .beforeClosed()
      .pipe(
        filter(isTrue), // ignore close without result
        concatMap(_ => this.userBooksService.delete(this.id)),
      )
      .subscribe(_ => this.router.navigateByUrl(`/user/books`));
  }
}
