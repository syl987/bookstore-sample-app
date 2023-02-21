import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromAuth from './auth.reducer';

const selectAuthState = createFeatureSelector<fromAuth.State>('auth');

export const selectAuthPending = createSelector(selectAuthState, ({ pending }) => pending);
