import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as VolumeActions from '../store/volume/volume.actions';
import {
  selectVolumeByRoute,
  selectVolumesAll,
  selectVolumesError,
  selectVolumesPending,
  selectVolumesTotal,
} from '../store/volume/volume.selectors';

interface IVolumeService {
  /** Search volumes with published books. */
  search(params?: unknown): void;
  /** Load a volume with published books */
  load(id: string): void;
}

@Injectable({
  providedIn: 'root',
})
export class VolumeService implements IVolumeService {
  readonly volumes$ = this.store.select(selectVolumesAll);
  readonly volumesTotal$ = this.store.select(selectVolumesTotal);

  readonly volumeByRoute$ = this.store.select(selectVolumeByRoute);

  readonly pending$ = this.store.select(selectVolumesPending);
  readonly error$ = this.store.select(selectVolumesError);

  constructor(private readonly store: Store) {}

  search(params?: unknown): void {
    return this.store.dispatch(VolumeActions.loadVolumes());
  }

  load(id: string): void {
    throw new Error('Method not implemented.');
  }
}
