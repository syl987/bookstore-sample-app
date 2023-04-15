import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { UserBookDTO } from '../models/book.models';
import { GoogleBooksVolumeDTO } from '../models/google-books.models';
import * as UserBooksActions from '../store/user-books/user-books.actions';
import {
  selectUserBookByRoute,
  selectUserBooksAll,
  selectUserBooksCreatedId,
  selectUserBooksDraft,
  selectUserBooksError,
  selectUserBooksPending,
  selectUserBooksPublished,
  selectUserBooksSold,
  selectUserBooksTotal,
} from '../store/user-books/user-books.selectors';

interface IUserBooksService {
  /** Load a book with volume data. */
  load(id: string): void;
  /** Load all books with volume data. */
  loadAll(): void;
  /** Create a new volume from google books if missing and add a new book with initial data to it. */
  create(volumeData: GoogleBooksVolumeDTO): void;
  /** Edit data of an unpublished book. */
  editDraft(id: string, book: UserBookDTO): void;
  /** Delete a book. Delete the volume if not related to any books. */
  delete(id: string, book: UserBookDTO): void;
  /** Publish a book. */
  publish(id: string, book: UserBookDTO): void;
  /** Buy a book. */
  buy(id: string, book: UserBookDTO): void;
}

@Injectable({
  providedIn: 'root',
})
export class UserBooksService implements IUserBooksService {
  readonly userBooks$ = this.store.select(selectUserBooksAll);
  readonly userBooksTotal$ = this.store.select(selectUserBooksTotal);

  readonly userBooksDraft$ = this.store.select(selectUserBooksDraft);
  readonly userBooksPublished$ = this.store.select(selectUserBooksPublished);
  readonly userBooksSold$ = this.store.select(selectUserBooksSold);

  readonly userBookByRoute$ = this.store.select(selectUserBookByRoute);

  readonly createdId$ = this.store.select(selectUserBooksCreatedId);
  readonly pending$ = this.store.select(selectUserBooksPending);
  readonly error$ = this.store.select(selectUserBooksError);

  constructor(private readonly store: Store) {}

  load(id: string): void {
    this.store.dispatch(UserBooksActions.loadUserBook({ id }));
  }

  loadAll(): void {
    this.store.dispatch(UserBooksActions.loadUserBooks());
  }

  create(volumeData: GoogleBooksVolumeDTO): void {
    this.store.dispatch(UserBooksActions.createUserBook({ volumeData }));
  }

  editDraft(id: string, book: UserBookDTO): void {
    this.store.dispatch(UserBooksActions.editUserBookDraft({ id, book }));
  }

  publish(id: string): void {
    this.store.dispatch(UserBooksActions.publishUserBook({ id }));
  }

  delete(id: string): void {
    this.store.dispatch(UserBooksActions.deleteUserBook({ id }));
  }

  buy(id: string): void {
    throw new Error('Method not implemented.');
  }
}
