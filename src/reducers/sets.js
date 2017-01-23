import { GET_SETS, ADD_SET, EDIT_SET, REMOVE_SET } from '../actions/types';
import createReducer from '../helpers/reduserFactory';
import { pickUniqueSources, setUniqueSources } from '../helpers/functions';

export const sets = createReducer({
  ADD: ADD_SET,
  DELETE: REMOVE_SET,
  EDIT_SET: (state, action) => {
    delete action.payload.sources;
    return state.map((item) => (item.id === action.id) ? Object.assign({}, item, action.payload) : item);
  },
  GET_SETS: (state, action) => {
    let feeds = pickUniqueSources(action.payload);
    action.payload.forEach((set) => setUniqueSources(set, feeds));
    return action.payload;
  }
});