import types from './types';
import { calcFeedOccurance, setUniqFeeds } from './helpers';

// Clear feeds property on SET UPDATE (sent by server defaults)
// ===========================================================================
export function clearFeeds({ dispatch, getState }) {
  return next => (action) => {
    if (action.type === types.UPDATE) {
      action.payload.sources = undefined;
    }
    return next(action);
  };
}

// Loop over sets in order to determine which feeds are uniq for each set
// ===========================================================================
export function updateUniq({ dispatch, getState }) {
  return next => (action) => {
    if (action.type === types.READ) {
      const feeds = calcFeedOccurance(action.payload);
      action.payload.forEach(set => setUniqFeeds(set, feeds));
    } else if (action.type === types.UPDATE_UNIQ) {
      const { sets } = getState();
      const feeds = calcFeedOccurance(sets.payload);
      action.payload = sets.payload.map(set => setUniqFeeds(set, feeds)).map(({ id, uniq_ids }) => ({ id, uniq_ids }));
    }
    return next(action);
  };
}
