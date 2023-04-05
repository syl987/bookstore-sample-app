import { Injectable } from '@angular/core';
import { child, Database, DataSnapshot, get, push, ref, remove, update } from '@angular/fire/database';
import { concatMap, from, Observable } from 'rxjs';

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
export class DataService {
  constructor(private readonly database: Database) {}

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

    const data: T = { ...entity, createdAt: Date.now(), updatedAt: Date.now() };

    return from(push(reference, data)).pipe(concatMap(({ key }) => this.get<T>(path, key!)));
  }

  update<T>(path: string, key: string, changes: Partial<T>): Observable<T> {
    const reference = ref(this.database, path);

    const data: Partial<T> = { ...changes, updatedAt: Date.now() };

    return from(update(child(reference, key), data)).pipe(concatMap(_ => this.get<T>(path, key)));
  }

  remove(path: string, key: string): Observable<void> {
    const reference = ref(this.database, path);

    return from(remove(child(reference, key)));
  }
}
