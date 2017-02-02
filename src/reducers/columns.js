import { GET_COLUMNS, ADD_COLUMN, EDIT_COLUMN, REMOVE_COLUMN, SET_COLUMN_STATE } from '../actions/types';
import createReducer from '../helpers/reducerFactory';

export default createReducer({
  GET: GET_COLUMNS,
  ADD: ADD_COLUMN,
  EDIT: EDIT_COLUMN,
  DELETE: REMOVE_COLUMN,
  STATE: SET_COLUMN_STATE
});