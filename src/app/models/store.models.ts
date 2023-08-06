import { ResponseError } from './error.models';

export type OperationState<T = object> = { pending: boolean; error?: ResponseError } & T;

export type OperationStateWithProgress<T = object> = { pending: boolean; progress?: number; error?: ResponseError } & T;
