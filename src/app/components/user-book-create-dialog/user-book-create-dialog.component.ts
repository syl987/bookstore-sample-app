import { SlicePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, take } from 'rxjs';
import { ButtonSpinnerDirective } from 'src/app/directives/button-spinner.directive';
import { UserBookDTO } from 'src/app/models/book.models';
import { GoogleBooksVolumeDTO } from 'src/app/models/google-books.models';
import { ArrayPipe } from 'src/app/pipes/array.pipe';
import { GoogleBooksService } from 'src/app/services/google-books.service';
import { UserBooksService } from 'src/app/services/user-books.service';

const DEBOUNCE_TIME = 500;

@Component({
  selector: 'app-user-book-create-dialog',
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, MatInputModule, MatListModule, MatProgressSpinnerModule, ButtonSpinnerDirective, ArrayPipe, SlicePipe],
  templateUrl: './user-book-create-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookCreateDialogComponent implements AfterViewInit {
  protected readonly userBooksService = inject(UserBooksService);
  protected readonly googleBooksService = inject(GoogleBooksService);
  protected readonly detector = inject(ChangeDetectorRef);
  protected readonly destroy = inject(DestroyRef);

  readonly dialogRef = inject<MatDialogRef<UserBookCreateDialogComponent, UserBookDTO | undefined>>(MatDialogRef);

  readonly results = this.googleBooksService.searchResults;

  readonly searchQuery = this.googleBooksService.searchQuery;
  readonly searchPending = this.googleBooksService.searchPending;
  readonly searchError = this.googleBooksService.searchError;

  readonly createPending = this.userBooksService.createPending;

  readonly searchControl = new FormControl<string>('', { nonNullable: true });

  @ViewChild(MatSelectionList) list?: MatSelectionList;

  constructor() {
    this.searchControl.valueChanges.pipe(debounceTime(DEBOUNCE_TIME), takeUntilDestroyed()).subscribe(query => {
      this.googleBooksService.searchVolumes(query);
    });

    toObservable(this.googleBooksService.searchQuery)
      .pipe(take(1), takeUntilDestroyed())
      .subscribe(query => {
        if (query) {
          this.searchControl.setValue(query, { emitEvent: false });
        }
      });
  }

  ngAfterViewInit(): void {
    this.list!.selectedOptions.changed.pipe(takeUntilDestroyed(this.destroy)).subscribe(_ => {
      this.detector.markForCheck();
    });
    this.detector.markForCheck();
  }

  createUserBook(volume: GoogleBooksVolumeDTO): void {
    this.userBooksService.create(volume).subscribe(book => {
      this.dialogRef.close(book);
    });
  }
}
