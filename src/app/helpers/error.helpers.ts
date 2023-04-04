import { HttpErrorResponse } from '@angular/common/http';
import { FirebaseError } from '@angular/fire/app';

import { ResponseError, ResponseErrorType } from '../models/error.models';

function getMessage(error: ResponseError): string | undefined {
  switch (error.type) {
    case ResponseErrorType.HTTP:
      if (error.error instanceof HttpErrorResponse) {
        return error.error.message;
      }
      return;
    case ResponseErrorType.FIREBASE:
      if (error.error instanceof FirebaseError) {
        // cut out the middle part of "Firebase: The popup has been closed by the user before finalizing the operation. (auth/popup-closed-by-user)."
        return /^Firebase: (.+) \(.+\)\.$/.exec(error.error.message)?.[1];
      }
      return;
    case ResponseErrorType.INTERNAL:
      return error.message;
    default:
      return undefined;
  }
}

/**
 * Get an appropriate error message for display based on the provided `ResponseError` object.
 */
export function toResponseErrorMessage(error: ResponseError): string {
  return getMessage(error)?.trim() || `Unknown error`;
}
