import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, filter, shareReplay, take } from 'rxjs/operators';

import { nextCorrelationId } from '../helpers/entity.helpers';
import { UserBookDTO, UserBookEditDraftDTO } from '../models/book.models';
import { GoogleBooksVolumeDTO } from '../models/google-books.models';
import * as UserBooksActions from '../store/user-books/user-books.actions';
import {
  selectUserBookByRoute,
  selectUserBooksAll,
  selectUserBooksDraft,
  selectUserBooksError,
  selectUserBooksPending,
  selectUserBooksPublished,
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

  readonly pending$ = this.store.select(selectUserBooksPending);
  readonly error$ = this.store.select(selectUserBooksError);

  constructor(private readonly store: Store, private readonly actions: Actions) {}

  load(id: string): Observable<UserBookDTO> {
    const cid = nextCorrelationId();
    this.store.dispatch(UserBooksActions.loadUserBook({ cid, id }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.loadUserBookSuccess, UserBooksActions.loadUserBookError),
      filter(action => action.cid === cid),
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
    const cid = nextCorrelationId();
    this.store.dispatch(UserBooksActions.loadUserBooks({ cid }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.loadUserBooksSuccess, UserBooksActions.loadUserBooksError),
      filter(action => action.cid === cid),
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
    const cid = nextCorrelationId();
    this.store.dispatch(UserBooksActions.createUserBook({ cid, volumeData }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.createUserBookSuccess, UserBooksActions.createUserBookError),
      filter(action => action.cid === cid),
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
    const cid = nextCorrelationId();
    this.store.dispatch(UserBooksActions.deleteUserBook({ cid, id }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.deleteUserBookSuccess, UserBooksActions.deleteUserBookError),
      filter(action => action.cid === cid),
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
    const cid = nextCorrelationId();
    this.store.dispatch(UserBooksActions.editUserBookDraft({ cid, id, data }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.editUserBookDraftSuccess, UserBooksActions.editUserBookDraftError),
      filter(action => action.cid === cid),
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
    const cid = nextCorrelationId();
    this.store.dispatch(UserBooksActions.publishUserBook({ cid, id }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.publishUserBookSuccess, UserBooksActions.publishUserBookError),
      filter(action => action.cid === cid),
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
