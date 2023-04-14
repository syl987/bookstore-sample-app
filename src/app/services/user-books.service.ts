import { Injectable } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';
import { combineLatest, Observable, throwError } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';

import { getEntityById } from '../helpers/entity.helpers';
import { BookStatus, UserBookDTO } from '../models/book.models';
import { GoogleBooksVolumeDTO } from '../models/google-books.models';
import { selectRouterParams } from '../store/router/router.selectors';
import { AuthService } from './auth.service';

interface IUserBooksService {
  /** Stream of user books with volume data. */
  readonly userBooks$: Observable<UserBookDTO[]>;
  /** Stream of a user book with volume data by router book id. */
  readonly userBookByRoute$: Observable<UserBookDTO | undefined>;
  /** Load a book with volume data. */
  load(id: string): Observable<UserBookDTO>;
  /** Create a new volume from google books if missing and add a new book with initial data to it. */
  create(volumeData: GoogleBooksVolumeDTO): Observable<UserBookDTO>;
  /** Edit data of an unpublished book. */
  edit(id: string, data: unknown): Observable<UserBookDTO>;
  /** Delete a book. Delete the volume if not related to any books. */
  delete(id: string, volumeId: string): Observable<void>;
  /** Publish a book. */
  publish(id: string, volumeId: string): Observable<void>;
  /** Buy a book. */
  buy(id: string, volumeId: string): Observable<void>;
}

const selectKeyByRoute = createSelector(selectRouterParams, params => params?.volumeId);

@Injectable({
  providedIn: 'root',
})
export class UserBooksService implements IUserBooksService {
  readonly userBooks$: Observable<UserBookDTO[]> = this.userBooksCollection.entities$;

  readonly userBookByRoute$: Observable<UserBookDTO | undefined> = combineLatest([
    this.userBooksCollection.selectors$.entityMap$,
    this.store.select(selectKeyByRoute),
  ]).pipe(map(getEntityById));

  readonly pending$ = this.userBooksCollection.loading$;

  constructor(
    private readonly store: Store,
    private readonly authService: AuthService,
    private readonly userBooksCollection: UserBooksCollectionService,
    private readonly volumeCollection: VolumeCollectionService,
  ) {}

  load(id: string): Observable<UserBookDTO> {
    return this.userBooksCollection.getByKey(id);
  }

  create(volumeData: GoogleBooksVolumeDTO): Observable<UserBookDTO> {
    if (!this.authService.uid) {
      throw new Error('User not logged in.');
    }

    const uid = this.authService.uid;

    return this.volumeCollection.getByKey(volumeData.id).pipe(
      catchError(err => {
        if (err.message !== 'Firebase data not found.') {
          return throwError(() => err);
        }

        return this.volumeCollection.upsert({
          id: volumeData.id,
          volumeInfo: volumeData.volumeInfo,
          searchInfo: volumeData.searchInfo,
          publishedBooks: {},
        });
      }),
      concatMap(volume =>
        this.userBooksCollection.add({
          id: '[new]',
          status: BookStatus.DRAFT,
          uid,
          volume,
        }),
      ),
    );
  }

  edit(id: string, data: Pick<UserBookDTO, 'condition' | 'description' | 'imageUrl'>): Observable<UserBookDTO> {
    // TODO check status
    return this.userBooksCollection.update({ id, ...data });
  }

  delete(id: string, volumeId: string): Observable<void> {
    return this.userBooksCollection.getByKey(id).pipe(concatMap(({ status }) => {}));
  }

  publish(id: string, volumeId: string): Observable<void> {
    throw new Error('Method not implemented.');
  }

  buy(id: string, volumeId: string): Observable<void> {
    throw new Error('Method not implemented.');
  }
}
