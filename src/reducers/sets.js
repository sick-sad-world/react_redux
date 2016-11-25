import { GET_SETS, ADD_SET, EDIT_SET, DELETE_SET } from '../actions/types';
import basicReducer from './reducerFactory'

export const sets = basicReducer({
  GET: GET_SETS,
  ADD: ADD_SET,
  EDIT: EDIT_SET,
  DELETE: DELETE_SET
});