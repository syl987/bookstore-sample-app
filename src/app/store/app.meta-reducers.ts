import { MetaReducer } from '@ngrx/store';

export function resetStateMetaReducer(...actionTypes: string[]): MetaReducer {
  return reducer => (state, action) => {
    if (actionTypes.some(type => type === action.type)) {
      return reducer(undefined, action);
    }
    return reducer(state, action);
  };
}

export const consoleLogMetaReducer: MetaReducer = reducer => (state, action) => {
  const result = reducer(state, action);

  console.groupCollapsed(action.type);
  console.log('prev state', state);
  console.log('action', action);
  console.log('next state', result);
  console.groupEnd();

  return result;
};
