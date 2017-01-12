import { GET_SETS, ADD_SET, EDIT_SET, DELETE_SET } from '../actions/types';
import basicReducer from '../helpers/reducer-factory';
import { pickUniqueSources, setUniqueSources } from '../helpers/functions';

export const sets = basicReducer({
  ADD: ADD_SET,
  DELETE: DELETE_SET,
  EDIT_SET: (state, action) => {
    delete action.payload.sources;
    return state.map((item) => (item.id === action.payload.id) ? Object.assign({}, item, action.payload) : item);
  },
  GET_SETS: (state, action) => {
    let feeds = pickUniqueSources(action.payload);
    action.payload.forEach((set) => setUniqueSources(set, feeds));
    return action.payload;
  }
});