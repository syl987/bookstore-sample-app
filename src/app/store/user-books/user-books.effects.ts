import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, EffectNotification, ofType, OnRunEffects } from '@ngrx/effects';
import { catchError, concatMap, exhaustMap, map, Observable, of, switchMap, tap } from 'rxjs';
import { requireAuth } from 'src/app/helpers/auth.helpers';
import { toActionErrorMessage, toActionSuccessMessage } from 'src/app/helpers/error.helpers';
import { firebaseError, internalError } from 'src/app/models/error.models';
import { VolumeDTO } from 'src/app/models/volume.models';
import { FirebaseApiService } from 'src/app/services/__api/firebase-api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

import { UserBooksActions } from './user-books.actions';

@Injectable()
export class UserBooksEffects implements OnRunEffects {
  readonly load = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.load),
      concatLatestFrom(() => this.authService.user$),
      switchMap(([{ id }, user]) => {
        if (!user?.uid) {
          return of(UserBooksActions.loadERROR({ error: internalError({ message: $localize`User not logged in.` }) }));
        }
        return this.firebaseApi.getUserBook(user.uid, id).pipe(
          map(book => UserBooksActions.loadSUCCESS({ book })),
          catchError(err => of(UserBooksActions.loadERROR({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly loadAll = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.loadAll),
      concatLatestFrom(() => this.authService.user$),
      switchMap(([_, user]) => {
        if (!user?.uid) {
          return of(UserBooksActions.loadAllERROR({ error: internalError({ message: $localize`User not logged in.` }) }));
        }
        return this.firebaseApi.getUserBooks(user.uid).pipe(
          map(books => UserBooksActions.loadAllSUCCESS({ books })),
          catchError(err => of(UserBooksActions.loadAllERROR({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly create = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.create),
      concatLatestFrom(() => this.authService.user$),
      exhaustMap(([{ volumeData }, user]) => {
        if (!user?.uid) {
          return of(UserBooksActions.createERROR({ error: internalError({ message: $localize`User not logged in.` }) }));
        }

        const volume: VolumeDTO = {
          id: volumeData.id,
          volumeInfo: volumeData.volumeInfo,
          searchInfo: volumeData.searchInfo,
        };
        return this.firebaseApi.createUserBook(user.uid, volume).pipe(
          map(res => UserBooksActions.createSUCCESS({ book: res })),
          catchError(err => of(UserBooksActions.createERROR({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly delete = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.delete),
      concatLatestFrom(() => this.authService.user$),
      exhaustMap(([{ id }, user]) => {
        if (!user?.uid) {
          return of(UserBooksActions.deleteERROR({ error: internalError({ message: $localize`User not logged in.` }) }));
        }
        return this.firebaseApi.deleteUserBook(user.uid, id).pipe(
          map(_ => UserBooksActions.deleteSUCCESS({ id })),
          catchError(err => of(UserBooksActions.deleteERROR({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly editDraft = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.editDraft),
      concatLatestFrom(() => this.authService.user$),
      exhaustMap(([{ id, data }, user]) => {
        if (!user?.uid) {
          return of(UserBooksActions.editDraftERROR({ error: internalError({ message: $localize`User not logged in.` }) }));
        }
        return this.firebaseApi.editUserBookDraft(user.uid, id, data).pipe(
          map(res => UserBooksActions.editDraftSUCCESS({ book: res })),
          catchError(err => of(UserBooksActions.editDraftERROR({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly uploadPhoto = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.uploadPhoto),
      concatLatestFrom(() => this.authService.user$),
      exhaustMap(([{ bookId, data }, user]) => {
        if (!user?.uid) {
          return of(UserBooksActions.uploadPhotoERROR({ error: internalError({ message: $localize`User not logged in.` }) }));
        }
        return this.firebaseApi.uploadUserBookPhoto(user.uid, bookId, data).pipe(
          concatMap(res => {
            if (res.complete) {
              return of(UserBooksActions.uploadPhotoSUCCESS({ uploadData: res }));
            }
            return of(UserBooksActions.uploadPhotoPROGRESS({ uploadData: res }));
          }),
          catchError(err => of(UserBooksActions.uploadPhotoERROR({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly removePhoto = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.removePhoto),
      concatLatestFrom(() => this.authService.user$),
      exhaustMap(([{ bookId, photoId }, user]) => {
        if (!user?.uid) {
          return of(UserBooksActions.removePhotoERROR({ error: internalError({ message: $localize`User not logged in.` }) }));
        }
        return this.firebaseApi.removeUserBookPhoto(user.uid, bookId, photoId).pipe(
          map(_ => UserBooksActions.removePhotoSUCCESS()),
          catchError(err => of(UserBooksActions.removePhotoERROR({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly removeAllPhotos = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.removeAllPhotos),
      concatLatestFrom(() => this.authService.user$),
      exhaustMap(([{ bookId }, user]) => {
        if (!user?.uid) {
          return of(UserBooksActions.removeAllPhotosERROR({ error: internalError({ message: $localize`User not logged in.` }) }));
        }
        return this.firebaseApi.removeUserBookPhotos(user.uid, bookId).pipe(
          map(_ => UserBooksActions.removeAllPhotosSUCCESS()),
          catchError(err => of(UserBooksActions.removeAllPhotosERROR({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly publish = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.publish),
      concatLatestFrom(() => this.authService.user$),
      exhaustMap(([{ id }, user]) => {
        if (!user?.uid) {
          return of(UserBooksActions.publishERROR({ error: internalError({ message: $localize`User not logged in.` }) }));
        }
        return this.firebaseApi.publishUserBook(user.uid, id).pipe(
          map(res => UserBooksActions.publishSUCCESS({ book: res })),
          catchError(err => of(UserBooksActions.publishERROR({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly successToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.createSUCCESS, UserBooksActions.editDraftSUCCESS, UserBooksActions.publishSUCCESS, UserBooksActions.deleteSUCCESS),
        tap(action => this.toastService.showSuccessToast(toActionSuccessMessage(action, [['publish', $localize`Book successfully published.`]]))),
      );
    },
    { dispatch: false },
  );

  readonly errorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(
          UserBooksActions.loadERROR,
          UserBooksActions.loadAllERROR,
          UserBooksActions.createERROR,
          UserBooksActions.deleteERROR,
          UserBooksActions.editDraftERROR,
          UserBooksActions.publishERROR,
        ),
        tap(action => this.toastService.showErrorToast(toActionErrorMessage(action, [['publish', $localize`Error publishing book.`]]))),
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

  ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>): Observable<EffectNotification> {
    return requireAuth(this.actions, resolvedEffects$);
  }
}
