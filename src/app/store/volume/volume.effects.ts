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
  readonly loadVolumes = createEffect(() => {
    return this.actions.pipe(
      ofType(VolumeActions.loadVolumes),
      switchMap(({ cid }) => {
        return this.firebaseApi.getVolumes().pipe(
          map(res => VolumeActions.loadVolumesSuccess({ cid, volumes: res })),
          catchError(err => of(VolumeActions.loadVolumesError({ cid, error: firebaseError({ err }) }))),
        );
      }),
    );
  });

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
