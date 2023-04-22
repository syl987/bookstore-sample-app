import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { UserBookDTO } from 'src/app/models/book.models';
import { OperationState } from 'src/app/models/store.models';

import * as UserBooksActions from './user-books.actions';

export const userBooksFeatureKey = 'user-books';

export interface State extends EntityState<UserBookDTO> {
  load: OperationState;
  create: OperationState;
  remove: OperationState;
  editDraft: OperationState;
  publish: OperationState;
}

const adapter = createEntityAdapter<UserBookDTO>({
  selectId: entity => entity.id,
  sortComparer: (e1, e2) => e2.id.localeCompare(e1.id),
});

export const initialState: State = adapter.getInitialState({
  load: { pending: false },
  create: { pending: false },
  remove: { pending: false },
  editDraft: { pending: false },
  publish: { pending: false },
});

export const reducer = createReducer(
  initialState,
  on(UserBooksActions.loadUserBook, state => ({
    ...state,
    load: { ...state.load, pending: true, error: undefined },
  })),
  on(UserBooksActions.loadUserBookSuccess, (state, { book }) => ({
    ...adapter.upsertOne(book, state),
    load: { ...state.load, pending: false, error: undefined },
  })),
  on(UserBooksActions.loadUserBookError, (state, { error }) => ({
    ...state,
    load: { ...state.load, pending: false, error },
  })),
  on(UserBooksActions.loadUserBooks, state => ({
    ...state,
    load: { ...state.load, pending: true, error: undefined },
  })),
  on(UserBooksActions.loadUserBooksSuccess, (state, { books }) => ({
    ...adapter.upsertMany(books, state),
    load: { ...state.load, pending: false, error: undefined },
  })),
  on(UserBooksActions.loadUserBooksError, (state, { error }) => ({
    ...state,
    load: { ...state.load, pending: false, error },
  })),
  on(UserBooksActions.createUserBook, state => ({
    ...state,
    create: { ...state.create, pending: true, error: undefined },
  })),
  on(UserBooksActions.createUserBookSuccess, (state, { book }) => ({
    ...adapter.upsertOne(book, state),
    create: { ...state.create, pending: false, error: undefined },
  })),
  on(UserBooksActions.createUserBookError, (state, { error }) => ({
    ...state,
    create: { ...state.create, pending: false, error },
  })),
  on(UserBooksActions.deleteUserBook, state => ({
    ...state,
    remove: { ...state.remove, pending: true, error: undefined },
  })),
  on(UserBooksActions.deleteUserBookSuccess, (state, { id }) => ({
    ...adapter.removeOne(id, state),
    remove: { ...state.remove, pending: false, error: undefined },
  })),
  on(UserBooksActions.deleteUserBookError, (state, { error }) => ({
    ...state,
    remove: { ...state.remove, pending: false, error },
  })),
  on(UserBooksActions.editUserBookDraft, state => ({
    ...state,
    editDraft: { ...state.editDraft, pending: true, error: undefined },
  })),
  on(UserBooksActions.editUserBookDraftSuccess, (state, { book }) => ({
    ...adapter.upsertOne(book, state),
    editDraft: { ...state.editDraft, pending: false, error: undefined },
  })),
  on(UserBooksActions.editUserBookDraftError, (state, { error }) => ({
    ...state,
    editDraft: { ...state.editDraft, pending: false, error },
  })),
  on(UserBooksActions.publishUserBook, state => ({
    ...state,
    publish: { ...state.publish, pending: true, error: undefined },
  })),
  on(UserBooksActions.publishUserBookSuccess, (state, { book }) => ({
    ...adapter.upsertOne(book, state),
    publish: { ...state.publish, pending: false, error: undefined },
  })),
  on(UserBooksActions.publishUserBookError, (state, { error }) => ({
    ...state,
    publish: { ...state.publish, pending: false, error },
  })),
);

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
