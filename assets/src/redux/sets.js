import { GET_SETS, ADD_SET, EDIT_SET, REMOVE_SET, SET_SET_STATE, UPDATE_UNIQ } from '../helpers/types';
import createReducer, { mergeArrayById } from '../helpers/reducer-factory';
import createAction from '../helpers/action-factory';

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

export const defaultSet = {
  id: 0,
  order: null,
  name: '',
  source_ids: []
};

export default createReducer({
  ADD: ADD_SET,
  REMOVE: REMOVE_SET,
  STATE: SET_SET_STATE,
  [EDIT_SET]: (state, action) => {
    action.sources = undefined;
    return mergeArrayById(state, action);
  },
  [GET_SETS]: (state, action) => {
    let feeds = calcFeedOccurance(action);
    action.forEach((set) => setUniqFeeds(set, feeds));
    return action;
  },
  [UPDATE_UNIQ]: (state, action) => mergeArrayById(state, action),
});

export const setSetsState = (state) => ({
  type: SET_SET_STATE,
  state
});

export const getSets = createAction({
  type: GET_SETS,
  state_type: SET_SET_STATE,
  url: 'sets',
  pendingMessage: 'Reading set data...',
  successMessage: 'Sourceset data has been read.'
});

export const createSet = createAction({
  type: ADD_SET,
  state_type: SET_SET_STATE,
  url: 'add_set',
  pendingMessage: 'Creating new set...',
  successMessage: 'Set succesfully created.'
});

export const editSet = createAction({
  type: EDIT_SET,
  state_type: SET_SET_STATE,
  url: 'set',
  pendingMessage: 'Updating set data...',
  successMessage: 'Set data has been updated.'
});

export const deleteSet = createAction({
  type: REMOVE_SET,
  state_type: SET_SET_STATE,
  url: 'remove_set',
  pendingMessage: 'Deleting set...',
  successMessage: 'Set was deleted.'
});

export const updateUniq = (id, data) => (dispatch) => dispatch({
  type: UPDATE_UNIQ,
  payload: {id, uniq_ids: data}
})