import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromGoogleBooks from './google-books.reducer';

const selectGoogleBooksState = createFeatureSelector<fromGoogleBooks.State>('google-books');

export const selectGoogleBooksSearch = createSelector(selectGoogleBooksState, state => state.search);
export const selectGoogleBooksSearchList = createSelector(selectGoogleBooksSearch, ({ list }) => list);
export const selectGoogleBooksSearchVolumes = createSelector(selectGoogleBooksSearchList, list => list?.items ?? []);
export const selectGoogleBooksSearchPending = createSelector(selectGoogleBooksSearch, ({ pending }) => pending);
export const selectGoogleBooksSearchError = createSelector(selectGoogleBooksSearch, ({ error }) => error);
