import { MetaReducer } from '@ngrx/store';

export const consoleLogMetaReducer: MetaReducer = reducer => (state, action) => {
  const result = reducer(state, action);

  console.groupCollapsed(action.type);
  console.log('prev state', state);
  console.log('action', action);
  console.log('next state', result);
  console.groupEnd();

  return result;
};
