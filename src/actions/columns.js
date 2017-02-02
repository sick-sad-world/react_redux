import { GET_COLUMNS, ADD_COLUMN, EDIT_COLUMN, DELETE_COLUMN, SET_COLUMN_STATE } from './types';
import createAction from './factory';

export const setColumnsState = (state) => ({
  type: SET_COLUMN_STATE,
  state
});

export const getColumns = createAction({
  type: GET_COLUMNS,
  state_type: SET_COLUMN_STATE,
  url: 'columns',
  pendingMessage: 'Reading column data...',
  successMessage: 'Column data has been read.'
});