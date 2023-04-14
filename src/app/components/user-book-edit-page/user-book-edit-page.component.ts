import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';
import { RouterService } from 'src/app/services/router.service';
import { VolumeCollectionService } from 'src/app/services/__entity/volume-collection.service';

// TODO display volume data
// TODO edit book data (if not published or sold)
// TODO delete book (if not sold)
// TODO navigate to user books

@Component({
  selector: 'app-user-book-edit-page',
  templateUrl: './user-book-edit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookEditPageComponent implements OnInit, OnDestroy {
  readonly id: string = this.route.snapshot.params['bookId'];

  readonly book$ = this.volumeService.entities$.pipe(map(volumes => null)); // TODO get the right book

  private readonly _destroyed$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly routerService: RouterService,
    private readonly volumeService: VolumeCollectionService,
  ) {}

  ngOnInit(): void {
    this.routerService.navigated$.pipe(takeUntil(this._destroyed$)).subscribe(_ => {
      this.volumeService.getAll(); // TODO query the right book
    });
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
