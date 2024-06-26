import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';
import { toActionErrorMessage } from 'src/app/helpers/error.helpers';
import { firebaseError, internalError } from 'src/app/models/error.models';
import { FirebaseApiService } from 'src/app/services/__api/firebase-api.service';
import { AuthService } from 'src/app/services/auth.service';
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

  readonly buyOffer = createEffect(() => {
    return this.actions.pipe(
      ofType(VolumeActions.buyOffer),
      exhaustMap(({ id, offerId }) => {
        const uid = this.authService.uid();

        if (!uid) {
          return of(VolumeActions.buyOfferERROR({ error: internalError({ message: $localize`User not logged in.` }) }));
        }
        return this.firebaseApi.buyBookOffer(uid, id, offerId).pipe(
          map(res => VolumeActions.buyOfferSUCCESS({ id, volume: res.volume, book: res.book })),
          catchError(err => of(VolumeActions.buyOfferERROR({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly successToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(VolumeActions.buyOfferSUCCESS),
        tap(action => this.toastService.showSuccessToast(toActionErrorMessage(action, [['buy offer', $localize`Book successfully bought.`]]))),
      );
    },
    { dispatch: false },
  );

  readonly errorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(VolumeActions.loadERROR, VolumeActions.loadAllERROR, VolumeActions.buyOfferERROR),
        tap(action => this.toastService.showErrorToast(toActionErrorMessage(action, [['buy offer', $localize`Error buying book.`]]))),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions: Actions,
    private readonly authService: AuthService,
    private readonly firebaseApi: FirebaseApiService,
    private readonly toastService: ToastService,
  ) {}
}
