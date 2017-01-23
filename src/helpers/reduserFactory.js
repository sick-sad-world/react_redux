import { LOGOUT } from '../actions/types';
import { reject, concat } from 'lodash';

export default function createReducer (actions) {
  return function (state = [], action) {
    switch (action.type) {
      case LOGOUT:
        return [];
      case actions.GET:
        return action.payload;
      case actions.ADD:
        return concat(state, action.payload);
      case actions.EDIT:
        return state.map((item) => (item.id === action.id) ? Object.assign({}, item, action.payload) : item);
      case actions.DELETE:
        return reject(state, {id: action.id});
      default:
        if (actions.hasOwnProperty(action.type) && typeof actions[action.type] === 'function') {
          return actions[action.type](state, action);
        } else {
          return state;
        }
    }
  }
}