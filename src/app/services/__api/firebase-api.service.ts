import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Database, get, push, ref, remove, set, update } from '@angular/fire/database';
import { concatMap, from, map, Observable, of, throwError } from 'rxjs';
import { getObjectValues } from 'src/app/functions/object.functions';
import { getPublishUserBookValidationErrors } from 'src/app/helpers/book.helpers';
import { BookDTO, BookPhotoDTO, BookStatus, UserBookCreateDTO, UserBookDTO } from 'src/app/models/book.models';
import { FirebaseUploadDataWithProgress } from 'src/app/models/firebase.models';
import { VolumeDTO } from 'src/app/models/volume.models';

import { FirebaseFileService } from './firebase-file.service';

// TODO also save thumbnail as base64
// TODO evaluate how to implement volume search+detail duality on database and store levels

@Injectable({
  providedIn: 'root',
})
export class FirebaseApiService {
  constructor(private readonly database: Database, private readonly fileService: FirebaseFileService) {}

  getUserBook(uid: string, id: string): Observable<UserBookDTO> {
    const reference = ref(this.database, `userBooks/${uid}/${id}`);
    const result = get(reference).then(snap => snap.val());
    return from(result).pipe(map(entity => entity ?? throwError(() => new FirebaseError('custom:no_data', 'No data available.'))));
  }

  getUserBooks(uid: string): Observable<UserBookDTO[]> {
    const reference = ref(this.database, `userBooks/${uid}`);
    const result = get(reference).then(snap => snap.val());
    return from(result).pipe(map(getObjectValues));
  }

  createUserBook(uid: string, volume: VolumeDTO): Observable<UserBookDTO> {
    const book: UserBookCreateDTO = { uid, status: BookStatus.DRAFT, volume };

    const result = push(ref(this.database))
      .then(snap => snap.key!)
      .then(id => set(ref(this.database, `userBooks/${uid}/${id}`), { ...book, id }).then(_ => id));
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
        const reference = ref(this.database);
        const result = update(reference, changes);
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
        const reference = ref(this.database);
        const generatedId: string = push(reference).key!;
        const path = `userBooks/${uid}/${bookId}/photos/${generatedId}/medium`; // TODO generic file name + correct extension

        // TODO also save original?
        // TODO also save thumbnail?

        return this.fileService.uploadFileWithProgress(path, data).pipe(
          concatMap(res => {
            if (res.complete) {
              const photo: BookPhotoDTO = {
                id: generatedId,
                imageUrl: res.downloadUrl!,
              };
              const changes: { [path: string]: any } = {
                [`userBooks/${uid}/${bookId}/photos/${generatedId}`]: photo,
              };
              const result = update(reference, changes);

              return from(result).pipe(map(_ => res));
            }
            return of(res);
          }),
        );
      }),
    );
  }

  removeAllUserBookPhotos(uid: string, bookId: string): Observable<void> {
    const reference = ref(this.database);
    const path = `userBooks/${uid}/${bookId}`;

    return this.fileService.removeObject(path).pipe(
      concatMap(_ => {
        const changes: { [path: string]: any } = {
          [`userBooks/${uid}/${bookId}/photos`]: null,
        };
        const result = update(reference, changes);
        return from(result);
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
          id: book.id,
          uid: book.uid,
          status: BookStatus.PUBLISHED,
          description: book.description,
          condition: book.condition,
          price: book.price,
          /* imageUrl: book.imageUrl, */
        };
        const changes: { [path: string]: any } = {
          [`userBooks/${uid}/${id}/status`]: BookStatus.PUBLISHED,
          [`volumes/${book.volume.id}/id`]: book.volume.id,
          [`volumes/${book.volume.id}/volumeInfo`]: book.volume.volumeInfo,
          [`volumes/${book.volume.id}/searchInfo`]: book.volume.searchInfo,
          [`volumes/${book.volume.id}/publishedBooks/${id}`]: publishedBook,
        };
        const reference = ref(this.database);
        const result = update(reference, changes);
        return from(result).pipe(concatMap(_ => this.getUserBook(uid, id)));
      }),
    );
  }

  deleteUserBook(uid: string, id: string): Observable<void> {
    // TODO allow deletion if published and also delete the volume if not related to any books
    return this.getUserBook(uid, id).pipe(
      concatMap(book => {
        if (book.status !== BookStatus.DRAFT) {
          throw new FirebaseError('custom:invalid_status', 'Invalid status.');
        }
        const reference = ref(this.database, `userBooks/${uid}/${id}`);
        const result = remove(reference);
        return from(result);
      }),
    );
  }

  getVolume(id: string): Observable<VolumeDTO> {
    const reference = ref(this.database, `volumes/${id}`);
    const result = get(reference).then(snap => snap.val());
    return from(result).pipe(map(entity => entity ?? throwError(() => new FirebaseError('custom:no_data', 'No data available.'))));
  }

  getVolumes(): Observable<VolumeDTO[]> {
    const reference = ref(this.database, `volumes`);
    const result = get(reference).then(snap => snap.val());
    return from(result).pipe(map(getObjectValues));
  }
}
