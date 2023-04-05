import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BookDTO } from 'src/app/models/book.models';
import { GoogleBooksVolumeDTO } from 'src/app/models/google-books.models';
import { BookService } from 'src/app/services/book.service';
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
    private readonly bookService: BookService,
    private readonly volumeService: VolumeService
  ) {}

  searchVolumes(query: string): void {
    this.volumeService.searchVolumes(query);
  }

  createBook(volume: GoogleBooksVolumeDTO): void {
    const book: BookDTO = {
      id: '[new]',
      volumeInfo: volume.volumeInfo,
    };

    this.bookService.add(book).subscribe(createdBook => this.dialogRef.close(createdBook));
  }
}
