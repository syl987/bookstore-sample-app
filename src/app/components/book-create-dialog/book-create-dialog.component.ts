import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { concatMap } from 'rxjs/operators';
import { BookDTO, BookStatus } from 'src/app/models/book.models';
import { GoogleBooksVolumeDTO } from 'src/app/models/google-books.models';
import { VolumeDTO } from 'src/app/models/volume.models';
import { AuthService } from 'src/app/services/auth.service';
import { BookService } from 'src/app/services/book.service';
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

  readonly createPending$ = this.bookService.loading$;

  constructor(
    readonly dialogRef: MatDialogRef<BookCreateDialogComponent, BookDTO | undefined>,
    private readonly authService: AuthService,
    private readonly bookService: BookService,
    private readonly volumeService: VolumeService,
    private readonly googleBooksService: GoogleBooksService,
    private readonly toastService: ToastService
  ) {}

  searchVolumes(query: string | null): void {
    this.googleBooksService.searchVolumes(query ?? '');
  }

  createBook(googleBooksVolume: GoogleBooksVolumeDTO): void {
    const volume: VolumeDTO = {
      id: googleBooksVolume.id,
      volumeInfo: googleBooksVolume.volumeInfo,
      searchInfo: googleBooksVolume.searchInfo,
    };

    const book: BookDTO = {
      id: '[new]',
      sellerUid: this.authService.uid!, // TODO kick '!' + guard with toast error
      status: BookStatus.DRAFT,
      volumeId: googleBooksVolume.id,
    };

    // TODO need existence check?
    // TODO check if old volume gets replaced
    this.volumeService
      .add(volume)
      .pipe(concatMap(_ => this.bookService.add(book)))
      .subscribe(createdBook => this.dialogRef.close(createdBook));
  }
}
