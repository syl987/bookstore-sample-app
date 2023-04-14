import { Injectable } from '@angular/core';
import { child, Database, DataSnapshot, get, push, ref, remove, set, update } from '@angular/fire/database';
import { concatMap, from, Observable } from 'rxjs';
import { UserBookDTO, UserBooksDTO } from 'src/app/models/book.models';
import { VolumeDTO, VolumesDTO } from 'src/app/models/volume.models';

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
  readonly baseUrl = `userBooks`;

  constructor(private readonly database: Database) {}

  getUserBook(uid: string, id: string): Observable<UserBookDTO> {
    throw new Error('Method not implemented.');
  }

  getUserBooks(uid: string): Observable<UserBooksDTO> {
    throw new Error('Method not implemented.');
  }

  createUserBook(uid: string, data: Partial<UserBookDTO>): Observable<UserBookDTO> {
    throw new Error('Method not implemented.');
  }

  updateUserBook(uid: string, id: string, data: Partial<UserBookDTO>): Observable<UserBookDTO> {
    throw new Error('Method not implemented.');
  }

  deleteUserBook(uid: string, id: string): Observable<void> {
    throw new Error('Method not implemented.');
  }

  getVolume(id: string): Observable<VolumeDTO> {
    throw new Error('Method not implemented.');
  }

  getVolumes(): Observable<VolumesDTO> {
    throw new Error('Method not implemented.');
  }

  createVolume(data: Partial<VolumeDTO>): Observable<VolumeDTO> {
    throw new Error('Method not implemented.');
  }

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
