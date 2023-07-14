import { Injectable } from '@angular/core';
import { deleteObject, getDownloadURL, ref, Storage, uploadBytes, uploadBytesResumable } from '@angular/fire/storage';
import { from, Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { FirebaseUploadData, FirebaseUploadDataWithProgress, FirebaseUploadRequestMetadata } from 'src/app/models/firebase.models';

@Injectable({
  providedIn: 'root',
})
export class FirebaseFileService {
  constructor(private readonly storage: Storage) {}

  uploadFile(path: string, data: Blob | Uint8Array | ArrayBuffer, options: FirebaseUploadRequestMetadata = {}): Observable<FirebaseUploadData> {
    const reference = ref(this.storage, path);
    const task = uploadBytes(reference, data, options);
    return from(task.then(result => getDownloadURL(reference).then(downloadUrl => ({ metadata: result.metadata, downloadUrl }))));
  }

  uploadFileWithProgress(path: string, data: Blob | Uint8Array | ArrayBuffer, options: FirebaseUploadRequestMetadata = {}): Observable<FirebaseUploadDataWithProgress> {
    const reference = ref(this.storage, path);
    const task = uploadBytesResumable(reference, data, options);
    return new Observable<FirebaseUploadDataWithProgress>(subscriber => {
      task.on('state_changed', {
        next: snapshot => subscriber.next({ snapshot }),
        error: err => subscriber.error(err),
        complete: () => subscriber.complete(),
      });
    }).pipe(
      concatMap(uploadData => {
        if (uploadData.snapshot.bytesTransferred === uploadData.snapshot.totalBytes) {
          return from(getDownloadURL(reference).then(downloadUrl => ({ ...uploadData, downloadUrl })));
        }
        return of(uploadData);
      }),
    );
  }

  removeObject(path: string): Observable<void> {
    const reference = ref(this.storage, path);
    const task = deleteObject(reference);
    return from(task);
  }
}
