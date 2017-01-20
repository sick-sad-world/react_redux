import { LOGOUT, GET_SOURCES, SET_SOURCE_STATE, ADD_SOURCE, EDIT_SOURCE, REMOVE_SOURCE } from '../actions/types';
import { concat, reject, uniqBy } from 'lodash';
import basicReducer from '../helpers/reducer-factory'

export const sources = basicReducer({
  GET_SOURCES: (state, action) => uniqBy(action.payload, 'id'),
  ADD_SOURCE: (state, action) => uniqBy(concat(state, action.payload), 'id'),
  DELETE: REMOVE_SOURCE
});