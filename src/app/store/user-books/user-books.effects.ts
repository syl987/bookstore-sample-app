import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import { firebaseError, internalError } from 'src/app/models/error.models';
import { VolumeDTO } from 'src/app/models/volume.models';
import { FirebaseDatabaseService } from 'src/app/services/__api/firebase-database.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

import { userBooksActions } from './user-books.actions';

@Injectable()
export class UserBooksEffects {
  readonly load = createEffect(() => {
    return this.actions.pipe(
      ofType(userBooksActions.load),
      switchMap(({ id }) => {
        if (!this.authService.uid) {
          return of(userBooksActions.loadError({ error: internalError({ message: `User not logged in.` }) }));
        }
        return this.firebaseApi.getUserBook(this.authService.uid, id).pipe(
          map(book => userBooksActions.loadSuccess({ book })),
          catchError(err => of(userBooksActions.loadError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly loadAll = createEffect(() => {
    return this.actions.pipe(
      ofType(userBooksActions.loadAll),
      switchMap(_ => {
        if (!this.authService.uid) {
          return of(userBooksActions.loadAllError({ error: internalError({ message: `User not logged in.` }) }));
        }
        return this.firebaseApi.getUserBooks(this.authService.uid).pipe(
          map(books => userBooksActions.loadAllSuccess({ books })),
          catchError(err => of(userBooksActions.loadAllError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly create = createEffect(() => {
    return this.actions.pipe(
      ofType(userBooksActions.create),
      exhaustMap(({ volumeData }) => {
        if (!this.authService.uid) {
          return of(userBooksActions.createError({ error: internalError({ message: `User not logged in.` }) }));
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
          map(res => userBooksActions.createSuccess({ book: res })),
          catchError(err => of(userBooksActions.createError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly delete = createEffect(() => {
    return this.actions.pipe(
      ofType(userBooksActions.delete),
      exhaustMap(({ id }) => {
        if (!this.authService.uid) {
          return of(userBooksActions.deleteError({ error: internalError({ message: `User not logged in.` }) }));
        }
        return this.firebaseApi.deleteUserBook(this.authService.uid, id).pipe(
          map(_ => userBooksActions.deleteSuccess({ id })),
          catchError(err => of(userBooksActions.deleteError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly editDraft = createEffect(() => {
    return this.actions.pipe(
      ofType(userBooksActions.editDraft),
      exhaustMap(({ id, data }) => {
        if (!this.authService.uid) {
          return of(userBooksActions.editDraftError({ error: internalError({ message: `User not logged in.` }) }));
        }
        return this.firebaseApi.editUserBookDraft(this.authService.uid, id, data).pipe(
          map(res => userBooksActions.editDraftSuccess({ book: res })),
          catchError(err => of(userBooksActions.editDraftError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly publish = createEffect(() => {
    return this.actions.pipe(
      ofType(userBooksActions.publish),
      exhaustMap(({ id }) => {
        if (!this.authService.uid) {
          return of(userBooksActions.publishError({ error: internalError({ message: `User not logged in.` }) }));
        }
        return this.firebaseApi.publishUserBook(this.authService.uid, id).pipe(
          map(res => userBooksActions.publishSuccess({ book: res })),
          catchError(err => of(userBooksActions.publishError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly loadErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(userBooksActions.loadError),
        tap(_ => this.toastService.showErrorToast(`Error loading book.`)),
      );
    },
    { dispatch: false },
  );

  readonly loadAllErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(userBooksActions.loadAllError),
        tap(_ => this.toastService.showErrorToast(`Error loading books.`)),
      );
    },
    { dispatch: false },
  );

  readonly createSuccessToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(userBooksActions.createSuccess),
        tap(_ => this.toastService.showSuccessToast(`Book successfully created.`)),
      );
    },
    { dispatch: false },
  );

  readonly createErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(userBooksActions.createError),
        tap(_ => this.toastService.showErrorToast(`Error creating book.`)),
      );
    },
    { dispatch: false },
  );

  readonly deleteSuccessToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(userBooksActions.deleteSuccess),
        tap(_ => this.toastService.showSuccessToast(`Book successfully deleted.`)),
      );
    },
    { dispatch: false },
  );

  readonly deleteErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(userBooksActions.deleteError),
        tap(_ => this.toastService.showErrorToast(`Error deleting book.`)),
      );
    },
    { dispatch: false },
  );

  readonly editDraftSuccessToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(userBooksActions.editDraftSuccess),
        tap(_ => this.toastService.showSuccessToast(`Book successfully updated.`)),
      );
    },
    { dispatch: false },
  );

  readonly editDraftErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(userBooksActions.editDraftError),
        tap(_ => this.toastService.showErrorToast(`Error updating book.`)),
      );
    },
    { dispatch: false },
  );

  readonly publishSuccessToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(userBooksActions.publishSuccess),
        tap(_ => this.toastService.showSuccessToast(`Book successfully published.`)),
      );
    },
    { dispatch: false },
  );

  readonly publishErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(userBooksActions.publishError),
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
}
