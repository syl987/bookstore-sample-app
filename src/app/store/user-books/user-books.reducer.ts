import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { UserBookDTO } from 'src/app/models/book.models';
import { ResponseError } from 'src/app/models/error.models';

import * as UserBooksActions from './user-books.actions';

export const userBooksFeatureKey = 'user-books';

export interface State extends EntityState<UserBookDTO> {
  createdId?: string;
  pending: boolean;
  error?: ResponseError;
}

const adapter = createEntityAdapter<UserBookDTO>({
  selectId: entity => entity.id,
  sortComparer: (entity1, entity2) => entity2.id.localeCompare(entity1.id),
});

export const initialState: State = adapter.getInitialState({
  pending: false,
});

export const reducer = createReducer(
  initialState,
  on(
    UserBooksActions.loadUserBook,
    UserBooksActions.loadUserBooks,
    UserBooksActions.createUserBook,
    UserBooksActions.editUserBookDraft,
    UserBooksActions.publishUserBook,
    UserBooksActions.deleteUserBook,
    state => ({ ...state, pending: true, error: undefined }),
  ),
  on(
    UserBooksActions.loadUserBookSuccess,
    UserBooksActions.loadUserBooksSuccess,
    UserBooksActions.createUserBookSuccess,
    UserBooksActions.editUserBookDraftSuccess,
    UserBooksActions.publishUserBookSuccess,
    UserBooksActions.deleteUserBookSuccess,
    state => ({ ...state, pending: false, error: undefined }),
  ),
  on(
    UserBooksActions.loadUserBookError,
    UserBooksActions.loadUserBooksError,
    UserBooksActions.createUserBookError,
    UserBooksActions.editUserBookDraftError,
    UserBooksActions.publishUserBookError,
    UserBooksActions.deleteUserBookError,
    (state, { error }) => ({ ...state, pending: false, error }),
  ),
  on(UserBooksActions.loadUserBookSuccess, (state, { book }) => adapter.upsertOne(book, state)),
  on(UserBooksActions.loadUserBooksSuccess, (state, { books }) => adapter.upsertMany(Object.values(books), state)),
  on(UserBooksActions.createUserBookSuccess, (state, { book }) => adapter.upsertOne(book, { ...state, createdId: book.id })),
  on(UserBooksActions.editUserBookDraftSuccess, (state, { book }) => adapter.upsertOne(book, state)),
  on(UserBooksActions.publishUserBookSuccess, (state, { book }) => adapter.upsertOne(book, state)),
  on(UserBooksActions.deleteUserBookSuccess, (state, { id }) => adapter.removeOne(id, state)),
);

/* export const reducer = createReducer(
  initialState,
  on(UserBooksActions.loadUserBook, state => ({
    ...state,
    pending: true,
    error: undefined,
  })),
  on(UserBooksActions.loadUserBookSuccess, (state, { book }) =>
    adapter.upsertOne(book, {
      ...state,
      pending: false,
      error: undefined,
    }),
  ),
  on(UserBooksActions.loadUserBookError, (state, { error }) => ({
    ...state,
    pending: false,
    error,
  })),
  on(UserBooksActions.loadUserBooks, state => ({
    ...state,
    pending: true,
    error: undefined,
  })),
  on(UserBooksActions.loadUserBooksSuccess, (state, { books }) =>
    adapter.upsertMany(Object.values(books), {
      ...state,
      pending: false,
      error: undefined,
    }),
  ),
  on(UserBooksActions.loadUserBooksError, (state, { error }) => ({
    ...state,
    pending: false,
    error,
  })),
  on(UserBooksActions.editUserBookDraft, state => ({
    ...state,
    pending: true,
    error: undefined,
  })),
  on(UserBooksActions.editUserBookDraftSuccess, (state, { book }) =>
    adapter.upsertOne(book, {
      ...state,
      pending: false,
      error: undefined,
    }),
  ),
  on(UserBooksActions.editUserBookDraftError, (state, { error }) => ({
    ...state,
    pending: false,
    error,
  })),
  on(UserBooksActions.publishUserBook, state => ({
    ...state,
    pending: true,
    error: undefined,
  })),
  on(UserBooksActions.publishUserBookSuccess, (state, { book }) =>
    adapter.upsertOne(book, {
      ...state,
      pending: false,
      error: undefined,
    }),
  ),
  on(UserBooksActions.publishUserBookError, (state, { error }) => ({
    ...state,
    pending: false,
    error,
  })),
  on(UserBooksActions.deleteUserBook, state => ({
    ...state,
    pending: true,
    error: undefined,
  })),
  on(UserBooksActions.deleteUserBookSuccess, (state, { id }) =>
    adapter.removeOne(id, {
      ...state,
      pending: false,
      error: undefined,
    }),
  ),
  on(UserBooksActions.deleteUserBookError, (state, { error }) => ({
    ...state,
    pending: false,
    error,
  })),
); */

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
