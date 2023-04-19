import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Database, endAt, get, limitToFirst, orderByChild, push, query, ref, remove, set, startAt, update } from '@angular/fire/database';
import { concatMap, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getPublishUserBookValidationErrors } from 'src/app/helpers/book.helpers';
import { BookDTO, BookStatus, UserBookDTO } from 'src/app/models/book.models';
import { VolumeDTO } from 'src/app/models/volume.models';

// TODO test snapshot.val() returns null instead of error for no data
// TODO adapt all methods accordingly

@Injectable({
  providedIn: 'root',
})
export class FirebaseDatabaseService {
  constructor(private readonly database: Database) {}

  getUserBook(uid: string, id: string): Observable<UserBookDTO> {
    const reference = ref(this.database, `userBooks/${uid}/${id}`);
    const result = get(reference).then(snap => snap.val());
    return from(result);
  }

  getUserBooks(uid: string): Observable<UserBookDTO[]> {
    const reference = ref(this.database, `userBooks/${uid}`);
    const result = get(reference).then(snap => snap.val());
    return from(result).pipe(map(entityMap => Object.values(entityMap ?? {})));
  }

  createUserBook(uid: string, volume: VolumeDTO): Observable<UserBookDTO> {
    const book: Pick<UserBookDTO, 'uid' | 'status' | 'volume'> = { uid, status: BookStatus.DRAFT, volume };

    const result = push(ref(this.database))
      .then(snap => snap.key!)
      .then(id => set(ref(this.database, `userBooks/${uid}/${id}`), { ...book, id }).then(_ => id));
    return from(result).pipe(concatMap(id => this.getUserBook(uid, id)));
  }

  editUserBookDraft(uid: string, id: string, data: Pick<UserBookDTO, 'description' | 'condition' | 'price'>): Observable<UserBookDTO> {
    return this.getUserBook(uid, id).pipe(
      concatMap(book => {
        if (book.status !== BookStatus.DRAFT) {
          throw new FirebaseError('custom', 'Invalid status.');
        }
        const changes: { [path: string]: any } = {
          [`userBooks/${uid}/${id}/description`]: data.description,
          [`userBooks/${uid}/${id}/condiction`]: data.condition,
          [`userBooks/${uid}/${id}/price`]: data.price,
        };
        const reference = ref(this.database);
        const result = update(reference, changes);
        return from(result).pipe(concatMap(_ => this.getUserBook(uid, id)));
      }),
    );
  }

  publishUserBook(uid: string, id: string): Observable<UserBookDTO> {
    return this.getUserBook(uid, id).pipe(
      concatMap(book => {
        if (book.status !== BookStatus.DRAFT) {
          throw new FirebaseError('custom:publish_user_book_error', 'Invalid status.');
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
    // TODO also delete the volume if not related to any books

    return this.getUserBook(uid, id).pipe(
      concatMap(book => {
        if (book.status !== BookStatus.DRAFT) {
          throw new FirebaseError('custom', 'Invalid status.');
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
    return from(result);
  }

  getVolumes(): Observable<VolumeDTO[]> {
    const reference = ref(this.database, `volumes`);
    const result = get(reference).then(snap => snap.val());
    return from(result).pipe(map(entityMap => Object.values(entityMap ?? {})));
  }

  searchVolumes(queryString: string, size?: number): Observable<VolumeDTO[]> {
    const reference = ref(this.database, `volumes`);
    const searchQuery = query(
      reference,
      orderByChild('volumeInfo/title'),
      startAt('%' + queryString + '%'),
      endAt(queryString + '\uf8ff'),
      limitToFirst(size ?? 12),
    );
    const result = get(searchQuery).then(snap => snap.val());
    return from(result).pipe(map(entityMap => Object.values(entityMap ?? {})));
  }
}
