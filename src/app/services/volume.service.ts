import { Injectable } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getEntityById } from '../helpers/entity.helpers';
import { VolumeDTO } from '../models/volume.models';
import { selectRouterParams } from '../store/router/router.selectors';
import { VolumeCollectionService } from './__entity/volume-collection.service';

interface IVolumeService {
  /** Stream of a volume with published books by router volume id. */
  readonly volumeByRoute$: Observable<VolumeDTO | undefined>;
  /** Search volumes with published books. */
  search(params?: unknown): Observable<VolumeDTO[]>;
  /** Load a volume with published books */
  load(id: string): Observable<VolumeDTO>;
}

const selectKeyByRoute = createSelector(selectRouterParams, params => params?.volumeId);

@Injectable({
  providedIn: 'root',
})
export class VolumeService implements IVolumeService {
  readonly volumeByRoute$: Observable<VolumeDTO | undefined> = combineLatest([
    this.volumeCollection.selectors$.entityMap$,
    this.store.select(selectKeyByRoute),
  ]).pipe(map(getEntityById));

  constructor(private readonly store: Store, private readonly volumeCollection: VolumeCollectionService) {}

  search(params?: unknown): Observable<VolumeDTO[]> {
    return this.volumeCollection.getWithQuery(params as any); // TODO model params
  }

  load(id: string): Observable<VolumeDTO> {
    return this.volumeCollection.getByKey(id);
  }
}
