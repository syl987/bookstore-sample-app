import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, shareReplay, take } from 'rxjs/operators';

import { VolumeDTO } from '../models/volume.models';
import { VolumeActions } from '../store/volume/volume.actions';
import { volumeFeature } from '../store/volume/volume.reducer';

interface IVolumeService {
  /** Load a volume with published books. */
  load(id: string): Observable<VolumeDTO>;
  /** Load all volumes with published books. */
  loadAll(): Observable<VolumeDTO[]>;
}

@Injectable({
  providedIn: 'root',
})
export class VolumeService implements IVolumeService {
  readonly entities$ = this.store.select(volumeFeature.selectAll);
  readonly entitiesTotal$ = this.store.select(volumeFeature.selectTotal);

  readonly entitiesFiltered$ = this.store.select(volumeFeature.selectAllFiltered);

  readonly entitiyByRoute$ = this.store.select(volumeFeature.selectByRoute);

  readonly loadPending$ = this.store.select(volumeFeature.selectLoadPending);
  readonly loadError$ = this.store.select(volumeFeature.selectLoadError);

  constructor(private readonly store: Store, private readonly actions: Actions) {}

  load(id: string): Observable<VolumeDTO> {
    this.store.dispatch(VolumeActions.load({ id }));

    const result = this.actions.pipe(
      ofType(VolumeActions.loadSuccess, VolumeActions.loadError),
      take(1),
      concatMap(action => {
        if (action.type === VolumeActions.loadSuccess.type) {
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
    this.store.dispatch(VolumeActions.loadAll());

    const result = this.actions.pipe(
      ofType(VolumeActions.loadAllSuccess, VolumeActions.loadAllError),
      take(1),
      concatMap(action => {
        if (action.type === VolumeActions.loadAllSuccess.type) {
          return of(action.volumes);
        }
        return throwError(() => action.error);
      }),
      shareReplay(1),
    );
    result.subscribe();
    return result;
  }
}
