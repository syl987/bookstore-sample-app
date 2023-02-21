import { HttpErrorResponse } from '@angular/common/http';
import { FirebaseError } from '@angular/fire/app';
import { createAction, props } from '@ngrx/store';

export enum ResponseErrorType {
    HTTP = '<Error> http',
    FIREBASE = '<Error> firebase',
    INTERNAL = '<Error> internal',
}

export const httpError = createAction(ResponseErrorType.HTTP, props<{ error: HttpErrorResponse }>());

export const firebaseError = createAction(ResponseErrorType.FIREBASE, props<{ error: FirebaseError }>());

export const internalError = createAction(ResponseErrorType.INTERNAL, props<{ message: string }>());

export type ResponseError = ReturnType<typeof httpError | typeof firebaseError | typeof internalError>;
