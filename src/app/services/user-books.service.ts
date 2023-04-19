import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, shareReplay, take } from 'rxjs/operators';

import { UserBookDTO, UserBookEditDraftDTO } from '../models/book.models';
import { GoogleBooksVolumeDTO } from '../models/google-books.models';
import * as UserBooksActions from '../store/user-books/user-books.actions';
import {
  selectUserBookByRoute,
  selectUserBooksAll,
  selectUserBooksCreating,
  selectUserBooksDeleting,
  selectUserBooksDraft,
  selectUserBooksEditingDraft,
  selectUserBooksError,
  selectUserBooksLoading,
  selectUserBooksPublished,
  selectUserBooksPublishing,
  selectUserBooksSold,
  selectUserBooksTotal,
} from '../store/user-books/user-books.selectors';

interface IUserBooksService {
  /** Load a book with volume data. */
  load(id: string): Observable<UserBookDTO>;
  /** Load all books with volume data. */
  loadAll(): Observable<UserBookDTO[]>;
  /** Create a new volume from google books if missing and add a new book with initial data to it. */
  create(volumeData: GoogleBooksVolumeDTO): Observable<UserBookDTO>;
  /** Delete a book. Delete the volume if not related to any books. */
  delete(id: string, book: UserBookDTO): Observable<void>;
  /** Edit data of an unpublished book. */
  editDraft(id: string, book: UserBookDTO): Observable<UserBookDTO>;
  /** Publish a book. */
  publish(id: string, book: UserBookDTO): Observable<UserBookDTO>;
  /** Buy a book. */
  buy(id: string, book: UserBookDTO): Observable<UserBookDTO>;
}

@Injectable({
  providedIn: 'root',
})
export class UserBooksService implements IUserBooksService {
  readonly userBooks$ = this.store.select(selectUserBooksAll);
  readonly userBooksTotal$ = this.store.select(selectUserBooksTotal);

  readonly userBooksDraft$ = this.store.select(selectUserBooksDraft);
  readonly userBooksPublished$ = this.store.select(selectUserBooksPublished);
  readonly userBooksSold$ = this.store.select(selectUserBooksSold);

  readonly userBookByRoute$ = this.store.select(selectUserBookByRoute);

  readonly loading$ = this.store.select(selectUserBooksLoading);
  readonly creating$ = this.store.select(selectUserBooksCreating);
  readonly deleting$ = this.store.select(selectUserBooksDeleting);
  readonly editingDraft$ = this.store.select(selectUserBooksEditingDraft);
  readonly publishing$ = this.store.select(selectUserBooksPublishing);
  readonly error$ = this.store.select(selectUserBooksError);

  constructor(private readonly store: Store, private readonly actions: Actions) {}

  load(id: string): Observable<UserBookDTO> {
    this.store.dispatch(UserBooksActions.loadUserBook({ id }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.loadUserBookSuccess, UserBooksActions.loadUserBookError),
      take(1),
      concatMap(action => {
        if (action.type === UserBooksActions.loadUserBookSuccess.type) {
          return of(action.book);
        }
        return throwError(() => action.error);
      }),
      shareReplay(1),
    );
    result.subscribe();
    return result;
  }

  loadAll(): Observable<UserBookDTO[]> {
    this.store.dispatch(UserBooksActions.loadUserBooks());

    const result = this.actions.pipe(
      ofType(UserBooksActions.loadUserBooksSuccess, UserBooksActions.loadUserBooksError),
      take(1),
      concatMap(action => {
        if (action.type === UserBooksActions.loadUserBooksSuccess.type) {
          return of(action.books);
        }
        return throwError(() => action.error);
      }),
      shareReplay(1),
    );
    result.subscribe();
    return result;
  }

  create(volumeData: GoogleBooksVolumeDTO): Observable<UserBookDTO> {
    this.store.dispatch(UserBooksActions.createUserBook({ volumeData }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.createUserBookSuccess, UserBooksActions.createUserBookError),
      take(1),
      concatMap(action => {
        if (action.type === UserBooksActions.createUserBookSuccess.type) {
          return of(action.book);
        }
        return throwError(() => action.error);
      }),
      shareReplay(1),
    );
    result.subscribe();
    return result;
  }

  delete(id: string): Observable<void> {
    this.store.dispatch(UserBooksActions.deleteUserBook({ id }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.deleteUserBookSuccess, UserBooksActions.deleteUserBookError),
      take(1),
      concatMap(action => {
        if (action.type === UserBooksActions.deleteUserBookSuccess.type) {
          return of(undefined);
        }
        return throwError(() => action.error);
      }),
      shareReplay(1),
    );
    result.subscribe();
    return result;
  }

  editDraft(id: string, data: UserBookEditDraftDTO): Observable<UserBookDTO> {
    this.store.dispatch(UserBooksActions.editUserBookDraft({ id, data }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.editUserBookDraftSuccess, UserBooksActions.editUserBookDraftError),
      take(1),
      concatMap(action => {
        if (action.type === UserBooksActions.editUserBookDraftSuccess.type) {
          return of(action.book);
        }
        return throwError(() => action.error);
      }),
      shareReplay(1),
    );
    result.subscribe();
    return result;
  }

  publish(id: string): Observable<UserBookDTO> {
    this.store.dispatch(UserBooksActions.publishUserBook({ id }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.publishUserBookSuccess, UserBooksActions.publishUserBookError),
      take(1),
      concatMap(action => {
        if (action.type === UserBooksActions.publishUserBookSuccess.type) {
          return of(action.book);
        }
        return throwError(() => action.error);
      }),
      shareReplay(1),
    );
    result.subscribe();
    return result;
  }

  buy(id: string): Observable<UserBookDTO> {
    throw new Error('Method not implemented.');
  }
}
