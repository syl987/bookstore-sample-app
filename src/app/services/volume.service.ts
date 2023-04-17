import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, filter, shareReplay, take } from 'rxjs/operators';

import { nextCorrelationId } from '../helpers/entity.helpers';
import { VolumeDTO } from '../models/volume.models';
import * as VolumeActions from '../store/volume/volume.actions';
import { selectVolumeByRoute, selectVolumesAll, selectVolumesError, selectVolumesLoading, selectVolumesTotal } from '../store/volume/volume.selectors';

interface IVolumeService {
  /** Search volumes with published books. */
  search(params?: unknown): Observable<VolumeDTO[]>;
  /** Load a volume with published books */
  load(id: string): Observable<VolumeDTO>;
}

@Injectable({
  providedIn: 'root',
})
export class VolumeService implements IVolumeService {
  readonly volumes$ = this.store.select(selectVolumesAll);
  readonly volumesTotal$ = this.store.select(selectVolumesTotal);

  readonly volumeByRoute$ = this.store.select(selectVolumeByRoute);

  readonly loading$ = this.store.select(selectVolumesLoading);
  readonly error$ = this.store.select(selectVolumesError);

  constructor(private readonly store: Store, private readonly actions: Actions) {}

  search(params?: unknown): Observable<VolumeDTO[]> {
    const cid = nextCorrelationId();
    this.store.dispatch(VolumeActions.loadVolumes({ cid }));

    const result = this.actions.pipe(
      ofType(VolumeActions.loadVolumesSuccess, VolumeActions.loadVolumesError),
      filter(action => action.cid === cid),
      take(1),
      concatMap(action => {
        if (action.type === VolumeActions.loadVolumesSuccess.type) {
          return of(action.volumes);
        }
        return throwError(() => action.error);
      }),
      shareReplay(1),
    );
    result.subscribe();
    return result;
  }

  load(id: string): Observable<VolumeDTO> {
    throw new Error('Method not implemented.');
  }
}
