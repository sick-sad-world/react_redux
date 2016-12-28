import { LOGIN, LOGOUT, GET_SOURCES, ADD_SOURCE, EDIT_SOURCE, DELETE_SOURCE } from '../actions/types';
import { concat, reject, uniqBy } from 'lodash';

export function sources (state = [], action) {
  switch (action.type) {
    case LOGOUT:
    case LOGIN:
      return [];
    case GET_SOURCES:
      return uniqBy(action.payload, 'id');
    case ADD_SOURCE:
      return uniqBy(concat(state, action.payload), 'id');
    case DELETE_SOURCE:
      return reject(state, {id: action.payload.id});
    default:
      return state;
  }
}