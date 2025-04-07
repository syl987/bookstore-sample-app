import { HttpErrorResponse } from '@angular/common/http';
import { FirebaseError } from '@angular/fire/app';
import { Action } from '@ngrx/store';

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
      return error.err.message;
    default:
      return;
  }
}

/**
 * Get an appropriate error message for display based on the provided `ResponseError` object.
 */
export function toResponseErrorMessage(error: ResponseError): string {
  return getMessage(error)?.trim() || $localize`Unknown error`;
}

/**
 * Get a generic success message based on common `Action.type` keywords.
 *
 * Define custom keyword / message pairs if needed.
 */
export function toActionSuccessMessage(action: Action, extras?: [string, string][]): string {
  if (extras?.length) {
    for (const [keyword, message] of extras) {
      if (action.type.includes(keyword)) {
        return message;
      }
    }
  }
  if (['load'].some(s => action.type.includes(s))) {
    return $localize`Data successfully loaded.`;
  }
  if (['create', 'update', 'edit'].some(s => action.type.includes(s))) {
    return $localize`Data successfully saved.`;
  }
  if (['delete', 'remove'].some(s => action.type.includes(s))) {
    return $localize`Data successfully removed.`;
  }
  if (['upload'].some(s => action.type.includes(s))) {
    return $localize`File successfully uploaded.`;
  }
  return $localize`Operation successful.`;
}

/**
 * Get a generic error message based on common `Action.type` keywords.
 *
 * Define custom keyword / message pairs if needed.
 */
export function toActionErrorMessage(action: Action, extras?: [string, string][]): string {
  if (extras?.length) {
    for (const [keyword, message] of extras) {
      if (action.type.includes(keyword)) {
        return message;
      }
    }
  }
  if (['load'].some(s => action.type.includes(s))) {
    return $localize`Error loading data.`;
  }
  if (['create', 'update', 'edit'].some(s => action.type.includes(s))) {
    return $localize`Error saving data.`;
  }
  if (['delete', 'remove'].some(s => action.type.includes(s))) {
    return $localize`Error removing data.`;
  }
  if (['upload'].some(s => action.type.includes(s))) {
    return $localize`Error uploading file.`;
  }
  return $localize`Unknown Error.`;
}
