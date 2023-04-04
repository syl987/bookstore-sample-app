import { createReducer, on } from '@ngrx/store';

import * as AuthActions from './auth.actions';

export const authFeatureKey = 'auth';

export interface State {
  pending: boolean;
}

export const initialState: State = {
  pending: false,
};

export const reducer = createReducer(
  initialState,
  on(AuthActions.loginWithProvider, AuthActions.logout, state => ({
    ...state,
    pending: true,
  })),
  on(
    AuthActions.loginWithProviderSuccess,
    AuthActions.loginWithProviderError,
    AuthActions.logoutSuccess,
    AuthActions.logoutError,
    state => ({
      ...state,
      pending: false,
    })
  )
);
