import createReducer from 'common/reducer-factory';
import types from './types';

export default createReducer({
  ...types,
  [types.UPDATE_UNIQ]: (state, action) => state.map((set, i) => ({ ...set, uniq_ids: action[i].uniq_ids }))
});
