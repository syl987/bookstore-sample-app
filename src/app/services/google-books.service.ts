import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { GoogleBooksActions } from '../store/google-books/google-books.actions';
import { googleBooksFeature } from '../store/google-books/google-books.reducer';

@Injectable({
  providedIn: 'root',
})
export class GoogleBooksService {
  readonly searchQuery$ = this.store.select(googleBooksFeature.selectSearchQuery);
  readonly searchList$ = this.store.select(googleBooksFeature.selectSearchList); // TODO rename as results?

  readonly searchResults$ = this.store.select(googleBooksFeature.selectSearchResults);
  readonly searchResultsTotal$ = this.store.select(googleBooksFeature.selectSearchResultsTotal);

  readonly searchPending$ = this.store.select(googleBooksFeature.selectSearchPending);
  readonly searchError$ = this.store.select(googleBooksFeature.selectSearchError);

  constructor(private readonly store: Store) {}

  searchVolumes(query: string): void {
    this.store.dispatch(GoogleBooksActions.search({ query }));
  }
}
