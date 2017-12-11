import types from './types';
import { composeColumnData } from './helpers';

export function processColumn() {
  return next => (action) => {
    switch (action.type) {
      case types.READ:
        return next({
          ...action,
          payload: action.payload.map(composeColumnData)
        });
      case types.CREATE:
      case types.UPDATE:
        return next({
          ...action,
          payload: composeColumnData(action.payload)
        });
      default:
        return next(action);
    }
  };
}
