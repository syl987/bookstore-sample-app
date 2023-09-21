import { CommonModule, getCurrencySymbol } from '@angular/common';
import { ChangeDetectionStrategy, Component, DEFAULT_CURRENCY_CODE, Inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, concatMap, filter, map, tap } from 'rxjs';
import { ButtonSpinnerDirective } from 'src/app/directives/button-spinner.directive';
import { getObjectValues } from 'src/app/functions/object.functions';
import { isTrue, isTruthy } from 'src/app/functions/typeguard.functions';
import { BookCondition, BookStatus, UserBookEditDraftDTO } from 'src/app/models/book.models';
import { BookConditionPipe } from 'src/app/pipes/book-condition.pipe';
import { ValidationErrorPipe } from 'src/app/pipes/validation-error.pipe';
import { DialogService } from 'src/app/services/dialog.service';
import { RouterService } from 'src/app/services/router.service';
import { UserBooksService } from 'src/app/services/user-books.service';

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { VolumeCardComponent } from '../volume-card/volume-card.component';

@Component({
  selector: 'app-user-book-edit-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatInputModule,
    MatSelectModule,
    TitleBarComponent,
    ImageUploadComponent,
    VolumeCardComponent,
    ButtonSpinnerDirective,
    ValidationErrorPipe,
    BookConditionPipe,
  ],
  templateUrl: './user-book-edit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookEditPageComponent {
  id: string = this.route.snapshot.params['bookId'];

  readonly book$ = this.userBooksService.entityByRoute$;

  readonly editDraftPending$ = this.userBooksService.editDraftPending$;
  readonly publishPending$ = this.userBooksService.publishPending$;
  readonly uploadPhotoPending$ = this.userBooksService.uploadPhotoPending$;
  readonly uploadPhotoProgress$ = this.userBooksService.uploadPhotoProgress$;
  readonly removeAllPhotosPending$ = this.userBooksService.removeAllPhotosPending$;
  readonly deletePending$ = this.userBooksService.deletePending$;

  readonly editDraftDisabled$ = this.editDraftPending$.pipe(map(pending => pending || this.form.disabled)); // TODO false on startup

  readonly publishDisabled$ = combineLatest([this.publishPending$, this.book$]).pipe(map(([publishing, book]) => publishing || book?.status !== BookStatus.DRAFT));

  readonly deleteDisabled$ = combineLatest([this.deletePending$, this.book$]).pipe(map(([pending, book]) => pending || book?.status !== BookStatus.DRAFT));

  readonly BookStatus = BookStatus;
  readonly BookCondition = BookCondition;

  readonly form = this.fb.nonNullable.group({
    description: new FormControl<string | null>(null),
    condition: new FormControl<BookCondition | null>(null),
    price: new FormControl<number | null>(null),
  });

  readonly getObjectValues = getObjectValues;

  readonly currencySymbol = getCurrencySymbol(this.currency, 'narrow');

  private readonly _resetFields = new BehaviorSubject<void>(undefined);

  constructor(
    @Inject(DEFAULT_CURRENCY_CODE) private readonly currency: string,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly routerService: RouterService,
    private readonly userBooksService: UserBooksService,
    private readonly dialogService: DialogService,
  ) {
    this.routerService
      .selectRouteParam('bookId')
      .pipe(takeUntilDestroyed())
      .subscribe(id => {
        if (id) {
          this.id = id;
          this.userBooksService.load(id);
        }
      });

    combineLatest([this.book$, this._resetFields])
      .pipe(takeUntilDestroyed())
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
        next: _ => this.router.navigateByUrl('/user/books'),
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
        filter(isTrue),
        concatMap(_ => this.userBooksService.delete(this.id)),
      )
      .subscribe(_ => this.router.navigateByUrl('/user/books'));
  }

  openImageCropDialog(file: File): void {
    this.dialogService
      .openImageCropDialog(file)
      .beforeClosed()
      .pipe(
        filter(isTruthy),
        concatMap(result => {
          return this.userBooksService.uploadPhoto(this.id, result).pipe(
            tap(uploadData => {
              if (uploadData.complete) {
                this.userBooksService.load(this.id);
              }
            }),
          );
        }),
      )
      .subscribe();
  }

  removeAllPhotos(): void {
    this.userBooksService.removeAllPhotos(this.id);
  }
}
