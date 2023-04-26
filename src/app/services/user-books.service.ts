import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, shareReplay, take } from 'rxjs/operators';

import { UserBookDTO, UserBookEditDraftDTO } from '../models/book.models';
import { GoogleBooksVolumeDTO } from '../models/google-books.models';
import { userBooksActions } from '../store/user-books/user-books.actions';
import * as UserBooksSelectors from '../store/user-books/user-books.selectors';

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
  readonly userBooks$ = this.store.select(UserBooksSelectors.selectUserBooksAll);
  readonly userBooksTotal$ = this.store.select(UserBooksSelectors.selectUserBooksTotal);

  readonly userBooksDraft$ = this.store.select(UserBooksSelectors.selectUserBooksDraft);
  readonly userBooksPublished$ = this.store.select(UserBooksSelectors.selectUserBooksPublished);
  readonly userBooksSold$ = this.store.select(UserBooksSelectors.selectUserBooksSold);

  readonly userBookByRoute$ = this.store.select(UserBooksSelectors.selectUserBookByRoute);

  readonly loadPending$ = this.store.select(UserBooksSelectors.selectUserBooksLoadPending);
  readonly loadError$ = this.store.select(UserBooksSelectors.selectUserBooksLoadError);

  readonly createPending$ = this.store.select(UserBooksSelectors.selectUserBooksCreatePending);
  readonly createError$ = this.store.select(UserBooksSelectors.selectUserBooksCreateError);

  readonly deletePending$ = this.store.select(UserBooksSelectors.selectUserBooksDeletePending);
  readonly deleteError$ = this.store.select(UserBooksSelectors.selectUserBooksDeleteError);

  readonly editDraftPending$ = this.store.select(UserBooksSelectors.selectUserBooksEditDraftPending);
  readonly editDraftError$ = this.store.select(UserBooksSelectors.selectUserBooksEditDraftError);

  readonly publishPending$ = this.store.select(UserBooksSelectors.selectUserBooksPublishPending);
  readonly publishError$ = this.store.select(UserBooksSelectors.selectUserBooksPublishError);

  constructor(private readonly store: Store, private readonly actions: Actions) {}

  load(id: string): Observable<UserBookDTO> {
    this.store.dispatch(userBooksActions.load({ id }));

    const result = this.actions.pipe(
      ofType(userBooksActions.loadSuccess, userBooksActions.loadError),
      take(1),
      concatMap(action => {
        if (action.type === userBooksActions.loadSuccess.type) {
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
    this.store.dispatch(userBooksActions.loadAll());

    const result = this.actions.pipe(
      ofType(userBooksActions.loadAllSuccess, userBooksActions.loadAllError),
      take(1),
      concatMap(action => {
        if (action.type === userBooksActions.loadAllSuccess.type) {
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
    this.store.dispatch(userBooksActions.create({ volumeData }));

    const result = this.actions.pipe(
      ofType(userBooksActions.createSuccess, userBooksActions.createError),
      take(1),
      concatMap(action => {
        if (action.type === userBooksActions.createSuccess.type) {
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
    this.store.dispatch(userBooksActions.delete({ id }));

    const result = this.actions.pipe(
      ofType(userBooksActions.deleteSuccess, userBooksActions.deleteError),
      take(1),
      concatMap(action => {
        if (action.type === userBooksActions.deleteSuccess.type) {
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
    this.store.dispatch(userBooksActions.editDraft({ id, data }));

    const result = this.actions.pipe(
      ofType(userBooksActions.editDraftSuccess, userBooksActions.editDraftError),
      take(1),
      concatMap(action => {
        if (action.type === userBooksActions.editDraftSuccess.type) {
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
    this.store.dispatch(userBooksActions.publish({ id }));

    const result = this.actions.pipe(
      ofType(userBooksActions.publishSuccess, userBooksActions.publishError),
      take(1),
      concatMap(action => {
        if (action.type === userBooksActions.publishSuccess.type) {
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
