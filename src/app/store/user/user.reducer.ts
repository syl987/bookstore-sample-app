import { createReducer, on } from '@ngrx/store';
import { Profile } from 'src/app/models/user.models';

import * as AuthActions from '../auth/auth.actions';
import * as UserActions from './user.actions';

export const userFeatureKey = 'user';

export interface State {
    profile?: Profile | null;
    loading: boolean;
    loaded: boolean;
}

export const initialState: State = {
    loading: false,
    loaded: false,
};

export const reducer = createReducer(
    initialState,
    on(
        AuthActions.authenticated,
        UserActions.updateUserProfile,
        UserActions.uploadUserPhoto,
        UserActions.deleteUserPhoto,
        (state): State => ({
            ...state,
            loading: true,
        }),
    ),
    on(
        UserActions.loadUserDataSuccess,
        UserActions.loadUserDataError,
        UserActions.updateUserProfileSuccess,
        UserActions.updateUserProfileError,
        UserActions.uploadUserPhotoSuccess,
        UserActions.uploadUserPhotoError,
        UserActions.deleteUserPhotoSuccess,
        UserActions.deleteUserPhotoError,
        (state): State => ({
            ...state,
            loading: false,
        }),
    ),
    on(
        UserActions.loadUserDataSuccess,
        UserActions.updateUserProfileSuccess,
        UserActions.uploadUserPhotoSuccess,
        UserActions.deleteUserPhotoSuccess,
        (state, { profile }): State => ({
            ...state,
            profile,
        }),
    ),
);
