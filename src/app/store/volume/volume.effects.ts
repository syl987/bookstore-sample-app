import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { firebaseError } from 'src/app/models/error.models';
import { FirebaseDatabaseService } from 'src/app/services/__api/firebase-database.service';
import { ToastService } from 'src/app/services/toast.service';

import { volumeActions } from './volume.actions';

@Injectable()
export class VolumesEffects {
  readonly load = createEffect(() => {
    return this.actions.pipe(
      ofType(volumeActions.load),
      switchMap(({ id }) => {
        return this.firebaseApi.getVolume(id).pipe(
          map(volume => volumeActions.loadSuccess({ volume })),
          catchError(err => of(volumeActions.loadError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly loadAll = createEffect(() => {
    return this.actions.pipe(
      ofType(volumeActions.loadAll),
      switchMap(_ => {
        return this.firebaseApi.getVolumes().pipe(
          map(res => volumeActions.loadAllSuccess({ volumes: res })),
          catchError(err => of(volumeActions.loadAllError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly filterOnLoadSuccess = createEffect(() => {
    return this.actions.pipe(
      ofType(volumeActions.loadAllSuccess),
      map(_ => volumeActions.filter({ query: '' })),
    );
  });

  readonly loadErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(volumeActions.loadError),
        tap(_ => this.toastService.showErrorToast(`Error loading volume.`)),
      );
    },
    { dispatch: false },
  );

  readonly loadAllErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(volumeActions.loadAllError),
        tap(_ => this.toastService.showErrorToast(`Error loading volumes.`)),
      );
    },
    { dispatch: false },
  );

  constructor(private readonly actions: Actions, private readonly firebaseApi: FirebaseDatabaseService, private readonly toastService: ToastService) {}
}
