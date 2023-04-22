import { ActionCreator, on, ReducerTypes } from '@ngrx/store';

import { OperationState } from '../models/store.models';

// TODO problem: set state functions require params, how to get these? streamline action signatures?

export function onOperation<S extends { [op: string]: OperationState }>(
  operationKey: string,
  actionCreators: [ActionCreator, ActionCreator, ActionCreator],
  options?: { setOnTriggerState?(): Partial<S>; setOnSuccessState?(): Partial<S>; setOnErrorState?(): Partial<S> },
): ReducerTypes<S, [ActionCreator]>[] {
  return [
    onOperationTrigger(operationKey, actionCreators[0], options?.setOnTriggerState),
    onOperationSuccess(operationKey, actionCreators[1], options?.setOnSuccessState),
    onOperationError(operationKey, actionCreators[2], options?.setOnErrorState),
  ];
}

function onOperationTrigger<S extends { [op: string]: OperationState }>(
  operationKey: string,
  actionCreator: ActionCreator,
  setState?: () => Partial<S>,
): ReducerTypes<S, [ActionCreator]> {
  return on<S, [ActionCreator], S>(actionCreator, state => ({
    ...state,
    ...setState?.(),
    [operationKey]: { ...state[operationKey], pending: true, error: undefined },
  }));
}

function onOperationSuccess<S extends { [op: string]: OperationState }>(
  operationKey: string,
  actionCreator: ActionCreator,
  setState?: () => Partial<S>,
): ReducerTypes<S, [ActionCreator]> {
  return on<S, [ActionCreator], S>(actionCreator, state => ({
    ...state,
    ...setState?.(),
    [operationKey]: { ...state[operationKey], pending: false, error: undefined },
  }));
}

function onOperationError<S extends { [op: string]: OperationState }>(
  operationKey: string,
  actionCreator: ActionCreator,
  setState?: () => Partial<S>,
): ReducerTypes<S, [ActionCreator]> {
  return on<S, [ActionCreator], S>(actionCreator, (state, action) => ({
    ...state,
    ...setState?.(),
    [operationKey]: { ...state[operationKey], pending: false, error: (action as any).error },
  }));
}
