import createReducer, { mergeArrayById } from 'common/reducer-factory';
import types from './types';

export default createReducer({
  ...types,
  [types.UPDATE_UNIQ]: (state, action) => state.map((set, i) => ({ ...set, uniq_ids: action[i].uniq_ids })),
  [types.ADD_FEED]: (state, action) => mergeArrayById(state, action, true),
  [types.REMOVE_FEED]: (state, action) => mergeArrayById(state, action, true)
});
