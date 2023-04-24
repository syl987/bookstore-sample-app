import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { firebaseError } from 'src/app/models/error.models';
import { FirebaseDatabaseService } from 'src/app/services/__api/firebase-database.service';
import { ToastService } from 'src/app/services/toast.service';

import * as VolumeActions from './volume.actions';

@Injectable()
export class VolumesEffects {
  readonly loadVolume = createEffect(() => {
    return this.actions.pipe(
      ofType(VolumeActions.loadVolume),
      switchMap(({ id }) => {
        return this.firebaseApi.getVolume(id).pipe(
          map(volume => VolumeActions.loadVolumeSuccess({ volume })),
          catchError(err => of(VolumeActions.loadVolumeError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly loadVolumes = createEffect(() => {
    return this.actions.pipe(
      ofType(VolumeActions.loadVolumes),
      switchMap(_ => {
        return this.firebaseApi.getVolumes().pipe(
          map(res => VolumeActions.loadVolumesSuccess({ volumes: res })),
          catchError(err => of(VolumeActions.loadVolumesError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly loadVolumesFilter = createEffect(() => {
    return this.actions.pipe(
      ofType(VolumeActions.loadVolumesSuccess),
      map(_ => VolumeActions.filterVolumes({ query: '' })),
    );
  });

  readonly loadVolumeErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(VolumeActions.loadVolumeError),
        tap(_ => this.toastService.showErrorToast(`Error loading volume.`)),
      );
    },
    { dispatch: false },
  );

  readonly loadVolumesErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(VolumeActions.loadVolumesError),
        tap(_ => this.toastService.showErrorToast(`Error loading volumes.`)),
      );
    },
    { dispatch: false },
  );

  constructor(private readonly actions: Actions, private readonly firebaseApi: FirebaseDatabaseService, private readonly toastService: ToastService) {}
}
