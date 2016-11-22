import { GET_SOURCESETS, ADD_SOURCESET, EDIT_SOURCESET, DELETE_SOURCESET } from '../actions/types';
import basicReducer from './reducerFactory'

export let sourcesets = basicReducer({
  GET: GET_SOURCESETS,
  ADD: ADD_SOURCESET,
  EDIT: EDIT_SOURCESET,
  DELETE: DELETE_SOURCESET
});