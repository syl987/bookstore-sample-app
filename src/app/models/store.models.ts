import { ResponseError } from './error.models';

export type OperationState<T = object> = { pending: boolean; error?: ResponseError } & T;
