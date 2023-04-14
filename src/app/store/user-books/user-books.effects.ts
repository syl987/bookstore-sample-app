import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, throwError } from 'rxjs';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';
import { BookStatus, UserBookDTO } from 'src/app/models/book.models';
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
      switchMap(({ id }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.loadUserBookError({ error: internalError({ message: `User not logged in.` }) }));
        }
        return this.firebaseApi.getUserBook(this.authService.uid, id).pipe(
          map(book => UserBooksActions.loadUserBookSuccess({ book })),
          catchError(err => of(UserBooksActions.loadUserBookError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly loadUserBooks = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.loadUserBooks),
      switchMap(_ => {
        if (!this.authService.uid) {
          return of(UserBooksActions.loadUserBooksError({ error: internalError({ message: `User not logged in.` }) }));
        }
        return this.firebaseApi.getUserBooks(this.authService.uid).pipe(
          map(books => UserBooksActions.loadUserBooksSuccess({ books })),
          catchError(err => of(UserBooksActions.loadUserBooksError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly createUserBook = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.createUserBook),
      switchMap(({ volumeData }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.createUserBookError({ error: internalError({ message: `User not logged in.` }) }));
        }
        const currentUid = this.authService.uid;

        return this.firebaseApi.getVolume(volumeData.id).pipe(
          catchError(err => {
            console.warn(err);
            // TODO check for 404
            if (err.code !== 'TODO some sort of 404 code') {
              return throwError(() => err);
            }
            const volume: VolumeDTO = {
              id: volumeData.id,
              volumeInfo: volumeData.volumeInfo,
              searchInfo: volumeData.searchInfo,
            };
            return this.firebaseApi.createVolume(volume);
          }),
          concatMap(volume => {
            const book: Partial<UserBookDTO> = {
              uid: currentUid,
              status: BookStatus.DRAFT,
              volume,
            };
            return this.firebaseApi.createUserBook(currentUid, book).pipe(
              map(res => UserBooksActions.createUserBookSuccess({ book: res })),
              catchError(err => of(UserBooksActions.createUserBookError({ error: firebaseError({ err }) }))),
            );
          }),
          catchError(err => of(UserBooksActions.createUserBookError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly editUserBookDraft = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.editUserBookDraft),
      switchMap(({ id, book }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.editUserBookDraftError({ error: internalError({ message: `User not logged in.` }) }));
        }
        if (book.uid !== this.authService.uid) {
          return of(UserBooksActions.editUserBookDraftError({ error: internalError({ message: `Invalid user.` }) }));
        }
        if (book.status !== BookStatus.DRAFT) {
          return of(UserBooksActions.editUserBookDraftError({ error: internalError({ message: `Book already published.` }) }));
        }
        return this.firebaseApi.updateUserBook(this.authService.uid, id, book).pipe(
          map(res => UserBooksActions.editUserBookDraftSuccess({ book: res })),
          catchError(err => of(UserBooksActions.editUserBookDraftError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly deleteUserBook = createEffect(() => {
    // TODO also delete the volume if not related to any books
    return this.actions.pipe(
      ofType(UserBooksActions.deleteUserBook),
      switchMap(({ id, book }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.deleteUserBookError({ error: internalError({ message: `User not logged in.` }) }));
        }
        if (book.uid !== this.authService.uid) {
          return of(UserBooksActions.deleteUserBookError({ error: internalError({ message: `Invalid user.` }) }));
        }
        if (book.status !== BookStatus.DRAFT) {
          return of(UserBooksActions.deleteUserBookError({ error: internalError({ message: `Book already published.` }) }));
        }
        return this.firebaseApi.deleteUserBook(this.authService.uid, id).pipe(
          map(_ => UserBooksActions.deleteUserBookSuccess({ id })),
          catchError(err => of(UserBooksActions.deleteUserBookError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly publishUserBook = createEffect(() => {
    // TODO update volume
    return this.actions.pipe(
      ofType(UserBooksActions.publishUserBook),
      concatMap(({ id, book }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.publishUserBookError({ error: internalError({ message: `User not logged in.` }) }));
        }
        if (book.uid !== this.authService.uid) {
          return of(UserBooksActions.publishUserBookError({ error: internalError({ message: `Invalid user.` }) }));
        }
        if (book.status !== BookStatus.DRAFT) {
          return of(UserBooksActions.publishUserBookError({ error: internalError({ message: `Book already published.` }) }));
        }
        if (!book.description) {
          return of(UserBooksActions.publishUserBookError({ error: internalError({ message: `Missing description.` }) }));
        }
        if (book.description.length < 100) {
          return of(UserBooksActions.publishUserBookError({ error: internalError({ message: `Insufficient description.` }) }));
        }
        if (!book.condition) {
          return of(UserBooksActions.publishUserBookError({ error: internalError({ message: `Missing condition.` }) }));
        }
        return this.firebaseApi.updateUserBook(this.authService.uid, id, { status: BookStatus.PUBLISHED }).pipe(
          map(res => UserBooksActions.publishUserBookSuccess({ book: res })),
          catchError(err => of(UserBooksActions.publishUserBookError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly createUserBookSuccessToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.createUserBookSuccess),
        tap(_ => this.toastService.showSuccessToast(`Book successfully created.`)),
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

  readonly deleteUserBookSuccessToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.deleteUserBookSuccess),
        tap(_ => this.toastService.showSuccessToast(`Book successfully deleted.`)),
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

  readonly createUserBookErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.createUserBookError),
        tap(_ => this.toastService.showErrorToast(`Error creating book.`)),
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

  readonly deleteUserBookErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(UserBooksActions.deleteUserBookError),
        tap(_ => this.toastService.showErrorToast(`Error deleting book.`)),
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
