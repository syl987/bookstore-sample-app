import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { BookDTO, BookStatus } from 'src/app/models/book.models';
import { GoogleBooksVolumeDTO } from 'src/app/models/google-books.models';
import { AuthService } from 'src/app/services/auth.service';
import { BookService } from 'src/app/services/book.service';
import { ToastService } from 'src/app/services/toast.service';
import { VolumeService } from 'src/app/services/volume.service';

@Component({
  selector: 'app-book-create-dialog',
  templateUrl: './book-create-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCreateDialogComponent {
  readonly volumes$ = this.volumeService.volumes$;

  readonly searchPending$ = this.volumeService.searchPending$;
  readonly searchError$ = this.volumeService.searchError$;

  readonly createPending$ = this.bookService.loading$;

  constructor(
    readonly dialogRef: MatDialogRef<BookCreateDialogComponent, BookDTO | undefined>,
    private readonly authService: AuthService,
    private readonly bookService: BookService,
    private readonly volumeService: VolumeService,
    private readonly toastService: ToastService
  ) {}

  searchVolumes(query: string | null): void {
    this.volumeService.searchVolumes(query ?? '');
  }

  createBook(volume: GoogleBooksVolumeDTO): void {
    const book: BookDTO = {
      id: '[new]',
      sellerUid: this.authService.uid!, // TODO kick '!' + guard with toast error
      status: BookStatus.DRAFT,
      volumeId: volume.id,
      volumeInfo: volume.volumeInfo,
    };

    this.bookService.add(book).subscribe(createdBook => this.dialogRef.close(createdBook));
  }
}
