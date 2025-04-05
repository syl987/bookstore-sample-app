import { DecimalPipe, getCurrencySymbol, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DEFAULT_CURRENCY_CODE, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, concatMap, filter } from 'rxjs';
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
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    TitleBarComponent,
    ImageUploadComponent,
    VolumeCardComponent,
    ButtonSpinnerDirective,
    ValidationErrorPipe,
    BookConditionPipe,
    DecimalPipe,
    SlicePipe,
  ],
  templateUrl: './user-book-edit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookEditPageComponent {
  private readonly currency = inject(DEFAULT_CURRENCY_CODE);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly routerService = inject(RouterService);
  private readonly userBooksService = inject(UserBooksService);
  private readonly dialogService = inject(DialogService);

  id: string = this.route.snapshot.params['bookId'];

  readonly book = this.userBooksService.entityByRoute;
  readonly bookLoading = this.userBooksService.loadPending;

  readonly editDraftPending = this.userBooksService.editDraftPending;
  readonly publishPending = this.userBooksService.publishPending;
  readonly uploadPhotoPending = this.userBooksService.uploadPhotoPending;
  readonly uploadPhotoProgress = this.userBooksService.uploadPhotoProgress;
  readonly removePhotoPending = this.userBooksService.removePhotoPending;
  readonly deletePending = this.userBooksService.deletePending;

  readonly editDraftDisabled = computed(() => this.editDraftPending() || this.form.disabled); // TODO false on startup

  readonly publishDisabled = computed(() => this.publishPending() || this.book()?.status !== BookStatus.DRAFT);
  readonly deleteDisabled = computed(() => this.deletePending() || this.book()?.status !== BookStatus.DRAFT);

  readonly BookStatus = BookStatus;
  readonly BookCondition = BookCondition;

  readonly form = this.fb.nonNullable.group({
    description: new FormControl<string | null>(null),
    condition: new FormControl<BookCondition | null>(null),
    price: new FormControl<number | null>(null),
  });

  readonly getObjectValues = getObjectValues;

  readonly currencySymbol = getCurrencySymbol(this.currency, 'narrow');

  private readonly _resetFields$ = new BehaviorSubject<void>(undefined);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.routerService
      .selectRouteParam('bookId')
      .pipe(takeUntilDestroyed())
      .subscribe(id => {
        if (id) {
          this.id = id;
          this.userBooksService.load(id);
        }
      });

    combineLatest([toObservable(this.book), this._resetFields$])
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
    this._resetFields$.next();
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
          const errors: Record<string, ValidationErrors | null> = err?.err?.customData ?? {};

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

  cropAndUploadPhoto(file: File): void {
    this.dialogService
      .openImageCropDialog(file)
      .beforeClosed()
      .pipe(
        filter(isTruthy),
        concatMap(result => this.userBooksService.uploadPhoto(this.id, result)),
      )
      .subscribe(uploadData => {
        if (uploadData.complete) {
          this.userBooksService.load(this.id);
        }
      });
  }

  removeAllPhotos(): void {
    this.dialogService
      .openUserBookDeleteAllPhotosDialog()
      .beforeClosed()
      .pipe(
        filter(isTrue),
        concatMap(_ => this.userBooksService.removeAllPhotos(this.id)),
      )
      .subscribe(_ => {
        this.userBooksService.load(this.id);
      });
  }
}
