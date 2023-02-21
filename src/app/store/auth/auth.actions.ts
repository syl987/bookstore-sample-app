import { createAction, props } from '@ngrx/store';
import { ResponseError } from 'src/app/models/error.models';

import { AuthProviderId } from '../../models/auth.models';

export const loginWithProvider = createAction('[Auth] login with provider', props<{ providerId: AuthProviderId }>());
export const loginWithProviderSuccess = createAction('[Auth] login with provider SUCCESS');
export const loginWithProviderError = createAction('[Auth] login with provider ERROR', props<{ error: ResponseError }>());

export const authRefreshError = createAction('[Auth] refresh ERROR');
export const authResponseError = createAction('[Auth] response ERROR');
export const authTokenNotFound = createAction('[Auth] token not found');

export const logout = createAction('[Auth] logout');
export const logoutSuccess = createAction('[Auth] logout SUCCESS');
export const logoutError = createAction('[Auth] logout ERROR', props<{ error: ResponseError }>());

export const authenticated = createAction('[Auth] authenticated');
export const unauthenticated = createAction('[Auth] un-authenticated');
export const resetState = createAction('[Auth] reset state');
