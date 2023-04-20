import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserBookDTO } from 'src/app/models/book.models';
import { GoogleBooksVolumeDTO } from 'src/app/models/google-books.models';
import { GoogleBooksService } from 'src/app/services/google-books.service';
import { UserBooksService } from 'src/app/services/user-books.service';

// TODO improve search field design
// TODO replace action list with selection list, add create spinner button
// TODO add google books loading spinner, similar to search field spinner

@Component({
  selector: 'app-user-book-create-dialog',
  templateUrl: './user-book-create-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookCreateDialogComponent {
  readonly volumes$ = this.googleBooksService.searchVolumes$;

  readonly searchPending$ = this.googleBooksService.searchPending$;
  readonly searchError$ = this.googleBooksService.searchError$;

  readonly creating$ = this.userBooksService.creating$;

  constructor(
    readonly dialogRef: MatDialogRef<UserBookCreateDialogComponent, UserBookDTO | undefined>,
    private readonly userBooksService: UserBooksService,
    private readonly googleBooksService: GoogleBooksService,
  ) {}

  searchVolumes(query: string | null): void {
    this.googleBooksService.searchVolumes(query ?? '');
  }

  createUserBook(googleBooksVolume: GoogleBooksVolumeDTO): void {
    this.userBooksService.create(googleBooksVolume).subscribe(book => {
      this.dialogRef.close(book);
    });
  }
}
