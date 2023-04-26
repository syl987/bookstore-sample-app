import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromGoogleBooks from './google-books.reducer';

const selectGoogleBooksState = createFeatureSelector<fromGoogleBooks.State>(fromGoogleBooks.googleBooksFeatureKey);

const selectGoogleBooksSearch = createSelector(selectGoogleBooksState, state => state.search);
export const selectGoogleBooksSearchQuery = createSelector(selectGoogleBooksSearch, ({ query }) => query);
export const selectGoogleBooksSearchVolumes = createSelector(selectGoogleBooksSearch, ({ list }) => list?.items ?? []);
export const selectGoogleBooksSearchPending = createSelector(selectGoogleBooksSearch, ({ pending }) => pending);
export const selectGoogleBooksSearchError = createSelector(selectGoogleBooksSearch, ({ error }) => error);
