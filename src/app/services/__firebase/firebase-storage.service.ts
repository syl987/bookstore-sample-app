import { Injectable } from '@angular/core';
import { deleteObject, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { from, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService {
  constructor(private readonly storage: Storage) {}

  upload(path: string, data: any, options: { contentType?: string; contentEncoding?: string } = {}): Observable<string> {
    const task = uploadBytesResumable(ref(this.storage, path), data, options);

    return from(task.then(snapshot => snapshot.ref.fullPath) as Promise<string>);
  }

  delete(path: string): Observable<void> {
    const task = deleteObject(ref(this.storage, path));

    return from(task).pipe(tap(console.log)); // TODO kick console
  }
}
