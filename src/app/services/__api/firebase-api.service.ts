import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Database, get, push, ref, remove, set, update } from '@angular/fire/database';
import { concatMap, forkJoin, from, map, Observable, of, throwError } from 'rxjs';
import { getObjectValues } from 'src/app/functions/object.functions';
import { getPublishUserBookValidationErrors } from 'src/app/helpers/book.helpers';
import { BookDTO, BookStatus, UserBookCreateDTO, UserBookDTO } from 'src/app/models/book.models';
import { FirebaseUploadDataWithProgress } from 'src/app/models/firebase.models';
import { ImageDTO } from 'src/app/models/image.models';
import { ErrorLog } from 'src/app/models/logger.models';
import { VolumeDTO } from 'src/app/models/volume.models';

import { FirebaseFileService } from './firebase-file.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseApiService {
  constructor(
    private readonly database: Database,
    private readonly fileService: FirebaseFileService,
  ) {}

  getUserBook(uid: string, id: string): Observable<UserBookDTO> {
    const result = get(ref(this.database, `userBooks/${uid}/${id}`)).then(snap => snap.val());

    return from(result).pipe(concatMap(entity => (entity ? of(entity) : throwError(() => new FirebaseError('custom:no_data', 'No data available.')))));
  }

  getUserBooks(uid: string): Observable<UserBookDTO[]> {
    const result = get(ref(this.database, `userBooks/${uid}`)).then(snap => snap.val());

    return from(result).pipe(map(getObjectValues));
  }

  createUserBook(uid: string, volume: VolumeDTO): Observable<UserBookDTO> {
    const book: UserBookCreateDTO = { uid, status: BookStatus.DRAFT, volume };

    const key = push(ref(this.database)).then(snap => snap.key!);

    const result = key.then(id => set(ref(this.database, `userBooks/${uid}/${id}`), { ...book, id }).then(_ => id));

    return from(result).pipe(concatMap(id => this.getUserBook(uid, id)));
  }

  editUserBookDraft(uid: string, id: string, data: Pick<UserBookDTO, 'description' | 'condition' | 'price'>): Observable<UserBookDTO> {
    return this.getUserBook(uid, id).pipe(
      concatMap(book => {
        if (book.status !== BookStatus.DRAFT) {
          throw new FirebaseError('custom:invalid_status', 'Invalid status.');
        }
        const changes: { [path: string]: any } = {
          [`userBooks/${uid}/${id}/description`]: data.description,
          [`userBooks/${uid}/${id}/condition`]: data.condition,
          [`userBooks/${uid}/${id}/price`]: data.price,
        };
        const result = update(ref(this.database), changes);

        return from(result).pipe(concatMap(_ => this.getUserBook(uid, id)));
      }),
    );
  }

  uploadUserBookPhoto(uid: string, bookId: string, data: Blob): Observable<FirebaseUploadDataWithProgress> {
    return this.getUserBook(uid, bookId).pipe(
      concatMap(book => {
        if (book.status !== BookStatus.DRAFT) {
          throw new FirebaseError('custom:invalid_status', 'Invalid status.');
        }

        const key: string = push(ref(this.database)).key!;

        return this.fileService.uploadFileWithProgress(`userBooks/${uid}/${bookId}/photos/${key}`, data).pipe(
          concatMap(res => {
            if (res.complete) {
              const photo: ImageDTO = {
                id: key,
                src: res.downloadUrl!,
              };
              const changes: { [path: string]: any } = {
                [`userBooks/${uid}/${bookId}/photos/${key}`]: photo,
              };
              const result = update(ref(this.database), changes);

              return from(result).pipe(map(_ => res));
            }
            return of(res);
          }),
        );
      }),
    );
  }

  removeUserBookPhotos(uid: string, bookId: string): Observable<void> {
    return this.getUserBook(uid, bookId).pipe(
      concatMap(book => {
        if (book.status !== BookStatus.DRAFT) {
          throw new FirebaseError('custom:invalid_status', 'Invalid status.');
        }
        return this.fileService.deleteFiles(`userBooks/${uid}/${bookId}/photos`).pipe(
          concatMap(_ => {
            const changes: { [path: string]: any } = {
              [`userBooks/${uid}/${bookId}/photos`]: null,
            };
            const result = update(ref(this.database), changes);

            return from(result);
          }),
        );
      }),
    );
  }

  removeUserBookPhoto(uid: string, bookId: string, photoId: string): Observable<void> {
    return this.getUserBook(uid, bookId).pipe(
      concatMap(book => {
        if (book.status !== BookStatus.DRAFT) {
          throw new FirebaseError('custom:invalid_status', 'Invalid status.');
        }
        return this.fileService.deleteFile(`userBooks/${uid}/${bookId}/photos/${photoId}`).pipe(
          concatMap(_ => {
            const result = remove(ref(this.database, `userBooks/${uid}/${bookId}/photos/${bookId}`));

            return from(result);
          }),
        );
      }),
    );
  }

  publishUserBook(uid: string, id: string): Observable<UserBookDTO> {
    return this.getUserBook(uid, id).pipe(
      concatMap(book => {
        if (book.status !== BookStatus.DRAFT) {
          throw new FirebaseError('custom:invalid_status', 'Invalid status.');
        }
        const errors = getPublishUserBookValidationErrors(book);

        if (Object.keys(errors).length) {
          throw new FirebaseError('custom:publish_user_book_error', 'Invalid data.', errors);
        }
        const publishedBook: BookDTO = {
          ...book,
          status: BookStatus.PUBLISHED,
        };
        const changes: { [path: string]: any } = {
          [`userBooks/${uid}/${id}/status`]: BookStatus.PUBLISHED,
          [`volumes/${book.volume.id}/id`]: book.volume.id,
          [`volumes/${book.volume.id}/volumeInfo`]: book.volume.volumeInfo,
          [`volumes/${book.volume.id}/publishedBooks/${id}`]: publishedBook,
        };
        if (book.volume.searchInfo) {
          changes[`volumes/${book.volume.id}/searchInfo`] = book.volume.searchInfo;
        }
        const result = update(ref(this.database), changes);

        return from(result).pipe(concatMap(_ => this.getUserBook(uid, id)));
      }),
    );
  }

  deleteUserBook(uid: string, id: string): Observable<void> {
    return this.getUserBook(uid, id).pipe(
      concatMap(book => {
        if (book.status !== BookStatus.DRAFT) {
          throw new FirebaseError('custom:invalid_status', 'Invalid status.');
        }
        const result = remove(ref(this.database, `userBooks/${uid}/${id}`));

        return from(result);
      }),
      concatMap(_ => this.fileService.deleteFiles(`userBooks/${uid}/${id}/photos`)),
    );
  }

  getVolume(id: string): Observable<VolumeDTO> {
    const result = get(ref(this.database, `volumes/${id}`)).then(snap => snap.val());

    return from(result).pipe(concatMap(entity => (entity ? of(entity) : throwError(() => new FirebaseError('custom:no_data', 'No data available.')))));
  }

  getVolumes(): Observable<VolumeDTO[]> {
    const result = get(ref(this.database, `volumes`)).then(snap => snap.val());

    return from(result).pipe(map(getObjectValues));
  }

  /**
   * Unpublish a book, assign a buyer to it and update its status.
   *
   * 1. load volume
   * 2. load user book
   * 3. update user book (status, buyer uid) + create new bought user book as copy + remove book from volume or the whole volume if empty
   * 4. load both and return
   */
  buyBookOffer(uid: string, id: string, offerId: string): Observable<{ volume: VolumeDTO | null; book: UserBookDTO }> {
    return this.getVolume(id) // load affected volume
      .pipe(
        concatMap(volume => {
          const offer = volume.publishedBooks?.[offerId];

          if (!offer) {
            throw new FirebaseError('custom:invalid_data', 'Invalid offer id.');
          }
          if (offer.uid === uid) {
            throw new FirebaseError('custom:invalid_user', 'Cannot buy own book.');
          }
          if (offer.status !== BookStatus.PUBLISHED) {
            throw new FirebaseError('custom:invalid_status', 'Invalid status.');
          }
          return this.getUserBook(offer.uid, offerId) // load user book to be sold
            .pipe(
              concatMap(userBook => {
                if (userBook.status !== BookStatus.PUBLISHED) {
                  throw new FirebaseError('custom:invalid_status', 'Invalid status.');
                }
                const book: UserBookDTO = {
                  ...userBook,
                  status: BookStatus.SOLD,
                  buyerUid: uid,
                };
                const changes: { [path: string]: any } = {
                  [`userBooks/${userBook.uid}/${offerId}/status`]: BookStatus.SOLD,
                  [`userBooks/${userBook.uid}/${offerId}/buyerUid`]: uid,
                };
                const hasOtherOffers = Object.keys(volume.publishedBooks ?? {}).length > 1;

                return forkJoin([
                  from(update(ref(this.database), changes)), // update sold user book
                  from(set(ref(this.database, `userBooks/${uid}/${offerId}`), book)), // create bought user book
                  from(remove(ref(this.database, hasOtherOffers ? `volumes/${id}/publishedBooks/${offerId}` : `volumes/${id}`))), // delete the offer or the whole volume (if empty)
                ]).pipe(
                  concatMap(_ => {
                    return forkJoin([
                      from(get(ref(this.database, `volumes/${id}`)).then(snap => snap.val())), // load updated volume
                      from(get(ref(this.database, `userBooks/${uid}/${offerId}`)).then(snap => snap.val())), // load bought book
                    ]).pipe(map(([volumeOrNull, boughtBook]) => ({ volume: volumeOrNull, book: boughtBook })));
                  }),
                );
              }),
            );
        }),
      );
  }

  logError(uid: string, data: object): Observable<void> {
    const log: ErrorLog = { uid, timestamp: new Date().toISOString(), data };

    const result = push(ref(this.database, `errorLogs/${uid}`), log).then(_ => undefined);

    return from(result);
  }
}
