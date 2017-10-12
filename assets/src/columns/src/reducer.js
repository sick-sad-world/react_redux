import createReducer from 'common/reducer-factory';
import types from './types';

export default createReducer({
  ...types,
  [types.UPD_VIS]: (state, { id, open }) => state.map((column) => ({
    ...column,
    open: (column.id === id) ? open : column.open
  }))
});
