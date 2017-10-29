import createReducer from 'common/reducer-factory';
import types from './types';
import { types as columns } from 'src/columns';
import { updateArrayWithValue } from 'functions';

function updateDashboardContents(state, action) {
  const contents = [...state];
  const index = contents.indexOf(action.id);
  const inArr = index > -1;
  const isOpen = !!action.open;
  if (isOpen && !inArr) {
    contents.splice(action.order || 0, 0, action.id);
  } else if (!isOpen && inArr) {
    contents.splice(index, 1);
  }
  return contents;
}

export default createReducer({
  ...types,
  [columns.READ]: (state, action) => [{
    ...state[0],
    column_ids: action.filter(({ open }) => open).map(({ id }) => id)
  }],
  [columns.CREATE]: (state, action) => [{
    ...state[0],
    column_ids: updateArrayWithValue(state[0].column_ids, action.id)
  }],
  [columns.UPDATE]: (state, action) => [{
      ...state[0],
      column_ids: updateDashboardContents(state[0].column_ids, action)
    }],
  [columns.DELETE]: (state, action) => {
    if (state[0].column_ids.indexOf(action.id) === -1) return state;
    return [{
      ...state[0],
      column_ids: updateArrayWithValue(state[0].column_ids, action.id)
    }];
  }
});
