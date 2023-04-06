import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, concatMap } from 'rxjs/operators';
import { BookDTO, BookStatus } from 'src/app/models/book.models';
import { GoogleBooksVolumeDTO } from 'src/app/models/google-books.models';
import { AuthService } from 'src/app/services/auth.service';
import { GoogleBooksService } from 'src/app/services/google-books.service';
import { ToastService } from 'src/app/services/toast.service';
import { VolumeService } from 'src/app/services/volume.service';

@Component({
  selector: 'app-book-create-dialog',
  templateUrl: './book-create-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCreateDialogComponent {
  readonly volumes$ = this.googleBooksService.searchVolumes$;

  readonly searchPending$ = this.googleBooksService.searchPending$;
  readonly searchError$ = this.googleBooksService.searchError$;

  readonly createPending$ = this.volumeService.loading$;

  constructor(
    readonly dialogRef: MatDialogRef<BookCreateDialogComponent, BookDTO | undefined>,
    private readonly authService: AuthService,
    private readonly volumeService: VolumeService,
    private readonly googleBooksService: GoogleBooksService,
    private readonly toastService: ToastService
  ) {}

  searchVolumes(query: string | null): void {
    this.googleBooksService.searchVolumes(query ?? '');
  }

  createBook(googleBooksVolume: GoogleBooksVolumeDTO): void {
    const book: BookDTO = {
      id: '' + new Date().getTime(), // TODO improve id generation
      sellerUid: this.authService.uid!, // TODO kick '!' + guard with toast error
      status: BookStatus.DRAFT,
    };

    // TODO need existence check?
    // TODO check if old volume gets replaced
    this.volumeService
      .getByKey(googleBooksVolume.id)
      .pipe(
        concatMap(volume =>
          this.volumeService.update({
            id: volume.id,
            books: { [book.id]: book },
          })
        ), // TODO check sub-property partial update
        catchError(_ =>
          this.volumeService.add({
            id: googleBooksVolume.id,
            volumeInfo: googleBooksVolume.volumeInfo,
            searchInfo: googleBooksVolume.searchInfo,
            books: { [book.id]: book },
          })
        ) // TODO check http status, proceed only on 404
      )
      .subscribe(_ => this.dialogRef.close(book));
  }
}
