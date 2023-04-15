import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { child, Database, DataSnapshot, get, push, ref, remove, set, update } from '@angular/fire/database';
import { concatMap, from, Observable } from 'rxjs';
import { BookDTO, BookStatus, UserBookDTO, UserBooksDTO } from 'src/app/models/book.models';
import { VolumeDTO, VolumesDTO } from 'src/app/models/volume.models';

import { AuthService } from '../auth.service';

function toValueWithIdOrThrow(snapshot: DataSnapshot): any {
  if (snapshot.exists()) {
    return { ...snapshot.val(), id: snapshot.key };
  }
  throw new Error(`Firebase data not found.`);
}

function toListWithIdsOrThrow(snapshot: DataSnapshot): any[] {
  if (snapshot.exists()) {
    return Object.entries(snapshot.val()).map(([key, val]) => ({ ...(val as object), id: key })); // TODO safe guard, kick casting
  }
  throw new Error(`Firebase data not found.`);
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseDatabaseService {
  constructor(private readonly authService: AuthService, private readonly database: Database) {}

  getUserBook(uid: string, id: string): Observable<UserBookDTO> {
    const reference = ref(this.database, `userBooks/${uid}/${id}`);
    const result = get(reference).then(snap => snap.val());
    return from(result);
  }

  getUserBooks(uid: string): Observable<UserBooksDTO> {
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
    const reference = ref(this.database, `userBooks/${uid}`);
    const result = push(reference, book).then(snap => snap.key!);
    return from(result).pipe(concatMap(id => this.getUserBook(uid, id)));
  }

  /* createUserBook2(data: Pick<UserBookDTO, 'uid' | 'status' | 'volume'>): Observable<UserBookDTO> {
    const reference = ref(this.database, `userBooks/${uid}`);
    const result = push(reference, data).then(snap => snap.key!);
    return from(result).pipe(concatMap(id => this.getUserBook(uid, id)));
  } */

  editUserBookDraft(uid: string, id: string, data: Pick<UserBookDTO, 'description' | 'condition'>): Observable<UserBookDTO> {
    return this.getUserBook(uid, id).pipe(
      concatMap(book => {
        if (book.status !== BookStatus.DRAFT) {
          throw new FirebaseError('custom', 'Invalid status.');
        }
        const changes: { [path: string]: any } = {
          [`userBooks/${uid}/${id}/description`]: data.description,
          [`userBooks/${uid}/${id}/condiction`]: data.condition,
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
        if (!book.description || book.description.length < 100) {
          throw new FirebaseError('custom', 'Insufficient description.');
        }
        if (!book.condition) {
          throw new FirebaseError('custom', 'Missing condition.');
        }
        const publishedBook: BookDTO = {
          id: book.id,
          uid: book.uid,
          status: BookStatus.PUBLISHED,
          description: book.description,
          condition: book.condition,
          imageUrl: book.imageUrl,
        };
        const changes: { [path: string]: any } = {
          [`userBooks/${uid}/${id}/status`]: BookStatus.PUBLISHED,
          [`volumes/${book.volume.id}`]: book.volume,
          [`volumes/${book.volume.id}/publishedBooks/${id}`]: publishedBook,
        };
        const reference = ref(this.database);
        const result = update(reference, changes);
        return from(result).pipe(concatMap(_ => this.getUserBook(uid, id)));
      }),
    );
  }

  /* updateUserBook(id: string, data: Partial<UserBookDTO>): Observable<UserBookDTO> {
    const changes: { [path: string]: any } = {
      [`userBooks/${uid}/${id}/status`]: data,
      [`userBooks/${uid}/${id}/description`]: data,
      [`userBooks/${uid}/${id}/condiction`]: data,
      [`userBooks/${uid}/${id}/imageUrl`]: data,
      [`volumes/${volId}/publishedBooks/${id}`]: data,
    };
    throw new Error('Method not implemented.');
  } */

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

  getVolumes(): Observable<VolumesDTO> {
    const reference = ref(this.database, `volumes`);
    const result = get(reference).then(snap => snap.val());
    return from(result);
  }

  /* createVolume(data: VolumeDTO): Observable<VolumeDTO> {
    const reference = ref(this.database, `volumes/${data.id}`);
    const result = set(reference, data);
    return from(result).pipe(concatMap(_ => this.getVolume(data.id)));
  } */

  /* updateVolume(id: string, data: Partial<VolumeDTO>): Observable<VolumeDTO> {
    throw new Error('Method not implemented.');
  } */

  /* deleteVolume(id: string): Observable<void> {
    const reference = ref(this.database, `volumes/${id}`);
    const result = remove(reference);
    return from(result);
  } */

  // ========

  getAll<T>(path: string): Observable<T[]> {
    const reference = ref(this.database, path);

    return from(get(reference).then(toListWithIdsOrThrow));
  }

  get<T>(path: string, key: string): Observable<T> {
    const reference = ref(this.database, path);

    return from(get(child(reference, key)).then(toValueWithIdOrThrow));
  }

  push<T>(path: string, entity: T): Observable<T> {
    const reference = ref(this.database, path);

    const key = push(reference).key!;

    return from(set(child(reference, key), { ...entity, id: key })).pipe(concatMap(_ => this.get<T>(path, key!)));
  }

  set<T>(path: string, key: string, entity: T): Observable<T> {
    const reference = ref(this.database, path);

    return from(set(child(reference, key), entity)).pipe(concatMap(_ => this.get<T>(path, key!)));
  }

  update<T>(path: string, key: string, changes: { [path: string]: any }): Observable<T> {
    const reference = ref(this.database, path);

    return from(update(child(reference, key), changes)).pipe(concatMap(_ => this.get<T>(path, key)));
  }

  remove(path: string, key: string): Observable<void> {
    const reference = ref(this.database, path);

    return from(remove(child(reference, key)));
  }
}
