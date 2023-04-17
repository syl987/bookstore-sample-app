import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BookStatus } from 'src/app/models/book.models';

import { selectRouterParams } from '../router/router.selectors';
import * as fromUserBooks from './user-books.reducer';

const selectUserBooksState = createFeatureSelector<fromUserBooks.State>('user-books');

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

export const selectUserBooksLoading = createSelector(selectUserBooksState, ({ loading }) => loading);
export const selectUserBooksCreating = createSelector(selectUserBooksState, ({ creating }) => creating);
export const selectUserBooksDeleting = createSelector(selectUserBooksState, ({ deleting }) => deleting);
export const selectUserBooksEditingDraft = createSelector(selectUserBooksState, ({ editingDraft }) => editingDraft);
export const selectUserBooksPublishing = createSelector(selectUserBooksState, ({ publishing }) => publishing);
export const selectUserBooksError = createSelector(selectUserBooksState, ({ error }) => error);
