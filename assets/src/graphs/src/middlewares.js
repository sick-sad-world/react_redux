import types from './types';
import { mapGraphRaw, mapGraphGoogle } from './helpers';

export function mapGraphData({ dispatch, getState }) {
  return next => (action) => {
    if (action.type === types.READ || action.type === types.UPDATE_CACHE) {
      return next({
        ...action,
        payload: (window.google && window.google.charts) ? mapGraphGoogle(action.payload, action.entity) : mapGraphRaw(action.payload, action.entity)
      });
    }
    return next(action);
  };
}
