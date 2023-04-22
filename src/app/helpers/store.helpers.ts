import { Action } from '@ngrx/store';

import { ResponseError } from '../models/error.models';

export function onOperationTrigger<S, A extends Action>(op: keyof S, extraReducer?: (state: S, action: A) => Partial<S>): (state: S, action: A) => S {
  return (state, action) => ({
    ...state,
    ...extraReducer?.(state, action),
    [op]: { ...state[op], pending: true, error: undefined },
  });
}

export function onOperationSuccess<S, A extends Action>(op: keyof S, extraReducer?: (state: S, action: A) => Partial<S>): (state: S, action: A) => S {
  return (state, action) => ({
    ...state,
    ...extraReducer?.(state, action),
    [op]: { ...state[op], pending: false, error: undefined },
  });
}

export function onOperationError<S, A extends Action & { error: ResponseError }>(
  op: keyof S,
  extraReducer?: (state: S, action: A) => Partial<S>,
): (state: S, action: A) => S {
  return (state, action) => ({
    ...state,
    ...extraReducer?.(state, action),
    [op]: { ...state[op], pending: false, error: action.error },
  });
}
