import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Database, get, push, ref, remove, set, update } from '@angular/fire/database';
import { concatMap, from, Observable } from 'rxjs';
import { BookDTO, BookStatus, UserBookDTO, UserBooksDTO } from 'src/app/models/book.models';
import { VolumeDTO, VolumesDTO } from 'src/app/models/volume.models';

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

  getUserBooks(uid: string): Observable<UserBooksDTO | null> {
    const reference = ref(this.database, `userBooks/${uid}`);
    const result = get(reference).then(snap => snap.val());
    return from(result);
  }

  createUserBook(uid: string, volume: VolumeDTO): Observable<UserBookDTO> {
    const book: Pick<UserBookDTO, 'uid' | 'status' | 'volume'> = {
      uid,
      status: BookStatus.DRAFT,
      volume,
    };
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
          throw new FirebaseError('custom', 'Invalid status.');
        }
        if (book.description == null || book.description.length < 100) {
          throw new FirebaseError('custom', 'Insufficient description.');
        }
        if (book.condition == null) {
          throw new FirebaseError('custom', 'Missing condition.');
        }
        if (book.price == null) {
          throw new FirebaseError('custom', 'Missing price.');
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
    const result = get(reference);
    return from(result.then(snap => snap.val()));
  }

  getVolumes(): Observable<VolumesDTO | null> {
    const reference = ref(this.database, `volumes`);
    const result = get(reference).then(snap => snap.val());
    return from(result);
  }
}
