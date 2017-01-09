import { LOGOUT } from '../actions/types';
import { reject, concat } from 'lodash';
import { defaultCountable } from '../helpers/defaults';

export default function basicReducer (actions) {
  return function (state = {}, action) {
    switch (action.type) {
      case LOGOUT:
        return defaultCountable;
      case actions.STATE:
        return {
          data: state.data,
          state: action.state
        }
      case actions.GET:
        return {
          data: action.payload,
          state: state.state
        };
      case actions.ADD:
        return {
          data: concat(state.data, action.payload),
          state: state.state
        };
      case actions.EDIT:
        return {
          data: state.data.map((item) => (item.id === action.payload.id) ? Object.assign({}, item, action.payload) : item),
          state: state.state
        };
      case actions.DELETE:
        return {
          data: reject(state, {id: action.payload.id}),
          state: state.state
        };
      default:
        if (actions.hasOwnProperty(action.type) && typeof actions[action.type] === 'function') {
          return actions[action.type](state, action);
        } else {
          return state;
        }
    }
  }
}