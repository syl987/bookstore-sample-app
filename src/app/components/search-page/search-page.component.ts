import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, take, takeUntil, tap } from 'rxjs/operators';
import { VolumeService } from 'src/app/services/volume.service';

// TODO move the search field into the header
// TODO open as firebase database stream

const DEBOUNCE_TIME = 500;
const FAKE_RESPONSE_TIME = 500;

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent implements OnInit, OnDestroy {
  readonly volumesFiltered$ = this.volumeService.entitiesFiltered$;

  readonly filterQuery$ = this.volumeService.filterQuery$;

  readonly filtering$ = new BehaviorSubject<boolean>(false);

  readonly filterControl = new FormControl<string>('', { nonNullable: true });

  private readonly _destroyed$ = new Subject<void>();

  constructor(private readonly volumeService: VolumeService) {}

  ngOnInit(): void {
    this.volumeService.loadAll();

    this.filterControl.valueChanges
      .pipe(
        debounceTime(DEBOUNCE_TIME),
        tap(_ => this.filtering$.next(true)),
        debounceTime(FAKE_RESPONSE_TIME),
        tap(_ => this.filtering$.next(false)),
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
