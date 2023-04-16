import { createAction, props } from '@ngrx/store';
import { UserBookDTO, UserBookEditDraftDTO } from 'src/app/models/book.models';
import { ResponseError } from 'src/app/models/error.models';
import { GoogleBooksVolumeDTO } from 'src/app/models/google-books.models';

export const loadUserBook = createAction('[UserBooks] load', props<{ cid: number; id: string }>());
export const loadUserBookSuccess = createAction('[UserBooks] load SUCCESS', props<{ cid: number; book: UserBookDTO }>());
export const loadUserBookError = createAction('[UserBooks] load ERROR', props<{ cid: number; error: ResponseError }>());

export const loadUserBooks = createAction('[UserBooks] load all', props<{ cid: number }>());
export const loadUserBooksSuccess = createAction('[UserBooks] load all SUCCESS', props<{ cid: number; books: UserBookDTO[] }>());
export const loadUserBooksError = createAction('[UserBooks] load all ERROR', props<{ cid: number; error: ResponseError }>());

export const createUserBook = createAction('[UserBooks] create', props<{ cid: number; volumeData: GoogleBooksVolumeDTO }>());
export const createUserBookSuccess = createAction('[UserBooks] create SUCCESS', props<{ cid: number; book: UserBookDTO }>());
export const createUserBookError = createAction('[UserBooks] create ERROR', props<{ cid: number; error: ResponseError }>());

export const deleteUserBook = createAction('[UserBooks] delete', props<{ cid: number; id: string }>());
export const deleteUserBookSuccess = createAction('[UserBooks] delete SUCCESS', props<{ cid: number; id: string }>());
export const deleteUserBookError = createAction('[UserBooks] delete ERROR', props<{ cid: number; error: ResponseError }>());

export const editUserBookDraft = createAction('[UserBooks] edit draft', props<{ cid: number; id: string; data: UserBookEditDraftDTO }>());
export const editUserBookDraftSuccess = createAction('[UserBooks] edit draft SUCCESS', props<{ cid: number; book: UserBookDTO }>());
export const editUserBookDraftError = createAction('[UserBooks] edit draft ERROR', props<{ cid: number; error: ResponseError }>());

export const publishUserBook = createAction('[UserBooks] publish', props<{ cid: number; id: string }>());
export const publishUserBookSuccess = createAction('[UserBooks] publish SUCCESS', props<{ cid: number; book: UserBookDTO }>());
export const publishUserBookError = createAction('[UserBooks] publish ERROR', props<{ cid: number; error: ResponseError }>());

// TODO buy actions
