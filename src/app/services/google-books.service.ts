import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { googleBooksActions } from '../store/google-books/google-books.actions';
import * as GoogleBooksSelectors from '../store/google-books/google-books.selectors';

@Injectable({
  providedIn: 'root',
})
export class GoogleBooksService {
  readonly searchQuery$ = this.store.select(GoogleBooksSelectors.selectGoogleBooksSearchQuery);
  readonly searchVolumes$ = this.store.select(GoogleBooksSelectors.selectGoogleBooksSearchVolumes);

  readonly searchPending$ = this.store.select(GoogleBooksSelectors.selectGoogleBooksSearchPending);
  readonly searchError$ = this.store.select(GoogleBooksSelectors.selectGoogleBooksSearchError);

  constructor(private readonly store: Store) {}

  searchVolumes(query: string): void {
    this.store.dispatch(googleBooksActions.search({ query }));
  }
}
