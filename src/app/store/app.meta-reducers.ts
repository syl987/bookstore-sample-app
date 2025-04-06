/* eslint-disable no-console */

import { MetaReducer } from '@ngrx/store';

import { AuthActions } from './auth/auth.actions';

const resetState: MetaReducer = reducer => (state, action) => {
  if (AuthActions.authResetState.type === action.type) {
    return reducer(undefined, action);
  }
  return reducer(state, action);
};

const consoleLog: MetaReducer = reducer => (state, action) => {
  const result = reducer(state, action);
  console.groupCollapsed(action.type);
  console.log('prev state', state);
  console.log('action', action);
  console.log('next state', result);
  console.groupEnd();
  return result;
};

export const metaReducers = [resetState, consoleLog];
