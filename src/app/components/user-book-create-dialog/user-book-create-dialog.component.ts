import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { Subject } from 'rxjs';
import { debounceTime, map, take, takeUntil } from 'rxjs/operators';
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
export class UserBookCreateDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly searchControl = new FormControl<string>('', { nonNullable: true });

  readonly volumes$ = this.googleBooksService.searchVolumes$.pipe(map(list => list?.items ?? []));

  readonly searchQuery$ = this.googleBooksService.searchQuery$;
  readonly searchPending$ = this.googleBooksService.searchPending$;
  readonly searchError$ = this.googleBooksService.searchError$;

  readonly createPending$ = this.userBooksService.createPending$;

  @ViewChild(MatSelectionList) list?: MatSelectionList;

  private readonly _destroyed$ = new Subject<void>();

  constructor(
    readonly dialogRef: MatDialogRef<UserBookCreateDialogComponent, UserBookDTO | undefined>,
    private readonly userBooksService: UserBooksService,
    private readonly googleBooksService: GoogleBooksService,
    private readonly detector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(debounceTime(DEBOUNCE_TIME), takeUntil(this._destroyed$)).subscribe(query => {
      this.googleBooksService.searchVolumes(query);
    });

    this.searchQuery$.pipe(take(1), takeUntil(this._destroyed$)).subscribe(query => {
      if (query) {
        this.searchControl.setValue(query, { emitEvent: false });
      }
    });
  }

  ngAfterViewInit(): void {
    this.list!.selectedOptions.changed.pipe(takeUntil(this._destroyed$)).subscribe(_ => {
      this.detector.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  createUserBook(googleBooksVolume: GoogleBooksVolumeDTO): void {
    this.userBooksService.create(googleBooksVolume).subscribe(book => {
      this.dialogRef.close(book);
    });
  }
}
