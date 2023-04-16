import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { VolumeDTO } from 'src/app/models/volume.models';
import { VolumeService } from 'src/app/services/volume.service';

// search volumes by query or params
// include published books data
// navigate to volume detail

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent implements OnInit, OnDestroy {
  readonly filterControl = new FormControl('', { nonNullable: true });

  readonly volumes$ = this.volumeService.volumes$;

  private readonly _destroyed$ = new Subject<void>();

  constructor(private readonly volumeService: VolumeService) {}

  ngOnInit(): void {
    this.volumeService.search();

    /* this.filterControl.valueChanges.pipe(debounceTime(250), takeUntil(this._destroyed$)).subscribe(value => this.volumeService.setFilter(value));

    this.volumeService.filter$.pipe(takeUntil(this._destroyed$)).subscribe(filter => this.filterControl.setValue(filter, { emitEvent: false })); */
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  getPublishedBooksTotal(volume: VolumeDTO): number {
    return Object.keys(volume.publishedBooks ?? {}).length;
  }
}
