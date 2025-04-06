import { Injectable, inject } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, Observable, of, shareReplay, take, throwError } from 'rxjs';

import { BookDTO, UserBookDTO } from '../models/book.models';
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
  buyOffer(id: string, offerId: string): Observable<BookDTO>;
}

@Injectable({
  providedIn: 'root',
})
export class VolumeService implements IVolumeService {
  private readonly store = inject(Store);
  private readonly actions = inject(Actions);

  readonly entities = this.store.selectSignal(volumeFeature.selectAll);
  readonly entitiesTotal = this.store.selectSignal(volumeFeature.selectTotal);

  readonly entitiesFiltered = this.store.selectSignal(volumeFeature.selectAllFiltered);

  readonly entityByRoute = this.store.selectSignal(volumeFeature.selectByRoute);

  readonly filterQuery = this.store.selectSignal(volumeFeature.selectFilterQuery);

  readonly loadPending = this.store.selectSignal(volumeFeature.selectLoadPending);
  readonly loadError = this.store.selectSignal(volumeFeature.selectLoadError);

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

  buyOffer(id: string, offerId: string): Observable<UserBookDTO> {
    this.store.dispatch(VolumeActions.buyOffer({ id, offerId }));

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
