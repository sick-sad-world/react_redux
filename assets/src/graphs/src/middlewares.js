import types from './types';
import { mapGraphData as mapper } from './helpers';


export function mapGraphData({ dispatch, getState }) {
  return next => (action) => {
    if (action.type === types.READ) {
      return next({
        ...action,
        payload: mapper(action.payload)
      });
    }
    return next(action);
  };
}
