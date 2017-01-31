import { GET_SOURCES, ADD_SOURCE, REMOVE_SOURCE } from '../actions/types';
import createReducer from '../helpers/reduserFactory';

export const sources = createReducer({
  GET: GET_SOURCES,
  ADD: ADD_SOURCE,
  DELETE: REMOVE_SOURCE
});