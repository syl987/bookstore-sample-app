import { Injectable } from '@angular/core';
import { Actions, createEffect, EffectNotification, ofType, OnRunEffects } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import { requireAuth } from 'src/app/helpers/auth.helpers';
import { firebaseError, internalError } from 'src/app/models/error.models';
import { VolumeDTO } from 'src/app/models/volume.models';
import { FirebaseDatabaseService } from 'src/app/services/__api/firebase-database.service';
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
          return of(UserBooksActions.loadError({ error: internalError({ message: `User not logged in.` }) }));
        }
        return this.firebaseApi.getUserBook(this.authService.uid, id).pipe(
          map(book => UserBooksActions.loadSuccess({ book })),
          catchError(err => of(UserBooksActions.loadError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly loadAll = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.loadAll),
      switchMap(_ => {
        if (!this.authService.uid) {
          return of(UserBooksActions.loadAllError({ error: internalError({ message: `User not logged in.` }) }));
        }
        return this.firebaseApi.getUserBooks(this.authService.uid).pipe(
          map(books => UserBooksActions.loadAllSuccess({ books })),
          catchError(err => of(UserBooksActions.loadAllError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly create = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.create),
      exhaustMap(({ volumeData }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.createError({ error: internalError({ message: `User not logged in.` }) }));
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
          map(res => UserBooksActions.createSuccess({ book: res })),
          catchError(err => of(UserBooksActions.createError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly delete = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.delete),
      exhaustMap(({ id }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.deleteError({ error: internalError({ message: `User not logged in.` }) }));
        }
        return this.firebaseApi.deleteUserBook(this.authService.uid, id).pipe(
          map(_ => UserBooksActions.deleteSuccess({ id })),
          catchError(err => of(UserBooksActions.deleteError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly editDraft = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.editDraft),
      exhaustMap(({ id, data }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.editDraftError({ error: internalError({ message: `User not logged in.` }) }));
        }
        return this.firebaseApi.editUserBookDraft(this.authService.uid, id, data).pipe(
          map(res => UserBooksActions.editDraftSuccess({ book: res })),
          catchError(err => of(UserBooksActions.editDraftError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly publish = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.publish),
      exhaustMap(({ id }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.publishError({ error: internalError({ message: `User not logged in.` }) }));
        }
        return this.firebaseApi.publishUserBook(this.authService.uid, id).pipe(
          map(res => UserBooksActions.publishSuccess({ book: res })),
          catchError(err => of(UserBooksActions.publishError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly loadErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.loadError),
        tap(_ => this.toastService.showErrorToast(`Error loading book.`)),
      );
    },
    { dispatch: false },
  );

  readonly loadAllErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.loadAllError),
        tap(_ => this.toastService.showErrorToast(`Error loading books.`)),
      );
    },
    { dispatch: false },
  );

  readonly createSuccessToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.createSuccess),
        tap(_ => this.toastService.showSuccessToast(`Book successfully created.`)),
      );
    },
    { dispatch: false },
  );

  readonly createErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.createError),
        tap(_ => this.toastService.showErrorToast(`Error creating book.`)),
      );
    },
    { dispatch: false },
  );

  readonly deleteSuccessToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.deleteSuccess),
        tap(_ => this.toastService.showSuccessToast(`Book successfully deleted.`)),
      );
    },
    { dispatch: false },
  );

  readonly deleteErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.deleteError),
        tap(_ => this.toastService.showErrorToast(`Error deleting book.`)),
      );
    },
    { dispatch: false },
  );

  readonly editDraftSuccessToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.editDraftSuccess),
        tap(_ => this.toastService.showSuccessToast(`Book successfully updated.`)),
      );
    },
    { dispatch: false },
  );

  readonly editDraftErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.editDraftError),
        tap(_ => this.toastService.showErrorToast(`Error updating book.`)),
      );
    },
    { dispatch: false },
  );

  readonly publishSuccessToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.publishSuccess),
        tap(_ => this.toastService.showSuccessToast(`Book successfully published.`)),
      );
    },
    { dispatch: false },
  );

  readonly publishErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.publishError),
        tap(_ => this.toastService.showErrorToast(`Error publishing book.`)),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions: Actions,
    private readonly authService: AuthService,
    private readonly firebaseApi: FirebaseDatabaseService,
    private readonly toastService: ToastService,
  ) {}

  ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>): Observable<EffectNotification> {
    return requireAuth(this.actions, resolvedEffects$);
  }
}
