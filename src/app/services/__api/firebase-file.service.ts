import { Injectable } from '@angular/core';
import { deleteObject, getDownloadURL, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { from, Observable } from 'rxjs';
import { toFirebaseUploadData } from 'src/app/helpers/firebase.helpers';
import { FirebaseUploadData, FirebaseUploadRequestMetadata } from 'src/app/models/firebase.models';

@Injectable({
  providedIn: 'root',
})
export class FirebaseFileService {
  constructor(private readonly storage: Storage) {}

  uploadFile(path: string, data: Blob | Uint8Array | ArrayBuffer, options: FirebaseUploadRequestMetadata = {}): Observable<FirebaseUploadData> {
    const reference = ref(this.storage, path);
    const task = uploadBytesResumable(reference, data, options);
    return new Observable(subscriber => {
      task.on('state_changed', {
        next: snapshot => subscriber.next(toFirebaseUploadData(snapshot)),
        error: subscriber.error,
        complete: subscriber.complete,
      });
    });
  }

  getDownloadUrl(path: string): Observable<string> {
    const reference = ref(this.storage, path);
    const task = getDownloadURL(reference);
    return from(task);
  }

  removeObject(path: string): Observable<void> {
    const reference = ref(this.storage, path);
    const task = deleteObject(reference);
    return from(task);
  }
}
