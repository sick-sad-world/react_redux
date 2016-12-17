import { GET_SETS, ADD_SET, EDIT_SET, DELETE_SET } from '../actions/types';
import basicReducer from './reducerFactory'

export const sets = basicReducer({
  ADD: ADD_SET,
  DELETE: DELETE_SET,
  EDIT_SET: function(state, action) {
    return state.map((item) => {
      if (item.id === action.payload.id) {
        delete action.payload.sources;
        return Object.assign({}, item, action.payload)
      } else {
        return item;
      }
    });
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
    return action.payload;
  }
});