import { createFeature, createReducer, on } from '@ngrx/store';

import { SearchActions } from './search.actions';

export const searchFeatureKey = 'search';

export interface State {
  query: string;
}

const initialState: State = {
  query: '',
};

export const reducer = createReducer(
  initialState,
  on(SearchActions.filter, (state, { query }) => ({
    ...state,
    query,
  })),
);

export const searchFeature = createFeature({
  name: searchFeatureKey,
  reducer,
});
