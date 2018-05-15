import types from './types';
import get from 'lodash/get';
import { setUniqFeeds, calcFeedOccurance, processSet } from './helpers';

// Clear feeds property on SET UPDATE (sent by server defaults)
// ===========================================================================
export function clearFeeds() {
  return next => (action) => {
    if (action.type === types.UPDATE) {
      return next({
        ...action,
        payload: {
          ...action.payload,
          sources: undefined
        }
      });
    }
    return next(action);
  };
}

// Loop over sets in order to determine which feeds are uniq for each set
// ===========================================================================
export function updateUniq({ getState }) {
  return next => (action) => {
    switch (action.type) {
      case types.READ:
        return next({
          ...action,
          payload: action.payload.map((set, i, sets) => processSet(set, sets))
        });
      case types.UPDATE_UNIQ:
        return next({
          ...action,
          payload: get(getState(), 'sets', []).map((set, i, sets) => ({
            ...set,
            uniq_ids: setUniqFeeds(set.source_ids, calcFeedOccurance(sets))
          })).map(({ id, uniq_ids }) => ({ id, uniq_ids }))
        });
      case types.CREATE:
      case types.UPDATE:
        return next({
          ...action,
          payload: processSet(action.payload, get(getState(), 'sets', []))
        });
      default:
        return next(action);
    }
  };
}
