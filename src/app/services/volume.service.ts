import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as VolumeActions from '../store/volume/volume.actions';
import { selectVolumeAll, selectVolumeSearchError, selectVolumeSearchPending, selectVolumeTotal } from '../store/volume/volume.selectors';

@Injectable({
  providedIn: 'root',
})
export class VolumeService {
  readonly volumes$ = this.store.select(selectVolumeAll);
  readonly volumesTotal$ = this.store.select(selectVolumeTotal);

  readonly searchPending$ = this.store.select(selectVolumeSearchPending);
  readonly searchError$ = this.store.select(selectVolumeSearchError);

  constructor(private readonly store: Store) {}

  searchVolumes(query: string): void {
    this.store.dispatch(VolumeActions.searchVolumes({ query }));
  }
}
