import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { Subject, takeUntil } from 'rxjs';
import { UserBookDTO } from 'src/app/models/book.models';
import { GoogleBooksVolumeDTO } from 'src/app/models/google-books.models';
import { GoogleBooksService } from 'src/app/services/google-books.service';
import { UserBooksService } from 'src/app/services/user-books.service';

// TODO improve search field design

@Component({
  selector: 'app-user-book-create-dialog',
  templateUrl: './user-book-create-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookCreateDialogComponent implements AfterViewInit, OnDestroy {
  readonly volumes$ = this.googleBooksService.searchVolumes$;

  readonly searchPending$ = this.googleBooksService.searchPending$;
  readonly searchError$ = this.googleBooksService.searchError$;

  readonly creating$ = this.userBooksService.creating$;

  @ViewChild(MatSelectionList) list?: MatSelectionList;

  private readonly _destroyed$ = new Subject<void>();

  constructor(
    readonly dialogRef: MatDialogRef<UserBookCreateDialogComponent, UserBookDTO | undefined>,
    private readonly userBooksService: UserBooksService,
    private readonly googleBooksService: GoogleBooksService,
    private readonly detector: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.list!.selectedOptions.changed.pipe(takeUntil(this._destroyed$)).subscribe(_ => this.detector.markForCheck());
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  searchVolumes(query: string | null): void {
    this.googleBooksService.searchVolumes(query ?? '');
  }

  createUserBook(googleBooksVolume: GoogleBooksVolumeDTO): void {
    this.userBooksService.create(googleBooksVolume).subscribe(book => {
      this.dialogRef.close(book);
    });
  }
}
