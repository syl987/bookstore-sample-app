import { createAction, props } from '@ngrx/store';
import { UserBookDTO, UserBooksDTO } from 'src/app/models/book.models';
import { ResponseError } from 'src/app/models/error.models';
import { GoogleBooksVolumeDTO } from 'src/app/models/google-books.models';

export const loadUserBook = createAction('[UserBooks] load', props<{ id: string }>());
export const loadUserBookSuccess = createAction('[UserBooks] load SUCCESS', props<{ book: UserBookDTO }>());
export const loadUserBookError = createAction('[UserBooks] load ERROR', props<{ error: ResponseError }>());

export const loadUserBooks = createAction('[UserBooks] load all');
export const loadUserBooksSuccess = createAction('[UserBooks] load all SUCCESS', props<{ books: UserBooksDTO }>());
export const loadUserBooksError = createAction('[UserBooks] load all ERROR', props<{ error: ResponseError }>());

export const createUserBook = createAction('[UserBooks] create', props<{ volumeData: GoogleBooksVolumeDTO }>());
export const createUserBookSuccess = createAction('[UserBooks] create SUCCESS', props<{ book: UserBookDTO }>());
export const createUserBookError = createAction('[UserBooks] create ERROR', props<{ error: ResponseError }>());

export const editUserBookDraft = createAction('[UserBooks] edit draft', props<{ id: string; book: UserBookDTO }>());
export const editUserBookDraftSuccess = createAction('[UserBooks] edit draft SUCCESS', props<{ book: UserBookDTO }>());
export const editUserBookDraftError = createAction('[UserBooks] edit draft ERROR', props<{ error: ResponseError }>());

export const publishUserBook = createAction('[UserBooks] publish', props<{ id: string; book: UserBookDTO }>());
export const publishUserBookSuccess = createAction('[UserBooks] publish SUCCESS', props<{ book: UserBookDTO }>());
export const publishUserBookError = createAction('[UserBooks] publish ERROR', props<{ error: ResponseError }>());

export const deleteUserBook = createAction('[UserBooks] delete', props<{ id: string; book: UserBookDTO }>());
export const deleteUserBookSuccess = createAction('[UserBooks] delete SUCCESS', props<{ id: string }>());
export const deleteUserBookError = createAction('[UserBooks] delete ERROR', props<{ error: ResponseError }>());
