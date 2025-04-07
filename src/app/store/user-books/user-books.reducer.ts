import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { BookStatus, UserBookDTO } from 'src/app/models/book.models';
import { OperationState, OperationStateWithProgress } from 'src/app/models/store.models';

import { UserBooksActions } from './user-books.actions';
import { VolumeActions } from '../volume/volume.actions';
import { getRouterSelectors } from '@ngrx/router-store';

export const userBooksFeatureKey = 'userBooks';

export interface State extends EntityState<UserBookDTO> {
  load: OperationState;
  create: OperationState;
  remove: OperationState;
  editDraft: OperationState;
  uploadPhoto: OperationStateWithProgress;
  removePhoto: OperationState;
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
  uploadPhoto: { pending: false },
  removePhoto: { pending: false },
  publish: { pending: false },
});

export const reducer = createReducer(
  initialState,
  on(UserBooksActions.load, UserBooksActions.loadAll, state => ({
    ...state,
    load: { ...state.load, pending: true, error: undefined },
  })),
  on(UserBooksActions.loadSUCCESS, (state, { book }) => ({
    ...adapter.upsertOne(book, state),
    load: { ...state.load, pending: false, error: undefined },
  })),
  on(UserBooksActions.loadAllSUCCESS, (state, { books }) => ({
    ...adapter.upsertMany(books, state),
    load: { ...state.load, pending: false, error: undefined },
  })),
  on(UserBooksActions.loadERROR, UserBooksActions.loadAllERROR, (state, { error }) => ({
    ...state,
    load: { ...state.load, pending: false, error },
  })),
  on(UserBooksActions.create, state => ({
    ...state,
    create: { ...state.create, pending: true, error: undefined },
  })),
  on(UserBooksActions.createSUCCESS, (state, { book }) => ({
    ...adapter.upsertOne(book, state),
    create: { ...state.create, pending: false, error: undefined },
  })),
  on(UserBooksActions.createERROR, (state, { error }) => ({
    ...state,
    create: { ...state.create, pending: false, error },
  })),
  on(UserBooksActions.delete, state => ({
    ...state,
    remove: { ...state.remove, pending: true, error: undefined },
  })),
  on(UserBooksActions.deleteSUCCESS, (state, { id }) => ({
    ...adapter.removeOne(id, state),
    remove: { ...state.remove, pending: false, error: undefined },
  })),
  on(UserBooksActions.deleteERROR, (state, { error }) => ({
    ...state,
    remove: { ...state.remove, pending: false, error },
  })),
  on(UserBooksActions.editDraft, state => ({
    ...state,
    editDraft: { ...state.editDraft, pending: true, error: undefined },
  })),
  on(UserBooksActions.editDraftSUCCESS, (state, { book }) => ({
    ...adapter.upsertOne(book, state),
    editDraft: { ...state.editDraft, pending: false, error: undefined },
  })),
  on(UserBooksActions.editDraftERROR, (state, { error }) => ({
    ...state,
    editDraft: { ...state.editDraft, pending: false, error },
  })),
  on(UserBooksActions.uploadPhoto, state => ({
    ...state,
    uploadPhoto: { ...state.uploadPhoto, pending: true, progress: 0, error: undefined },
  })),
  on(UserBooksActions.uploadPhotoPROGRESS, (state, { uploadData }) => ({
    ...state,
    uploadPhoto: { ...state.uploadPhoto, pending: true, progress: uploadData.snapshot.bytesTransferred / uploadData.snapshot.totalBytes, error: undefined },
  })),
  on(UserBooksActions.uploadPhotoSUCCESS, state => ({
    ...state,
    uploadPhoto: { ...state.uploadPhoto, pending: false, progress: undefined, error: undefined },
  })),
  on(UserBooksActions.uploadPhotoERROR, (state, { error }) => ({
    ...state,
    uploadPhoto: { ...state.uploadPhoto, pending: false, progress: undefined, error },
  })),
  on(UserBooksActions.removePhoto, UserBooksActions.removeAllPhotos, state => ({
    ...state,
    removePhoto: { ...state.removePhoto, pending: true, error: undefined },
  })),
  on(UserBooksActions.removePhotoSUCCESS, UserBooksActions.removeAllPhotosSUCCESS, state => ({
    ...state,
    removePhoto: { ...state.removePhoto, pending: false, error: undefined },
  })),
  on(UserBooksActions.removePhotoERROR, UserBooksActions.removeAllPhotosERROR, (state, { error }) => ({
    ...state,
    removePhoto: { ...state.removePhoto, pending: false, error },
  })),
  on(UserBooksActions.publish, state => ({
    ...state,
    publish: { ...state.publish, pending: true, error: undefined },
  })),
  on(UserBooksActions.publishSUCCESS, (state, { book }) => ({
    ...adapter.upsertOne(book, state),
    publish: { ...state.publish, pending: false, error: undefined },
  })),
  on(UserBooksActions.publishERROR, (state, { error }) => ({
    ...state,
    publish: { ...state.publish, pending: false, error },
  })),
  on(VolumeActions.buyOfferSUCCESS, (state, { book }) => ({
    ...adapter.upsertOne(book, state),
  })),
);

export const userBooksFeature = createFeature({
  name: userBooksFeatureKey,
  reducer,
  extraSelectors: ({ selectUserBooksState, selectEntities, selectLoad, selectCreate, selectRemove, selectEditDraft, selectUploadPhoto, selectRemovePhoto, selectPublish }) => ({
    selectAll: createSelector(selectUserBooksState, adapter.getSelectors().selectAll),
    selectTotal: createSelector(selectUserBooksState, adapter.getSelectors().selectTotal),

    selectAllDraft: createSelector(createSelector(selectUserBooksState, adapter.getSelectors().selectAll), books => books.filter(b => b.status === BookStatus.DRAFT)),
    selectAllPublished: createSelector(createSelector(selectUserBooksState, adapter.getSelectors().selectAll), books => books.filter(b => b.status === BookStatus.PUBLISHED)),
    selectAllSold: createSelector(createSelector(selectUserBooksState, adapter.getSelectors().selectAll), books => books.filter(b => b.status === BookStatus.SOLD && !b.buyerUid)),
    selectAllBought: createSelector(createSelector(selectUserBooksState, adapter.getSelectors().selectAll), books => books.filter(b => b.status === BookStatus.SOLD && b.buyerUid)),

    selectByRoute: createSelector(selectEntities, getRouterSelectors().selectRouteParam('bookId'), (entities, id) => (id ? entities[id] : undefined)),

    selectLoadPending: createSelector(selectLoad, ({ pending }) => pending),
    selectLoadError: createSelector(selectLoad, ({ error }) => error),

    selectCreatePending: createSelector(selectCreate, ({ pending }) => pending),
    selectCreateError: createSelector(selectCreate, ({ error }) => error),

    selectDeletePending: createSelector(selectRemove, ({ pending }) => pending),
    selectDeleteError: createSelector(selectRemove, ({ error }) => error),

    selectEditDraftPending: createSelector(selectEditDraft, ({ pending }) => pending),
    selectEditDraftError: createSelector(selectEditDraft, ({ error }) => error),

    selectUploadPhotoPending: createSelector(selectUploadPhoto, ({ pending }) => pending),
    selectUploadPhotoProgress: createSelector(selectUploadPhoto, ({ progress }) => progress),
    selectUploadPhotoError: createSelector(selectUploadPhoto, ({ error }) => error),

    selectRemovePhotoPending: createSelector(selectRemovePhoto, ({ pending }) => pending),
    selectRemovePhotoError: createSelector(selectRemovePhoto, ({ error }) => error),

    selectPublishPending: createSelector(selectPublish, ({ pending }) => pending),
    selectPublishError: createSelector(selectPublish, ({ error }) => error),
  }),
});
