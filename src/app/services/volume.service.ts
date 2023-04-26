import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, shareReplay, take } from 'rxjs/operators';

import { VolumeDTO } from '../models/volume.models';
import { volumeActions } from '../store/volume/volume.actions';
import * as VolumeSelectors from '../store/volume/volume.selectors';

interface IVolumeService {
  /** Load a volume with published books. */
  load(id: string): Observable<VolumeDTO>;
  /** Load all volumes with published books. */
  loadAll(): Observable<VolumeDTO[]>;
  /** Filter all loaded volumes with published books by title. */
  filter(query: string): void;
}

@Injectable({
  providedIn: 'root',
})
export class VolumeService implements IVolumeService {
  readonly volumes$ = this.store.select(VolumeSelectors.selectVolumesAll);
  readonly volumesTotal$ = this.store.select(VolumeSelectors.selectVolumesTotal);

  readonly volumesFiltered$ = this.store.select(VolumeSelectors.selectVolumesFiltered);

  readonly filterVolumesQuery$ = this.store.select(VolumeSelectors.selectVolumesFilterQuery);

  readonly volumeByRoute$ = this.store.select(VolumeSelectors.selectVolumeByRoute);

  readonly loadPending$ = this.store.select(VolumeSelectors.selectVolumesLoadPending);
  readonly loadError$ = this.store.select(VolumeSelectors.selectVolumesLoadError);

  constructor(private readonly store: Store, private readonly actions: Actions) {}

  load(id: string): Observable<VolumeDTO> {
    this.store.dispatch(volumeActions.load({ id }));

    const result = this.actions.pipe(
      ofType(volumeActions.loadSuccess, volumeActions.loadError),
      take(1),
      concatMap(action => {
        if (action.type === volumeActions.loadSuccess.type) {
          return of(action.volume);
        }
        return throwError(() => action.error);
      }),
      shareReplay(1),
    );
    result.subscribe();
    return result;
  }

  loadAll(): Observable<VolumeDTO[]> {
    this.store.dispatch(volumeActions.loadAll());

    const result = this.actions.pipe(
      ofType(volumeActions.loadAllSuccess, volumeActions.loadAllError),
      take(1),
      concatMap(action => {
        if (action.type === volumeActions.loadAllSuccess.type) {
          return of(action.volumes);
        }
        return throwError(() => action.error);
      }),
      shareReplay(1),
    );
    result.subscribe();
    return result;
  }

  filter(query: string): void {
    this.store.dispatch(volumeActions.filter({ query }));
  }
}
