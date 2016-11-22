import { LOGIN, LOGOUT, GET_SOURCES, ADD_SOURCE, EDIT_SOURCE, DELETE_SOURCE } from '../actions/types';
import _ from 'lodash';

export function sources (state = [], action) {
  switch (action.type) {
    case LOGOUT:
    case LOGIN:
      return [];
    case GET_SOURCES:
      return action.payload;
    case ADD_SOURCE:
      return _.concat(state, action.payload);
    case DELETE_SOURCE:
      return _.reject(state, {id: action.payload.id});
    default:
      return state;
  }
}