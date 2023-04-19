import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, startWith, Subject } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { VolumeService } from 'src/app/services/volume.service';

// TODO include published books data
// TODO add featured books query and page
// TODO move the search field into the header
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

  readonly volumes$ = combineLatest([
    this.volumeService.volumes$,
    this.filterControl.valueChanges.pipe(
      tap(filterString => {
        // do not display filtering spinner for invalid strings
        if (filterString && filterString.length < 3) {
          return;
        }
        this.filtering$.next(true);
      }),
      debounceTime(750),
      tap(_ => this.filtering$.next(false)),
      startWith(this.filterControl.defaultValue),
    ),
  ]).pipe(
    map(([volumes, filterString]) => {
      // display all results for empty string
      if (!filterString) {
        return volumes;
      }
      // do not display results for invalid strings
      if (filterString.length < 3) {
        return [];
      }
      return volumes.filter(v => v.volumeInfo.title.toLowerCase().includes(filterString));
    }),
  );

  private readonly _destroyed$ = new Subject<void>();

  constructor(private readonly volumeService: VolumeService) {}

  ngOnInit(): void {
    this.volumeService.loadAll();
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
