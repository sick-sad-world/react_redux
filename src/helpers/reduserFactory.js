import { LOGOUT, LOGIN } from '../actions/types';
import { reject, uniqBy } from 'lodash';
import { mergeArrayById } from './functions';

export default function createReducer (actions) {
  return function (state = [], action) {
    switch (action.type) {
      case LOGOUT:
      case LOGIN:
        return [];
      case actions.GET:
        return uniqBy(action.payload, 'id');
      case actions.ADD:
        return mergeArrayById(state, action.payload);
      case actions.EDIT:
        return mergeArrayById(state, action.payload);
      case actions.DELETE:
        return reject(state, {id: action.payload.id});
      default:
        if (actions.hasOwnProperty(action.type) && typeof actions[action.type] === 'function') {
          return actions[action.type](state, action);
        } else {
          return state;
        }
    }
  }
}