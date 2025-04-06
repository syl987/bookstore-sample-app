import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { GoogleBooksActions } from '../store/google-books/google-books.actions';
import { googleBooksFeature } from '../store/google-books/google-books.reducer';

@Injectable({
  providedIn: 'root',
})
export class GoogleBooksService {
  private readonly store = inject(Store);

  readonly searchQuery = this.store.selectSignal(googleBooksFeature.selectSearchQuery);
  readonly searchList = this.store.selectSignal(googleBooksFeature.selectSearchList);

  readonly searchResults = this.store.selectSignal(googleBooksFeature.selectSearchResults);
  readonly searchResultsTotal = this.store.selectSignal(googleBooksFeature.selectSearchResultsTotal);

  readonly searchPending = this.store.selectSignal(googleBooksFeature.selectSearchPending);
  readonly searchError = this.store.selectSignal(googleBooksFeature.selectSearchError);

  searchVolumes(query: string): void {
    this.store.dispatch(GoogleBooksActions.search({ query }));
  }
}
