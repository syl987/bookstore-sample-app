import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { BookStatus, UserBookDTO } from 'src/app/models/book.models';
import { firebaseError, internalError } from 'src/app/models/error.models';
import { VolumeDTO } from 'src/app/models/volume.models';
import { FirebaseDatabaseService } from 'src/app/services/__api/firebase-database.service';
import { AuthService } from 'src/app/services/auth.service';

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
        const initialVolumeData: VolumeDTO = {
          id: volumeData.id,
          volumeInfo: volumeData.volumeInfo,
          searchInfo: volumeData.searchInfo,
          publishedBooks: {},
        };
        const initialUserBookData: Partial<UserBookDTO> = {
          uid: this.authService.uid,
          status: BookStatus.DRAFT,
          volume: volumeData,
        };
        // TODO create volume if not existing
        return this.firebaseApi.createUserBook(this.authService.uid, initialUserBookData).pipe(
          map(book => UserBooksActions.createUserBookSuccess({ book })),
          catchError(err => of(UserBooksActions.createUserBookError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly editUserBookDraft = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.editUserBookDraft),
      switchMap(({ id, data }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.editUserBookDraftError({ error: internalError({ message: `User not logged in.` }) }));
        }
        return this.firebaseApi.updateUserBook(this.authService.uid, id, data).pipe(
          map(book => UserBooksActions.editUserBookDraftSuccess({ book })),
          catchError(err => of(UserBooksActions.editUserBookDraftError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  readonly deleteUserBook = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.deleteUserBook),
      switchMap(({ id }) => {
        if (!this.authService.uid) {
          return of(UserBooksActions.deleteUserBookError({ error: internalError({ message: `User not logged in.` }) }));
        }
        return this.firebaseApi.deleteUserBook(this.authService.uid, id).pipe(
          map(_ => UserBooksActions.deleteUserBookSuccess({ id })),
          catchError(err => of(UserBooksActions.deleteUserBookError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  // TODO copy this one with all the validity checks and messages
  readonly publishUserBook = createEffect(() => {
    return this.actions.pipe(
      ofType(UserBooksActions.publishUserBook),
      switchMap(({ id }) => {
        if (!this.authService.uid) {
          return of(
            UserBooksActions.publishUserBookError({ error: internalError({ message: `Error publishing book. User not logged in.` }) }),
          );
        }
        const currentUid = this.authService.uid;

        return this.firebaseApi.getUserBook(currentUid, id).pipe(
          concatMap(({ uid, status, condition, description }) => {
            if (uid !== currentUid) {
              return of(UserBooksActions.publishUserBookError({ error: internalError({ message: `Invalid user.` }) }));
            }
            if (status !== BookStatus.DRAFT) {
              return of(UserBooksActions.publishUserBookError({ error: internalError({ message: `Invalid status.` }) }));
            }
            if (!description) {
              return of(UserBooksActions.publishUserBookError({ error: internalError({ message: `Missing description.` }) }));
            }
            if (description.length < 42) {
              return of(UserBooksActions.publishUserBookError({ error: internalError({ message: `Insufficient description.` }) }));
            }
            if (!condition) {
              return of(UserBooksActions.publishUserBookError({ error: internalError({ message: `Missing condition.` }) }));
            }
            return this.firebaseApi.updateUserBook(currentUid, id, { status: BookStatus.PUBLISHED }).pipe(
              map(book => UserBooksActions.publishUserBookSuccess({ book })),
              catchError(err => of(UserBooksActions.publishUserBookError({ error: firebaseError({ err }) }))),
            );
          }),
          catchError(err => of(UserBooksActions.publishUserBookError({ error: firebaseError({ err }) }))),
        );
      }),
    );
  });

  // TODO success and error toasts

  constructor(
    private readonly actions: Actions,
    private readonly authService: AuthService,
    private readonly firebaseApi: FirebaseDatabaseService,
  ) {}
}
