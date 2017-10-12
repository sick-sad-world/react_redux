import types from './types';
import { makeUrl } from './helpers';

export function ensureDashboardUrl({ dispatch, getState }) {
  return next => (action) => {
    if (action.type === types.READ) {
      return next({
        ...action,
        payload: action.payload.map(makeUrl)
      });
    } else if (action.type === types.CREATE || action.type === types.UPDATE) {
      return next({
        ...action,
        payload: makeUrl(action.payload)
      });
    }

    return next(action);
  };
}
