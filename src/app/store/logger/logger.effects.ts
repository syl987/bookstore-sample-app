import { Injectable, inject } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom, mapResponse } from '@ngrx/operators';
import { concatMap, map, of } from 'rxjs';

import { firebaseError, internalError, unknownError } from 'src/app/models/error.models';
import { FirebaseApiService } from 'src/app/services/__api/firebase-api.service';
import { AuthService } from 'src/app/services/auth.service';

import { LoggerActions } from './logger.actions';
import { UserBooksActions } from '../user-books/user-books.actions';
import { VolumeActions } from '../volume/volume.actions';

@Injectable()
export class LoggerEffects {
  protected readonly actions = inject(Actions);
  protected readonly authService = inject(AuthService);
  protected readonly firebaseApi = inject(FirebaseApiService);

  readonly createErrorLog = createEffect(() => {
    return this.actions.pipe(
      ofType(
        UserBooksActions.createERROR,
        UserBooksActions.deleteERROR,
        UserBooksActions.publishERROR,
        UserBooksActions.uploadPhotoERROR,
        UserBooksActions.removePhotoERROR,
        UserBooksActions.removeAllPhotosERROR,
        VolumeActions.buyOfferERROR,
      ),
      map(({ error }) => {
        const { err } = error as ReturnType<typeof firebaseError>;

        if (err && err instanceof FirebaseError) {
          error = {
            code: err.code,
            message: err.message,
            customData: err.customData ?? null,
          } as any;
        }
        return LoggerActions.logError({ data: error });
      }),
    );
  });

  readonly logError = createEffect(() => {
    return this.actions.pipe(
      ofType(LoggerActions.logError),
      concatLatestFrom(() => this.authService.uid$),
      concatMap(([{ data }, uid]) => {
        if (!uid) {
          return of(LoggerActions.logErrorERROR({ error: internalError({ err: new Error($localize`User not logged in.`) }) }));
        }
        return this.firebaseApi.logError(uid, data).pipe(
          mapResponse({
            next: _ => LoggerActions.logErrorSUCCESS(),
            error: (err: unknown) => {
              if (err instanceof FirebaseError) {
                return LoggerActions.logErrorERROR({ error: firebaseError({ err }) });
              }
              return VolumeActions.loadERROR({ error: unknownError({ err }) });
            },
          }),
        );
      }),
    );
  });
}
