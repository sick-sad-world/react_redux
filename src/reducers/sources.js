import { GET_SOURCES, ADD_SOURCE, REMOVE_SOURCE, SET_SOURCE_STATE } from '../actions/types';
import createReducer from '../helpers/reducerFactory';

export default createReducer({
  GET: GET_SOURCES,
  ADD: ADD_SOURCE,
  DELETE: REMOVE_SOURCE,
  STATE: SET_SOURCE_STATE
});