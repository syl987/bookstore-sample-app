import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, take } from 'rxjs/operators';
import { ButtonSpinnerDirective } from 'src/app/directives/button-spinner.directive';
import { UserBookDTO } from 'src/app/models/book.models';
import { GoogleBooksVolumeDTO } from 'src/app/models/google-books.models';
import { GoogleBooksService } from 'src/app/services/google-books.service';
import { UserBooksService } from 'src/app/services/user-books.service';

const DEBOUNCE_TIME = 500;

@Component({
  selector: 'app-user-book-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    ButtonSpinnerDirective,
  ],
  templateUrl: './user-book-create-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookCreateDialogComponent implements AfterViewInit {
  readonly results$ = this.googleBooksService.searchResults$;

  readonly searchQuery$ = this.googleBooksService.searchQuery$;
  readonly searchPending$ = this.googleBooksService.searchPending$;
  readonly searchError$ = this.googleBooksService.searchError$;

  readonly createPending$ = this.userBooksService.createPending$;

  readonly searchControl = new FormControl<string>('', { nonNullable: true });

  @ViewChild(MatSelectionList) list?: MatSelectionList;

  constructor(
    readonly dialogRef: MatDialogRef<UserBookCreateDialogComponent, UserBookDTO | undefined>,
    private readonly userBooksService: UserBooksService,
    private readonly googleBooksService: GoogleBooksService,
    private readonly detector: ChangeDetectorRef,
    private readonly destroy: DestroyRef,
  ) {
    this.searchControl.valueChanges.pipe(debounceTime(DEBOUNCE_TIME), takeUntilDestroyed()).subscribe(query => {
      this.googleBooksService.searchVolumes(query);
    });

    this.searchQuery$.pipe(take(1), takeUntilDestroyed()).subscribe(query => {
      if (query) {
        this.searchControl.setValue(query, { emitEvent: false });
      }
    });
  }

  ngAfterViewInit(): void {
    this.list!.selectedOptions.changed.pipe(takeUntilDestroyed(this.destroy)).subscribe(_ => {
      this.detector.markForCheck();
    });
  }

  createUserBook(googleBooksVolume: GoogleBooksVolumeDTO): void {
    this.userBooksService.create(googleBooksVolume).subscribe(book => {
      this.dialogRef.close(book);
    });
  }
}
