import { Injectable, inject } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of } from 'rxjs';
import { firebaseError, internalError } from 'src/app/models/error.models';
import { FirebaseApiService } from 'src/app/services/__api/firebase-api.service';
import { AuthService } from 'src/app/services/auth.service';

import { UserBooksActions } from '../user-books/user-books.actions';
import { VolumeActions } from '../volume/volume.actions';
import { LoggerActions } from './logger.actions';

@Injectable()
export class LoggerEffects {
  private readonly actions = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly firebaseApi = inject(FirebaseApiService);

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
      concatMap(({ data }) => {
        const uid = this.authService.uid();

        if (!uid) {
          return of(LoggerActions.logErrorERROR({ error: internalError({ message: $localize`User not logged in.` }) }));
        }
        return this.firebaseApi.logError(uid, data).pipe(
          map(_ => LoggerActions.logErrorSUCCESS()),
          catchError(error => of(LoggerActions.logErrorERROR({ error }))),
        );
      }),
    );
  });

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
}
