import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { GoogleBooksActions } from '../store/google-books/google-books.actions';
import * as VolumeSelectors from '../store/google-books/google-books.selectors';

@Injectable({
  providedIn: 'root',
})
export class GoogleBooksService {
  readonly searchQuery$ = this.store.select(VolumeSelectors.selectGoogleBooksSearchQuery);
  readonly searchVolumes$ = this.store.select(VolumeSelectors.selectGoogleBooksSearchVolumes);

  readonly searchPending$ = this.store.select(VolumeSelectors.selectGoogleBooksSearchPending);
  readonly searchError$ = this.store.select(VolumeSelectors.selectGoogleBooksSearchError);

  constructor(private readonly store: Store) {}

  searchVolumes(query: string): void {
    this.store.dispatch(GoogleBooksActions.search({ query }));
  }
}
