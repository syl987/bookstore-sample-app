import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { from, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FileService {
    constructor(private readonly fireStorage: AngularFireStorage) {}

    upload(path: string, data: any, options: { contentType?: string; contentEncoding?: string } = {}): Observable<string> {
        const task = this.fireStorage.upload(path, data, options);

        return from(task.then(snapshop => snapshop.ref.getDownloadURL()));
    }

    delete(path: string): Observable<void> {
        const ref = this.fireStorage.ref(path);

        return ref.delete().pipe(tap(console.log)); // TODO kick console
    }
}
