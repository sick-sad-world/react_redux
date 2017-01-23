import { LOGOUT, GET_SOURCES, SET_SOURCE_STATE, ADD_SOURCE, EDIT_SOURCE, REMOVE_SOURCE } from '../actions/types';
import { concat, reject, uniqBy } from 'lodash';
import createReducer from '../helpers/reduserFactory'

export const sources = createReducer({
  GET_SOURCES: (state, action) => uniqBy(action.payload, 'id'),
  ADD_SOURCE: (state, action) => uniqBy(concat(state, action.payload), 'id'),
  DELETE: REMOVE_SOURCE
});