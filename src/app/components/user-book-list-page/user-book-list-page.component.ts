import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookDTO } from 'src/app/models/book.models';
import { VolumeDTO } from 'src/app/models/volume.models';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { UserBooksService } from 'src/app/services/user-books.service';
import { VolumeService } from 'src/app/services/volume.service';

// TODO consider revamping data model: volumes_with_books, user_books_as_volume_ids, user_bought_books_as_volume_ids, book_volume_id (check if efficient querying is possible)

// TODO display user books with volume data
// TODO display bought books with volume data
// TODO display books separately by status (draft, published, sold, bought)
// TODO navigate to book edit

// TODO create special book model with volume info
// TODO create a selector to improve runtime behavior
function mapToBooks(volumes: VolumeDTO[], filterFn: (book: BookDTO) => boolean): (BookDTO & { volume: VolumeDTO })[] {
  return volumes.reduce<(BookDTO & { volume: VolumeDTO })[]>((acc, volume) => {
    return [
      ...acc,
      ...Object.values(volume.publishedBooks ?? {})
        .filter(filterFn)
        .map(book => ({ ...book, volume })),
    ];
  }, []);
}

@Component({
  selector: 'app-user-book-list-page',
  templateUrl: './user-book-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookListPageComponent implements OnInit, OnDestroy {
  readonly books$ = this.volumeService.volumes$.pipe(map(volumes => mapToBooks(volumes, book => book.uid === this.authService.uid)));

  // TODO check where destroyed is really needed
  private readonly _destroyed$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly userBooksService: UserBooksService,
    private readonly volumeService: VolumeService,
    private readonly dialogService: DialogService,
  ) {}

  openBookCreateDialog(): void {
    const dialogRef = this.dialogService.openBookCreateDialog();

    dialogRef.beforeClosed().subscribe(book => {
      if (book) {
        this.router.navigateByUrl('/user/books/' + book.id + '/edit');
      }
    });
  }

  ngOnInit(): void {
    this.userBooksService.loadAll();
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
