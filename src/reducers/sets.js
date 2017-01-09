import { GET_SETS, SET_SETS_STATE, ADD_SET, EDIT_SET, DELETE_SET } from '../actions/types';
import basicReducer from '../helpers/reducer-factory'

export const sets = basicReducer({
  STATE: SET_SETS_STATE,
  ADD: ADD_SET,
  DELETE: DELETE_SET,
  EDIT_SET: function(state, action) {
    return {
      data: state.map((item) => {
        if (item.id === action.payload.id) {
          delete action.payload.sources;
          return Object.assign({}, item, action.payload)
        } else {
          return item;
        }
      }),
      state: state.state
    };
  },
  GET_SETS: function(state, action) {
    let feeds = {};
    action.payload.forEach((set) => {
      set.source_ids.forEach((source) => {
        if (feeds.hasOwnProperty(source)) {
          ++feeds[source]
        } else {
          feeds[source] = 1;
        }
      });
    });
    action.payload.forEach((set) => {
      set.uniq_ids = [];
      set.source_ids.forEach((source) => {
        if (feeds[source] === 1) {
          set.uniq_ids.push(source);
        }
      });
    });
    return {
      data: action.payload,
      state: state.state
    };
  }
});