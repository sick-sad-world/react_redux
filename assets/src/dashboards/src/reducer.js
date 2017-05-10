import createReducer from 'common/reducer-factory';
import types from './types';
import { types as columns } from 'src/columns';
import { updateArrayWithValue } from 'functions';


export default createReducer({
  ...types,
  [columns.READ]: (state, action) => [{
    ...state[0],
    column_ids: action.map(({ id }) => id)
  }],
  [columns.CREATE]: (state, action) => [{
    ...state[0],
    column_ids: updateArrayWithValue(state[0].column_ids, action.id)
  }],
  [columns.CREATE]: (state, action) => [{
    ...state[0],
    column_ids: updateArrayWithValue(state[0].column_ids, action.id)
  }]
});
