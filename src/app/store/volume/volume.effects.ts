import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { firebaseError } from 'src/app/models/error.models';
import { FirebaseDatabaseService } from 'src/app/services/__api/firebase-database.service';
import { ToastService } from 'src/app/services/toast.service';

import { VolumeActions } from './volume.actions';

@Injectable()
export class VolumesEffects {
  readonly load = createEffect(() => {
    return this.actions.pipe(
      ofType(VolumeActions.load),
      switchMap(({ id }) => {
        return this.firebaseApi.getVolume(id).pipe(
          map(volume => VolumeActions.loadSuccess({ volume })),
          catchError(err => of(VolumeActions.loadError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly loadAll = createEffect(() => {
    return this.actions.pipe(
      ofType(VolumeActions.loadAll),
      switchMap(_ => {
        return this.firebaseApi.getVolumes().pipe(
          map(res => VolumeActions.loadAllSuccess({ volumes: res })),
          catchError(err => of(VolumeActions.loadAllError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly filterOnLoadSuccess = createEffect(() => {
    return this.actions.pipe(
      ofType(VolumeActions.loadAllSuccess),
      map(_ => VolumeActions.filter({ query: '' })),
    );
  });

  readonly loadErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(VolumeActions.loadError),
        tap(_ => this.toastService.showErrorToast(`Error loading volume.`)),
      );
    },
    { dispatch: false },
  );

  readonly loadAllErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(VolumeActions.loadAllError),
        tap(_ => this.toastService.showErrorToast(`Error loading volumes.`)),
      );
    },
    { dispatch: false },
  );

  constructor(private readonly actions: Actions, private readonly firebaseApi: FirebaseDatabaseService, private readonly toastService: ToastService) {}
}
