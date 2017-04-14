import { has } from 'lodash';
import types from '../types';

// Create hash of all Sources [id] where value is a number of occurances
// ===========================================================================
export const calcFeedOccurance = (sets) => {
  const feeds = {};
  sets.forEach((set) => {
    set.source_ids.forEach((source) => {
      if (has(feeds, source)) {
        feeds[source] += 1;
      } else {
        feeds[source] = 1;
      }
    });
  });
  return feeds;
};

// Loop over Set [source_ids] and push uniqe ones to [uniq_ids]
// ===========================================================================
export const setUniqFeeds = (set, feeds) => {
  set.uniq_ids = [];
  set.source_ids.forEach((source) => {
    if (feeds[source] === 1) {
      set.uniq_ids.push(source);
    }
  });
  return set;
};

export default ({ dispatch, getState }) => next => (action) => {
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
