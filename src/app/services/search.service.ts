import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { SearchActions } from '../store/search/search.actions';
import { searchFeature } from '../store/search/search.reducer';

interface ISearchService {
  /** Filter all loaded volumes with published books by title. */
  filter(query: string): void;
}

@Injectable({
  providedIn: 'root',
})
export class SearchService implements ISearchService {
  readonly filterQuery$ = this.store.select(searchFeature.selectQuery);

  constructor(private readonly store: Store) {}

  filter(query: string): void {
    this.store.dispatch(SearchActions.filter({ query }));
  }
}
