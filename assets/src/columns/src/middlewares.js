import types from './types';
import { composeColumnData } from './helpers';

export function processColumn({ dispatch, getState }) {
  return next => (action) => {
    if (action.type === types.READ) {
      action.payload.forEach(composeColumnData);
    } else if (action.type === types.CREATE) {
      composeColumnData(action.payload);
    }

    return next(action);
  };
}
