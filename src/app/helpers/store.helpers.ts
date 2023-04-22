import { ActionCreator, on, ReducerTypes } from '@ngrx/store';

import { OperationState } from '../models/store.models';

export function onOperation<S extends { [op: string]: OperationState }>(
  operationKey: keyof S,
  actionCreator: ActionCreator,
  setProps?: () => Partial<S>,
): ReducerTypes<S, [ActionCreator]> {
  return on<S, [ActionCreator], S>(actionCreator, state => ({
    ...state,
    ...setProps?.(),
    [operationKey]: { ...state[operationKey as keyof typeof state], pending: true, error: undefined },
  }));
}

export function onOperationSuccess<S extends { [op: string]: OperationState }>(
  operationKey: keyof S,
  actionCreator: ActionCreator,
  setProps?: () => Partial<S>,
): ReducerTypes<S, [ActionCreator]> {
  return on<S, [ActionCreator], S>(actionCreator, state => ({
    ...state,
    ...setProps?.(),
    [operationKey]: { ...state[operationKey as keyof typeof state], pending: false, error: undefined },
  }));
}

export function onOperationError<S extends { [op: string]: OperationState }>(
  operationKey: keyof S,
  actionCreator: ActionCreator,
  setProps?: () => Partial<S>,
): ReducerTypes<S, [ActionCreator]> {
  return on<S, [ActionCreator], S>(actionCreator, (state, action) => ({
    ...state,
    ...setProps?.(),
    [operationKey]: { ...state[operationKey as keyof typeof state], pending: false, error: (action as any).error },
  }));
}
