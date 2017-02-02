import { GET_SETS, ADD_SET, EDIT_SET, REMOVE_SET, SET_SET_STATE } from '../actions/types';
import createReducer from '../helpers/reducerFactory';

// Create hash of all Sources [id] where value is a number of occurances
// ===========================================================================
export const calcFeedOccurance = (sets) => {
  let feeds = {};
  sets.forEach((set) => {
    set.source_ids.forEach((source) => {
      if (feeds.hasOwnProperty(source)) {
        ++feeds[source]
      } else {
        feeds[source] = 1;
      }
    });
  });
  return feeds;
}

// Loop over Set [source_ids] and push uniqe ones to [uniq_ids]
// ===========================================================================
export const setUniqFeeds = (set, feeds) => {
  set.uniq_ids = [];
  set.source_ids.forEach((source) => {
    if (feeds[source] === 1) {
      set.uniq_ids.push(source);
    }
  });
}

export default createReducer({
  ADD: ADD_SET,
  DELETE: REMOVE_SET,
  STATE: SET_SET_STATE,
  EDIT_SET: (state, action) => state.map((item) => (item.id === action.id) ? {...item, ...action, sources: undefined} : {...item}),
  GET_SETS: (state, action) => {
    let feeds = calcFeedOccurance(action);
    action.forEach((set) => setUniqFeeds(set, feeds));
    return action;
  }
});