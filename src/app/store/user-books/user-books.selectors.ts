import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BookStatus } from 'src/app/models/book.models';

import { selectRouterParams } from '../router/router.selectors';
import * as fromUserBooks from './user-books.reducer';

const selectUserBooksState = createFeatureSelector<fromUserBooks.State>(fromUserBooks.userBooksFeatureKey);

export const selectUserBooksAll = createSelector(selectUserBooksState, fromUserBooks.selectAll);
export const selectUserBooksEntities = createSelector(selectUserBooksState, fromUserBooks.selectEntities);
export const selectUserBooksIds = createSelector(selectUserBooksState, fromUserBooks.selectIds);
export const selectUserBooksTotal = createSelector(selectUserBooksState, fromUserBooks.selectTotal);

export const selectUserBooksDraft = createSelector(selectUserBooksAll, books => books.filter(b => b.status === BookStatus.DRAFT));
export const selectUserBooksPublished = createSelector(selectUserBooksAll, books => books.filter(b => b.status === BookStatus.PUBLISHED));
export const selectUserBooksSold = createSelector(selectUserBooksAll, books => books.filter(b => b.status === BookStatus.SOLD));

export const selectUserBookByRoute = createSelector(selectUserBooksEntities, selectRouterParams, (entities, params) =>
  params?.bookId ? entities[params.bookId] : undefined,
);

export const selectUserBooksLoadPending = createSelector(selectUserBooksState, ({ load }) => load.pending);
export const selectUserBooksLoadError = createSelector(selectUserBooksState, ({ load }) => load.error);

export const selectUserBooksCreatePending = createSelector(selectUserBooksState, ({ create }) => create.pending);
export const selectUserBooksCreateError = createSelector(selectUserBooksState, ({ create }) => create.error);

export const selectUserBooksDeletePending = createSelector(selectUserBooksState, ({ remove }) => remove.pending);
export const selectUserBooksDeleteError = createSelector(selectUserBooksState, ({ remove }) => remove.error);

export const selectUserBooksEditDraftPending = createSelector(selectUserBooksState, ({ editDraft }) => editDraft.pending);
export const selectUserBooksEditDraftError = createSelector(selectUserBooksState, ({ editDraft }) => editDraft.error);

export const selectUserBooksPublishPending = createSelector(selectUserBooksState, ({ publish }) => publish.pending);
export const selectUserBooksPublishError = createSelector(selectUserBooksState, ({ publish }) => publish.error);
