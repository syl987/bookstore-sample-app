import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { debounceTime, take } from 'rxjs/operators';
import { UserBookDTO } from 'src/app/models/book.models';
import { GoogleBooksVolumeDTO } from 'src/app/models/google-books.models';
import { GoogleBooksService } from 'src/app/services/google-books.service';
import { UserBooksService } from 'src/app/services/user-books.service';

const DEBOUNCE_TIME = 500;

@Component({
  selector: 'app-user-book-create-dialog',
  templateUrl: './user-book-create-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookCreateDialogComponent implements OnInit, AfterViewInit {
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
  ) {}

  ngOnInit(): void {
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
    this.list!.selectedOptions.changed.pipe(takeUntilDestroyed()).subscribe(_ => {
      this.detector.markForCheck();
    });
  }

  createUserBook(googleBooksVolume: GoogleBooksVolumeDTO): void {
    this.userBooksService.create(googleBooksVolume).subscribe(book => {
      this.dialogRef.close(book);
    });
  }
}
