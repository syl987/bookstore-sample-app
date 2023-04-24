import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, startWith, take, takeUntil, tap } from 'rxjs/operators';
import { VolumeService } from 'src/app/services/volume.service';

// TODO move the search field into the header
// TODO open as firebase database stream
// TODO include a ittle bit of published books data
// TODO add featured books query and page
// TODO add database search support (?)
// TODO add search store (?)

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent implements OnInit, OnDestroy {
  readonly filterControl = new FormControl<string>('', { nonNullable: true });

  readonly filtering$ = new BehaviorSubject<boolean>(false);

  readonly volumesFiltered$ = this.volumeService.volumesFiltered$;

  readonly filterQuery$ = this.volumeService.filterVolumesQuery$;

  private readonly _destroyed$ = new Subject<void>();

  constructor(private readonly volumeService: VolumeService) {}

  ngOnInit(): void {
    this.volumeService.loadAll();

    this.filterControl.valueChanges
      .pipe(
        tap(_ => this.filtering$.next(true)),
        debounceTime(750),
        tap(_ => this.filtering$.next(false)),
        startWith(this.filterControl.defaultValue),
        takeUntil(this._destroyed$),
      )
      .subscribe(query => {
        this.volumeService.filter(query);
      });

    this.filterQuery$.pipe(take(1), takeUntil(this._destroyed$)).subscribe(query => {
      this.filterControl.setValue(query, { emitEvent: false });
    });
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
