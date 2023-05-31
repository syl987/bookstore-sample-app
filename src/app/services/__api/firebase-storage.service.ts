import { Injectable } from '@angular/core';
import { deleteObject, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { from, Observable } from 'rxjs';
import { toFirebaseUploadData } from 'src/app/helpers/firebase.helpers';
import { FirebaseUploadData, FirebaseUploadRequestMetadata } from 'src/app/models/firebase.models';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService {
  constructor(private readonly storage: Storage) {}

  uploadUserBookImage(uid: string, id: string, data: Blob | Uint8Array | ArrayBuffer, options: FirebaseUploadRequestMetadata = {}): Observable<FirebaseUploadData> {
    const reference = ref(this.storage, `userBooks/${uid}/${id}`);
    const task = uploadBytesResumable(reference, data, options);
    return new Observable(subscriber => {
      task.on('state_changed', {
        next: snapshot => subscriber.next(toFirebaseUploadData(snapshot)),
        error: subscriber.error,
        complete: subscriber.complete,
      });
    });
  }

  deleteUserBookImage(uid: string, id: string): Observable<void> {
    const reference = ref(this.storage, `userBooks/${uid}/${id}`);
    const task = deleteObject(reference);
    return from(task);
  }
}
