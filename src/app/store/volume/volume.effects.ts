import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { firebaseError } from 'src/app/models/error.models';
import { FirebaseDatabaseService } from 'src/app/services/__api/firebase-database.service';
import { ToastService } from 'src/app/services/toast.service';

import { SearchActions } from '../search/search.actions';
import { searchFeature } from '../search/search.reducer';
import { VolumeActions } from './volume.actions';

@Injectable()
export class VolumesEffects {
  readonly load = createEffect(() => {
    return this.actions.pipe(
      ofType(VolumeActions.load),
      switchMap(({ id }) => {
        return this.firebaseApi.getVolume(id).pipe(
          map(volume => VolumeActions.loadSUCCESS({ volume })),
          catchError(err => of(VolumeActions.loadERROR({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly loadAll = createEffect(() => {
    return this.actions.pipe(
      ofType(VolumeActions.loadAll),
      switchMap(_ => {
        return this.firebaseApi.getVolumes().pipe(
          map(res => VolumeActions.loadAllSUCCESS({ volumes: res })),
          catchError(err => of(VolumeActions.loadAllERROR({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly applyFilter = createEffect(() => {
    return this.actions.pipe(
      ofType(VolumeActions.loadSUCCESS, VolumeActions.loadAllSUCCESS), // any volume entity state mutation action
      concatLatestFrom(() => this.store.select(searchFeature.selectQuery)),
      map(([_, query]) => SearchActions.applyFilterINTERNAL({ query })),
    );
  });

  readonly loadErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(VolumeActions.loadERROR),
        tap(_ => this.toastService.showErrorToast(`Error loading volume.`)),
      );
    },
    { dispatch: false },
  );

  readonly loadAllErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(VolumeActions.loadAllERROR),
        tap(_ => this.toastService.showErrorToast(`Error loading volumes.`)),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions: Actions,
    private readonly store: Store,
    private readonly firebaseApi: FirebaseDatabaseService,
    private readonly toastService: ToastService,
  ) {}
}
