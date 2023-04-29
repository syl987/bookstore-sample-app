import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, take, tap } from 'rxjs/operators';
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
export class SearchPageComponent implements OnInit {
  readonly volumesFiltered$ = this.volumeService.entitiesFiltered$;

  readonly filterQuery$ = this.volumeService.filterQuery$;

  readonly filtering$ = new BehaviorSubject<boolean>(false);

  readonly filterControl = new FormControl<string>('', { nonNullable: true });

  constructor(private readonly volumeService: VolumeService) {}

  ngOnInit(): void {
    this.volumeService.loadAll();

    this.filterControl.valueChanges
      .pipe(
        debounceTime(DEBOUNCE_TIME),
        tap(_ => this.filtering$.next(true)),
        debounceTime(FAKE_RESPONSE_TIME),
        tap(_ => this.filtering$.next(false)),
        takeUntilDestroyed(),
      )
      .subscribe(query => {
        this.volumeService.filter(query);
      });

    this.filterQuery$.pipe(take(1), takeUntilDestroyed()).subscribe(query => {
      this.filterControl.setValue(query, { emitEvent: false });
    });
  }
}
