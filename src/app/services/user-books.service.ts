import { Injectable, inject } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, Observable, of, shareReplay, take, takeWhile, throwError } from 'rxjs';

import { UserBookDTO, UserBookEditDraftDTO } from '../models/book.models';
import { FirebaseUploadDataWithProgress } from '../models/firebase.models';
import { GoogleBooksVolumeDTO } from '../models/google-books.models';
import { UserBooksActions } from '../store/user-books/user-books.actions';
import { userBooksFeature } from '../store/user-books/user-books.reducer';

interface IUserBooksService {
  /** Load a book with volume data. */
  load(id: string): Observable<UserBookDTO>;
  /** Load all books with volume data. */
  loadAll(): Observable<UserBookDTO[]>;
  /** Create a new volume from google books if missing and add a new book with initial data to it. */
  create(volumeData: GoogleBooksVolumeDTO): Observable<UserBookDTO>;
  /** Delete a book. Delete the volume if not related to any books. */
  delete(id: string, book: UserBookDTO): Observable<void>;
  /** Edit data of an unpublished book. */
  editDraft(id: string, book: UserBookDTO): Observable<UserBookDTO>;
  /** Upload an image of an unpublished book. Also emits on progress data. */
  uploadPhoto(bookId: string, data: Blob): Observable<FirebaseUploadDataWithProgress>;
  /** Remove all images of an unpublished book. */
  removeAllPhotos(bookId: string): Observable<void>;
  /** Publish a book. */
  publish(id: string, book: UserBookDTO): Observable<UserBookDTO>;
}

@Injectable({
  providedIn: 'root',
})
export class UserBooksService implements IUserBooksService {
  private readonly store = inject(Store);
  private readonly actions = inject(Actions);

  readonly entities = this.store.selectSignal(userBooksFeature.selectAll);
  readonly entitiesTotal = this.store.selectSignal(userBooksFeature.selectTotal);

  readonly entitiesDraft = this.store.selectSignal(userBooksFeature.selectAllDraft);
  readonly entitiesPublished = this.store.selectSignal(userBooksFeature.selectAllPublished);
  readonly entitiesSold = this.store.selectSignal(userBooksFeature.selectAllSold);
  readonly entitiesBought = this.store.selectSignal(userBooksFeature.selectAllBought);

  readonly entityByRoute = this.store.selectSignal(userBooksFeature.selectByRoute);

  readonly loadPending = this.store.selectSignal(userBooksFeature.selectLoadPending);
  readonly loadError = this.store.selectSignal(userBooksFeature.selectLoadError);

  readonly createPending = this.store.selectSignal(userBooksFeature.selectCreatePending);
  readonly createError = this.store.selectSignal(userBooksFeature.selectCreateError);

  readonly deletePending = this.store.selectSignal(userBooksFeature.selectDeletePending);
  readonly deleteError = this.store.selectSignal(userBooksFeature.selectDeleteError);

  readonly editDraftPending = this.store.selectSignal(userBooksFeature.selectEditDraftPending);
  readonly editDraftError = this.store.selectSignal(userBooksFeature.selectEditDraftError);

  readonly uploadPhotoPending = this.store.selectSignal(userBooksFeature.selectUploadPhotoPending);
  readonly uploadPhotoProgress = this.store.selectSignal(userBooksFeature.selectUploadPhotoProgress);
  readonly uploadPhotoError = this.store.selectSignal(userBooksFeature.selectUploadPhotoError);

  readonly removePhotoPending = this.store.selectSignal(userBooksFeature.selectRemovePhotoPending);
  readonly removePhotoError = this.store.selectSignal(userBooksFeature.selectRemovePhotoError);

  readonly publishPending = this.store.selectSignal(userBooksFeature.selectPublishPending);
  readonly publishError = this.store.selectSignal(userBooksFeature.selectPublishError);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  load(id: string): Observable<UserBookDTO> {
    this.store.dispatch(UserBooksActions.load({ id }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.loadSUCCESS, UserBooksActions.loadERROR),
      take(1),
      concatMap(action => {
        if (action.type === UserBooksActions.loadSUCCESS.type) {
          return of(action.book);
        }
        return throwError(() => action.error);
      }),
      shareReplay(1),
    );
    result.subscribe();
    return result;
  }

  loadAll(): Observable<UserBookDTO[]> {
    this.store.dispatch(UserBooksActions.loadAll());

    const result = this.actions.pipe(
      ofType(UserBooksActions.loadAllSUCCESS, UserBooksActions.loadAllERROR),
      take(1),
      concatMap(action => {
        if (action.type === UserBooksActions.loadAllSUCCESS.type) {
          return of(action.books);
        }
        return throwError(() => action.error);
      }),
      shareReplay(1),
    );
    result.subscribe();
    return result;
  }

  create(volumeData: GoogleBooksVolumeDTO): Observable<UserBookDTO> {
    this.store.dispatch(UserBooksActions.create({ volumeData }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.createSUCCESS, UserBooksActions.createERROR),
      take(1),
      concatMap(action => {
        if (action.type === UserBooksActions.createSUCCESS.type) {
          return of(action.book);
        }
        return throwError(() => action.error);
      }),
      shareReplay(1),
    );
    result.subscribe();
    return result;
  }

  delete(id: string): Observable<void> {
    this.store.dispatch(UserBooksActions.delete({ id }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.deleteSUCCESS, UserBooksActions.deleteERROR),
      take(1),
      concatMap(action => {
        if (action.type === UserBooksActions.deleteSUCCESS.type) {
          return of(undefined);
        }
        return throwError(() => action.error);
      }),
      shareReplay(1),
    );
    result.subscribe();
    return result;
  }

  editDraft(id: string, data: UserBookEditDraftDTO): Observable<UserBookDTO> {
    this.store.dispatch(UserBooksActions.editDraft({ id, data }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.editDraftSUCCESS, UserBooksActions.editDraftERROR),
      take(1),
      concatMap(action => {
        if (action.type === UserBooksActions.editDraftSUCCESS.type) {
          return of(action.book);
        }
        return throwError(() => action.error);
      }),
      shareReplay(1),
    );
    result.subscribe();
    return result;
  }

  uploadPhoto(bookId: string, data: Blob): Observable<FirebaseUploadDataWithProgress> {
    this.store.dispatch(UserBooksActions.uploadPhoto({ bookId, data }));

    let success = false;

    const result = this.actions.pipe(
      ofType(UserBooksActions.uploadPhotoPROGRESS, UserBooksActions.uploadPhotoSUCCESS, UserBooksActions.uploadPhotoERROR),
      // take 1 success action, pass all progress action until then
      takeWhile(action => {
        if (!success && action.type === UserBooksActions.uploadPhotoSUCCESS.type) {
          success = true;
          return true;
        }
        return !success;
      }),
      concatMap(action => {
        if (action.type === UserBooksActions.uploadPhotoPROGRESS.type) {
          return of(action.uploadData);
        }
        if (action.type === UserBooksActions.uploadPhotoSUCCESS.type) {
          return of(action.uploadData);
        }
        return throwError(() => action.error);
      }),
      shareReplay(1),
    );
    result.subscribe();
    return result;
  }

  removePhoto(bookId: string, photoId: string): Observable<void> {
    this.store.dispatch(UserBooksActions.removePhoto({ bookId, photoId }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.removePhotoSUCCESS, UserBooksActions.removePhotoERROR),
      take(1),
      concatMap(action => {
        if (action.type === UserBooksActions.removePhotoSUCCESS.type) {
          return of(undefined);
        }
        return throwError(() => action.error);
      }),
      shareReplay(1),
    );
    result.subscribe();
    return result;
  }

  removeAllPhotos(bookId: string): Observable<void> {
    this.store.dispatch(UserBooksActions.removeAllPhotos({ bookId }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.removeAllPhotosSUCCESS, UserBooksActions.removeAllPhotosERROR),
      take(1),
      concatMap(action => {
        if (action.type === UserBooksActions.removeAllPhotosSUCCESS.type) {
          return of(undefined);
        }
        return throwError(() => action.error);
      }),
      shareReplay(1),
    );
    result.subscribe();
    return result;
  }

  publish(id: string): Observable<UserBookDTO> {
    this.store.dispatch(UserBooksActions.publish({ id }));

    const result = this.actions.pipe(
      ofType(UserBooksActions.publishSUCCESS, UserBooksActions.publishERROR),
      take(1),
      concatMap(action => {
        if (action.type === UserBooksActions.publishSUCCESS.type) {
          return of(action.book);
        }
        return throwError(() => action.error);
      }),
      shareReplay(1),
    );
    result.subscribe();
    return result;
  }
}
