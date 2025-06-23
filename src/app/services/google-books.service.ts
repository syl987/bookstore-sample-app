import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, Observable, of, shareReplay, take, throwError } from 'rxjs';

import { GoogleBooksListDTO } from '../models/google-books.models';
import { GoogleBooksActions } from '../store/google-books/google-books.actions';
import { googleBooksFeature } from '../store/google-books/google-books.reducer';

@Injectable({
  providedIn: 'root',
})
export class GoogleBooksService {
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly store = inject(Store);
  protected readonly actions = inject(Actions);

  readonly searchQuery = this.store.selectSignal(googleBooksFeature.selectSearchQuery);
  readonly searchList = this.store.selectSignal(googleBooksFeature.selectSearchList);

  readonly searchResults = this.store.selectSignal(googleBooksFeature.selectSearchResults);
  readonly searchResultsTotal = this.store.selectSignal(googleBooksFeature.selectSearchResultsTotal);

  readonly searchPending = this.store.selectSignal(googleBooksFeature.selectSearchPending);
  readonly searchError = this.store.selectSignal(googleBooksFeature.selectSearchError);

  searchVolumes(query: string): Observable<GoogleBooksListDTO> {
    this.store.dispatch(GoogleBooksActions.search({ query }));

    const result = this.actions.pipe(
      ofType(GoogleBooksActions.searchSUCCESS, GoogleBooksActions.searchERROR),
      take(1),
      concatMap(action => {
        if (action.type === GoogleBooksActions.searchSUCCESS.type) {
          return of(action.list);
        }
        return throwError(() => action.error.err);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    result.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    return result;
  }
}
