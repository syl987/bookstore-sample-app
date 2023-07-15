import { UploadTaskSnapshot } from '@angular/fire/storage';

import { FirebaseUploadDataWithProgress } from '../models/firebase.models';

export function toFirebaseUploadDataWithProgress(snapshot: UploadTaskSnapshot): FirebaseUploadDataWithProgress {
  return {
    snapshot: {
      state: snapshot.state,
      metadata: snapshot.metadata,
      bytesTransferred: snapshot.bytesTransferred,
      totalBytes: snapshot.totalBytes,
    },
    complete: false,
  };
}
