import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { toActionErrorMessage } from 'src/app/helpers/error.helpers';
import { firebaseError } from 'src/app/models/error.models';
import { FirebaseApiService } from 'src/app/services/__api/firebase-api.service';
import { ToastService } from 'src/app/services/toast.service';

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
      ofType(VolumeActions.loadSUCCESS, VolumeActions.loadAllSUCCESS), // any entity state mutation action
      map(_ => VolumeActions.applyFilterINTERNAL()),
    );
  });

  readonly errorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(VolumeActions.loadERROR, VolumeActions.loadAllERROR),
        tap(action => this.toastService.showErrorToast(toActionErrorMessage(action))),
      );
    },
    { dispatch: false },
  );

  constructor(private readonly actions: Actions, private readonly firebaseApi: FirebaseApiService, private readonly toastService: ToastService) {}
}
