import { GET_COLUMNS, ADD_COLUMN, EDIT_COLUMN, DELETE_COLUMN } from '../actions/types';
import basicReducer from './reducerFactory'

export const columns = basicReducer({
  GET: GET_COLUMNS,
  ADD: ADD_COLUMN,
  EDIT: EDIT_COLUMN,
  DELETE: DELETE_COLUMN,
});