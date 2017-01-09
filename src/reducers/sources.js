import { LOGOUT, GET_SOURCES, SET_SOURCES_STATE, ADD_SOURCE, EDIT_SOURCE, DELETE_SOURCE } from '../actions/types';
import { concat, reject, uniqBy } from 'lodash';
import { defaultCountable } from '../helpers/defaults';

export function sources (state = {}, action) {
  switch (action.type) {
    case LOGOUT:
      return {};
    case SET_SOURCES_STATE:
      return {
        data: state.data,
        state: action.state
      };
    case GET_SOURCES:
      return {
        data: uniqBy(action.payload, 'id'),
        state: state.state
      };
    case ADD_SOURCE:
      return {
        data: uniqBy(concat(state, action.payload), 'id'),
        state: state.state
      };
    case DELETE_SOURCE:
      return {
        data: reject(state, {id: action.payload.id}),
        state: state.state
      };
    default:
      return state;
  }
}