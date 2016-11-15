import { LOGIN, LOGOUT, GET_ALERTS, ADD_ALERT, EDIT_ALERT, DELETE_ALERT } from "../actions/types";
import _ from "lodash";

export function alerts (state = {}, action) {
  switch (action.type) {
    case LOGOUT:
    case LOGIN:
      return {};
    case GET_ALERTS:
      return _.assign({}, state, action.payload);
    case ADD_ALERT:
      return {...state, [action.id]: action.payload};
    case EDIT_ALERT:
      return {...state, [action.id]: _.assign({}, state[action.id], action.payload)};
    case DELETE_ALERT:
      return _.omit(state, action.id);
    default:
      return state;
  }
}