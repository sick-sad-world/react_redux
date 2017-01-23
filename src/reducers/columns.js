import { GET_COLUMNS, ADD_COLUMN, EDIT_COLUMN, REMOVE_COLUMN } from '../actions/types';
import createReducer from '../helpers/reduserFactory';

export const columns = createReducer({
  GET: GET_COLUMNS,
  ADD: ADD_COLUMN,
  EDIT: EDIT_COLUMN,
  DELETE: REMOVE_COLUMN,
});