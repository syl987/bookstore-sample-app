import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, shareReplay, take } from 'rxjs/operators';

import { UserBookDTO, UserBookEditDraftDTO } from '../models/book.models';
import { GoogleBooksVolumeDTO } from '../models/google-books.models';
import { userBooksActions } from '../store/user-books/user-books.actions';
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
  readonly entities$ = this.store.select(userBooksFeature.selectAll);
  readonly entitiesTotal$ = this.store.select(userBooksFeature.selectTotal);

  readonly entitiesDraft$ = this.store.select(userBooksFeature.selectAllDraft);
  readonly entitiesPublished$ = this.store.select(userBooksFeature.selectAllPublished);
  readonly entitiesSold$ = this.store.select(userBooksFeature.selectAllSold);

  readonly entityByRoute$ = this.store.select(userBooksFeature.selectByRoute);

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
