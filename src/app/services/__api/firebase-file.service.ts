import { Injectable } from '@angular/core';
import { deleteObject, getDownloadURL, listAll, ref, Storage, uploadBytes, uploadBytesResumable } from '@angular/fire/storage';
import { concatMap, from, map, Observable, of, retry, startWith } from 'rxjs';
import { toFirebaseUploadDataWithProgress } from 'src/app/helpers/firebase.helpers';
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
        next: snapshot => subscriber.next(toFirebaseUploadDataWithProgress(snapshot)),
        error: err => subscriber.error(err),
        complete: () => subscriber.complete(),
      });
    }).pipe(
      concatMap(uploadData => {
        if (uploadData.snapshot.bytesTransferred === uploadData.snapshot.totalBytes) {
          // workaround: often times, the download url call needs to be delayed by varying time length to succeed
          return new Observable<string>(subscriber => {
            setTimeout(async () => {
              try {
                subscriber.next(await getDownloadURL(reference));
                subscriber.complete();
              } catch (e) {
                subscriber.error(e);
              }
            }, 250);
          }).pipe(
            retry(4),
            map(downloadUrl => ({ ...uploadData, downloadUrl, complete: true })),
            // pass the last emitted upload data unchanged to indicate 100% completion just in time
            startWith(uploadData),
          );
        }
        return of(uploadData);
      }),
    );
  }

  deleteFiles(path: string): Observable<void> {
    const reference = ref(this.storage, path);
    const task = listAll(reference).then(result => result.items.forEach(item => deleteObject(ref(this.storage, item.fullPath))));
    return from(task);
  }

  deleteFile(path: string): Observable<void> {
    const reference = ref(this.storage, path);
    const task = deleteObject(reference);
    return from(task);
  }
}
