import { routerNavigatedAction } from '@ngrx/router-store';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { GoogleBooksListDTO } from 'src/app/models/google-books.models';
import { OperationState } from 'src/app/models/store.models';

import { GoogleBooksActions } from './google-books.actions';

const googleBooksFeatureKey = 'googleBooks';

interface State {
  search: OperationState<{
    query?: string;
    list?: GoogleBooksListDTO;
  }>;
}

const initialState: State = {
  search: { pending: false },
};

const reducer = createReducer(
  initialState,
  on(GoogleBooksActions.search, state => ({
    ...state,
    search: { ...state.search, pending: true, error: undefined },
  })),
  on(GoogleBooksActions.searchSuccess, (state, { query, list }) => ({
    ...state,
    search: { ...state.search, query, list, pending: false, error: undefined },
  })),
  on(GoogleBooksActions.searchError, (state, { error }) => ({
    ...state,
    search: { ...state.search, pending: false, error },
  })),
  on(routerNavigatedAction, _ => initialState), // reset for a new book
);

export const googleBooksFeature = createFeature({
  name: googleBooksFeatureKey,
  reducer,
  extraSelectors: ({ selectSearch }) => ({
    selectSearchResults: createSelector(selectSearch, ({ list }) => list?.items ?? []),
    selectSearchResultsTotal: createSelector(selectSearch, ({ list }) => list?.totalItems ?? 0),

    selectSearchQuery: createSelector(selectSearch, ({ query }) => query),
    selectSearchList: createSelector(selectSearch, ({ list }) => list),
    selectSearchPending: createSelector(selectSearch, ({ pending }) => pending),
    selectSearchError: createSelector(selectSearch, ({ error }) => error),
  }),
});
