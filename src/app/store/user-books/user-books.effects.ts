import { Injectable } from '@angular/core';
import { Actions, createEffect, EffectNotification, ofType, OnRunEffects } from '@ngrx/effects';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
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
      switchMap(({ id }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.loadERROR({ error: internalError({ message: $localize`User not logged in.` }) }));
        }
        return this.firebaseApi.getUserBook(this.authService.uid, id).pipe(
          map(book => UserBooksActions.loadSUCCESS({ book })),
          catchError(err => of(UserBooksActions.loadERROR({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly loadAll = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.loadAll),
      switchMap(_ => {
        if (!this.authService.uid) {
          return of(UserBooksActions.loadAllERROR({ error: internalError({ message: $localize`User not logged in.` }) }));
        }
        return this.firebaseApi.getUserBooks(this.authService.uid).pipe(
          map(books => UserBooksActions.loadAllSUCCESS({ books })),
          catchError(err => of(UserBooksActions.loadAllERROR({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly create = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.create),
      exhaustMap(({ volumeData }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.createERROR({ error: internalError({ message: $localize`User not logged in.` }) }));
        }
        const currentUid = this.authService.uid;

        const volume: VolumeDTO = {
          id: volumeData.id,
          volumeInfo: volumeData.volumeInfo,
          searchInfo: {
            textSnippet: volumeData.searchInfo?.textSnippet ?? null,
          },
        };
        return this.firebaseApi.createUserBook(currentUid, volume).pipe(
          map(res => UserBooksActions.createSUCCESS({ book: res })),
          catchError(err => of(UserBooksActions.createERROR({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly delete = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.delete),
      exhaustMap(({ id }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.deleteERROR({ error: internalError({ message: $localize`User not logged in.` }) }));
        }
        return this.firebaseApi.deleteUserBook(this.authService.uid, id).pipe(
          map(_ => UserBooksActions.deleteSUCCESS({ id })),
          catchError(err => of(UserBooksActions.deleteERROR({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly editDraft = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.editDraft),
      exhaustMap(({ id, data }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.editDraftERROR({ error: internalError({ message: $localize`User not logged in.` }) }));
        }
        return this.firebaseApi.editUserBookDraft(this.authService.uid, id, data).pipe(
          map(res => UserBooksActions.editDraftSUCCESS({ book: res })),
          catchError(err => of(UserBooksActions.editDraftERROR({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly uploadPhoto = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.uploadPhoto),
      exhaustMap(({ bookId, file }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.uploadPhotoERROR({ error: internalError({ message: $localize`User not logged in.` }) }));
        }
        return this.firebaseApi.uploadUserBookPhoto(this.authService.uid, bookId, file).pipe(
          concatMap(res => {
            switch (res.status) {
              case 'progress':
                return of(UserBooksActions.uploadPhotoPROGRESS({ uploadData: res }));
              case 'complete':
                return of(UserBooksActions.uploadPhotoSUCCESS({ uploadData: res }));
              default:
                return EMPTY;
            }
          }),
          catchError(err => of(UserBooksActions.uploadPhotoERROR({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly removeAllPhotos = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.removeAllPhotos),
      exhaustMap(({ bookId }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.removeAllPhotosERROR({ error: internalError({ message: $localize`User not logged in.` }) }));
        }
        return this.firebaseApi.removeAllUserBookPhotos(this.authService.uid, bookId).pipe(
          map(_ => UserBooksActions.removeAllPhotosSUCCESS()),
          catchError(err => of(UserBooksActions.removeAllPhotosERROR({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly publish = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.publish),
      exhaustMap(({ id }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.publishERROR({ error: internalError({ message: $localize`User not logged in.` }) }));
        }
        return this.firebaseApi.publishUserBook(this.authService.uid, id).pipe(
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
        tap(action => this.toastService.showSuccessToast(toActionErrorMessage(action, [['publish', $localize`Error publishing book.`]]))),
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
