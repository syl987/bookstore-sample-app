import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { UserBookDTO } from 'src/app/models/book.models';
import { ResponseError } from 'src/app/models/error.models';

import * as UserBooksActions from './user-books.actions';

export const userBooksFeatureKey = 'user-books';

export interface State extends EntityState<UserBookDTO> {
  loading: boolean;
  creating: boolean;
  deleting: boolean;
  editingDraft: boolean;
  publishing: boolean;
  error?: ResponseError;
}

const adapter = createEntityAdapter<UserBookDTO>({
  selectId: entity => entity.id,
  sortComparer: (e1, e2) => e2.id.localeCompare(e1.id),
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  creating: false,
  deleting: false,
  editingDraft: false,
  publishing: false,
});

export const reducer = createReducer(
  initialState,
  on(UserBooksActions.loadUserBook, state => ({ ...state, loading: true, error: undefined })),
  on(UserBooksActions.loadUserBookSuccess, (state, { book }) => ({ ...adapter.upsertOne(book, state), loading: false, error: undefined })),
  on(UserBooksActions.loadUserBookError, (state, { error }) => ({ ...state, loading: false, error })),
  on(UserBooksActions.loadUserBooks, state => ({ ...state, loading: true, error: undefined })),
  on(UserBooksActions.loadUserBooksSuccess, (state, { books }) => ({ ...adapter.upsertMany(books, state), loading: false, error: undefined })),
  on(UserBooksActions.loadUserBooksError, (state, { error }) => ({ ...state, loading: false, error })),
  on(UserBooksActions.createUserBook, state => ({ ...state, creating: true, error: undefined })),
  on(UserBooksActions.createUserBookSuccess, (state, { book }) => ({ ...adapter.upsertOne(book, state), creating: false, error: undefined })),
  on(UserBooksActions.createUserBookError, (state, { error }) => ({ ...state, creating: false, error })),
  on(UserBooksActions.deleteUserBook, state => ({ ...state, deleting: true, error: undefined })),
  on(UserBooksActions.deleteUserBookSuccess, (state, { id }) => ({ ...adapter.removeOne(id, state), deleting: false, error: undefined })),
  on(UserBooksActions.deleteUserBookError, (state, { error }) => ({ ...state, deleting: false, error })),
  on(UserBooksActions.editUserBookDraft, state => ({ ...state, editingDraft: true, error: undefined })),
  on(UserBooksActions.editUserBookDraftSuccess, (state, { book }) => ({ ...adapter.upsertOne(book, state), editingDraft: false, error: undefined })),
  on(UserBooksActions.editUserBookDraftError, (state, { error }) => ({ ...state, editingDraft: false, error })),
  on(UserBooksActions.publishUserBook, state => ({ ...state, publishing: true, error: undefined })),
  on(UserBooksActions.publishUserBookSuccess, (state, { book }) => ({ ...adapter.upsertOne(book, state), publishing: false, error: undefined })),
  on(UserBooksActions.publishUserBookError, (state, { error }) => ({ ...state, publishing: false, error })),
);

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
