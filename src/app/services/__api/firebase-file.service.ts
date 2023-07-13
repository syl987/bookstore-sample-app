import { Injectable } from '@angular/core';
import { deleteObject, getDownloadURL, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { from, Observable } from 'rxjs';
import { toFirebaseUploadData, toFirebaseUploadDataWithProgress } from 'src/app/helpers/firebase.helpers';
import { FirebaseUploadData, FirebaseUploadDataWithProgress, FirebaseUploadRequestMetadata } from 'src/app/models/firebase.models';

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
        next: snapshot => {
          if (snapshot.bytesTransferred === snapshot.totalBytes) {
            subscriber.next(toFirebaseUploadData(snapshot));
          }
        },
        error: err => subscriber.error(err),
        complete: () => subscriber.complete(),
      });
    });
  }

  uploadFileWithProgress(path: string, data: Blob | Uint8Array | ArrayBuffer, options: FirebaseUploadRequestMetadata = {}): Observable<FirebaseUploadDataWithProgress> {
    const reference = ref(this.storage, path);
    const task = uploadBytesResumable(reference, data, options);
    return new Observable(subscriber => {
      task.on('state_changed', {
        next: snapshot => subscriber.next(toFirebaseUploadDataWithProgress(snapshot, snapshot.bytesTransferred === snapshot.totalBytes)),
        error: err => subscriber.error(err),
        complete: () => subscriber.complete(),
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
