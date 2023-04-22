import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as VolumeActions from '../store/google-books/google-books.actions';
import {
  selectGoogleBooksSearchError,
  selectGoogleBooksSearchPending,
  selectGoogleBooksSearchQuery,
  selectGoogleBooksSearchVolumes,
} from '../store/google-books/google-books.selectors';

@Injectable({
  providedIn: 'root',
})
export class GoogleBooksService {
  readonly searchQuery$ = this.store.select(selectGoogleBooksSearchQuery);
  readonly searchVolumes$ = this.store.select(selectGoogleBooksSearchVolumes);
  readonly searchPending$ = this.store.select(selectGoogleBooksSearchPending);
  readonly searchError$ = this.store.select(selectGoogleBooksSearchError);

  constructor(private readonly store: Store) {}

  searchVolumes(query: string): void {
    this.store.dispatch(VolumeActions.searchGoogleBooks({ query }));
  }
}
