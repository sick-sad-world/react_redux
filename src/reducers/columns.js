import { GET_COLUMNS, SET_COLUMNS_STATE, ADD_COLUMN, EDIT_COLUMN, DELETE_COLUMN } from '../actions/types';
import basicReducer from '../helpers/reducer-factory';

export const columns = basicReducer({
  STATE: SET_COLUMNS_STATE,
  GET: GET_COLUMNS,
  ADD: ADD_COLUMN,
  EDIT: EDIT_COLUMN,
  DELETE: DELETE_COLUMN,
});