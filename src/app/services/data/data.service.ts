import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { from, Observable } from 'rxjs';

async function queryAll<T>(list: AngularFireList<T>): Promise<T[]> {
    const snapshot = list.query.get();

    return snapshot.then(s => Object.values(s.val()));
}

async function queryItem<T>(list: AngularFireList<T>, key: string): Promise<T> {
    const snapshot = list.query.ref.child(key).get();

    return snapshot.then(s => s.val());
}

@Injectable({
    providedIn: 'root',
})
export class DataService {
    constructor(private readonly fireDatabase: AngularFireDatabase) {}

    getAll<T>(path: string): Observable<T[]> {
        const list = this.fireDatabase.list<T>(path);

        return from(queryAll(list));
    }

    get<T>(path: string, key: string): Observable<T> {
        const list = this.fireDatabase.list<T>(path);

        return from(queryItem(list, key));
    }

    push<T>(path: string, entity: T): Observable<T> {
        const list = this.fireDatabase.list<T>(path);

        entity = { ...entity, createdAt: Date.now(), updatedAt: Date.now(), id: list.query.ref.push().key };

        return from(list.push(entity).then(ref => queryItem(list, ref.key!)));
    }

    update<T>(path: string, key: string, changes: Partial<T>): Observable<T> {
        const list = this.fireDatabase.list<T>(path);

        changes = { ...changes, updatedAt: Date.now() };

        return from(list.update(key, changes).then(_ => queryItem(list, key)));
    }

    remove<T>(path: string, key: string): Observable<void> {
        const list = this.fireDatabase.list<T>(path);

        return from(list.remove(key));
    }
}
