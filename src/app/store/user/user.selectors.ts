import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromUser from './user.reducer';

export const selectUserState = createFeatureSelector<fromUser.State>(fromUser.userFeatureKey);

export const selectUserProfile = createSelector(selectUserState, ({ profile }) => profile);
export const selectUserLoading = createSelector(selectUserState, ({ loading }) => loading);
export const selectUserLoaded = createSelector(selectUserState, ({ loaded }) => loaded);
