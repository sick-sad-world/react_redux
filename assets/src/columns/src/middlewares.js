import types from './types';
import { composeColumnData } from './helpers';

export function processColumn({ dispatch, getState }) {
  return next => (action) => {
    if (action.type === types.READ) {
      return next({
        ...action,
        payload: action.payload.map(composeColumnData)
      });
    } else if (action.type === types.CREATE) {
      return next({
        ...action,
        payload: composeColumnData(action.payload)
      });
    }

    return next(action);
  };
}
