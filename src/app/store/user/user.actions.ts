import { createAction, props } from '@ngrx/store';
import { ResponseError } from 'src/app/models/error.models';
import { Profile } from 'src/app/models/user.models';

export const loadUserDataSuccess = createAction('[User] load data SUCCESS', props<{ profile: Profile }>());
export const loadUserDataError = createAction('[User] load data ERROR', props<{ error: ResponseError }>());

export const updateUserProfile = createAction('[User] update profile', props<{ changes: Partial<Profile> }>());
export const updateUserProfileSuccess = createAction('[User] update profile SUCCESS', props<{ profile: Profile }>());
export const updateUserProfileError = createAction('[User] update profile ERROR', props<{ error: ResponseError }>());

export const uploadUserPhoto = createAction('[User] upload photo', props<{ blob: Blob; contentType?: string }>());
export const uploadUserPhotoSuccess = createAction('[User] upload photo SUCCESS', props<{ profile: Profile }>());
export const uploadUserPhotoError = createAction('[User] upload photo ERROR', props<{ error: ResponseError }>());

export const deleteUserPhoto = createAction('[User] delete photo');
export const deleteUserPhotoSuccess = createAction('[User] delete photo SUCCESS', props<{ profile: Profile }>());
export const deleteUserPhotoError = createAction('[User] delete photo ERROR', props<{ error: ResponseError }>());
