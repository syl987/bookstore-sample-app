import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { VolumeService } from 'src/app/services/volume.service';

// TODO search volumes by query or params
// TODO include published books data
// TODO navigate to volume detail

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
    this.volumeService.loadAll(); // TODO replace with search

    /* this.filterControl.valueChanges.pipe(debounceTime(250), takeUntil(this._destroyed$)).subscribe(value => this.volumeService.setFilter(value));

    this.volumeService.filter$.pipe(takeUntil(this._destroyed$)).subscribe(filter => this.filterControl.setValue(filter, { emitEvent: false })); */
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
