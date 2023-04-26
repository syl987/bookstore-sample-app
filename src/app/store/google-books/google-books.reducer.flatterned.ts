import { routerNavigatedAction } from '@ngrx/router-store';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ResponseError } from 'src/app/models/error.models';
import { GoogleBooksListDTO } from 'src/app/models/google-books.models';

import { GoogleBooksActions } from './google-books.actions';

export const googleBooksFeatureKey = 'googleBooks';

export interface State {
  searchQuery: string;
  searchList: GoogleBooksListDTO;
  searchPending: boolean;
  searchError: ResponseError;
}

const initialState: State = {
  searchPending: false,
};

export const reducer = createReducer(
  initialState,
  on(GoogleBooksActions.search, state => ({
    ...state,
    searchPending: true,
    searchError: undefined,
  })),
  on(GoogleBooksActions.searchSuccess, (state, { query, list }) => ({
    ...state,
    searchQuery: query,
    searchList: list,
    searchPending: false,
    searchError: undefined,
  })),
  on(GoogleBooksActions.searchError, (state, { error }) => ({
    ...state,
    searchPending: false,
    searchError: error,
  })),
  on(routerNavigatedAction, _ => initialState), // reset for a new book
);

export const googleBooksFeature = createFeature({
  name: googleBooksFeatureKey,
  reducer,
  extraSelectors: ({ selectSearchQuery, selectSearchList, selectSearchPending, selectSearchError }) => ({
    selectSearchResults: createSelector(selectSearchList, ({ items }) => items),
    selectSearchTotal: createSelector(selectSearchList, ({ items }) => items.length),
  }),
});
