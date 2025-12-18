import { HttpErrorResponse } from '@angular/common/http';
import { FirebaseError } from '@angular/fire/app';
import { createAction, props } from '@ngrx/store';

export enum ResponseErrorType {
  HTTP = '<Error> http',
  FIREBASE = '<Error> firebase',
  INTERNAL = '<Error> internal',
  UNKNOWN = '<Error> unknown',
}

export const httpError = createAction(ResponseErrorType.HTTP, props<{ err: HttpErrorResponse }>());

export const firebaseError = createAction(ResponseErrorType.FIREBASE, props<{ err: FirebaseError }>());

export const internalError = createAction(ResponseErrorType.INTERNAL, props<{ err: Error }>());

export const unknownError = createAction(ResponseErrorType.UNKNOWN, props<{ err: unknown }>());

export type ResponseError = ReturnType<typeof httpError | typeof firebaseError | typeof internalError | typeof unknownError>;
