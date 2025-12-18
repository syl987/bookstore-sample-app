import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, EffectNotification, ofType, OnRunEffects } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { FirebaseError } from 'firebase/app';
import { exhaustMap, Observable, of, switchMap, tap } from 'rxjs';

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
  protected readonly actions = inject(Actions);
  protected readonly authService = inject(AuthService);
  protected readonly firebaseApi = inject(FirebaseApiService);
  protected readonly toastService = inject(ToastService);

  readonly load = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.load),
      switchMap(({ id }) => {
        const uid = this.authService.uid();

        if (!uid) {
          return of(UserBooksActions.loadERROR({ error: internalError({ err: new Error($localize`User not logged in.`) }) }));
        }
        return this.firebaseApi.getUserBook(uid, id).pipe(
          mapResponse({
            next: book => UserBooksActions.loadSUCCESS({ book }),
            error: (err: unknown) => {
              if (err instanceof FirebaseError) {
                return UserBooksActions.loadERROR({ error: firebaseError({ err }) });
              }
              return UserBooksActions.loadERROR({ error: internalError({ err: new Error('Connection Error.') }) });
            },
          }),
        );
      }),
    );
  });

  readonly loadAll = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.loadAll),
      switchMap(_ => {
        const uid = this.authService.uid();

        if (!uid) {
          return of(UserBooksActions.loadAllERROR({ error: internalError({ err: new Error($localize`User not logged in.`) }) }));
        }
        return this.firebaseApi.getUserBooks(uid).pipe(
          mapResponse({
            next: books => UserBooksActions.loadAllSUCCESS({ books }),
            error: (err: unknown) => {
              if (err instanceof FirebaseError) {
                return UserBooksActions.loadAllERROR({ error: firebaseError({ err }) });
              }
              return UserBooksActions.loadAllERROR({ error: internalError({ err: new Error('Connection Error.') }) });
            },
          }),
        );
      }),
    );
  });

  readonly create = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.create),
      exhaustMap(({ volumeData }) => {
        const uid = this.authService.uid();

        if (!uid) {
          return of(UserBooksActions.createERROR({ error: internalError({ err: new Error($localize`User not logged in.`) }) }));
        }

        const volume: VolumeDTO = {
          id: volumeData.id,
          volumeInfo: volumeData.volumeInfo,
          searchInfo: volumeData.searchInfo,
        };
        return this.firebaseApi.createUserBook(uid, volume).pipe(
          mapResponse({
            next: res => UserBooksActions.createSUCCESS({ book: res }),
            error: (err: unknown) => {
              if (err instanceof FirebaseError) {
                return UserBooksActions.createERROR({ error: firebaseError({ err }) });
              }
              return UserBooksActions.createERROR({ error: internalError({ err: new Error('Connection Error.') }) });
            },
          }),
        );
      }),
    );
  });

  readonly delete = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.delete),
      exhaustMap(({ id }) => {
        const uid = this.authService.uid();

        if (!uid) {
          return of(UserBooksActions.deleteERROR({ error: internalError({ err: new Error($localize`User not logged in.`) }) }));
        }
        return this.firebaseApi.deleteUserBook(uid, id).pipe(
          mapResponse({
            next: _ => UserBooksActions.deleteSUCCESS({ id }),
            error: (err: unknown) => {
              if (err instanceof FirebaseError) {
                return UserBooksActions.deleteERROR({ error: firebaseError({ err }) });
              }
              return UserBooksActions.deleteERROR({ error: internalError({ err: new Error('Connection Error.') }) });
            },
          }),
        );
      }),
    );
  });

  readonly editDraft = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.editDraft),
      exhaustMap(({ id, data }) => {
        const uid = this.authService.uid();

        if (!uid) {
          return of(UserBooksActions.editDraftERROR({ error: internalError({ err: new Error($localize`User not logged in.`) }) }));
        }
        return this.firebaseApi.editUserBookDraft(uid, id, data).pipe(
          mapResponse({
            next: res => UserBooksActions.editDraftSUCCESS({ book: res }),
            error: (err: unknown) => {
              if (err instanceof FirebaseError) {
                return UserBooksActions.editDraftERROR({ error: firebaseError({ err }) });
              }
              return UserBooksActions.editDraftERROR({ error: internalError({ err: new Error('Connection Error.') }) });
            },
          }),
        );
      }),
    );
  });

  readonly uploadPhoto = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.uploadPhoto),
      exhaustMap(({ bookId, data }) => {
        const uid = this.authService.uid();

        if (!uid) {
          return of(UserBooksActions.uploadPhotoERROR({ error: internalError({ err: new Error($localize`User not logged in.`) }) }));
        }
        return this.firebaseApi.uploadUserBookPhoto(uid, bookId, data).pipe(
          mapResponse({
            next: res => {
              if (res.complete) {
                return UserBooksActions.uploadPhotoSUCCESS({ uploadData: res });
              }
              return UserBooksActions.uploadPhotoPROGRESS({ uploadData: res });
            },
            error: (err: unknown) => {
              if (err instanceof FirebaseError) {
                return UserBooksActions.uploadPhotoERROR({ error: firebaseError({ err }) });
              }
              return UserBooksActions.uploadPhotoERROR({ error: internalError({ err: new Error('Connection Error.') }) });
            },
          }),
        );
      }),
    );
  });

  readonly removePhoto = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.removePhoto),
      exhaustMap(({ bookId, photoId }) => {
        const uid = this.authService.uid();

        if (!uid) {
          return of(UserBooksActions.removePhotoERROR({ error: internalError({ err: new Error($localize`User not logged in.`) }) }));
        }
        return this.firebaseApi.removeUserBookPhoto(uid, bookId, photoId).pipe(
          mapResponse({
            next: _ => UserBooksActions.removePhotoSUCCESS(),
            error: (err: unknown) => {
              if (err instanceof FirebaseError) {
                return UserBooksActions.removePhotoERROR({ error: firebaseError({ err }) });
              }
              return UserBooksActions.removePhotoERROR({ error: internalError({ err: new Error('Connection Error.') }) });
            },
          }),
        );
      }),
    );
  });

  readonly removeAllPhotos = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.removeAllPhotos),
      exhaustMap(({ bookId }) => {
        const uid = this.authService.uid();

        if (!uid) {
          return of(UserBooksActions.removeAllPhotosERROR({ error: internalError({ err: new Error($localize`User not logged in.`) }) }));
        }
        return this.firebaseApi.removeUserBookPhotos(uid, bookId).pipe(
          mapResponse({
            next: _ => UserBooksActions.removeAllPhotosSUCCESS(),
            error: (err: unknown) => {
              if (err instanceof FirebaseError) {
                return UserBooksActions.removeAllPhotosERROR({ error: firebaseError({ err }) });
              }
              return UserBooksActions.removeAllPhotosERROR({ error: internalError({ err: new Error('Connection Error.') }) });
            },
          }),
        );
      }),
    );
  });

  readonly publish = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.publish),
      exhaustMap(({ id }) => {
        const uid = this.authService.uid();

        if (!uid) {
          return of(UserBooksActions.publishERROR({ error: internalError({ err: new Error($localize`User not logged in.`) }) }));
        }
        return this.firebaseApi.publishUserBook(uid, id).pipe(
          mapResponse({
            next: res => UserBooksActions.publishSUCCESS({ book: res }),
            error: (err: unknown) => {
              if (err instanceof FirebaseError) {
                return UserBooksActions.publishERROR({ error: firebaseError({ err }) });
              }
              return UserBooksActions.publishERROR({ error: internalError({ err: new Error('Connection Error.') }) });
            },
          }),
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

  ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>): Observable<EffectNotification> {
    return requireAuth(this.actions, resolvedEffects$);
  }
}
