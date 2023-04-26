import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, shareReplay, take } from 'rxjs/operators';

import { UserBookDTO, UserBookEditDraftDTO } from '../models/book.models';
import { GoogleBooksVolumeDTO } from '../models/google-books.models';
import { UserBooksActions } from '../store/user-books/user-books.actions';
import { userBooksFeature } from '../store/user-books/user-books.reducer';

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
  readonly userBooks$ = this.store.select(userBooksFeature.selectAll);
  readonly userBooksTotal$ = this.store.select(userBooksFeature.selectTotal);

  readonly userBooksDraft$ = this.store.select(userBooksFeature.selectAllDraft);
  readonly userBooksPublished$ = this.store.select(userBooksFeature.selectAllPublished);
  readonly userBooksSold$ = this.store.select(userBooksFeature.selectAllSold);

  readonly userBookByRoute$ = this.store.select(userBooksFeature.selectByRoute);

  readonly loadPending$ = this.store.select(userBooksFeature.selectLoadPending);
  readonly loadError$ = this.store.select(userBooksFeature.selectLoadError);

  readonly createPending$ = this.store.select(userBooksFeature.selectCreatePending);
  readonly createError$ = this.store.select(userBooksFeature.selectCreateError);

  readonly deletePending$ = this.store.select(userBooksFeature.selectDeletePending);
  readonly deleteError$ = this.store.select(userBooksFeature.selectDeleteError);

  readonly editDraftPending$ = this.store.select(userBooksFeature.selectEditDraftPending);
  readonly editDraftError$ = this.store.select(userBooksFeature.selectEditDraftError);

  readonly publishPending$ = this.store.select(userBooksFeature.selectPublishPending);
  readonly publishError$ = this.store.select(userBooksFeature.selectPublishError);

  constructor(private readonly store: Store, private readonly actions: Actions) {}

  load(id: string): Observable<UserBookDTO> {
    this.store.dispatch(UserBooksActions.load({ id }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.loadSuccess, UserBooksActions.loadError),
      take(1),
      concatMap(action => {
        if (action.type === UserBooksActions.loadSuccess.type) {
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
    this.store.dispatch(UserBooksActions.loadAll());

    const result = this.actions.pipe(
      ofType(UserBooksActions.loadAllSuccess, UserBooksActions.loadAllError),
      take(1),
      concatMap(action => {
        if (action.type === UserBooksActions.loadAllSuccess.type) {
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
    this.store.dispatch(UserBooksActions.create({ volumeData }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.createSuccess, UserBooksActions.createError),
      take(1),
      concatMap(action => {
        if (action.type === UserBooksActions.createSuccess.type) {
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
    this.store.dispatch(UserBooksActions.delete({ id }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.deleteSuccess, UserBooksActions.deleteError),
      take(1),
      concatMap(action => {
        if (action.type === UserBooksActions.deleteSuccess.type) {
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
    this.store.dispatch(UserBooksActions.editDraft({ id, data }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.editDraftSuccess, UserBooksActions.editDraftError),
      take(1),
      concatMap(action => {
        if (action.type === UserBooksActions.editDraftSuccess.type) {
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
    this.store.dispatch(UserBooksActions.publish({ id }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.publishSuccess, UserBooksActions.publishError),
      take(1),
      concatMap(action => {
        if (action.type === UserBooksActions.publishSuccess.type) {
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
