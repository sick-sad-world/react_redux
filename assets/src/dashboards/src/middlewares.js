import types from './types';
import { makeUrl } from './helpers';

export function ensureDashboardUrl({ dispatch, getState }) {
  return next => (action) => {
    if (action.type === types.READ) {
      action.payload.forEach(makeUrl);
    } else if (action.type === types.CREATE || action.type === types.EDIT) {
      makeUrl(action.payload);
    }

    return next(action);
  };
}
