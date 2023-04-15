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
  constructor(private readonly database: Database) {}

  getUserBook(uid: string, id: string): Observable<UserBookDTO> {
    const result = get(child(child(ref(this.database, 'userBooks'), uid), id));

    return from(result.then(snap => snap.val()));
  }

  getUserBooks(uid: string): Observable<UserBooksDTO> {
    const result = get(child(ref(this.database, 'userBooks'), uid));

    return from(result.then(snap => snap.val()));
  }

  createUserBook(uid: string, data: Partial<UserBookDTO>): Observable<UserBookDTO> {
    const result = push(child(ref(this.database, 'userBooks'), uid), data);

    return from(
      result.then(snap => snap.key!).then(key => get(child(child(ref(this.database, 'userBooks'), uid), key)).then(snap => snap.val())),
    );
  }

  updateUserBook(uid: string, id: string, data: Partial<UserBookDTO>): Observable<UserBookDTO> {
    throw new Error('Method not implemented.');
  }

  deleteUserBook(uid: string, id: string): Observable<void> {
    const result = remove(child(child(ref(this.database, 'userBooks'), uid), id));

    return from(result);
  }

  getVolume(id: string): Observable<VolumeDTO> {
    const result = get(child(ref(this.database, 'volumes'), id));

    return from(result.then(snap => snap.val()));
  }

  getVolumes(): Observable<VolumesDTO> {
    const result = get(ref(this.database, 'volumes'));

    return from(result.then(snap => snap.val()));
  }

  createVolume(data: Partial<VolumeDTO>): Observable<VolumeDTO> {
    const result = push(ref(this.database, 'volumes'), data);

    return from(result.then(snap => snap.key!).then(key => get(child(ref(this.database, 'userBooks'), key)).then(snap => snap.val())));
  }

  updateVolume(id: string, data: Partial<VolumeDTO>): Observable<VolumeDTO> {
    throw new Error('Method not implemented.');
  }

  deleteVolume(id: string): Observable<void> {
    const result = remove(child(ref(this.database, 'userBooks'), id));

    return from(result);
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
