import { GET_COLUMNS, ADD_COLUMN, EDIT_COLUMN, REMOVE_COLUMN, SET_COLUMN_STATE } from '../helpers/types';
import createReducer from '../helpers/reducerFactory';
import createAction from '../helpers/actionFactory';

export default createReducer({
  GET: GET_COLUMNS,
  ADD: ADD_COLUMN,
  EDIT: EDIT_COLUMN,
  REMOVE: REMOVE_COLUMN,
  STATE: SET_COLUMN_STATE
});

export const getColumns = createAction({
  type: GET_COLUMNS,
  state_type: SET_COLUMN_STATE,
  url: 'columns',
  pendingMessage: 'Reading column data...',
  successMessage: 'Column data has been read.'
});

export const createColumn = createAction({
  type: ADD_COLUMN,
  state_type: SET_COLUMN_STATE,
  url: 'add_column',
  pendingMessage: 'Creating new column...',
  successMessage: 'Column succesfully created.'
});

export const editColumn = createAction({
  type: EDIT_COLUMN,
  state_type: SET_COLUMN_STATE,
  url: 'column',
  pendingMessage: 'Updating column data...',
  successMessage: 'Column data has been updated.'
});

export const deleteColumn = createAction({
  type: REMOVE_COLUMN,
  state_type: SET_COLUMN_STATE,
  url: 'remove_column',
  pendingMessage: 'Deleting column...',
  successMessage: 'Column was deleted.'
});