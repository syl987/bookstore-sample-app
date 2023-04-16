import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';
import { firebaseError, internalError } from 'src/app/models/error.models';
import { VolumeDTO } from 'src/app/models/volume.models';
import { FirebaseDatabaseService } from 'src/app/services/__api/firebase-database.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

import * as UserBooksActions from './user-books.actions';

@Injectable()
export class UserBooksEffects {
  readonly loadUserBook = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.loadUserBook),
      switchMap(({ cid, id }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.loadUserBookError({ cid, error: internalError({ message: `User not logged in.` }) }));
        }
        return this.firebaseApi.getUserBook(this.authService.uid, id).pipe(
          map(book => UserBooksActions.loadUserBookSuccess({ cid, book })),
          catchError(err => of(UserBooksActions.loadUserBookError({ cid, error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly loadUserBooks = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.loadUserBooks),
      switchMap(({ cid }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.loadUserBooksError({ cid, error: internalError({ message: `User not logged in.` }) }));
        }
        return this.firebaseApi.getUserBooks(this.authService.uid).pipe(
          map(books => UserBooksActions.loadUserBooksSuccess({ cid, books })),
          catchError(err => of(UserBooksActions.loadUserBooksError({ cid, error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly createUserBook = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.createUserBook),
      switchMap(({ cid, volumeData }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.createUserBookError({ cid, error: internalError({ message: `User not logged in.` }) }));
        }
        const currentUid = this.authService.uid;

        const volume: VolumeDTO = {
          id: volumeData.id,
          volumeInfo: volumeData.volumeInfo,
          searchInfo: volumeData.searchInfo,
        };
        return this.firebaseApi.createUserBook(currentUid, volume).pipe(
          map(res => UserBooksActions.createUserBookSuccess({ cid, book: res })),
          catchError(err => of(UserBooksActions.createUserBookError({ cid, error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly deleteUserBook = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.deleteUserBook),
      switchMap(({ cid, id }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.deleteUserBookError({ cid, error: internalError({ message: `User not logged in.` }) }));
        }
        return this.firebaseApi.deleteUserBook(this.authService.uid, id).pipe(
          map(_ => UserBooksActions.deleteUserBookSuccess({ cid, id })),
          catchError(err => of(UserBooksActions.deleteUserBookError({ cid, error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly editUserBookDraft = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.editUserBookDraft),
      switchMap(({ cid, id, data }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.editUserBookDraftError({ cid, error: internalError({ message: `User not logged in.` }) }));
        }
        return this.firebaseApi.editUserBookDraft(this.authService.uid, id, data).pipe(
          map(res => UserBooksActions.editUserBookDraftSuccess({ cid, book: res })),
          catchError(err => of(UserBooksActions.editUserBookDraftError({ cid, error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly publishUserBook = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.publishUserBook),
      concatMap(({ cid, id }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.publishUserBookError({ cid, error: internalError({ message: `User not logged in.` }) }));
        }
        return this.firebaseApi.publishUserBook(this.authService.uid, id).pipe(
          map(res => UserBooksActions.publishUserBookSuccess({ cid, book: res })),
          catchError(err => of(UserBooksActions.publishUserBookError({ cid, error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly loadUserBookErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.loadUserBookError),
        tap(_ => this.toastService.showErrorToast(`Error loading book.`)),
      );
    },
    { dispatch: false },
  );

  readonly loadUserBooksErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.loadUserBooksError),
        tap(_ => this.toastService.showErrorToast(`Error loading books.`)),
      );
    },
    { dispatch: false },
  );

  readonly createUserBookSuccessToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.createUserBookSuccess),
        tap(_ => this.toastService.showSuccessToast(`Book successfully created.`)),
      );
    },
    { dispatch: false },
  );

  readonly createUserBookErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.createUserBookError),
        tap(_ => this.toastService.showErrorToast(`Error creating book.`)),
      );
    },
    { dispatch: false },
  );

  readonly deleteUserBookSuccessToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.deleteUserBookSuccess),
        tap(_ => this.toastService.showSuccessToast(`Book successfully deleted.`)),
      );
    },
    { dispatch: false },
  );

  readonly deleteUserBookErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.deleteUserBookError),
        tap(_ => this.toastService.showErrorToast(`Error deleting book.`)),
      );
    },
    { dispatch: false },
  );

  readonly editUserBookDraftSuccessToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.editUserBookDraftSuccess),
        tap(_ => this.toastService.showSuccessToast(`Book successfully updated.`)),
      );
    },
    { dispatch: false },
  );

  readonly editUserBookDraftErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.editUserBookDraftError),
        tap(_ => this.toastService.showErrorToast(`Error updating book.`)),
      );
    },
    { dispatch: false },
  );

  readonly publishUserBookSuccessToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.publishUserBookSuccess),
        tap(_ => this.toastService.showSuccessToast(`Book successfully published.`)),
      );
    },
    { dispatch: false },
  );

  readonly publishUserBookErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.publishUserBookError),
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
