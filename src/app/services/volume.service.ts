import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, Observable, of, shareReplay, take, throwError } from 'rxjs';

import { BookDTO } from '../models/book.models';
import { VolumeDTO } from '../models/volume.models';
import { VolumeActions } from '../store/volume/volume.actions';
import { volumeFeature } from '../store/volume/volume.reducer';

interface IVolumeService {
  /** Load a volume with published books. */
  load(id: string): Observable<VolumeDTO>;
  /** Load all volumes with published books. */
  loadAll(): Observable<VolumeDTO[]>;
  /** Filter all loaded volumes with published books by title. */
  filter(query: string): void;
  /** Buy a book offer. */
  buyOffer(volumeId: string, offerId: string): Observable<BookDTO>;
}

@Injectable({
  providedIn: 'root',
})
export class VolumeService implements IVolumeService {
  readonly entities$ = this.store.select(volumeFeature.selectAll);
  readonly entitiesTotal$ = this.store.select(volumeFeature.selectTotal);

  readonly entitiesFiltered$ = this.store.select(volumeFeature.selectAllFiltered);

  readonly entitiyByRoute$ = this.store.select(volumeFeature.selectByRoute);

  readonly filterQuery$ = this.store.select(volumeFeature.selectFilterQuery);

  readonly loadPending$ = this.store.select(volumeFeature.selectLoadPending);
  readonly loadError$ = this.store.select(volumeFeature.selectLoadError);

  constructor(private readonly store: Store, private readonly actions: Actions) {}

  load(id: string): Observable<VolumeDTO> {
    this.store.dispatch(VolumeActions.load({ id }));

    const result = this.actions.pipe(
      ofType(VolumeActions.loadSUCCESS, VolumeActions.loadERROR),
      take(1),
      concatMap(action => {
        if (action.type === VolumeActions.loadSUCCESS.type) {
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
      ofType(VolumeActions.loadAllSUCCESS, VolumeActions.loadAllERROR),
      take(1),
      concatMap(action => {
        if (action.type === VolumeActions.loadAllSUCCESS.type) {
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
    this.store.dispatch(VolumeActions.filter({ query }));
  }

  buyOffer(volumeId: string, offerId: string): Observable<BookDTO> {
    this.store.dispatch(VolumeActions.buyOffer({ volumeId, offerId }));

    const result = this.actions.pipe(
      ofType(VolumeActions.buyOfferSUCCESS, VolumeActions.buyOfferERROR),
      take(1),
      concatMap(action => {
        if (action.type === VolumeActions.buyOfferSUCCESS.type) {
          return of(action.book);
        }
        return throwError(() => action.error);
      }),
      shareReplay(1),
    );
    result.subscribe();
    return result;
  }
}
