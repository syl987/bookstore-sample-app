import { UploadTaskSnapshot } from '@angular/fire/storage';

import { FirebaseUploadData, FirebaseUploadDataWithProgress } from '../models/firebase.models';

export function toFirebaseUploadData(snapshot: UploadTaskSnapshot): FirebaseUploadData {
  return {
    totalBytes: snapshot.totalBytes,
    metadata: {
      bucket: snapshot.metadata.bucket,
      fullPath: snapshot.metadata.fullPath,
      size: snapshot.metadata.size,
    },
  };
}

export function toFirebaseUploadDataWithProgress(snapshot: UploadTaskSnapshot, complete?: boolean): FirebaseUploadDataWithProgress {
  return {
    status: complete ? 'complete' : 'progress',
    bytesTransferred: snapshot.bytesTransferred,
    totalBytes: snapshot.totalBytes,
    metadata: {
      bucket: snapshot.metadata.bucket,
      fullPath: snapshot.metadata.fullPath,
      size: snapshot.metadata.size,
    },
  };
}
