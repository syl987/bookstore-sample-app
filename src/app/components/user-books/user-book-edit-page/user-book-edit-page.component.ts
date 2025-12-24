import { DecimalPipe, getCurrencySymbol, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DEFAULT_CURRENCY_CODE, effect, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { concatMap, filter, map } from 'rxjs';

import { ButtonSpinnerDirective } from 'src/app/directives/button-spinner.directive';
import { getObjectValues } from 'src/app/functions/object.functions';
import { isTrue, isTruthy } from 'src/app/functions/typeguard.functions';
import { BookCondition, BookStatus, UserBookEditDraftDTO } from 'src/app/models/book.models';
import { BookConditionPipe } from 'src/app/pipes/book-condition.pipe';
import { ValidationErrorPipe } from 'src/app/pipes/validation-error.pipe';
import { DialogService } from 'src/app/services/dialog.service';
import { RouterService } from 'src/app/services/router.service';
import { UserBooksService } from 'src/app/services/user-books.service';

import { TitleBarComponent } from '../../base/title-bar/title-bar.component';
import { ImageUploadComponent } from '../../shared/image-upload/image-upload.component';
import { VolumeCardComponent } from '../../volumes/volume-card/volume-card.component';

@Component({
  selector: 'app-user-book-edit-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
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
export class UserBookEditPageComponent implements OnInit {
  protected readonly currency = inject(DEFAULT_CURRENCY_CODE);
  protected readonly router = inject(Router);
  protected readonly routerService = inject(RouterService);
  protected readonly userBooksService = inject(UserBooksService);
  protected readonly dialogService = inject(DialogService);

  readonly bookId = toSignal(this.routerService.routeParams$.pipe(map(({ bookId }) => bookId!)), { requireSync: true }); // mandatory param defined by route

  readonly book = toSignal(this.userBooksService.entityByRoute$, { requireSync: true });
  readonly bookLoading = toSignal(this.userBooksService.loadPending$, { requireSync: true });

  readonly editDraftPending = toSignal(this.userBooksService.editDraftPending$, { requireSync: true });
  readonly publishPending = toSignal(this.userBooksService.publishPending$, { requireSync: true });
  readonly uploadPhotoPending = toSignal(this.userBooksService.uploadPhotoPending$, { requireSync: true });
  readonly uploadPhotoProgress = toSignal(this.userBooksService.uploadPhotoProgress$, { requireSync: true });
  readonly removePhotoPending = toSignal(this.userBooksService.removePhotoPending$, { requireSync: true });
  readonly deletePending = toSignal(this.userBooksService.deletePending$, { requireSync: true });

  readonly editDraftDisabled = computed(() => this.editDraftPending() || this.form.disabled); // TODO false on startup

  readonly publishDisabled = computed(() => this.publishPending() || this.book()?.status !== BookStatus.DRAFT);
  readonly deleteDisabled = computed(() => this.deletePending() || this.book()?.status !== BookStatus.DRAFT);

  readonly BookStatus = BookStatus;
  readonly BookCondition = BookCondition;

  readonly form = new FormGroup({
    description: new FormControl<string | null>(null),
    condition: new FormControl<BookCondition | null>(null),
    price: new FormControl<number | null>(null),
  });

  readonly getObjectValues = getObjectValues;

  readonly currencySymbol = getCurrencySymbol(this.currency, 'narrow');

  constructor() {
    effect(() => this._resetForm());
  }

  ngOnInit(): void {
    this.userBooksService.load(this.bookId());
  }

  saveChanges(): void {
    if (this.form.invalid) {
      return;
    }
    const data: UserBookEditDraftDTO = {
      description: this.form.value.description,
      condition: this.form.value.condition,
      price: this.form.value.price,
    };
    this.userBooksService.editDraft(this.bookId(), data);
  }

  discardChanges(): void {
    this._resetForm();
  }

  publishBook(): void {
    this.dialogService
      .openUserBookPublishDialog()
      .beforeClosed()
      .pipe(
        filter(isTrue), // ignore close without result
        concatMap(_ => this.userBooksService.publish(this.bookId())),
      )
      .subscribe({
        next: _ => this.router.navigateByUrl('/user/books'),
        error: (err: unknown) => {
          // TODO kick casting to any, check correctness
          if (err != null && (err as any).err instanceof FirebaseError) {
            // TODO customize typing
            // reliably retrieve error details
            const errors: Record<string, ValidationErrors | null> = (err as any)?.err?.customData ?? {};

            this.form.controls.description.setErrors(errors['description']);
            this.form.controls.condition.setErrors(errors['condition']);
            this.form.controls.price.setErrors(errors['price']);
            this.form.markAllAsTouched();
          }
        },
      });
  }

  deleteBook(): void {
    this.dialogService
      .openUserBookDeleteDialog()
      .beforeClosed()
      .pipe(
        filter(isTrue),
        concatMap(_ => this.userBooksService.delete(this.bookId())),
      )
      .subscribe(_ => this.router.navigateByUrl('/user/books'));
  }

  cropAndUploadPhoto(file: File): void {
    this.dialogService
      .openImageCropDialog(file)
      .beforeClosed()
      .pipe(
        filter(isTruthy),
        concatMap(result => this.userBooksService.uploadPhoto(this.bookId(), result)),
      )
      .subscribe(uploadData => {
        if (uploadData.complete) {
          this.userBooksService.load(this.bookId());
        }
      });
  }

  removeAllPhotos(): void {
    this.dialogService
      .openUserBookDeleteAllPhotosDialog()
      .beforeClosed()
      .pipe(
        filter(isTrue),
        concatMap(_ => this.userBooksService.removeAllPhotos(this.bookId())),
      )
      .subscribe(_ => {
        this.userBooksService.load(this.bookId());
      });
  }

  private _resetForm(): void {
    const book = this.book();

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
  }
}
