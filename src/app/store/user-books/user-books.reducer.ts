import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { BookStatus, UserBookDTO } from 'src/app/models/book.models';
import { OperationState } from 'src/app/models/store.models';

import { selectRouteParam } from '../router/router.selectors';
import { userBooksActions } from './user-books.actions';

export const userBooksFeatureKey = 'userBooks';

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

const initialState: State = adapter.getInitialState({
  load: { pending: false },
  create: { pending: false },
  remove: { pending: false },
  editDraft: { pending: false },
  publish: { pending: false },
});

export const reducer = createReducer(
  initialState,
  on(userBooksActions.load, state => ({
    ...state,
    load: { ...state.load, pending: true, error: undefined },
  })),
  on(userBooksActions.loadSuccess, (state, { book }) => ({
    ...adapter.upsertOne(book, state),
    load: { ...state.load, pending: false, error: undefined },
  })),
  on(userBooksActions.loadError, (state, { error }) => ({
    ...state,
    load: { ...state.load, pending: false, error },
  })),
  on(userBooksActions.loadAll, state => ({
    ...state,
    load: { ...state.load, pending: true, error: undefined },
  })),
  on(userBooksActions.loadAllSuccess, (state, { books }) => ({
    ...adapter.upsertMany(books, state),
    load: { ...state.load, pending: false, error: undefined },
  })),
  on(userBooksActions.loadAllError, (state, { error }) => ({
    ...state,
    load: { ...state.load, pending: false, error },
  })),
  on(userBooksActions.create, state => ({
    ...state,
    create: { ...state.create, pending: true, error: undefined },
  })),
  on(userBooksActions.createSuccess, (state, { book }) => ({
    ...adapter.upsertOne(book, state),
    create: { ...state.create, pending: false, error: undefined },
  })),
  on(userBooksActions.createError, (state, { error }) => ({
    ...state,
    create: { ...state.create, pending: false, error },
  })),
  on(userBooksActions.delete, state => ({
    ...state,
    remove: { ...state.remove, pending: true, error: undefined },
  })),
  on(userBooksActions.deleteSuccess, (state, { id }) => ({
    ...adapter.removeOne(id, state),
    remove: { ...state.remove, pending: false, error: undefined },
  })),
  on(userBooksActions.deleteError, (state, { error }) => ({
    ...state,
    remove: { ...state.remove, pending: false, error },
  })),
  on(userBooksActions.editDraft, state => ({
    ...state,
    editDraft: { ...state.editDraft, pending: true, error: undefined },
  })),
  on(userBooksActions.editDraftSuccess, (state, { book }) => ({
    ...adapter.upsertOne(book, state),
    editDraft: { ...state.editDraft, pending: false, error: undefined },
  })),
  on(userBooksActions.editDraftError, (state, { error }) => ({
    ...state,
    editDraft: { ...state.editDraft, pending: false, error },
  })),
  on(userBooksActions.publish, state => ({
    ...state,
    publish: { ...state.publish, pending: true, error: undefined },
  })),
  on(userBooksActions.publishSuccess, (state, { book }) => ({
    ...adapter.upsertOne(book, state),
    publish: { ...state.publish, pending: false, error: undefined },
  })),
  on(userBooksActions.publishError, (state, { error }) => ({
    ...state,
    publish: { ...state.publish, pending: false, error },
  })),
);

export const userBooksFeature = createFeature({
  name: userBooksFeatureKey,
  reducer,
  extraSelectors: ({ selectUserBooksState, selectEntities, selectLoad, selectCreate, selectRemove, selectEditDraft, selectPublish }) => ({
    selectAll: createSelector(selectUserBooksState, adapter.getSelectors().selectAll),
    selectTotal: createSelector(selectUserBooksState, adapter.getSelectors().selectTotal),

    selectAllDraft: createSelector(createSelector(selectUserBooksState, adapter.getSelectors().selectAll), books =>
      books.filter(b => b.status === BookStatus.DRAFT),
    ),
    selectAllPublished: createSelector(createSelector(selectUserBooksState, adapter.getSelectors().selectAll), books =>
      books.filter(b => b.status === BookStatus.PUBLISHED),
    ),
    selectAllSold: createSelector(createSelector(selectUserBooksState, adapter.getSelectors().selectAll), books =>
      books.filter(b => b.status === BookStatus.SOLD),
    ),

    selectByRoute: createSelector(selectEntities, selectRouteParam('bookId'), (entities, id) => (id ? entities[id] : undefined)),

    selectLoadPending: createSelector(selectLoad, ({ pending }) => pending),
    selectLoadError: createSelector(selectLoad, ({ error }) => error),

    selectCreatePending: createSelector(selectCreate, ({ pending }) => pending),
    selectCreateError: createSelector(selectCreate, ({ error }) => error),

    selectDeletePending: createSelector(selectRemove, ({ pending }) => pending),
    selectDeleteError: createSelector(selectRemove, ({ error }) => error),

    selectEditDraftPending: createSelector(selectEditDraft, ({ pending }) => pending),
    selectEditDraftError: createSelector(selectEditDraft, ({ error }) => error),

    selectPublishPending: createSelector(selectPublish, ({ pending }) => pending),
    selectPublishError: createSelector(selectPublish, ({ error }) => error),
  }),
});
