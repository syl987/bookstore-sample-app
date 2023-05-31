import { UploadTaskSnapshot } from '@angular/fire/storage';

import { FirebaseUploadData } from '../models/firebase.models';

export function toFirebaseUploadData(snapshot: UploadTaskSnapshot): FirebaseUploadData {
  return {
    state: snapshot.state,
    bytesTransferred: snapshot.bytesTransferred,
    totalBytes: snapshot.totalBytes,
    metadata: {
      bucket: snapshot.metadata.bucket,
      fullPath: snapshot.metadata.fullPath,
      size: snapshot.metadata.size,
    },
  };
}
