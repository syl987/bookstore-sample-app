import { HttpErrorResponse } from '@angular/common/http';
import { FirebaseError } from '@angular/fire/app';

import { ResponseError, ResponseErrorType } from '../models/error.models';

function getMessage(error: ResponseError): string | undefined {
  switch (error.type) {
    case ResponseErrorType.HTTP:
      if (error.err instanceof HttpErrorResponse) {
        return error.err.message;
      }
      return;
    case ResponseErrorType.FIREBASE:
      if (error.err instanceof FirebaseError) {
        // cut out the middle part of "Firebase: The popup has been closed by the user before finalizing the operation. (auth/popup-closed-by-user)."
        return /^Firebase: (.+) \(.+\)\.$/.exec(error.err.message)?.[1];
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
  return getMessage(error)?.trim() || $localize`Unknown error`;
}
