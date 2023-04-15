import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { filter, Subject, takeUntil } from 'rxjs';
import { notEmpty } from 'src/app/functions/typeguard.functions';
import { GoogleBooksVolumeDTO } from 'src/app/models/google-books.models';
import { GoogleBooksService } from 'src/app/services/google-books.service';
import { UserBooksService } from 'src/app/services/user-books.service';

// TODO search google books
// TODO create a book, save volume if not existing, link them
// TODO navigate to user book edit

@Component({
  selector: 'app-book-create-dialog',
  templateUrl: './book-create-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCreateDialogComponent implements OnInit, OnDestroy {
  readonly volumes$ = this.googleBooksService.searchVolumes$;

  readonly searchPending$ = this.googleBooksService.searchPending$;
  readonly searchError$ = this.googleBooksService.searchError$;

  readonly createPending$ = this.userBooksService.pending$;

  private readonly _destroyed$ = new Subject<void>();

  constructor(
    readonly dialogRef: MatDialogRef<BookCreateDialogComponent, string | undefined>,
    private readonly userBooksService: UserBooksService,
    private readonly googleBooksService: GoogleBooksService,
  ) {}

  ngOnInit(): void {
    this.userBooksService.createdId$.pipe(filter(notEmpty), takeUntil(this._destroyed$)).subscribe(createdId => {
      this.dialogRef.close(createdId);
    });
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  searchVolumes(query: string | null): void {
    this.googleBooksService.searchVolumes(query ?? '');
  }

  createBook(googleBooksVolume: GoogleBooksVolumeDTO): void {
    this.userBooksService.create(googleBooksVolume);
  }
}
