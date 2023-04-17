import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserBookDTO } from 'src/app/models/book.models';
import { GoogleBooksVolumeDTO } from 'src/app/models/google-books.models';
import { GoogleBooksService } from 'src/app/services/google-books.service';
import { UserBooksService } from 'src/app/services/user-books.service';

// TODO improve design field + books
// TODO implement as material single selection list
// TODO add google books loading spinner
// TODO add create pending spinner

@Component({
  selector: 'app-book-create-dialog',
  templateUrl: './book-create-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCreateDialogComponent {
  readonly volumes$ = this.googleBooksService.searchVolumes$;

  readonly searchPending$ = this.googleBooksService.searchPending$;
  readonly searchError$ = this.googleBooksService.searchError$;

  readonly creating$ = this.userBooksService.creating$;

  constructor(
    readonly dialogRef: MatDialogRef<BookCreateDialogComponent, UserBookDTO | undefined>,
    private readonly userBooksService: UserBooksService,
    private readonly googleBooksService: GoogleBooksService,
  ) {}

  searchVolumes(query: string | null): void {
    this.googleBooksService.searchVolumes(query ?? '');
  }

  createBook(googleBooksVolume: GoogleBooksVolumeDTO): void {
    this.userBooksService.create(googleBooksVolume).subscribe(book => {
      this.dialogRef.close(book);
    });
  }
}
