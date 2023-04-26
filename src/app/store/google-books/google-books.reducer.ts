import { routerNavigatedAction } from '@ngrx/router-store';
import { createReducer, on } from '@ngrx/store';
import { GoogleBooksListDTO } from 'src/app/models/google-books.models';
import { OperationState } from 'src/app/models/store.models';

import { GoogleBooksActions } from './google-books.actions';

export const googleBooksFeatureKey = 'google-books';

export interface State {
  search: OperationState<{ query?: string; list?: GoogleBooksListDTO }>;
}

export const initialState: State = {
  search: { pending: false },
};

export const reducer = createReducer(
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
