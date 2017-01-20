import { GET_COLUMNS, ADD_COLUMN, EDIT_COLUMN, REMOVE_COLUMN } from '../actions/types';
import basicReducer from '../helpers/reducer-factory';

export const columns = basicReducer({
  GET: GET_COLUMNS,
  ADD: ADD_COLUMN,
  EDIT: EDIT_COLUMN,
  DELETE: REMOVE_COLUMN,
});